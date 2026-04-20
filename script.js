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
    const prensaViewer     = document.getElementById('prensa-viewer');
    const prensaViewerContent = document.getElementById('prensa-viewer-content');
    const prensaViewerBack = document.getElementById('prensa-viewer-back');
    const prensaViewerNav  = document.getElementById('prensa-viewer-nav');
    const prensaViewerPrev = document.getElementById('prensa-viewer-prev');
    const prensaViewerNext = document.getElementById('prensa-viewer-next');
    const prensaViewerCounter = document.getElementById('prensa-viewer-counter');

    let pvImages = [];
    let pvIndex  = 0;
    const isMobileDevice = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    function openPrensaViewer(images, index) {
        if (!Array.isArray(images)) images = [images];
        // PDFs en móvil → abrir en nueva pestaña (iOS no renderiza iframes PDF)
        if (isMobileDevice() && images[index].toLowerCase().endsWith('.pdf')) {
            window.open(images[index], '_blank');
            return;
        }
        pvImages = images;
        pvIndex  = index;
        renderPVSlide();
        prensaViewer.classList.add('open');
        prensaViewer.setAttribute('aria-hidden', 'false');
        prensaViewer.scrollTop = 0;
    }

    function renderPVSlide() {
        prensaViewerContent.innerHTML = '';
        const href  = pvImages[pvIndex];
        const isPDF = href.toLowerCase().endsWith('.pdf');
        if (isPDF) {
            const iframe = document.createElement('iframe');
            iframe.src = href;
            prensaViewerContent.appendChild(iframe);
        } else {
            const img = document.createElement('img');
            img.src  = href;
            img.alt  = 'Prensa';
            prensaViewerContent.appendChild(img);
        }
        // Flechas y contador: solo si hay más de una imagen
        const multi = pvImages.length > 1;
        prensaViewerNav.style.display = multi ? 'flex' : 'none';
        if (multi) prensaViewerCounter.textContent = (pvIndex + 1) + ' / ' + pvImages.length;
        prensaViewer.scrollTop = 0;
    }

    function closePrensaViewer() {
        prensaViewer.classList.remove('open');
        prensaViewer.setAttribute('aria-hidden', 'true');
        setTimeout(() => { prensaViewerContent.innerHTML = ''; }, 300);
    }

    prensaViewerPrev.addEventListener('click', () => {
        pvIndex = (pvIndex - 1 + pvImages.length) % pvImages.length;
        renderPVSlide();
    });
    prensaViewerNext.addEventListener('click', () => {
        pvIndex = (pvIndex + 1) % pvImages.length;
        renderPVSlide();
    });

    document.querySelectorAll('.prensa-open').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            // Link dentro de .prensa-paginas → cargar todas las páginas del grupo
            const paginas = link.closest('.prensa-paginas');
            if (paginas) {
                const all = [...paginas.querySelectorAll('.prensa-open')];
                openPrensaViewer(all.map(l => l.getAttribute('href')), all.indexOf(link));
                return;
            }

            // Título de un artículo con .prensa-paginas → abrir desde la 1ª página
            if (link.classList.contains('prensa-titulo')) {
                const li = link.closest('li');
                const pg = li && li.querySelector('.prensa-paginas');
                if (pg) {
                    const all = [...pg.querySelectorAll('.prensa-open')];
                    openPrensaViewer(all.map(l => l.getAttribute('href')), 0);
                    return;
                }
            }

            // Ítem único
            openPrensaViewer([href], 0);
        });
    });

    prensaViewerBack.addEventListener('click', closePrensaViewer);

    document.addEventListener('keydown', (e) => {
        if (!prensaViewer.classList.contains('open')) return;
        if (e.key === 'Escape') closePrensaViewer();
        if (e.key === 'ArrowLeft')  { pvIndex = (pvIndex - 1 + pvImages.length) % pvImages.length; renderPVSlide(); }
        if (e.key === 'ArrowRight') { pvIndex = (pvIndex + 1) % pvImages.length; renderPVSlide(); }
    });

    // ─── Photo Lightbox (Tablao) ─────────
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    let lbImages = [];
    let lbIndex = 0;

    function openLightbox(images, index) {
        lbImages = images;
        lbIndex = index;
        showLightboxSlide();
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function showLightboxSlide() {
        lightboxImg.src = lbImages[lbIndex];
        lightboxCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
        lightboxPrev.style.visibility = lbImages.length > 1 ? 'visible' : 'hidden';
        lightboxNext.style.visibility = lbImages.length > 1 ? 'visible' : 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lightboxPrev.addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLightboxSlide(); });
    lightboxNext.addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbImages.length; showLightboxSlide(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLightboxSlide(); }
        if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; showLightboxSlide(); }
        if (e.key === 'Escape') closeLightbox();
    });

    document.querySelectorAll('.prensa-item[data-gallery]').forEach(item => {
        item.addEventListener('click', () => {
            const galleryId = item.dataset.gallery;
            const index = parseInt(item.dataset.index);
            const imgs = [...document.querySelectorAll(`.prensa-item[data-gallery="${galleryId}"]`)]
                .map(el => el.querySelector('img').src);
            openLightbox(imgs, index);
        });
    });

    // ─── Deep links (Instagram / YouTube) ──
    function toAppScheme(url) {
        // YouTube: vídeo
        const ytVideo = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
        if (ytVideo) return 'vnd.youtube://' + ytVideo[1];

        // YouTube: short
        const ytShort = url.match(/(?:youtube\.com|youtu\.be)\/shorts\/([\w-]+)/);
        if (ytShort) return 'vnd.youtube://' + ytShort[1];

        // YouTube: canal
        const ytChannel = url.match(/youtube\.com\/@([\w-]+)/);
        if (ytChannel) return 'vnd.youtube://www.youtube.com/@' + ytChannel[1];

        // Instagram: perfil  (instagram.com/USERNAME/ — sin /reel/ ni /p/)
        const igProfile = url.match(/instagram\.com\/(?!reel|p\/)([A-Za-z0-9._]+)\/?(?:[?#]|$)/);
        if (igProfile) return 'instagram://user?username=' + igProfile[1];

        // Instagram reels/posts → Universal Links de iOS lo gestionan solo
        return null;
    }

    const isMobileUA = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    document.querySelectorAll('a[href*="instagram.com"], a[href*="youtube.com"]').forEach(link => {
        link.addEventListener('click', function (e) {
            if (!isMobileUA()) return;
            const appUrl = toAppScheme(this.href);
            if (!appUrl) return; // reels/posts: dejar que Universal Links actúe

            e.preventDefault();

            // Intentar abrir la app via iframe oculto (no navega fuera de la página)
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'display:none;width:0;height:0;';
            document.body.appendChild(iframe);

            let appOpened = false;
            const onBlur = () => { appOpened = true; };
            window.addEventListener('blur', onBlur, { once: true });

            const fallback = setTimeout(() => {
                window.removeEventListener('blur', onBlur);
                if (document.body.contains(iframe)) document.body.removeChild(iframe);
                if (!appOpened) window.open(this.href, '_blank');
            }, 1300);

            window.addEventListener('blur', () => {
                clearTimeout(fallback);
                setTimeout(() => {
                    if (document.body.contains(iframe)) document.body.removeChild(iframe);
                }, 200);
            }, { once: true });

            iframe.src = appUrl;
        });
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
