/* ═══════════════════════════════════════
   LUCÍA NICOLÁS — Portfolio JS
   ═══════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Language Switch ────────────────
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    let currentLang = 'es';

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-es]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });

        btnEs.classList.toggle('active', lang === 'es');
        btnEn.classList.toggle('active', lang === 'en');
    }

    btnEs.addEventListener('click', () => setLanguage('es'));
    btnEn.addEventListener('click', () => setLanguage('en'));

    // ─── Hamburger Menu ─────────────────
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // ─── Scroll Fade-in ─────────────────
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Apply fade-in to section content
    document.querySelectorAll('.section-inner, .hero-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ─── Header background on scroll ────
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(to bottom, rgba(10, 10, 10, 0.9) 0%, transparent 100%)';
            header.style.backdropFilter = 'none';
        }

        lastScroll = currentScroll;
    });

    // ─── Hero Video ────────────────────
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.playbackRate = 0.85;
        heroVideo.play().catch(() => {});
    }

    // ─── Piece Modal ────────────────────
    const modal = document.getElementById('piece-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    document.querySelectorAll('.creacion-card[data-piece]').forEach(card => {
        card.addEventListener('click', () => {
            const pieceId = card.dataset.piece;
            const template = document.getElementById('tmpl-' + pieceId);
            if (template) {
                modalContent.innerHTML = '';
                modalContent.appendChild(template.content.cloneNode(true));
                // Apply current language to modal content
                modalContent.querySelectorAll('[data-es]').forEach(el => {
                    el.textContent = el.getAttribute('data-' + currentLang);
                });
                modal.classList.add('open');
                modal.scrollTop = 0;
                document.body.style.overflow = 'hidden';
            }
        });
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // ─── Prensa Carousel ─────────────────
    const prensaTrack = document.querySelector('.prensa-track');
    const prensaSlides = document.querySelectorAll('.prensa-slide');
    const prensaPrev = document.querySelector('.prensa-prev');
    const prensaNext = document.querySelector('.prensa-next');
    const prensaDotsContainer = document.querySelector('.prensa-dots');
    let prensaIndex = 0;

    // Create dots
    prensaSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('prensa-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        prensaDotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        prensaIndex = index;
        prensaTrack.style.transform = `translateX(-${prensaIndex * 100}%)`;
        document.querySelectorAll('.prensa-dot').forEach((d, i) => {
            d.classList.toggle('active', i === prensaIndex);
        });
    }

    prensaPrev.addEventListener('click', () => {
        goToSlide(prensaIndex > 0 ? prensaIndex - 1 : prensaSlides.length - 1);
    });

    prensaNext.addEventListener('click', () => {
        goToSlide(prensaIndex < prensaSlides.length - 1 ? prensaIndex + 1 : 0);
    });

    // ─── Prensa Zoom ─────────────────
    const prensaZoom = document.getElementById('prensa-zoom');
    const prensaZoomImg = document.getElementById('prensa-zoom-img');
    const prensaZoomIn = document.getElementById('prensa-zoom-in');
    const prensaZoomOut = document.getElementById('prensa-zoom-out');
    const prensaZoomClose = document.getElementById('prensa-zoom-close');
    let zoomLevel = 1;

    prensaSlides.forEach(slide => {
        slide.addEventListener('click', () => {
            const img = slide.querySelector('img');
            if (img) {
                prensaZoomImg.src = img.src;
                zoomLevel = 1;
                prensaZoomImg.style.transform = `scale(${zoomLevel})`;
                prensaZoom.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    prensaZoomIn.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 0.5, 4);
        prensaZoomImg.style.transform = `scale(${zoomLevel})`;
    });

    prensaZoomOut.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 0.5, 0.5);
        prensaZoomImg.style.transform = `scale(${zoomLevel})`;
    });

    function closePrensaZoom() {
        prensaZoom.classList.remove('open');
        document.body.style.overflow = '';
    }

    prensaZoomClose.addEventListener('click', closePrensaZoom);
    prensaZoom.addEventListener('click', (e) => {
        if (e.target === prensaZoom || e.target.classList.contains('prensa-zoom-container')) {
            closePrensaZoom();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && prensaZoom.classList.contains('open')) {
            closePrensaZoom();
        }
        if (prensaZoom.classList.contains('open')) {
            if (e.key === '+' || e.key === '=') prensaZoomIn.click();
            if (e.key === '-') prensaZoomOut.click();
        }
    });

    // ─── Smooth anchor offset ───────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
