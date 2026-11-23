/* Marca de onde a pessoa veio na mensagem do WhatsApp:
   anúncio do Google -> "(vim pelo Google)", Instagram/Facebook -> "(vim pelo Instagram)", resto -> "(vim pelo site)".
   A origem fica guardada por 7 dias, para quem volta depois ao site. */
(function(){
  var CHAVE = 'mj_origem', PRAZO = 7 * 24 * 60 * 60 * 1000;
  var q = location.search, ref = document.referrer || '';
  var nova = null;
  if (/[?&](gclid|gbraid|wbraid)=/.test(q) || (/utm_source=google/i.test(q) && /utm_medium=(cpc|ppc|paid)/i.test(q))) nova = 'Google';
  else if (/[?&]fbclid=/.test(q) || /utm_source=(instagram|ig|facebook|fb|meta)/i.test(q) || /instagram\.com|facebook\.com|l\.instagram|lm\.facebook/i.test(ref)) nova = 'Instagram';

  function ler(){
    try { var v = JSON.parse(localStorage.getItem(CHAVE) || 'null'); if (v && Date.now() - v.t < PRAZO) return v.o; } catch(e){}
    return null;
  }
  if (nova) { try { localStorage.setItem(CHAVE, JSON.stringify({o: nova, t: Date.now()})); } catch(e){} }
  var origem = nova || ler() || 'site';
  var marca = ' (vim pelo ' + origem + ')';

  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me/') === -1 || href.indexOf('vim%20pelo') > -1) return;
    var partes = href.split('?text=');
    var texto = partes[1] ? decodeURIComponent(partes[1]) : 'Oi Marcelo';
    a.setAttribute('href', partes[0] + '?text=' + encodeURIComponent(texto + marca));
  }, true);
})();

/* Black November: tira a faixa e o selo da promoção a partir de 01/12/2026 (horário de Brasília). */
(function(){
  if (Date.now() < Date.parse('2026-12-01T00:00:00-03:00')) return;
  function limpar(){
    document.querySelectorAll('.bf-faixa,.bf-tag').forEach(function(el){ el.remove(); });
    document.querySelectorAll('.bf-selo').forEach(function(el){ el.textContent = 'Oportunidade'; el.classList.remove('bf-selo'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', limpar); else limpar();
})();
