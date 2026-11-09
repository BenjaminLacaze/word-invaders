# GUÍA DE RECURSOS GRÁFICOS Y SPRITES (ASSETS.md)

Este documento detalla todas las imágenes del proyecto **WORD INVADERS** para que puedas diseñar tus propios sprites en estilo *pixel art* (usando herramientas como **Aseprite**, **Piskel**, **LibreSprite** o **GIMP**) y reemplazarlos fácilmente.

---

## 1. ¿Cómo funciona el reemplazo de gráficos?

El proyecto está programado con un **Sistema de Reemplazo Transparente** dentro de `src/scenes/BootScene.js`:

1. Todos los sprites se guardan en la carpeta:
   ```text
   public/assets/images/
   ```
2. Actualmente, esa carpeta incluye sprites *pixel art* provisionales con las medidas exactas para que el juego funcione desde el primer momento.
3. Además, si borras alguno de esos archivos, el juego genera automáticamente en memoria una figura provisional usando código de Phaser para que nunca ocurra un error.
4. **Para poner tus propios gráficos:** simplemente guarda tu imagen en formato `.png` dentro de `public/assets/images/` respetando el **nombre exacto del archivo** de la tabla inferior y recarga el navegador. No necesitas modificar ni una sola línea de código.

---

## 2. Tabla de Especificaciones de Sprites

| Recurso | Nombre del Archivo | Ruta Completa | Dimensiones Recomendadas | Formato | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nave (Fotograma 1)** | `player.png` | `public/assets/images/player.png` | **32 x 32 px** | PNG (fondo transparente) | **Obligatorio** (incluye versión provisional) |
| **Nave (Fotograma 2 - Motores)** | `player_2.png` | `public/assets/images/player_2.png` | **32 x 32 px** | PNG (fondo transparente) | **Obligatorio** (incluye versión provisional) |
| **Marco de Letra** | `letter_tile.png` | `public/assets/images/letter_tile.png` | **40 x 40 px** | PNG (fondo transparente) | **Obligatorio** (incluye versión provisional) |
| **Proyectil / Disparo** | `bullet.png` | `public/assets/images/bullet.png` | **8 x 16 px** | PNG (fondo transparente) | **Opcional** (incluye versión provisional) |
| **Fondo Espacial (Fotograma 1)** | `background.png` | `public/assets/images/background.png` | **64 x 64 px** (mosaico repetible) o **800 x 600 px** | PNG | **Opcional** (incluye versión provisional) |
| **Fondo Espacial (Fotograma 2)** | `background_2.png` | `public/assets/images/background_2.png` | **64 x 64 px** (mosaico repetible) o **800 x 600 px** | PNG | **Opcional** (incluye versión provisional) |
| **Logo del Menú** | `logo.png` | `public/assets/images/logo.png` | **400 x 120 px** | PNG (fondo transparente) | **Opcional** (usa texto si no existe el archivo) |

---

## 3. Consejos para diseñar cada Sprite

### `player.png` (32 x 32 píxeles)
- Representa la nave espacial controlada por el jugador en la parte inferior de la pantalla.
- El cañón debe apuntar hacia **arriba** y estar centrado horizontalmente (alrededor de las columnas centrales `X = 15` y `X = 16`), ya que los disparos salen desde el centro superior de la nave.
- Exporta siempre con **fondo transparente** (canal alfa).

### `letter_tile.png` (40 x 40 píxeles)
- Es la caja o bloque sobre el cual Phaser dibuja dinámicamente cada letra (`A-Z`).
- **Importante:** No dibujes letras dentro de `letter_tile.png`. Dibuja únicamente el marco o bloque contenedor.
- Usa un color **oscuro y uniforme en el centro** (por ejemplo, azul oscuro o gris espacial) para que las letras blancas que Phaser escribe encima se lean con total claridad.

### `bullet.png` (8 x 16 píxeles)
- Es el láser vertical que dispara la nave.
- Utiliza colores brillantes (amarillo, cian o verde neón) para que destaque sobre el fondo oscuro.

### `background.png` (64 x 64 píxeles o 800 x 600 píxeles)
- El juego utiliza un `tileSprite` que repite tu imagen en mosaico hasta cubrir la pantalla de `800 x 600 px`.
- Puedes crear un patrón pequeño de `64 x 64 px` o una imagen completa de `800 x 600 px`.
- Evita colores muy brillantes en el fondo para no distraer la vista del estudiante al leer las letras.

### `logo.png` (400 x 120 píxeles)
- Si colocas un archivo llamado `logo.png` en `public/assets/images/`, la pantalla de inicio (`MenuScene`) mostrará tu logotipo gráfico en lugar del título de texto predeterminado.

---

## 4. Elementos generados automáticamente por Phaser

Para mantener el proyecto ligero y ahorrarte trabajo repetitivo, los siguientes elementos se crean directamente mediante código en Phaser:

1. **Letras del alfabeto (`A` - `Z`):** Se dibujan como texto centrado sobre cada bloque `letter_tile.png`.
2. **Partículas de explosión:** Pequeños cuadrados de `4 x 4 px` que saltan al destruir una letra.
3. **Interfaz de usuario (HUD):** El panel superior con el nivel actual, los errores acumulados y la palabra en español a traducir.
