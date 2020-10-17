`use strict`

class DialogMessage {
    x = 25;
    y = 20;
    height = 300;
    width = screenCanvas.offsetWidth - (this.x * 2);
    text;
    show;
    timeout = 15000;
    constructor(x, y, show = false, preAnyKeyToContinue = false, text) {
        this.x = x;
        this.y = y;
        this.show = show;
        this.text = text;
        if (preAnyKeyToContinue) {
            this.pressContinue();
        }
    }

    draw() {
        if (this.show) {
            ctx.fillStyle = "black";
            ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.fillStyle = "white";
            this.writeText();
        }
    }

    writeText() {
        var text = this.text.split("#")
        var padding = 30;
        text.forEach(item => {
            ctx.fillText(item.trim(), this.x + 20, this.y + padding);
            padding += 25;
        });
    }

    continueGame() {
        setTimeout(() => {
            this.show = false;
        }, this.timeout);

    }

    pressContinue() {
        var count = 0;
        window.addEventListener('keydown', item => {
            count++;
            if (count == 3) {
                count = 0;
                this.show = false;
            }
        })
    }
}