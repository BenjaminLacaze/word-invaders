/**
 * Constantes globales de configuración para WORD INVADERS.
 * Centraliza dimensiones, velocidades, colores y claves de recursos.
 */

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Claves de las escenas
export const SCENES = {
  BOOT: 'BootScene',
  MENU: 'MenuScene',
  GAME: 'GameScene',
  VICTORY: 'VictoryScene'
};

// Claves de los recursos gráficos (coinciden con los nombres en public/assets/images/)
export const ASSET_KEYS = {
  PLAYER: 'player',
  PLAYER_2: 'player_2',
  BULLET: 'bullet',
  LETTER_TILE: 'letter_tile',
  BACKGROUND: 'background',
  BACKGROUND_2: 'background_2',
  LOGO: 'logo',
  PARTICLE: 'pixel_particle',
  GLOSSARY: 'glossary_data'
};

// Claves de las animaciones
export const ANIM_KEYS = {
  PLAYER_IDLE: 'player_idle'
};

// Claves de los recursos de audio (coinciden con los nombres en public/assets/audio/)
export const AUDIO_KEYS = {
  BGM: 'bgm',                     // Música de fondo
  SHOOT: 'shoot',                 // Sonido de disparo
  DESTROY: 'destroy',             // Sonido de destrucción de letra sobrante
  ERROR: 'error',                 // Sonido de error al golpear una letra correcta
  WORD_COMPLETE: 'word_complete'  // Sonido de palabra/nivel completado
};

// Volúmenes predeterminados (de 0.0 a 1.0)
export const AUDIO_VOLUMES = {
  BGM: 0.4,
  SHOOT: 0.6,
  DESTROY: 0.7,
  ERROR: 0.8,
  WORD_COMPLETE: 0.8
};

// Dimensiones recomendadas para los sprites (en píxeles)
export const SPRITE_SIZES = {
  PLAYER: { width: 32, height: 32 },
  BULLET: { width: 8, height: 16 },
  LETTER_TILE: { width: 40, height: 40 }
};

// Parámetros de jugabilidad
export const GAMEPLAY = {
  PLAYER_SPEED: 300,          // Velocidad horizontal de la nave (px/segundo)
  PLAYER_Y: 540,              // Posición vertical fija de la nave
  BULLET_SPEED: 460,          // Velocidad vertical del disparo hacia arriba (px/segundo)
  FIRE_COOLDOWN: 260,         // Tiempo mínimo entre disparos (milisegundos)
  MAX_LETTERS_PER_ROW: 12,    // Máximo de bloques en una sola fila antes de dividir en 2 filas
  LETTER_SPACING_X: 52,       // Separación horizontal entre centros de letras
  LETTER_ROW_1_Y: 170,        // Posición Y de la primera fila de letras
  LETTER_ROW_2_Y: 235,        // Posición Y de la segunda fila de letras (en palabras largas)
  LEVEL_CLEAR_DELAY: 1500,    // Pausa al completar un nivel (ms)
  ERROR_RESET_DELAY: 1100,    // Pausa al cometer un error antes de restaurar las letras (ms)
  PLAYER_ANIM_FPS: 6,         // Velocidad de animación de los motores de la nave (fotogramas/seg)
  BG_SCROLL_SPEED: 24         // Velocidad de desplazamiento vertical del fondo (px/segundo)
};

// Paleta de colores estilo Pixel Art Arcade
export const COLORS = {
  BACKGROUND_HEX: '#0d0d1a',
  BACKGROUND_NUM: 0x0d0d1a,
  HUD_BG_NUM: 0x16162b,
  HUD_BORDER_NUM: 0x2e2e54,
  CYAN_HEX: '#00e5ff',
  CYAN_NUM: 0x00e5ff,
  YELLOW_HEX: '#ffe600',
  YELLOW_NUM: 0xffe600,
  GREEN_HEX: '#00e676',
  GREEN_NUM: 0x00e676,
  RED_HEX: '#ff3d57',
  RED_NUM: 0xff3d57,
  WHITE_HEX: '#ffffff',
  WHITE_NUM: 0xffffff,
  MUTED_HEX: '#9090b8',
  TILE_BG_NUM: 0x1e2240,
  TILE_BORDER_NUM: 0x4a528a
};

// Estilo tipográfico base para textos en Phaser
export const FONT_FAMILY = '"Courier New", Courier, monospace';
