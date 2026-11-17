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
    const fixtureName = { 'Newcastle United': 'Newcastle', 'AFC Bournemouth': 'Bournemouth', 'Tottenham Hotspur': 'Tottenham', 'Brighton & Hove Albion': 'Brighton' }[c] || c;
    const nx = MATCHES.find(m => m.home === fixtureName || m.away === fixtureName);
    $('#clubInfo').hide().html(`<p class="mb-1"><strong class="h4">${c}</strong> sit <strong>${i + 1}${['st', 'nd', 'rd'][i] || 'th'}</strong> on ${t.pts} points, goal difference ${t.gd > 0 ? '+' : ''}${t.gd}.</p><p class="mb-0">${nx ? `Demo fixture: ${nx.home} vs ${nx.away}, ${nx.date}. <a href="tickets.html?match=${nx.id}">Get tickets</a>` : 'No fixture on our list yet. Check the <a href="matches.html">schedule</a>.'}</p>`).fadeIn(250);
    drawLab();
  }
  let imaginedResult = 'W';
  function drawLab() {
    const club = $('#club').val(), selected = TEAMS.find(team => team.club === club);
    if (!selected) return;
    const bonus = { W: 3, D: 1, L: 0 }[imaginedResult];
    const ordered = [...TEAMS].sort((a, b) => b.pts - a.pts || b.gd - a.gd);
    const before = ordered.findIndex(team => team.club === club) + 1;
    const after = [...TEAMS].map(team => ({ ...team, pts: team.club === club ? team.pts + bonus : team.pts })).sort((a, b) => b.pts - a.pts || b.gd - a.gd).findIndex(team => team.club === club) + 1;
    $('#labClub').text(club);
    $('#labPoints').text(selected.pts + bonus);
    $('#labRank').text('#' + after);
    $('#labInsight').text(after < before ? `That result could lift ${club} from #${before} to #${after}.` : after > before ? `${club} could move from #${before} to #${after}.` : `${club} would hold #${before} with ${selected.pts + bonus} points.`);
    $('.result-pick').each(function () { const active = $(this).data('result') === imaginedResult; $(this).toggleClass('active', active).attr('aria-pressed', String(active)) });
  }
  $('.result-pick').on('click', function () { imaginedResult = $(this).data('result'); drawLab() });
  $('#club').on('change', show); show();
  function getSaved() { try { const value = JSON.parse(localStorage.getItem('fpSaved') || '[]'); return Array.isArray(value) ? value : [] } catch { return [] } }
  function getBookings() { try { const value = JSON.parse(localStorage.getItem('fpBookings') || '[]'); return Array.isArray(value) ? value : [] } catch { return [] } }
  function getWatchlist() { try { const value = JSON.parse(localStorage.getItem('fpWatchlist') || '[]'); return Array.isArray(value) ? value : [] } catch { return [] } }
  function shortlist() {
    const stories = getSaved().map(id => NEWS.find(item => item.id === id)).filter(Boolean);
    const bookings = getBookings();
    const watchlist = getWatchlist().map(id => MATCHES.find(match => match.id === id)).filter(Boolean);
    $('#clearShortlist').prop('disabled', !stories.length);
    const storyCards = stories.map(item => `<div class="col-md-6 col-xl-4"><article class="fp-card"><span class="tag">Saved story</span><h3 class="h5 mt-3">${item.title}</h3><p class="meta">${item.cat} · ${item.date}</p><a href="${item.source}" target="_blank" rel="noopener noreferrer">Read article ↗</a><button class="btn btn-line btn-sm ms-2 remove-story" type="button" data-id="${item.id}">Remove</button></article></div>`);
    const bookingCards = bookings.map(item => `<div class="col-md-6 col-xl-4"><article class="fp-card"><span class="tag">Demo booking</span><h3 class="h5 mt-3">${$('<span>').text(item.match).html()}</h3><p class="meta">${$('<span>').text(item.stand).html()} stand · ${item.qty} ticket${item.qty === 1 ? '' : 's'} · $${item.total}</p><a href="tickets.html">Manage bookings →</a></article></div>`);
    const matchCards = watchlist.map(match => `<div class="col-md-6 col-xl-4"><article class="fp-card"><span class="tag">Watching · demo</span><h3 class="h5 mt-3">${match.home} vs ${match.away}</h3><p class="meta">${match.date} · ${match.comp}</p><a href="matches.html">Open match planner →</a></article></div>`);
    $('#shortlist').html(storyCards.length || bookingCards.length || matchCards.length ? [...storyCards, ...matchCards, ...bookingCards].join('') : '<div class="col-12"><div class="empty">Nothing saved yet. Star a story, watch a demo fixture or try a booking to build your shortlist.</div></div>');
  }
  $('#shortlist').on('click', '.remove-story', function () { const id = +$(this).data('id'); localStorage.setItem('fpSaved', JSON.stringify(getSaved().filter(value => value !== id))); shortlist() });
  $('#clearShortlist').on('click', function () { localStorage.setItem('fpSaved', '[]'); shortlist() });
  shortlist();
});
