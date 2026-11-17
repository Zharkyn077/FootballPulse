$(function () {
    const storageKey = 'fpBookings';
    const prices = { standard: 1, family: 0.8, vip: 2.5 };
    const rules = {
        name: value => !value ? 'Enter your full name.' : /\d/.test(value) || value.length < 3 ? 'Use at least 3 letters and no digits.' : '',
        email: value => !value ? 'Enter your email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? 'Enter a valid email address.' : '',
        phone: value => !value ? 'Enter your phone number.' : !/^\+?\d{10,14}$/.test(value.replace(/[\s()-]/g, '')) ? 'Use 10–14 digits, for example +7 701 123 4567.' : '',
        qty: value => !Number.isInteger(+value) || +value < 1 || +value > 6 ? 'Choose a whole number from 1 to 6.' : '',
        terms: () => $('#terms').is(':checked') ? '' : 'Confirm that you understand this is a demo booking.'
    };
    function bookings() {
        try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value : [] }
        catch { return [] }
    }
    function save(items) { localStorage.setItem(storageKey, JSON.stringify(items)); drawBookings() }
    function escapeHtml(value) { return $('<span>').text(value).html() }
    function drawBookings() {
        const items = bookings();
        $('#bookingCount').text(items.length);
        $('#clearBookings').prop('disabled', !items.length);
        $('#bookingList').html(items.length ? items.map(item => `<article class="booking-item"><div><strong>${escapeHtml(item.match)}</strong><p class="meta mb-1">${escapeHtml(item.stand)} stand · ${item.qty} ticket${item.qty === 1 ? '' : 's'} · ${escapeHtml(item.category)}</p><span class="booking-price">$${item.total}</span></div><button class="btn btn-line btn-sm remove-booking" type="button" data-id="${item.id}" aria-label="Remove booking for ${escapeHtml(item.match)}">Remove</button></article>`).join('') : '<p class="meta mb-0">No bookings saved yet.</p>');
    }
    $('#bookingList').on('click', '.remove-booking', function () { save(bookings().filter(item => item.id !== $(this).data('id'))) });
    $('#clearBookings').on('click', () => save([]));
    drawBookings();

    $('#match').html(MATCHES.map(match => `<option value="${match.id}">${match.home} vs ${match.away} (${match.date.slice(0, 10)})</option>`).join(''));
    const selectedMatch = new URLSearchParams(location.search).get('match');
    if (selectedMatch && MATCHES.some(match => String(match.id) === selectedMatch)) $('#match').val(selectedMatch);
    let stand = 'North';
    function selectStand(button) {
        stand = button.dataset.stand;
        $('.st').removeClass('on').attr('aria-pressed', 'false');
        $(button).addClass('on').attr('aria-pressed', 'true');
        $('#cat').val(button.dataset.s);
        $('#standFeedback').text(`${stand} stand selected · ${$('#cat option:selected').text()}`);
        total();
    }
    $('.pitch').on('click', '.st', function () { selectStand(this) });
    $('#cat').on('change', function () { selectStand($('.st').filter(function () { return this.dataset.s === $('#cat').val() })[0]) });
    selectStand($('.st.n')[0]);

    function check(id) {
        const input = $('#' + id);
        const value = id === 'terms' ? '' : String(input.val()).trim();
        const message = rules[id](value);
        input.toggleClass('is-invalid', !!message).attr('aria-invalid', String(!!message));
        $('#e-' + id).text(message);
        return !message;
    }
    function total() {
        const match = MATCHES.find(item => item.id === +$('#match').val());
        const qty = +$('#qty').val();
        const amount = match && Number.isInteger(qty) && qty >= 1 && qty <= 6 ? Math.round(match.price * prices[$('#cat').val()] * qty) : 0;
        $('#total').text('$' + amount);
        return amount;
    }
    $('#f').on('input change', 'input,select', function () { if (rules[this.id] && $(this).data('touched')) check(this.id); total() });
    $('#f input').on('blur', function () { $(this).data('touched', true); if (rules[this.id]) check(this.id) });
    $('#f').on('submit', function (event) {
        event.preventDefault();
        let valid = true;
        Object.keys(rules).forEach(id => { $('#' + id).data('touched', true); if (!check(id)) valid = false });
        if (!valid) { $('#f .is-invalid:first').trigger('focus'); return }
        const match = MATCHES.find(item => item.id === +$('#match').val());
        const booking = { id: Date.now().toString(36) + Math.random().toString(36).slice(2), match: `${match.home} vs ${match.away}`, stand, category: $('#cat option:selected').text(), qty: +$('#qty').val(), total: total() };
        save([booking, ...bookings()]);
        $('#ok').text(`Demo booking saved: ${booking.qty} ticket${booking.qty === 1 ? '' : 's'} for ${booking.match}, ${stand} stand. Total $${booking.total}. No payment or email was sent.`).stop(true, true).slideDown(250);
        this.reset();
        $('#f input').removeData('touched').removeClass('is-invalid').attr('aria-invalid', 'false');
        $('#f .invalid-feedback').text('');
        selectStand($('.st.n')[0]);
        total();
    });
    total();
});
