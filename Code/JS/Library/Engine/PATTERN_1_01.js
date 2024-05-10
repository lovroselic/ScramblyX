/*jshint browser: true */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W061 */
"use strict";

/*
    random PATTERN generation
    PATTERN from image
*/

const PATTERN = {
    VERSION: "1.01",
    CSS: "color: #ff6347",
    INI: {
        SIZE_X: 64,
        SIZE_Y: 64
    },
    pattern: {},
    setSize(sizeX, sizeY = sizeX) {
        this.INI.SIZE_X = sizeX;
        this.INI.SIZE_Y = sizeY;
    },
    create(name, r = [0, 255], g = [0, 255], b = [0, 255], a = 1) {
        let append = '<div id="div_' + name + '" class="hidden"></div>';
        $("body").append(append);
        let canvas = `<canvas id='${name}_canvas' width='${PATTERN.INI.SIZE_X}' height='${PATTERN.INI.SIZE_Y}'></canvas>`;
        $("#div_" + name).append(canvas);

        PATTERN.pattern[name] = {};
        PATTERN.pattern[name].ctx = $("#" + name + "_canvas")[0].getContext("2d");
        PATTERN.pattern[name].img = $("#" + name + "_canvas")[0];
        const CTX = PATTERN.pattern[name].ctx;

        for (var y = 0; y < PATTERN.INI.SIZE_Y; y++) {
            for (var x = 0; x < PATTERN.INI.SIZE_X; x++) {
                setPixel(x, y);
            }
        }
        PATTERN.pattern[name].pattern = PATTERN.pattern[name].ctx.createPattern(PATTERN.pattern[name].img, "repeat");
        console.log(`%cCreated pattern: ${name}`, PATTERN.CSS, PATTERN.pattern[name]);

        function setPixel(x, y) {
            let A;
            let RGB = [0, 0, 0];

            for (let [index, element] of [r, g, b].entries()) {
                if (typeof (element) == 'object') {
                    RGB[index] = RND(element[0], element[1]);
                } else {
                    RGB[index] = element;
                }
            }

            if (typeof (a) == 'object') {
                A = RNDF(a[0], a[1]);
            } else A = a;

            CTX.fillStyle = `rgba(${RGB[0]},${RGB[1]},${RGB[2]},${A})`;
            CTX.fillRect(x, y, 1, 1);
        }
    },
    fromTexture(name) {
        let append = '<div id="div_' + name + '" class="hidden"></div>';
        $("body").append(append);
        let canvas = `<canvas id='${name}_canvas' width='${this.INI.SIZE_X}' height='${this.INI.SIZE_Y}'></canvas>`;
        $("#div_" + name).append(canvas);

        const CTX = $("#" + name + "_canvas")[0].getContext("2d");
        let pattern = CTX.createPattern(TEXTURE[name], "repeat");
        CTX.fillStyle = pattern;

        //CTX.fillStyle = CTX.createPattern(TEXTURE[name], "repeat");
        CTX.fillRect(0, 0, this.INI.SIZE_X, this.INI.SIZE_Y);

        this.pattern[name] = {};
        this.pattern[name].ctx = CTX;
        this.pattern[name].img = $("#" + name + "_canvas")[0];
        this.pattern[name].pattern = pattern;

        console.log(`%cFrom texture pattern: ${name}`, this.CSS, PATTERN.pattern[name]);
    }
};


//END
console.log(`%cPATTERN ${PATTERN.VERSION} loaded.`, PATTERN.CSS);