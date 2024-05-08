/////////////////////////////////////////INI//////////////////////

var CONST = {
  SPACE: "\u0020",
  NBS: "&nbsp",
  NEWLINE: "\n"
};
var INI = {
  sprite_maxW: 300,
  sprite_maxH: 50
};
INI.COLLISION_SAFE = 264;
INI.TITLE_HEIGHT = 72;
INI.GAME_HEIGHT = 768;
INI.ANIMATION_INTERVAL = 17;
INI.PISTE_HEIGHT = 8;
INI.ZERO = 24;
INI.TOP = 680;
INI.MOVE = 8;
INI.PLANE_LEFT = 40;
INI.PLANE_RIGHT = 600;
INI.MAX_SPEED = 8;
INI.REWIND_MAX = -96;
INI.TREE_PADDING = 12;
INI.LAKE_PADDING = 10;
INI.TREE_CORRECTION = 12;
INI.BULLET_SPEED = 24;
INI.BULLET_TIMEOUT = 180;
INI.BOMB_TIMEOUT = 680;
INI.BOMB_GRAVITY_SPEED = 12;
INI.ENEMY_PLANES = 11;
INI.ENEMY_TANKS = 6;
INI.ENEMY_SHIPS = 4;
INI.PLANE_SCORE = 1000;
INI.TANK_SCORE = 500;
INI.SHIP_SCORE = 750;
INI.PLANE_SPEED = 13;
INI.ZEPPELIN_SPEED = 9;
INI.PLANE_SHOOT = 1200;
INI.SHIP_SHOOT = 1600;
INI.SHIP_RANDOM = 300;
INI.LEVEL_BONUS = 100000;
INI.LAST_LEVEL = 5;

/* ScramblyX LEVELS*/

var LEVELS = {
  1: {
    world: [
      { w: INI.PLANE_LEFT, y: INI.ZERO, type: "L" },
      { w: 750, y: INI.ZERO, type: "L", inf: "airport" },
      { w: 200, y: 50, type: "L" },
      { w: 200, y: 100, type: "L", inf: "forest", enemy: "zeppelin" },
      { w: 100, y: 150, type: "L" },
      { w: 100, y: 200, type: "L" },
      { w: 120, y: 150, type: "L", enemy: "plane", h: [350] },
      { w: 120, y: 150, type: "L", enemy: "tank" },
      { w: 100, y: 150, type: "Q", cp: { x: 40, y: 25, f: 1 } },
      { w: 120, y: 150, type: "L", inf: "lake" },
      { w: 120, y: 300, type: "L", enemy: "plane", h: [450] },
      { w: 20, y: 280, type: "L" },
      { w: 40, y: 250, type: "L" },
      { w: 100, y: 250, type: "L", enemy: "tank" },
      {
        w: 80,
        y: 320,
        type: "Q",
        cp: { x: 20, y: 40, f: 1 },
        enemy: "zeppelin"
      },
      { w: 50, y: 200, type: "L" },
      { w: 100, y: 50, type: "L" },
      { w: 100, y: INI.ZERO, type: "Q", cp: { x: 70, y: 40, f: 1 } },
      { w: 200, y: INI.ZERO, type: "L" },
      { w: 150, y: 50, type: "L", inf: "forest" },
      { w: 100, y: 50, type: "L", enemy: "tank" },
      { w: 150, y: 100, type: "L", inf: "forest", enemy: "plane", h: [500] },
      { w: 100, y: 100, type: "L", enemy: "tank" },
      { w: 100, y: 500, type: "Q", cp: { x: 66, y: 40, f: 1 } },
      { w: 60, y: 300, type: "L" },
      { w: 150, y: 200, type: "Q", cp: { x: 40, y: 25, f: -1 } },
      { w: 120, y: 200, type: "L", enemy: "tank" },
      {
        w: 150,
        y: 300,
        type: "Q",
        cp: { x: 40, y: 25, f: -1 },
        inf: "forest",
        enemy: "zeppelin"
      },
      { w: 100, y: INI.TOP, type: "Q", cp: { x: 66, y: 40, f: 1 } },
      { w: 60, y: 650, type: "L" },
      { w: 160, y: 600, type: "L", inf: "forest" },
      { w: 100, y: 600, type: "L", enemy: "tank" },
      { w: 120, y: 530, type: "L", inf: "forest" },
      { w: 100, y: 530, type: "L", enemy: "tank" },
      { w: 200, y: 400, type: "L" },
      { w: 400, y: 200, type: "Q", cp: { x: 40, y: 25, f: -1 } },
      { w: 200, y: 200, type: "L", enemy: "tank" },
      { w: 100, y: 200, type: "L", enemy: "tank" },
      { w: 80, y: 170, type: "L" },
      { w: 100, y: 170, type: "L", enemy: "tank" },
      { w: 200, y: 200, type: "L", inf: "forest", enemy: "plane", h: [600] },
      { w: 100, y: 200, type: "L", inf: "lake" },
      { w: 200, y: 250, type: "L", inf: "forest" },
      { w: 200, y: 250, type: "L", enemy: "tank" },
      { w: 200, y: 300, type: "L", inf: "forest"}, //deleted plane
      { w: 100, y: 200, type: "L" },
      { w: 100, y: 170, type: "L", inf: "forest", enemy: "plane", h: [500] },
      { w: 100, y: 170, type: "L", enemy: "tank" },
      { w: 150, y: 170, type: "L", inf: "lake" },
      { w: 100, y: 170, type: "L", enemy: "tank" },
      { w: 100, y: 170, type: "L", inf: "forest" },
      { w: 200, y: 250, type: "Q", cp: { x: 70, y: 25, f: -1 } },
      { w: 300, y: 500, type: "L" },
      { w: 100, y: 430, type: "L" },
      { w: 150, y: 400, type: "L", inf: "forest", enemy: "plane", h: [650] },
      { w: 100, y: 400, type: "L", enemy: "tank" },
      { w: 100, y: 400, type: "L", inf: "lake" },
      { w: 100, y: 500, type: "L" },
      { w: 130, y: 560, type: "L", inf: "forest", enemy: "zeppelin" },
      { w: 100, y: INI.TOP, type: "L" },
      { w: 200, y: 550, type: "L" },
      { w: 150, y: 500, type: "L" },
      { w: 100, y: 500, type: "L", enemy: "tank" },
      { w: 100, y: 500, type: "L", inf: "forest" },
      { w: 100, y: 500, type: "L", enemy: "tank" },
      { w: 100, y: 500, type: "L", inf: "forest", enemy: "zeppelin" },
      { w: 100, y: INI.TOP, type: "L" },
      { w: 100, y: 500, type: "Q", cp: { x: 50, y: 50, f: 1 } },
      { w: 120, y: 400, type: "Q", cp: { x: 30, y: 50, f: 1 } },
      { w: 100, y: 380, type: "L", inf: "forest" },
      { w: 100, y: 380, type: "L", enemy: "tank" },
      { w: 150, y: 380, type: "L", inf: "lake" },
      { w: 120, y: 420, type: "L", inf: "forest" },
      { w: 100, y: 420, type: "L", enemy: "tank" },
      { w: 40, y: 400, type: "Q", cp: { x: 80, y: 10, f: -1 } },
      { w: 50, y: 370, type: "Q", cp: { x: 35, y: 20, f: 1 } },
      { w: 100, y: 370, type: "L", enemy: "tank" },
      {
        w: 120,
        y: 420,
        type: "L",
        inf: "forest", enemy: "plane", h: [700]
      },
      { w: 100, y: 370, type: "L" },
      { w: 100, y: 270, type: "L"  },//
      { w: 100, y: 270, type: "L", enemy: "tank" },
      { w: 150, y: 220, type: "L", inf: "forest" },
      { w: 120, y: 120, type: "L" },
      { w: 120, y: 120, type: "L", enemy: "tank" },
      { w: 150, y: 120, type: "L", inf: "lake", enemy: "plane", h: [300] }, 
      { w: 180, y: 250, type: "L", inf: "forest" },
      { w: 40, y: 200, type: "L" },
      { w: 100, y: 170, type: "L", inf: "forest" },
      { w: 100, y: 170, type: "L", enemy: "tank" },
      { w: 20, y: 200, type: "L" },
      { w: 50, y: 150, type: "L" },
      {
        w: 50,
        y: 120,
        type: "Q",
        cp: { x: 35, y: 20, f: 1 },
        enemy: "plane",
        h: [INI.TOP]
      },
      { w: 100, y: 120, type: "L", enemy: "tank" },
      { w: 250, y: INI.ZERO, type: "L", inf: "forest" },
      { w: 100, y: INI.ZERO, type: "L", enemy: "tank" },
      { w: 200, y: INI.ZERO, type: "L", inf: "lake" },
      { w: 100, y: INI.ZERO, type: "L", enemy: "tank" },
      {
        w: 250,
        y: 250,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [650]
      },
      { w: 100, y: 250, type: "L", enemy: "tank" },
      { w: 100, y: 400, type: "Q", cp: { x: 30, y: 10, f: -1 } },
      { w: 80, y: 320, type: "Q", cp: { x: 35, y: 20, f: 1 } },
      { w: 120, y: 300, type: "L", inf: "forest" },
      { w: 100, y: 300, type: "L", enemy: "tank" },
      {
        w: 100,
        y: 600,
        type: "Q",
        cp: { x: 30, y: 10, f: -1 },
        enemy: "zeppelin"
      },
      { w: 40, y: 520, type: "Q", cp: { x: 35, y: 20, f: 1 } },
      { w: 40, y: 420, type: "Q", cp: { x: 35, y: 20, f: 1 } },
      { w: 50, y: 400, type: "Q", cp: { x: 30, y: 10, f: 1 } },
      { w: 100, y: 400, type: "L", enemy: "tank" },
      { w: 100, y: 400, type: "L", inf: "lake" },
      { w: 120, y: 450, type: "L", inf: "forest", enemy: "zeppelin" },
      { w: 100, y: INI.TOP, type: "Q", cp: { x: 30, y: 10, f: -1 } },
      { w: 100, y: 500, type: "Q", cp: { x: 30, y: 10, f: -1 } },
      { w: 120, y: 450, type: "L", inf: "forest" },
      { w: 100, y: 450, type: "L", enemy: "tank" },
      { w: 40, y: 420, type: "Q", cp: { x: 80, y: 10, f: 1 } },
      { w: 40, y: 390, type: "Q", cp: { x: 20, y: 10, f: -1 } },
      { w: 100, y: 390, type: "L", enemy: "tank" },
      { w: 100, y: 550, type: "Q", cp: { x: 30, y: 10, f: -1 } },
      { w: 100, y: 500, type: "L" },
      { w: 150, y: 450, type: "L", inf: "forest", enemy: "plane", h: [700] },
      { w: 100, y: 450, type: "L", enemy: "tank" },
      { w: 100, y: 450, type: "L", enemy: "tank" },
      { w: 100, y: 450, type: "L", inf: "lake" },
      { w: 150, y: 400, type: "L", inf: "forest" },
      { w: 100, y: 400, type: "L", enemy: "tank" },
      {
        w: 120,
        y: 550,
        type: "Q",
        cp: { x: 35, y: 10, f: -1 },
        enemy: "plane",
        h: [700]
      },
      { w: 120, y: 450, type: "Q", cp: { x: 30, y: 10, f: -1 } },
      { w: 100, y: 450, type: "L", enemy: "tank" },
      { w: 150, y: 500, type: "L", inf: "forest"},  
      { w: 100, y: INI.TOP, type: "L" },
      { w: 100, y: 450, type: "L" },
      { w: 20, y: 430, type: "L" },
      { w: 100, y: 400, type: "L", inf: "forest" },
      { w: 100, y: 400, type: "L", enemy: "tank" },
      { w: 150, y: 420, type: "L", inf: "forest" },
      { w: 250, y: 320, type: "L", inf: "forest" },
      { w: 100, y: 320, type: "L", inf: "lake", enemy: "plane", h: [500]  },
      { w: 100, y: 320, type: "L", enemy: "tank" },
      { w: 200, y: 380, type: "L", inf: "forest" },
      { w: 200, y: 250, type: "L", inf: "forest"}, 
      { w: 100, y: 250, type: "L", enemy: "tank" },
      { w: 200, y: 180, type: "L", inf: "forest" },
      { w: 100, y: 180, type: "L", enemy: "tank" },
      { w: 100, y: 400, type: "L", enemy: "plane", h: [640] },
      { w: 100, y: 250, type: "L" },
      { w: 250, y: 180, type: "L", inf: "forest" },
      { w: 100, y: 180, type: "L", enemy: "tank" },
      { w: 100, y: 160, type: "L", inf: "forest" },
      { w: 100, y: 180, type: "L"}, 
      { w: 100, y: 180, type: "L", enemy: "tank" },
      { w: 100, y: 150, type: "L" },
      { w: 100, y: 150, type: "L", inf: "lake", enemy: "plane", h: [350] },
      { w: 250, y: 100, type: "L", inf: "forest" },
      { w: 100, y: 100, type: "L", enemy: "tank" },
      {
        w: 400,
        y: INI.ZERO,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [650]
      },
      { w: 100, y: INI.ZERO, type: "L", enemy: "tank" },
      { w: 200, y: INI.ZERO, type: "L", inf: "lake", enemy: "plane", h: [150] },
      { w: 50, y: INI.ZERO, type: "L", enemy: "zeppelin" },
      { w: 1000, y: INI.ZERO, type: "L", inf: "airport" },
      { w: 500, y: INI.ZERO, type: "L" },
      { w: 150, y: 768, type: "Q", cp: { x: 35, y: 10, f: -1 } },
      { w: 1000, y: 768, type: "L" }
    ],
    worldLength: 22280,
    airport: {
      x1: 0,
      x2: 0
    },
    mainPattern: "grass"
  },
  2: {
    world: [
      { w: INI.PLANE_LEFT, y: INI.ZERO, type: "L" },
      { w: 750, y: INI.ZERO, type: "L", inf: "airport" },
      { w: 200, y: 50, type: "L" },
      { w: 150, y: INI.ZERO, type: "L" },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 300, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 300, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [640] },
      { w: 100, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 300, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea" },
      {
        w: 400,
        y: INI.ZERO,
        type: "L",
        pat: "sea",
        enemy: "plane",
        h: [650, 150]
      },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 20, y: INI.ZERO, type: "L" },
      {
        w: 150,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "plane",
        h: [200],
        inf: "palm"
      },
      { w: 20, y: INI.ZERO, type: "L" },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 500, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 450, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [100] },
      { w: 500, y: 150, type: "L", inf: "forest", enemy: "plane", h: [250] }, 
      { w: 100, y: 400, type: "L" },
      { w: 200, y: INI.ZERO, type: "L" },
      { w: 100, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 350, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [100] },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 350, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 300, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [250] },
      { w: 350, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 300, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 20, y: INI.ZERO, type: "L" },
      {
        w: 150,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "plane",
        h: [300],
        inf: "palm"
      },
      { w: 20, y: INI.ZERO, type: "L" },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [600] },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 300, y: 120, type: "L", inf: "forest" },
      { w: 400, y: 280, type: "L", inf: "forest", enemy: "plane", h: [450] },
      { w: 300, y: 600, type: "L", enemy: "zeppelin" },
      { w: 100, y: 650, type: "L" },
      { w: 100, y: 550, type: "L" },
      {
        w: 300,
        y: 400,
        type: "L",
        inf: "forest"
      }, 
      { w: 150, y: 400, type: "L", enemy: "tank" },
      { w: 200, y: 420, type: "L", inf: "forest" },
      { w: 400, y: 300, type: "L", inf: "forest" },
      {
        w: 200,
        y: 200,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [INI.TOP]
      },
      { w: 150, y: INI.ZERO, type: "L" },
      { w: 100, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [100] },
      { w: 150, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 300, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [300] },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 20, y: INI.ZERO, type: "L" },
      {
        w: 150,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "plane",
        h: [250],
        inf: "palm"
      },
      { w: 20, y: INI.ZERO, type: "L" },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 350, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 450, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [100] },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 20, y: INI.ZERO, type: "L" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm"
      },
      { w: 20, y: INI.ZERO, type: "L" },
      { w: 50, y: INI.ZERO, type: "L" },
      { w: 1000, y: INI.ZERO, type: "L", inf: "airport" },
      { w: 500, y: INI.ZERO, type: "L" },
      { w: 150, y: 768, type: "Q", cp: { x: 35, y: 10, f: -1 } },
      { w: 1000, y: 768, type: "L" }
    ],
    worldLength: 17850,
    airport: {
      x1: 0,
      x2: 0
    },
    mainPattern: "grass"
  },
  3: {
    world: [
      { w: INI.PLANE_LEFT, y: INI.ZERO, type: "L" },
      { w: 750, y: INI.ZERO, type: "L", inf: "airport" },
      { w: 200, y: 50, type: "L" },
      { w: 150, y: INI.ZERO, type: "L" },
      //
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm"
      },
      { w: 150, y: INI.ZERO, type: "L", enemy: "tank" },
      {
        w: 250,
        y: 150,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "plane",
        h: [500]
      },
      {
        w: 250,
        y: 100,
        type: "Q",
        cp: { x: 20, y: 25, f: 1 },
        enemy: "plane",
        h: [600]
      },
      { w: 150, y: 100, type: "L", enemy: "tank" },
      {
        w: 400,
        y: 250,
        type: "Q",
        cp: { x: 45, y: 25, f: -1 },
        enemy: "plane",
        h: [500]
      },
      { w: 150, y: 280, type: "L" },
      { w: 250, y: 280, type: "Q", cp: { x: 50, y: 25, f: -1 }, inf: "palm" },
      { w: 150, y: 250, type: "L", enemy: "plane", h: [400] },
      { w: 150, y: 250, type: "L", enemy: "tank" },
      {
        w: 400,
        y: 150,
        type: "Q",
        cp: { x: 55, y: 25, f: 1 },
        enemy: "plane",
        h: [500]
      },
      {
        w: 400,
        y: 50,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "plane",
        h: [250]
      },
      { w: 400, y: INI.ZERO, type: "Q", cp: { x: 35, y: 10, f: 1 } },
      { w: 250, y: INI.ZERO, type: "L", enemy: "tank" },
      {
        w: 400,
        y: 50,
        type: "Q",
        cp: { x: 55, y: 25, f: -1 },
        enemy: "plane",
        h: [400]
      },
      {
        w: 400,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 55, y: 25, f: 1 },
        enemy: "plane",
        h: [600]
      },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm"
      },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [600] },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm"
      },
      { w: 50, y: INI.ZERO, type: "L" },
      {
        w: 400,
        y: 100,
        type: "Q",
        cp: { x: 55, y: 15, f: 1 },
        enemy: "plane",
        h: [300]
      },
      { w: 150, y: 120, type: "L" },
      { w: 150, y: 120, type: "L", enemy: "tank" },
      {
        w: 400,
        y: 80,
        type: "Q",
        cp: { x: 35, y: 15, f: -1 },
        enemy: "plane",
        h: [400]
      },
      { w: 150, y: 80, type: "L" },
      { w: 150, y: 80, type: "L", enemy: "tank" },
      { w: 50, y: 80, type: "L" },
      {
        w: 500,
        y: 200,
        type: "Q",
        cp: { x: 55, y: 15, f: -1 },
        enemy: "plane",
        h: [500]
      },
      {
        w: 500,
        y: 400,
        type: "Q",
        cp: { x: 55, y: 15, f: -1 },
        enemy: "zeppelin"
      },
      {
        w: 500,
        y: 300,
        type: "Q",
        cp: { x: 55, y: 15, f: -1 },
        enemy: "plane",
        h: [600]
      },
      { w: 150, y: 300, type: "L" },
      { w: 150, y: 300, type: "L", enemy: "tank" },
      { w: 250, y: 250, type: "L" },
      { w: 250, y: 200, type: "L" },
      {
        w: 400,
        y: 100,
        type: "Q",
        cp: { x: 55, y: 25, f: 1 },
        enemy: "plane",
        h: [600]
      },
      {
        w: 400,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "plane",
        h: [200]
      },
      { w: 20, y: INI.ZERO, type: "L" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm"
      },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [600] },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 20, y: INI.ZERO, type: "L" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm"
      },
      { w: 20, y: INI.ZERO, type: "L" },
      {
        w: 400,
        y: 100,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [600],
        pat: "grass"
      },
      { w: 200, y: INI.ZERO, type: "L", pat: "grass" },
      { w: 20, y: INI.ZERO, type: "L", pat: "grass" },
      { w: 50, y: INI.ZERO, type: "L", pat: "grass" },
      { w: 1000, y: INI.ZERO, type: "L", inf: "airport", pat: "grass" },
      { w: 500, y: INI.ZERO, type: "L", pat: "grass" },
      { w: 150, y: 768, type: "Q", cp: { x: 35, y: 10, f: -1 }, pat: "grass" },
      { w: 1000, y: 768, type: "L", pat: "grass" }
    ],
    worldLength: 17620,
    airport: {
      x1: 0,
      x2: 0
    },
    mainPattern: "sand"
  },
  4: {
    world: [
      { w: INI.PLANE_LEFT, y: INI.ZERO, type: "L" },
      { w: 750, y: INI.ZERO, type: "L", inf: "airport" },
      { w: 200, y: 50, type: "L" },
      { w: 50, y: INI.ZERO, type: "L", enemy: "zeppelin" },
      //
      { w: 450, y: 100, type: "L", inf: "forest" },
      { w: 50, y: 50, type: "L", enemy: "plane", h: [250] },
      { w: 400, y: 150, type: "L", inf: "forest" },
      { w: 30, y: 120, type: "L" },
      { w: 150, y: 120, type: "L", enemy: "tank" },
      { w: 50, y: INI.ZERO, type: "L" },
      { w: 150, y: INI.ZERO, type: "L", enemy: "tank" },
      { w: 300, y: 400, type: "L", enemy: "plane", h: [600] },
      { w: 50, y: 300, type: "L" },
      { w: 50, y: 250, type: "L", enemy: "plane", h: [INI.TOP] },
      { w: 200, y: 250, type: "L", pat: "sea" },
      { w: 400, y: 250, type: "L", pat: "sea", enemy: "ship" },
      { w: 200, y: 250, type: "L", pat: "sea", enemy: "plane", h: [300] },
      { w: 400, y: 250, type: "L", pat: "sea", enemy: "ship" },
      { w: 200, y: 250, type: "L", pat: "sea", enemy: "zeppelin" },
      { w: 250, y: INI.TOP, type: "L" },
      { w: 250, y: 400, type: "L" },
      { w: 350, y: 300, type: "L", enemy: "zeppelin" },
      { w: 700, y: 200, type: "L", inf: "forest", enemy: "plane", h: [600] }, 
      { w: 150, y: 200, type: "L", enemy: "tank" },
      { w: 150, y: 200, type: "L", enemy: "tank" },
      { w: 150, y: 200, type: "L", enemy: "plane", h: [INI.TOP] },
      { w: 150, y: 200, type: "L", enemy: "tank" },
      {
        w: 700,
        y: 400,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [INI.TOP]
      },
      { w: 250, y: INI.TOP, type: "L", enemy: "zeppelin" },
      { w: 100, y: 600, type: "L" },
      {
        w: 500,
        y: 500,
        type: "L",
        inf: "forest"
      }, 
      { w: 120, y: 500, type: "L", inf: "lake" },
      { w: 150, y: 500, type: "L", inf: "forest" },
      { w: 150, y: 500, type: "L", enemy: "tank" },
      { w: 200, y: 500, type: "L", inf: "lake", enemy: "plane", h: [580] },
      { w: 200, y: 550, type: "L", inf: "forest" },
      { w: 400, y: 450, type: "L", inf: "forest", enemy: "plane", h: [600] },
      { w: 150, y: 400, type: "L" },
      { w: 150, y: 400, type: "L", enemy: "tank" },
      { w: 200, y: 350, type: "L", enemy: "zeppelin" },
      { w: 150, y: 350, type: "L", enemy: "tank" },
      { w: 400, y: 300, type: "L", inf: "forest", enemy: "plane", h: [490] },
      { w: 120, y: 300, type: "L", inf: "lake" },
      { w: 150, y: 300, type: "L", inf: "forest" },
      { w: 150, y: 300, type: "L", enemy: "tank" },
      {
        w: 400,
        y: 400,
        type: "Q",
        cp: { x: 35, y: 10, f: -1 },
        enemy: "plane",
        h: [510]
      },
      { w: 400, y: 250, type: "Q", cp: { x: 35, y: 10, f: -1 } },
      { w: 250, y: 250, type: "L", inf: "lake", enemy: "plane", h: [520] },
      { w: 150, y: 250, type: "L", inf: "forest" },
      { w: 150, y: 250, type: "L", enemy: "tank" },
      { w: 200, y: 250, type: "L", pat: "sea" },
      { w: 350, y: 250, type: "L", pat: "sea", enemy: "ship" },
      { w: 150, y: 250, type: "L", pat: "sea", enemy: "plane", h: [350] },
      { w: 400, y: 250, type: "L", pat: "sea", enemy: "ship" },
      { w: 200, y: 250, type: "L", pat: "sea", enemy: "zeppelin" },
      {
        w: 400,
        y: 350,
        type: "Q",
        cp: { x: 35, y: 10, f: -1 },
        enemy: "plane",
        h: [450]
      }, //lower
      { w: 300, y: 300, type: "L", inf: "forest" },
      { w: 300, y: 250, type: "L", inf: "forest", enemy: "plane", h: [350] },
      { w: 150, y: 250, type: "L", enemy: "tank" },
      { w: 400, y: 100, type: "Q", cp: { x: 35, y: 10, f: -1 } },
      { w: 150, y: 100, type: "L", enemy: "tank" },
      {
        w: 500,
        y: INI.ZERO,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [550]
      },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [350] },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 350, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm",
        pat: "sand"
      },
      { w: 500, y: INI.ZERO, type: "L", pat: "sea", enemy: "plane", h: [150] },
      //
      { w: 50, y: INI.ZERO, type: "L" },
      { w: 1000, y: INI.ZERO, type: "L", inf: "airport" },
      { w: 500, y: INI.ZERO, type: "L" },
      { w: 150, y: 768, type: "Q", cp: { x: 35, y: 10, f: -1 } },
      { w: 1000, y: 768, type: "L" }
    ],
    worldLength: 19560,
    airport: {
      x1: 0,
      x2: 0
    },
    mainPattern: "grass"
  },
  5: {
    world: [
      { w: INI.PLANE_LEFT, y: INI.ZERO, type: "L" },
      { w: 750, y: INI.ZERO, type: "L", inf: "airport" },
      { w: 50, y: INI.ZERO, type: "L" },
      //
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm",
        pat: "sand"
      },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 350, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      {
        w: 500,
        y: INI.ZERO,
        type: "L",
        pat: "sea",
        enemy: "plane",
        h: [200, 400, 600]
      },
      { w: 50, y: INI.ZERO, type: "L", pat: "sand" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm",
        enemy: "plane",
        h: [200],
        pat: "sand"
      },
      { w: 50, y: INI.ZERO, type: "L", pat: "sand" },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 50, y: 40, type: "L", enemy: "zeppelin" },
      { w: 20, y: 60, type: "L" },
      { w: 20, y: 100, type: "L" },
      { w: 100, y: INI.TOP, type: "Q", cp: { x: 50, y: 25, f: -1 } },
      { w: 300, y: 500, type: "Q", cp: { x: 50, y: 25, f: -1 } },
      { w: 20, y: 500, type: "L" },
      { w: 150, y: 500, type: "L", enemy: "tank" },
      {
        w: 200,
        y: 500,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [INI.TOP]
      },
      { w: 150, y: 500, type: "L", enemy: "tank" },
      { w: 20, y: 500, type: "L" },
      {
        w: 200,
        y: 550,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "zeppelin"
      },
      { w: 300, y: 200, type: "Q", cp: { x: 50, y: 25, f: -1 } },
      {
        w: 200,
        y: 180,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [INI.TOP]
      },
      { w: 150, y: 180, type: "L", enemy: "tank" },
      { w: 150, y: 180, type: "L", enemy: "tank" },
      {
        w: 300,
        y: 150,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [INI.TOP, 500]
      },
      { w: 220, y: 150, type: "L", inf: "lake" },
      { w: 150, y: 150, type: "L", enemy: "tank" },
      {
        w: 500,
        y: 100,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [INI.TOP, 500, 200]
      },
      {
        w: 300,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "plane",
        h: [400]
      },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 50, y: INI.ZERO, type: "L", pat: "sand" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm",
        enemy: "plane",
        h: [200],
        pat: "sand"
      },
      { w: 50, y: INI.ZERO, type: "L", pat: "sand" },
      { w: 200, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 350, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 250, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      { w: 300, y: INI.ZERO, type: "L", pat: "sea", enemy: "ship" },
      {
        w: 500,
        y: INI.ZERO,
        type: "L",
        pat: "sea",
        enemy: "plane",
        h: [200, 600]
      },
      { w: 50, y: INI.ZERO, type: "L", pat: "sand" },
      {
        w: 250,
        y: INI.ZERO,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        inf: "palm",
        enemy: "plane",
        h: [200],
        pat: "sand"
      },
      { w: 50, y: INI.ZERO, type: "L", pat: "sand" },
      { w: 400, y: INI.ZERO, type: "L", pat: "sea" },
      { w: 20, y: 30, type: "L" },
      { w: 20, y: 45, type: "L" },
      { w: 20, y: 65, type: "L" },
      { w: 20, y: 100, type: "L" },
      {
        w: 300,
        y: INI.TOP,
        type: "Q",
        cp: { x: 50, y: 25, f: -1 },
        enemy: "zeppelin"
      },
      { w: 300, y: 200, type: "Q", cp: { x: 50, y: 25, f: -1 } },
      { w: 300, y: 160, type: "L", inf: "forest" },
      {
        w: 300,
        y: 120,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [250, 400]
      },
      { w: 220, y: 120, type: "L", inf: "lake" },
      { w: 150, y: 120, type: "L", enemy: "tank" },
      {
        w: 300,
        y: 160,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [250, 400]
      },
      { w: 300, y: 200, type: "L", inf: "forest", enemy: "plane", h: [500] },
      { w: 200, y: 200, type: "L", enemy: "tank" },
      {
        w: 300,
        y: 160,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [350, 600]
      },
      { w: 200, y: 160, type: "Q", cp: { x: 50, y: 25, f: 1 } },
      { w: 300, y: 200, type: "L", inf: "forest", enemy: "plane", h: [300] },
      { w: 400, y: 100, type: "L", inf: "forest", enemy: "plane", h: [600] },
      { w: 50, y: 90, type: "L" },
      { w: 80, y: 80, type: "L" },
      { w: 220, y: 80, type: "L", inf: "lake" },
      { w: 200, y: 80, type: "L", inf: "forest", enemy: "plane", h: [200] },
      { w: 150, y: 80, type: "L", enemy: "tank" },
      { w: 130, y: 80, type: "L", inf: "lake" },
      {
        w: 200,
        y: 80,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [180, 590]
      },
      { w: 80, y: 70, type: "L" },
      { w: 80, y: 60, type: "L" },
      { w: 100, y: 55, type: "L" },
      {
        w: 200,
        y: 50,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [120, 450]
      },
      { w: 150, y: INI.ZERO, type: "L", enemy: "zeppelin" },
      {
        w: 400,
        y: INI.ZERO,
        type: "L",
        inf: "forest",
        enemy: "plane",
        h: [100, 300, 500]
      },
      { w: 300, y: INI.ZERO, type: "L", inf: "lake", enemy: "plane", h: [INI.TOP] },
      { w: 150, y: INI.ZERO, type: "L", enemy: "tank" },
      { w: 150, y: INI.ZERO, type: "L", enemy: "tank" },
      { w: 150, y: INI.ZERO, type: "L", enemy: "tank" },
      { w: 300, y: INI.ZERO, type: "L", inf: "lake", enemy: "plane", h: [250, 550] },

      //
      { w: 260, y: INI.ZERO, type: "L", enemy: "zeppelin" },
      { w: 300, y: INI.ZERO, type: "L", inf: "lake", enemy: "plane", h: [100, 200] },
      { w: 350, y: INI.ZERO, type: "L", inf: "forest"},
      { w: 1000, y: INI.ZERO, type: "L", inf: "airport", enemy: "zeppelin" },
      { w: 500, y: INI.ZERO, type: "L" },
      { w: 150, y: 768, type: "Q", cp: { x: 35, y: 10, f: -1 } },
      { w: 1000, y: 768, type: "L" }
    ],
    worldLength: 19990,
    airport: {
      x1: 0,
      x2: 0
    },
    mainPattern: "grass"
  }
};
