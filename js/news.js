$(function () {
    const cats = ['All', ...new Set(NEWS.map(n => n.cat))];
    $('#cats').html(cats.map(c => `<button class="btn btn-line btn-sm me-1 mb-1" data-c="${c}">${c}</button>`).join(''));
    let cat = 'All'; let saved;
    try { saved = JSON.parse(localStorage.getItem('fpSaved') || '[]'); if (!Array.isArray(saved)) saved = [] }
    catch { saved = [] }
    function drawFavorites() {
        const articles = saved.map(id => NEWS.find(article => article.id === id)).filter(Boolean);
        $('#savedN').text(articles.length + ' saved');
        $('#favoritesCount').text(articles.length);
        $('#clearFavorites').prop('disabled', !articles.length);
        const cards = articles.map(article => `<div class="col-md-6 col-xl-4"><article class="favorite-card"><div class="favorite-card-top"><span class="tag">${article.cat}</span><span class="meta">${article.read} min read</span></div><h3 class="h5">${article.title}</h3><p>${article.text}</p><div class="favorite-card-actions"><a href="${article.source}" target="_blank" rel="noopener noreferrer">Read source ↗</a><button class="btn btn-line btn-sm remove-favorite" type="button" data-id="${article.id}" aria-label="Remove ${article.title} from favourites">Remove</button></div></article></div>`).join('');
        $('#favoritesList').stop(true, true).html(cards || '<div class="col-12"><div class="empty favorites-empty">☆ No favourites yet. Tap the star on any article below to build your reading list.</div></div>');
    }
    function render() {
        const q = $('#q').val().trim().toLowerCase();
        const list = NEWS.filter(n => (cat === 'All' || n.cat === cat) && (n.title + n.text).toLowerCase().includes(q));
        $('#count').text(list.length + ' of ' + NEWS.length + ' stories, ' + list.reduce((s, n) => s + n.read, 0) + ' min total reading');
        if (!list.length) { $('#list').html('<div class="empty"><h3 class="h5">No stories found</h3><p class="mb-0">Try a different word or choose “All”.</p></div>'); return }
        const el = $('<div class="custom-grid"></div>');
        const feat = cat === 'All' && !q;
        list.forEach((n, i) => el.append(`<article class="fp-card ${feat && i === 0 ? 'feature' : ''}"><button class="star" data-id="${n.id}" aria-pressed="${saved.includes(n.id)}" aria-label="${saved.includes(n.id) ? 'Remove saved story' : 'Save story'}">${saved.includes(n.id) ? '★' : '☆'}</button><span class="tag">${n.cat}</span><h3 class="h5 mt-2">${n.title}</h3><p>${n.text}</p><p class="meta mb-0">${n.date} · Official source: <a href="${n.source}" target="_blank" rel="noopener noreferrer">Read article ↗</a></p></article>`));
        $('#list').empty().append(el.hide().fadeIn(250));
    }
    $('#q').on('input', render);
    function storeFavorites() {
        localStorage.setItem('fpSaved', JSON.stringify(saved));
        $('#list .star').each(function () { const active = saved.includes(+$(this).data('id')); $(this).text(active ? '★' : '☆').attr('aria-pressed', String(active)).attr('aria-label', active ? 'Remove saved story' : 'Save story') });
        drawFavorites();
    }
    $('#list').on('click', '.star', function () { const id = +$(this).data('id'); saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]; storeFavorites(); $(this).stop(true, true).animate({ fontSize: '1.8rem' }, 120).animate({ fontSize: '1.3rem' }, 120) });
    $('#favoritesList').on('click', '.remove-favorite', function () { const id = +$(this).data('id'); saved = saved.filter(value => value !== id); storeFavorites() });
    $('#clearFavorites').on('click', function () { saved = []; storeFavorites() });
    drawFavorites();
    $('#cats').on('click', 'button', function () { cat = $(this).data('c'); $('#cats button').removeClass('btn-fp').addClass('btn-line'); $(this).removeClass('btn-line').addClass('btn-fp'); render() });
    $('#cats button:first').click();
});
