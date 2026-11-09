# WORD INVADERS

**WORD INVADERS** es un videojuego educativo 2D de estilo arcade y estética *pixel art* minimalista, diseñado para practicar y reforzar el vocabulario en inglés de manera interactiva y sin presión de tiempo.

---

## ¿En qué consiste el juego?

1. En la parte superior de la pantalla aparece una **palabra o expresión en español** (por ejemplo: `"MANZANA"`).
2. Debajo del panel aparecen bloques de letras que contienen su **traducción al inglés** en orden (`A P P L E`), mezclada con **letras sobrantes** intercaladas.
3. Controlas una nave espacial en la parte inferior que se mueve horizontalmente y dispara proyectiles hacia arriba.
4. Tu misión es **disparar únicamente a las letras sobrantes** hasta que en pantalla solo queden las letras que forman la palabra en inglés.

---

## Tecnologías Utilizadas

- **HTML5 y CSS3:** Estructura y centrado del lienzo con renderizado nítido para *pixel art*.
- **JavaScript (ES6+):** Código modular dividido en escenas, entidades y administradores lógicos.
- **Phaser 3:** Motor de videojuegos 2D encargado de los gráficos, físicas Arcade y controles.
- **Vite:** Servidor de desarrollo ultrarrápido y empaquetador para producción sin conexión (*offline*).
- **JSON:** Almacenamiento sencillo del glosario de palabras en `public/data/glossary.json`.

---

## Requisitos Previos

Para ejecutar el entorno de desarrollo necesitas tener instalado **Node.js** (versión 18 o superior recomendada), el cual incluye el gestor de paquetes `npm`.

---

## Instalación y Ejecución Paso a Paso

Abre una terminal en la carpeta del proyecto y ejecuta los siguientes comandos:

### 1. Instalar las dependencias
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Luego abre en tu navegador la dirección que indique la terminal (normalmente `http://localhost:5173`).

### 3. Ejecutar las pruebas de lógica del generador de palabras
```bash
npm run test:logic
```

### 4. Generar la versión final para usar sin conexión (Offline)
```bash
npm run build
```
Esto creará la carpeta `dist/` con todos los archivos empaquetados listos para ejecutarse localmente mediante:
```bash
npm run preview
```

---

## Controles del Videojuego

| Tecla | Acción |
| :--- | :--- |
| **Flecha Izquierda** o tecla **A** | Mover la nave hacia la izquierda |
| **Flecha Derecha** o tecla **D** | Mover la nave hacia la derecha |
| **Barra Espaciadora** | Disparar un proyectil hacia arriba |
| **Tecla M** | Silenciar / Activar música y efectos de sonido |
| **Enter** o **Espacio** (en menús) | Iniciar la partida / Volver a jugar |

---

## Documentación Adicional del Proyecto

Para comprender y personalizar cada parte del proyecto, consulta los siguientes manuales incluidos en este repositorio:

- [PLANIFICACION.md](./PLANIFICACION.md): Análisis de arquitectura y diseño previo.
- [GAME_RULES.md](./GAME_RULES.md): Explicación detallada de las reglas y mecánicas del videojuego.
- [ASSETS.md](./ASSETS.md): Guía con las medidas exactas y nombres de archivo para crear y reemplazar tus propios sprites *pixel art*.
- [AUDIO_GUIDE.md](./AUDIO_GUIDE.md): Guía para agregar tu propia música de fondo y efectos de sonido en `public/assets/audio/`.
- [CODE_STRUCTURE.md](./CODE_STRUCTURE.md): Explicación paso a paso de las carpetas, clases y escenas para estudiantes principiantes.
- [GLOSSARY_GUIDE.md](./GLOSSARY_GUIDE.md): Manual para agregar o modificar palabras del glosario en `glossary.json`.
