var gamePadButtonsPressed = [];

var gamepadAPI = {
    controller: {},
    turbo: false,
    connect: function(evt) {
        gamepadAPI.controller = evt.gamepad;
        gamepadAPI.turbo = true;
        console.log('Gamepad connected.');
    },
    disconnect: function(evt) {
        gamepadAPI.turbo = false;
        delete gamepadAPI.controller;
        console.log('Gamepad disconnected.');
    },
    update: function() {
        let gamepads = navigator.getGamepads();
        
        if(gamepads[0].buttons.findIndex(x => x.pressed == true) > -1){
            var gamePadButtonPressed = null;
            switch(gamepads[0].buttons.findIndex(x => x.pressed == true)){
                case 15:
                    if(!initGame || pauseGame){
                        if(menu.options != 'controles'){
                            menu.buttons[0].focus = false;
                            menu.buttons[1].focus = true;
                        }else
                            menu.controllView = 'joystick';
                    }else
                        player.move('x',1);
                    gamePadButtonPressed = 15;
                    break;
                case 14:
                    if(!initGame || pauseGame){
                        if(menu.options != 'controles'){
                            menu.buttons[0].focus = true;
                            menu.buttons[1].focus = false;
                        }else
                            menu.controllView = 'teclado';
                    }else
                        player.move('x',-1);
                    gamePadButtonPressed = 14;
                    break;
                case 12:
                    if(initGame && !pauseGame)
                        player.jump();
                    gamePadButtonPressed = 12;
                    break;
                case 0:
                    if(initGame && !pauseGame){
                        player.jump();
                    }else{
                        if(gamePadButtonsPressed.indexOf(0) < 0)
                            menu.select();
                    }
                    gamePadButtonPressed = 0;
                    break;
                case 2:
                    if(initGame && !pauseGame)
                        player.attack();
                    gamePadButtonPressed = 2;
                    break;
                case 9:
                    gamePadButtonPressed = 2;
                    if(initGame && !pauseGame && gamePadButtonsPressed.indexOf(gamePadButtonPressed) < 0)
                        menu.pause();
                    break;
            }
            if(gamePadButtonsPressed.indexOf(gamePadButtonPressed) < 0 && gamePadButtonPressed != null)
                gamePadButtonsPressed.push(gamePadButtonPressed);
        }else{
            gamePadButtonsPressed = [];
            if(!player.attacking){
                player.action = player.action.includes('Left') ? 'stopedLeft' : 'stoped';
                player.stoped();
            }
        }
        gamepads[0].buttons.map(function(button,index){
            if(!button.pressed && gamePadButtonsPressed.indexOf(index) > -1)
                gamePadButtonsPressed.splice(gamePadButtonsPressed.indexOf(index),1);
        });
    },
    buttonPressed: function(button, hold) {
       
    },
    buttons: [
        'DPad-Up','DPad-Down','DPad-Left','DPad-Right',
        'Start','Back','Axis-Left','Axis-Right',
        'LB','RB','Power','A','B','X','Y',
    ],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: []
};

window.addEventListener("gamepadconnected", gamepadAPI.connect);
window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);