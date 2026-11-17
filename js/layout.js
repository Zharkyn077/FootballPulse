$(function () {
    const savedTheme = localStorage.getItem('fpTheme');
    document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
    const pages = [["index", "Home"], ["news", "News"], ["stats", "Table"], ["matches", "Matches"], ["tickets", "Tickets"], ["about", "About"]];
    const cur = $('body').data('page');
    const li = pages.map(p => `<li class="nav-item"><a class="nav-link${p[0] === cur ? ' active' : ''}" ${p[0] === cur ? 'aria-current="page"' : ''} href="${p[0]}.html">${p[1]}</a></li>`).join('');
    $('body').prepend(`<header class="site-header sticky-top"><nav class="navbar navbar-expand-lg navbar-dark" aria-label="Main navigation"><div class="container"><a class="navbar-brand" href="index.html">Football<b>Pulse</b></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Toggle menu" aria-controls="nav" aria-expanded="false"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="nav"><ul class="navbar-nav ms-auto">${li}</ul><button id="themeToggle" class="theme-toggle ms-lg-3" type="button" aria-label="Switch colour theme"></button></div></div></nav></header>`);
    function paintTheme() {
        const dark = document.documentElement.dataset.theme === 'dark';
        $('#themeToggle').text(dark ? '☀ Light' : '☾ Dark').attr('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    $('#themeToggle').on('click', function () {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('fpTheme', next);
        paintTheme();
    });
    paintTheme();
    $('body').append(`<footer><div class="container"><strong class="text-white">FootballPulse</strong><p class="mb-1">Made by IT-2512 students. Match simulator and ticket bookings are demos.</p><p class="mb-0"><a class="text-white" href="about.html#credits">Project credits</a> · <a class="text-white" href="DATA_SOURCES.md">Data sources</a> · <a class="text-white" href="IMAGE_CREDITS.md">Photo credits</a></p></div></footer><button id="toTop" class="btn btn-fp" aria-label="Back to top">↑ Top</button>`);
    $(window).on('scroll', function () { $('#toTop').toggle($(this).scrollTop() > 400) });
    $('#toTop').on('click', () => $('html,body').stop(true).animate({ scrollTop: 0 }, 500));
});
