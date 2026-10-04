# Respuestas a las preguntas de comprobación

## 1. ¿Qué función cumple Expo durante el desarrollo?

Expo proporciona herramientas para crear y ejecutar la aplicación React Native. Su servidor de desarrollo prepara el código y muestra un código QR para abrir la aplicación en Expo Go; además, permite ver los cambios al guardar el proyecto.

## 2. ¿Para qué sirve App.js en esta práctica?

`App.js` contiene el componente principal `App`. En esta práctica se utiliza para definir la pantalla inicial: sus textos, imagen, botones, acciones y estilos.

## 3. ¿Cuál es la diferencia entre View y Text?

`View` es un contenedor que agrupa y distribuye elementos en la pantalla. `Text` muestra contenido escrito. Por ejemplo, varios componentes `Text` pueden colocarse dentro de un `View`.

## 4. ¿Por qué decimos que JSX no es HTML?

JSX es una sintaxis de JavaScript para describir la interfaz. Aunque se parece a HTML, en React Native se escriben componentes como `View` y `Text`, que se representan como elementos de la aplicación móvil, en lugar de etiquetas HTML como `div` y `p`.

## 5. ¿Qué hace StyleSheet.create()?

`StyleSheet.create()` agrupa las definiciones de estilos en un objeto. Después, cada estilo se aplica a un componente mediante la propiedad `style`, por ejemplo, `style={styles.container}`. Esto ayuda a mantener los estilos organizados.

## 6. ¿Qué función cumple onPress?

`onPress` indica qué función se ejecuta cuando el usuario pulsa un componente interactivo, como `Pressable`. En la aplicación de la guía, se usa para llamar a `mostrarMensaje` y mostrar una alerta.

## 7. ¿Qué ventaja tiene ejecutar la aplicación en un teléfono físico en lugar de utilizar un emulador?

Permite comprobar directamente cómo se ve y responde la aplicación en un dispositivo real, con su pantalla y controles táctiles. En esta práctica también evita tener que instalar y ejecutar un emulador en la computadora.
