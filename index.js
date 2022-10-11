function calculateDO(x, tx, dx, reversed) {
    let [x1, x2] = [x, x + dx];
    if (x1 > x2) [x1, x2] = [x2, x1];

    sign = dx === 0 ? 0 : Math.abs(dx) / dx;

    let d = Math.min(x2, tx) - Math.min(x1, tx);
    let o = Math.max(x2, tx) - Math.max(x1, tx);

    return sign * (reversed ? d : o);
}

class Square {
    static DT = 30; // distance threshold
    static MS = 100; // minimal size

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.x2 = x + width;
        this.y2 = y + height;

        this.tx = x;
        this.ty = y;
        this.tx2 = x + width;
        this.ty2 = y + height;

        this.vx = 0;
        this.vy = 0;
        this.vx2 = 0;
        this.vy2 = 0;

        this.sc = 0; // selected corner
    }

    applyMovement() {
        let dx = this.tx - this.x;
        let dy = this.ty - this.y;
        let dx2 = this.tx2 - this.x2;
        let dy2 = this.ty2 - this.y2;

        let gelatiness = 0.1;
        let friction = 0.2;

        this.vx += gelatiness * dx - friction * this.vx;
        this.vy += gelatiness * dy - friction * this.vy;
        this.vx2 += gelatiness * dx2 - friction * this.vx2;
        this.vy2 += gelatiness * dy2 - friction * this.vy2;
    }

    resize() {
        if (!this.sc) {
            return;
        }

        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;

        if (this.sc === 5) {
            this.tx += dx;
            this.tx2 += dx;
            this.ty += dy;
            this.ty2 += dy;
            return;
        }

        if (this.sc === 2 || this.sc === 3) {
            dx = calculateDO(pmouseX, this.tx2 - Square.MS, dx, true);
            this.tx += dx;
        } else {
            dx = calculateDO(pmouseX, this.tx + Square.MS, dx);
            this.tx2 += dx;
        }

        if (this.sc === 1 || this.sc === 2) {
            dy = calculateDO(pmouseY, this.ty2 - Square.MS, dy, true);
            this.ty += dy;
        } else {
            dy = calculateDO(pmouseY, this.ty + Square.MS, dy);
            this.ty2 += dy;
        }
    }

    draw() {
        this.resize();

        this.applyMovement();

        this.x += this.vx;
        this.y += this.vy;
        this.x2 += this.vx2;
        this.y2 += this.vy2;

        noStroke();
        fill(0);
        rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y, 20);

        textAlign(CENTER, CENTER);
        textSize(32);
        textFont('Pretendard, "Noto Sans"')
        fill(255);
        text('Shtelo', (this.x + this.x2)/2, (this.y + this.y2)/2)
    }

    selectCorner() {
        if (Math.hypot(mouseX - this.x2, mouseY - this.y) < Square.DT) return 1;
        if (Math.hypot(mouseX - this.x, mouseY - this.y) < Square.DT) return 2;
        if (Math.hypot(mouseX - this.x, mouseY - this.y2) < Square.DT) return 3;
        if (Math.hypot(mouseX - this.x2, mouseY - this.y2) < Square.DT) return 4;
        if (
            this.x < mouseX && mouseX < this.x2
            && this.y < mouseY && mouseY < this.y2
        ) return 5;

        return 0;
    }

    mousePressed() {
        this.sc = this.selectCorner();
    }

    mouseReleased() {
        this.sc = 0;
    }
}

let square;

function mousePressed() {
    square.mousePressed();
}

function mouseReleased() {
    square.mouseReleased();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    square = new Square(100, 100, 100, 100);
}

function draw() {
    background(255);

    square.draw();
}
