(function(){
  if(!window.fbq) return;
  var paginas = {
    '': 'Inicial', 'index.html': 'Inicial',
    'balneario-camboriu.html': 'Cotas Balneário Camboriú',
    'balneario-picarras.html': 'Cotas Balneário Piçarras',
    'itapema.html': 'Cotas Itapema',
    'como-funciona.html': 'Como funciona a cota',
    'venda-de-jet-ski.html': 'Venda de jet ski',
    'guarda-de-jet-ski.html': 'Guarda de jet ski',
    'escola-nautica-balneario-camboriu.html': 'Escola náutica Barcosul',
    'venda-de-lancha.html': 'Venda de lancha'
  };
  var arq = location.pathname.split('/').pop();
  var pagina = paginas[arq] || arq;
  var categoria = /escola/.test(arq) ? 'Escola náutica' : /lancha/.test(arq) ? 'Venda de lancha' : /venda/.test(arq) ? 'Venda de jet' : /guarda/.test(arq) ? 'Guarda de jet' : 'Cotas';
  if (arq && arq !== 'index.html') fbq('track', 'ViewContent', {content_name: pagina, content_category: categoria});

  function nomeItem(el){
    var card = el.closest('article');
    var h3 = card && card.querySelector('h3');
    return h3 ? h3.textContent.trim() : (el.textContent || '').trim();
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1) {
      var item = nomeItem(a);
      var cat = /escola/.test(arq) ? 'Escola náutica' : /venda-de-lancha/.test(arq) ? 'Venda de lancha' : /jet à venda|esse jet|parecido/i.test(a.textContent + item) && /venda/.test(arq) ? 'Venda de jet'
              : /guarda|plano/i.test(a.textContent) || /guarda/.test(arq) ? 'Guarda de jet' : 'Cotas';
      fbq('track', 'Contact', {content_name: item, content_category: cat, pagina: pagina});
    } else if (href.indexOf('instagram.com') > -1) {
      fbq('trackCustom', 'CliqueInstagram', {pagina: pagina});
    }
  }, true);
})();
