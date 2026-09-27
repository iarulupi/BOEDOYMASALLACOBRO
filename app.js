const KEY='restoCobroV3';
const catalogo=[
 ['empanada','Empanada',4500,'Entradas','empanada'],['tortilla','Tortilla de papas (para 2)',18000,'Entradas'],['provoleta','Provoleta sola',12000,'Entradas'],['provoleta-tr','Provoleta con tomate y rúcula',15000,'Entradas'],
 ['hamb-sola','Hamburguesa sola',14000,'Hamburguesas','hamb'],['hamb-ctm','Hamburguesa con cebolla, tomate y muzzarella',15000,'Hamburguesas','hamb'],['hamb-cheddar','Hamburguesa con cheddar',17000,'Hamburguesas','hamb'],['hamb-cpv','Hamburguesa con cheddar, panceta y verdeo',18500,'Hamburguesas','hamb'],['ad-huevo-h','Adicional huevo a la plancha',3000,'Hamburguesas'],
 ['papas','Papas fritas solas',8500,'Papas fritas'],['papas-ch','Papas con cheddar',15000,'Papas fritas'],['papas-cpv','Papas con cheddar, panceta y verdeo',16000,'Papas fritas'],['ad-huevo-p','Adicional huevo a la plancha',3000,'Papas fritas'],
 ['pz-muz','Pizzanesa muzzarella / fugazeta',42000,'Pizzanesas','pizzanesa'],['pz-roq','Pizzanesa roquefort',45000,'Pizzanesas','pizzanesa'],['pz-nap','Pizzanesa napolitana',45000,'Pizzanesas','pizzanesa'],['pz-ruc','Pizzanesa rúcula',45000,'Pizzanesas','pizzanesa'],['pz-pri','Pizzanesa primavera',45000,'Pizzanesas','pizzanesa'],['pz-cpv','Pizzanesa cheddar, panceta y verdeo',52000,'Pizzanesas','pizzanesa'],['pz-boedo','Pizzanesa Boedo y más allá',57000,'Pizzanesas','pizzanesa'],['pz-ad','Adicional cheddar, panceta y verdeo en papas',7500,'Pizzanesas'],
 ['pi-muz','Pizza muzzarella',24000,'Pizzas'],['pi-fug','Pizza fugazeta',24000,'Pizzas'],['pi-roq','Pizza roquefort',26500,'Pizzas'],['pi-nap','Pizza napolitana',26500,'Pizzas'],['pi-ruc','Pizza rúcula con jamón crudo',26500,'Pizzas'],['pi-jm','Pizza jamón y morrón',26500,'Pizzas'],['pi-pri','Pizza primavera',26500,'Pizzas'],['pi-boedo','Pizza Boedo y más allá',35000,'Pizzas'],
 ['pechuga','Pechuga grillada con guarnición',19000,'Carnes'],['pastel','Pastel de papas en cazuela de barro',18000,'Carnes'],
 ['ensalada','Ensalada 3 ingredientes',8500,'Ensaladas','ensalada'],['ens-ad','Ingrediente adicional',1500,'Ensaladas','detalle'],['ens-atun','Atún adicional',6000,'Ensaladas'],
 ['durazno','Durazno con crema',7200,'Postres'],['frutilla','Frutillas con crema',7200,'Postres'],['panqueque','Panqueque con dulce de leche',6500,'Postres'],['almendrado','Almendrado con chocolate',5000,'Postres'],['flan','Flan casero',4200,'Postres'],['post-ad','Adicional dulce o crema',1300,'Postres','postre'],['post-mix','Adicional mixto',2200,'Postres'],
 ['lied-pinta','Cerveza artesanal Liedfeld pinta',5700,'Bebidas'],['quilmes','Lata Quilmes 430 ml',4500,'Bebidas'],['lied-jarra','Cerveza artesanal Liedfeld jarra 1½',13000,'Bebidas'],['stella','Stella 1 litro',12500,'Bebidas'],['gaseosa15','Gaseosa 1½',8200,'Bebidas'],['gaseosa500','Gaseosa 500 ml',4700,'Bebidas'],['agua','Agua / agua saborizada 500 cc',4000,'Bebidas'],['levite','Levité grande',7000,'Bebidas'],
 ['otro-loco','Otro Loco Más',8700,'Vinos'],['moras','Finca Las Moras',9000,'Vinos'],['benjamin','Benjamín',11000,'Vinos'],['alma','Alma Mora',12000,'Vinos'],['trumpeter','Trumpeter',19000,'Vinos'],['cosecha','Cosecha Tardía',9900,'Vinos'],['linda','La Linda',20000,'Vinos'],['nicasia','Nicasia',18000,'Vinos'],['crotta','Crotta chico',7000,'Vinos'],['santajulia','Santa Julia',13000,'Vinos'],['1895','1895',8000,'Vinos'],['sanfelipe','San Felipe',11000,'Vinos'],['chandon','Champagne Chandon',28000,'Vinos'],
 ['tragos','Fernet / Campari / Gancia / Gin / Cynar / Aperol / Vodka',10000,'Tragos','trago'],['whisky-nac','Whisky nacional',11000,'Tragos'],['whisky-imp','Whisky importado',14000,'Tragos'],['chivas','Chivas',25000,'Tragos']
].map(([id,nombre,precio,categoria,tipo])=>({id,nombre,precio,categoria,tipo}));
function base(){return {mesas:Array.from({length:12},(_,i)=>({id:i+1,comensales:[],consumosMesa:[],pagos:[],ultimaComanda:null})),historial:[]}}
let data=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('restoCobroV1')||'null')||base(); if(!data.historial)data.historial=[]; if(!data.mesas||!data.mesas.length)data.mesas=base().mesas; data.mesas.forEach(m=>{m.pagos=m.pagos||[];if(!('ultimaComanda' in m))m.ultimaComanda=null;(m.consumosMesa||[]).forEach(x=>{x.comandado=Math.min(x.cant,Number(x.comandado||0));x.pagado=Math.min(x.cant,Number(x.pagado||0))});(m.comensales||[]).forEach(c=>(c.consumos||[]).forEach(x=>{x.comandado=Math.min(x.cant,Number(x.comandado||0));x.pagado=Math.min(x.cant,Number(x.pagado||0))}))});
let mesaId=null,destino={tipo:'mesa'}, pagoContexto={label:'MESA COMPLETA',items:[]}; const $=s=>document.querySelector(s); const money=n=>'$'+Math.round(Number(n||0)).toLocaleString('es-AR'); const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){localStorage.setItem(KEY,JSON.stringify(data))} function mesa(){return data.mesas.find(m=>m.id===mesaId)} function suma(a){return (a||[]).reduce((s,x)=>s+x.precio*x.cant,0)} function sumaPendiente(a){return (a||[]).reduce((s,x)=>s+x.precio*Math.max(0,x.cant-Number(x.pagado||0)),0)} function totalMesa(m){return suma(m.consumosMesa)+m.comensales.reduce((s,c)=>s+suma(c.consumos),0)} function pagadoBase(m){return (m.pagos||[]).reduce((s,p)=>s+p.base,0)} function recargos(m){return (m.pagos||[]).reduce((s,p)=>s+p.recargo,0)} function pendiente(m){return Math.max(0,totalMesa(m)-pagadoBase(m))} function pendienteComensal(c){return sumaPendiente(c.consumos)}
function renderMesas(){mesaId=null;$('#app').innerHTML=`<div class="wrap"><div class="row between top-actions"><div class="row"><button class="primary" onclick="renderHistorial()">HISTORIAL / CIERRE DE CAJA</button><button onclick="administrarMesas()">ADMINISTRAR MESAS</button><button onclick="resetMesas()">REINICIAR MESAS</button></div></div><div class="grid mesa-grid">${data.mesas.map(m=>{const t=totalMesa(m),p=pendiente(m),estado=!t?'libre':(pagadoBase(m)>0&&p>0?'pendiente':'abierta');const txt=estado==='libre'?'LIBRE':estado==='pendiente'?'PENDIENTE':'ABIERTA';return `<div class="mesa ${estado}" onclick="abrir(${m.id})"><h3>MESA ${m.id}</h3><span class="estado">${txt}</span></div>`}).join('')}</div></div>`}
function mesaVacia(m){return totalMesa(m)===0&&pagadoBase(m)===0&&!(m.comensales||[]).length&&!(m.pagos||[]).length}
let mesaAdminSeleccion=null;
function administrarMesas(){
  mesaAdminSeleccion=new Set(data.mesas.map(m=>Number(m.id)));
  const mapa=Array.from({length:26},(_,i)=>{const id=i+1,activa=mesaAdminSeleccion.has(id);return `<button type="button" id="mesaAdmin${id}" class="mesa-mini ${activa?'active':''}" onclick="toggleMesaAdmin(${id})">${id}</button>`}).join('');
  modalHTML('ADMINISTRAR MESAS',`<div class="mesa-admin-grid">${mapa}</div>`,`<button class="primary" onclick="aceptarMesasAdmin()">ACEPTAR</button>`);
}
function toggleMesaAdmin(id){
  const activa=mesaAdminSeleccion.has(id);
  if(activa){
    const m=data.mesas.find(x=>Number(x.id)===id);
    if(m&&!mesaVacia(m)){alert('NO SE PUEDE QUITAR UNA MESA EN USO.');return}
    mesaAdminSeleccion.delete(id);
  }else mesaAdminSeleccion.add(id);
  document.querySelector(`#mesaAdmin${id}`)?.classList.toggle('active',mesaAdminSeleccion.has(id));
}
function aceptarMesasAdmin(){
  const actuales=new Map(data.mesas.map(m=>[Number(m.id),m]));
  data.mesas=[...mesaAdminSeleccion].sort((a,b)=>a-b).map(id=>actuales.get(id)||{id,comensales:[],consumosMesa:[],pagos:[],ultimaComanda:null});
  save();cerrarModal();renderMesas();
}
function abrir(id){mesaId=id;destino={tipo:'mesa'};renderMesa()}
function renderMesa(){const m=mesa(),cats=[...new Set(catalogo.map(p=>p.categoria))];const destinoActivo=destino.tipo==='mesa'?'mesa':destino.id;$('#app').innerHTML=`<div class="wrap"><div class="row between"><button onclick="renderMesas()">← MESAS</button><h2>MESA ${m.id}</h2><div><b>TOTAL ${money(totalMesa(m))}</b> · PAGADO ${money(pagadoBase(m))} · <b>PENDIENTE ${money(pendiente(m))}</b></div></div><div class="spacer"></div><div class="actions-main"><button class="action-load" onclick="agregarComensal()">AGREGAR COMENSAL</button><button class="action-load" onclick="destino={tipo:'mesa'};renderMesa()">AGREGAR CONSUMO GENERAL</button><button class="action-command" onclick="imprimirComandaNueva()">IMPRIMIR COMANDA${cantidadPendienteComanda(m)?` (${cantidadPendienteComanda(m)})`:''}</button><button class="pay" onclick="mostrarCobro()">COBRAR MESA</button>${m.ultimaComanda?'<button onclick="reimprimirUltimaComanda()">REIMPRIMIR ÚLTIMA COMANDA</button>':''}</div><div class="comensal-tabs"><button class="${destinoActivo==='mesa'?'active':''}" onclick="destino={tipo:'mesa'};renderMesa()">GENERAL</button>${m.comensales.map(c=>`<button class="${destinoActivo===c.id?'active':''}" onclick="seleccionarComensal('${c.id}')">${esc(c.nombre)}</button>`).join('')}</div><div class="grid"><div class="card"><h3>CONSUMO GENERAL</h3>${lista(m.consumosMesa,'mesa')}<b>SUBTOTAL: ${money(suma(m.consumosMesa))}</b></div>${m.comensales.map(c=>`<div class="card"><div class="row between"><h3>${esc(c.nombre)}</h3><button onclick="seleccionarComensal('${c.id}')">CARGAR</button></div>${lista(c.consumos,c.id)}<b>SUBTOTAL: ${money(suma(c.consumos))}</b><div class="spacer"></div><button class="danger" onclick="borrarComensal('${c.id}')">ELIMINAR COMENSAL</button></div>`).join('')}</div>${cats.map(cat=>`<div class="menu-category">${cat.toUpperCase()}</div><div class="grid">${catalogo.filter(p=>p.categoria===cat).map(p=>`<div class="producto" onclick="agregarProducto('${p.id}')"><b>${esc(p.nombre)}</b><div>${money(p.precio)}</div></div>`).join('')}</div>`).join('')}<div class="card manual-card"><h3>PRODUCTO MANUAL</h3><div class="row"><input id="manualNombre" placeholder="DESCRIPCIÓN"><input id="manualPrecio" type="number" min="0" placeholder="PRECIO"><button onclick="agregarManual()">AGREGAR</button></div></div></div>`}
function target(){const m=mesa();return destino.tipo==='mesa'?m.consumosMesa:(m.comensales.find(c=>c.id===destino.id)?.consumos||m.consumosMesa)}
function agregarComensal(){const n=prompt('Nombre del comensal:');if(!n?.trim())return;const c={id:crypto.randomUUID(),nombre:n.trim(),consumos:[]};mesa().comensales.push(c);destino={tipo:'comensal',id:c.id,nombre:c.nombre};save();renderMesa()}
function seleccionarComensal(id){const c=mesa().comensales.find(x=>x.id===id);destino={tipo:'comensal',id,nombre:c.nombre};renderMesa()}
function modalHTML(titulo,cuerpo,acciones=''){document.body.insertAdjacentHTML('beforeend',`<div class="modal-bg" id="modalBg"><div class="modal"><h3>${titulo}</h3>${cuerpo}<div class="modal-actions">${acciones}<button onclick="cerrarModal()">CANCELAR</button></div></div></div>`)}
function cerrarModal(){document.querySelector('#modalBg')?.remove()}
function elegirOpcion(titulo,opciones,cb){modalHTML(titulo,opciones.map((o,i)=>`<label class="choice"><input type="radio" name="opt" value="${esc(o)}" ${i===0?'checked':''}> ${esc(o)}</label>`).join(''),`<button class="primary" id="okOpt">ACEPTAR</button>`);document.querySelector('#okOpt').onclick=()=>{const v=document.querySelector('input[name=opt]:checked')?.value;cerrarModal();cb(v)}}
function empanadasModal(p){const sabores=['CARNE','JAMÓN Y QUESO','CEBOLLA Y QUESO','POLLO','VERDURA'];modalHTML('ELEGIR EMPANADAS',sabores.map((o,i)=>`<div class="qtyrow"><b>${o}</b><div><button onclick="cambiarQty(${i},-1)">−</button><span id="qty${i}">0</span><button onclick="cambiarQty(${i},1)">+</button></div></div>`).join('')+`<div class="selection-total">TOTAL: <b id="empTotal">0 EMPANADAS · ${money(0)}</b></div>`,`<button class="primary" onclick="confirmarEmpanadas('${p.id}')">AGREGAR</button>`)}
function cambiarQty(i,d){const e=document.querySelector('#qty'+i);e.textContent=Math.max(0,Number(e.textContent)+d);const qs=[...document.querySelectorAll('[id^=qty]')].reduce((s,x)=>s+Number(x.textContent),0);document.querySelector('#empTotal').textContent=`${qs} EMPANADAS · ${money(qs*4500)}`}
function confirmarEmpanadas(id){const p=catalogo.find(x=>x.id===id),sabores=['CARNE','JAMÓN Y QUESO','CEBOLLA Y QUESO','POLLO','VERDURA'],t=target();let total=0;sabores.forEach((sab,i)=>{const q=Number(document.querySelector('#qty'+i).textContent);if(q){total+=q;const nombre=`${p.nombre} — ${sab}`,key=p.id+'|'+nombre,ex=t.find(x=>x.key===key);ex?ex.cant+=q:t.push({...p,nombre,key,cant:q,comandado:0})}});if(!total)return alert('ELEGÍ AL MENOS UNA EMPANADA.');cerrarModal();save();renderMesa()}
const INGREDIENTES_ENSALADA=['LECHUGA','RÚCULA','TOMATE','HUEVO','ZANAHORIA','CHOCLO','CEBOLLA','REMOLACHA'];
function ingredientesChecks(nombre='ingrediente'){return `<div class="ingredient-grid">${INGREDIENTES_ENSALADA.map(i=>`<label class="choice ingredient-choice"><input type="checkbox" name="${nombre}" value="${esc(i)}"> <span>${esc(i)}</span></label>`).join('')}</div>`}
function elegidos(nombre='ingrediente'){return [...document.querySelectorAll(`input[name="${nombre}"]:checked`)].map(x=>x.value)}
function ensaladaModal(p,cb){modalHTML('ELEGIR 3 INGREDIENTES',`${ingredientesChecks('ensBase')}<div class="selection-total">SELECCIONADOS: <b id="ensBaseTotal">0 / 3</b></div>`,`<button class="primary" id="okEnsBase">AGREGAR</button>`);const checks=[...document.querySelectorAll('input[name="ensBase"]')];checks.forEach(ch=>ch.onchange=()=>{const sel=elegidos('ensBase');if(sel.length>3){ch.checked=false;return alert('PODÉS ELEGIR 3 INGREDIENTES.')}document.querySelector('#ensBaseTotal').textContent=`${elegidos('ensBase').length} / 3`});document.querySelector('#okEnsBase').onclick=()=>{const sel=elegidos('ensBase');if(sel.length!==3)return alert('ELEGÍ EXACTAMENTE 3 INGREDIENTES.');cerrarModal();cb(`${p.nombre} — ${sel.join(' / ')}`)}}
function guarnicionModal(p,cb){modalHTML('ELEGIR GUARNICIÓN',`<label class="choice"><input type="radio" name="guarnicion" value="PAPAS FRITAS" checked> <span>PAPAS FRITAS</span></label><label class="choice"><input type="radio" name="guarnicion" value="ENSALADA"> <span>ENSALADA</span></label><div id="guarnEns" class="conditional-box" style="display:none"><b>ELEGÍ HASTA 3 INGREDIENTES</b>${ingredientesChecks('guarnIng')}<div class="selection-total">SELECCIONADOS: <b id="guarnTotal">0 / 3</b></div></div>`,`<button class="primary" id="okGuarn">AGREGAR</button>`);document.querySelectorAll('input[name="guarnicion"]').forEach(r=>r.onchange=()=>{document.querySelector('#guarnEns').style.display=r.value==='ENSALADA'&&r.checked?'block':'none'});const checks=[...document.querySelectorAll('input[name="guarnIng"]')];checks.forEach(ch=>ch.onchange=()=>{const sel=elegidos('guarnIng');if(sel.length>3){ch.checked=false;return alert('PODÉS ELEGIR HASTA 3 INGREDIENTES.')}document.querySelector('#guarnTotal').textContent=`${elegidos('guarnIng').length} / 3`});document.querySelector('#okGuarn').onclick=()=>{const g=document.querySelector('input[name="guarnicion"]:checked')?.value;if(g==='ENSALADA'){const sel=elegidos('guarnIng');if(!sel.length)return alert('ELEGÍ AL MENOS 1 INGREDIENTE PARA LA ENSALADA.');cerrarModal();return cb(`${p.nombre} — GUARNICIÓN: ENSALADA — ${sel.join(' / ')}`)}cerrarModal();cb(`${p.nombre} — GUARNICIÓN: PAPAS FRITAS`)}}
function ingredienteAdicionalModal(p){
  modalHTML('INGREDIENTE ADICIONAL',
    `<div class="qtyrow"><b>CANTIDAD DE INGREDIENTES</b><div><button id="menosExtra">−</button><span id="qtyExtra">0</span><button id="masExtra">+</button></div></div>
     <div id="extraOpciones" class="conditional-box" style="display:none"><b>ELEGÍ LOS INGREDIENTES</b>${ingredientesChecks('extraIng')}<div class="selection-total">SELECCIONADOS: <b id="extraSel">0</b></div></div>
     <div class="selection-total">TOTAL: <b id="extraPrecio">${money(0)}</b></div>`,
    `<button class="primary" id="okExtra">AGREGAR</button>`
  );
  let q=0;
  const pintar=()=>{
    document.querySelector('#qtyExtra').textContent=q;
    document.querySelector('#extraPrecio').textContent=money(q*p.precio);
    document.querySelector('#extraOpciones').style.display=q?'block':'none';
    document.querySelector('#extraSel').textContent=`${elegidos('extraIng').length} / ${q}`;
    document.querySelectorAll('input[name="extraIng"]').forEach(x=>x.disabled=!q);
  };
  document.querySelector('#masExtra').onclick=()=>{q++;pintar()};
  document.querySelector('#menosExtra').onclick=()=>{
    q=Math.max(0,q-1);
    const marcados=[...document.querySelectorAll('input[name="extraIng"]:checked')];
    if(marcados.length>q)marcados.forEach((x,i)=>{if(i>=q)x.checked=false});
    pintar();
  };
  document.querySelectorAll('input[name="extraIng"]').forEach(ch=>ch.onchange=()=>{
    const sel=elegidos('extraIng');
    if(sel.length>q){ch.checked=false;alert(`ELEGISTE ${q} INGREDIENTE${q===1?'':'S'} ADICIONAL${q===1?'':'ES'}.`)}
    pintar();
  });
  document.querySelector('#okExtra').onclick=()=>{
    if(q<1)return alert('ELEGÍ LA CANTIDAD DE INGREDIENTES ADICIONALES CON +.');
    const sel=elegidos('extraIng');
    if(sel.length!==q)return alert(`ELEGÍ EXACTAMENTE ${q} INGREDIENTE${q===1?'':'S'}.`);
    const nombre=`${p.nombre} × ${q} — ${sel.join(' / ')}`;
    const precio=p.precio*q,t=target(),key=p.id+'|'+nombre,ex=t.find(x=>x.key===key);
    ex?ex.cant++:t.push({...p,nombre,precio,key,cant:1,comandado:0});
    cerrarModal();save();renderMesa();
  };
  pintar();
}
function personalizar(p,cb){if(p.nombre.toLowerCase().includes('con guarnición'))return guarnicionModal(p,cb);if(p.tipo==='hamb')return elegirOpcion('TIPO DE HAMBURGUESA',['CARNE','VEGGIE'],v=>cb(`${p.nombre} — ${v}`));if(p.tipo==='pizzanesa')return elegirOpcion('TIPO DE PIZZANESA',['CARNE','POLLO'],v=>cb(`${p.nombre} — ${v}`));if(p.tipo==='ensalada')return ensaladaModal(p,cb);if(p.tipo==='postre')return elegirOpcion('ADICIONAL',['DULCE','CREMA'],v=>cb(`${p.nombre} — ${v}`));if(p.tipo==='trago')return elegirOpcion('ELEGIR TRAGO',['FERNET','CAMPARI','GANCIA','GIN','CYNAR','APEROL','VODKA'],v=>cb(`${p.nombre} — ${v}`));cb(p.nombre)}
function agregarProducto(id){const p=catalogo.find(x=>x.id===id);if(p.tipo==='empanada')return empanadasModal(p);if(p.id==='ens-ad')return ingredienteAdicionalModal(p);personalizar(p,nombre=>{const t=target(),key=p.id+'|'+nombre,ex=t.find(x=>x.key===key);ex?ex.cant++:t.push({...p,nombre,key,cant:1,comandado:0});save();renderMesa()})}
function agregarManual(){const n=$('#manualNombre').value.trim(),p=Number($('#manualPrecio').value);if(!n||p<0||!Number.isFinite(p))return alert('Completá descripción y precio.');target().push({id:'manual-'+crypto.randomUUID(),nombre:n,precio:p,categoria:'Manual',cant:1,comandado:0});save();renderMesa()}
function lista(items,owner){return !items.length?'<p class="muted">Sin consumos.</p>':items.map((x,i)=>`<div class="item row between"><span>${x.cant} × ${esc(x.nombre)} · ${money(x.precio*x.cant)} ${(x.cant-Number(x.comandado||0))>0?`<small class="badge">${x.cant-Number(x.comandado||0)} NUEVO/S</small>`:''}</span><span><button onclick="cambiar('${owner}',${i},-1)">−</button> <button onclick="cambiar('${owner}',${i},1)">+</button> <button onclick="quitar('${owner}',${i})">×</button></span></div>`).join('')}
function ownerItems(o){return o==='mesa'?mesa().consumosMesa:mesa().comensales.find(c=>c.id===o).consumos} function cambiar(o,i,d){const a=ownerItems(o);a[i].cant+=d;if(a[i].cant<=0)a.splice(i,1);else a[i].comandado=Math.min(Number(a[i].comandado||0),a[i].cant);save();renderMesa()} function quitar(o,i){ownerItems(o).splice(i,1);save();renderMesa()} function borrarComensal(id){if(!confirm('¿Eliminar este comensal y sus consumos?'))return;mesa().comensales=mesa().comensales.filter(c=>c.id!==id);destino={tipo:'mesa'};save();renderMesa()}

function itemsPendientesComanda(m){
  const out=[];
  const add=(owner,items)=>{(items||[]).forEach(x=>{const enviados=Number(x.comandado||0),n=Math.max(0,x.cant-enviados);if(n)out.push({owner,nombre:x.nombre,cant:n,ref:x})})};
  add('GENERAL',m.consumosMesa);(m.comensales||[]).forEach(c=>add(c.nombre,c.consumos));return out;
}
function cantidadPendienteComanda(m){return itemsPendientesComanda(m).reduce((s,x)=>s+x.cant,0)}
function abrirImpresionComanda(comanda,reimpresion=false){
  const w=window.open('','_blank','width=420,height=700');if(!w){alert('EL NAVEGADOR BLOQUEÓ LA VENTANA DE IMPRESIÓN. HABILITÁ LAS VENTANAS EMERGENTES E INTENTÁ DE NUEVO.');return false}
  const d=new Date(comanda.fechaISO);
  w.document.write(`<!doctype html><html><head><title>COMANDA MESA ${comanda.mesa}</title><style>@page{size:58mm auto;margin:2mm}*{box-sizing:border-box}html,body{width:54mm;max-width:54mm;margin:0;padding:0}body{font-family:Consolas,"Courier New",monospace;font-size:13px;line-height:1.25;font-weight:600;text-transform:uppercase;color:#000;overflow-wrap:anywhere;word-break:normal}.c{text-align:center}.line{border-top:1px dashed #000;margin:6px 0}.grupo{font-size:18px;line-height:1.25;font-weight:700;margin-top:8px}.prod{font-size:18px;line-height:1.25;font-weight:600;margin:3px 0;white-space:normal;overflow-wrap:anywhere}b{font-weight:700}</style></head><body>${reimpresion?'<div class="c"><b>*** REIMPRESIÓN ***</b></div>':''}<div class="c"><b style="font-size:20px">MESA ${comanda.mesa}</b><br><b>${d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})} HS</b><br>${d.toLocaleDateString('es-AR')}</div><div class="line"></div>${comanda.items.map(x=>`<div class="grupo">${esc(x.owner)}</div><div class="prod">${x.cant} × ${esc(x.nombre)}</div>`).join('')}<div class="line"></div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();return true
}
function imprimirComandaNueva(){
  const m=mesa(),pend=itemsPendientesComanda(m);if(!pend.length)return alert('NO HAY CONSUMOS NUEVOS PARA ENVIAR A COMANDA.');
  const resumen=pend.map(x=>`${x.owner}: ${x.cant} × ${x.nombre}`).join('\n');
  if(!confirm(`SE VA A IMPRIMIR ESTA COMANDA:\n\n${resumen}\n\n¿CONTINUAR?`))return;
  const comanda={id:crypto.randomUUID(),mesa:m.id,fechaISO:new Date().toISOString(),items:pend.map(x=>({owner:x.owner,nombre:x.nombre,cant:x.cant}))};
  if(!abrirImpresionComanda(comanda,false))return;
  pend.forEach(x=>x.ref.comandado=Number(x.ref.comandado||0)+x.cant);m.ultimaComanda=structuredClone(comanda);save();renderMesa();
}
function reimprimirUltimaComanda(){const m=mesa();if(!m.ultimaComanda)return alert('TODAVÍA NO HAY UNA COMANDA PARA REIMPRIMIR.');abrirImpresionComanda(m.ultimaComanda,true)}

function pendingUnits(m){const out=[];const add=(owner,ownerId,x)=>{const left=Math.max(0,x.cant-Number(x.pagado||0));for(let q=0;q<left;q++)out.push({label:`${owner} · ${x.nombre}`,precio:x.precio,ownerId,refKey:x.key||x.id||x.nombre,ref:x})};(m.consumosMesa||[]).forEach(x=>add('GENERAL','mesa',x));m.comensales.forEach(c=>(c.consumos||[]).forEach(x=>add(c.nombre,c.id,x)));return out}
function marcarSeleccion(el){document.querySelectorAll('.pay-option').forEach(b=>b.classList.remove('active'));el?.classList.add('active')}
function mostrarCobro(){const m=mesa();if(!totalMesa(m))return alert('LA MESA NO TIENE CONSUMOS.');const comps=m.comensales.filter(c=>pendienteComensal(c)>0);const pend=pendiente(m);pagoContexto={label:'TOTAL DE LA CUENTA',items:pendingUnits(m)};$('#app').innerHTML=`<div class="wrap"><button onclick="renderMesa()">← VOLVER A MESA</button><h2>COBRO · MESA ${m.id}</h2><div class="summary"><div>CONSUMO <b>${money(totalMesa(m))}</b></div><div>PAGADO <b>${money(pagadoBase(m))}</b></div><div>PENDIENTE <b>${money(pend)}</b></div></div>${pend>0?`<div class="card"><h3>¿QUÉ SE VA A PAGAR?</h3><div class="pay-options"><button class="pay-option active" onclick="marcarSeleccion(this);setMonto(${pend},'TOTAL DE LA CUENTA',pendingUnits(m))">TOTAL DE LA CUENTA · ${money(pend)}</button>${comps.map(c=>`<button class="pay-option" onclick="marcarSeleccion(this);seleccionarPagoComensal('${c.id}')">${esc(c.nombre)} · ${money(pendienteComensal(c))}</button>`).join('')}</div><div class="pay-options secondary"><button class="pay-option" onclick="marcarSeleccion(this);dividirPago()">DIVIDIR EN PARTES IGUALES</button><button class="pay-option" onclick="marcarSeleccion(this);seleccionarConsumos()">SELECCIONAR CONSUMOS</button></div><p>MONTO A CANCELAR: <b id="montoElegido">${money(pend)}</b></p><input id="montoBase" type="hidden" value="${pend}"></div><div class="card"><h3>MEDIO DE PAGO</h3><div class="row">${['EFECTIVO','TRANSFERENCIA','DÉBITO','CRÉDITO','QR'].map(x=>`<button class="medio-option" data-medio="${x}" onclick="seleccionarMedio(this,'${x}')">${x}${x==='CRÉDITO'?' +10%':''}</button>`).join('')}</div><div id="pagoPreview" class="pago-preview"></div></div>`:`<div class="card cuenta-saldada"><h3>CUENTA SALDADA ✓</h3><p>NO QUEDAN CONSUMOS PENDIENTES.</p></div>`}${(m.pagos||[]).length?`<div class="card pagos-registrados"><h3>PAGOS REGISTRADOS</h3><div class="pagos-scroll">${m.pagos.map((p,i)=>`<div class="item row between"><span>${esc(p.label||'PAGO')} · ${p.medio}: ${money(p.base)}${p.recargo?` + ${money(p.recargo)} RECARGO`:''} = <b>${money(p.cobrado)}</b></span><button onclick="anularPago(${i})">ANULAR</button></div>`).join('')}</div>${pend===0?`<button class="action-close close-after-pay" onclick="cerrarMesa()">CERRAR MESA</button>`:''}</div>`:''}</div>`}

function seleccionarPagoComensal(id){const c=mesa().comensales.find(x=>x.id===id);if(!c)return;const its=pendingUnits(mesa()).filter(x=>x.ownerId===id);setMonto(its.reduce((s,x)=>s+x.precio,0),c.nombre,its)}
function setMonto(n,label='PAGO',items=[]){n=Math.max(0,Math.min(Number(n)||0,pendiente(mesa())));pagoContexto={label,items};$('#montoBase').value=n;$('#montoElegido').textContent=money(n);$('#pagoPreview').innerHTML='';document.querySelectorAll('.medio-option').forEach(b=>b.classList.remove('active'))}
function dividirPago(){const n=Number(prompt('¿EN CUÁNTAS PARTES IGUALES?'));if(n>0)setMonto(Math.round(pendiente(mesa())/n),`1 DE ${n} PARTES`,[])}
function seleccionarConsumos(){const opts=pendingUnits(mesa());if(!opts.length)return alert('NO HAY CONSUMOS PENDIENTES.');modalHTML('SELECCIONAR CONSUMOS',`<div class="checklist">${opts.map((o,i)=>`<label class="checkitem"><input type="checkbox" class="consumo-check" data-i="${i}" onchange="actualizarSeleccion()"><span>${esc(o.label)}</span><b>${money(o.precio)}</b></label>`).join('')}</div><div class="selection-total">SELECCIONADO: <b id="selTotal">${money(0)}</b></div>`,`<button class="primary" id="pagarSel">PAGAR SELECCIONADOS</button>`);window._optsSel=opts;document.querySelector('#pagarSel').onclick=()=>{const ids=[...document.querySelectorAll('.consumo-check:checked')].map(x=>Number(x.dataset.i));if(!ids.length)return alert('SELECCIONÁ AL MENOS UN CONSUMO.');const its=ids.map(i=>opts[i]);cerrarModal();setMonto(its.reduce((s,x)=>s+x.precio,0),'CONSUMOS SELECCIONADOS',its)}}
function actualizarSeleccion(){const ids=[...document.querySelectorAll('.consumo-check:checked')].map(x=>Number(x.dataset.i));document.querySelector('#selTotal').textContent=money(ids.reduce((s,i)=>s+window._optsSel[i].precio,0))}
function seleccionarMedio(el,medio){
  const base=Number($('#montoBase').value||0); if(!(base>0))return alert('ELEGÍ QUÉ VAS A COBRAR PRIMERO.');
  el.classList.toggle('active');
  const activos=[...document.querySelectorAll('.medio-option.active')].map(b=>b.dataset.medio);
  renderMediosMultiples(activos,medio);
}
function renderMediosMultiples(activos,nuevo){
  const base=Number($('#montoBase').value||0), box=$('#pagoPreview');
  if(!activos.length){box.innerHTML='';return}
  const anteriores={}; document.querySelectorAll('.medio-monto').forEach(i=>anteriores[i.dataset.medio]=Number(i.value||0));
  let usados=Object.entries(anteriores).filter(([m])=>activos.includes(m)).reduce((s,[,v])=>s+v,0);
  const valores={}; activos.forEach(m=>valores[m]=anteriores[m]||0);
  if(nuevo&&activos.includes(nuevo)&&!(nuevo in anteriores)) valores[nuevo]=Math.max(0,base-usados);
  if(activos.length===1) valores[activos[0]]=base;
  box.innerHTML=`<div class="multi-pay-list">${activos.map(m=>`<div class="multi-pay-row"><b>${m}${m==='CRÉDITO'?' +10%':''}</b><label>MONTO <input class="medio-monto" data-medio="${m}" type="number" min="0" step="1" value="${Math.round(valores[m]||0)}" oninput="actualizarPagoMultiple()"></label><button type="button" onclick="usarResto('${m}')">USAR RESTO</button></div>`).join('')}</div><div id="multiResumen"></div>`;
  actualizarPagoMultiple();
}
function usarResto(medio){const base=Number($('#montoBase').value||0);let otros=0;document.querySelectorAll('.medio-monto').forEach(i=>{if(i.dataset.medio!==medio)otros+=Number(i.value||0)});const el=document.querySelector(`.medio-monto[data-medio="${medio}"]`);if(el)el.value=Math.max(0,Math.round(base-otros));actualizarPagoMultiple()}
function actualizarPagoMultiple(){
  const base=Number($('#montoBase').value||0), asignaciones=[...document.querySelectorAll('.medio-monto')].map(i=>({medio:i.dataset.medio,base:Math.max(0,Number(i.value||0))}));
  const asignado=asignaciones.reduce((s,a)=>s+a.base,0), restante=Math.max(0,base-asignado), exceso=Math.max(0,asignado-base), credito=asignaciones.filter(a=>a.medio==='CRÉDITO').reduce((s,a)=>s+a.base,0), recargo=credito*.10, total=base+recargo;
  const efectivo=asignaciones.find(a=>a.medio==='EFECTIVO');
  $('#multiResumen').innerHTML=`<div class="summary"><div>TOTAL A DISTRIBUIR <b>${money(base)}</b></div><div>ASIGNADO <b>${money(asignado)}</b></div><div>RESTANTE <b>${money(restante)}</b></div>${recargo?`<div>RECARGO CRÉDITO 10% <b>${money(recargo)}</b></div>`:''}<div>TOTAL A COBRAR <b>${money(total)}</b></div></div>${efectivo&&efectivo.base>0?`<label>EFECTIVO RECIBIDO <input id="recibido" type="number" min="${efectivo.base}" oninput="calcVueltoMultiple(${efectivo.base})"></label><div id="vuelto"></div>`:''}${exceso>0?`<p class="pay-error">ASIGNASTE ${money(exceso)} DE MÁS.</p>`:''}<button class="primary" ${Math.abs(asignado-base)>.01?'disabled':''} onclick='confirmarPagoMultiple(${JSON.stringify(asignaciones)})'>CONFIRMAR PAGO</button>`;
}
function calcVueltoMultiple(efectivo){const r=Number($('#recibido')?.value||0);$('#vuelto').innerHTML=`VUELTO: <b>${money(Math.max(0,r-efectivo))}</b>`}
function confirmarPagoMultiple(asignaciones){
  const base=Number($('#montoBase').value||0), sumaAsignada=asignaciones.reduce((s,a)=>s+Number(a.base||0),0); if(Math.abs(sumaAsignada-base)>.01)return alert('TENÉS QUE DISTRIBUIR TODO EL MONTO ENTRE LOS MEDIOS DE PAGO.');
  asignaciones=asignaciones.filter(a=>a.base>0); if(!asignaciones.length)return alert('ELEGÍ AL MENOS UN MEDIO DE PAGO.');
  const ef=asignaciones.find(a=>a.medio==='EFECTIVO');let recibido=null,vuelto=0;if(ef){recibido=Number($('#recibido')?.value||0);if(recibido<ef.base)return alert('EL EFECTIVO RECIBIDO ES MENOR AL MONTO EN EFECTIVO.');vuelto=recibido-ef.base}
  const recargo=asignaciones.filter(a=>a.medio==='CRÉDITO').reduce((s,a)=>s+a.base*.10,0); const cleanItems=(pagoContexto.items||[]).map(x=>({label:x.label,precio:x.precio,ownerId:x.ownerId,refKey:x.refKey})); aplicarPagoAConsumos(base,pagoContexto.items);
  const medio=asignaciones.length===1?asignaciones[0].medio:'PAGO COMBINADO'; const pago={id:crypto.randomUUID(),fechaISO:new Date().toISOString(),medio,medios:asignaciones,base,recargo,cobrado:base+recargo,label:pagoContexto.label,items:cleanItems,recibido,vuelto};mesa().pagos.push(pago);save();mostrarPostPago(pago)
}
function calcVuelto(total){const r=Number($('#recibido').value||0);$('#vuelto').innerHTML=`VUELTO: <b>${money(Math.max(0,r-total))}</b>`}
function aplicarPagoAConsumos(base,items){let restante=base;if(items?.length){for(const it of items){if(restante+0.001<it.precio)continue;const ref=it.ref;if(ref&&Number(ref.pagado||0)<ref.cant){ref.pagado=Number(ref.pagado||0)+1;restante-=it.precio}}return}for(const it of pendingUnits(mesa())){if(restante+0.001<it.precio)continue;if(Number(it.ref.pagado||0)<it.ref.cant){it.ref.pagado=Number(it.ref.pagado||0)+1;restante-=it.precio}if(restante<=0.001)break}}
function mostrarPostPago(p){modalHTML('PAGO REGISTRADO ✓',`<div class="summary"><div>${esc(p.label||'PAGO')}<b>${money(p.cobrado)}</b></div><div>MEDIO<b>${p.medio}</b></div></div>`,`<button class="primary" onclick="imprimirTicketYVolver('${p.id}')">IMPRIMIR TICKET</button><button onclick="cerrarModal();mostrarCobro()">SALIR</button>`)}
function imprimirTicketYVolver(id){imprimirTicket(id);cerrarModal();mostrarCobro()}
function ticketItems(p){if(p.items?.length)return p.items;return [{label:p.label||'CONSUMO',precio:p.base}]}
function nombreProductoTicket(label){const t=String(label||'');const i=t.indexOf(' · ');return i>=0?t.slice(i+3):t}
function encabezadoComensalTicket(p){const l=String(p.label||'').trim();if(!l||l==='PAGO'||l==='TOTAL DE LA CUENTA'||l==='CONSUMOS SELECCIONADOS'||/^1 DE \d+ PARTES$/i.test(l))return '';return l}
function imprimirTicket(id){const p=mesa()?.pagos.find(x=>x.id===id)||data.historial.flatMap(x=>x.pagos||[]).find(x=>x.id===id);if(!p)return alert('No se encontró el pago.');const m=mesa()?.id||'';const d=new Date(p.fechaISO),items=ticketItems(p),medios=p.medios?.length?p.medios:[{medio:p.medio,base:p.base}],comensal=encabezadoComensalTicket(p);const w=window.open('','_blank','width=420,height=700');w.document.write(`<!doctype html><html><head><title>TICKET</title><style>@page{size:58mm auto;margin:2mm}*{box-sizing:border-box}html,body{width:54mm;max-width:54mm;margin:0;padding:0}body{font-family:Consolas,"Courier New",monospace;font-size:12px;line-height:1.25;font-weight:600;text-transform:uppercase;color:#000;overflow-wrap:anywhere;word-break:normal}.c{text-align:center}.r{display:grid;grid-template-columns:minmax(0,1fr) 15mm;column-gap:1mm;align-items:start;width:48mm}.r span{min-width:0;white-space:normal;overflow-wrap:anywhere}.r b{text-align:right;white-space:nowrap;min-width:0}.line{border-top:1px dashed #000;margin:6px 0;width:48mm}b{font-weight:700}</style></head><body><div class="c"><b>BOEDO Y MÁS ALLÁ</b></div><div class="line"></div><div>${d.toLocaleDateString('es-AR')}</div><div>${d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})} HS</div><div><b>MESA ${m}</b></div>${comensal?`<div><b>${esc(comensal)}</b></div>`:''}<div class="line"></div>${items.map(x=>`<div class="r"><span>${esc(nombreProductoTicket(x.label))}</span><b>${money(x.precio)}</b></div>`).join('')}<div class="line"></div><div class="r"><span>CONSUMO</span><b>${money(p.base)}</b></div>${p.recargo?`<div class="r"><span>RECARGO CRÉDITO 10%</span><b>${money(p.recargo)}</b></div>`:''}<div class="r"><b>TOTAL</b><b>${money(p.cobrado)}</b></div><div class="line"></div>${medios.map(a=>`<div class="r"><span>${esc(a.medio)}</span><b>${money(a.base+(a.medio==='CRÉDITO'?a.base*.10:0))}</b></div>`).join('')}${p.recibido!==null&&p.recibido!==undefined?`<div class="r"><span>EFECTIVO RECIBIDO</span><b>${money(p.recibido)}</b></div><div class="r"><span>VUELTO</span><b>${money(Math.max(0,p.vuelto||0))}</b></div>`:''}<div class="line"></div><div class="c">¡MUCHAS GRACIAS!</div><script>window.onload=()=>window.print();window.onafterprint=()=>window.close()<\/script></body></html>`);w.document.close()}
function anularPago(i){if(!confirm('¿ANULAR ESTE PAGO?'))return;const p=mesa().pagos[i];for(const it of (p.items||[])){const arr=it.ownerId==='mesa'?mesa().consumosMesa:(mesa().comensales.find(c=>c.id===it.ownerId)?.consumos||[]);const ref=arr.find(x=>(x.key||x.id||x.nombre)===it.refKey);if(ref&&Number(ref.pagado||0)>0)ref.pagado--}mesa().pagos.splice(i,1);save();mostrarCobro()}
function cerrarMesa(){const m=mesa(),total=totalMesa(m);if(!total)return alert('La mesa no tiene consumos para cerrar.');if(pendiente(m)>0)return alert(`Todavía quedan ${money(pendiente(m))} pendientes. La mesa solo puede cerrarse cuando el pendiente llegue a $0.`);if(!confirm(`¿Cerrar MESA ${m.id}?\nTotal consumo: ${money(total)}\nTotal cobrado: ${money(total+recargos(m))}`))return;data.historial.unshift({id:crypto.randomUUID(),mesa:m.id,fechaISO:new Date().toISOString(),consumosMesa:structuredClone(m.consumosMesa),comensales:structuredClone(m.comensales),pagos:structuredClone(m.pagos),total,recargos:recargos(m),totalCobrado:total+recargos(m)});const id=m.id;const idx=data.mesas.findIndex(x=>x.id===id);if(idx>=0)data.mesas[idx]={id,comensales:[],consumosMesa:[],pagos:[],ultimaComanda:null};save();renderMesas()}
function fechaHora(i){return new Date(i).toLocaleString('es-AR',{dateStyle:'short',timeStyle:'short'})} function detalleHistorial(x){const filas=a=>(a||[]).map(i=>`<div class="item">${i.cant} × ${esc(i.nombre)} · ${money(i.precio*i.cant)}</div>`).join('')||'<p class="muted">Sin consumos.</p>';return `<div class="detail"><h4>CONSUMO GENERAL · ${money(suma(x.consumosMesa||[]))}</h4>${filas(x.consumosMesa)}${(x.comensales||[]).map(c=>`<h4>${esc(c.nombre)} · ${money(suma(c.consumos||[]))}</h4>${filas(c.consumos)}`).join('')}<h4>PAGOS</h4>${(x.pagos||[]).map(p=>`<div>${p.medio}: ${money(p.base)}${p.recargo?` + ${money(p.recargo)} recargo`:''} = ${money(p.cobrado)}</div>`).join('')}</div>`}
function renderHistorial(){mesaId=null;const h=data.historial||[];$('#app').innerHTML=`<div class="wrap"><div class="row between"><div><button onclick="renderMesas()">← Mesas</button><h2>HISTORIAL / CIERRE DE CAJA</h2></div></div><div class="row"><button class="primary" onclick="descargarHistorialPDF()">DESCARGAR HISTORIAL EN PDF</button><button class="danger" onclick="borrarHistorial()">Borrar historial</button></div><div class="history">${h.length?h.map(x=>`<div class="card"><div class="row between"><div><h3>MESA ${x.mesa}</h3><div class="muted">${fechaHora(x.fechaISO)}</div></div></div><details><summary>Ver detalle</summary>${detalleHistorial(x)}<div class="spacer"></div>${(x.pagos||[]).map(p=>`<button onclick="reimprimirHistorial('${x.id}','${p.id}')">REIMPRIMIR ${esc(p.label||'TICKET')}</button>`).join(' ')}</details></div>`).join(''):'<div class="card">Todavía no hay mesas cerradas.</div>'}</div></div>`}
function reimprimirHistorial(hid,pid){const h=data.historial.find(x=>x.id===hid),p=h?.pagos.find(x=>x.id===pid);if(!p)return;const old=mesaId;mesaId=h.mesa;imprimirTicket(pid);mesaId=old}
function pdfEscape(s){return String(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[^\x20-\x7E]/g,c=>({Á:'A',É:'E',Í:'I',Ó:'O',Ú:'U',Ñ:'N','á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n','¿':'','¡':''}[c]||''))}
function descargarHistorialPDF(){
  const h=(data.historial||[]).slice().reverse();
  if(!h.length)return alert('NO HAY OPERACIONES PARA DESCARGAR.');
  const now=new Date();
  let gran=0;
  const nombrePago=p=>{
    const l=String(p.label||'').trim();
    if(l&&l!=='PAGO'&&l!=='TOTAL DE LA CUENTA'&&l!=='MESA COMPLETA'&&l!=='CONSUMOS SELECCIONADOS'&&!/^1 DE \d+ PARTES$/i.test(l))return l;
    const owners=[...new Set((p.items||[]).map(it=>String(it.label||'').split(' · ')[0].trim()).filter(x=>x&&x!=='GENERAL'))];
    return owners.length===1?owners[0]:'';
  };
  const bloques=h.map(x=>{
    const d=new Date(x.fechaISO),ps=x.pagos||[];
    gran+=Number(x.totalCobrado||x.total||0);
    let filas='';
    ps.forEach(p=>{
      const nombre=nombrePago(p);
      const medios=p.medios?.length?p.medios:[{medio:p.medio,base:p.base}];
      medios.forEach((a,i)=>{
        const importe=Number(a.base||0)+(a.medio==='CRÉDITO'?Number(a.base||0)*.10:0);
        filas+=`<div class="pago-row"><span class="persona">${i===0&&nombre?esc(nombre):''}</span><b class="monto">${money(importe)}</b><span class="medio">${esc(a.medio||'')}</span></div>`;
      });
    });
    return `<section><div class="mesa-title">MESA ${x.mesa}</div><div class="hora">${d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})} HS</div><div class="pagos">${filas}</div></section>`;
  }).join('');
  const w=window.open('','_blank','width=800,height=900');
  const logoURL=new URL('logo-boedo.png',document.baseURI).href;
  w.document.write(`<!doctype html><html><head><title></title><style>
  @page{size:A4 portrait;margin:0}
  html,body{margin:0;padding:0}
  body{padding:15mm}
  *{box-sizing:border-box}
  body{font-family:"Courier New",monospace;color:#000;background:#fff;text-transform:uppercase;font-size:12px;margin:0}
  .logo{text-align:center;margin:0 0 12px}.logo img{width:220px;max-height:90px;object-fit:contain}
  .titulo{text-align:center;font-size:15px;font-weight:700;margin:0 0 10px}
  .meta{text-align:center;margin-bottom:18px;line-height:1.6;font-weight:700}
  section{padding:13px 0;border-top:1px dashed #000;break-inside:avoid}
  .mesa-title{text-align:center;font-size:14px;font-weight:700}
  .hora{text-align:center;margin:3px 0 9px;font-weight:700}
  .pagos{width:100%}
  .pago-row{display:grid;grid-template-columns:1fr 32mm 42mm;column-gap:8mm;align-items:baseline;padding:3px 8mm}
  .persona{text-align:left}.monto{text-align:right;white-space:nowrap}.medio{text-align:left;font-weight:700}
  .gran{border-top:2px solid #000;margin-top:16px;padding-top:12px;font-size:14px;font-weight:700;display:flex;justify-content:space-between}
  </style></head><body><div class="logo"><img src="${logoURL}" alt="BOEDO Y MÁS ALLÁ"></div><div class="titulo">HISTORIAL DE VENTAS</div><div class="meta">${now.toLocaleDateString('es-AR')}<br>CIERRE: ${now.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})} HS</div>${bloques}<div class="gran"><span>TOTAL DEL CIERRE</span><span>${money(gran)}</span></div><script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`);
  w.document.close();
}
function borrarHistorial(){if(!data.historial.length)return alert('El historial ya está vacío.');if(confirm('¿Borrar TODO el historial? Esta acción no se puede deshacer.')&&confirm('Última confirmación: ¿seguro?')){data.historial=[];save();renderHistorial()}} function resetMesas(){if(confirm(`¿REINICIAR LAS ${data.mesas.length} MESAS ABIERTAS? EL HISTORIAL NO SE BORRARÁ.`)){data.mesas=data.mesas.map(m=>({id:m.id,comensales:[],consumosMesa:[],pagos:[],ultimaComanda:null}));save();renderMesas()}}
renderMesas();
