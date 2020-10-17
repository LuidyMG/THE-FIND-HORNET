class Menu{
    bottomMenu = new Image();
    frame = 0;
    frameLimit = 600;

    controllKeyboard = new Image();
    controllJoystick = new Image();
    controllView = 'teclado';

    options = 'sound';
    buttons = [{
        name: 'Sim',
        focus: true,
        x: 300,
        y: 470,
        width: 120,
        height: 40
    },{
        name: 'Nao',
        focus: false,
        x: 420,
        y: 470,
        width: 120,
        height: 40
    }];

    constructor(){
        this.bottomMenu.src = 'imgs/bottomMenu.png';
        this.controllKeyboard.src = 'imgs/controlesTeclado.png';
        this.controllJoystick.src = 'imgs/controlesJoystick.png';
    }

    draw(){
        if(this.options == 'pause'){
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0,0,900,600);
        }
        ctx.drawImage(this.bottomMenu, 0,0,900,600,0,0,900,600);
        
        if(!initGame || this.options == 'pause')
            this.openModal();

        if(this.options == 'controles')
            if(this.controllView == 'teclado')
                ctx.drawImage(this.controllKeyboard, 0,0,900,600,-4,40,900,600);
            else
                ctx.drawImage(this.controllJoystick, 0,0,900,600,-4,40,900,600);

        if(this.frame >= this.frameLimit && !initGame || this.options == 'pause'){
            switch(this.options){
                case 'sound':
                    this.text('Deseja ativar o audio do jogo ?',200,425,this.options == 'gameOver');
                    break;
                case 'menu':
                    if(this.buttons[0].focus)
                        this.text('Iniciar jogo',370,425,this.options == 'gameOver');
                    else
                        this.text('Ver controles',350,425,this.options == 'gameOver');
                    break;
                case 'gameOver':
                    if(this.buttons[0].focus)
                        this.text('Reiniciar jogo',350,425,false);
                    else
                        this.text('Ir para o menu',345,425,false);
                    break;
                case 'pause':
                    if(this.buttons[0].focus)
                        this.text('Voltar para o jogo',300,425,false);
                    else
                        this.text('Ir para o menu',345,425,false);
                    break;
            }
            
            this.button(this.buttons[0].x,this.buttons[0].y,this.buttons[0].width,this.buttons[0].height,this.buttons[0].focus,this.buttons[0].name);
            if(this.options != 'controles')
                this.button(this.buttons[1].x+60,this.buttons[1].y,this.buttons[1].width,this.buttons[1].height,this.buttons[1].focus,this.buttons[1].name);
        }
    }

    update(){
        if(this.frame < this.frameLimit){
            this.frame += 25;
        }
    }

    button(x,y,width,height,focus,label){
        ctx.fillStyle = "black";
        ctx.fillRect(x-5, y-5, width+10, height+10);
        ctx.fillStyle = focus ? this.options != 'gameOver' ? "black" : 'white' : this.options != 'gameOver' ? '#DEAA33' : 'black';
        ctx.fillRect(x, y, width, height); 
        this.text(label,x+32.5,y+26,this.options != 'gameOver' ? !focus : focus);
    }

    text(text,x,y,inverted){
        if(!inverted){
            ctx.fillStyle = 'black';
            ctx.font = '25px pixel';
            ctx.fillText(text, (x-4), y);
            ctx.fillText(text, (x+4), y);
            ctx.fillText(text, x, (y+4));
            ctx.fillText(text, x, (y-4));
        }
        ctx.fillStyle = inverted ? 'black' : 'white';
        ctx.font = '25px pixel';
        ctx.fillText(text, x, y);
    }

    openModal(){
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(150-5, (this.options != 'controles' ? 365 : 50)-5, this.frame+10, (this.options != 'controles' ? 200 : 500)+10); 
        ctx.fillStyle = this.options != 'gameOver' ? "rgba(222,170,51,1)" : "#323232";
        ctx.fillRect(150, (this.options != 'controles' ? 365 : 50), this.frame, (this.options != 'controles' ? 200 : 500));     
    }

    select(){
        switch(this.options){
            case 'sound':
                if(this.buttons[0].focus){
                    canAudio = true;
                    songOut('songOutGameBottomMenu','bottom',0.05);
                }     
                this.menu();
                break;
            case 'menu':
                if(this.buttons[0].focus){
                    resetGame();
                    initGame = true;
                }else  
                    this.controles();
                break;
            case 'gameOver':
                if(this.buttons[0].focus)
                    resetGame();
                else{
                    this.menu();
                    this.options = 'menu';
                    songOut('songOutGameBottomMenu','bottom',0.05);
                }
                break;
            case 'controles':
                this.menu();
                break;
            case 'pause':
                if(this.buttons[0].focus)
                    this.pause();
                else{
                    this.pause();
                    this.menu();
                    this.options = 'menu';
                    songOut('songOutGameBottomMenu','bottom',0.05);
                }
                break;
        }
    }

    menu(){
        initGame = false;
        this.bottomMenu.src = 'imgs/bottomMenu.png';
        this.options = 'menu';
        this.labelModal = '';
        this.buttons[0].focus = true;
        this.buttons[0].name = 'start';
        this.buttons[0].width = 120+30;
        this.buttons[0].x = 300-30-20;
        this.buttons[1].focus = false;
        this.buttons[1].x = 420-35;
        this.buttons[1].width = 120+95;
        this.buttons[1].name = 'controles';
    }

    controles(){
        this.options = 'controles';
        this.labelModal = '';
        this.buttons[0].focus = true;
        this.buttons[0].name = 'Voltar';
        this.buttons[0].width = 175;
        this.buttons[0].x = 362.5;
    }

    gameOver(){
        initGame = false;
        this.bottomMenu.src = 'imgs/gameOver.png';
        this.options = 'gameOver';
        this.buttons[0].name = 'Reiniciar';
        this.buttons[0].x = 252.5;
        this.buttons[0].width = 195;
        this.buttons[1].name = 'Menu';
        this.buttons[1].x = 437.5;
        this.buttons[1].width = 140;
    }

    pause(){
        pauseGame = !pauseGame;
        this.bottomMenu.src = pauseGame ? 'imgs/pauseGame.png' : '';
        this.options = pauseGame ? 'pause' : 'menu';
        this.buttons[0].name = 'Voltar';
        this.buttons[0].x = 252.5;
        this.buttons[0].width = 175;
        this.buttons[1].name = 'Menu';
        this.buttons[1].x = 437.5;
        this.buttons[1].width = 140;
    }
}