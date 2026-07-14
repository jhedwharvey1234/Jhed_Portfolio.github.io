(function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    }

    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const endValue = Number(el.getAttribute('data-counter') || 0);
            const duration = 900;
            const startTime = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const current = Math.floor(progress * endValue);
                el.textContent = String(current) + '+';
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = String(endValue) + '+';
                }
            }

            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.4 });

    counters.forEach(function (counter) {
        counterObserver.observe(counter);
    });

    const fills = document.querySelectorAll('.skill-fill[data-level]');
    const fillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const level = entry.target.getAttribute('data-level');
            entry.target.style.width = level + '%';
            fillObserver.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    fills.forEach(function (fill) {
        fillObserver.observe(fill);
    });

})();
