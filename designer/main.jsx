import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GARMENTS,COLOURS,SIZES,FONTS,FACES,FACE_NAMES,STUDIO_RATES,MAX_ELEMENTS,MAX_ASSETS,defaultDocument,zoneFor,placementsFor,fitElement,estimateDesign,validateDocument,upgradeDocument,productFaces,productSizes,productMethods,productColours,documentForProduct} from './catalog.js';
import {DesignBoard} from './board.js';
import {loadDraft,saveDraft} from './draft.js';
import {prepareFile,studioRequest} from './uploads.js';
import './studio.css';
const money=cents=>`₹${(cents/100).toLocaleString('en-IN')}`;
const copy=value=>structuredClone(value);

function Studio(){
  const [document,setDocument]=useState(()=>{const id=new URLSearchParams(location.search).get('product');return GARMENTS.some(p=>p.id===id)?documentForProduct(id):defaultDocument();}),[assets,setAssets]=useState({}),[face,setFace]=useState('front'),[selectedId,setSelectedId]=useState(null);
  const [quantity,setQuantity]=useState(1),[quoteNotes,setQuoteNotes]=useState('');
  const [ready,setReady]=useState(false),[storageReady,setStorageReady]=useState(null),[rates,setRates]=useState(STUDIO_RATES),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('Loading your studio…'),[draftStatus,setDraftStatus]=useState(''),[review,setReview]=useState(null),[resetOpen,setResetOpen]=useState(false),[historyVersion,setHistoryVersion]=useState(0);
  const canvasRef=useRef(null),containerRef=useRef(null),boardRef=useRef(null),uploadRef=useRef(null),replaceRef=useRef(null),reviewRef=useRef(null),resetRef=useRef(null);
  const docRef=useRef(document),assetsRef=useRef(assets),history=useRef({past:[],future:[]}),selectedRef=useRef(null),faceRef=useRef(face),saveSequence=useRef(0);
  docRef.current=document;assetsRef.current=assets;selectedRef.current=selectedId;faceRef.current=face;
  const selected=document.elements.find(e=>e.id===selectedId),quote=estimateDesign(document,rates),product=GARMENTS.find(p=>p.id===document.productId);
  function commit(next){
    const previous=docRef.current,value=typeof next==='function'?next(previous):next;
    if(JSON.stringify(previous)===JSON.stringify(value))return;
    history.current.past.push(copy(previous));if(history.current.past.length>60)history.current.past.shift();history.current.future=[];
    docRef.current=value;setDocument(value);setDraftStatus('Saving draft…');setHistoryVersion(v=>v+1);setError('');setReview(null);
  }
  function choose(id){setSelectedId(id);const e=docRef.current.elements.find(e=>e.id===id);if(e)setFace(e.face);}
  function patch(id,updates){commit(d=>({...d,elements:d.elements.map(e=>{
    if(e.id!==id)return e;
    const next={...e,...updates};
    if(next.kind==='text'&&next.text.trim()&&(updates.text!==undefined||updates.font!==undefined)){
      const context=window.document.createElement('canvas').getContext('2d');context.font=`48px "${FONTS.find(f=>f.id===next.font)?.family||'Arial'}"`;
      const lines=next.text.split('\n'),width=Math.max(1,...lines.map(line=>context.measureText(line).width)),scale=e.height/(Math.max(1,e.text.split('\n').length)*56);next.width=Math.max(4,width*scale);next.height=Math.max(4,lines.length*56*scale);
    }
    return fitElement(next,zoneFor(d.productId,next.face));
  })}));}
  function undo(){const h=history.current;if(!h.past.length)return;h.future.push(copy(docRef.current));const next=h.past.pop();docRef.current=next;setDocument(next);setSelectedId(null);setHistoryVersion(v=>v+1);setReview(null);}
  function redo(){const h=history.current;if(!h.future.length)return;h.past.push(copy(docRef.current));const next=h.future.pop();docRef.current=next;setDocument(next);setSelectedId(null);setHistoryVersion(v=>v+1);setReview(null);}
  useEffect(()=>{
    let active=true;
    (async()=>{
      try{
        const designId=new URLSearchParams(location.search).get('id');
        if(designId){const saved=await studioRequest(`design&id=${encodeURIComponent(designId)}`);if(active){validateDocument(saved.document);const upgraded=upgradeDocument(saved.document);docRef.current=upgraded;setDocument(upgraded);setNotice('Saved design loaded. Changes create a new version.');}}
        else {const saved=await loadDraft(),requested=new URLSearchParams(location.search).get('product');if(active&&saved?.document&&(!requested||requested===saved.document.productId)){if(saved.document.elements?.length)validateDocument(saved.document);else if(!GARMENTS.some(g=>g.id===saved.document.productId))throw new Error('Invalid draft.');const upgraded=upgradeDocument(saved.document);docRef.current=upgraded;assetsRef.current=saved.assets||{};setDocument(upgraded);setAssets(saved.assets||{});setNotice('Your local draft has been restored.');}}
      }catch(e){if(active){setError(e.message);setNotice('Start a fresh design, or try reloading your saved design.');}}
      if(active)setReady(true);
    })();
    studioRequest('catalog').then(result=>{if(active){setStorageReady(result.storageReady);setRates(result.rates);}}).catch(()=>{if(active)setStorageReady(false);});
    try{const bag=JSON.parse(localStorage.getItem('capraCoolCart')||'[]');window.document.getElementById('studioBagCount').textContent=bag.reduce((n,i)=>n+(Number(i.qty)||0),0);}catch{}
    return()=>{active=false;};
  },[]);
  useEffect(()=>{
    if(!ready)return;
    const board=new DesignBoard(canvasRef.current,containerRef.current,(id,changes)=>patch(id,changes),id=>choose(id),message=>setError(message));boardRef.current=board;
    return()=>{boardRef.current=null;board.dispose();};
  },[ready]);
  useEffect(()=>{if(ready&&boardRef.current)boardRef.current.render(document,face,assets,selectedRef.current);},[ready,document,face,assets]);
  useEffect(()=>{boardRef.current?.select(selectedId);},[selectedId]);
  useEffect(()=>{
    if(!ready)return;
    const sequence=++saveSequence.current;
    setDraftStatus('Saving draft…');
    saveDraft({document,assets}).then(()=>{if(saveSequence.current===sequence)setDraftStatus('Draft saved on this device');}).catch(()=>setDraftStatus('Could not save locally. Keep this tab open.'));
  },[ready,document,assets]);
  useEffect(()=>{
    function keydown(event){
      if(['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)||window.document.querySelector('dialog[open]'))return;
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}
      else if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();redo();}
      else if((event.key==='Delete'||event.key==='Backspace')&&selectedRef.current){event.preventDefault();removeSelected();}
      else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)&&selectedRef.current){event.preventDefault();const e=docRef.current.elements.find(e=>e.id===selectedRef.current),step=event.shiftKey?10:1;patch(e.id,{x:e.x+(event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0),y:e.y+(event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0)});}
    }
    window.addEventListener('keydown',keydown);return()=>window.removeEventListener('keydown',keydown);
  },[]);
  useEffect(()=>{if(review&&!reviewRef.current.open)reviewRef.current.showModal();},[review]);
  useEffect(()=>{if(resetOpen&&!resetRef.current.open)resetRef.current.showModal();},[resetOpen]);
  function changeProduct(productId){const next=documentForProduct(productId),p=GARMENTS.find(p=>p.id===productId),faces=productFaces(p);commit(d=>({...next,elements:d.elements.map(e=>{const target=faces.includes(e.face)?e.face:'front';return fitElement({...e,face:target},zoneFor(productId,target));})}));setFace('front');setSelectedId(null);}
  function append(element){if(docRef.current.elements.length>=MAX_ELEMENTS){setError(`Use up to ${MAX_ELEMENTS} elements per garment.`);return;}commit(d=>({...d,elements:[...d.elements,element]}));setSelectedId(element.id);}
  async function upload(file,replace=false){
    setError('');try{
      if(Object.keys(assetsRef.current).length>=MAX_ASSETS&&!replace)throw new Error(`Use up to ${MAX_ASSETS} files per draft. Reset to start again.`);
      const asset=await prepareFile(file),zone=zoneFor(docRef.current.productId,faceRef.current);
      const width=zone.w*.65,height=width*asset.height/asset.width;
      setAssets(a=>({...a,[asset.id]:asset}));
      if(replace&&selectedRef.current)patch(selectedRef.current,{kind:'image',assetId:asset.id});
      else append(fitElement({id:crypto.randomUUID(),kind:'image',assetId:asset.id,face:faceRef.current,x:zone.x+zone.w/2,y:zone.y+zone.h*.3,width,height,angle:0},zone));
      setNotice(`${asset.name} added. Drag the corners to resize.`);
    }catch(e){setError(e.message);}
  }
  function addText(){const zone=zoneFor(document.productId,face);append(fitElement({id:crypto.randomUUID(),kind:'text',text:'YOUR TEXT',font:'sans',fill:/^#(?:f|e|c|9)/i.test(COLOURS.find(c=>c.id===document.colour).hex)?'#20231e':'#ffffff',face,x:zone.x+zone.w/2,y:zone.y+zone.h*.3,width:zone.w*.7,height:32,angle:0},zone));setNotice('Text added. Edit it in the tools panel.');}
  function removeSelected(){const id=selectedRef.current;commit(d=>({...d,elements:d.elements.filter(e=>e.id!==id)}));setSelectedId(null);}
  function duplicate(){if(!selected)return;const zone=zoneFor(document.productId,selected.face);append(fitElement({...selected,id:crypto.randomUUID(),x:selected.x+12,y:selected.y+12},zone));}
  function place(preset){if(!selected){setNotice('Upload artwork or add text, then choose a placement.');return;}const zone=zoneFor(document.productId,face),width=zone.w*preset.w;patch(selected.id,{face,x:zone.x+zone.w*preset.x,y:zone.y+zone.h*preset.y,width,height:width*selected.height/selected.width});}
  async function createReview(){
    try{
      validateDocument(document);setBusy(true);setError('');
      const board=boardRef.current,views=[];
      for(const view of productFaces(product)){if(!await board.render(document,view,assets,null))throw new Error('The preview could not finish loading. Please try again.');views.push(await board.preview());}
      const canvas=window.document.createElement('canvas');canvas.width=views.length===1?600:1200;canvas.height=Math.ceil(views.length/2)*840;const ctx=canvas.getContext('2d');ctx.fillStyle='#eeede7';ctx.fillRect(0,0,canvas.width,canvas.height);
      for(let i=0;i<views.length;i++){const x=i%2*600,y=Math.floor(i/2)*840,image=new Image();image.src=views[i];await image.decode();ctx.drawImage(image,x,y+30,600,800);ctx.fillStyle='#394333';ctx.font='16px Arial';ctx.fillText(FACE_NAMES[FACES[i]].toUpperCase(),x+24,y+25);}
      setReview({document:copy(document),preview:canvas.toDataURL('image/webp',.92),quote});
      await board.render(document,face,assets,selectedId);
    }catch(e){setError(e.message);}finally{setBusy(false);}
  }
  async function addToCart(){
    if(!review||busy)return;setBusy(true);setError('');
    try{
      const mapping={},nextAssets={...assets};
      for(const id of [...new Set(review.document.elements.filter(e=>e.kind==='image').map(e=>e.assetId))]){
        const asset=assets[id];
        if(!asset){mapping[id]=id;continue;}
        if(asset.remoteId){mapping[id]=asset.remoteId;continue;}
        const saved=await studioRequest('upload',{name:asset.name,mime:asset.mime,data:asset.dataUrl.split(',')[1]});mapping[id]=saved.id;nextAssets[id]={...asset,remoteId:saved.id};
      }
      setAssets(nextAssets);
      const previewMime=review.preview.startsWith('data:image/webp;')?'image/webp':'image/png';
      const preview=await studioRequest('upload',{name:`garment-preview.${previewMime==='image/webp'?'webp':'png'}`,mime:previewMime,data:review.preview.split(',')[1],preview:true});
      const saved=await studioRequest('save',{document:{...review.document,elements:review.document.elements.map(e=>e.kind==='image'?{...e,assetId:mapping[e.assetId]}:e)},previewId:preview.id});
      if(!saved.quote.complete)throw new Error('Custom pricing is unavailable. Please try again later.');
      const bag=JSON.parse(localStorage.getItem('capraCoolCart')||'[]');
      if(!Array.isArray(bag)||bag.length>=30)throw new Error('Your bag is full. Remove an item and try again.');
      const garment=GARMENTS.find(g=>g.id===saved.document.productId),colour=COLOURS.find(c=>c.id===saved.document.colour);
      bag.push({id:`custom:${saved.id}`,designId:saved.id,size:saved.document.size,qty:1,custom:{productId:garment.id,colour:colour.id,price:saved.quote.totalCents/100,previewId:saved.previewId,areas:saved.quote.areas,method:saved.document.method}});
      localStorage.setItem('capraCoolCart',JSON.stringify(bag));location.assign('index.html?bag=1');
    }catch(e){setError(e.message);setNotice('Your draft is still here. You can retry saving.');}finally{setBusy(false);}
  }
  function downloadReview(kind){
    const data=kind==='preview'?review.preview:URL.createObjectURL(new Blob([JSON.stringify({product:product.name,quantity,notes:quoteNotes,document:review.document,assets,preview:review.preview},null,2)],{type:'application/json'}));
    const a=window.document.createElement('a');a.href=data;a.download=kind==='preview'?'capra-cool-design-preview.webp':'capra-cool-design-brief.json';a.click();if(kind!=='preview')setTimeout(()=>URL.revokeObjectURL(data),1000);
  }
  const quoteMail=review?'mailto:care@capracool.com?subject='+encodeURIComponent('Custom quote: '+product.name)+'&body='+encodeURIComponent('Please quote for '+product.name+'\nQuantity: '+quantity+'\nColour: '+COLOURS.find(c=>c.id===document.colour).name+'\nSize: '+document.size+'\nMethod: '+document.method+'\nAreas: '+quote.areas.map(f=>FACE_NAMES[f]).join(', ')+'\nNotes: '+quoteNotes+'\n\nI will attach my downloaded design preview, design brief and original artwork.'):'';
  const availableFaces=productFaces(product),needsQuote=product.quoteOnly||product.inStock===false;
  const manualQuote=needsQuote||storageReady===false;
  const priceLabel=needsQuote?'Request a quote':money(quote.totalCents);
  const areaCount=quote.areas.length;
  return <main id="studio" className="design-studio">
    <div className="studio-intro"><div><p className="studio-eyebrow">CAPRA COOL / CUSTOM STUDIO</p><h1>Make it yours.</h1><p>Your artwork. Clothing, caps &amp; gifts.</p><a className="studio-link" href="design-tips.html">Design tips &amp; product range ↗</a></div><a href="index.html">Back to the collection ↗</a></div>
    <div className="studio-toolbar" aria-label="Design history"><span>{product.name} <i>·</i> {document.elements.length} elements</span><div><button onClick={undo} disabled={busy||!history.current.past.length} aria-label="Undo">↶ Undo</button><button onClick={redo} disabled={busy||!history.current.future.length} aria-label="Redo">↷ Redo</button><button onClick={()=>setResetOpen(true)} disabled={busy}>Reset</button></div></div>
    <div className="studio-layout" aria-busy={busy} inert={busy}>
      <aside className="studio-panel studio-tools" aria-label="Product and design tools"><h2>01 / Your product</h2><label>Choose your product<select value={document.productId} onChange={e=>changeProduct(e.target.value)} disabled={busy}>{['Studio basics','Brand','Campus','Gifts'].map(group=><optgroup key={group} label={group}>{GARMENTS.filter(p=>(p.group||'Studio basics')===group).map(p=><option key={p.id} value={p.id}>{p.name} · {p.quoteOnly?'Request a quote':money(p.baseCents)}{p.inStock===false?' · Out of stock':''}</option>)}</optgroup>)}</select></label><p className="studio-note">{product.spec||[product.gsm,product.gsm?'GSM':null,product.group?'Original collection garment':'Unisex'].filter(Boolean).join(' · ')} · {availableFaces.map(f=>FACE_NAMES[f]).join(', ')}</p>{product.previewNote?<p className="studio-note">{product.previewNote}</p>:null}{product.inStock===false?<p className="studio-error" role="status">Out of stock. You can design and request availability; checkout is disabled.</p>:null}
                <h2>02 / Your design</h2><div className="upload-zone" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(!busy)upload(e.dataTransfer.files[0]);}}><span aria-hidden="true">↑</span><button onClick={()=>uploadRef.current.click()} disabled={busy}>Upload logo or artwork</button><p>Drop a file here<br/>PNG, JPG, SVG, WEBP · Up to 2 MB</p><input ref={uploadRef} type="file" aria-label="Upload artwork file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={e=>{upload(e.target.files[0]);e.target.value='';}} hidden/></div><p className="studio-note">Prefer Canva? <a href="https://www.canva.com/templates/" target="_blank" rel="noopener noreferrer">Create artwork in Canva ↗</a>, export a PNG, then upload it here.</p><button className="studio-outline" onClick={addText} disabled={busy}>T<span aria-hidden="true">＋</span> Add custom text</button>
        {selected?<div className="selected-tools"><h3>Selected {selected.kind==='text'?'text':'artwork'}</h3>{selected.kind==='text'?<><label>Your text<textarea value={selected.text} maxLength={120} rows={2} onChange={e=>patch(selected.id,{text:e.target.value})}/></label><div className="studio-two"><label>Font<select value={selected.font} onChange={e=>patch(selected.id,{font:e.target.value})}>{FONTS.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label><label>Text colour<input type="color" value={selected.fill} onChange={e=>patch(selected.id,{fill:e.target.value})}/></label></div></>:<><button className="studio-link" onClick={()=>replaceRef.current.click()}>Replace artwork ↗</button><input ref={replaceRef} type="file" accept=".png,.jpg,.jpeg,.svg,.webp" aria-label="Replace artwork file" hidden onChange={e=>{upload(e.target.files[0],true);e.target.value='';}}/></>}
          <label>Design width <span>{Math.round(selected.width)} px</span><input aria-label="Design width" type="range" min="4" max={zoneFor(document.productId,selected.face).w} step="1" value={Math.round(selected.width)} onChange={e=>{const width=Number(e.target.value);patch(selected.id,{width,height:width*selected.height/selected.width});}}/></label><label>Rotation <span>{Math.round(selected.angle)}°</span><input aria-label="Design rotation" type="range" min="-180" max="180" value={Math.round(selected.angle)} onChange={e=>patch(selected.id,{angle:Number(e.target.value)})}/></label><div className="studio-nudge" aria-label="Move design"><button aria-label="Move left" onClick={()=>patch(selected.id,{x:selected.x-5})}>←</button><button aria-label="Move up" onClick={()=>patch(selected.id,{y:selected.y-5})}>↑</button><button aria-label="Move down" onClick={()=>patch(selected.id,{y:selected.y+5})}>↓</button><button aria-label="Move right" onClick={()=>patch(selected.id,{x:selected.x+5})}>→</button></div><div className="studio-two"><button className="studio-outline" onClick={duplicate}>Duplicate</button><button className="studio-outline" onClick={removeSelected}>Delete</button></div></div>:<p className="studio-note">Select an element on the garment or in Layers to edit it.</p>}
        <div className="studio-layers"><h3>Layers <span>{document.elements.length}/{MAX_ELEMENTS}</span></h3>{document.elements.length?document.elements.map((e,index)=><button key={e.id} className={selectedId===e.id?'selected':''} onClick={()=>choose(e.id)} aria-pressed={selectedId===e.id}><span>{e.kind==='text'?e.text||'Empty text':assets[e.assetId]?.name||`Artwork ${index+1}`}</span><small>{FACE_NAMES[e.face]}</small></button>):<p className="studio-note">Your design starts with one idea.</p>}</div>
      </aside>
      <section className="studio-preview" aria-label="Interactive garment preview"><div className="studio-preview-caption"><span>{COLOURS.find(c=>c.id===document.colour).name} / {FACE_NAMES[face]}</span><span>{face.includes("Sleeve")?"SIDE ANGLE":"LIVE PREVIEW"}</span></div><div ref={containerRef} className="studio-board-container"><canvas ref={canvasRef} aria-label="Clothing design canvas. Select a layer and use the move, resize and rotation tools to edit."/></div><div className="studio-views" role="group" aria-label="Garment views">{availableFaces.map(f=><button key={f} aria-label={FACE_NAMES[f]} aria-pressed={face===f} onClick={()=>{setFace(f);setSelectedId(null);}} disabled={busy}>{FACE_NAMES[f]}{document.elements.some(e=>e.face===f)?<span aria-hidden="true"> ●</span>:null}</button>)}</div><p className="studio-note">Drag to move. Use corner handles to resize and the top handle to rotate.<br/>The dashed line marks your printable area. Mockup placement is a visual guide.</p><p className="studio-draft-status" role="status">{draftStatus||notice}</p></section>
      <aside className="studio-panel studio-options" aria-label="Colour, size, placement and price"><h2>03 / The details</h2><fieldset><legend>Garment colour · {COLOURS.find(c=>c.id===document.colour).name}</legend><div className="studio-swatches">{productColours(product).map(c=><button key={c.id} style={{'--swatch':c.hex}} aria-label={c.name} aria-pressed={document.colour===c.id} onClick={()=>commit(d=>({...d,colour:c.id}))} disabled={busy}/>)}</div></fieldset><fieldset><legend>Size</legend><div className="studio-sizes">{productSizes(product).map(s=><button key={s} aria-pressed={document.size===s} onClick={()=>commit(d=>({...d,size:s}))} disabled={busy}>{s}</button>)}</div></fieldset><label>Decoration method<select value={document.method} onChange={e=>commit(d=>({...d,method:e.target.value}))} disabled={busy}>{productMethods(product).map(m=><option key={m} value={m}>{m==='print'?'Print':'Embroidery'}</option>)}</select></label><p className="studio-note">{document.method==='embroidery'?'Stitch texture, fine details and thread colours are confirmed during artwork review.':'Print colours and dimensions are confirmed from your original artwork.'}</p><h3>Placement · {FACE_NAMES[face]}</h3><div className="studio-placements">{placementsFor(face,document.productId).map(p=><button key={p.id} onClick={()=>place(p)} disabled={busy||!selected}>{p.name} ↗</button>)}</div><p className="studio-note">{availableFaces.includes('leftSleeve')?'Switch to a sleeve view to add a sleeve design.':'Only the shown surfaces are available on this product.'}</p><div className="studio-pricing"><h3>Your estimate</h3><dl>{(needsQuote?[]:quote.lines).map((line,i)=><div key={i}><dt>{line.label}</dt><dd>{money(line.cents)}</dd></div>)}</dl><div className="studio-estimate"><span>{needsQuote?'Price confirmed after review':quote.complete?'Estimated total':'Product subtotal'}</span><strong>{priceLabel}</strong></div><p className="studio-note">{needsQuote?'Download your design and request pricing. No payment is taken.':quote.complete?`${money(document.method==='embroidery'?rates.embroideryAreaCents:rates.printAreaCents)} per decorated area. Front, back and each sleeve count separately.`:'Decoration pricing is awaiting confirmation.'} Shipping calculated in your bag.</p></div><a className="studio-link" href="policies.html#custom">Custom-order &amp; sizing details ↗</a></aside>
    </div>
    {error?<p className="studio-error" role="alert">{error}</p>:null}
    {storageReady===false?<p className="studio-cloud-note">Cloud saving is temporarily unavailable. You can keep designing; your draft saves on this device.</p>:null}
    <div className="studio-purchase"><div><strong>{priceLabel}</strong><span>{areaCount} decorated area{areaCount===1?'':'s'} · {document.size} · {COLOURS.find(c=>c.id===document.colour).name}</span></div><button className="studio-primary" onClick={createReview} disabled={busy||!ready||!document.elements.length}>{busy?'Preparing your design…':needsQuote?'Request a quote':'Review your design'} <span aria-hidden="true">↗</span></button></div>
    <dialog ref={reviewRef} className="studio-review" onCancel={()=>setReview(null)} onClose={()=>setReview(null)}><button className="studio-dialog-close" aria-label="Close design review" onClick={()=>{reviewRef.current.close();setReview(null);}} disabled={busy}>×</button>{review?<><p className="studio-eyebrow">YOUR DESIGN / FINAL CHECK</p><h2>Ready to make it yours?</h2><img src={review.preview} alt={'Your custom product preview: '+availableFaces.map(f=>FACE_NAMES[f]).join(', ')}/><p>{product.name} · {COLOURS.find(c=>c.id===review.document.colour).name} · {review.document.size} · {review.document.method==='print'?'Print':'Embroidery'} · {review.quote.areas.map(f=>FACE_NAMES[f]).join(', ')}</p><p className="studio-review-price">{priceLabel} <small>{needsQuote?'Price, materials and delivery confirmed by our team':'Shipping calculated in your bag'}</small></p><p className="studio-note">Your original artwork and placements are included in the downloaded design brief. Final print or stitch details are checked before production.</p>{error?<p className="studio-error" role="alert">{error}</p>:null}<div className="studio-review-downloads"><button className="studio-outline" onClick={()=>downloadReview('preview')}>Download preview</button><button className="studio-outline" onClick={()=>downloadReview('brief')}>Download design brief</button></div>{manualQuote?<div className="studio-quote"><label>Quantity<input aria-label="Quote quantity" type="number" min="1" max="5000" value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(5000,Number(e.target.value)||1)))}/></label><label>Notes<textarea aria-label="Quote notes" value={quoteNotes} maxLength={800} onChange={e=>setQuoteNotes(e.target.value)} placeholder="Event, deadline or special requirements"/></label><p className="studio-note">Download your preview and design brief above. Attach them and your original artwork to the email draft. Nothing is sent automatically.</p><a className="studio-primary" href={quoteMail}>Prepare quote email ↗</a></div>:<button className="studio-primary" onClick={addToCart} disabled={busy||!review.quote.complete||storageReady===false}>{busy?'Saving artwork & design…':'Add Custom Design to Cart'} ↗</button>}{storageReady===false&&!needsQuote?<p className="studio-note">Online checkout is temporarily unavailable for custom designs. Your estimate and local draft are preserved; request a quote above.</p>:null}</>:null}</dialog>
    <dialog ref={resetRef} className="studio-reset" onCancel={()=>setResetOpen(false)} onClose={()=>setResetOpen(false)}><h2>Start again?</h2><p>This clears artwork on all sides. You can undo the reset.</p><div className="studio-two"><button className="studio-outline" onClick={()=>{resetRef.current.close();setResetOpen(false);}}>Keep designing</button><button className="studio-primary" onClick={()=>{commit(d=>({...d,elements:[]}));setSelectedId(null);setFace('front');resetRef.current.close();setResetOpen(false);}}>Reset design</button></div></dialog>
  </main>;
}
createRoot(window.document.getElementById('studio-root')).render(<Studio/>);
