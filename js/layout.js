$(function(){
const pages=[["index","Home"],["news","News"],["stats","Table"],["matches","Matches"],["tickets","Tickets"],["about","About"]];
const cur=$('body').data('page');
const li=pages.map(p=>`<li class="nav-item"><a class="nav-link${p[0]===cur?' active':''}" ${p[0]===cur?'aria-current="page"':''} href="${p[0]}.html">${p[1]}</a></li>`).join('');
$('body').prepend(`<nav class="navbar navbar-expand-lg navbar-dark sticky-top"><div class="container"><a class="navbar-brand" href="index.html">Football<b>Pulse</b></a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Toggle menu"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="nav"><ul class="navbar-nav ms-auto">${li}</ul></div></div></nav>`);
$('body').append(`<footer><div class="container"><strong class="text-white">FootballPulse</strong><p class="mb-1">Made by IT-2512 students. Built with Bootstrap 5, jQuery and Google Fonts. Full credits on the <a class="text-white" href="about.html#credits">About page</a>.</p></div></footer><button id="toTop" class="btn btn-fp" aria-label="Back to top">↑ Top</button>`);
$(window).on('scroll',function(){$('#toTop').toggle($(this).scrollTop()>400)});
$('#toTop').on('click',()=>$('html,body').stop(true).animate({scrollTop:0},500));
});
