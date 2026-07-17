(function() {
    'use strict';

    const quotes = [
        'angel wings drift thru dusk across the sky',
        'halo glows in a soft echo of silent light',
        'sky whispers an angelic hush into the night',
        'clouds cradle a small wing beneath the stars',
        'lost light finds an angel on the edge of dream',
        'feathers fall like lil prayers on quiet air',
    ];

    const el = document.getElementById('text');
    if (!el) return;

    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const words = quote.split(' ');
    el.innerHTML = words.map(function(word) {
        return '<span style="opacity:0;visibility:hidden;">' + word + '</span>';
    }).join(' ');

    const spans = el.querySelectorAll('span');
    spans.forEach(function(span, i) {
        setTimeout(function() {
            gsap.to(span, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' });
        }, 2000 + i * 200);
    });

    const title = document.querySelector('.pageTitle');
    if (title) {
        setTimeout(function() {
            gsap.to(title, { opacity: 1, duration: 1.5, ease: 'power2.out' });
        }, 500);
    }

    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
})();
