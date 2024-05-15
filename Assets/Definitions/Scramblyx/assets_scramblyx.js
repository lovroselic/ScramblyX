/* assets for ScramblyX */
console.log("Assets for INVASION starting .....");

LoadFonts = [
  { srcName: "MoriaCitadel.ttf", name: "Moria" },
  { srcName: "AnnieUseYourTelescope.ttf", name: "Annie" },
  { srcName: "DeepDown.ttf", name: "DeepDown" },
  { srcName: "C64_Pro-STYLE.ttf", name: "C64" },
  { srcName: "CosmicAlien.ttf", name: "Alien" },
  { srcName: "ArcadeClassic.ttf", name: "Arcade" },
  { srcName: "emulogic.ttf", name: "Emulogic" },
  { srcName: "Adore64.ttf", name: "Adore" },
  { srcName: "N-Gage.ttf", name: "NGage" },
];

LoadTextures = [
  //patterns
  { srcName: "Wall/GrassTerrain.jpg", name: "GrassTerrain" },
  { srcName: "Wall/SandTerrain.jpg", name: "SandTerrain" },
  { srcName: "Wall/SeaTerrain.jpg", name: "SeaTerrain" },

  //title
  { srcName: "Title/ScramblyxPilot768.jpg", name: "Title" },
];
LoadAudio = [
  { srcName: "Explosion1.mp3", name: "Explosion" },
  { srcName: "Immaculate Deception - LaughingSkull.mp3", name: "Title" },
  { srcName: "PlaneMotor.mp3", name: "PlaneMotor" }
];

LoadSprites = [
  { srcName: "Items/battleShip1.png", name: "battleShip1" },
  { srcName: "Items/battleShip2.png", name: "battleShip2" },
  { srcName: "Items/battleShip3.png", name: "battleShip3" },
  { srcName: "Items/battleShip4.png", name: "battleShip4" },
  { srcName: "Items/palm1.png", name: "palm1" },
  { srcName: "Items/palm2.png", name: "palm2" },
  { srcName: "Items/palm3.png", name: "palm3" },
  { srcName: "Items/palm4.png", name: "palm4" },
  { srcName: "Items/palm5.png", name: "palm5" },
  { srcName: "Items/tank1.png", name: "tank1" },
  { srcName: "Items/tank2.png", name: "tank2" },
  { srcName: "Items/tank3.png", name: "tank3" },
  { srcName: "Items/tank4.png", name: "tank4" },
  { srcName: "Items/tank5.png", name: "tank5" },
  { srcName: "Items/tank6.png", name: "tank6" },
  { srcName: "Items/tree1.png", name: "tree1" },
  { srcName: "Items/tree2.png", name: "tree2" },
  { srcName: "Items/tree3.png", name: "tree3" },
  { srcName: "Items/tree4.png", name: "tree4" },
  { srcName: "Items/tree5.png", name: "tree5" },
  { srcName: "Items/tree6.png", name: "tree6" },
  { srcName: "Items/tree7.png", name: "tree7" },
  { srcName: "Items/tree8.png", name: "tree8" },
  { srcName: "Items/zeppelin.png", name: "zeppelin" },
];

LoadRotated = [
  //planes
  { srcName: "Plane1.png", name: "Plane1", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane10.png", name: "Plane10", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane11.png", name: "Plane11", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane2.png", name: "Plane2", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane3.png", name: "Plane3", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane4.png", name: "Plane4", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane5.png", name: "Plane5", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane6.png", name: "Plane6", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane7.png", name: "Plane7", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane8.png", name: "Plane8", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "Plane9.png", name: "Plane9", rotate: { first: -30, last: 30, step: 1 }  },
  { srcName: "spitfire64.png", name: "Spitfire", rotate: { first: -30, last: 30, step: 1 }  },
];

LoadRotatedSheetSequences = [
  //bomb
  { srcName: "bomb1.png", count: 1, name: "Bomb", rotate: { first: 0, last: 90, step: 1 } },
];

LoadSheetSequences = [
  { srcName: "Explosion2.png", name: "Explosion", type: "png", count: 23 },
];

/*
var Grass = new Tile("grass1", 128, 128, "png", "grass");
var Sea = new Tile("sea", 128, 102, "png", "sea");
var Sand = new Tile("sand", 100, 100, "png", "sand");

var Spitfire = new Tile("spitfire64", 64, 17, "png", "spitfire");
var Bullet = new Tile("roundBullet", 5, 5, "png", "bullet");
var AExp1 = new Tile("ALIEN_exp_01", 48, 51, "png", "AlienExp1");
var AExp2 = new Tile("ALIEN_exp_02", 58, 57, "png", "AlienExp2");
var AExp3 = new Tile("ALIEN_exp_03", 58, 58, "png", "AlienExp3");
var AExp4 = new Tile("ALIEN_exp_04", 55, 54, "png", "AlienExp4");
var AExp5 = new Tile("ALIEN_exp_05", 49, 46, "png", "AlienExp5");
var AExp6 = new Tile("ALIEN_exp_06", 42, 38, "png", "AlienExp6");
var SExp1 = new Tile("SHIP_exp_01", 42, 53, "png", "ShipExp1");
var SExp2 = new Tile("SHIP_exp_02", 95, 90, "png", "ShipExp2");
var SExp3 = new Tile("SHIP_exp_03", 118, 111, "png", "ShipExp3");
var SExp4 = new Tile("SHIP_exp_04", 130, 125, "png", "ShipExp4");
var SExp5 = new Tile("SHIP_exp_05", 156, 146, "png", "ShipExp5");
var SExp6 = new Tile("SHIP_exp_06", 186, 167, "png", "ShipExp6");
var SExp7 = new Tile("SHIP_exp_07", 148, 131, "png", "ShipExp7");
var SExp8 = new Tile("SHIP_exp_08", 123, 100, "png", "ShipExp8");
var AstExp1 = new Tile("ASTEROID_exp_01", 48, 37, "png", "AstExp1");
var AstExp2 = new Tile("ASTEROID_exp_02", 56, 39, "png", "AstExp2");
var AstExp3 = new Tile("ASTEROID_exp_03", 64, 45, "png", "AstExp3");
var AstExp4 = new Tile("ASTEROID_exp_04", 72, 47, "png", "AstExp4");
var AstExp5 = new Tile("ASTEROID_exp_05", 80, 50, "png", "AstExp5");
var AstExp6 = new Tile("ASTEROID_exp_06", 96, 59, "png", "AstExp6");
var AstExp7 = new Tile("ASTEROID_exp_07", 96, 62, "png", "AstExp7");
var AstExp8 = new Tile("ASTEROID_exp_08", 80, 49, "png", "AstExp8");
var AstExp9 = new Tile("ASTEROID_exp_09", 72, 46, "png", "AstExp9");
var AstExp10 = new Tile("ASTEROID_exp_10", 64, 34, "png", "AstExp10");
var AstExp11 = new Tile("ASTEROID_exp_11", 56, 32, "png", "AstExp11");
var AstExp12 = new Tile("ASTEROID_exp_12", 48, 34, "png", "AstExp12");
var Tree1 = new Tile("spruce", 36, 48, "png", "tree1");
var Tree2 = new Tile("leaftree1", 32, 48, "png", "tree2");
var Tree3 = new Tile("leaftree2", 48, 34, "png", "tree3");
var Tree4 = new Tile("tree4", 44, 48, "png", "tree4");
var Tree5 = new Tile("tree5", 39, 48, "png", "tree5");
var Tree6 = new Tile("tree6", 47, 48, "png", "tree6");
var Tree7 = new Tile("tree7", 29, 48, "png", "tree7");
var Tree8 = new Tile("tree8", 32, 48, "png", "tree8");
var Bomb = new Tile("bomb1", 32, 16, "png", "bomb");
var Zeppelin = new Tile("zeppelin", 256, 47, "png", "zeppelin");
var Tank6 = new Tile("tank6", 80, 32, "png", "tank6");
var Tank5 = new Tile("tank5", 80, 30, "png", "tank5");
var Tank4 = new Tile("tank4", 80, 31, "png", "tank4");
var Tank3 = new Tile("tank3", 80, 25, "png", "tank3");
var Tank2 = new Tile("tank2", 80, 32, "png", "tank2");
var Tank1 = new Tile("tank1", 80, 33, "png", "tank1");
var Plane1 = new Tile("plane1", 64, 22, "png", "plane1");
var Plane2 = new Tile("plane2", 64, 19, "png", "plane2");
var Plane3 = new Tile("plane3", 64, 23, "png", "plane3");
var Plane4 = new Tile("plane4", 64, 17, "png", "plane4");
var Plane5 = new Tile("plane5", 64, 22, "png", "plane5");
var Plane6 = new Tile("plane6", 64, 16, "png", "plane6");
var Plane7 = new Tile("plane7", 64, 15, "png", "plane7");
var Plane8 = new Tile("plane8", 64, 15, "png", "plane8");
var Plane9 = new Tile("plane9", 64, 33, "png", "plane9");
var Plane10 = new Tile("plane10", 64, 19, "png", "plane10");
var Plane11 = new Tile("plane11", 64, 23, "png", "plane11");
var Ship1 = new Tile("battleShip1", 160, 31, "png", "ship1");
var Ship2 = new Tile("battleShip2", 160, 40, "png", "ship2");
var Ship3 = new Tile("battleShip3", 160, 45, "png", "ship3");
var Ship4 = new Tile("battleShip4", 160, 34, "png", "ship4");
var Palm1 = new Tile("palm1", 32, 48, "png", "palm1");
var Palm2 = new Tile("palm2", 38, 48, "png", "palm2");
var Palm3 = new Tile("palm3", 43, 48, "png", "palm3");
var Palm4 = new Tile("palm4", 48, 48, "png", "palm4");
var Palm5 = new Tile("palm5", 35, 48, "png", "palm5");
*/


/*
var World = {
  sprite: [Bullet, Spitfire, Grass, Bomb, Sea, Sand],
  tree: [Tree1, Tree2, Tree3, Tree4, Tree5, Tree6, Tree7, Tree8],
  palm: [Palm1, Palm2, Palm3, Palm4, Palm5],
  zeppelin: [Zeppelin],
  plane: [Plane1, Plane2, Plane3, Plane4, Plane5, Plane6, Plane7, Plane8, Plane9, Plane10, Plane11],
  ship: [Ship1, Ship2, Ship3, Ship4],
  tank: [Tank1, Tank2, Tank3, Tank4, Tank5, Tank6],
  animation: [
    AExp1,
    AExp2,
    AExp3,
    AExp4,
    AExp5,
    AExp6,
    SExp1,
    SExp2,
    SExp3,
    SExp4,
    SExp5,
    SExp6,
    SExp7,
    SExp8,
    AstExp1,
    AstExp2,
    AstExp3,
    AstExp4,
    AstExp5,
    AstExp6,
    AstExp7,
    AstExp8,
    AstExp9,
    AstExp10,
    AstExp11,
    AstExp12
  ]
};
*/

/*

var Creation = [
  {
    name: "bullet",
    angles: [0]
  },
  {
    name: "zeppelin",
    angles: [0]
  },
  {
    name: "spitfire",
    angles: [0, 5, 10, 15, 20, 25, 30, 355, 350, 345, 340, 335, 330]
  },
  {
    name: "bomb",
    angles: [],
    series: { first: 0, last: 90, step: 5 }
  },
  {
    name: "plane1",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane2",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane3",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane4",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane5",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane6",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane7",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane8",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane9",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane10",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "plane11",
    angles: [0, 5, 10, 15, 20, 355, 350, 345, 340]
  },
  {
    name: "tank1",
    angles: [0]
  },
   {
    name: "tank2",
    angles: [0]
  },
   {
    name: "tank3",
    angles: [0]
  },
   {
    name: "tank4",
    angles: [0]
  },
   {
    name: "tank5",
    angles: [0]
  },
  {
    name: "tank6",
    angles: [0]
  },
  {
    name: "ship1",
    angles: [0]
  },
  {
    name: "ship2",
    angles: [0]
  },
  {
    name: "ship3",
    angles: [0]
  },
  {
    name: "ship4",
    angles: [0]
  },
];

*/
/*var PATTERN = {
  create: function(which, img){
    var image = $("#" + img.id)[0];
    var CTX = LAYER.world;
    PATTERN[which] = CTX.createPattern(image, "repeat");
  }
}*/

console.log("Assets for INVASION ready.");
