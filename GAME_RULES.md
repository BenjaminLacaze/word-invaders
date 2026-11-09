# REGLAS DEL VIDEOJUEGO (GAME_RULES.md)

Este documento explica de forma sencilla cómo funciona **WORD INVADERS** y cuáles son las reglas que gobiernan cada partida.

---

## 1. Objetivo General

El propósito del juego es aprender y practicar cómo se escriben palabras en inglés a partir de su significado en español. A diferencia de los juegos de acción tradicionales, **aquí no hay vidas ni límite de tiempo**: lo más importante es observar con atención y pensar antes de disparar.

---

## 2. Desarrollo de un Nivel

En cada nivel ocurre lo siguiente:

1. **Palabra en español:** En el panel superior verás una palabra o expresión en español, por ejemplo:
   > `TRADUCE: "MANZANA"`
2. **Secuencia de letras en pantalla:** Debajo aparecerá una fila de bloques con letras. Dentro de esa fila están todas las letras de la traducción correcta en inglés (`A P P L E`), **respetando su orden de izquierda a derecha**, pero con **letras sobrantes** infiltradas entre ellas.
   - *Ejemplo en pantalla:*
     `[Q] [A] [P] [Z] [P] [L] [M] [E] [K]`
3. **Tu misión:** Mover la nave hacia la izquierda o la derecha y disparar **solamente a las letras sobrantes** (`Q`, `Z`, `M`, `K`).

---

## 3. ¿Qué pasa cuando disparas a una letra?

### Caso A: Disparas a una letra SOBRANTE (Acierto)
- El bloque de la letra sobrante se destruye con un efecto de partículas azules.
- Si todavía quedan más letras sobrantes en la fila, continúas jugando.
- Si era la **última letra sobrante**, ¡completas el nivel! Las letras correctas se iluminan en verde y se juntan en el centro mostrando la palabra limpia (`A P P L E`) antes de pasar al siguiente nivel.

### Caso B: Disparas a una letra CORRECTA (Error)
- Si por accidente destruyes una letra que sí formaba parte de la traducción en inglés (por ejemplo, la `A` o una de las `P` de `APPLE`):
  1. La letra se ilumina en rojo y la pantalla tiembla brevemente.
  2. El contador de **ERRORES** sube en `+1`.
  3. **El nivel actual se reinicia con exactamente la misma secuencia de letras** que tenía al principio, para que puedas intentarlo de nuevo y aprender de tu fallo sin que cambien las letras de lugar.

---

## 4. Casos Especiales

- **Palabras con letras repetidas (`APPLE`, `BOOK`, `TREE`):**
  - Si una palabra en inglés lleva dos letras iguales (como la doble `O` en `BOOK`), **ambas** son necesarias y no debes dispararles.
  - Además, el juego nunca genera como letra sobrante una letra que ya exista dentro de la traducción, por lo que nunca tendrás dudas de cuál letra debes eliminar.
- **Expresiones de dos palabras (`HELLO WORLD`):**
  - El espacio entre palabras se muestra con un marcador `_` en la fila.
  - Ese espacio no es un bloque destruible; sirve únicamente para separar visualmente las palabras.

---

## 5. Fin del Juego

Cuando completas todas las palabras incluidas en el glosario:
- Llegas a la **Pantalla de Victoria**.
- Se muestra el total de palabras aprendidas y el número total de errores cometidos durante la sesión.
- Puedes presionar `ESPACIO` o `ENTER` para comenzar una nueva partida.
