$(function () {
    $('#match').html(MATCHES.map(m => `<option value="${m.id}">${m.home} vs ${m.away} (${m.date.slice(0, 10)})</option>`).join(''));
    const pre = new URLSearchParams(location.search).get('match'); if (pre && MATCHES.some(m => m.id == pre)) $('#match').val(pre);
    const mult = { standard: 1, vip: 2.5, family: 0.8 };
    const rules = {
        name: v => !v ? 'Enter your full name.' : (/\d/.test(v) || v.length < 3) ? 'Use at least 3 letters and no digits.' : '',
        email: v => !v ? 'Enter your email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Email must look like name@example.com.' : '',
        phone: v => !v ? 'Enter your phone number.' : !/^\+?\d{10,14}$/.test(v.replace(/[\s()-]/g, '')) ? 'Use 10–14 digits, for example +7 701 123 4567.' : '',
        qty: v => !v ? 'Enter number of tickets.' : (!Number.isInteger(+v) || v < 1 || v > 6) ? 'Choose a whole number from 1 to 6.' : '',
        pass: v => !v ? 'Create a password.' : (v.length < 8 || !/\d/.test(v) || !/[A-Z]/.test(v)) ? 'Use 8+ characters with a capital letter and a digit.' : '',
        terms: () => $('#terms').is(':checked') ? '' : 'Accept the ticket terms to continue.'
    };
    function check(id) {
        const el = $('#' + id), v = id === 'terms' ? '' : el.val().trim(), msg = rules[id](v);
        el.toggleClass('is-invalid', !!msg); $('#e-' + id).text(msg); return !msg
    }
    function total() {
        const m = MATCHES.find(x => x.id == $('#match').val()), q = Math.min(Math.max(+$('#qty').val() || 0, 0), 6);
        $('#total').text('$' + (m ? Math.round(m.price * mult[$('#cat').val()] * q) : 0))
    }
    $('#f').on('input change', 'input,select', function () { if (rules[this.id] && $(this).data('touched')) check(this.id); total() });
    $('#f input').on('blur', function () { $(this).data('touched', true) });
    $('#f').on('submit', function (e) {
        e.preventDefault();
        let ok = true; Object.keys(rules).forEach(id => { $('#' + id).data('touched', true); if (!check(id)) ok = false });
        if (!ok) { $('#f .is-invalid:first').focus(); return }
        $('#ok').text('Demo booking saved on screen! ' + $('#qty').val() + ' ticket(s) for ' + $('#match option:selected').text() + '. Total ' + $('#total').text() + '. No email was sent. Entered contact: ' + $('#email').val() + '.').stop(true, true).slideDown(300);
        this.reset(); $('#f input').removeData('touched').removeClass('is-invalid'); $('#f .invalid-feedback').text(''); total();
        setTimeout(() => $('#ok').slideUp(400), 8000);
    });
    total();
});
$(function () {
    $('.pitch').on('click', '.st', function () { $('.st').removeClass('on').attr('aria-pressed', 'false'); $(this).addClass('on').attr('aria-pressed', 'true'); $('#cat').val($(this).data('s')).trigger('change') });
    $('#cat').on('change', function () { $('.st').removeClass('on') })
});
