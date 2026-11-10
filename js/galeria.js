
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
