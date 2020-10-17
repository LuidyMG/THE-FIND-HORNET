`use strict`

class BossDialog extends DialogMessage {
    positionQuestion;
    positionFocus = 0;
    arrQuestionsHistory = [];
    numberErrors = 0;
    phrases = new Phrases();

    arrQuestions = ["1230 + 27 ?",
        "(130 / 2 + 42) + (120 /  2) - 1 ?",
        "136 x 11 ?",
        "12 / 2 + 5 ?",
        "25 x 3 - 15 ?",
        "85 / 5 + 3 ?",
        "20 + 35 / 5 ?",
        "Qual e a raiz quadrada de 100 ?",
        "Quanto vale 5 ^ 3 ?",
        "10 + 30 x 2 - 9 ?",
        "55 x 2 - 27 ?",
        "100 + 40 - 6 / 3 ?"
    ];

    arrAnswers = [
        1257, 166, 1496, 11, 60, 20, 27, 10, 125, 61, 83, 138
    ]

    arrOtherAnswers = [];

    constructor(y) {
        super(0, y)
        this.width = screenCanvas.offsetWidth;
        this.generateArrayAnswers();
        this.selectOption();

    }

    draw() {
        if (this.show) {
            super.draw();
            this.drawButtons();
        }
    }


    drawButtons() {
        ctx.fillStyle = 'white';

        var padding = 125;
        this.arrOtherAnswers.forEach(item => {
            if (item.focus) {
                ctx.fillText("> " + item.value, this.x + 50, this.y + padding);
            } else {
                ctx.fillText(item.value, this.x + 50, this.y + padding);
            }
            padding += 30;
        })
    }

    selectOption() {
        window.addEventListener('keydown', item => {
            if (dialogBoss.show) {
                if ((item.key == 'ArrowDown' || item.key == 's') && this.positionFocus != 3) {

                    this.arrOtherAnswers[this.positionFocus].focus = false;
                    this.arrOtherAnswers[this.positionFocus + 1].focus = true;
                    this.positionFocus++;

                } else if ((item.key == 'ArrowUp' || item.key == 'w') && this.positionFocus != 0) {

                    this.arrOtherAnswers[this.positionFocus].focus = false;
                    this.arrOtherAnswers[this.positionFocus - 1].focus = true;
                    this.positionFocus--;

                } else if (item.key == 'Enter') {
                    this.checkAnswer(this.arrOtherAnswers[this.positionFocus]);
                } else {

                    this.arrOtherAnswers[this.positionFocus].focus = false;
                    this.arrOtherAnswers[0].focus = true;
                    this.positionFocus = 0;

                }
            }
        })
    }

    checkAnswer(item) {
        this.arrQuestionsHistory.push(this.arrQuestions[this.positionQuestion]);
        if (item.correct) {
            map.mobChef.life.quant--;
            songOut('mobDamage', 'playerSongEffect', 0.03);
            if (map.mobChef.life.quant == 0) {
                map.mobChef.lifed = false;
                this.finishGame()
            }
        } else {
            player.life.quant--;
            player.timeDamege = 60;
            songOut('playerDamage', 'playerSongEffect', 0.03);
            if (player.life.quant == 0) {
                player.life = false;
                menu.gameOver()
                this.show = false;
            }
        }
        this.generateArrayAnswers();
    }


    generateArrayAnswers() {
        this.positionFocus = 0;
        this.positionQuestion = Math.floor(Math.random() * this.arrQuestions.length);
        while (this.arrQuestionsHistory.indexOf(this.arrQuestions[this.positionQuestion]) > -1) {
            this.positionQuestion = Math.floor(Math.random() * this.arrQuestions.length);
        }
        this.text = "Acerte as questoes para se livrar do gambe mumificado:# " + this.arrQuestions[this.positionQuestion];

        this.arrOtherAnswers = [];
        this.arrOtherAnswers.push(
            {
                value: this.arrAnswers[this.positionQuestion],
                focus: false,
                correct: true
            }
        )
        for (let i = 0; i < 3; i++) {
            var wrongAnswer = this.generateRandom(1, this.arrAnswers[this.positionQuestion]);
            this.arrOtherAnswers.push(
                {
                    value: wrongAnswer,
                    focus: false,
                    correct: false
                }
            )

        }

        var m = this.arrOtherAnswers.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = this.arrOtherAnswers[m];
            this.arrOtherAnswers[m] = this.arrOtherAnswers[i];
            this.arrOtherAnswers[i] = t;

        }
        this.arrOtherAnswers[0].focus = true;

    }


    generateRandom(min, max) {
        var num = Math.floor(Math.random() * (max - min + 1)) + min;

        while (num == this.arrAnswers[this.positionQuestion] || this.arrOtherAnswers.findIndex(x => x.value == num) > -1) {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        }

        return num;
    }

    finishGame() {
        this.show = false;
        dialog = new DialogMessage(25, 20, false, false, phrases.WELCOME_TO_GAME);
        dialog.text = phrases.FINISH_GAME;
        dialog.timeout = 5000;
        dialog.show = true;
        dialog.writeText()
        setTimeout(() => {
            menu.menu();
            menu.options = 'menu';
            songOut('songOutGameBottomMenu', 'bottom', 0.05);
            dialog = new DialogMessage(25, 20, false, true, phrases.WELCOME_TO_GAME);
            dialog.text = phrases.WELCOME_TO_GAME;
            dialog.timeout = 15000;

        }, 5000);
    }
}