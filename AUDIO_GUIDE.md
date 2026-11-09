# GUÍA DE MÚSICA Y SONIDOS (AUDIO_GUIDE.md)

Este documento explica cómo agregar tu propia música de fondo y efectos de sonido al videojuego **WORD INVADERS** sin necesidad de modificar el código fuente.

---

## 1. Carpeta de Destino

Todos los archivos de audio deben colocarse dentro de la siguiente carpeta del proyecto:

```text
public/assets/audio/
```

> **Nota importante:** Por defecto, la carpeta `public/assets/audio/` está vacía. Mientras no agregues los archivos de audio, el juego detecta su ausencia automáticamente mediante `SoundManager.js` y funciona en silencio sin producir ningún error.

---

## 2. Nombres de Archivo y Especificaciones

Para que el juego reconozca y reproduzca automáticamente cada sonido, guarda tus archivos en `public/assets/audio/` usando exactamente los siguientes nombres:

| Evento / Función | Nombre del Archivo | Ruta Completa | Formatos Soportados | Duración Recomendada | Comportamiento en el Juego |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Música de fondo** | `bgm.mp3` *(o `.ogg` / `.wav`)* | `public/assets/audio/bgm.mp3` | `.mp3`, `.ogg`, `.wav` | 30 s – 2 min (repetible) | Se reproduce en bucle continuo (`loop: true`) al iniciar la partida con volumen moderado (`0.4`). |
| **Sonido de disparo** | `shoot.mp3` *(o `.ogg` / `.wav`)* | `public/assets/audio/shoot.mp3` | `.mp3`, `.ogg`, `.wav` | 0.1 s – 0.3 s | Suena cada vez que la nave dispara un proyectil con la `Barra Espaciadora`. |
| **Destrucción de letra** | `destroy.mp3` *(o `.ogg` / `.wav`)* | `public/assets/audio/destroy.mp3` | `.mp3`, `.ogg`, `.wav` | 0.2 s – 0.4 s | Suena cuando un proyectil impacta y destruye una **letra sobrante**. |
| **Sonido de error** | `error.mp3` *(o `.ogg` / `.wav`)* | `public/assets/audio/error.mp3` | `.mp3`, `.ogg`, `.wav` | 0.4 s – 0.8 s | Suena cuando el jugador dispara por equivocación a una **letra correcta** antes de reiniciarse el nivel. |
| **Palabra completada** | `word_complete.mp3` *(o `.ogg` / `.wav`)* | `public/assets/audio/word_complete.mp3` | `.mp3`, `.ogg`, `.wav` | 0.6 s – 1.5 s | Suena al destruir la última letra sobrante y formar la palabra correcta en inglés. |

---

## 3. ¿Cómo funciona en el código?

El sistema de audio está dividido en 3 partes sencillas:

1. **Constantes (`src/config/constants.js`):**
   - Define las claves de cada sonido en `AUDIO_KEYS` (`bgm`, `shoot`, `destroy`, `error`, `word_complete`) y sus volúmenes predeterminados en `AUDIO_VOLUMES`.
2. **Carga de recursos (`src/scenes/BootScene.js`):**
   - Intenta precargar los 5 archivos desde `public/assets/audio/`.
   - Si alguno aún no fue creado por ti, lo ignora de forma segura sin bloquear la carga del juego.
3. **Administrador de sonido (`src/managers/SoundManager.js`):**
   - Antes de reproducir cualquier pista o efecto, comprueba con `hasAudio(key)` si el archivo existe en la memoria de Phaser.
   - Evita que la música de fondo (`bgm`) se duplique al reiniciar un nivel o pasar al siguiente.
   - Permite silenciar o reactivar todo el sonido del juego en cualquier momento presionando la tecla **`M`** durante la partida.

---

## 4. Cómo ajustar el volumen (Opcional)

Si después de colocar tus archivos sientes que la música suena muy fuerte respecto a los efectos, puedes abrir el archivo `src/config/constants.js` y modificar los valores de `AUDIO_VOLUMES` (entre `0.0` y `1.0`):

```javascript
export const AUDIO_VOLUMES = {
  BGM: 0.4,           // Música de fondo (40%)
  SHOOT: 0.6,         // Disparo (60%)
  DESTROY: 0.7,       // Destrucción de letra sobrante (70%)
  ERROR: 0.8,         // Error al disparar a letra correcta (80%)
  WORD_COMPLETE: 0.8  // Palabra completada (80%)
};
```
