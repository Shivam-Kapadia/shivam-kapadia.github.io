const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const state={progress:0,reduced:reduced.matches,paused:reduced.matches,dirty:true,rendered:false};
const chapters=$$('.chapter'),routeLinks=$$('.route a');
const labels=['QUEENS, NEW YORK','MIDTOWN / METER HQ','OSCORP / RESEARCH DISTRICT','DAILY BUGLE / THE DAILY BUILD','BROOKLYN BRIDGE','THE ROOFTOP / UNDER THE MASK','NEXT CHAPTER / YOUR MOVE'];
let anchors=[],active=-1,scrollQueued=false;
function measure(){anchors=chapters.map((s,i)=>i?Math.max(0,s.offsetTop-(innerWidth<=700?68:88)):0);updateScroll();}
function updateScroll(){
  scrollQueued=false;const y=scrollY;let index=0;
  while(index<anchors.length-1&&y>=anchors[index+1])index++;
  const local=index===6?0:Math.max(0,Math.min(1,(y-anchors[index])/(anchors[index+1]-anchors[index])));
  state.progress=index+local;state.dirty=true;
  const nextActive=Math.min(6,Math.round(state.progress));
  if(nextActive!==active){active=nextActive;routeLinks.forEach((a,i)=>{a.classList.toggle('active',i===active);if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});$('#current-chapter').textContent=String(active+1).padStart(2,'0');$('#district-label').textContent=labels[active];}
  const max=document.documentElement.scrollHeight-innerHeight;$('#journey-progress').style.width=`${max>0?Math.min(100,y/max*100):0}%`;
}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});
addEventListener('resize',measure);new ResizeObserver(measure).observe($('#story'));measure();document.fonts.ready.then(measure);

const motion=$('#motion-toggle');
function syncMotion(){motion.setAttribute('aria-pressed',String(state.paused));motion.innerHTML=state.paused?'▶ <span>RESUME MOTION</span>':'Ⅱ <span>PAUSE MOTION</span>';motion.title=state.paused?'Resume animated city':'Pause animated city';document.body.classList.toggle('motion-paused',state.paused);document.documentElement.style.scrollBehavior=state.paused?'auto':'';state.dirty=true;}
motion.addEventListener('click',()=>{state.paused=!state.paused;if(!state.paused)state.reduced=false;syncMotion();});
reduced.addEventListener('change',e=>{state.reduced=e.matches;state.paused=e.matches;syncMotion();});syncMotion();

// Native modal dialogs provide focus trapping, Escape, and focus restoration.
const dialogs=$$('dialog');
function openDialog(dialog){if(!dialog.open)dialog.showModal();}
dialogs.forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});});
$$('[data-open-map]').forEach(button=>button.addEventListener('click',()=>openDialog($('#map-dialog'))));
$$('#map-dialog a[href^="#"]').forEach(link=>link.addEventListener('click',()=>$('#map-dialog').close()));
$$('[data-open-resumes]').forEach(button=>button.addEventListener('click',()=>openDialog($('#resume-dialog'))));

const projectDialog=$('#project-dialog'),catalog=$('#project-list'),detail=$('#project-detail'),filters=$('#project-filters');
let projects=[],projectError=false,currentFilter='all';
const safe=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ready=fetch('./projects.json').then(r=>{if(!r.ok)throw new Error('Project data unavailable');return r.json();}).then(data=>{projects=data;}).catch(()=>{projectError=true;});
function renderCatalog(filter='all'){
  projectDialog.setAttribute('aria-labelledby','project-dialog-title');
  currentFilter=filter;detail.hidden=true;catalog.hidden=false;filters.hidden=false;$('.dialog-title-row').hidden=false;
  $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
  if(projectError){catalog.innerHTML='<p>Case files couldn’t load. <a class="text-link" href="archive.html#projects">Read all projects in the archive ↗</a></p>';return;}
  const list=projects.filter(p=>filter==='all'||p.category===filter);$('#project-count').textContent=`${list.length} MISSIONS`;
  catalog.innerHTML=list.map(p=>`<button class="catalog-card" data-detail="${p.id}"><small>${String(p.id).padStart(2,'0')} / ${safe(p.kind)}</small><h3>${safe(p.title)}</h3><p>${safe(p.tags.join(' · '))}</p><span aria-hidden="true">↗</span></button>`).join('');
  $$('[data-detail]').forEach(b=>b.addEventListener('click',()=>showProject(Number(b.dataset.detail))));
  projectDialog.scrollTop=0;
}
async function showProject(id){
  await ready;openDialog(projectDialog);
  const p=projects.find(p=>p.id===id);if(!p){renderCatalog();return;}
  catalog.hidden=true;filters.hidden=true;$('.dialog-title-row').hidden=true;detail.hidden=false;
  detail.innerHTML=`<button class="text-link detail-back">← ALL CASE FILES</button><div class="card-kicker">MISSION ${String(p.id).padStart(2,'0')} / ${safe(p.kind)} / ${safe(p.date)}</div><h3 id="detail-project-title" class="detail-title" tabindex="-1">${safe(p.title)}</h3><p class="detail-description">${safe(p.description)}</p><div class="detail-tags">${p.tags.map(t=>`<span>${safe(t)}</span>`).join('')}</div><div class="detail-links">${p.links.map(l=>`<a class="button primary" href="${safe(l.url)}" target="_blank" rel="noopener">${safe(l.label)}</a>`).join('')}<a class="text-link" href="archive.html#projects">READ IN THE FULL PORTFOLIO ↗</a></div>`;
  projectDialog.setAttribute('aria-labelledby','detail-project-title');
  detail.querySelector('.detail-back').addEventListener('click',()=>{renderCatalog(currentFilter);catalog.querySelector('button')?.focus({preventScroll:true});});
  detail.querySelector('h3').focus({preventScroll:true});projectDialog.scrollTop=0;
}
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>showProject(Number(b.dataset.project))));
$$('[data-open-projects]').forEach(b=>b.addEventListener('click',async()=>{await ready;renderCatalog();openDialog(projectDialog);}));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>renderCatalog(b.dataset.filter)));

const container=$('#city'),status=$('#scene-status');
function fallback(){document.body.classList.add('city-unavailable');status.textContent='3D is unavailable here. All projects are still ready to explore.';motion.hidden=true;$('#swing-caption').classList.remove('in-flight');}
container.addEventListener('citylost',fallback);
container.addEventListener('cityrestored',()=>{document.body.classList.remove('city-unavailable');status.textContent='';motion.hidden=false;});
try{
  const {createCity}=await import('./city.js');
  const city=createCity(container,state);status.textContent='';
  // Read-only diagnostics also let the local smoke test verify actual camera travel.
  window.portfolio={state,city,get activeChapter(){return active;}};
}catch(error){console.warn('City renderer unavailable:',error.message);fallback();}
