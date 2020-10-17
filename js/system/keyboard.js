var keysPressed = [];

document.addEventListener('keydown',  keyDown);

function keyDown(key){
    var keyPressed = null;

    if([65,37].includes(key.keyCode)){
        if(!initGame || pauseGame){
            if(menu.options != 'controles'){
                menu.buttons[0].focus = true;
                menu.buttons[1].focus = false;
            }else
                menu.controllView = 'teclado';
        }else{
            player.move('x',-1);
            keyPressed = key.keyCode;
        }
    }
    if([68,39].includes(key.keyCode)){
        if(!initGame || pauseGame){
            if(menu.options != 'controles'){
                menu.buttons[0].focus = false;
                menu.buttons[1].focus = true;
            }else
                menu.controllView = 'joystick';
        }else{
            player.move('x',1);
            keyPressed = key.keyCode;
        }
    }
    if([87,38,32].includes(key.keyCode))
        if(initGame && !pauseGame && map.room == 'mapa')
            player.jump();
    
    if([13].includes(key.keyCode)){
        if(!initGame || pauseGame)
            menu.select();
        else{
            player.attack();
            keyPressed = key.keyCode;
        }
    }
    if([27].includes(key.keyCode)){
        if(initGame)
            menu.pause();
    }
    
    if(keysPressed.indexOf(keyPressed) < 0 && keyPressed != 18 && keyPressed != null)
        keysPressed.push(key.keyCode);
}

document.addEventListener('keyup', function(key){ 
    if(keysPressed.indexOf(key.keyCode) >= 0)
        keysPressed.splice(keysPressed.indexOf(key.keyCode),1);
});