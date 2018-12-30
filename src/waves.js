class WaveCurve {
    constructor(opt) {
        this.opt = opt || {};
        this.controller = opt.controller;
        this.color = opt.color;
        this.tick = 0;

        this.respawn = this.respawn.bind(this);
        this.equation = this.equation.bind(this);
        this.drawAlt = this.equation.bind(this);
        this.draw = this.draw.bind(this);

        this.respawn();
    }

    respawn() {
        this.amplitude = 0.3 + Math.random() * 0.7;
        this.seed = Math.random();
        this.open_class = 2 + Math.random() * 3 || 0;
    }

    equation(i) {
        const p = this.tick;
        const y =
            -1 *
            Math.abs(Math.sin(p)) *
            (this.controller.amplitude * this.amplitude) *
            this.controller.MAX *
            (1 / (1 + (this.open_class * i) ** 2) ** 2);
        if (Math.abs(y) < 0.001) {
            this.respawn();
        }
        return y;
    }

    dram(m) {
        this.tick +=
            this.controller.speed * (1 - 0.5 * Math.sin(this.seed * Math.PI));
        const ctx = this.controller.ctx;
        ctx.beginPath();
        const xBase =
            this.controller.width / 2 +
            (-this.controller.width / 4 +
                this.seed * (this.controller.width / 2));
        const yBase = this.controller.height / 2;
        let x;
        let y;
        let xInit;
        let i = -3;
        while (i <= 3) {
            x = xBase + (i * this.controller.width) / 4;
            y = yBase + m * this.equation(i);
            xInit = xInit || x;
            ctx.lineTo(x, y);
            i += 0.01;
        }
        const h = Math.abs(this.equation(0));
        const gradient = ctx.createRadialGradient(
            xBase,
            yBase,
            h * 1.15,
            xBase,
            yBase,
            h * 0.3
        );
        gradient.addColorStop(0, `rgba(${this.color.join(",")},0.4)`);
        gradient.addColorStop(1, `rgba(${this.color.join(",")},0.2)`);
        ctx.fillStyle = gradient;
        ctx.lineTo(xInit, yBase);
        ctx.closePath();
        ctx.fill();
    }

    draw() {
        this.dram(-1);
        this.dram(1);
    }
}

export default class VoiceWaves {
    constructor(opt) {
        if (this.opt && this.opt.container) {
            $(this.opt.container).empty();
        }

        this.opt = opt || {};
        this.tick = 0;
        this.run = false;
        // UI vars
        this.ratio = this.opt.ratio || window.devicePixelRatio || 1;
        this.width = this.ratio * (this.opt.width || 320);
        this.height = this.ratio * (this.opt.height || 100);
        this.MAX = this.height / 2;
        this.speed = this.opt.speed || 0.1;
        this.amplitude = this.opt.amplitude || 1;
        // Canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width / this.ratio}px`;
        this.canvas.style.height = `${this.height / this.ratio}px`;
        this.container = this.opt.container || document.body;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        // Create curves
        this.curves = [];
        // Colors
        this.colors = [[24, 91, 255], [255, 24, 94], [84, 255, 218]];

        this.init = this.init.bind(this);
        this.clear = this.clear.bind(this);
        this.draw = this.draw.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);

        this.init();
    }

    init() {
        const vm = this;
        for (let i = 0; i < vm.colors.length; i += 1) {
            const color = vm.colors[i];
            for (let j = 0; j < 3 * Math.random() || 0; j += 1) {
                vm.curves.push(
                    new WaveCurve({
                        controller: vm,
                        color
                    })
                );
            }
        }
        if (vm.opt.autostart) {
            vm.start();
        }
    }

    clear() {
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = "lighter";
    }

    draw() {
        if (this.run === false) return;
        this.clear();
        const len = this.curves.length;
        for (let i = 0; i < len; i += 1) {
            this.curves[i].draw();
        }
        requestAnimationFrame(this.draw.bind(this));
    }

    start() {
        this.tick = 0;
        this.run = true;
        this.draw();
    }

    stop() {
        this.tick = 0;
        this.run = false;
    }
}
