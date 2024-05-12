/*jshint browser: true */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W061 */
"use strict";

class PlaneLimits {
    constructor(width = null, wawelength = 64, drawMaxHeight = null, drawMinHeight = null, open = false, leftStop = 0, rightStop = null) {
        if (width === null || drawMaxHeight === null || drawMinHeight === null) {
            console.log(arguments);
            throw "PlaneLimits: Required arguments not provided!";
        }
        this.width = width;
        this.leftStop = leftStop;
        this.rightStop = rightStop || this.width - 16;
        this.open = open;
        this.WL = wawelength;
        this.drawMaxHeight = Math.floor(drawMaxHeight);
        this.drawMinHeight = Math.floor(drawMinHeight);
        this.mid = Math.floor((this.drawMaxHeight + this.drawMinHeight) / 2);
        this.amp = this.drawMaxHeight - this.drawMinHeight;
    }
}
class Plane {
    constructor(map = null, planeLimits = null, layer = null, texture = null, speedFactor = null, color = "#000") {
        if (map === null || layer === null || texture === null || speedFactor === null) {
            console.log(arguments);
            throw "Plane constructor: Required arguments not provided!";
        }
        this.DATA = {};
        this.DATA.map = map;
        this.layer = layer;
        this.CTX = LAYER[this.layer];
        this.planeLimits = planeLimits;
        this.texture = texture;
        this.speedFactor = speedFactor;
        this.color = color;
        this.position = 0.0;
    }
    getPosition() {
        return Math.round(this.position);
    }
    getLastMovement() {
        return this.moved;
    }
    move(timeLapse, speed, dir) {
        this.moved = dir * (timeLapse * speed * this.speedFactor / 1000);
        this.position += this.moved;
    }
}
class Parallax {
    constructor(planes) {
        this.planes = planes;
    }
    movePlanes(timeLapse, speed, dir = 1) {
        for (let pl of this.planes) {
            pl.move(timeLapse, speed, dir);
        }
    }
}
class PSNG {
    constructor() {
        this.M = 4294967296;
        this.A = 1664525;
        this.C = 1;
        this.Z = Math.floor(Math.random() * this.M);
    }
    next() {
        this.Z = (this.A * this.Z + this.C) % this.M;
        return this.Z / this.M - 0.5;
    }
}
class PerlinNoise {
    constructor(planeLimits, divisor = 1) {
        this.planeLimits = planeLimits;
        this.divisor = divisor;
        this.x = 0;
        this.psng = new PSNG();
        this.a = this.psng.next();
        this.b = this.psng.next();
        if (this.planeLimits.open) {
            this.a = 0.5;
            this.b = 0.5;
        }
        this.pos = [];
        while (this.x < this.planeLimits.width) {
            if (this.x % (this.planeLimits.WL / this.divisor) === 0) {
                this.a = this.b;
                if (this.planeLimits.open &&
                    (this.x < this.planeLimits.WL / this.divisor || this.planeLimits.width - this.x <= 2 * (this.planeLimits.WL / this.divisor))) {
                    this.b = 0.5;
                } else {
                    this.b = this.psng.next();
                }
                this.pos.push(this.a * this.planeLimits.amp / (this.divisor ** PERLIN.INI.divisor_exponent));
            } else {
                this.pos.push(this.interpolate() * this.planeLimits.amp / (this.divisor ** PERLIN.INI.divisor_exponent));
            }
            this.x++;
        }
    }
    interpolate() {
        let ft = Math.PI * ((this.x % (this.planeLimits.WL / this.divisor)) / (this.planeLimits.WL / this.divisor));
        let f = (1 - Math.cos(ft)) * 0.5;
        return this.a * (1 - f) + this.b * f;
    }
    smoothStep() {
        let t = (this.x % (this.planeLimits.WL / this.divisor)) / (this.planeLimits.WL / this.divisor);
        let f = 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3;
        return this.a * (1 - f) + this.b * f;
    }
    get() {
        return Uint16Array.from(this.pos.map(x => Math.round(x + this.planeLimits.mid)));
    }
}
const PERLIN = {
    INI: {
        divisor_base: 2,
        divisor_exponent: 2.1,
    },
    drawLine(plane, CTX = null) {
        CTX = CTX || plane.CTX;
        CTX.strokeStyle = plane.color;
        let data = plane.DATA.map;
        CTX.beginPath();
        CTX.moveTo(0, data[0]);
        for (let i = 1; i < data.length; i++) {
            CTX.lineTo(i, data[i]);
        }
        CTX.stroke();
    },
    drawShape(plane, from = 0, length = null, CTX = null) {
        CTX = CTX || plane.CTX;
        CTX.fillStyle = plane.color;
        this.draw(plane, CTX, from, length);
    },
    drawPattern(plane, from = 0, length = null, CTX = null) {
        CTX = CTX || plane.CTX;
        let pattern = CTX.createPattern(TEXTURE[plane.texture], 'repeat');
        CTX.fillStyle = pattern;
        this.draw(plane, CTX, from, length);
    },
    draw(plane, CTX, from, length) {
        let data = plane.DATA.map;
        length = length || data.length;
        CTX.beginPath();
        CTX.moveTo(0, data[from]);
        for (let i = 1; i < length; i++) {
            CTX.lineTo(i, data[from + i]);
        }
        CTX.lineTo(CTX.canvas.width, CTX.canvas.height);
        CTX.lineTo(0, CTX.canvas.height);
        CTX.lineTo(0, data[from]);
        CTX.closePath();
        CTX.fill();
    },
    generateNoise(planeLimits, octaves) {
        let results = [];
        for (let i = 0; i < octaves; i++) {
            let divisor = PERLIN.INI.divisor_base ** i;
            let perlin = new PerlinNoise(planeLimits, divisor);
            results.push(perlin.pos);
        }
        return results;
    },
    combineNoise(perlins) {
        let LN = perlins[0].length;
        let summed = [];
        for (let i = 0; i < LN; i++) {
            let total = 0;
            for (let j = 0; j < perlins.length; j++) {
                total += perlins[j][i];
            }
            summed.push(total);
        }
        return summed;
    },
    getNoise(planeLimits, octaves) {
        let noise = this.combineNoise(this.generateNoise(planeLimits, octaves));
        return Uint16Array.from(noise.map(x => x + planeLimits.mid));
    }
};
const TERRAIN = {
    VERSION: "1.01",
    CSS: "color: #2ACBE8",
    NAME: "TerrainGenerator 1D",
    INI: {
        planes: 3,
        planes_max: [0.95, 0.7, 0.5],
        planes_min: [0.5, 0.3, 0.15],
        speed_factor: [1.0, 0.25, 0.125],
        WL: [256, 96, 64],
        open: [true, false, false],
        octaves: [1, 4, 3]
    },
    createClassic(W, H, plane_layers, textures, colors) {
        //colors default
        if (!colors) {
            colors = ["#0E0", '#444', '#888'];
        }
        let planes = [];
        for (let i = 0; i < TERRAIN.INI.planes; i++) {
            let PL = new PlaneLimits(W, TERRAIN.INI.WL[i], TERRAIN.INI.planes_max[i] * H, TERRAIN.INI.planes_min[i] * H, TERRAIN.INI.open[0]);
            let Noise = PERLIN.getNoise(PL, TERRAIN.INI.octaves[i]);
            let plane = new Plane(Noise, PL, plane_layers[i], textures[i], TERRAIN.INI.speed_factor[i], colors[i]);
            planes.push(plane);
        }
        let px = new Parallax(planes);
        return px;
    },
    drawParallax(px) {
        for (let pl of px.planes) {
            PERLIN.drawShape(pl);
        }
    },
    drawParallaxSlice(px, W) {
        for (let pl of px.planes) {
            PERLIN.drawPattern(pl, pl.getPosition(), W);
        }
    },
    sampleMin(data, start, end, window) {
        let min = Infinity;
        let minIndex = -1;
        for (let index = start; index <= end; index += window) {
            if (data[index] < min) {
                min = data[index];
                minIndex = index;
            }
        }
        return [min, minIndex];
    }
};

/** Deterministic Terrain Parser */


const DTP = {
    x: null,
    y: null,
    heightData: null,
    resetHeight() {
        DTP.heightData = [];
    },
    INI: {
        NTREE: 8,
        NPALM: 5,
    },
    drawLevel(level, world, CTX) {
        console.log("************************************  draw level ************************************");
        const WL = world[level].worldLength
        CTX.canvas.width = WL;
        //console.log("WL", WL);
        DTP.x = 0;
        DTP.y = INI.GAME_HEIGHT - INI.ZERO;
        DTP.resetHeight();

        for (let q = 0; q < world[level].world.length; q++) {
            this.drawChunk(world[level].world[q], CTX, world[level].mainPattern, world[level]);
        }

        world[level].heightData = Uint16Array.from(DTP.heightData);
        //if (world[level].heightData.length !== WL) throw new Error("");
        if (world[level].heightData.length !== WL) console.error("Height data incomplete");;
        console.warn("MAP", world[level]);
        console.log("************************************  END draw level ************************************");
    },
    drawChunk(chunk, CTX, mainPattern, levelPointer) {
        //console.log("CHUNK", DTP.x, DTP.y, chunk);

        /** bottom rectangle */
        CTX.beginPath();
        CTX.moveTo(DTP.x, DTP.y);
        CTX.lineTo(DTP.x, INI.GAME_HEIGHT);
        CTX.lineTo(DTP.x + chunk.w, INI.GAME_HEIGHT);
        CTX.lineTo(DTP.x + chunk.w, INI.GAME_HEIGHT - chunk.y);

        /** top part */
        const dY = chunk.y - (INI.GAME_HEIGHT - DTP.y); // game coord
        var slope = dY / chunk.w;

        switch (chunk.type) {
            case "L":
                CTX.lineTo(DTP.x, DTP.y);
                for (let x = 0; x < chunk.w; x++) {
                    let height = Math.round(slope * x) + (INI.GAME_HEIGHT - DTP.y);
                    DTP.heightData.push(height);
                }

                break;
            case "Q":
                let cpx = Math.floor(DTP.x + chunk.cp.x * chunk.w / 100);
                let CY;
                if (chunk.cp.f === 1) {
                    CY = Math.min(DTP.y, INI.GAME_HEIGHT - chunk.y);
                } else {
                    CY = Math.max(DTP.y, INI.GAME_HEIGHT - chunk.y);
                }
                let cpy = CY + chunk.cp.y * chunk.cp.f;
                CTX.quadraticCurveTo(cpx, cpy, DTP.x, DTP.y);
                for (let x = 0; x < chunk.w; x++) {
                    let t = x / chunk.w;
                    //bezier approximation
                    let yt = (1 - t) ** 2 * DTP.y + 2 * (1 - t) * t * cpy + t ** 2 * (INI.GAME_HEIGHT - chunk.y);
                    let height = INI.GAME_HEIGHT - yt;
                    DTP.heightData.push(height);
                }
                break;
            default:
                console.log("chunk type ERROR");
        }

        CTX.closePath();

        /** fill pattern */
        if (chunk.pat) {
            CTX.fillStyle = PATTERN.pattern[chunk.pat].pattern;
        } else {
            CTX.fillStyle = PATTERN.pattern[mainPattern].pattern;
        }

        CTX.fill();

        switch (chunk.inf) {
            case "airport":
                CTX.beginPath();
                CTX.moveTo(DTP.x, DTP.y);
                CTX.lineTo(DTP.x, DTP.y + INI.PISTE_HEIGHT);
                CTX.lineTo(DTP.x + chunk.w, DTP.y + INI.PISTE_HEIGHT);
                CTX.lineTo(DTP.x + chunk.w, DTP.y);
                CTX.lineTo(DTP.x, DTP.y);
                CTX.closePath();
                CTX.fillStyle = "#333";
                CTX.fill();
                levelPointer.airport.x1 = DTP.x;
                levelPointer.airport.x2 = DTP.x + chunk.w;
                break;
            case "lake":
                CTX.beginPath();
                CTX.moveTo(DTP.x + INI.LAKE_PADDING, DTP.y);
                CTX.quadraticCurveTo(DTP.x + Math.floor(chunk.w / 2), DTP.y + INI.PISTE_HEIGHT, DTP.x + chunk.w - INI.LAKE_PADDING, DTP.y);
                CTX.lineTo(DTP.x, DTP.y);
                CTX.closePath();
                CTX.fillStyle = "#00F";
                CTX.fill();
                break;
            case "forest":
                let nextX = 0;
                while (nextX < chunk.w - INI.TREE_PADDING - 36) {
                    let treeIndex = RND(1, DTP.INI.NTREE)
                    let treeImage = SPRITE[`tree${treeIndex}`];
                    let nextY = Math.round(nextX * -slope);
                    CTX.drawImage(treeImage, DTP.x + nextX, DTP.y + nextY - treeImage.height + getTC(slope));
                    nextX += treeImage.width - INI.TREE_PADDING;
                }
                break;

            case "palm":
                let nextPX = 0;
                while (nextPX < chunk.w - INI.TREE_PADDING - 24) {
                    let palmIndex = RND(1, DTP.INI.NPALM)
                    let palmImage = SPRITE[`palm${palmIndex}`];
                    let nextY = Math.round(nextPX * -slope);
                    CTX.drawImage(palmImage, DTP.x + nextPX, DTP.y + nextY - palmImage.height + getTC(slope));
                    nextPX += palmImage.width - INI.TREE_PADDING;
                }
                break;

            default:
                break;
        }


        /** ready for next chunk */
        DTP.x += chunk.w;
        DTP.y = INI.GAME_HEIGHT - chunk.y;

        function getTC(slope){
            let TC = 0;
            if (-slope > 0.5) {
                TC = Math.floor(INI.TREE_CORRECTION * (-slope + 0.7));
            } else if (-slope > 0) {
                TC = INI.TREE_CORRECTION;
            }
            return TC;
        }
    },
    paintVisible(layer = "world", source = "level") {
        ENGINE.clearLayer(layer);
        const CTX = LAYER[layer];
        if (GAME.x < 0) GAME.x = 0;
        CTX.drawImage(LAYER[source].canvas, GAME.x, 0, ENGINE.gameWIDTH, INI.GAME_HEIGHT, 0, 0, ENGINE.gameWIDTH, INI.GAME_HEIGHT);
    },
    debugPaint(level, world, CTX) {
        console.log("DEBUG PAINT");
        const HD = world[level].heightData;
        if (!HD) {
            console.error(`Height data for level ${level} mot defined error`);
            return;
        }
        CTX.fillStyle = "white";
        for (let [x, y] of HD.entries()) {
            y = INI.GAME_HEIGHT - y;
            CTX.pixelAtPoint(new Point(x, y));
        }
    }
};

//END
console.log(`%c${TERRAIN.NAME} ${TERRAIN.VERSION} loaded.`, TERRAIN.CSS);