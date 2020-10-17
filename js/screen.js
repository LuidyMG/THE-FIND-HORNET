var screenCanvas = document.getElementById('screen');
var phrases = new Phrases();

var ctx = screenCanvas.getContext('2d');
var map = new Map(0, 0);
var player = new Person(10, 350);
var menu = new Menu();
var dialog = new DialogMessage(25, 20, false, true, phrases.WELCOME_TO_GAME);

var dialogBoss = new BossDialog(screenCanvas.offsetHeight - 250);
var initGame = false;
var pauseGame = false;

main();

function main() {
    this.run();
}

function draw() {
    if (initGame) {
        map.draw();
        player.draw();
        dialog.draw();
        dialogBoss.draw();

    } else
        menu.draw();
}

function update() {
    if (gamepadAPI.turbo)
        gamepadAPI.update();
    if (initGame) {
        map.update();
        if (!dialog.show && map.room == 'mapa') {
            player.update();
        }
    } else
        menu.update();
}

function run() {
    this.update();
    this.draw();
    window.requestAnimationFrame(run);
}

function resetGame() {
    songOut('songOutGameBottom', 'bottom', 0.02);
    menu.bottomMenu.src = '';
    if (menu.options == "menu") {
        dialog.show = true;
        dialog.continueGame()
    }

    initGame = true;
    map = new Map(0, 0);
    player = new Person(10, 350);
}