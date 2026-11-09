# GUÍA DEL GLOSARIO DE PALABRAS (GLOSSARY_GUIDE.md)

En **WORD INVADERS** puedes personalizar fácilmente las palabras que aparecen en el juego editando un único archivo de texto, sin necesidad de saber programar.

---

## 1. ¿Dónde está el archivo del glosario?

El glosario se encuentra en la siguiente ruta dentro del proyecto:

```text
public/data/glossary.json
```

Puedes abrirlo con cualquier editor de texto (como Visual Studio Code, el Bloc de notas o Gedit).

---

## 2. Estructura del archivo `glossary.json`

El archivo utiliza el formato **JSON** y consiste en una lista de elementos encerrada entre corchetes `[ ... ]`. Cada palabra es un bloque entre llaves `{ ... }` con dos propiedades:

- `"es"`: La palabra o expresión en **español** que se muestra como pista en la parte superior.
- `"en"`: La traducción correcta al **inglés** que el jugador deberá descubrir en pantalla.

### Ejemplo básico:

```json
[
  {
    "es": "PERRO",
    "en": "DOG"
  },
  {
    "es": "MANZANA",
    "en": "APPLE"
  },
  {
    "es": "HOLA MUNDO",
    "en": "HELLO WORLD"
  }
]
```

---

## 3. Reglas para Agregar o Modificar Palabras

Para evitar errores al editar el archivo `glossary.json`, sigue estas 5 reglas sencillas:

1. **Usa siempre comillas dobles (`"`):** Tanto los nombres `"es"` y `"en"` como las palabras deben ir entre comillas dobles.
2. **Separa cada bloque con una coma (`,`):** Todos los bloques `{ ... }` llevan una coma al final, **excepto el último** de la lista.
3. **Caracteres permitidos en inglés (`"en"`):**
   - Escribe únicamente letras del alfabeto inglés (`A` a la `Z`) y espacios simples si es una expresión de dos palabras.
   - No incluyas números, guiones ni signos de puntuación en el campo `"en"`.
   - Puedes escribirlas en mayúsculas o minúsculas (el juego las convertirá automáticamente a mayúsculas).
4. **Caracteres permitidos en español (`"es"`):**
   - En español sí puedes utilizar tildes (`Á, É, Í, Ó, Ú`) y la letra `Ñ` (por ejemplo: `"ÁRBOL"` o `"NIÑO"`).
5. **Longitud recomendada:**
   - Para que las letras se vean grandes y cómodas en pantalla, se recomienda usar palabras o expresiones en inglés de entre **3 y 12 letras**.

---

## 4. Plantilla Lista para Copiar y Pegar

Si quieres añadir una palabra nueva al final de la lista, recuerda poner una coma `,` después de la llave `}` anterior y pegar un bloque como este:

```json
  ,
  {
    "es": "VENTANA",
    "en": "WINDOW"
  }
```

---

## 5. ¿Qué ocurre si cometo un error de formato en el JSON?

El administrador `GlossaryManager.js` está protegido contra fallos:
- Si una palabra individual tiene un carácter inválido en inglés o está vacía, el juego la ignora y carga el resto de las palabras válidas.
- Si el archivo completo está vacío o mal formado, el juego cargará automáticamente un glosario interno de respaldo para que la partida pueda jugarse igualmente.
