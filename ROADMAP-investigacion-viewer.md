# ROADMAP — Investigación: visor de documentos en móvil

## Documentos afectados

| # | Título | Archivo |
|---|--------|---------|
| 1 | «El caos creativo. TFM» | `Investigación/EL CAOS CREATIVO. TFM Lucía Nicolas.pdf` |
| 2 | «Investigamos dúo en Estancias Coreográficas 2020» | `Investigación/Estancias coreograficas Yoshua Cienfuegos/1. PUBLICACION EC20.pdf` |

Ambos usan `class="prensa-titulo prensa-open"` → abren en `#prensa-viewer`.

---

## Situación actual

Comparten exactamente el mismo visor que prensa (`#prensa-viewer`).
El problema es idéntico al descrito en `ROADMAP-prensa-mobile-scroll.md`:
- En iOS/Android, el `overflow-y: auto` en un hijo flex de `position: fixed` no genera scroll táctil fiable
- Los PDFs son documentos largos (TFM = ~80 págs) → imprescindible poder scrollear

---

## Solución — igual que prensa

No hay código separado para investigación: **el fix del visor de prensa lo arregla todo**.

### Plan de implementación conjunto (prensa + investigación)

#### `styles.css`

```css
/* ANTES */
.prensa-viewer {
    position: fixed; inset: 0; z-index: 3000;
    background: #0d0d0d;
    display: flex; flex-direction: column;   /* ← PROBLEMA */
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
}
.prensa-viewer-back {
    position: absolute;   /* ← se pierde al hacer scroll */
    top: 1.2rem; left: 1.5rem;
    z-index: 3001;
}
.prensa-viewer-content {
    flex: 1;
    overflow-y: auto;          /* ← no funciona en iOS dentro de flex */
    -webkit-overflow-scrolling: touch;
    padding: 4rem 1rem 1rem;
}

/* DESPUÉS */
.prensa-viewer {
    position: fixed; inset: 0; z-index: 3000;
    background: #0d0d0d;
    overflow-y: auto;                         /* scroll en el fixed directamente */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
    /* eliminar display:flex */
}
.prensa-viewer-back {
    position: sticky;   /* permanece visible mientras se scrollea */
    top: 1.2rem;
    /* quitar z-index: ya no hace falta */
    /* resto igual */
}
.prensa-viewer-content {
    /* ya no necesita overflow propio */
    padding: 4rem 1rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.prensa-viewer-content iframe {
    width: 100%;
    height: 100vh;   /* ocupa una pantalla; el scroll del padre permite avanzar */
    border: none;
    display: block;
}
.prensa-viewer-content img {
    max-width: 100%;
    height: auto;     /* sin max-height: imagen a ancho completo, scrolleable */
    display: block;
}
```

#### `script.js`

```js
/* Quitar estas dos líneas del bloque openPrensaViewer / closePrensaViewer:
   document.body.style.overflow = 'hidden';   ← interfiere con iOS touch
   document.body.style.overflow = '';
   Sustituirlas por nada — el overlay fixed ya bloquea el scroll de body visualmente */

/* TAMBIÉN quitar el bloque isMobileDevice para PDFs:
   ya no hace falta abrir en nueva pestaña en móvil
   porque el visor ahora sí scrollea en iOS */
```

---

## Notas adicionales sobre PDFs largos (TFM)

El TFM tiene ~80 páginas. Con `iframe height: 100vh` el usuario verá la primera pantalla
del PDF y tendrá que hacer scroll para avanzar página a página dentro del iframe.
Esto es lo máximo que se puede conseguir con un iframe nativo en móvil sin depender
de librerías externas (PDF.js).

Si en un futuro se quiere mejor experiencia de PDF en móvil → migrar a PDF.js
(renderiza el PDF como canvas, control total del scroll). Se deja como mejora futura.

---

## Orden de implementación (conjunto con prensa)

1. `styles.css` — reescribir `.prensa-viewer`, `.prensa-viewer-back`, `.prensa-viewer-content`
2. `script.js` — quitar `body.overflow` y el bloque `isMobileDevice`
3. Prueba local: abrir prensa + investigación en DevTools mobile
4. Commit + push
