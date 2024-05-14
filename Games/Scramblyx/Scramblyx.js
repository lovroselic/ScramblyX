/////////////////////////////////////////////////
/*
 to do:
 known bugs: 
 - shoot over top of the mountain 
 
 */
/////////////debug vars: remove all in production/////////////////////
const DEBUG = {
    CHEAT: false,
    debug: true,
    invincible: false,
    LEVEL: 1,
    lives: 5,
    show_hdata: false,
    FPS: true,
};

////////////////////////////////////////////////////

const CONST = {
    SPACE: "\u0020",
    NBS: "&nbsp",
    NEWLINE: "\n"
};

const INI = {
    sprite_maxW: 300,
    sprite_maxH: 50,
    COLLISION_SAFE: 264,
    TITLE_HEIGHT: 72,
    GAME_HEIGHT: 768,
    ANIMATION_INTERVAL: 17,
    PISTE_HEIGHT: 8,
    ZERO: 24,
    TOP: 680,
    PLANE_TOP_OFFSET: 20, 
    MOVE: 4 * 60,
    PLANE_LEFT: 40,
    PLANE_RIGHT: 600,
    MAX_SPEED: 6, // was 8
    REWIND_MAX: -96,
    TREE_PADDING: 12,
    LAKE_PADDING: 10,
    TREE_CORRECTION: 12,
    BULLET_SPEED: 24,
    BULLET_TIMEOUT: 180,
    BOMB_TIMEOUT: 680,
    BOMB_GRAVITY_SPEED: 12,
    ENEMY_PLANES: 11,
    ENEMY_TANKS: 6,
    ENEMY_SHIPS: 4,
    PLANE_SCORE: 1000,
    TANK_SCORE: 500,
    SHIP_SCORE: 750,
    PLANE_SPEED: 13,
    ZEPPELIN_SPEED: 9,
    PLANE_SHOOT: 1200,
    SHIP_SHOOT: 1600,
    SHIP_RANDOM: 300,
    LEVEL_BONUS: 100000,
    LAST_LEVEL: 5,
    ACCELERATION_FACTOR: 0.1 * 60,
};

const PRG = {
    VERSION: "1.01.13",
    NAME: "ScramblyX",
    YEAR: "2018",
    CSS: "color: #239AFF;",
    INIT() {
        console.log("%c***********************************************************************************************************************************************", PRG.CSS);
        console.log(`${PRG.NAME} ${PRG.VERSION} by Lovro Selic, (c) LaughingSkull ${PRG.YEAR} on ${navigator.userAgent}`);
        console.log("%c***********************************************************************************************************************************************", PRG.CSS);
        $("#title").html(PRG.NAME);
        $("#version").html(`${PRG.NAME} V${PRG.VERSION} <span style='font-size:14px'>&copy</span> LaughingSkull ${PRG.YEAR}`);
        $("input#toggleAbout").val(`About  ${PRG.NAME}`);
        $("#about fieldset legend").append(` ${PRG.NAME} `);


        ENGINE.autostart = true;
        ENGINE.start = PRG.start;
        ENGINE.readyCall = GAME.setup;
        //ENGINE.setGridSize(64);
        //ENGINE.setSpriteSheetSize(64);
        ENGINE.init();

        /*** HERE */

    },
    setup() {
        $("#engine_version").html(ENGINE.VERSION);
        $("#lib_version").html(LIB.VERSION);
        $("#terrain_version").html(TERRAIN.VERSION);

        $("#toggleHelp").click(function () {
            $("#help").toggle(400);
        });
        $("#toggleAbout").click(function () {
            $("#about").toggle(400);
        });
        $("#toggleVersion").click(function () {
            $("#debug").toggle(400);
        });

        ENGINE.gameWIDTH = 1280;
        ENGINE.titleHEIGHT = INI.TITLE_HEIGHT;
        ENGINE.gameHEIGHT = INI.GAME_HEIGHT;
        ENGINE.bottomHEIGHT = 40;

        $("#bottom").css("margin-top", ENGINE.gameHEIGHT + ENGINE.titleHEIGHT + ENGINE.bottomHEIGHT);
        $(ENGINE.gameWindowId).width(ENGINE.gameWIDTH + 4);

        ENGINE.addBOX("TITLE", ENGINE.gameWIDTH, ENGINE.titleHEIGHT, ["title"]);
        ENGINE.addBOX("ROOM", ENGINE.gameWIDTH, ENGINE.gameHEIGHT, ["background", "world", "plane", "bullets", "explosion", "text", "FPS", "sign", "debug", "button"]);
        ENGINE.addBOX("DOWN", ENGINE.gameWIDTH, ENGINE.bottomHEIGHT, ["bottom", "bottomText"]);
        ENGINE.addBOX("LEVEL", ENGINE.gameWIDTH, ENGINE.gameHEIGHT, ["level"]);

        //$("#LEVEL").addClass("hidden");
        //LAYER.level.canvas.width = INI.LEVEL_WIDTH;

        ENGINE.checkIntersection = true;

    },

    start() {
        console.log(PRG.NAME + " started.");
        //$("#startGame").addClass("hidden");

        $(document).keypress(function (event) {
            if (event.which === 32 || event.which === 13) {
                event.preventDefault();
            }
        });


        PATTERN.fromTexture("GrassTerrain");
        PATTERN.fromTexture("SandTerrain");
        PATTERN.fromTexture("SeaTerrain");
        TITLE.startTitle();
        //GAME.start();
    }
};

///////////////////////////////////////////////////////////////////
const PLANE = {
    firstInit() {
        this.plane = "Spitfire";
        this.angle = 0;
        this.sprite = SPRITE[PLANE.plane + "_" + PLANE.angle];
        this.ignoreByManager = true;

        this.ZERO = INI.ZERO + Math.floor(PLANE.sprite.height / 2);
        //this.ZERO = ENGINE.gameHEIGHT - INI.ZERO - Math.floor(PLANE.sprite.height / 2);
        this.TOP = INI.TOP + INI.PLANE_TOP_OFFSET;
        this.init();
        this.position();
    },
    position() {
        this.y = this.ZERO;
        this.x = Math.floor(this.sprite.width / 2) + INI.PLANE_LEFT;
        this.angle = 0;
    },
    init() {
        this.sprite = SPRITE[PLANE.plane + "_" + PLANE.angle];
        this.speed = 0;
        this.airborne = false;
        this.landed = true;
        this.landing = false;
        this.dead = false;
        this.acceleration = false;
    },
    draw() {
        if (this.dead) return;
        this.sprite = SPRITE[this.plane + "_" + this.angle];
        ENGINE.spriteDraw("plane", this.x, ENGINE.gameHEIGHT - this.y, this.sprite);
        ENGINE.layersToClear.add("plane");
    },
    /*getY() {
        return ENGINE.gameHEIGHT - PLANE.y;
    },*/


    move(dir, lapsedTime) {
        const map = ENGINE.GAME.keymap;
        if (PLANE.landing) return;
        if (PLANE.speed < INI.MAX_SPEED && map[ENGINE.KEY.map.up]) return;
        if (PLANE.landed && map[ENGINE.KEY.map.down]) return;

        if (PLANE.landed && map[ENGINE.KEY.map.up]) {
            console.warn("LIFT OFF");
            PLANE.landed = false;
            PLANE.airborne = true;
            PLANE.y += 2;
            PLANE.bulletReady = true;
            PLANE.bombReady = true;
        }

        map[ENGINE.KEY.map.up] = false;
        map[ENGINE.KEY.map.down] = false;


        PLANE.angle = PLANE.angle + dir.y * 5;

        /*if (PLANE.angle < 0) PLANE.angle += 360;
        if (PLANE.angle === 360) PLANE.angle = 0;
        if (PLANE.angle > 30 && PLANE.angle < 320) PLANE.angle = 30;
        else if (PLANE.angle < 330 && PLANE.angle > 40) PLANE.angle = 330;*/

        PLANE.angle = Math.max(PLANE.angle, -30);
        PLANE.angle = Math.min(PLANE.angle, 30);

        console.info("PLANE.angle", PLANE.angle);
    },

    manage(lapsedTime) {
        this.collisionBackground();
    },
    collisionBackground() {
        if (PLANE.dead) return;
    },

    lateral(dir, lapsedTime) {
        if (PLANE.landing) return;

        if (PLANE.speed < INI.MAX_SPEED && !PLANE.acceleration && !GAME.levelComplete) {
            PLANE.acceleration = true;
            PLANE.speed = 1;
        }

        if (PLANE.landed) return;

        const timeF = 1000 / lapsedTime;

        PLANE.x += dir.x * INI.MOVE / timeF; //adjust to lapsedTime
        if (PLANE.x < INI.PLANE_LEFT) PLANE.x = INI.PLANE_LEFT;
        if (PLANE.x > INI.PLANE_RIGHT) PLANE.x = INI.PLANE_RIGHT;
    },

    /*collisions() {
        if (PLANE.landed && GAME.x < GAME.airportLength - INI.MAX_SPEED)
            return;
        if (PLANE.dead)
            return;
        var Plane = new ACTOR(PLANE.plane, PLANE.x, PLANE.y, PLANE.angle);
        var HTB = ENGINE.collisionToBackground(Plane, LAYER.world);
        if (HTB) {
            if (PLANE.airborne && PLANE.clearForlanding && PLANE.angle <= 10) {
                PLANE.landing = true;
                PLANE.angle = 0;
                PLANE.y = PLANE.ZERO;
                PLANE.airborne = false;
            } else {
                PLANE.die();
            }
        }
    },*/

    /*collisionBullet() {
        if (PLANE.landed && GAME.x < GAME.airportLength - INI.MAX_SPEED)
            return;
        if (PLANE.dead)
            return;
        var LN = BULLETS.pool.length;
        if (LN === 0)
            return;
        var Plane = new ACTOR(PLANE.plane, PLANE.x, PLANE.y, PLANE.angle);
        var HTB, blt;
        for (var q = LN - 1; q >= 0; q--) {
            blt = new ACTOR(
                "bullet",
                BULLETS.pool[q].x,
                BULLETS.pool[q].y,
                0,
                BULLETS.pool[q].prevX,
                BULLETS.pool[q].prevY
            );
            HTB = ENGINE.collision(blt, Plane);
            if (HTB) {
                BULLETS.remove(q);
                PLANE.die();
            }
        }
    },*/
    die() {
        PLANE.dead = true;
        GAME.rewind = true;
        ENGINE.clearLayer("plane");
        EXPLOSIONS.pool.push(new AnimationSPRITE(PLANE.x, PLANE.y, "ShipExp", 8));
        GAME.lives--;
        if (GAME.lives <= 0)
            GAME.over();
    },
    shoot() {
        if (PLANE.dead)
            return;
        if (!PLANE.airborne)
            return;
        if (!PLANE.bulletReady)
            return;
        PLANE.bulletReady = false;
        var x = PLANE.x + Math.floor(PLANE.sprite.width / 2);
        var vx = Math.floor(INI.BULLET_SPEED * Math.cos(PLANE.angle * Math.PI / 180));
        var vy2 = Math.round(
            INI.BULLET_SPEED * Math.sin(PLANE.angle * Math.PI / 180)
        );
        var vy1 = PLANE.getDY(PLANE.angle);
        var vy = vy1 + vy2;
        var y = PLANE.y + vy;
        BULLETS.pool.push(new BulletClass(x, y, vx, vy, 0));
        GAME.shotsFired++;
        setTimeout(function () {
            PLANE.bulletReady = true;
        }, INI.BULLET_TIMEOUT);
    },
    getDY(angle) {
        var smer;
        if (angle > 30) {
            smer = -1;
            angle = 360 - angle;
        } else
            smer = 1;
        return Math.floor(smer * (angle / 5));
    },
    dropBomb() {
        if (PLANE.dead) return;
        if (!PLANE.airborne) return;
        if (!PLANE.bombReady) return;
        PLANE.bombReady = false;

        var x = PLANE.x + Math.floor(PLANE.sprite.width * 0.6);
        var vx = Math.floor(PLANE.speed * Math.cos(PLANE.angle * Math.PI / 180));
        var vy2 = Math.floor(PLANE.speed * Math.sin(PLANE.angle * Math.PI / 180));
        var vy1 = PLANE.getDY(PLANE.angle);
        var vy = vy1 + vy2;
        if (vy < 0)
            vy = 0;
        var y = PLANE.y + vy + Math.floor(PLANE.sprite.height * 0.6);
        var angle = PLANE.angle;
        if (angle > 320) {
            let temp = (360 - angle) / 10;
            y -= Math.pow(2, temp);
        }
        if (angle > 90)
            angle = 0;
        BOMBS.pool.push(new BulletClass(x, y, vx, vy, angle));
        GAME.bombsDroped++;

        setTimeout(function () {
            PLANE.bombReady = true;
        }, INI.BOMB_TIMEOUT);
    }
};

var BulletClass = function (x, y, vx, vy, angle) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.angle = angle;
    this.prevX = null;
    this.prevY = null;
};

const BOMBS = {
    pool: [],
    move() {
        var LN = BOMBS.pool.length;
        var angle, calcAngle;
        for (var q = LN - 1; q >= 0; q--) {
            calcAngle =
                90 - Math.atan(BOMBS.pool[q].vx / BOMBS.pool[q].vy) * 180 / Math.PI;
            calcAngle = Math.round(calcAngle / 5) * 5;
            if (calcAngle > BOMBS.pool[q].angle)
                BOMBS.pool[q].angle += 5;
            if (BOMBS.pool[q].angle > 90)
                BOMBS.pool[q].angle = 90;
            BOMBS.pool[q].vx -= 0.35;
            if (BOMBS.pool[q].vx < 0)
                BOMBS.pool[q].vx = 0;
            BOMBS.pool[q].vy += 1;
            if (BOMBS.pool[q].vy > INI.BOMB_GRAVITY_SPEED)
                BOMBS.pool[q].vy = INI.BOMB_GRAVITY_SPEED;
            BOMBS.pool[q].x += Math.floor(BOMBS.pool[q].vx);
            BOMBS.pool[q].y += BOMBS.pool[q].vy;
            if (GAME.rewind) {
                BOMBS.pool[q].x -= PLANE.speed;
            }
            if (BOMBS.pool[q].x < 0 || BOMBS.pool[q].x > ENGINE.gameWIDTH) {
                BOMBS.remove(q);
                continue;
            }
        }
    },
    remove(x) {
        BOMBS.pool.splice(x, 1);
        return;
    },
    draw() {
        var LN = BOMBS.pool.length;
        var spriteName;
        for (var q = LN - 1; q >= 0; q--) {
            spriteName = "bomb_" + BOMBS.pool[q].angle;
            ENGINE.spriteDraw(
                "bullets",
                BOMBS.pool[q].x,
                BOMBS.pool[q].y,
                SPRITE[spriteName]
            );
        }
    },
    collisionToBackground() {
        var LN = BOMBS.pool.length;
        if (LN === 0)
            return;
        var HTB;
        for (var q = LN - 1; q >= 0; q--) {
            var bomb = new ACTOR(
                "bomb",
                BOMBS.pool[q].x,
                BOMBS.pool[q].y,
                BOMBS.pool[q].angle
            );
            HTB = ENGINE.collisionToBackground(bomb, LAYER.world);
            if (HTB) {
                EXPLOSIONS.pool.push(
                    new AnimationSPRITE(BOMBS.pool[q].x, BOMBS.pool[q].y, "AstExp", 12)
                );
                BOMBS.remove(q);
            }
        }
    }
};
const BULLETS = {
    pool: [],
    move() {
        var LN = BULLETS.pool.length;
        if (LN === 0)
            return;
        for (var q = LN - 1; q >= 0; q--) {
            BULLETS.pool[q].prevX = BULLETS.pool[q].x;
            BULLETS.pool[q].prevY = BULLETS.pool[q].y;
            BULLETS.pool[q].x += BULLETS.pool[q].vx;
            BULLETS.pool[q].y += BULLETS.pool[q].vy;

            if (GAME.rewind && BULLETS.pool[q].vx > 0) {
                BULLETS.pool[q].x -= PLANE.speed;
            }

            if (BULLETS.pool[q].x < 0 || BULLETS.pool[q].x > ENGINE.gameWIDTH) {
                BULLETS.remove(q);
                continue;
            }
            if (BULLETS.pool[q].y < 0 || BULLETS.pool[q].y > INI.GAME_HEIGHT) {
                BULLETS.remove(q);
                continue;
            }
        }
    },
    remove(x) {
        BULLETS.pool.splice(x, 1);
        return;
    },
    collisionToBackground() {
        var LN = BULLETS.pool.length;
        if (LN === 0)
            return;
        var HTB;
        for (var q = LN - 1; q >= 0; q--) {
            var blt = new ACTOR(
                "bullet",
                BULLETS.pool[q].x,
                BULLETS.pool[q].y,
                0,
                BULLETS.pool[q].prevX,
                BULLETS.pool[q].prevY
            );
            HTB = ENGINE.collisionToBackground(blt, LAYER.world);
            if (HTB) {
                BULLETS.remove(q);
            }
        }
    },
    draw() {
        var LN = BULLETS.pool.length;
        for (var q = LN - 1; q >= 0; q--) {
            ENGINE.spriteDraw(
                "bullets",
                BULLETS.pool[q].x,
                BULLETS.pool[q].y,
                SPRITE.bullet
            );
        }
    }
};

const BACKGROUND = {
    black() {
        const CTX = LAYER.background;
        CTX.fillStyle = "#000";
        CTX.fillRect(0, 0, ENGINE.gameWIDTH, INI.GAME_HEIGHT);
    },
    sky() {
        const CTX = LAYER.background;
        const grad = CTX.createLinearGradient(0, 0, 0, INI.GAME_HEIGHT);
        grad.addColorStop("0", "#C7E7FB");
        grad.addColorStop("0.1", "#BAE2FB");
        grad.addColorStop("0.2", "#B3DFFB");
        grad.addColorStop("0.6", "#ABDCFB");
        grad.addColorStop("1.0", "#4CC4EC");
        CTX.fillStyle = grad;
        CTX.fillRect(0, 0, ENGINE.gameWIDTH, INI.GAME_HEIGHT);
    }
};

/*
var AnimationSPRITE = function (x, y, type, howmany) {
    this.x = x;
    this.y = y;
    this.pool = [];
    for (var i = 1; i <= howmany; i++) {
        this.pool.push(type + i);
    }
};
*/

/*
var ACTOR = function (sprite_class, x, y, angle, prevX, prevY) {
    this.class = sprite_class;
    this.x = x || 0;
    this.y = y || 0;
    this.angle = angle || 0;
    this.prevX = prevX || null;
    this.prevY = prevY || null;
    this.sprite = function (sprite_class) {
        var name = this.class + "_" + this.angle;
        return SPRITE[name];
    };
    this.refresh = function () {
        this.name = this.class + "_" + this.angle;
        this.width = SPRITE[this.name].width;
        this.height = SPRITE[this.name].height;
    };
    this.refresh();
};
*/


class Enemy {
    constructor(position) {
        this.position = position;
    }
}
/*
var ENEMY_ACTOR = function (
    sprite_class,
    x,
    y,
    angle,
    realX,
    realY,
    type,
    score,
    speed,
    shootSpeed,
    realLives,
    prevX,
    prevY
) {
    this.actor = new ACTOR(sprite_class, x, y, angle, prevX, prevY);
    this.realX = realX;
    this.realY = realY;
    this.type = type;
    this.score = score;
    this.speed = speed;
    this.shootSpeed = shootSpeed;
    this.realLives = realLives || 1;
    this.lives = realLives || 1;
    this.readyToShoot = false;

    if (type === "ship")
        this.readyToShoot = true;
    if (type === "plane") {
        this.hunts = true;
    } else {
        this.hunts = false;
    }
    if (type === "plane" || type === "zeppelin") {
        this.moves = true;
    } else {
        this.moves = false;
    }
    if (type === "plane" || type === "ship") {
        this.canShoot = true;
    } else {
        this.canShoot = false;
    }
};
*/

const ENEMY = {
    shoot() {
        if (PLANE.dead)
            return;
        var EPL = ENEMY.active.length;
        if (EPL === 0)
            return;
        for (var q = 0; q < EPL; q++) {
            if (ENEMY.active[q].canShoot) {
                if (ENEMY.active[q].readyToShoot) {
                    var x, y, vx, vy;
                    if (ENEMY.active[q].type === "plane") {
                        x =
                            ENEMY.active[q].actor.x -
                            Math.floor(ENEMY.active[q].actor.width / 2) -
                            1;
                        vx =
                            Math.floor(
                                INI.BULLET_SPEED * Math.cos(ENEMY.active[q].actor.angle * Math.PI / 180)
                            ) * -1;
                        vy =
                            Math.floor(
                                INI.BULLET_SPEED * Math.sin(ENEMY.active[q].actor.angle * Math.PI / 180)
                            ) * -1;
                        y = ENEMY.active[q].actor.y + vy;
                    } else if (ENEMY.active[q].type === "ship") {
                        x = ENEMY.active[q].actor.x - Math.round(ENEMY.active[q].actor.width / 3);
                        vx = Math.round(0.7 * INI.BULLET_SPEED) * -1;
                        vy = vx;
                        y = ENEMY.active[q].actor.y - Math.ceil(ENEMY.active[q].actor.height / 2);
                    }

                    BULLETS.pool.push(new BulletClass(x, y, vx, vy, 0));
                    ENEMY.active[q].canShoot = false;
                    setTimeout(
                        coolOff.bind(null, ENEMY.active[q]),
                        ENEMY.active[q].shootSpeed
                    );
                }
            }
        }

        function coolOff(EA) {
            EA.canShoot = true;
        }
    },
    init() {
        ENEMY.refreshIndex = 0;
        var EPL = ENEMY.pool.length;
        for (var q = 0; q < EPL; q++) {
            ENEMY.pool[q].actor.x = ENEMY.pool[q].realX;
            ENEMY.pool[q].actor.y = ENEMY.pool[q].realY;
            ENEMY.pool[q].lives = ENEMY.pool[q].realLives;
        }
    },
    pool: [],
    active: [],
    refreshIndex: 0,
    refresh() {
        var EPL = ENEMY.pool.length;
        var distance;
        while (ENEMY.refreshIndex < EPL) {
            distance =
                GAME.x +
                ENGINE.gameWIDTH +
                Math.floor(ENEMY.pool[ENEMY.refreshIndex].actor.width / 2) +
                1;
            if (distance >= ENEMY.pool[ENEMY.refreshIndex].realX) {
                ENEMY.pool[ENEMY.refreshIndex].actor.x =
                    ENEMY.pool[ENEMY.refreshIndex].realX - GAME.x;
                ENEMY.active.push(ENEMY.pool[ENEMY.refreshIndex]);
                ENEMY.refreshIndex++;
            } else
                break;
        }
    },
    draw() {
        var EAL = ENEMY.active.length;
        if (EAL === 0)
            return;
        for (var q = 0; q < EAL; q++) {
            ENEMY.active[q].actor.refresh();
            ENGINE.spriteDraw(
                "plane",
                ENEMY.active[q].actor.x,
                ENEMY.active[q].actor.y,
                SPRITE[ENEMY.active[q].actor.name]
            );
        }
    },
    move() {
        var EAL = ENEMY.active.length;
        if (EAL === 0)
            return;
        for (var q = EAL - 1; q >= 0; q--) {
            if (ENEMY.active[q].moves) {
                ENEMY.active[q].actor.prevX = ENEMY.active[q].actor.x;
                ENEMY.active[q].actor.prevY = ENEMY.active[q].actor.y;
                ENEMY.active[q].actor.x -= ENEMY.active[q].speed;
            } else {
                ENEMY.active[q].actor.x -= PLANE.speed;
            }
            if (
                ENEMY.active[q].actor.x + Math.floor(ENEMY.active[q].actor.width / 2) + 1 <
                0
            ) {
                ENEMY.remove(q);
                continue;
            }

            if (ENEMY.active[q].hunts) {
                if (ENEMY.active[q].actor.x > PLANE.x) {
                    var dx = ENEMY.active[q].actor.x - PLANE.x;
                    var dy = ENEMY.active[q].actor.y - PLANE.y;
                    var ang = Math.round(Math.atan(dy / dx) * 180 / Math.PI);
                    var corr = Math.round(ang / 5) * 5;
                    var realAng = ENEMY.active[q].actor.angle;
                    if (realAng > 20)
                        realAng -= 360;

                    if (corr < realAng) {
                        realAng -= 5;
                        ENEMY.active[q].readyToShoot = false;
                        if (realAng < -20)
                            realAng = -20;
                    } else if (corr > realAng) {
                        realAng += 5;
                        ENEMY.active[q].readyToShoot = false;
                        if (realAng > 20)
                            realAng = 20;
                    } else if (corr === realAng) {
                        ENEMY.active[q].readyToShoot = true;
                    }
                    if (realAng < 0)
                        realAng += 360;
                    ENEMY.active[q].actor.angle = realAng;
                    var changeY = PLANE.getDY(realAng);
                    ENEMY.active[q].actor.y -= changeY;
                } else {
                    ENEMY.active[q].actor.angle = 0;
                }
            }
        }
    },
    remove(q) {
        ENEMY.active.splice(q, 1);
        return;
    },
    die(q) {
        ENGINE.clearLayer("plane");
        EXPLOSIONS.pool.push(
            new AnimationSPRITE(
                ENEMY.active[q].actor.x,
                ENEMY.active[q].actor.y,
                "AlienExp",
                6
            )
        );
        ENEMY.remove(q);
    },
    collisionBomb() {
        var LN = BOMBS.pool.length;
        if (LN === 0)
            return;
        var ENL = ENEMY.active.length;
        if (ENL === 0)
            return;

        var HTB, blt;
        for (var q = LN - 1; q >= 0; q--) {
            blt = new ACTOR("bomb", BOMBS.pool[q].x, BOMBS.pool[q].y, 0);
            ENL = ENEMY.active.length;
            for (var w = ENL - 1; w >= 0; w--) {
                HTB = ENGINE.collision(ENEMY.active[w].actor, blt);
                if (HTB) {
                    EXPLOSIONS.pool.push(
                        new AnimationSPRITE(BOMBS.pool[q].x, BOMBS.pool[q].y, "AstExp", 12)
                    );
                    BOMBS.remove(q);
                    GAME.bombsHit++;
                    ENEMY.active[w].lives -= 5;
                    if (ENEMY.active[w].lives <= 0) {
                        GAME.score += ENEMY.active[w].score;
                        ENEMY.die(w);
                        break;
                    }
                }
            }
        }
    },
    collisionBullet() {
        var LN = BULLETS.pool.length;
        if (LN === 0)
            return;
        var ENL = ENEMY.active.length;
        if (ENL === 0)
            return;

        var HTB, blt;
        for (var q = LN - 1; q >= 0; q--) {
            blt = new ACTOR(
                "bullet",
                BULLETS.pool[q].x,
                BULLETS.pool[q].y,
                0,
                BULLETS.pool[q].prevX,
                BULLETS.pool[q].prevY
            );
            ENL = ENEMY.active.length;
            for (var w = ENL - 1; w >= 0; w--) {
                HTB = ENGINE.collision(ENEMY.active[w].actor, blt);
                if (HTB) {
                    BULLETS.remove(q);
                    GAME.shotsHit++;
                    ENEMY.active[w].lives--;
                    if (ENEMY.active[w].lives <= 0) {
                        GAME.score += ENEMY.active[w].score;
                        ENEMY.die(w);
                        break;
                    }
                }
            }
        }
    },
    collisionPlane() {
        if (PLANE.dead)
            return;
        var ENL = ENEMY.active.length;
        if (ENL === 0)
            return;
        var Plane = new ACTOR(PLANE.plane, PLANE.x, PLANE.y, PLANE.angle);
        var HTB;
        for (var w = ENL - 1; w >= 0; w--) {
            HTB = ENGINE.collision(Plane, ENEMY.active[w].actor);
            if (HTB) {
                PLANE.die();
                ENEMY.active[w].lives--;
                if (ENEMY.active[w].lives <= 0) {
                    GAME.score += ENEMY.active[w].score;
                    ENEMY.die(w);
                    break;
                }
            }
        }
    },
    collisionBackground() {
        var ENL = ENEMY.active.length;
        if (ENL === 0)
            return;
        var HTB;
        for (var w = ENL - 1; w >= 0; w--) {
            if (ENEMY.active[w].moves) {
                HTB = ENGINE.collisionToBackground(ENEMY.active[w].actor, LAYER.world);
                if (HTB) {
                    ENEMY.die(w);
                }
            }
        }
    }
};

/*const EXPLOSIONS = {
    pool: [],
    draw() {
        ENGINE.clearLayer("explosion");
        var PL = EXPLOSIONS.pool.length;
        if (PL === 0)
            return;
        for (var instance = PL - 1; instance >= 0; instance--) {
            var sprite = EXPLOSIONS.pool[instance].pool.shift();
            ENGINE.spriteDraw(
                "explosion",
                EXPLOSIONS.pool[instance].x,
                EXPLOSIONS.pool[instance].y,
                SPRITE[sprite]
            );
            EXPLOSIONS.pool[instance].x -= PLANE.speed;
            if (EXPLOSIONS.pool[instance].pool.length === 0) {
                EXPLOSIONS.pool.splice(instance, 1);
            }
        }
    }
};*/

const GAME = {
    setup() {
        console.info("GAME SETUP");
    },
    setDrawLevel(level) {
        let drawLevel = level % INI.LAST_LEVEL;
        if (drawLevel === 0) drawLevel = INI.LAST_LEVEL;
        GAME.drawLevel = drawLevel;
        console.log("..draw level", GAME.drawLevel);
        return;
    },
    start() {
        console.log("GAME started");
        if (AUDIO.Title) {
            AUDIO.Title.pause();
            AUDIO.Title.currentTime = 0;
        }
        $(ENGINE.topCanvas).off("mousemove", ENGINE.mouseOver);
        $(ENGINE.topCanvas).off("click", ENGINE.mouseClick);
        $(ENGINE.topCanvas).css("cursor", "");
        ENGINE.hideMouse();

        $("#pause").prop("disabled", false);
        $("#pause").off();
        GAME.paused = true;

        let GameRD = new RenderData("NGage", 48, "#DDD", "text", "#000", 2, 2, 2);
        ENGINE.TEXT.setRD(GameRD);
        ENGINE.watchVisibility(GAME.lostFocus);
        ENGINE.GAME.start(16);

        $(document).keyup(GAME.clearKey);
        GAME.level = 1;
        //GAME.level = 2;
        GAME.lives = 5;
        GAME.score = 0;
        GAME.extraLife = SCORE.extraLife.clone();


        /****************/
        if (DEBUG.CHEAT) {
            GAME.level = DEBUG.LEVEL;
            GAME.lives = DEBUG.lives;
        }
        /****************/

        GAME.setDrawLevel(GAME.level);
        GAME.fps = new FPS_short_term_measurement(300);

        PLANE.firstInit();

        GAME.levelStart();

        /*
        GAME.stopAnimation = false;
        
        GAME.ended = false;
        GAME.initLevel(GAME.level);
        GAME.frame = {};
        GAME.frame.start = null;
        GAME.firstFrameDraw();
        GAME.run();*/
    },
    prepareForRestart() {
        let clear = ["background", "text", "FPS", "button", "bottomText"];
        ENGINE.clearManylayers(clear);
    },
    levelStart() {
        console.info(" - start -", GAME.level);

        GAME.prepareForRestart();

        //
        ENGINE.GAME.ANIMATION.stop(); //DEBUG
        //



        GAME.initLevel(GAME.level);
    },
    stop() {
        GAME.stopAnimation = true;
        $(document).off("keyup", GAME.clearKey);
        $(document).off("keydown", GAME.checkKey);
        GAME.end();
    },
    over() {
        console.log("GAME OVER");
        ENGINE.clearLayer("text");
        TITLE.gameOver();
        GAME.ended = true;
    },
    end() {
        TITLE.render();
        SCORE.checkScore(GAME.score);
        SCORE.hiScore();
        TEXT.score();
        $("#startGame").removeClass("hidden");
    },
    move(lapsedTime) {
        console.info("PLANE.y", PLANE.y);
        const timeF = 1000 / lapsedTime;
        //console.log("move", lapsedTime);
        if (PLANE.landing) {
            PLANE.speed -= INI.ACCELERATION_FACTOR / timeF;
            if (!PLANE.clearForlanding) {
                PLANE.die();
                PLANE.landing = false;
                return;
            }
            if (PLANE.speed < 0) {
                PLANE.speed = 0;
                PLANE.landing = false;
                PLANE.landed = true;
                GAME.endLevel();
            }
        }

        if (GAME.rewind) {
            PLANE.speed -= 1;
            if (PLANE.speed < INI.REWIND_MAX) PLANE.speed = INI.REWIND_MAX;
            if (GAME.x <= 0) {
                GAME.x = 0;
                if (GAME.ended) {
                    GAME.stop();
                } else {
                    PLANE.dead = false;
                    GAME.rewind = false;
                    PLANE.init();
                    PLANE.position();
                    //ENEMY.active.clear();
                    //ENEMY.init();
                }
            }
        }
        if (PLANE.acceleration) {
            PLANE.speed += INI.ACCELERATION_FACTOR / timeF;
            if (PLANE.speed > INI.MAX_SPEED) {
                PLANE.speed = INI.MAX_SPEED;
                PLANE.acceleration = false;
            }
        }

        GAME.x += Math.floor(PLANE.speed);
        //console.log("GAME.x", GAME.x);

        /** debug */
        if (GAME.x > MAP[GAME.drawLevel].worldLength) {
            GAME.x = MAP[GAME.drawLevel].worldLength;
            GAME.stopAnimation = true;
            console.error("Stopped animation at ", GAME.x);
        }
        /** */

        if (PLANE.x + GAME.x >= MAP[GAME.drawLevel].airport.x1 && PLANE.x + GAME.x <= LEVELS[GAME.drawLevel].airport.x2) {
            PLANE.clearForlanding = true;
        } else PLANE.clearForlanding = false;


        PLANE.y -= PLANE.getDY(PLANE.angle); //from +  to -

        if (PLANE.y < PLANE.ZERO) {
            PLANE.y = PLANE.ZERO;
            PLANE.angle = 0;
        }
        if (PLANE.y > PLANE.TOP) {
            PLANE.y = PLANE.TOP;
            PLANE.angle = 0;
        }

        if (PLANE.speed === INI.MAX_SPEED && !PLANE.dead) GAME.score += 1;
    },
    run(lapsedTime) {
        if (ENGINE.GAME.stopAnimation) return;
        GAME.respond(lapsedTime);
        GAME.move(lapsedTime);
        GAME.frameDraw(lapsedTime);
    },
    /*run() {
        if (!GAME.frame.start)
            GAME.frame.start = Date.now();
        var current = Date.now();
        GAME.frame.delta = current - GAME.frame.start;
        if (GAME.frame.delta > INI.ANIMATION_INTERVAL) {
            GAME.respond();
            ENEMY.refresh();
            GAME.move();
            ENEMY.move();
            if (!DEBUG.invincible) ENEMY.shoot();
            BULLETS.move();
            BOMBS.move();
            PLANE.collisions();
            if (!DEBUG.invincible) PLANE.collisionBullet();
            ENEMY.collisionBullet();
            ENEMY.collisionBomb();
            if (!DEBUG.invincible) ENEMY.collisionPlane();
            ENEMY.collisionBackground();
            BULLETS.collisionToBackground();
            BOMBS.collisionToBackground();
            GAME.frameDraw();
            GAME.frame.start = null;
        }
        if (GAME.stopAnimation) {
            return;
        } else
            requestAnimationFrame(GAME.run);
    },*/
    firstFrameDraw() {
        TITLE.render();
        BACKGROUND.sky();
        DTP.paintVisible();
        PLANE.draw();
        TEXT.score();
    },
    frameDraw(lapsedTime) {
        ENGINE.clearLayerStack();
        DTP.paintVisible();
        PLANE.draw();
        TEXT.score();
        if (DEBUG.FPS) GAME.FPS(lapsedTime);


        /*LEVEL.paintVisible();
        EXPLOSIONS.draw();
        ENGINE.clearLayer("plane");
        PLANE.draw();
        ENEMY.draw();
        ENGINE.clearLayer("bullets");
        BULLETS.draw();
        BOMBS.draw();
        TEXT.score();*/
    },
    FPS(lapsedTime) {
        let CTX = LAYER.FPS;
        CTX.fillStyle = "black";
        ENGINE.clearLayer("FPS");
        let fps = 1000 / lapsedTime || 0;
        GAME.fps.update(fps);
        CTX.fillText(GAME.fps.getFps(), 5, 10);
    },
    endLevel() {
        console.log("Level ", GAME.level, " complete.");
        GAME.levelComplete = true;
        var y = 300;
        var fs = 24;
        TITLE.centeredText("Campaign " + GAME.level + " completed.", fs, y);
        y += 2 * fs;
        var AccCanon = GAME.shotsHit / GAME.shotsFired * 100 || 0;
        TITLE.centeredText("Accuracy canon: " + AccCanon.toFixed(1) + "%", fs, y);
        y += fs;
        var AccBomb = GAME.bombsHit / GAME.bombsDroped * 100 || 0;
        TITLE.centeredText("Accuracy bombs: " + AccBomb.toFixed(1) + "%", fs, y);
        y += 2 * fs;
        var bonus = Math.floor(INI.LEVEL_BONUS * AccCanon * AccBomb / 10000);
        GAME.score += bonus;
        TITLE.centeredText("Bonus score: " + bonus + " points", fs, y);
        y += 2 * fs;
        TITLE.centeredText("Press 'ENTER' to continue.", fs, y);
    },
    nextLevel() {
        GAME.level++;
        GAME.setDrawLevel(GAME.level);
        ENGINE.clearLayer("text");
        console.log("Ascending to level ", GAME.level);
        GAME.initLevel(GAME.level);
        PLANE.init();
    },
    async initLevel(level) {
        console.info("init level", level);
        GAME.levelComplete = false;
        GAME.shotsFired = 0;
        GAME.shotsHit = 0;
        GAME.bombsDroped = 0;
        GAME.bombsHit = 0;
        GAME.x = 0;

        await DTP.drawLevel(GAME.drawLevel, MAP, LAYER.level);
        if (DEBUG.show_hdata) DTP.debugPaint(GAME.drawLevel, MAP, LAYER.level);
        //ENEMY.pool.clear();
        //ENEMY.init();
        GAME.continueLevel(level);
    },
    continueLevel(level) {
        console.log("game continues on level", level, BITMAP.level);
        GAME.levelExecute(level);
    },
    levelExecute(level) {
        console.log("level", level, "executes");
        GAME.firstFrameDraw(); //

        setTimeout(function () {
            ENGINE.clearLayer("text");
        }, 5000);

        GAME.resume();

        const fs = 24;
        let GameRD = new RenderData("NGage", fs, "#DDD", "text", "#000", 2, 2, 2);
        ENGINE.TEXT.setRD(GameRD);

        ENGINE.TEXT.centeredText(`Campaign ${GAME.level}`, ENGINE.gameWIDTH, ENGINE.gameHEIGHT / 2);
        ENGINE.TEXT.centeredText(`Press ${"\u2192"} to start the engine`, ENGINE.gameWIDTH, ENGINE.gameHEIGHT / 2 + 1.2 * fs);

        let texts = [
            "Let's shoot some bastards!",
        ];
        SPEECH.use('Princess');
        SPEECH.speak(texts.chooseRandom());
    },
    lostFocus() {
        if (GAME.paused || false) return;
        GAME.clickPause();
    },
    clickPause() {
        if (false || GAME.levelCompleted) return;
        $("#pause").trigger("click");
        ENGINE.GAME.keymap[ENGINE.KEY.map.F4] = false;
    },
    pause() {
        if (GAME.paused) return;
        if (GAME.levelFinished) return;
        if (PLANE.dead) return;
        console.log("%cGAME paused.", PRG.CSS);
        let GameRD = new RenderData("NGage", 48, "#DDD", "text", "#000", 2, 2, 2);
        ENGINE.TEXT.setRD(GameRD);
        $("#pause").prop("value", "Resume Game [F4]");
        $("#pause").off("click", GAME.pause);
        $("#pause").on("click", GAME.resume);
        ENGINE.GAME.ANIMATION.next(ENGINE.KEY.waitFor.bind(null, GAME.clickPause, "F4"));
        ENGINE.TEXT.centeredText("Game Paused", ENGINE.gameWIDTH, ENGINE.gameHEIGHT / 2);
        GAME.paused = true;
    },
    resume() {
        console.log("%cGAME resumed.", PRG.CSS);
        $("#pause").prop("value", "Pause Game [F4]");
        $("#pause").off("click", GAME.resume);
        $("#pause").on("click", GAME.pause);
        ENGINE.clearLayer("text");
        ENGINE.GAME.ANIMATION.resetTimer();
        ENGINE.GAME.ANIMATION.next(GAME.run);
        GAME.paused = false;
    },
    respond(lapsedTime) {
        if (PLANE.dead) return;
        const map = ENGINE.GAME.keymap;

        if (map[ENGINE.KEY.map.F4]) {
            $("#pause").trigger("click");
            map[ENGINE.KEY.map.F4] = false;
        }


        if (map[ENGINE.KEY.map.right]) {
            PLANE.lateral(RIGHT, lapsedTime);
        }
        if (map[ENGINE.KEY.map.left]) {
            PLANE.lateral(LEFT, lapsedTime);
        }
        if (map[ENGINE.KEY.map.up]) {
            PLANE.move(UP, lapsedTime);
        }
        if (map[ENGINE.KEY.map.down]) {
            PLANE.move(DOWN, lapsedTime);
        }


        return;
        /*
        var map = GAME.keymap;

        if (map[17]) {
            PLANE.shoot();
        }
        if (map[32]) {
            PLANE.dropBomb();
        }

        if (map[13] && GAME.levelComplete) {
            GAME.nextLevel();
            return;
        }
        return;
        */
    },

    setTitle() {
        const text = GAME.generateTitleText();
        const RD = new RenderData("Annie", 16, "#0E0", "bottomText");
        const SQ = new RectArea(0, 0, LAYER.bottomText.canvas.width, LAYER.bottomText.canvas.height);
        GAME.movingText = new MovingText(text, 4, RD, SQ);
    },
    generateTitleText() {
        let text = `${PRG.NAME} ${PRG.VERSION
            }, a game by Lovro Selič, ${"\u00A9"} LaughingSkull ${PRG.YEAR
            }. 
             
            Music: 'Immaculate Deception' written and performed by LaughingSkull, ${"\u00A9"
            } 2017 Lovro Selič. `;
        text += "     ENGINE, .... and GAME code by Lovro Selič using JavaScript. ";
        text += "     Remastered and ported to ENGINE v4 in 2024. ";
        text = text.split("").join(String.fromCharCode(8202));
        return text;
    },
    runTitle() {
        if (ENGINE.GAME.stopAnimation) return;
        GAME.movingText.process();
        GAME.titleFrameDraw();
    },
    titleFrameDraw() {
        GAME.movingText.draw();
    },
};

const TEXT = {
    clearSign(x, y, w, h) {
        var CTX = LAYER.sign;
        CTX.clearRect(x, y, w, h);
    },
    score() {
        var EL = GAME.extraLife[0];
        if (GAME.score >= EL) {
            GAME.lives++;
            GAME.extraLife.shift();
        }
        var CTX = LAYER.sign;
        var x = 60;
        var y = 24;
        TEXT.clearSign(x, 0, ENGINE.gameWIDTH - x, y + 8);
        CTX.color = "#000000";
        CTX.fillStyle = "#000000";
        CTX.font = "18px Consolas";
        //CTX.font = "14px Emulogic";
        CTX.shadowColor = "#666";
        CTX.shadowOffsetX = 1;
        CTX.shadowOffsetY = 1;
        CTX.shadowBlur = 1;
        var score = GAME.score.toString().padStart(8, "0");
        CTX.fillText("SCORE: " + score, x, y);
        x += 250;
        CTX.fillText("PLANES: " + GAME.lives.toString().padStart(2, "0"), x, y);
        x += 250;
        CTX.fillText("CAMPAIGN: " + GAME.level.toString().padStart(2, "0"), x, y);
        x += 300;
        var index = SCORE.SCORE.name[0].indexOf("&nbsp");
        var HS;
        if (index > 0) {
            HS = SCORE.SCORE.name[0].substring(0, SCORE.SCORE.name[0].indexOf("&nbsp"));
        } else {
            HS = SCORE.SCORE.name[0];
        }
        CTX.fillText("HISCORE: " + SCORE.SCORE.value[0] + " by " + HS, x, y);
    }
};
const TITLE = {
    startTitle() {
        console.log("Start title");
        if (AUDIO.Title) this.music();
        this.render();
        BACKGROUND.black();
        ENGINE.draw("background", (ENGINE.gameWIDTH - TEXTURE.Title.width) / 2, (ENGINE.gameHEIGHT - TEXTURE.Title.height) / 2, TEXTURE.Title);
        ENGINE.topCanvas = ENGINE.getCanvasName("ROOM");
        TITLE.drawButtons();
        $("#DOWN")[0].scrollIntoView();
        GAME.setTitle();
        ENGINE.GAME.start(16);
        ENGINE.GAME.ANIMATION.next(GAME.runTitle);
    },
    render() {
        TITLE.background();
        TITLE.title();
    },
    bigText(text, fs) {
        var x = ENGINE.gameWIDTH / 2;
        var y = INI.GAME_HEIGHT / 2;
        TITLE.text(text, fs, x, y);
        return y;
    },
    centeredText(text, fs, y) {
        var x = ENGINE.gameWIDTH / 2;
        TITLE.text(text, fs, x, y);
    },
    text(text, fs, x, y) {
        var CTX = LAYER.text;
        CTX.fillStyle = "#FFF";
        CTX.font = fs + "px Consolas";
        //CTX.font = fs + "px Arcade";
        CTX.shadowColor = "#000";
        CTX.shadowOffsetX = 2;
        CTX.shadowOffsetY = 2;
        CTX.shadowBlur = 1;
        CTX.textAlign = "center";
        CTX.fillText(text, x, y);
    },
    gameOver() {
        TITLE.bigText("GAME OVER", 120);
    },
    makeGrad(CTX, x, y, w, h) {
        let grad = CTX.createLinearGradient(x, y, w, h);
        grad.addColorStop("0", "#DDD");
        grad.addColorStop("0.1", "#EEE");
        grad.addColorStop("0.2", "#DDD");
        grad.addColorStop("0.3", "#AAA");
        grad.addColorStop("0.4", "#999");
        grad.addColorStop("0.5", "#666");
        grad.addColorStop("0.6", "#555");
        grad.addColorStop("0.7", "#777");
        grad.addColorStop("0.8", "#AAA");
        grad.addColorStop("0.9", "#CCC");
        grad.addColorStop("1", "#EEE");
        return grad;
    },

    title() {
        const CTX = LAYER.title;
        const fs = 44;
        CTX.font = fs + "px NGage";
        CTX.shadowColor = "#ff3300";
        CTX.shadowOffsetX = 1;
        CTX.shadowOffsetY = 1;
        CTX.shadowBlur = 2;
        let mtxt = CTX.measureText(PRG.NAME);
        let x = 30;
        let y = 56;
        const grad = this.makeGrad(CTX, x, y, x + mtxt.width, y - fs);
        CTX.fillStyle = grad;
        CTX.fillText(PRG.NAME, x, y);

        //
        CTX.fillStyle = "#EEE";
        CTX.shadowColor = "#CCC";
        CTX.font = "12px Consolas";
        CTX.shadowOffsetX = 1;
        CTX.shadowOffsetY = 1;
        CTX.shadowBlur = 1;
        y = 32;
        x = 970;
        CTX.fillText("Version " + PRG.VERSION, x, y);
        y = 48;
        CTX.fillText("by Lovro Selič", x, y);
        y = 48;
        x = 1100;
        CTX.font = "14px Consolas";
        CTX.fillText(String.fromCharCode(169) + " LaughingSkull 2018", x, y);
    },
    background() {
        let CTX = LAYER.title;
        CTX.fillStyle = "#000";
        CTX.roundRect(0, 0, ENGINE.gameWIDTH, ENGINE.titleHEIGHT, { upperLeft: 10, upperRight: 10, lowerLeft: 0, lowerRight: 0 }, true, true);
        CTX = LAYER.bottom;
        CTX.fillStyle = "#000";
        CTX.roundRect(0, 0, ENGINE.gameWIDTH, ENGINE.bottomHEIGHT, { upperLeft: 0, upperRight: 0, lowerLeft: 10, lowerRight: 10 }, true, true);
    },
    drawButtons() {
        ENGINE.clearLayer("button");
        FORM.BUTTON.POOL.clear();
        const w = 166;
        const h = 24;
        let x = (((ENGINE.gameWIDTH - TEXTURE.Title.width) / 2) - w) / 2;
        let y = ENGINE.gameHEIGHT - (3 * h);

        let startBA = new Area(x, y, w, h);
        const buttonColors = new ColorInfo("#F00", "#A00", "#222", "#666", 13);
        const musicColors = new ColorInfo("#0E0", "#090", "#222", "#666", 13);
        FORM.BUTTON.POOL.push(new Button("Start game", startBA, buttonColors, GAME.start));
        y += 1.8 * h;
        let music = new Area(x, y, w, h);
        FORM.BUTTON.POOL.push(new Button("Play title music", music, musicColors, TITLE.music));
        FORM.BUTTON.draw();
        $(ENGINE.topCanvas).on("mousemove", { layer: ENGINE.topCanvas }, ENGINE.mouseOver);
        $(ENGINE.topCanvas).on("click", { layer: ENGINE.topCanvas }, ENGINE.mouseClick);
    },
    music() {
        AUDIO.Title.play();
    },
};

// -- main --
$(function () {
    SPEECH.init();
    PRG.INIT();
    PRG.setup();
    ENGINE.LOAD.preload();
    SCORE.init("SC", "ScramblyX", 10, 10000);
    SCORE.extraLife = [50000, 100000, 200000, 500000, 1000000, 10000000];
    SCORE.loadHS();
    SCORE.hiScore();
});