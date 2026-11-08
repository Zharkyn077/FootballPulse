$(function () {
    const comps = ['All', ...new Set(MATCHES.map(m => m.comp))];
    $('#comp').html(comps.map(c => `<option>${c}</option>`).join(''));
    function render() {
        const c = $('#comp').val(), list = MATCHES.filter(m => c === 'All' || m.comp === c);
        $('#fx').html(list.length ? list.map(m => `<div class="fx"><button class="fx-head" aria-expanded="false"><span>${m.home} vs ${m.away}</span><span class="meta">${m.date}</span></button><div class="fx-body"><p class="mb-1"><span class="tag">${m.comp}</span></p><p class="meta">${m.venue} · from $${m.price}</p><a class="btn btn-fp btn-sm" href="tickets.html?match=${m.id}">Buy tickets</a></div></div>`).join('') : '<div class="empty">No fixtures in this competition.</div>');
    }
    $('#fx').on('click', '.fx-head', function () {
        const b = $(this).next('.fx-body'), open = !b.is(':visible');
        $('.fx-body').not(b).stop(true, true).slideUp(200).prev().attr('aria-expanded', 'false');
        b.stop(true, true).slideToggle(250); $(this).attr('aria-expanded', open);
    });
    $('#comp').on('change', render); render();
});
$(function () {
    const next = MATCHES.map(m => ({ m, t: new Date(m.date.replace(' ', 'T')) })).filter(x => x.t > new Date()).sort((a, b) => a.t - b.t)[0];
    if (!next) { $('#cd').text('Season break. No fixtures left.'); return }
    function tick() {
        let s = Math.max(0, Math.floor((next.t - new Date()) / 1000)); const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), mi = Math.floor(s % 3600 / 60);
        $('#cd').html(`<span>Next up: <strong>${next.m.home} vs ${next.m.away}</strong></span><span class="big">${d}d ${h}h ${mi}m ${s % 60}s</span>`)
    }
    tick(); setInterval(tick, 1000);
});
