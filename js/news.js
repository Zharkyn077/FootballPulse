$(function () {
    const cats = ['All', ...new Set(NEWS.map(n => n.cat))];
    $('#cats').html(cats.map(c => `<button class="btn btn-line btn-sm me-1 mb-1" data-c="${c}">${c}</button>`).join(''));
    let cat = 'All'; let saved = JSON.parse(localStorage.getItem('fpSaved') || '[]');
    function render() {
        const q = $('#q').val().trim().toLowerCase();
        const list = NEWS.filter(n => (cat === 'All' || n.cat === cat) && (n.title + n.text).toLowerCase().includes(q));
        $('#count').text(list.length + ' of ' + NEWS.length + ' stories, ' + list.reduce((s, n) => s + n.read, 0) + ' min total reading');
        if (!list.length) { $('#list').html('<div class="empty"><h2 class="h5">No stories found</h2><p class="mb-0">Try a different word or choose “All”.</p></div>'); return }
        const el = $('<div class="custom-grid"></div>');
        const feat = cat === 'All' && !q;
        list.forEach((n, i) => el.append(`<article class="fp-card ${feat && i === 0 ? 'feature' : ''}"><button class="star" data-id="${n.id}" aria-pressed="${saved.includes(n.id)}" aria-label="Save story">${saved.includes(n.id) ? '★' : '☆'}</button><span class="tag">${n.cat}</span><h2 class="h5 mt-2">${n.title}</h2><p>${n.text}</p><p class="meta mb-0">${n.date} · Official source: <a href="${n.source}" target="_blank" rel="noopener noreferrer">Read article ↗</a></p></article>`));
        $('#list').empty().append(el.hide().fadeIn(250));
    }
    $('#q').on('input', render);
    $('#list').on('click', '.star', function () { const id = +$(this).data('id'); saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]; localStorage.setItem('fpSaved', JSON.stringify(saved)); $(this).text(saved.includes(id) ? '★' : '☆').attr('aria-pressed', saved.includes(id)).animate({ fontSize: '1.8rem' }, 120).animate({ fontSize: '1.3rem' }, 120); $('#savedN').text(saved.length + ' saved') }); $('#savedN').text(saved.length + ' saved');
    $('#cats').on('click', 'button', function () { cat = $(this).data('c'); $('#cats button').removeClass('btn-fp').addClass('btn-line'); $(this).removeClass('btn-line').addClass('btn-fp'); render() });
    $('#cats button:first').click();
});
