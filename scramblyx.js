/////////////////////////////////////////////////
/*
 to do:
 known bugs: 
 - shoot over top of the mountain 
 
 */
/////////////debug vars: remove all in production/////////////////////
var DEBUG = {};
//DEBUG.CHEAT = true;
//DEBUG.debug = true;
//DEBUG.invincible = true;
DEBUG.invincible = false;
DEBUG.LEVEL = 5;
DEBUG.lives = 5;
//DEBUG.debug = false;
////////////////////////////////////////////////////

var PRG = {
    VERSION: "1.00",
    NAME: "ScramblyX",
    INIT: function () {
        console.clear();
        console.log(
                PRG.NAME +
                " " +
                PRG.VERSION +
                " by Lovro Selic, (c) C00lSch00l 2018 on " +
                navigator.userAgent
                );
        $("#title").html(PRG.NAME);
        $("#version").html(
                PRG.NAME +
                " V" +
                PRG.VERSION +
                " by Lovro Selič <span style='font-size:14px'>&copy</span> C00lSch00l 2018"
                );
        $("input#toggleAbout").val("About " + PRG.NAME);
        $("#about fieldset legend").append(" " + PRG.NAME + " ");
        $("#load").append(
                "<canvas id ='preload_canvas' width='" +
                ENGINE.LOAD_W +
                "' height='" +
                ENGINE.LOAD_H +
                "'></canvas>"
                );
        ENGINE.ctx = $("#preload_canvas")[0].getContext("2d");
        ENGINE.gameWIDTH = 1280;
        ENGINE.init();
        ENGINE.checkIntersection = true;
        $(ENGINE.gameWindowId).width(ENGINE.gameWIDTH + 4);
        ENGINE.addBOX("LEVEL", INI.GAME_HEIGHT, 1, ["level"]);
        ENGINE.addBOX("TITLE", INI.TITLE_HEIGHT, 1, ["title"]);
        ENGINE.addBOX("ROOM", INI.GAME_HEIGHT, 8, [
            "background",
            "world",
            "plane",
            "bullets",
            "explosion",
            "text",
            "sign",
            "debug"
        ]);

        $("#LEVEL").addClass("hidden");
        LAYER.level.canvas.width = INI.LEVEL_WIDTH;
    },
    setup: function () {
        $("#toggleHelp").click(function () {
            $("#help").toggle(400);
        });
        $("#toggleAbout").click(function () {
            $("#about").toggle(400);
        });
    },
    start: function () {
        console.log(PRG.NAME + " started.");
        $("#startGame").addClass("hidden");

        $(document).keypress(function (event) {
            if (event.which === 32 || event.which === 13) {
                event.preventDefault();
            }
        });

        PATTERN.create("grass", Grass);
        PATTERN.create("sea", Sea);
        PATTERN.create("sand", Sand);
        GAME.start();
    }
};

///////////////////////////////////////////////////////////////////
var PLANE = {
    firstInit: function () {
        PLANE.plane = "spitfire";
        PLANE.init();
        PLANE.ZERO = INI.GAME_HEIGHT - INI.ZERO - Math.floor(PLANE.sprite.height / 2);
        PLANE.TOP = INI.ZERO + 12;
        PLANE.position();
    },
    position: function () {
        PLANE.y = PLANE.ZERO;
        PLANE.x = Math.floor(PLANE.sprite.width / 2) + INI.PLANE_LEFT;
        PLANE.angle = 0;
    },
    init: function () {
        PLANE.sprite = SPRITE[PLANE.plane];
        PLANE.speed = 0;
        PLANE.airborne = false;
        PLANE.landed = true;
        PLANE.landing = false;
        PLANE.acceleration = false;
        PLANE.x = Math.floor(PLANE.sprite.width / 2) + INI.PLANE_LEFT;
    },
    draw: function () {
        if (PLANE.dead)
            return;
        PLANE.sprite = SPRITE[PLANE.plane + "_" + PLANE.angle];
        ENGINE.spriteDraw("plane", PLANE.x, PLANE.y, PLANE.sprite);
    },
    move: function (smer) {
        if (PLANE.landing)
            return;
        if (PLANE.speed < INI.MAX_SPEED && GAME.keymap[38])
            return;
        if (PLANE.landed && GAME.keymap[40])
            return;
        if (PLANE.landed && GAME.keymap[38]) {
            PLANE.landed = false;
            PLANE.airborne = true;
            PLANE.y -= 2;
            PLANE.bulletReady = true;
            PLANE.bombReady = true;
        }
        GAME.keymap[38] = false;
        GAME.keymap[40] = false;
        PLANE.angle = PLANE.angle + smer.y * 5;
        if (PLANE.angle < 0)
            PLANE.angle += 360;
        if (PLANE.angle === 360)
            PLANE.angle = 0;
        if (PLANE.angle > 30 && PLANE.angle < 320)
            PLANE.angle = 30;
        else if (PLANE.angle < 330 && PLANE.angle > 40)
            PLANE.angle = 330;
    },
    lateral: function (smer) {
        if (PLANE.landing)
            return;
        if (
                PLANE.speed < INI.MAX_SPEED &&
                !PLANE.acceleration &&
                !GAME.levelComplete
                ) {
            PLANE.acceleration = true;
            PLANE.speed = 1;
        }
        if (PLANE.landed)
            return;
        PLANE.x += smer.x * INI.MOVE;
        if (PLANE.x < INI.PLANE_LEFT)
            PLANE.x = INI.PLANE_LEFT;
        if (PLANE.x > INI.PLANE_RIGHT)
            PLANE.x = INI.PLANE_RIGHT;
    },
    collisions: function () {
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
    },
    collisionBullet: function () {
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
    },
    die: function () {
        PLANE.dead = true;
        GAME.rewind = true;
        ENGINE.clearLayer("plane");
        EXPLOSIONS.pool.push(new AnimationSPRITE(PLANE.x, PLANE.y, "ShipExp", 8));
        GAME.lives--;
        if (GAME.lives <= 0)
            GAME.over();
    },
    shoot: function () {
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
        var vy1 = PLANE.getY(PLANE.angle);
        var vy = vy1 + vy2;
        var y = PLANE.y + vy;
        BULLETS.pool.push(new BulletClass(x, y, vx, vy, 0));
        GAME.shotsFired++;
        setTimeout(function () {
            PLANE.bulletReady = true;
        }, INI.BULLET_TIMEOUT);
    },
    getY: function (angle) {
        var smer;
        if (angle > 30) {
            smer = -1;
            angle = 360 - angle;
        } else
            smer = 1;
        return Math.floor(smer * (angle / 5));
    },
    dropBomb: function () {
        if (PLANE.dead)
            return;
        if (!PLANE.airborne)
            return;
        if (!PLANE.bombReady)
            return;
        PLANE.bombReady = false;

        var x = PLANE.x + Math.floor(PLANE.sprite.width * 0.6);
        var vx = Math.floor(PLANE.speed * Math.cos(PLANE.angle * Math.PI / 180));
        var vy2 = Math.floor(PLANE.speed * Math.sin(PLANE.angle * Math.PI / 180));
        var vy1 = PLANE.getY(PLANE.angle);
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

var BOMBS = {
    pool: [],
    move: function () {
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
    remove: function (x) {
        BOMBS.pool.splice(x, 1);
        return;
    },
    draw: function () {
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
    collisionToBackground: function () {
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
var BULLETS = {
    pool: [],
    move: function () {
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
    remove: function (x) {
        BULLETS.pool.splice(x, 1);
        return;
    },
    collisionToBackground: function () {
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
    draw: function () {
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

var BACKGROUND = {
    black: function () {
        var CTX = LAYER.background;
        CTX.fillStyle = "#000";
        CTX.fillRect(0, 0, ENGINE.gameWIDTH, INI.GAME_HEIGHT);
    },
    sky: function () {
        var CTX = LAYER.background;
        var grad = CTX.createLinearGradient(0, 0, 0, INI.GAME_HEIGHT);
        grad.addColorStop("0", "#C7E7FB");
        grad.addColorStop("0.1", "#BAE2FB");
        grad.addColorStop("0.2", "#B3DFFB");
        grad.addColorStop("0.6", "#ABDCFB");
        grad.addColorStop("1.0", "#4CC4EC");
        CTX.fillStyle = grad;
        CTX.fillRect(0, 0, ENGINE.gameWIDTH, INI.GAME_HEIGHT);
    }
};

var AnimationSPRITE = function (x, y, type, howmany) {
    this.x = x;
    this.y = y;
    this.pool = [];
    for (var i = 1; i <= howmany; i++) {
        this.pool.push(type + i);
    }
};
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

var ENEMY = {
    shoot: function () {
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
    init: function () {
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
    refresh: function () {
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
    draw: function () {
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
    move: function () {
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
                    var changeY = PLANE.getY(realAng);
                    ENEMY.active[q].actor.y -= changeY;
                } else {
                    ENEMY.active[q].actor.angle = 0;
                }
            }
        }
    },
    remove: function (q) {
        ENEMY.active.splice(q, 1);
        return;
    },
    die: function (q) {
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
    collisionBomb: function () {
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
    collisionBullet: function () {
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
    collisionPlane: function () {
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
    collisionBackground: function () {
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

var EXPLOSIONS = {
    pool: [],
    draw: function () {
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
};

var GAME = {
    keymap: {
        17: false,
        37: false,
        38: false,
        39: false,
        40: false,
        32: false,
        13: false,
        120: false
    },
    setDrawLevel: function (level) {
        var drawLevel = level % INI.LAST_LEVEL;
        if (drawLevel === 0)
            drawLevel = INI.LAST_LEVEL;
        GAME.drawLevel = drawLevel;
        return;
    },
    start: function () {
        $("#bottom")[0].scrollIntoView();
        $(document).keydown(GAME.checkKey);
        $(document).keyup(GAME.clearKey);
        GAME.level = 1;
        GAME.lives = 5;
        GAME.extraLife = SCORE.extraLife.clone();

        /****************/
        if (DEBUG.CHEAT) {
            GAME.level = DEBUG.LEVEL;
            GAME.lives = DEBUG.lives;
        }
        /****************/

        GAME.setDrawLevel(GAME.level);
        GAME.score = 0;
        GAME.extraLife = SCORE.extraLife.clone();
        GAME.stopAnimation = false;
        PLANE.firstInit();
        GAME.ended = false;
        GAME.initLevel(GAME.level);
        GAME.frame = {};
        GAME.frame.start = null;
        GAME.firstFrameDraw();
        GAME.run();
    },
    stop: function () {
        GAME.stopAnimation = true;
        $(document).off("keyup", GAME.clearKey);
        $(document).off("keydown", GAME.checkKey);
        GAME.end();
    },
    over: function () {
        console.log("GAME OVER");
        ENGINE.clearLayer("text");
        TITLE.gameOver();
        GAME.ended = true;
    },
    end: function () {
        TITLE.render();
        SCORE.checkScore(GAME.score);
        SCORE.hiScore();
        TEXT.score();
        $("#startGame").removeClass("hidden");
    },
    move: function () {
        if (PLANE.landing) {
            PLANE.speed -= 0.1;
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
            if (PLANE.speed < INI.REWIND_MAX)
                PLANE.speed = INI.REWIND_MAX;
            if (GAME.x <= 0) {
                GAME.x = 0;
                if (GAME.ended) {
                    GAME.stop();
                } else {
                    PLANE.dead = false;
                    GAME.rewind = false;
                    PLANE.init();
                    PLANE.position();
                    ENEMY.active.clear();
                    ENEMY.init();
                }
            }
        }
        if (PLANE.acceleration) {
            PLANE.speed += 0.1;
            if (PLANE.speed > INI.MAX_SPEED) {
                PLANE.speed = INI.MAX_SPEED;
                PLANE.acceleration = false;
            }
        }
        GAME.x += Math.floor(PLANE.speed);
        if (GAME.x > LEVELS[GAME.drawLevel].worldLength) {
            GAME.x = LEVELS[GAME.drawLevel].worldLength;
            GAME.stopAnimation = true;
            //console.log("Stopped animation at ", GAME.x);
        }
        if (
                PLANE.x + GAME.x >= LEVELS[GAME.drawLevel].airport.x1 &&
                PLANE.x + GAME.x <= LEVELS[GAME.drawLevel].airport.x2
                ) {
            PLANE.clearForlanding = true;
        } else
            PLANE.clearForlanding = false;

        PLANE.y += PLANE.getY(PLANE.angle);
        if (PLANE.y > PLANE.ZERO) {
            PLANE.y = PLANE.ZERO;
            PLANE.angle = 0;
        }
        if (PLANE.y < PLANE.TOP) {
            PLANE.y = PLANE.TOP;
            PLANE.angle = 0;
        }

        if (PLANE.speed === INI.MAX_SPEED && !PLANE.dead)
            GAME.score += 1;
    },
    run: function () {
        if (!GAME.frame.start)
            GAME.frame.start = Date.now();
        var current = Date.now();
        GAME.frame.delta = current - GAME.frame.start;
        if (GAME.frame.delta > INI.ANIMATION_INTERVAL) {
            GAME.respond();
            ENEMY.refresh();
            GAME.move();
            ENEMY.move();
            if (!DEBUG.invincible)
                ENEMY.shoot();
            BULLETS.move();
            BOMBS.move();
            PLANE.collisions();
            if (!DEBUG.invincible)
                PLANE.collisionBullet();
            ENEMY.collisionBullet();
            ENEMY.collisionBomb();
            if (!DEBUG.invincible)
                ENEMY.collisionPlane();
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
    },
    firstFrameDraw: function () {
        TITLE.render();
        BACKGROUND.sky();
        PLANE.draw();
        LEVEL.paintVisible();
        TEXT.score();
    },
    frameDraw: function () {
        LEVEL.paintVisible();
        EXPLOSIONS.draw();
        ENGINE.clearLayer("plane");
        PLANE.draw();
        ENEMY.draw();
        ENGINE.clearLayer("bullets");
        BULLETS.draw();
        BOMBS.draw();
        TEXT.score();
    },
    endLevel: function () {
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
    nextLevel: function () {
        GAME.level++;
        GAME.setDrawLevel(GAME.level);
        ENGINE.clearLayer("text");
        console.log("Ascending to level ", GAME.level);
        GAME.initLevel(GAME.level);
        PLANE.init();
    },
    initLevel: function (level) {
        GAME.levelComplete = false;
        GAME.shotsFired = 0;
        GAME.shotsHit = 0;
        GAME.bombsDroped = 0;
        GAME.bombsHit = 0;
        GAME.x = 0;
        ENEMY.pool.clear();
        LEVEL.draw(GAME.drawLevel);
        ENEMY.init();
        ENGINE.clearLayer("text");
        var fs = 24;
        var y = TITLE.bigText("Campaign " + GAME.level + ".", fs);
        y += 2 * fs;
        TITLE.centeredText("Press 'cursor right: ->' to start the engine.", fs, y);
        setTimeout(function () {
            ENGINE.clearLayer("text");
        }, 5000);
    },
    respond: function () {
        var map = GAME.keymap;
        if (map[120]) {
            console.log("GAME.x:", GAME.x);
            console.log("plane.y", PLANE.y);
        }
        if (map[17]) {
            PLANE.shoot();
        }
        if (map[32]) {
            PLANE.dropBomb();
        }
        if (map[37]) {
            PLANE.lateral(LEFT);
        }
        if (map[39]) {
            PLANE.lateral(RIGHT);
        }
        if (map[38]) {
            PLANE.move(UP);
        }
        if (map[40]) {
            PLANE.move(DOWN);
        }
        if (map[13] && GAME.levelComplete) {
            GAME.nextLevel();
            return;
        }
        return;
    },
    clearKey: function (e) {
        e = e || window.event;
        if (e.keyCode in GAME.keymap) {
            GAME.keymap[e.keyCode] = false;
        }
    },
    checkKey: function (e) {
        e = e || window.event;
        if (e.keyCode in GAME.keymap) {
            GAME.keymap[e.keyCode] = true;
            e.preventDefault();
        }
    }
};

var TEXT = {
    clearSign: function (x, y, w, h) {
        var CTX = LAYER.sign;
        CTX.clearRect(x, y, w, h);
    },
    score: function () {
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
        var score = GAME.score.toString().padLeft(8, "0");
        CTX.fillText("SCORE: " + score, x, y);
        x += 250;
        CTX.fillText("PLANES: " + GAME.lives.toString().padLeft(2, "0"), x, y);
        x += 250;
        CTX.fillText("CAMPAIGN: " + GAME.level.toString().padLeft(2, "0"), x, y);
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
var TITLE = {
    render: function () {
        TITLE.background();
        TITLE.title();
    },
    bigText: function (text, fs) {
        var x = ENGINE.gameWIDTH / 2;
        var y = INI.GAME_HEIGHT / 2;
        TITLE.text(text, fs, x, y);
        return y;
    },
    centeredText: function (text, fs, y) {
        var x = ENGINE.gameWIDTH / 2;
        TITLE.text(text, fs, x, y);
    },
    text: function (text, fs, x, y) {
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
    gameOver: function () {
        TITLE.bigText("GAME OVER", 120);
    },
    title: function () {
        var CTX = LAYER.title;
        var grad = CTX.createLinearGradient(8, 100, 128, 128);
        grad.addColorStop("0", "#ff0000");
        grad.addColorStop("0.2", "#cc0000");
        grad.addColorStop("0.5", "#bb0000");
        grad.addColorStop("0.8", "#090000");
        grad.addColorStop("1.0", "#e60000");
        CTX.fillStyle = grad;
        //CTX.font = "40px Consolas";
        CTX.font = "44px Arcade";
        CTX.shadowColor = "#ff3300";
        CTX.shadowOffsetX = 1;
        CTX.shadowOffsetY = 1;
        CTX.shadowBlur = 2;
        var x = 30;
        var y = 56;
        CTX.fillText(PRG.NAME, x, y);
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
        CTX.fillText(String.fromCharCode(169) + " C00lSch00l 2018", x, y);
    },
    background: function () {
        var CTX = LAYER.title;
        CTX.fillStyle = "#000";
        CTX.roundRect(
                0,
                0,
                ENGINE.gameWIDTH,
                INI.TITLE_HEIGHT,
                {
                    upperLeft: 10,
                    upperRight: 10,
                    lowerLeft: 10,
                    lowerRight: 10
                },
                true,
                true
                );
    }
};

$(document).ready(function () {
    PRG.INIT();
    PRG.setup();
    ENGINE.preLoadImages();
    SCORE.init("SC", "ScramblyX", 10, 10000);
    SCORE.extraLife = [50000, 100000, 200000, 500000, 1000000, 10000000];
    SCORE.loadHS();
    SCORE.hiScore();
});
