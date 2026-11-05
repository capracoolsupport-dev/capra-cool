// Campaigns link to the existing catalog and group-order enquiries.
const CAMPAIGNS = [
  {id:'summer',title:'Summer collection.',eyebrow:'CAPRA COOL / THE SUMMER EDIT',description:'Easy tees. Everyday polos. A little closer to the hills.',action:'Shop summer',href:'?collection=summer#shop',note:'T-shirts & polos · Wear higher.',alt:'Ivory and washed-black tees in a sunlit summer setting, design preview'},
  {id:'winter',title:'Winter collection.',eyebrow:'CAPRA COOL / THE WINTER EDIT',description:'Fleece layers. Familiar favourites. For the colder days ahead.',action:'Shop winter',href:'?collection=winter#shop',note:'Hoodies · Zip layers · Varsity jackets',alt:'Charcoal and olive hoodies beside a mountain lodge, design preview'},
  {id:'college',title:'Your campus.\nYour colours.',eyebrow:'CAPRA COOL / COLLEGE MERCHANDISE',description:'For your batch, club or society. A shared design, made your way.',action:'Explore campus',href:'campus.html#collection',note:'Explore IIT Mandi · Enquire for your campus',alt:'IIT Mandi maroon polo and black hoodie on a garment rail, design preview'},
  {id:'gym',title:'Made for\nyour team.',eyebrow:'CAPRA COOL / GYM MERCHANDISE',description:'Tees and tracksuits for your crew. Bring your gym’s identity to the everyday.',action:'Plan gym merchandise',href:'#group-orders',occasion:'Gym',note:'Your logo · Your size mix · Your team',alt:'Black and charcoal gym team tees and tracksuit, merchandise design preview'},
  {id:'corporate',title:'A shared\nidentity.',eyebrow:'CAPRA COOL / CORPORATE MERCHANDISE',description:'Thoughtful clothing for the people behind your business.',action:'Plan corporate merchandise',href:'#group-orders',occasion:'Corporate',note:'Polos · Tees · Team layers',alt:'Navy and beige corporate team polos in a quiet workspace, merchandise design preview'},
  {id:'conference',title:'Bring everyone\ntogether.',eyebrow:'CAPRA COOL / CONFERENCE MERCHANDISE',description:'A considered tee for your next gathering. Your event, down to the details.',action:'Plan conference merchandise',href:'#group-orders',occasion:'Conference',note:'Event tees · Group sizes · Artwork by you',alt:'Neutral event T-shirts and conference stationery, merchandise design preview'}
];
const SOURCES = import.meta.glob('/assets/campaigns/*.png', {eager:true,query:'?url',import:'default'});

export function initHomeHighlights(selectCollection) {
  const hero=document.querySelector('.collection-hero');
  if(!hero)return;
  const get=id=>document.getElementById(id),image=hero.querySelector('.hero-media img');
  const sources=hero.querySelectorAll('picture source'),tabs=[...hero.querySelectorAll('[data-highlight]')];
  const pause=get('highlightPause'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let index=0,playing=!reduced.matches,timer,visible=true,hovered=false,touchStart;
  const stop=()=>{clearTimeout(timer);timer=undefined;};
  function schedule(){
    stop();
    if(playing&&visible&&!hovered&&!document.hidden&&!hero.contains(document.activeElement)){
      timer=setTimeout(()=>{
        if(!document.querySelector('.modal.open,.drawer.open,.search-overlay.open'))show(index+1,false);
        else schedule();
      },7000);
    }
  }
  function show(next,announce=true){
    index=(next+CAMPAIGNS.length)%CAMPAIGNS.length;
    const item=CAMPAIGNS[index];
    get('highlightTitle').textContent=item.title;
    get('highlightEyebrow').textContent=item.eyebrow;
    get('highlightDescription').textContent=item.description;
    get('highlightActionText').textContent=item.action;
    get('highlightAction').setAttribute('href',item.href);
    get('highlightNote').textContent=item.note;
    get('highlightNumber').textContent=`0${index+1} / 06`;
    sources[0].srcset=`optimized/campaigns/${item.id}-v1.avif`;
    sources[1].srcset=`optimized/campaigns/${item.id}-v1.webp`;
    image.src=SOURCES[`/assets/campaigns/${item.id}-v1.png`]||`assets/campaigns/${item.id}-v1.png`;
    image.alt=item.alt;
    hero.dataset.highlight=item.id;
    tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));
    if(announce)get('highlightStatus').textContent=`${index+1} of 6. ${item.title.replace('\n',' ')}`;
    schedule();
  }
  function updatePlayback(){
    pause.textContent=playing?'Ⅱ':'▷';
    pause.setAttribute('aria-label',`${playing?'Pause':'Play'} collection slideshow`);
    schedule();
  }
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>show(i)));
  get('highlightPrevious').addEventListener('click',()=>show(index-1));
  get('highlightNext').addEventListener('click',()=>show(index+1));
  pause.addEventListener('click',()=>{playing=!playing;updatePlayback();});
  hero.addEventListener('keydown',event=>{
    if(!event.target.closest('.highlight-controls'))return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
      event.preventDefault();
      const origin=event.target.matches('[data-highlight]')?Number(event.target.dataset.highlight):index;
      show(origin+(event.key==='ArrowRight'?1:-1));
      if(event.target.matches('[data-highlight]'))tabs[index].focus();
    }
  });
  hero.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;stop();}});
  hero.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){hovered=false;schedule();}});
  hero.addEventListener('focusin',stop);
  hero.addEventListener('focusout',()=>queueMicrotask(schedule));
  // Keep native vertical scrolling while allowing horizontal image swipes.
  const media=hero.querySelector('.hero-media');
  media.addEventListener('touchstart',event=>{stop();const p=event.touches[0];touchStart={x:p.clientX,y:p.clientY};},{passive:true});
  media.addEventListener('touchend',event=>{
    const p=event.changedTouches[0];
    if(touchStart){const x=p.clientX-touchStart.x,y=p.clientY-touchStart.y;if(Math.abs(x)>55&&Math.abs(x)>Math.abs(y)*1.5)show(index+(x<0?1:-1));}
    touchStart=null;schedule();
  },{passive:true});
  media.addEventListener('touchcancel',()=>{touchStart=null;schedule();},{passive:true});
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;updatePlayback();}});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();},{threshold:.2});
  observer.observe(hero);
  hero.querySelector('.highlight-controls').hidden=false;
  hero.dataset.highlight='summer';
  updatePlayback();
  get('highlightAction').addEventListener('click',event=>{
    const item=CAMPAIGNS[index];
    if(item.id==='summer'||item.id==='winter'){
      event.preventDefault();selectCollection(item.id);
      document.getElementById('shop').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});
    }
    if(item.occasion){
      const form=get('merchandiseForm');form.elements.occasion.value=item.occasion;
      form.dispatchEvent(new Event('change',{bubbles:true}));
    }
  });
  initMerchandiseEnquiry();
}

function initMerchandiseEnquiry(){
  const form=document.getElementById('merchandiseForm'),draft=document.getElementById('merchandiseDraft'),email=document.getElementById('merchandiseEmail');
  function invalidate(){draft.hidden=true;email.setAttribute('href','mailto:care@capracool.com');}
  form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form);
    const brief=`CAPRA COOL — ${data.get('occasion')} merchandise enquiry\n\nOrganisation: ${data.get('organisation').trim()}\nGarment: ${data.get('garment')}\nQuantity: ${data.get('quantity')}\nDelivery PIN: ${data.get('pincode')}\n\nArtwork, sizes & event date:\n${data.get('requirements').trim()}\n\nPlease confirm garment specifications, decoration, pricing and delivery before production.`;
    document.getElementById('merchandiseDraftText').textContent=brief;
    email.href=`mailto:care@capracool.com?subject=${encodeURIComponent(`CAPRA COOL ${data.get('occasion')} merchandise enquiry`)}&body=${encodeURIComponent(brief)}`;
    draft.hidden=false;email.focus({preventScroll:true});
    draft.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
  });
}
