# ROADMAP — Reestructuración Prensa

## Objetivo
Reemplazar el carrusel de imágenes de la sección **Prensa** por una lista clicable de artículos, donde cada entrada abre el PDF o imagen correspondiente.

---

## Nueva estructura de la sección Prensa

Cada ítem tendrá:
- **Publicación** (negrita)
- *Título del artículo* (cursiva, clicable → abre PDF o imagen)
- Fecha / Edición
- Descripción breve (1–2 líneas)

---

## Lista de artículos y archivos vinculados

| # | Publicación | Título | Fecha | Archivo |
|---|-------------|--------|-------|---------|
| 1 | VSD México | *"Ibérica Conecta"* | Agosto 2025 · Págs. 29–31 | `PRENSA/VSD-Iberica agosto.pdf` ✅ |
| 2 | VSD México | *"Ibérica Conecta"* | Junio 2025 · Págs. 118–119 | `PRENSA/VSD-regresa iberica junio.pdf` ✅ |
| 3 | VSD México | *"La danza como motor para la vida"* | Marzo 2025 · Págs. 26–29 | `PRENSA/VSD-2025_La danza como motor para la vida.pdf` ✅ |
| 4 | VSD México | *"En la Inmensidad de tu Voz"* | Febrero 2025 · Págs. 70–71 | `PRENSA/VSD-l-FEBRERO-2025 En la inmensidad de tu voz.pdf` ✅ |
| 5 | Weekend by VSD (AM Querétaro) | *"El Apoyo Total de Proart"* | Diciembre 2021 | `PRENSA/el apoyo total de proart.jpeg` ✅ |
| 6 | Weekend by VSD (AM Querétaro) | *"Centro de Danza y Arte Proart"* | Diciembre 2021 | `PRENSA/el apoyo total de proart 2.jpeg` ✅ |
| 7 | SusyQ, Revista de Danza | *"Nuevo Flamenco"* | Ed. Especial nº96, Oct **2025** | `PRENSA/Susy Q 1.jpeg` + `Susy Q 2.jpeg` + `Susy Q 3..jpeg` ✅ |
| 8 | La Opinión de Murcia | *"El Villegas en Danza"* | — | `PRENSA/El villegas en danza.jpeg` ✅ |
| 9 | La Opinión de Murcia | *"Rocío Molina y José Antonio García, Premios Tiempo de Danza"* | — | `PRENSA/Premios tiempo de danza.jpeg` ✅ |

### Imágenes disponibles en PRENSA/ sin asignar:
- `WhatsApp Image 2026-04-08 at 08.49.00.jpeg`
- `WhatsApp Image 2026-04-08 at 08.49.00 (1).jpeg`
- `WhatsApp Image 2026-04-08 at 08.49.01.jpeg`
- `WhatsApp Image 2026-04-08 at 08.50.56.jpeg`
- `WhatsApp Image 2026-04-08 at 09.30.44.jpeg`
- `WhatsApp Image 2026-04-08 at 09.31.23.jpeg`
- `WhatsApp Image 2026-04-08 at 09.32.06.jpeg`
- `8m.png`, `Clases 1.png`, `clases 2.png`, `fotos flamencas.png`, `iberica.png`
- `Iberica 1.jpg`, `Iberica 2.jpg`, `Iberica 3.jpg`

> **Pendiente:** Confirmar qué imagen/archivo corresponde a cada artículo de los ítems 5–9.

---

## Cambios en el HTML (`index.html`)

### Eliminar
- El carrusel de prensa completo (`.prensa-carousel`, flechas, dots, viewport/track)
- El zoom overlay de prensa

### Añadir
- Nueva sección `.prensa-lista` con los 9 ítems en formato lista
- Cada ítem: `<a>` que abre el archivo en nueva pestaña + bloque de texto

### Estructura HTML del ítem:
```html
<div class="prensa-item-lista">
  <div class="prensa-item-meta">
    <span class="prensa-publicacion">VSD México</span>
    <span class="prensa-fecha">Agosto 2025 · Págs. 29–31</span>
  </div>
  <a href="PRENSA/VSD-Iberica agosto.pdf" target="_blank" class="prensa-titulo">
    "Ibérica Conecta"
  </a>
  <p class="prensa-desc">Entrevista a Sandra Ostrowski...</p>
</div>
```

---

## Cambios en el CSS (`styles.css`)

### Eliminar
- Todos los estilos del carrusel: `.prensa-carousel`, `.prensa-viewport`, `.prensa-track`, `.prensa-slide`, `.prensa-arrow`, `.prensa-dots`, `.prensa-rotated`
- Estilos del zoom overlay de prensa

### Añadir
- `.prensa-lista` — contenedor con separadores entre ítems
- `.prensa-item-lista` — cada fila (flex o grid)
- `.prensa-publicacion` — nombre revista (bold, color crema)
- `.prensa-fecha` — fecha (pequeño, opaco)
- `.prensa-titulo` — enlace del artículo (cursiva, color amarillo al hover)
- `.prensa-desc` — descripción (light, gris claro)

---

## Cambios en el JS (`index.html` `<script>`)

### Eliminar
- Lógica del carrusel de prensa (flechas, dots, autoplay si existe)
- Lógica del zoom overlay de prensa

---

## Pendientes antes de codificar

- [x] Confirmar archivos para ítems 5, 6, 7, 8 y 9
- [x] Decidir si los artículos sin fecha llevan guión o se omite el campo → se omite
- [x] SusyQ nº96 → Oct 2025 (confirmado)
- [ ] SusyQ tiene 3 páginas → se enlazan las 3 imágenes (abren en lightbox o nueva pestaña secuencial)

---

## Orden de implementación

1. ~~Confirmar archivos pendientes (ítems 5–9)~~ ✅
2. ~~Editar `index.html`: eliminar carrusel → insertar lista~~ ✅
3. ~~Editar `styles.css`: eliminar estilos carrusel → añadir estilos lista~~ ✅
4. ~~Limpiar JS del carrusel~~ ✅
5. Cambiar vídeo del hero → `VIDEOS PARA INICIO/Home MP4.mp4` ✅ (pendiente commit)
6. Visor de prensa in-page (lightbox con flecha ← para volver) ✅ (pendiente commit)
7. Probar en local
8. Commit + push a GitHub

---

## Tareas completadas recientemente

### Cambio de vídeo hero
- De: `IMG_9343.PNG.mov` → A: `Home MP4.mp4`
- El `.mp4` carga antes y pesa menos que el `.mov`

### Visor de prensa in-page
- Los enlaces de prensa ya NO abren en nueva pestaña
- Se abre un overlay fullscreen con el PDF (iframe) o imagen (img)
- Flecha `←` en esquina superior izquierda para volver
- Tecla Escape también cierra
