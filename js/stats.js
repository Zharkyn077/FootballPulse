$(function () {
    let key = 'pos', dir = 1;
    const cols = [['#', 'pos'], ['Club', 'club'], ['MP', 'mp'], ['W', 'w'], ['D', 'd'], ['L', 'l'], ['GD', 'gd'], ['Pts', 'pts']];
    const ranked = TEAMS.map((team, index) => ({ ...team, pos: index + 1 }));
    const crest = name => name.split(/\s+/).filter(word => !['&', 'United', 'City', 'Hotspur', 'Albion'].includes(word)).map(word => word[0]).slice(0, 2).join('').toUpperCase();
    $('#thead').html('<tr>' + cols.map(([label, value]) => `<th scope="col"><button class="sort-head" type="button" data-k="${value}">${label}</button></th>`).join('') + '</tr>');
    function render() {
        const query = $('#q').val().trim().toLowerCase();
        const rows = ranked.filter(team => team.club.toLowerCase().includes(query)).sort((a, b) => {
            const comparison = typeof a[key] === 'string' ? a[key].localeCompare(b[key]) : a[key] - b[key];
            return comparison * dir || a.pos - b.pos;
        });
        $('#tbody').html(rows.length ? rows.map(team => `<tr class="${team.pos <= 4 ? 'top4' : team.pos >= 18 ? 'rel' : ''} ${team.club === $('#compareA').val() || team.club === $('#compareB').val() ? 'compared-club' : ''}"><td>${team.pos}</td><td class="club-cell"><span class="club-mark" aria-hidden="true">${crest(team.club)}</span><span>${team.club}</span></td><td>${team.mp}</td><td>${team.w}</td><td>${team.d}</td><td>${team.l}</td><td>${team.gd > 0 ? '+' : ''}${team.gd}</td><td class="ptscell"><strong>${team.pts}</strong></td></tr>`).join('') : '<tr><td colspan="8" class="empty">No clubs found. Try another name.</td></tr>');
        $('#avg').text(`${rows.length} of ${TEAMS.length} clubs shown`);
    }
    $('#thead').on('click', '.sort-head', function () { const selected = $(this).data('k'); dir = selected === key ? -dir : 1; key = selected; render() });
    $('#q').on('input', render);
    render();

    TEAMS.forEach(team => $('#compareA,#compareB').append($('<option>').val(team.club).text(team.club)));
    const followed = localStorage.getItem('fpClub');
    $('#compareA').val(TEAMS.some(team => team.club === followed) ? followed : TEAMS[0].club);
    $('#compareB').val(TEAMS.find(team => team.club !== $('#compareA').val()).club);
    function compare() {
        const first = TEAMS.find(team => team.club === $('#compareA').val());
        const second = TEAMS.find(team => team.club === $('#compareB').val());
        if (!first || !second || first.club === second.club) { $('#comparisonResult').html('<div class="empty">Choose two different clubs to compare.</div>'); render(); return }
        const metrics = [
            ['Points', 'pts', Math.max(first.pts, second.pts, 1)],
            ['Wins', 'w', Math.max(first.w, second.w, 1)],
            ['Draws', 'd', Math.max(first.d, second.d, 1)]
        ];
        const strips = metrics.map(([label, property, maximum]) => `<div class="comparison-metric"><span>${label}</span><div class="comparison-line"><strong>${first[property]}</strong><div class="comparison-track"><i class="first" style="width:${first[property] / maximum * 100}%"></i></div><div class="comparison-track"><i class="second" style="width:${second[property] / maximum * 100}%"></i></div><strong>${second[property]}</strong></div></div>`).join('');
        const gap = Math.abs(first.pts - second.pts);
        $('#comparisonResult').html(`<div class="comparison-top"><div><strong>${first.club}</strong><small>GD ${first.gd > 0 ? '+' : ''}${first.gd}</small></div><span>VS</span><div><strong>${second.club}</strong><small>GD ${second.gd > 0 ? '+' : ''}${second.gd}</small></div></div>${strips}<p class="meta mt-3 mb-0">${gap ? `${gap} point${gap === 1 ? '' : 's'} separate these clubs.` : 'These clubs are level on points.'} Snapshot only; bars compare each metric within this pair.</p>`);
        render();
    }
    $('#compareA,#compareB').on('change', compare);
    compare();

    const photoSlug = name => name.replace('ß', 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const photoPage = {
        'Erling Haaland': 'https://commons.wikimedia.org/wiki/File:Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg',
        'Alexander Isak': 'https://commons.wikimedia.org/wiki/File:Alexander_Isak_-_Sweden_-_Greece21_(cropped).jpg',
        'João Pedro': 'https://commons.wikimedia.org/wiki/File:Jo%C3%A3o_Pedro%2C_2025_FIFA_Club_World_Cup_final_(54654843615).jpg',
        'Marcus Tavernier': 'https://commons.wikimedia.org/wiki/File:Marcus_Tavernier_2022.jpg',
        'Morgan Rogers': 'https://commons.wikimedia.org/wiki/File:Morgan_Rogers_England_v_Panama_27_June_26-156.jpg',
        'Nicolas Jackson': 'https://commons.wikimedia.org/wiki/File:Nicolas_Jackson_20042025_(1).jpg',
        'Evanilson': 'https://commons.wikimedia.org/wiki/File:Evanilson_2024.jpg',
        'Rayan Cherki': 'https://commons.wikimedia.org/wiki/File:Rayan_Cherki_France_v_Norway_26_June_26-114.jpg',
        'Bryan Mbeumo': 'https://commons.wikimedia.org/wiki/File:Bryan_Mbeumo_00-02-31.18.png',
        'Dominic Calvert-Lewin': 'https://commons.wikimedia.org/wiki/File:Dominic_Calvert-Lewin_13092025_(5).jpg',
        'Declan Rice': 'https://commons.wikimedia.org/wiki/File:Declan_Rice_England_v_Ghana_23_June_2026-150.jpg',
        'Pascal Groß': 'https://commons.wikimedia.org/wiki/File:Pascal_Gross_Ecuador_v_Germany_25_June_2026-065.jpg',
        'Cody Gakpo': 'https://commons.wikimedia.org/wiki/File:Cody_Gakpo_Liverpool_FC_20261103_(1)_(cropped).JPG',
        'Cole Palmer': 'https://commons.wikimedia.org/wiki/File:Cole_Palmer_2025_FIFA_Club_World_Cup_Final.jpg',
        'Antoine Semenyo': 'https://commons.wikimedia.org/wiki/File:Antoine_Semenyo_England_v_Ghana_23_June_2026-209_(cropped2).jpg',
        'Maxim De Cuyper': 'https://commons.wikimedia.org/wiki/File:Maxim_De_Cuyper_USMNT_v_Belgium_Mar_28_2026-79_(cropped).jpg',
        'Mohammed Kudus': 'https://commons.wikimedia.org/wiki/File:Mohammed_Kudus_of_West_Ham_United.jpeg'
    };
    let mode = 'goals';
    function showPlayers() {
        const query = $('#playerQ').val().trim().toLowerCase();
        const list = PLAYERS.filter(player => player[mode] !== null && `${player.name} ${player.club}`.toLowerCase().includes(query)).sort((a, b) => b[mode] - a[mode] || a.name.localeCompare(b.name));
        $('#playerCards').html(list.length ? list.map((player, index) => {
            const slug = photoSlug(player.name);
            const page = photoPage[player.name] || `https://en.wikipedia.org/wiki/${encodeURIComponent(player.name.replaceAll(' ', '_'))}`;
            const portrait = `<img class="player-photo" src="images/players/${slug}.jpg" alt="Portrait of ${player.name}" loading="lazy">`;
            const credit = `<a class="photo-credit" href="${page}" target="_blank" rel="noopener noreferrer">Photo source ↗</a>`;
            return `<div class="col-md-6 col-xl-4"><article class="fp-card stat-player"><div class="player-copy"><span class="tag">#${index + 1} · ${mode === 'goals' ? 'Golden Boot' : 'Playmaker'}</span><h3 class="h5 mt-3">${player.name}</h3><p class="meta">${player.club}</p><div class="stat-number">${player[mode]}</div><span class="meta">${mode === 'goals' ? 'Goals' : 'Assists'}</span></div><div class="player-portrait">${portrait}${credit}</div></article></div>`;
        }).join('') : '<div class="empty">No players match this search.</div>');
    }
    $('#playerQ').on('input', showPlayers);
    $('#goalBtn,#assistBtn').on('click', function () {
        mode = this.id === 'goalBtn' ? 'goals' : 'assists';
        $('#goalBtn,#assistBtn').removeClass('btn-fp').addClass('btn-line').attr('aria-pressed', 'false');
        $(this).removeClass('btn-line').addClass('btn-fp').attr('aria-pressed', 'true');
        showPlayers();
    });
    $('#goalBtn').attr('aria-pressed', 'true');
    $('#assistBtn').attr('aria-pressed', 'false');
    showPlayers();
});
