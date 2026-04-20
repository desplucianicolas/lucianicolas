# ROADMAP — Fix scroll visor de prensa en móvil

## Diagnóstico

### Por qué falla ahora
El visor usa esta estructura flex:

```
.prensa-viewer          → position: fixed; inset: 0; display: flex; flex-direction: column
  .prensa-viewer-back   → position: absolute (encima)
  .prensa-viewer-content → flex: 1; overflow-y: auto   ← aquí intenta scrollear
```

**Problema raíz:** en iOS Safari, `overflow: auto` dentro de un hijo flex
de un `position: fixed` NO genera scroll táctil fiable. iOS necesita que el
scroll esté en el **elemento fixed directamente**, no en un hijo con flex.

Además, `document.body.style.overflow = 'hidden'` en combinación con un
hijo-flex-que-intenta-scrollear es un bug conocido de iOS Safari.

---

## Solución

### Patrón correcto para iOS
Mover el `overflow-y: auto + -webkit-overflow-scrolling: touch` al propio
`.prensa-viewer` (el elemento `position: fixed`), no al hijo.

El botón ← pasa de `position: absolute` a `position: sticky; top: 0`
para que se quede visible mientras se hace scroll.

### Cambios en `styles.css`

**`.prensa-viewer`** — añadir scroll aquí, quitar flex:
```css
.prensa-viewer {
    position: fixed;
    inset: 0;
    z-index: 3000;
    background: #0d0d0d;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    /* eliminar: display:flex; flex-direction:column */
}
```

**`.prensa-viewer-back`** — sticky en lugar de absolute:
```css
.prensa-viewer-back {
    position: sticky;
    top: 1.2rem;
    /* quitar z-index ya no hace falta con sticky */
}
```

**`.prensa-viewer-content`** — ya no necesita overflow, solo padding:
```css
.prensa-viewer-content {
    padding: 1rem 1rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
}
```

**`.prensa-viewer-content iframe`**:
```css
.prensa-viewer-content iframe {
    width: 100%;
    height: 100vh;   /* altura fija, scroll lo da el padre */
    border: none;
    display: block;
}
```

**`.prensa-viewer-content img`**:
```css
.prensa-viewer-content img {
    max-width: 100%;
    height: auto;
    display: block;
}
```

### Cambios en `script.js`
- Quitar `document.body.style.overflow = 'hidden'` al abrir
  (ya no hace falta: el scroll del body está bloqueado por el overlay fixed)
- Quitar `document.body.style.overflow = ''` al cerrar

---

## Por qué esto funciona
- iOS hace scroll en elementos `position: fixed` con `overflow-y: auto` directamente
- Sticky funciona dentro de un contenedor scrolleable
- Sin `body overflow:hidden` se evita el conflicto de iOS con touch events

---

## Orden de implementación
1. Editar `styles.css` — 5 bloques de CSS
2. Editar `script.js` — quitar 2 líneas body.overflow
3. Probar en local abriendo en móvil (o DevTools device mode)
4. Commit + push
