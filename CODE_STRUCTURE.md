# ESTRUCTURA DEL CÓDIGO (CODE_STRUCTURE.md)

Esta guía está pensada para estudiantes que están aprendiendo a programar videojuegos con **JavaScript** y **Phaser 3**. Aquí descubrirás cómo está organizado el proyecto y qué hace cada archivo.

---

## 1. Mapa de Carpetas

```text
word-invaders/
├── index.html                  # Página web donde se dibuja el juego
├── package.json                # Lista de librerías (Phaser y Vite) y comandos
├── vite.config.js              # Configuración del servidor y empaquetador Vite
├── public/                     # Archivos públicos (imágenes y datos JSON)
│   ├── data/
│   │   └── glossary.json       # Lista de palabras en español e inglés
│   └── assets/
│       └── images/             # Sprites PNG del juego (player, bullet, letter_tile...)
├── src/                        # Todo el código fuente de JavaScript
│   ├── main.js                 # Archivo que arranca Phaser
│   ├── style.css               # Estilos para centrar el juego en fondo oscuro
│   ├── config/
│   │   ├── constants.js        # Colores, velocidades y medidas fijas
│   │   └── gameConfig.js       # Configuración general de Phaser 3
│   ├── managers/
│   │   ├── GlossaryManager.js  # Lee y valida las palabras del glosario
│   │   └── LevelManager.js     # Controla el nivel actual y los errores
│   ├── systems/
│   │   └── WordGenerator.js    # Crea la fila de letras mezcladas
│   ├── entities/
│   │   ├── Player.js           # La nave espacial que maneja el jugador
│   │   ├── Bullet.js           # El disparo que sube por la pantalla
│   │   └── LetterBox.js        # Cada recuadro con una letra arriba
│   └── scenes/
│       ├── BootScene.js        # Carga las imágenes y datos al principio
│       ├── MenuScene.js        # Pantalla de título e instrucciones
│       ├── GameScene.js        # Pantalla principal donde se juega
│       └── VictoryScene.js     # Pantalla de felicitación al terminar
└── tests/
    └── verifyLogic.js          # Pruebas automáticas de la lógica de palabras
```

---

## 2. Conceptos Básicos de la Arquitectura

Para no mezclar todo el código en un solo archivo gigante, el juego se divide en **4 tipos de componentes**:

### A. Configuración (`src/config/`)
- **`constants.js`:** Guarda números y textos que usamos en muchos lugares, como el tamaño de la pantalla (`800x600`), la velocidad de la nave (`300`) o los códigos de color. Si algún día quieres que la nave se mueva más rápido, solo cambias `PLAYER_SPEED` aquí.
- **`gameConfig.js`:** Le dice a Phaser qué tamaño tiene el juego, que active el modo `pixelArt: true` (para que los sprites se vean nítidos y no borrosos) y qué sistema de físicas usar (`arcade`).

### B. Administradores y Sistemas Lógicos (`src/managers/` y `src/systems/`)
Estos archivos usan **JavaScript puro** y se encargan de las reglas pensantes del juego:
- **`GlossaryManager.js`:** Revisa los datos de `glossary.json` para asegurarse de que todas las palabras tengan su versión en español (`es`) y en inglés (`en`).
- **`WordGenerator.js`:** Recibe una palabra en inglés (como `"DOG"`) y le intercala letras sobrantes al azar (por ejemplo: `V - D - O - W - G - P`), marcando cuáles son necesarias (`isExtra: false`) y cuáles son sobrantes (`isExtra: true`).
- **`LevelManager.js`:** Recuerda en qué nivel estás y cuántos errores llevas. Además, **guarda en memoria (caché) la secuencia de letras del nivel actual**: así, si te equivocas y el nivel se reinicia, vuelven a aparecer exactamente las mismas letras sin cambiar de orden.

### C. Entidades (`src/entities/`)
Las entidades son los objetos visibles que interactúan dentro del mundo del juego:
- **`Player.js`:** Es la nave del jugador. Escucha las teclas del teclado (Flechas o `A`/`D`) para moverse a izquierda y derecha sin salirse de los bordes.
- **`Bullet.js`:** Es el proyectil. Al crearse, sube en línea recta hacia arriba y se destruye automáticamente si sale de la pantalla o choca contra una letra.
- **`LetterBox.js`:** Es un contenedor (`Container`) que une dos cosas: el dibujo del bloque (`letter_tile.png`) y el texto de la letra encima. También sabe si es una letra sobrante (`isExtra`) o una letra necesaria.

### D. Escenas de Phaser (`src/scenes/`)
En Phaser, el juego se divide en "Escenas" (como las pantallas o etapas de una película):
1. **`BootScene.js`:** Es la primera escena que se ejecuta. Carga `glossary.json` y las imágenes de `public/assets/images/`. Si falta alguna imagen, la dibuja por código para que el juego nunca falle.
2. **`MenuScene.js`:** Muestra el título **WORD INVADERS** y las instrucciones. Al pulsar `ESPACIO` o `ENTER`, pasa a `GameScene`.
3. **`GameScene.js`:** Es donde ocurre la acción. Crea el panel superior (HUD), coloca la fila de letras, crea la nave y vigila cuándo un proyectil (`Bullet`) toca una caja de letra (`LetterBox`).
4. **`VictoryScene.js`:** Se abre cuando superas la última palabra del glosario y te muestra tus estadísticas finales.

---

## 3. Flujo de una Colisión (Paso a Paso)

Cuando presionas `ESPACIO` en `GameScene.js`:
1. Se crea un objeto `Bullet` en la posición de la nave y empieza a subir.
2. Phaser detecta que `Bullet` se superpone (`overlap`) con un `LetterBox` y llama a la función `onBulletHitLetter(bullet, letterBox)`.
3. El proyectil se destruye inmediatamente para no golpear dos letras a la vez.
4. La función pregunta: `¿letterBox.isExtra es verdadero?`
   - **Sí (es sobrante):** Se destruye esa letra. Luego se revisa si quedan más letras con `isExtra === true`. Si quedan `0`, se gana el nivel.
   - **No (era parte de la traducción):** Se suma `1` error en `LevelManager` y se reinicia el nivel con la misma secuencia de letras.
