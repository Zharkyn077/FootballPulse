$(function () {
  const EV = { 9: ['Yellow card, Chelsea'], 23: ['GOAL, Arsenal', '1 – 0'], 38: ['Substitution, Chelsea'], 45: ['Half-time'], 57: ['GOAL, Chelsea', '1 – 1'], 70: ['Yellow card, Arsenal'], 81: ['GOAL, Arsenal', '2 – 1'], 90: ['Full-time'] };
  let min = 0, timer;
  function play() {
    clearInterval(timer); min = 0; $('#evs').html('<li><b>0\'</b>Kick-off at the Emirates</li>'); $('#score').text('0 – 0'); $('#prog').css('width', 0);
    timer = setInterval(() => {
      min++; $('#clock').text(min); $('#prog').css('width', min / 90 * 100 + '%');
      if (EV[min]) { if (EV[min][1]) $('#score').text(EV[min][1]); $(`<li><b>${min}'</b>${EV[min][0]}</li>`).hide().prependTo('#evs').slideDown(200) }
      if (min >= 90) clearInterval(timer)
    }, 250)
  }
  $('#replay').on('click', play); play();
  $('[data-n]').each(function () { const el = $(this), n = el.data('n'); $({ v: 0 }).animate({ v: n }, { duration: 1200, step: v => el.text(Math.round(v)) }) });
  // follow a club
  $('#club').html(TEAMS.map(t => `<option>${t.club}</option>`).join(''));
  const saved = localStorage.getItem('fpClub'); if (saved && TEAMS.some(t => t.club === saved)) $('#club').val(saved);
  function show() {
    const c = $('#club').val(); localStorage.setItem('fpClub', c);
    const sorted = [...TEAMS].map(t => ({ ...t, pts: t.w * 3 + t.d, gd: t.gd })).sort((a, b) => b.pts - a.pts || b.gd - a.gd), i = sorted.findIndex(t => t.club === c), t = sorted[i];
    const nx = MATCHES.find(m => m.home === c || m.away === c);
    $('#clubInfo').hide().html(`<p class="mb-1"><strong class="h4">${c}</strong> sit <strong>${i + 1}${['st', 'nd', 'rd'][i] || 'th'}</strong> on ${t.pts} points, goal difference ${t.gd > 0 ? '+' : ''}${t.gd}.</p><p class="mb-0">${nx ? `Demo fixture: ${nx.home} vs ${nx.away}, ${nx.date}. <a href="tickets.html?match=${nx.id}">Get tickets</a>` : 'No fixture on our list yet. Check the <a href="matches.html">schedule</a>.'}</p>`).fadeIn(250)
  }
  $('#club').on('change', show); show();
});
