$(function () {
    const storageKey = 'fpWatchlist';
    const competitions = ['All', ...new Set(MATCHES.map(match => match.comp))];
    $('#comp').html(competitions.map(item => `<option>${item}</option>`).join(''));
    function readWatchlist() {
        try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value.filter(id => MATCHES.some(match => match.id === id)) : [] }
        catch { return [] }
    }
    let watched = readWatchlist();
    let openFixture = null;
    function storeWatchlist() { localStorage.setItem(storageKey, JSON.stringify(watched)); render() }
    function toggleWatch(id) { watched = watched.includes(id) ? watched.filter(value => value !== id) : [...watched, id]; storeWatchlist() }
    function safe(text) { return $('<span>').text(text).html() }
    function calendarFile(match) {
        const start = new Date(match.date.replace(' ', 'T'));
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        const stamp = date => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}00`;
        const escape = value => String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
        const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FootballPulse//Demo Fixture Planner//EN', 'BEGIN:VEVENT', `UID:footballpulse-demo-${match.id}@local`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${escape('DEMO: ' + match.home + ' vs ' + match.away)}`, `LOCATION:${escape(match.venue)}`, 'DESCRIPTION:Educational simulation. Verify any real fixture with the competition organiser.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
        const link = document.createElement('a'); link.href = url; link.download = `footballpulse-demo-${match.id}.ics`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function render() {
        const competition = $('#comp').val();
        const query = $('#teamSearch').val().trim().toLowerCase();
        const club = localStorage.getItem('fpClub') || 'Arsenal';
        const fixtureName = { 'Newcastle United': 'Newcastle', 'AFC Bournemouth': 'Bournemouth', 'Tottenham Hotspur': 'Tottenham', 'Brighton & Hove Albion': 'Brighton' }[club] || club;
        const onlyClub = $('#myClubOnly').is(':checked');
        const fixtures = MATCHES.filter(match => (competition === 'All' || match.comp === competition) && (!query || `${match.home} ${match.away}`.toLowerCase().includes(query)) && (!onlyClub || match.home === fixtureName || match.away === fixtureName));
        $('#fixtureCount').text(`${fixtures.length} of ${MATCHES.length} demo fixtures shown${onlyClub ? ` · following ${club}` : ''}`);
        $('#fx').html(fixtures.length ? fixtures.map(match => `<article class="fx"><button class="fx-head" type="button" data-id="${match.id}" aria-expanded="${openFixture === match.id}"><span><strong>${safe(match.home)} <span class="fixture-vs">vs</span> ${safe(match.away)}</strong><small class="fixture-competition">${safe(match.comp)}</small></span><span class="fixture-date">${safe(match.date)}</span></button><div class="fx-body" ${openFixture === match.id ? 'style="display:block"' : ''}><p class="meta mb-3">${safe(match.venue)} · demo tickets from $${match.price}</p><div class="fixture-actions"><a class="btn btn-fp btn-sm" href="tickets.html?match=${match.id}">Try booking</a><button class="btn btn-line btn-sm watch-toggle" type="button" data-id="${match.id}" aria-pressed="${watched.includes(match.id)}">${watched.includes(match.id) ? '★ Saved' : '☆ Save match'}</button><button class="btn btn-line btn-sm calendar-download" type="button" data-id="${match.id}">↓ Calendar .ics</button></div></div></article>`).join('') : '<div class="empty"><h3 class="h5">No fixtures found</h3><p>Try another team or competition.</p><button id="resetFixtureFilters" class="btn btn-line btn-sm" type="button">Reset filters</button></div>');
        const saved = watched.map(id => MATCHES.find(match => match.id === id)).filter(Boolean);
        $('#watchCount').text(saved.length + ' saved');
        $('#clearWatchlist').prop('disabled', !saved.length);
        $('#watchlist').html(saved.length ? saved.map(match => `<div class="col-md-6 col-xl-4"><article class="watch-card"><span class="tag">${safe(match.comp)}</span><h3 class="h5 mt-3">${safe(match.home)} vs ${safe(match.away)}</h3><p class="meta">${safe(match.date)} · ${safe(match.venue)}</p><div class="fixture-actions"><button class="btn btn-line btn-sm calendar-download" type="button" data-id="${match.id}">↓ Calendar .ics</button><button class="btn btn-line btn-sm watch-toggle" type="button" data-id="${match.id}">Remove</button></div></article></div>`).join('') : '<div class="col-12"><div class="empty">Your watchlist is empty. Open a fixture and save a match to plan a demo matchday.</div></div>');
    }
    $('#fx').on('click', '.fx-head', function () {
        const body = $(this).next('.fx-body'), opening = !body.is(':visible');
        openFixture = opening ? +$(this).data('id') : null;
        $('.fx-body').not(body).stop(true, true).slideUp(180).prev().attr('aria-expanded', 'false');
        body.stop(true, true).slideToggle(220); $(this).attr('aria-expanded', String(opening));
    });
    $('#fx,#watchlist').on('click', '.watch-toggle', function () { toggleWatch(+$(this).data('id')) });
    $('#fx,#watchlist').on('click', '.calendar-download', function () { const match = MATCHES.find(item => item.id === +$(this).data('id')); if (match) calendarFile(match) });
    $('#fx').on('click', '#resetFixtureFilters', function () { $('#teamSearch').val(''); $('#comp').val('All'); $('#myClubOnly').prop('checked', false); render() });
    $('#clearWatchlist').on('click', function () { watched = []; storeWatchlist() });
    $('#teamSearch,#comp,#myClubOnly').on('input change', render);
    render();

    const next = MATCHES.map(match => ({ match, time: new Date(match.date.replace(' ', 'T')) })).filter(item => item.time > new Date()).sort((a, b) => a.time - b.time)[0];
    if (!next) { $('#cd').text('No future demo fixtures listed.'); return }
    function tick() {
        const seconds = Math.max(0, Math.floor((next.time - new Date()) / 1000));
        const days = Math.floor(seconds / 86400), hours = Math.floor(seconds % 86400 / 3600), minutes = Math.floor(seconds % 3600 / 60);
        $('#cd').html(`<span>Next demo fixture: <strong>${safe(next.match.home)} vs ${safe(next.match.away)}</strong></span><span class="big">${days}d ${hours}h ${minutes}m ${seconds % 60}s</span>`);
    }
    tick(); setInterval(tick, 1000);
});
