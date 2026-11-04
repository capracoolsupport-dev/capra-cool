import {methodAllowed,send} from './_shared.js';
import {GARMENTS,COLOURS,SIZES,estimateDesign} from '../designer/catalog.js';
import {BUCKET,studioClient,studioRates,studioError,guestOwner,checkOrigin,readStudioJson,rateLimit,ownedRow,uploadAsset,saveDesign} from './_studio.js';

export default async function handler(req,res){
  if(!methodAllowed(req,res,['GET','POST']))return;
  const query=req.query||Object.fromEntries(new URL(req.url,'http://local').searchParams);
  try{
    if(req.method==='GET'&&query.action==='catalog'){
      let storageReady=false;
      try{const client=studioClient();const {error}=await client.from('custom_studio_designs').select('id').limit(1);storageReady=!error;}catch{}
      return send(res,200,{garments:GARMENTS,colours:COLOURS,sizes:SIZES,rates:studioRates(),storageReady});
    }
    const client=studioClient();
    if(req.method==='GET'){
      const admin=process.env.ADMIN_DASHBOARD_TOKEN&&req.headers['x-admin-token']===process.env.ADMIN_DASHBOARD_TOKEN;
      if(query.action==='asset'){
        let asset;
        if(admin){const {data,error}=await client.from('custom_studio_assets').select('*').eq('id',query.id).maybeSingle();if(error||!data)throw studioError('Artwork not found.',404);asset=data;}
        else asset=await ownedRow(client,'custom_studio_assets',query.id,guestOwner(req,res));
        const original=admin&&query.original==='1',path=original?asset.original_path:asset.path;
        const {data,error}=await client.storage.from(BUCKET).download(path);if(error)throw studioError('Artwork could not be loaded.',404);
        res.status(200).setHeader('Content-Type',original?'application/octet-stream':'image/png');
        res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Security-Policy',"default-src 'none'; sandbox");
        if(original)res.setHeader('Content-Disposition','attachment; filename="capra-artwork"');
        return res.end(Buffer.from(await data.arrayBuffer()));
      }
      if(query.action==='design'){
        const saved=await ownedRow(client,'custom_studio_designs',query.id,guestOwner(req,res));
        const current=estimateDesign(saved.document,studioRates());
        return send(res,200,{id:saved.id,document:saved.document,quote:saved.quote,previewId:saved.preview_id,priceChanged:!current.complete||current.version!==saved.quote.version||current.totalCents!==saved.quote.totalCents});
      }
      throw studioError('Not found.',404);
    }
    checkOrigin(req);
    const owner=guestOwner(req,res,true),body=await readStudioJson(req);
    await rateLimit(client,owner,req);
    if(query.action==='upload'){
      const asset=await uploadAsset(client,owner,body,body.preview===true);
      return send(res,201,{id:asset.id,width:asset.width,height:asset.height,url:`/api/designer?action=asset&id=${asset.id}`});
    }
    if(query.action==='save'){
      const saved=await saveDesign(client,owner,body);
      return send(res,201,{id:saved.id,document:saved.document,quote:saved.quote,previewId:saved.preview_id});
    }
    throw studioError('Not found.',404);
  }catch(error){
    if(!error.studio)console.error('studio_request_failed',error.message);
    send(res,error.status||500,{error:error.studio?error.message:'The studio could not save your changes. Your local draft is safe.'});
  }
}
