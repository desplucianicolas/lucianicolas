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

    // ─── Mobile accordion dropdowns ──────
    const isMobile = () => window.innerWidth <= 768;

    navMenu.querySelectorAll('.nav-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!isMobile()) return;
            const parent = link.parentElement;
            const isExpanded = parent.classList.contains('expanded');
            // Cierra todos los demás
            navMenu.querySelectorAll('.nav-dropdown.expanded').forEach(el => {
                if (el !== parent) el.classList.remove('expanded');
            });
            parent.classList.toggle('expanded', !isExpanded);
            // Solo navega si ya estaba expandido (segundo tap)
            if (!isExpanded) e.preventDefault();
        });
    });

    // Cierra el menú al hacer clic en un sub-item o en links sin dropdown
    navMenu.querySelectorAll('.dropdown-menu a, li:not(.nav-dropdown) > a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            navMenu.querySelectorAll('.nav-dropdown').forEach(el => el.classList.remove('expanded'));
        });
    });

    // Cierra al clicar fuera del panel
    document.addEventListener('click', (e) => {
        if (isMobile() && navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            navMenu.querySelectorAll('.nav-dropdown').forEach(el => el.classList.remove('expanded'));
        }
    });

    // ─── Scroll Fade-in ─────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.02, rootMargin: '0px 0px -30px 0px' });

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

    // ─── Prensa Viewer ───────────────────
    const prensaViewer = document.getElementById('prensa-viewer');
    const prensaViewerContent = document.getElementById('prensa-viewer-content');
    const prensaViewerBack = document.getElementById('prensa-viewer-back');

    function openPrensaViewer(href) {
        prensaViewerContent.innerHTML = '';
        const isPDF = href.toLowerCase().endsWith('.pdf');
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isPDF && isMobileDevice) {
            // iOS/Android: iframes de PDF no son scrolleables → abrir en nueva pestaña
            window.open(href, '_blank');
            return;
        }

        if (isPDF) {
            const iframe = document.createElement('iframe');
            iframe.src = href;
            prensaViewerContent.appendChild(iframe);
        } else {
            const img = document.createElement('img');
            img.src = href;
            img.alt = 'Prensa';
            prensaViewerContent.appendChild(img);
        }
        prensaViewer.classList.add('open');
        prensaViewer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePrensaViewer() {
        prensaViewer.classList.remove('open');
        prensaViewer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => { prensaViewerContent.innerHTML = ''; }, 300);
    }

    document.querySelectorAll('.prensa-open').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openPrensaViewer(link.getAttribute('href'));
        });
    });

    prensaViewerBack.addEventListener('click', closePrensaViewer);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && prensaViewer.classList.contains('open')) {
            closePrensaViewer();
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
