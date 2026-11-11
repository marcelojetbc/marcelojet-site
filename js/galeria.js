
document.querySelectorAll('.galeria').forEach(function(g){
  var t=g.querySelector('.trilho'), fotos=t.querySelectorAll('img');
  t.scrollLeft=0;
  if(fotos.length<2) return;
  var pts=document.createElement('div'); pts.className='pontos';
  fotos.forEach(function(){pts.appendChild(document.createElement('i'))});
  g.appendChild(pts);
  function mk(cls,txt,dir,label){var b=document.createElement('button');b.type='button';b.className='seta '+cls;b.textContent=txt;b.setAttribute('aria-label',label);
    b.addEventListener('click',function(){t.scrollBy({left:dir*t.clientWidth,behavior:'smooth'})});g.appendChild(b)}
  mk('ant','‹',-1,'Foto anterior'); mk('prox','›',1,'Próxima foto');
  function marca(){var i=Math.round(t.scrollLeft/t.clientWidth);pts.querySelectorAll('i').forEach(function(p,k){p.classList.toggle('on',k===i)})}
  t.addEventListener('scroll',function(){window.requestAnimationFrame(marca)},{passive:true}); marca();
});

(function(){
  var K='mj_art1', ART='cota-de-lancha-e-jet-ski-como-funciona.html';
  function lerL(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function grava(k,v,sess){try{(sess?sessionStorage:localStorage).setItem(k,v)}catch(e){}}
  function lerS(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
  if(location.pathname.indexOf(ART)>-1){grava(K,'lido');}
  if(lerL(K)==='lido'){document.documentElement.classList.add('art-lido');return;}
  if(lerL(K+'_x')||lerS(K+'_s'))return;
  setTimeout(function(){
    if(window.__clubeVai) return;
    var w=document.createElement('div');w.className='notif';w.setAttribute('role','status');
    w.innerHTML='<a class="notif-link" href="'+ART+'"><span class="notif-ico" aria-hidden="true">MJ</span><span class="notif-txt"><span class="notif-top"><b>MARCELO JET</b><i>agora</i></span><strong>Cota vale a pena? Veja a conta</strong><span>O dinheiro que sobra pode pagar o custo fixo. Veja a conta com lanchas e jets reais.</span></span></a><button class="notif-x" type="button" aria-label="Fechar">&times;</button>';
    document.body.appendChild(w);grava(K+'_s','1',true);
    requestAnimationFrame(function(){w.classList.add('on')});
    w.querySelector('.notif-x').onclick=function(){w.classList.remove('on');grava(K+'_x','1');setTimeout(function(){w.remove()},400)};
    w.querySelector('.notif-link').onclick=function(){try{fbq('trackCustom','CliqueNovidade',{content_name:'artigo cota'})}catch(e){}};
  },3500);
})();

(function(){
  document.querySelectorAll('.tab-box').forEach(function(box){
    var w=box.querySelector('.tabela-wrap'); if(!w) return;
    var dica=box.previousElementSibling;
    function marca(){ if(w.scrollLeft+w.clientWidth>=w.scrollWidth-4) box.classList.add('fim'); else box.classList.remove('fim'); }
    w.addEventListener('scroll',function(){ marca(); if(!box.auto && w.scrollLeft>20 && dica && dica.classList.contains('tab-dica')) dica.style.opacity='.55'; },{passive:true});
    marca();
    if(!('IntersectionObserver' in window) || w.scrollWidth<=w.clientWidth) return;
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ io.disconnect();
      box.auto=true; setTimeout(function(){ w.scrollTo({left:90,behavior:'smooth'}); setTimeout(function(){ w.scrollTo({left:0,behavior:'smooth'}); setTimeout(function(){box.auto=false},700); },900); },500); } }); },{threshold:.6});
    io.observe(w);
  });
})();

(function(){
  var s=document.querySelector('.lanc'); if(!s) return;
  var jets=[].slice.call(s.querySelectorAll('.lanc-jet')), n=jets.length;
  var dados=JSON.parse(document.getElementById('lanc-dados').textContent);
  var pts=[].slice.call(s.querySelectorAll('.lanc-pontos button'));
  var fundo=s.querySelector('.lanc-fundo'), nome=s.querySelector('.lanc-nome'), preco=s.querySelector('.lanc-preco strong');
  var modal=s.querySelector('.lanc-modal'), fichas=[].slice.call(s.querySelectorAll('.lanc-ficha'));
  var atual=+s.querySelector('.lanc-palco').dataset.inicial||0, timer=null, parado=false;
  function pos(i){var d=(i-atual+n)%n; if(d>n/2) d-=n; return d;}
  function mostra(){
    jets.forEach(function(j,i){j.dataset.pos=pos(i); j.tabIndex=pos(i)===0?0:-1;});
    pts.forEach(function(p,i){p.classList.toggle('on',i===atual);});
    var d=dados[atual]; nome.textContent='Sea-Doo '+d.nome+' · '+d.ano; preco.textContent=d.preco;
    fundo.style.opacity=0; setTimeout(function(){fundo.textContent=d.nome; fundo.style.opacity=1;},200);
  }
  function vai(i){atual=(i+n)%n; mostra();}
  function auto(){clearInterval(timer); if(!parado) timer=setInterval(function(){vai(atual+1);},4500);}
  function para(){parado=true; clearInterval(timer);}
  function abre(){
    para(); fichas.forEach(function(f){f.hidden=+f.dataset.i!==atual;}); modal.hidden=false;
    try{fbq('track','ViewContent',{content_name:'Sea-Doo '+dados[atual].nome+' 2027',content_category:'Pre-venda 2027'});}catch(e){}
  }
  function fecha(){modal.hidden=true;}
  jets.forEach(function(j,i){j.addEventListener('click',function(){ if(moveu) return; if(i===atual) abre(); else {para(); vai(i);} });});
  pts.forEach(function(p,i){p.addEventListener('click',function(){para(); vai(i);});});
  s.querySelector('.lanc-seta.ant').addEventListener('click',function(){para(); vai(atual-1);});
  s.querySelector('.lanc-seta.prox').addEventListener('click',function(){para(); vai(atual+1);});
  s.querySelector('.lanc-abrir').addEventListener('click',abre);
  s.querySelector('.lanc-fechar').addEventListener('click',fecha);
  modal.addEventListener('click',function(e){if(e.target===modal) fecha();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape') fecha();});
  var palco=s.querySelector('.lanc-palco'), x0=null, moveu=false;
  palco.addEventListener('pointerdown',function(e){x0=e.clientX; moveu=false;});
  palco.addEventListener('pointermove',function(e){if(x0!==null && Math.abs(e.clientX-x0)>10) moveu=true;});
  palco.addEventListener('pointerup',function(e){ if(x0===null) return; var dx=e.clientX-x0; x0=null;
    if(Math.abs(dx)>40){para(); vai(atual+(dx<0?1:-1));} setTimeout(function(){moveu=false;},0); });
  palco.addEventListener('pointercancel',function(){x0=null;});
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) parado=true;
  mostra(); auto();
})();

(function(){
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.video-slide'); if(!b) return;
    var m=document.createElement('div'); m.className='video-modal';
    m.innerHTML='<video src="'+b.dataset.video+'" controls autoplay playsinline></video><button type="button" aria-label="Fechar vídeo">×</button>';
    function fecha(){var v=m.querySelector('video'); v.pause(); m.remove(); document.removeEventListener('keydown',esc);}
    function esc(ev){if(ev.key==='Escape') fecha();}
    m.addEventListener('click',function(ev){if(ev.target===m||ev.target.tagName==='BUTTON') fecha();});
    document.addEventListener('keydown',esc); document.body.appendChild(m);
    try{fbq('trackCustom','VideoTriton370');}catch(err){} try{gtag('event','video_play',{item:'Triton 370'});}catch(err){}
  });
})();

(function(){
  document.querySelectorAll('.v360').forEach(function(el){
    var pasta=el.dataset.pasta,n=+el.dataset.total,img=el.querySelector('img'),fr=[],carregou=false,i=0,x0=null,i0=0,auto=null;
    function src(k){return pasta+'/'+(k<10?'0':'')+k+'.webp';}
    function carrega(){if(carregou)return;carregou=true;for(var k=0;k<n;k++){var im=new Image();im.src=src(k);fr.push(im);}}
    function mostra(k){i=Math.max(0,Math.min(n-1,k));img.src=src(i);}
    function para(){if(auto){clearInterval(auto);auto=null;}}
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){carrega();io.disconnect();
        var d=1;setTimeout(function(){auto=setInterval(function(){var k=i+d;if(k>=n-1||k<=0)d=-d;mostra(k);if(i===0)para();},90);},700);}});},{rootMargin:'300px'});
      io.observe(el);
    } else carrega();
    el.addEventListener('pointerdown',function(e){carrega();para();x0=e.clientX;i0=i;el.classList.add('usou');try{el.setPointerCapture(e.pointerId);}catch(err){}});
    el.addEventListener('pointermove',function(e){if(x0===null)return;var dx=e.clientX-x0;mostra(i0-Math.round(dx/(el.clientWidth/n*1.6)));});
    function fim(){x0=null;}
    el.addEventListener('pointerup',fim);el.addEventListener('pointercancel',fim);
    el.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){para();mostra(i-1);}if(e.key==='ArrowRight'){para();mostra(i+1);}});
  });
})();

(function(){
  var LINK='https://chat.whatsapp.com/HglJcE6iFeTETSwFQysb6a', K='mj_clube';
  function ler(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function grava(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  var entrou=ler(K+'_ok'), fechou=+ler(K+'_x')||0;
  if(entrou || (Date.now()-fechou) < 7*864e5) return;
  window.__clubeVai=true;
  var feito=false;
  function abre(){
    if(feito) return; feito=true; window.removeEventListener('scroll',rola);
    var o=document.createElement('div'); o.className='clube'; o.setAttribute('role','dialog'); o.setAttribute('aria-modal','true'); o.setAttribute('aria-label','Clube do Mar');
    o.innerHTML='<div class="clube-caixa"><button type="button" class="clube-x" aria-label="Fechar">&times;</button>'+
      '<span class="clube-tag">Clube do Mar | Marcelo Jet</span>'+
      '<h2>Veja as oportunidades antes de todo mundo</h2>'+
      '<p>Comunidade gratuita no WhatsApp. Tudo é anunciado primeiro lá e só depois no Instagram.</p>'+
      '<ul><li><span>🚤</span>Venda de jets e lanchas</li><li><span>🤝</span>Cotas náuticas (Boatlux)</li><li><span>⏳</span>Oportunidades antes da temporada</li><li><span>🌊</span>Aluguel de embarcações</li><li><span>🎓</span>Escola náutica</li><li><span>⚓</span>Guarda de Jet</li><li><span>🎉</span>Eventos náuticos na região</li></ul>'+
      '<a class="clube-btn" href="'+LINK+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z"/></svg>Entrar no Clube do Mar</a>'+
      '<button type="button" class="clube-nao">Agora não</button></div>';
    document.body.appendChild(o); requestAnimationFrame(function(){o.classList.add('on')});
    try{gtag('event','clube_popup_visto')}catch(e){}
    function fecha(){grava(K+'_x',String(Date.now())); o.classList.remove('on'); setTimeout(function(){o.remove()},350); document.removeEventListener('keydown',esc);}
    function esc(e){if(e.key==='Escape') fecha();}
    o.querySelector('.clube-x').onclick=fecha; o.querySelector('.clube-nao').onclick=fecha;
    o.addEventListener('click',function(e){if(e.target===o) fecha();});
    document.addEventListener('keydown',esc);
    o.querySelector('.clube-btn').addEventListener('click',function(){
      grava(K+'_ok','1');
      try{fbq('trackCustom','EntrarClubeDoMar',{pagina:location.pathname})}catch(e){}
      try{gtag('event','entrar_clube_do_mar',{pagina:location.pathname})}catch(e){}
      setTimeout(function(){o.remove()},300);
    });
  }
  function rola(){var h=document.documentElement; if((h.scrollTop+innerHeight)/h.scrollHeight>0.5) abre();}
  setTimeout(abre,10000); window.addEventListener('scroll',rola,{passive:true});
})();
