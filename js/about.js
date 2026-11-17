$(function () {
    const routes = {
        catchup: { label: 'Catch up fast', icon: '⚡', summary: 'A five-minute route from headline to reading list.', steps: [['Scan the latest stories', 'news.html'], ['Star what deserves a second look', 'news.html#favoritesSection'], ['Find your shortlist on Home', 'index.html#savedTitle']] },
        stats: { label: 'Read the numbers', icon: '▥', summary: 'Move from the table to a head-to-head, then try a hypothetical result.', steps: [['Sort the league table', 'stats.html'], ['Compare two clubs', 'stats.html#compareTitle'], ['Try the Matchday Lab', 'index.html#pulseLabTitle']] },
        plan: { label: 'Plan a matchday', icon: '◷', summary: 'Build a demo watchlist and take a reminder into your calendar.', steps: [['Filter the demo fixtures', 'matches.html'], ['Save a match and export .ics', 'matches.html#watchlistTitle'], ['Try a demo seat booking', 'tickets.html']] }
    };
    function show(routeKey) {
        const route = routes[routeKey] || routes.catchup;
        $('.route-choice').each(function () { const active = $(this).data('route') === routeKey; $(this).toggleClass('active', active).attr('aria-pressed', String(active)) });
        $('#routeResult').stop(true, true).hide().html(`<div class="route-result-top"><span class="route-result-icon" aria-hidden="true">${route.icon}</span><div><h3 class="h4 mb-1">${route.label}</h3><p class="meta mb-0">${route.summary}</p></div></div><ol class="route-steps">${route.steps.map(([text, link]) => `<li><a href="${link}">${text} ↗</a></li>`).join('')}</ol>`).fadeIn(220);
        localStorage.setItem('fpRoute', routeKey);
    }
    $('.route-choice').on('click', function () { show($(this).data('route')) });
    const stored = localStorage.getItem('fpRoute');
    show(routes[stored] ? stored : 'catchup');
});
