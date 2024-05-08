//////////////////engine.js/////////////////////////
//  ENGINE version 1.30 by LS
//  LEVEL renderer version 1.00 by LS
// used by ScramblyX
///////////////////////////////////////////////////

var ENGINE = {
  SOURCE: "/Games/AA/",
  checkIntersection: true, //use linear intersection collision method after pixelperfect collision; set to false to exclude
  SRC_rel: "/Games/AA/",
  LOAD_W: 202,
  LOAD_H: 22,
  preLoadImages: function() {
    ENGINE.count = 0;
    ENGINE.spriteCount = 0;
    ENGINE.tileGraphics = [];
    var fileNames = getImgFileNames();
    ENGINE.HMI = fileNames.length;
    for (var ix = 0; ix < ENGINE.HMI; ix++) {
      ENGINE.tileGraphics[ix] = new Image();
      ENGINE.tileGraphics[ix].onload = cnt;
      ENGINE.tileGraphics[ix].crossOrigin = "Anonymous";
      ENGINE.tileGraphics[ix].src = fileNames[ix].filename;
      $("#preload").append(
        "<img id='" +
          fileNames[ix].id +
          "' src='" +
          fileNames[ix].filename +
          "' crossOrigin='Anonymous'/>"
      );
    }
    return;

    function cnt() {
      ENGINE.count++;
      ENGINE.drawLoadingGraph(ENGINE.count, ENGINE.HMI, "Loading");

      if (ENGINE.count === ENGINE.HMI) {
        ENGINE.imagesLoaded = true;
        ENGINE.tileToImage();
        ENGINE.createSprites();
      }
    }

    function getImgFileNames() {
      var fileNames = [];
      for (var prop in World) {
        var LN = World[prop].length;
        if (LN) {
          for (var ix = 0; ix < LN; ix++) {
            var name =
              ENGINE.SOURCE + World[prop][ix].id + "." + World[prop][ix].type;
            fileNames.push({
              id: World[prop][ix].id,
              filename: name
            });
          }
        }
      }
      return fileNames;
    }
  },
  init: function() {
    LAYER = {};
    SPRITE = {};
    $("#temp").append(
      "<canvas id ='temp_canvas' width='" +
        INI.sprite_maxW +
        "' height='" +
        INI.sprite_maxH +
        "'></canvas>"
    );
    $("#temp2").append(
      "<canvas id ='temp_canvas2' width='" +
        INI.sprite_maxW +
        "' height='" +
        INI.sprite_maxH +
        "'></canvas>"
    );
    LAYER.temp = $("#temp_canvas")[0].getContext("2d");
    LAYER.temp2 = $("#temp_canvas2")[0].getContext("2d");
  },
  gameWindowId: "#game",
  gameWIDTH: 960,
  currentTOP: 0,
  addBOX: function(id, height, layers, alias) {
    if (id === null) return;
    if (height === null) return;
    layers = layers || 1;
    $(ENGINE.gameWindowId).append(
      "<div id ='" + id + "' style='position: relative'></div>"
    );
    var prop;
    if (layers === 1) {
      $("#" + id).append(
        "<canvas id='" +
          id +
          "_canvas' width='" +
          ENGINE.gameWIDTH +
          "' height='" +
          height +
          "'></canvas>"
      );
      prop = alias.shift();
      LAYER[prop] = $("#" + id + "_canvas")[0].getContext("2d");
    } else {
      var canvasElement;
      for (var x = 0; x < layers; x++) {
        canvasElement =
          "<canvas class='layer' id='" +
          id +
          "_canvas_" +
          x +
          "' width='" +
          ENGINE.gameWIDTH +
          "' height='" +
          height +
          "' style='z-index:" +
          x +
          "; top:" +
          ENGINE.currentTOP +
          "px'></canvas>";
        $("#" + id).append(canvasElement);
        prop = alias.shift();
        LAYER[prop] = $("#" + id + "_canvas_" + x)[0].getContext("2d");
      }
      ENGINE.currentTOP = ENGINE.currentTOP + height;
    }
  },
  spriteDraw: function(layer, X, Y, image) {
    var CX = Math.floor(X - image.width / 2);
    var CY = Math.floor(Y - image.height / 2);
    var CTX = LAYER[layer];
    CTX.drawImage(image, CX, CY);
  },
  draw: function(layer, X, Y, image) {
    var CTX = LAYER[layer];
    CTX.drawImage(image, X, Y);
  },
  clearLayer: function(layer) {
    var CTX = LAYER[layer];
    CTX.clearRect(0, 0, CTX.canvas.width, CTX.canvas.height);
  },
  fillLayer: function(layer, colour) {
    var CTX = LAYER[layer];
    CTX.fillStyle = colour;
    CTX.fillRect(0, 0, CTX.canvas.width, CTX.canvas.height);
  },
  tileToImage: function() {
    var image;
    for (var prop in World) {
      var LN = World[prop].length;
      if (LN) {
        for (var ix = 0; ix < LN; ix++) {
          image = $("#" + World[prop][ix].id)[0];
          SPRITE[World[prop][ix].name] = image;
        }
      }
    }
  },
  trimCanvas: function(data) {
    var top = 0,
      bottom = data.height,
      left = 0,
      right = data.width;
    var width = data.width;
    while (top < bottom && rowBlank(data, width, top)) ++top;
    while (bottom - 1 > top && rowBlank(data, width, bottom - 1)) --bottom;
    while (left < right && columnBlank(data, width, left, top, bottom)) ++left;
    while (right - 1 > left && columnBlank(data, width, right - 1, top, bottom))
      --right;

    return { left: left, top: top, right: right, bottom: bottom };

    function rowBlank(data, width, y) {
      for (var x = 0; x < width; ++x) {
        if (data.data[y * width * 4 + x * 4 + 3] !== 0) return false;
      }
      return true;
    }

    function columnBlank(data, width, x, top, bottom) {
      for (var y = top; y < bottom; ++y) {
        if (data.data[y * width * 4 + x * 4 + 3] !== 0) return false;
      }
      return true;
    }
  },
  rotateImage: function(image, degree, newName) {
    var CTX = LAYER.temp;
    var CW = image.width;
    var CH = image.height;
    var max = MAX(CW, CH);
    var min = MAX(CW, CH);
    CTX.canvas.width = max * 2;
    CTX.canvas.height = max * 2;
    CTX.save();
    CTX.translate(max, max);
    CTX.rotate(degree * Math.PI / 180);
    CTX.drawImage(image, -min / 2, -min / 2);
    CTX.restore();
    var imgDATA = CTX.getImageData(0, 0, CTX.canvas.width, CTX.canvas.height);
    var TRIM = ENGINE.trimCanvas(imgDATA);
    var trimmed = CTX.getImageData(
      TRIM.left,
      TRIM.top,
      TRIM.right - TRIM.left,
      TRIM.bottom - TRIM.top
    );
    CTX.canvas.width = TRIM.right - TRIM.left;
    CTX.canvas.height = TRIM.bottom - TRIM.top;
    CTX.putImageData(trimmed, 0, 0);
    SPRITE[newName] = new Image();
    SPRITE[newName].onload = ENGINE.creationSpriteCount;
    SPRITE[newName].crossOrigin = "Anonymous";
    SPRITE[newName].src = CTX.canvas.toDataURL("image/png");
    SPRITE[newName].width = CTX.canvas.width;
    SPRITE[newName].height = CTX.canvas.height;
  },
  createSprites: function() {
    var LN = Creation.length;
    var totalLength = 0;
    for (var x = 0; x < LN; x++) {
      var LAN = Creation[x].angles.length;
      if (LAN === 0) {
        for (
          var q = Creation[x].series.first;
          q <= Creation[x].series.last;
          q += Creation[x].series.step
        ) {
          Creation[x].angles.push(q);
        }
      }
      LAN = Creation[x].angles.length;
      totalLength += LAN;
      for (var y = 0; y < LAN; y++) {
        var newName = Creation[x].name + "_" + Creation[x].angles[y];
        ENGINE.rotateImage(
          SPRITE[Creation[x].name],
          Creation[x].angles[y],
          newName
        );
      }
    }
    ENGINE.HMCI = totalLength;
  },
  creationSpriteCount: function() {
    ENGINE.spriteCount++;
    ENGINE.drawLoadingGraph(ENGINE.spriteCount, ENGINE.HMCI, "Sprites");
    if (ENGINE.spriteCount === ENGINE.HMCI) {
      $("#buttons").prepend(
        "<input type='button' id='startGame' value='START'>"
      );
      $("#load").addClass("hidden");
      $("#startGame").on("click", PRG.start);
    }
  },
  intersectionCollision: function(actor1, actor2) {
    if (actor1.class !== "bullet" && actor2.class !== "bullet") return; 
    if (actor1.prevX === null || actor2.prevX === null) return; 

    var AL = arguments.length;
    var line1 = {};
    var line2 = {};
    for (var q = 0; q < AL; q++) {
      switch (arguments[q].class) {
        case "bullet":
          // for 5px*5px bullet
          line1.x1 = arguments[q].prevX;
          line1.y1 = arguments[q].prevY + 3; 
          line1.x2 = arguments[q].x;
          line1.y2 = arguments[q].y - 3; 
          break;
        default:
          //linear representation of object, angle not considered
          line2.x1 = parseInt(
            (arguments[q].prevX + arguments[q].x) / 2 + arguments[q].width / 2,
            10
          );
          line2.y1 = parseInt((arguments[q].prevY + arguments[q].y) / 2, 10);
          line2.x2 = parseInt(
            (arguments[q].prevX + arguments[q].x) / 2 - arguments[q].width / 2,
            10
          );
          line2.y2 = line2.y1;
          break;
      }
    }
    return ENGINE.lineIntersects(
      line1.x1,
      line1.y1,
      line1.x2,
      line1.y2,
      line2.x1,
      line2.y1,
      line2.x2,
      line2.y2
    );
  },
  lineIntersects: function(a, b, c, d, p, q, r, s) {
    //https://stackoverflow.com/a/24392281/4154250
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return 0 < lambda && lambda < 1 && (0 < gamma && gamma < 1);
    }
  },
  pixPerfectCollision: function(actor1, actor2) {
    var w1 = parseInt(actor1.width / 2, 10);
    var w2 = parseInt(actor2.width / 2, 10);
    var h1 = parseInt(actor1.height / 2, 10);
    var h2 = parseInt(actor2.height / 2, 10);
    var act1 = new Vector(actor1.x, actor1.y);
    var act2 = new Vector(actor2.x, actor2.y);

    var SQ1 = new Square(act1.x - w1, act1.y - h1, w1 * 2, h1 * 2);
    var SQ2 = new Square(act2.x - w2, act2.y - h2, w2 * 2, h2 * 2);

    var x = parseInt(MAX(SQ1.x, SQ2.x), 10) - 1;
    var y = parseInt(MAX(SQ1.y, SQ2.y), 10) - 1;
    var w = parseInt(MIN(SQ1.x + SQ1.w - x, SQ2.x + SQ2.w - x), 10) + 1;
    var h = parseInt(MIN(SQ1.y + SQ1.h - y, SQ2.y + SQ2.h - y), 10) + 1;

    if (w === 0 || h === 0) return false;

    var area = new Square(x, y, w, h);
    var area1 = new Square(area.x - SQ1.x, area.y - SQ1.y, area.w, area.h);
    var area2 = new Square(area.x - SQ2.x, area.y - SQ2.y, area.w, area.h);

    var CTX1 = LAYER.temp;
    var CTX2 = LAYER.temp2;

    CTX1.canvas.width = INI.sprite_maxW;
    CTX1.canvas.height = INI.sprite_maxH;
    CTX2.canvas.width = INI.sprite_maxW;
    CTX2.canvas.height = INI.sprite_maxH;

    ENGINE.draw("temp", 0, 0, SPRITE[actor1.name]);
    ENGINE.draw("temp2", 0, 0, SPRITE[actor2.name]);

    var data1 = CTX1.getImageData(area1.x, area1.y, area1.w, area1.h); 
    var data2 = CTX2.getImageData(area2.x, area2.y, area2.w, area2.h);

    var DL = data1.data.length;
    var index;
    for (index = 3; index < DL; index += 4) {
      if (data1.data[index] > 0 && data2.data[index] > 0) {
        return true;
      }
    }
    //intersectionCollision check
    if (ENGINE.checkIntersection) {
      return ENGINE.intersectionCollision(actor1, actor2);
    } else return false;
  },
  collision: function(actor1, actor2) {
    var X = Math.abs(actor1.x - actor2.x);
    var Y = Math.abs(actor1.y - actor2.y);
    if (Y >= INI.COLLISION_SAFE) return false;
    if (X >= INI.COLLISION_SAFE) return false;
    var w1 = parseInt(actor1.width / 2, 10);
    var w2 = parseInt(actor2.width / 2, 10);
    var h1 = parseInt(actor1.height / 2, 10);
    var h2 = parseInt(actor2.height / 2, 10);

    if (X >= w1 + w2 || Y >= h1 + h2) return false; 
    return ENGINE.pixPerfectCollision(actor1, actor2);
  },
  collisionToBackground: function(actor, layer) {
    var CTX = layer;
    var maxSq = MAX(actor.width, actor.height);
    var R = Math.ceil(0.5 * Math.sqrt(2 * Math.pow(maxSq, 2)));
    var X = actor.x;
    var Y = actor.y;
    var imgDATA = CTX.getImageData(X - R, Y, 2 * R, R);
    var check = 1;
    var proximity = false;
    var left, right, down;
    while (check < R) {
      left = imgDATA.data[toIndex(X - check, Y)];
      right = imgDATA.data[toIndex(X + check, Y)];
      down = imgDATA.data[toIndex(X, Y + check)];
      if (left || right || down) {
        proximity = true;
        break;
      }
      check++;
    }
    if (!proximity) {
      return false;
    } else {
      var CX = Math.floor(X - actor.width / 2);
      var CY = Math.floor(Y - actor.height / 2);

      var CTX1 = LAYER.temp;
      ENGINE.draw("temp", 0, 0, SPRITE[actor.name]);
      var data1 = CTX1.getImageData(0, 0, actor.width, actor.height);
      var data2 = CTX.getImageData(CX, CY, actor.width, actor.height);
      var DL = data1.data.length;
      var index;
      for (index = 3; index < DL; index += 4) {
        if (data1.data[index] > 0 && data2.data[index] > 0) {
          return true;
        }
      }
      return false;
    }

    function toIndex(x, y) {
      var index = (y - Y) * 4 * (2 * R) + (x - (X - R)) * 4 + 3;
      return index;
    }
  },
  drawLoadingGraph: function(count, HMI, text) {
    var percent = Math.floor(count / HMI * 100);
    var CTX = ENGINE.ctx;
    CTX.clearRect(0, 0, ENGINE.LOAD_W, ENGINE.LOAD_H);
    CTX.beginPath();
    CTX.lineWidth = "1";
    CTX.strokeStyle = "black";
    CTX.rect(0, 0, ENGINE.LOAD_W, ENGINE.LOAD_H);
    CTX.closePath();
    CTX.stroke();
    CTX.fillStyle = "#999";
    CTX.fillRect(
      1,
      1,
      Math.floor((ENGINE.LOAD_W - 2) * (percent / 100)),
      ENGINE.LOAD_H - 2
    );
    CTX.fillStyle = "black";
    CTX.font = "10px Verdana";
    CTX.fillText(
      text + ": " + percent + "%",
      ENGINE.LOAD_W * 0.1,
      ENGINE.LOAD_H * 0.62
    );
    return;
  },
  spriteDump: function(layer) {
    console.log("********* SPRITE DUMP *********");
    console.log(SPRITE);
    var x = 0;
    var y = 0;
    var dy = 0;
    for (var q in SPRITE) {
      ENGINE.draw(layer, x, y, SPRITE[q]);
      x += SPRITE[q].width;
      if (SPRITE[q].height > dy) dy = SPRITE[q].height;
      if (x > LAYER[layer].canvas.width - 64) {
        y += dy;
        x = 0;
      }
    }
  }
};

var LEVEL = {
  draw: function(level) {
    var CTX = LAYER.level;
    LAYER.level.canvas.width = LEVELS[level].worldLength;
    var LN = LEVELS[level].world.length;
    var x = 0;
    var y = INI.GAME_HEIGHT - INI.ZERO;
    for (var q = 0; q < LN; q++) {
      drawChunk(LEVELS[level].world[q]);
    }
    return;

    function drawChunk(chunk) {
      CTX.beginPath();
      CTX.moveTo(x, y);
      CTX.lineTo(x, INI.GAME_HEIGHT);
      CTX.lineTo(x + chunk.w, INI.GAME_HEIGHT);
      CTX.lineTo(x + chunk.w, INI.GAME_HEIGHT - chunk.y);

      switch (chunk.type) {
        case "L":
          CTX.lineTo(x, y);
          break;
        case "Q":
          var cpx = Math.floor(x + chunk.cp.x * chunk.w / 100);
          var CY;
          if (chunk.cp.f === 1) {
            CY = MIN(y, INI.GAME_HEIGHT - chunk.y);
          } else {
            CY = MAX(y, INI.GAME_HEIGHT - chunk.y);
          }
          var cpy = CY + chunk.cp.y * chunk.cp.f;
          CTX.quadraticCurveTo(cpx, cpy, x, y);
          break;
        default:
          console.log("chunk type ERROR");
      }
      CTX.closePath();

      if (chunk.pat === undefined) {
        CTX.fillStyle = PATTERN[LEVELS[level].mainPattern];
      } else {
        CTX.fillStyle = PATTERN[chunk.pat];
      }

      CTX.fill();

      switch (chunk.inf) {
        case "airport":
          CTX.beginPath();
          CTX.moveTo(x, y);
          CTX.lineTo(x, y + INI.PISTE_HEIGHT);
          CTX.lineTo(x + chunk.w, y + INI.PISTE_HEIGHT);
          CTX.lineTo(x + chunk.w, y);
          CTX.lineTo(x, y);
          CTX.closePath();
          CTX.fillStyle = "#333";
          CTX.fill();
          LEVELS[level].airport.x1 = x;
          LEVELS[level].airport.x2 = x + chunk.w;
          break;
        case "forest":
          var dY = INI.GAME_HEIGHT - chunk.y - y;
          var slope = dY / chunk.w;
          var nextX = 0;
          var nextY, treeTile, treeIMG, treeWidth;
          var TC;
          while (nextX < chunk.w - INI.TREE_PADDING - 36) {
            treeTile = World.tree.chooseRandom();
            treeIMG = $("#" + treeTile.id)[0];
            nextY = Math.floor(nextX * slope);
            if (slope > 0) {
              TC = INI.TREE_CORRECTION;
              if (slope > 0.5)
                TC = Math.floor(INI.TREE_CORRECTION * (slope + 0.7));
            } else TC = 0;
            ENGINE.draw(
              "level",
              x + nextX,
              y + nextY - treeIMG.height + TC,
              treeIMG
            );
            nextX += treeIMG.width - INI.TREE_PADDING;
          }
          break;
        case "lake":
          CTX.beginPath();
          CTX.moveTo(x + INI.LAKE_PADDING, y);
          CTX.quadraticCurveTo(
            x + Math.floor(chunk.w / 2),
            y + INI.PISTE_HEIGHT,
            x + chunk.w - INI.LAKE_PADDING,
            y
          );
          CTX.lineTo(x, y);
          CTX.closePath();
          CTX.fillStyle = "#00F";
          CTX.fill();
          break;
        case "palm":
          var palmTile, palmIMG, py;
          var nextPx = 0;
          while (nextPx < chunk.w - INI.TREE_PADDING - 24) {
            palmTile = World.palm.chooseRandom();
            palmIMG = $("#" + palmTile.id)[0];
            py = INI.GAME_HEIGHT - chunk.y - palmIMG.height;
            ENGINE.draw("level", x + nextPx, py, palmIMG);
            nextPx += palmIMG.width - INI.TREE_PADDING;
          }
          break;

        default:
          break;
      }
      switch (chunk.enemy) {
        case "plane":
          var NPL = chunk.h.length;
          var ax, ay, sName;
          for (var qw = 0; qw < NPL; qw++) {
            ax = x + Math.floor(chunk.w / 2);
            ay = INI.GAME_HEIGHT - chunk.h[qw];
            sName = "plane" + RND(1, INI.ENEMY_PLANES);
            ENEMY.pool.push(
              new ENEMY_ACTOR(
                sName, //sprite_class
                ax, //x
                ay, //y
                0, //angle
                ax, //realX
                ay, //realY
                "plane", //type
                INI.PLANE_SCORE,
                RND(INI.PLANE_SPEED - 1, INI.PLANE_SPEED + 2),
                INI.PLANE_SHOOT,
                1, //realLives
                null,
                null //prevX, prevY
              )
            );
          }
          break;
        case "zeppelin":
          ax = x + Math.floor(chunk.w / 2);
          ay = 100;
          ENEMY.pool.push(
            new ENEMY_ACTOR(
              "zeppelin", //sprite_class
              ax, //x
              ay, //y
              0, //angle
              ax, //realX
              ay, //realY
              "zeppelin", //type
              100,
              INI.ZEPPELIN_SPEED,
              0,
              3, //realLives
              null,
              null //prevX, prevY
            )
          );
          break;
        case "tank":
          sName = "tank" + RND(1, INI.ENEMY_TANKS);
          ax = x + Math.floor(chunk.w / 2);
          ay = INI.GAME_HEIGHT - chunk.y - Math.floor(SPRITE[sName].height / 2);
          ENEMY.pool.push(
            new ENEMY_ACTOR(
              sName, //sprite_class
              ax, //x
              ay, //y
              0, //angle
              ax, //realX
              ay, //realY
              "tank", //type
              INI.TANK_SCORE,
              0,
              0,
              3, //realLives
              null,
              null //prevX, prevY
            )
          );
          break;
        case "ship":
          sName = "ship" + RND(1, INI.ENEMY_SHIPS);
          ax = x + Math.floor(chunk.w / 2);
          ay = INI.GAME_HEIGHT - chunk.y - Math.floor(SPRITE[sName].height / 2);
          ENEMY.pool.push(
            new ENEMY_ACTOR(
              sName, //sprite_class
              ax, //x
              ay, //y
              0, //angle
              ax, //realX
              ay, //realY
              "ship", //type
              INI.SHIP_SCORE,
              0,
              INI.SHIP_SHOOT + RND(1, INI.SHIP_RANDOM),
              5, //realLives
              null,
              null //prevX, prevY
            )
          );
          break;
        default:
          break;
      }

      ////ready for next chunk
      x = x + chunk.w;
      y = INI.GAME_HEIGHT - chunk.y;
    }
  },
  paintVisible: function() {
    ENGINE.clearLayer("world");
    var CTX = LAYER.world;
    if (GAME.x < 0) GAME.x = 0;
    CTX.drawImage(
      LAYER.level.canvas,
      GAME.x,
      0,
      ENGINE.gameWIDTH,
      INI.GAME_HEIGHT,
      0,
      0,
      ENGINE.gameWIDTH,
      INI.GAME_HEIGHT
    );
  },
  moveTo: function(x) {
    GAME.x = x;
  }
};
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


