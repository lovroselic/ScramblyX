
const LEVEL = {
    VERSION: "1.0", 
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

  //END
console.log(`%cLinearLevelManager LEVEL ${LEVEL.VERSION} loaded.`, ENGINE.CSS);