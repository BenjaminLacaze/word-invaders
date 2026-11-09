/**
 * Adaptador ES Module local para Phaser 3.
 * Exporta la instancia global `window.Phaser` cargada por `phaser.min.js`
 * para que todos los módulos puedan usar `import Phaser from 'phaser'`.
 */
const Phaser = window.Phaser;
export default Phaser;
