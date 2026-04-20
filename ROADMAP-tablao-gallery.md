# ROADMAP — Tablao: fix link + galería lightbox

## Cambios necesarios

### 1. Corregir enlace de Instagram
- Actual:  `https://www.instagram.com/reels/C5yr-SIgpOs/`
- Correcto: `https://www.instagram.com/reel/C5yr-SIgpOs/?igsh=anIyaWI3aTV6bmI3`
- Archivo: `index.html` línea ~360

---

### 2. Galería lightbox con flechas

#### Comportamiento
- Click/tap en cualquier `.prensa-item` dentro del Tablao → abre lightbox
- Lightbox: fondo negro, foto centrada, flechas ← → para navegar
- Teclas ← → del teclado también navegan (desktop)
- Escape o clic fuera cierra
- Las dos galerías (Tablao 1 y Tablao 2) son **independientes** — cada una tiene su propio set de imágenes

#### Estructura HTML — añadir al final del body
```html
<div id="photo-lightbox" class="photo-lightbox" aria-hidden="true">
  <button class="lightbox-close" id="lightbox-close">×</button>
  <button class="lightbox-prev" id="lightbox-prev">&#8592;</button>
  <button class="lightbox-next" id="lightbox-next">&#8594;</button>
  <div class="lightbox-img-wrap">
    <img id="lightbox-img" src="" alt="">
  </div>
  <div class="lightbox-counter" id="lightbox-counter">1 / 4</div>
</div>
```

#### Cambios HTML en las fotos — añadir `data-gallery` y `data-index`
Cada `.prensa-item` necesita:
- `data-gallery="tablao1"` o `"tablao2"` (grupo al que pertenece)
- `data-index="0"`, `"1"`, `"2"`... (posición en el grupo)
- cursor pointer ya lo tiene via CSS hover

```html
<!-- Tablao 1 -->
<div class="prensa-item" data-gallery="tablao1" data-index="0"><img ...></div>
<div class="prensa-item" data-gallery="tablao1" data-index="1"><img ...></div>
...
<!-- Tablao 2 -->
<div class="prensa-item" data-gallery="tablao2" data-index="0"><img ...></div>
...
```

#### CSS — `.photo-lightbox` (nuevo bloque)
```css
.photo-lightbox {
    position: fixed; inset: 0; z-index: 4000;
    background: rgba(0,0,0,0.95);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
}
.photo-lightbox.open { opacity: 1; pointer-events: all; }

.lightbox-img-wrap { max-width: 90vw; max-height: 90vh; }
.lightbox-img-wrap img { max-width: 100%; max-height: 90vh; object-fit: contain; display: block; }

.lightbox-close {
    position: absolute; top: 1rem; right: 1.5rem;
    font-size: 2rem; background: none; border: none;
    color: var(--color-cream); cursor: pointer;
}
.lightbox-prev, .lightbox-next {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: none; border: 1px solid rgba(240,235,227,0.3);
    color: var(--color-cream); font-size: 1.5rem;
    padding: 0.75rem 1rem; cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
}
.lightbox-prev { left: 1rem; }
.lightbox-next { right: 1rem; }
.lightbox-prev:hover, .lightbox-next:hover {
    border-color: var(--color-yellow); color: var(--color-yellow);
}
.lightbox-counter {
    position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
    font-size: 0.7rem; letter-spacing: 0.15em;
    color: rgba(240,235,227,0.5);
}

/* Móvil: flechas más grandes para touch */
@media (max-width: 768px) {
    .lightbox-prev, .lightbox-next { padding: 1rem 1.2rem; font-size: 1.8rem; }
    .lightbox-img-wrap { max-width: 100vw; }
    .lightbox-img-wrap img { max-height: 85vh; }
}
```

#### JS — lógica del lightbox (añadir en `script.js`)
```js
// ─── Photo Lightbox ─────────────────
const lightbox = document.getElementById('photo-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

let lbImages = [];   // array de src de la galería activa
let lbIndex = 0;

function openLightbox(images, index) {
    lbImages = images;
    lbIndex = index;
    showLightboxSlide();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
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
    document.body.style.overflow = '';
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

// Conectar prensa-items con el lightbox
document.querySelectorAll('.prensa-item[data-gallery]').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        const galleryId = item.dataset.gallery;
        const index = parseInt(item.dataset.index);
        const imgs = [...document.querySelectorAll(`.prensa-item[data-gallery="${galleryId}"]`)]
            .map(el => el.querySelector('img').src);
        openLightbox(imgs, index);
    });
});
```

---

## Orden de implementación
1. `index.html` — corregir link Instagram
2. `index.html` — añadir `data-gallery` y `data-index` a cada `.prensa-item`
3. `index.html` — añadir `<div id="photo-lightbox">` antes de `</body>`
4. `styles.css` — añadir bloque `.photo-lightbox` y variantes mobile
5. `script.js` — añadir lógica del lightbox
6. Commit + push
