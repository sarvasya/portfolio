/* ═══════════════════════════════════════════════
   DESIGN PORTFOLIO — INTERACTIONS
   ═══════════════════════════════════════════════ */

(() => {
    'use strict';

    /* ── DOM refs ── */
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    const navLinks = document.querySelectorAll('.nav__link');
    const reveals = document.querySelectorAll('.reveal');
    const statNums = document.querySelectorAll('.stat__number');
    const form = document.getElementById('contactForm');

    /* ═══════════════════════════════════════════
       1 · HEADER — shrink on scroll
       ═══════════════════════════════════════════ */
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 60);
        lastScroll = y;
    }, { passive: true });

    /* ═══════════════════════════════════════════
       2 · MOBILE NAV TOGGLE
       ═══════════════════════════════════════════ */
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navList.classList.toggle('open');
        document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navList.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ═══════════════════════════════════════════
       3 · ACTIVE NAV LINK on scroll
       ═══════════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = document.querySelector(`.nav__link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    }
    window.addEventListener('scroll', highlightNav, { passive: true });

    /* ═══════════════════════════════════════════
       4 · REVEAL on scroll (Intersection Observer)
       ═══════════════════════════════════════════ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    /* ═══════════════════════════════════════════
       5 · COUNTER ANIMATION (About stats)
       ═══════════════════════════════════════════ */
    let statsCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const statsSection = document.querySelector('.about__stats');
    if (statsSection) statsObserver.observe(statsSection);

    function animateCounters() {
        statNums.forEach(num => {
            const target = +num.dataset.count;
            const duration = 1800;
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // ease-out expo
                const ease = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.round(target * ease);
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        });
    }

    /* ═══════════════════════════════════════════
       6 · CONTACT FORM (visual feedback before submit)
       ═══════════════════════════════════════════ */
    if (form) {
        form.addEventListener('submit', () => {
            const btn = document.getElementById('submitBtn');
            btn.innerHTML = 'Sending… ✈️';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '.7';
            // Form will POST to FormSubmit naturally
        });
    }

    /* ═══════════════════════════════════════════
       7 · SMOOTH SCROLL polyfill for anchor links
       ═══════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetEl = document.querySelector(anchor.getAttribute('href'));
            if (targetEl) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight + 20;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

})();
