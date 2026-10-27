/* Congreso Procesal 2026 — versión web PWA, derivada del proyecto Expo.
   No solicita cuentas, geolocalización ni información personal. */
(() => {
'use strict';
const D=window.CNDP_DATA;
const P=window.CNDP_PONENCIAS||{papers:[],groups:[],photos:{},repositoryUrl:''};
const PP=window.CNDP_PARTICULARES||[];
if(!D){document.getElementById('main').textContent='No se pudieron cargar los datos de la agenda.';return;}
const I={
 house:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2m4 0h2m-8 4h2"/>',
 map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><path d="M9 3v15M15 6v15"/>',
 pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.6"/>',
 users:'<path d="M16 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M19 14a4 4 0 0 1 4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M16 3a4 4 0 0 1 0 8"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 bookmark:'<path d="M6 3h12v19l-6-4-6 4z"/>',
 check:'<path d="M4 12l5 5L20 6"/>',
 book:'<path d="M4 4h8a4 4 0 0 1 4 4v12H8a4 4 0 0 0-4 2V4zm16 0h-4a4 4 0 0 0-4 4v12h4a4 4 0 0 1 4 2V4z"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
 navigate:'<path d="M3 11l18-8-8 18-2-8z"/>',
 search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
 external:'<path d="M13 4h7v7M20 4l-9 9"/><path d="M20 14v6H4V4h6"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
 chevron:'<path d="m6 9 6 6 6-6"/>',
};
const svg=(name,size=22)=>`<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${I[name]||I.info}</svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const readSet=key=>{try{return new Set(JSON.parse(localStorage.getItem(key)||'[]'))}catch{return new Set()}};
const saveSet=(key,set)=>{try{localStorage.setItem(key,JSON.stringify([...set]))}catch{/* Private mode */}};
const favKey='cndp_pwa_favorites_v1'; const committeeKey='cndp_pwa_committees_v1';
const st={route:'inicio',day:5,agendaTab:'programa',agendaMode:'todos',track:'Todas',agendaQuery:'',commissionQuery:'',speakerQuery:'',ponenciasQuery:'',ponenciasArea:'Todas',ponenciasTipo:'generales',venuesTab:'Mapa y sedes',venueSelected:'teatro',favorites:readSet(favKey),favCommissions:readSet(committeeKey),expanded:new Set(),installPrompt:null};
const dayLong={5:'Jueves 5 de noviembre de 2026',6:'Viernes 6 de noviembre de 2026',7:'Sábado 7 de noviembre de 2026'};
const classes={Civil:'civil',Penal:'penal',Workshop:'workshop'};
let leafletPromise=null, map=null, mapMarkers={}; let toastTimer=null;
const main=document.getElementById('main'); const bottom=document.getElementById('bottomNav');
const toast=s=>{const e=document.getElementById('toast');e.textContent=s;e.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('visible'),3800)};
const officialLink=(text,href)=>`<a class="button small" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text)} ${svg('external',15)}</a>`;
const go=(route)=>{st.route=route;window.history.replaceState(null,'','#'+route);render();window.scrollTo({top:0,behavior:'instant'})};
const findVenue=(ev)=>{
 if(!ev?.venue)return null;
 const n=norm(ev.venue);
 if(n.includes('teatro argentino'))return D.venues[0];
 if(n.includes('municipalidad'))return D.venues[1];
 if(n.includes('amau'))return D.venues[2];
 if(n.includes('colegio de'))return D.venues[3];
 if(n.includes('instituto de estudios judiciales'))return D.venues[4];
 return null;
};
const room=ev=>ev.venue?.includes('|')?ev.venue.split('|').slice(1).join(' · ').trim():'';
const venueLink=(v,kind='search')=>kind==='directions'?`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(v.searchAddress)}&travelmode=walking`:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.searchAddress)}`;
function nav(){const menu=[['inicio','Inicio','house'],['agenda','Agenda','calendar'],['sedes','Sedes','pin'],['ponentes','Ponentes','users'],['ponencias','Ponencias','book'],['mas','Más','grid']];bottom.innerHTML=menu.map(([id,label,ic])=>`<button type="button" class="nav-item ${st.route===id?'active':''}" data-route="${id}" ${st.route===id?'aria-current="page"':''}>${svg(ic,24)}<span>${label}</span></button>`).join('');}
function render(){nav();if(st.route==='agenda')main.innerHTML=renderAgenda();else if(st.route==='sedes')main.innerHTML=renderSedes();else if(st.route==='ponentes')main.innerHTML=renderPonentes();else if(st.route==='ponencias')main.innerHTML=renderPonencias();else if(st.route==='mas')main.innerHTML=renderMas();else main.innerHTML=renderInicio();if(st.route==='sedes'&&st.venuesTab==='Mapa y sedes')setTimeout(initMap,0);}
function installBanner(){return `<aside class="install-banner"><h3>${svg('house')} Agregá el Congreso a tu celular</h3><p>Sin instalar aplicaciones de una tienda: en iPhone, abrí esta página con Safari y elegí <strong>Compartir → Añadir a pantalla de inicio</strong>. En Android, utilizá <strong>Instalar aplicación</strong> desde el menú del navegador.</p><div class="button-row"><button class="button secondary small" data-action="install">${svg('arrow',16)} Instalar o ver instrucciones</button></div></aside>`}
function renderInicio(){
 const until=Math.max(0,Math.ceil((new Date('2026-11-05T08:00:00-03:00')-new Date())/86400000));
 return `<section class="hero" aria-label="Presentación del Congreso"><div class="watermark">XXXIII</div><span class="pill">LA PLATA 2026</span><div class="hero-title">Congreso Nacional de Derecho Procesal</div><span class="gold-line"></span><div class="hero-meta"><span>${svg('calendar')} 5, 6 y 7 de noviembre de 2026</span><span>${svg('pin')} La Plata, Buenos Aires</span></div><div class="countdown"><div><strong>${until}</strong><small>${until>0?'días para el Congreso':'Congreso · 2026'}</small></div><button class="cta-arrow" type="button" data-route="agenda" aria-label="Ver agenda">→</button></div></section>
 <section class="quick-grid" aria-label="Accesos directos">
 ${[['agenda','calendar','Programa','Actividades'],['sedes','map','La Plata','Sedes y ciudad'],['ponentes','users','Ponentes','Expositores'],['ponencias','book','Ponencias','Trabajos académicos']].map(([r,ic,l,sm])=>`<button class="quick-card" type="button" data-route="${r}"><span class="ico-box">${svg(ic)}</span><strong>${l}</strong><span>${sm}</span><b class="arrow-small">→</b></button>`).join('')}
 </section><div class="app-notice">${svg('check')} <div><strong>Todo el programa en tu celular.</strong><p>31 actividades ordenadas por jornada, agenda personal, comisiones, mapas y enlaces institucionales.</p></div></div>
 ${officialLink('Sitio oficial del Congreso',D.officialRoot)} ${installBanner()}
 <p class="footer-small">La agenda de esta versión se elaboró a partir de las capturas del programa compartidas el 21/10/2026. Ante modificaciones de último momento, prevalece el <a href="${D.officialProgramUrl}" target="_blank" rel="noopener noreferrer">cronograma oficial</a>.</p>`;
}
function renderAgenda(){
 const mode=st.agendaTab==='programa';
 return `<div class="tabs"><button class="seg ${mode?'active':''}" data-action="agenda-tab" data-val="programa">Cronograma por día</button><button class="seg ${!mode?'active':''}" data-action="agenda-tab" data-val="comisiones">Temario y comisiones</button></div>${mode?renderPrograma():renderComisiones()}`;
}
function renderPrograma(){
 const counts={5:14,6:10,7:7};
 return `<div class="banner"><div class="eyebrow">Cronograma · La Plata 2026</div><h1>Agenda de actividades</h1><p>5, 6 y 7 de noviembre · Horarios, salones y expositores.</p></div>
 <div class="app-notice">${svg('check')} <div><strong>31 actividades del programa</strong><p>Con sesiones simultáneas de Derecho Procesal Civil y Penal. Los horarios se conservan para consulta sin conexión.</p></div></div>
 <div class="tabs"><button class="seg ${st.agendaMode==='todos'?'active':''}" data-action="mode" data-val="todos">Programa</button><button class="seg ${st.agendaMode==='favoritos'?'active':''}" data-action="mode" data-val="favoritos">Mi agenda (${st.favorites.size})</button></div>
 <div class="days">${[5,6,7].map(d=>`<button class="day-card ${st.day===d?'active':''}" data-action="day" data-val="${d}"><strong>${({5:'JUE 5',6:'VIE 6',7:'SÁB 7'})[d]}</strong><small>${counts[d]} actividades</small></button>`).join('')}</div>
 <label for="agendaSearch" class="sr-only">Buscar conferencia, tema o persona</label><input id="agendaSearch" class="search" type="search" placeholder="Buscar conferencia, tema o persona" value="${esc(st.agendaQuery)}" autocomplete="off">
 <div class="chips" id="trackButtons">${['Todas','General','Civil','Penal','Workshop','Semilleros'].map(t=>`<button class="chip ${st.track===t?'active':''}" data-action="track" data-val="${t}">${t==='General'?'Generales':t==='Workshop'?'Workshops':t}</button>`).join('')}</div>
 <div id="agendaResults">${renderAgendaResults()}</div>
 <p class="footer-small">Algunas actividades son simultáneas. Marcá tus favoritas para organizar tu participación y revisá el <a href="${D.officialProgramUrl}" target="_blank" rel="noopener noreferrer">cronograma oficial</a> ante posibles cambios.</p>`;
}
function matchesEvent(ev){const txt=[ev.title,ev.track,ev.venue,ev.details,...ev.speakers,...ev.moderators].join(' ');return ev.day===st.day&&(st.track==='Todas'||st.track===ev.track)&&(st.agendaMode==='todos'||st.favorites.has(ev.id))&&norm(txt).includes(norm(st.agendaQuery))}
function renderAgendaResults(){const evs=D.program.filter(matchesEvent).sort((a,b)=>a.start.localeCompare(b.start)||a.title.localeCompare(b.title));return `<div class="section-title"><h2>${dayLong[st.day]}</h2><small>${evs.length} actividades en esta selección</small></div><div class="cards">${evs.length?evs.map(renderEvento).join(''):`<div class="empty">${st.agendaMode==='favoritos'?'No tenés actividades favoritas para esta jornada.':'No hay actividades que coincidan con tu búsqueda.'}</div>`}</div>`}
function renderEvento(ev){const v=findVenue(ev),more=st.expanded.has(ev.id),fav=st.favorites.has(ev.id),loc=ev.venue?ev.venue:'Lugar no especificado';return `<article class="event-card"><div class="event-top"><div><span class="track ${classes[ev.track]||''}">${esc(ev.track==='General'?'Actividad conjunta':ev.track)}</span><p class="time" style="margin-top:10px">${svg('clock',15)} ${esc(ev.start)}–${esc(ev.end)}${ev.end<ev.start?' (día siguiente)':''}</p></div><button type="button" data-action="fav-event" data-val="${esc(ev.id)}" class="favorite ${fav?'saved':''}" aria-label="${fav?'Quitar de':'Agregar a'} mis favoritos" aria-pressed="${fav}">${svg('bookmark')}</button></div><h3>${esc(ev.title)}</h3>${ev.details?`<p class="detail">${esc(ev.details)}</p>`:''}<p class="detail">${svg('pin',16)} <span class="label">${esc(loc)}</span></p>${ev.speakers.length?`<p class="detail"><strong>Expositores:</strong> ${esc(ev.speakers.join(', '))}</p>`:''}
 ${more?`<div class="detail-block">${ev.moderators.length?`<div><strong>Moderación:</strong> ${esc(ev.moderators.join(', '))}</div>`:''}<div><strong>Horario:</strong> ${dayLong[ev.day]} · ${esc(ev.start)} a ${esc(ev.end)}</div>${room(ev)?`<div><strong>Salón:</strong> ${esc(room(ev))}</div>`:''}</div>`:''}
 <div class="event-actions"><button class="button small secondary" data-action="expand" data-val="${esc(ev.id)}">${svg('info',15)} ${more?'Ocultar':'Detalles'}</button>${v?`<button class="button small" data-action="event-map" data-val="${v.id}">${svg('pin',15)} Ver sede y salón</button>`:officialLink('Consultar lugar',D.officialProgramUrl)}</div></article>`}
function renderComisiones(){const q=norm(st.commissionQuery),comm=D.committees.filter(c=>norm(c.title+' '+c.number+' '+c.field+' '+c.topics.join(' ')).includes(q));return `<div class="section-heading"><div class="eyebrow">Temario oficial</div><h1>Comisiones</h1><p class="lead">Ejes temáticos de las ocho subcomisiones de Derecho Procesal Civil y Penal.</p></div><label for="commissionSearch" class="sr-only">Buscar comisión o tema</label><input id="commissionSearch" class="search" type="search" placeholder="Buscar comisión o tema" value="${esc(st.commissionQuery)}"><div class="section-title"><small>8 subcomisiones</small></div><div id="committeeResults" class="cards columns">${renderCommitteeResults(comm)}</div>${officialLink('Ver temario completo oficial',D.pages.find(x=>x.id==='temario').url)}`}
function renderCommitteeResults(comms){return comms.map(c=>`<article class="committee-card"><div class="card-heading"><div><span class="track ${c.field.includes('Penal')?'penal':''}">${esc(c.field.replace('Derecho ',''))}</span><p class="time" style="margin-top:11px">${esc(c.number)} · TEMARIO OFICIAL</p></div><button class="favorite ${st.favCommissions.has(c.id)?'saved':''}" data-action="fav-committee" data-val="${esc(c.id)}" aria-label="Guardar comisión">${svg('bookmark')}</button></div><h3>${esc(c.title)}</h3><p class="muted">Consultá día, horario y salón en el cronograma del Congreso.</p><details><summary>Ver ejes temáticos (${c.topics.length})</summary><ul>${c.topics.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></details></article>`).join('')||'<div class="empty">No encontramos subcomisiones con esos términos.</div>'}
function renderSedes(){const options=['Mapa y sedes','Hoteles','Turismo','Gastronomía'];const active=st.venuesTab;return `<div class="section-heading"><div class="eyebrow">Guía de La Plata</div><h1>Sedes y ciudad</h1><p class="lead">Lugares de las actividades, salones, hoteles y sitios para visitar.</p></div><div class="chips">${options.map(o=>`<button class="chip ${o===active?'active':''}" data-action="venue-tab" data-val="${o}">${o}</button>`).join('')}</div>${active==='Mapa y sedes'?renderVenuesMap():active==='Hoteles'?renderHotels():active==='Turismo'?renderPlaces('Turismo'):renderPlaces('Gastronomía')}`}
function renderVenuesMap(){return `<div class="app-notice">${svg('map')} <div><strong>Mapa de las cinco sedes</strong><p>Tocá un marcador o elegí una sede para ver salas y actividades.</p></div></div><div class="venues-layout"><div><div id="map" role="region" aria-label="Mapa interactivo de las cinco sedes"></div><div class="map-fallback" id="mapFallback">No se pudo cargar el mapa en este momento. Podés consultar las direcciones y abrir las indicaciones desde cada sede.</div><div class="map-note">Mapa: © OpenStreetMap contributors. Marcadores del Colegio y del Instituto orientativos; confirmar el acceso con la organización.</div></div><div class="cards">${D.venues.map(renderVenueCard).join('')}</div></div><p class="legal-note">La localización del edificio no representa la ubicación interior exacta de cada salón. Las actividades pueden cambiar de sede; verificá los anuncios institucionales.</p>`}
function renderVenueCard(v){const evs=D.program.filter(e=>findVenue(e)?.id===v.id);const selected=st.venueSelected===v.id;const salons=Object.keys(v.roomHints||{});return `<article class="venue-card ${selected?'selected':''}" id="venue-${v.id}"><span class="track">Sede del Congreso</span><h3>${esc(v.name)}</h3><p class="address">${svg('pin',16)} ${esc(v.address)}</p><p style="margin-top:9px">${esc(v.detail)}</p><p class="detail" style="margin-top:8px;font-size:13px;color:var(--sub)"><strong>Salones:</strong> ${esc(salons.join(' · ')||'Consultar programa')}</p><p class="detail" style="margin-top:5px;font-size:13px;color:var(--sub)"><strong>${evs.length} actividades</strong> vinculadas a esta sede</p><div class="button-row"><button class="button primary small" data-action="focus-venue" data-val="${v.id}">${svg('map',16)} Ver en mapa</button><a class="button small" href="${esc(venueLink(v,'directions'))}" rel="noopener noreferrer" target="_blank">${svg('navigate',16)} Cómo llegar</a></div>${v.approximate?'<p class="map-note">Marcador aproximado · ver dirección escrita</p>':''}</article>`}
function renderHotels(){return `<div class="banner"><div class="eyebrow">Información útil</div><h2>Hotelería en La Plata</h2><p>Opciones de alojamiento. Confirmar tarifas, disponibilidad y beneficios con cada establecimiento.</p></div><div class="cards columns">${D.hotels.map(h=>`<article class="hotel-card"><strong>${esc(h.name)}</strong><small>${esc(h.address)} ${h.special?' · Consultar tarifa para congresistas':''}</small>${h.notes?`<p class="detail">${esc(h.notes)}</p>`:''}</article>`).join('')}</div><div class="button-row">${officialLink('Hotelería oficial',D.pages.find(p=>p.id==='hoteleria').url)}</div>`}
function renderPlaces(cat){const places=D.locations.filter(l=>l.category===cat);return `<div class="banner"><div class="eyebrow">La Plata</div><h2>${cat==='Turismo'?'Descubrí la ciudad':'Gastronomía y cafés'}</h2><p>Una guía complementaria de lugares de interés. Verificá horarios y servicios con cada establecimiento.</p></div><div class="cards columns">${places.length?places.map(p=>`<article class="venue-card"><span class="track">${esc(p.tag)}</span><h3>${esc(p.name)}</h3><p class="address">${esc(p.address)}</p><p style="margin:8px 0 12px">${esc(p.description)}</p><a class="button small" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+', '+p.address+', La Plata')}">${svg('pin',15)} Abrir mapa</a></article>`).join(''):'<p class="empty">Consultá recomendaciones y lugares desde el sitio oficial.</p>'}</div>`}
function renderPonentes(){
 const query=norm(st.speakerQuery);
 const arr=D.speakers.filter(s=>norm(s.name+' '+s.role+' '+s.topics.join(' ')+(P.papers.find(p=>p.speakerId===s.id)?.title||'')).includes(query));
 return `<div class="section-heading"><div class="eyebrow">Participantes académicos</div><h1>Ponentes generales</h1><p class="lead">Conocé a los 16 ponentes generales del Congreso y consultá sus trabajos publicados.</p></div>
 <div class="app-notice">${svg('book')} <div><strong>Ponencias disponibles</strong><p>Encontramos 15 ponencias generales publicadas en el repositorio oficial. <button class="text-link" type="button" data-route="ponencias">Ver el repositorio de ponencias →</button></p></div></div>
 <input type="search" id="speakerSearch" class="search" placeholder="Buscar nombre, especialidad o ponencia" value="${esc(st.speakerQuery)}" aria-label="Buscar ponente">
 <div class="section-title"><small>${arr.length} ponentes generales</small></div><div class="speaker-grid" id="speakerResults">${renderSpeakerResults(arr)}</div>
 <p class="footer-small">Fotografías procedentes de perfiles institucionales y medios identificados en cada tarjeta; cuando no hay una imagen verificable se muestran iniciales. Los documentos requieren conexión. Fuente: Instituto de Derecho Procesal de la UNLP.</p>`;
}
function renderSpeakerResults(arr){
 return arr.map(s=>{
  const paper=P.papers.find(p=>p.speakerId===s.id),photo=P.photos[s.id],initials=esc(s.name.split(' ').map(x=>x[0]).slice(0,2).join(''));
  return `<article class="speaker-card"><div class="speaker-photo ${photo?'':'no-photo'}">
  ${photo?`<img src="${esc(photo.url)}" alt="Fotografía de ${esc(s.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="initials" hidden>${initials}</span>`:`<span class="initials">${initials}</span>`}</div>
  <h3>${esc(s.name)}</h3><p>${esc(s.role)}</p><span class="track">${esc(s.topics[0]||'Derecho Procesal')}</span>
  ${paper?`<p class="speaker-paper-title">${esc(paper.title)}</p><a class="button small secondary paper-button" href="${esc(paper.url)}" target="_blank" rel="noopener noreferrer">Leer ponencia ${svg('external',15)}</a>`:`<p class="speaker-paper-missing">Ponencia no publicada en el repositorio oficial.</p>`}
  ${photo?`<a class="photo-credit" href="${esc(photo.source)}" target="_blank" rel="noopener noreferrer">Foto: ${esc(photo.credit)}</a>`:''}</article>`;
 }).join('')||'<div class="empty">Sin resultados para esta búsqueda.</div>';
}
function filteredPonencias(){
 const general=st.ponenciasTipo==='generales';
 const all=general?P.papers:PP;
 return all.filter(p=>{
  const group=P.groups.find(g=>g.id===p.groupId);
  const author=general?(D.speakers.find(s=>s.id===p.speakerId)?.name||''):p.authors;
  return (st.ponenciasArea==='Todas'||group?.area===st.ponenciasArea)&&norm(p.title+' '+author+' '+(group?.title||'')).includes(norm(st.ponenciasQuery));
 });
}
function renderPonencias(){
 const countGenerales=P.papers.length;
 const countParticulares=PP.filter(p=>p.url).length;
 return `<div class="section-heading"><div class="eyebrow">Biblioteca académica · La Plata 2026</div><h1>Repositorio de ponencias</h1><p class="lead">Consultá las ponencias generales y particulares del XXXIII Congreso Nacional de Derecho Procesal. Todos los enlaces remiten a los documentos del repositorio oficial de la UNLP.</p></div>
 <div class="count-strip"><div><strong>${countGenerales}</strong><small>GENERALES</small></div><div><strong>${countParticulares}</strong><small>PARTICULARES</small></div><div><strong>08</strong><small>SUBCOMISIONES</small></div></div>
 <div class="button-row repo-actions">${officialLink('Repositorio oficial',P.repositoryUrl)} <button type="button" class="button secondary small" data-route="ponentes">${svg('users',16)} Ver ponentes</button></div>
 <div class="paper-tabs" role="group" aria-label="Tipo de ponencias">
 ${[['generales','Ponencias generales',countGenerales],['particulares','Ponencias particulares',countParticulares]].map(([id,label,n])=>`<button type="button" class="paper-tab ${st.ponenciasTipo===id?'active':''}" data-action="ponencias-tipo" data-val="${id}" aria-pressed="${st.ponenciasTipo===id}"><strong>${label}</strong><span>${n} documentos</span></button>`).join('')}
 </div>
 <input type="search" id="ponenciasSearch" class="search" placeholder="Buscar por autor, título o tema" value="${esc(st.ponenciasQuery)}" aria-label="Buscar ponencia">
 <div class="chips" role="group" aria-label="Filtrar por área">${['Todas','Civil','Penal'].map(x=>`<button class="chip ${st.ponenciasArea===x?'active':''}" data-action="ponencias-area" data-val="${x}" type="button">${x==='Todas'?'Todas las áreas':'Procesal '+x}</button>`).join('')}</div>
 <div class="section-title"><small>${filteredPonencias().length} trabajos encontrados · ${st.ponenciasTipo==='generales'?'Generales':'Particulares'}</small></div>
 <div id="ponenciasResults">${st.ponenciasTipo==='generales'?renderPonenciasResults(filteredPonencias()):renderParticularesResults(filteredPonencias())}</div>
 ${st.ponenciasTipo==='particulares'?`<p class="repo-note">El repositorio oficial también menciona una ponencia de Mauricio M. Monetta («Eficacia probatoria y verdad jurídica objetiva») sin archivo disponible. Se muestra identificada en su subcomisión, pero sin enlace.</p>`:''}
 <p class="footer-small">Fuente: Instituto de Derecho Procesal de la UNLP. Enlaces verificados contra el índice institucional el 27/10/2026. Los documentos requieren conexión a internet y su disponibilidad depende de Google Drive.</p>`;
}
function renderParticularesResults(papers){
 if(!papers.length)return '<div class="empty">No se encontraron ponencias particulares para esta búsqueda.</div>';
 return P.groups.map((g,i)=>{
  const list=papers.filter(p=>p.groupId===g.id);
  if(!list.length)return '';
  return `<details class="papers-group paper-accordion" ${i===0||st.ponenciasQuery?'open':''}>
  <summary><span><span class="eyebrow">Derecho Procesal ${esc(g.area)}</span><strong>${esc(g.title)}</strong></span><span class="paper-count">${list.length} ${list.length===1?'trabajo':'trabajos'} ${svg('chevron',18)}</span></summary>
  <div class="papers-list">${list.map(p=>p.url?`<a class="paper-link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer"><span class="paper-symbol">${svg('book',20)}</span><span><strong>${esc(p.title)}</strong><small>${esc(p.authors)}</small></span>${svg('external',18)}</a>`:`<div class="paper-link paper-unavailable"><span class="paper-symbol">${svg('book',20)}</span><span><strong>${esc(p.title)}</strong><small>${esc(p.authors)} · Sin archivo publicado</small></span></div>`).join('')}</div>
  </details>`;
 }).join('');
}
function renderPonenciasResults(papers){
 if(!papers.length)return '<div class="empty">No se encontraron ponencias para esta búsqueda.</div>';
 return P.groups.map(g=>{
  const list=papers.filter(p=>p.groupId===g.id);
  if(!list.length)return '';
  return `<section class="papers-group"><div class="eyebrow">Derecho Procesal ${esc(g.area)}</div><h2>${esc(g.title)}</h2><div class="papers-list">
  ${list.map(p=>{const s=D.speakers.find(x=>x.id===p.speakerId);return `<a class="paper-link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer"><span class="paper-symbol">${svg('book',20)}</span><span><strong>${esc(p.title)}</strong><small>${esc(s?.name||'Ponente general')}</small></span>${svg('external',18)}</a>`}).join('')}
  </div>${g.id==='penal4'?`<p class="repo-note">Alejandro Cascio figura como ponente general en el temario, pero su trabajo no tiene un enlace publicado en el repositorio consultado.</p>`:''}</section>`;
 }).join('');
}
function renderMas(){const groups=[...new Set(D.pages.map(x=>x.group))];return `<div class="section-heading"><div class="eyebrow">Sitio institucional</div><h1>Información oficial</h1><p class="lead">Las doce secciones del menú del Congreso, accesibles desde el celular.</p></div><div class="count-strip"><div><strong>31</strong><small>ACTIVIDADES</small></div><div><strong>03</strong><small>JORNADAS</small></div><div><strong>12</strong><small>SECCIONES</small></div></div><div class="app-notice">${svg('book')}<div><strong>Repositorio de ponencias</strong><p>Consultá las ponencias generales y particulares del Congreso. <button type="button" class="text-link" data-route="ponencias">Ir a la biblioteca académica →</button></p></div></div>${groups.map(g=>`<section><div class="eyebrow">Menú del Congreso</div><h2 class="group-title">${esc(g)}</h2><div class="resource-card">${D.pages.filter(p=>p.group===g).map(p=>`<a class="resource-row" target="_blank" rel="noopener noreferrer" href="${esc(p.url)}"><span class="ico-box">${svg(p.icon==='calendar-outline'?'calendar':p.icon==='bed-outline'?'house':'book')}</span><span><strong>${esc(p.title)}</strong><small>${esc(p.description)}</small></span><span class="arrow-small">›</span></a>`).join('')}</div></section>`).join('')}${installBanner()}<div class="footer-small">Los enlaces institucionales requieren conexión y se abren desde el sitio organizador. Esta aplicación web es una adaptación de la versión móvil del Congreso.</div>`}
async function ensureLeaflet(){if(window.L)return window.L;if(leafletPromise)return leafletPromise;leafletPromise=new Promise((res,rej)=>{
 const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(css);
 const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=()=>window.L?res(window.L):rej(new Error('No leaflet'));script.onerror=rej;document.head.appendChild(script);
});return leafletPromise;}
async function initMap(){const mount=document.getElementById('map');if(!mount)return;
 try{const L=await ensureLeaflet();if(!document.getElementById('map'))return;
  if(map){map.remove();map=null;}mapMarkers={};map=L.map(mount,{zoomControl:true,scrollWheelZoom:false}).setView([-34.9186,-57.9523],15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).addTo(map);
  const points=[];
  D.venues.forEach((v,i)=>{const markup=`<div style="width:38px;height:38px;background:${v.approximate?'#b78c42':'#1d6588'};color:white;border:3px solid white;border-radius:50%;font-size:15px;font-weight:800;box-shadow:0 2px 7px #5559;display:flex;align-items:center;justify-content:center">${i+1}</div>`;const icon=L.divIcon({html:markup,iconSize:[38,38],className:'',iconAnchor:[19,19]});const marker=L.marker([v.latitude,v.longitude],{icon}).addTo(map);marker.bindPopup(`<strong>${esc(v.name)}</strong><br>${esc(v.address)}<br><a href="${esc(venueLink(v,'directions'))}" target="_blank" rel="noopener noreferrer">Cómo llegar</a>`);marker.on('click',()=>{st.venueSelected=v.id;document.querySelectorAll('.venue-card').forEach(el=>el.classList.toggle('selected',el.id==='venue-'+v.id))});mapMarkers[v.id]=marker;points.push([v.latitude,v.longitude]);});
  if(points.length)map.fitBounds(points,{padding:[32,32],maxZoom:16});if(st.venueSelected&&mapMarkers[st.venueSelected])mapMarkers[st.venueSelected].openPopup();setTimeout(()=>map?.invalidateSize(),120);
 }catch(error){const f=document.getElementById('mapFallback');if(f)f.style.display='block';mount.innerHTML='<div style="display:grid;place-items:center;height:100%;color:#58758a;padding:28px;text-align:center">Mapa no disponible sin conexión. Consultá las direcciones de las sedes debajo.</div>';}}
function markEvent(id){if(st.favorites.has(id)){st.favorites.delete(id);toast('Actividad quitada de Mi agenda')}else{
 const ev=D.program.find(e=>e.id===id);if(ev){const a=parseTime(ev.start),b=parseTime(ev.end)+(ev.end<ev.start?1440:0);const conflicts=D.program.filter(other=>st.favorites.has(other.id)&&other.id!==ev.id&&other.day===ev.day).filter(other=>{const oa=parseTime(other.start),ob=parseTime(other.end)+(other.end<other.start?1440:0);return a<ob&&oa<b});toast(conflicts.length?`Guardada. Atención: se superpone con ${conflicts.length} actividad(es) favorita(s).`:'Actividad agregada a Mi agenda');}st.favorites.add(id);
 }saveSet(favKey,st.favorites);if(st.route==='agenda')render();}
const parseTime=x=>{const [a,b]=(x||'00:00').split(':').map(Number);return a*60+b};
function handleClick(e){const link=e.target.closest('[data-route]');if(link){e.preventDefault();go(link.dataset.route);return;}const btn=e.target.closest('[data-action]');if(!btn)return;const action=btn.dataset.action;const val=btn.dataset.val;
 switch(action){
 case 'ponencias-tipo':st.ponenciasTipo=val;st.ponenciasQuery='';render();break;
 case 'ponencias-area':st.ponenciasArea=val;render();break;
 case 'agenda-tab':st.agendaTab=val;render();break;
 case 'mode':st.agendaMode=val;render();break;
 case 'day':st.day=Number(val);render();break;
 case 'track':st.track=val;render();break;
 case 'fav-event':markEvent(val);break;
 case 'fav-committee':st.favCommissions.has(val)?st.favCommissions.delete(val):st.favCommissions.add(val);saveSet(committeeKey,st.favCommissions);render();break;
 case 'expand':st.expanded.has(val)?st.expanded.delete(val):st.expanded.add(val);render();break;
 case 'event-map':st.venueSelected=val;st.venuesTab='Mapa y sedes';go('sedes');break;
 case 'venue-tab':st.venuesTab=val;render();break;
 case 'focus-venue':st.venueSelected=val;document.querySelectorAll('.venue-card').forEach(el=>el.classList.toggle('selected',el.id==='venue-'+val));if(map&&mapMarkers[val]){map.flyTo(mapMarkers[val].getLatLng(),17);mapMarkers[val].openPopup();document.getElementById('map')?.scrollIntoView({behavior:'smooth',block:'center'});}else {toast('Seleccioná la sede. Para indicaciones, utilizá Cómo llegar.')}break;
 case 'install':if(st.installPrompt){st.installPrompt.prompt();st.installPrompt.userChoice.then(()=>{st.installPrompt=null}).catch(()=>{})}else toast('iPhone: Safari → Compartir → Añadir a pantalla de inicio. Android: menú → Instalar aplicación.');break;
 }}
function handleInput(e){if(e.target.id==='agendaSearch'){st.agendaQuery=e.target.value;const out=document.getElementById('agendaResults');if(out)out.innerHTML=renderAgendaResults();}else if(e.target.id==='commissionSearch'){st.commissionQuery=e.target.value;const out=document.getElementById('committeeResults');if(out)out.innerHTML=renderCommitteeResults(D.committees.filter(c=>norm(c.title+' '+c.number+' '+c.field+' '+c.topics.join(' ')).includes(norm(st.commissionQuery))))}else if(e.target.id==='ponenciasSearch'){st.ponenciasQuery=e.target.value;const out=document.getElementById('ponenciasResults');if(out)out.innerHTML=st.ponenciasTipo==='generales'?renderPonenciasResults(filteredPonencias()):renderParticularesResults(filteredPonencias());const counter=document.querySelector('.section-title small');if(counter)counter.textContent=filteredPonencias().length+' trabajos encontrados · '+(st.ponenciasTipo==='generales'?'Generales':'Particulares');}else if(e.target.id==='speakerSearch'){st.speakerQuery=e.target.value;const a=D.speakers.filter(s=>norm(s.name+' '+s.role+' '+s.topics.join(' ')+(P.papers.find(p=>p.speakerId===s.id)?.title||'')).includes(norm(st.speakerQuery)));const out=document.getElementById('speakerResults');if(out)out.innerHTML=renderSpeakerResults(a)}}
document.addEventListener('error',e=>{if(e.target.matches?.('.speaker-photo img')){e.target.hidden=true;const fallback=e.target.nextElementSibling;if(fallback)fallback.hidden=false;}},true);
document.addEventListener('click',handleClick);document.addEventListener('input',handleInput);
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();st.installPrompt=event;});
window.addEventListener('hashchange',()=>{const route=(location.hash||'#inicio').slice(1);if(['inicio','agenda','sedes','ponentes','ponencias','mas'].includes(route)&&route!==st.route){st.route=route;render()}});
if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{})}
const initial=(location.hash||'#inicio').slice(1);if(['inicio','agenda','sedes','ponentes','ponencias','mas'].includes(initial))st.route=initial;
render();
})();
