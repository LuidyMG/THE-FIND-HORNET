`use strict`

class Person{
    //Tamanho

    height = 80;
    width = 80;

    //Movimento

    speed = 3;
    speedY = 0;
    action;
    gravity = 1;
    gravitySpeed = 7;
    jumping = false;
    attacking = false;

    //Coordenadas

    x;
    xMap = 0;
    y = 0;
    
    //Animação Person

    frame = 0;
    timeSprite = 8;
    timeAttackSprite = 2;
    quantSprite = 4;
    spriteNumber = 0;
    sprite = new Image();
    
    //Colisão

    bottomSolid = {};
    rightSolid = {};
    leftSolid = {};

    //Vida

    life;
    timeDamege = 0;
    kills = 0;

    constructor(x,y){
        //Iniciar coordenadas

        this.x = x;
        this.y = y;
        this.xMap = x;

        //Iniciar colisão

        this.bottomSolid.yLast = screenCanvas.offsetHeight+100;
        this.bottomSolid.x = 0;
        this.bottomSolid.xLast = screenCanvas.offsetWidth-2;

        this.rightSolid.x = 5800;
        this.leftSolid.x = 0;
        
        //Iniciar movimentos

        this.action = 'stoped';

        //Iniciar animação do Player

        this.sprite.src = 'sprites/player/stopedPlayer.png';
        this.sprite.onload = function() {
            player.quantSprite = (this.width/80);
        }

        //Iniciar vida

        this.life = new Life('life',3,this,-15,10);
    }

    draw(){
        //Desenhar personagens
        ctx.drawImage(this.sprite, 0+(80*this.spriteNumber),0,80,80,this.x,this.y,80,80);

        //Desenhar Vida

        this.life.draw();

        //Desenhar Dano
        if(this.timeDamege > 0){
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.fillRect(0, 0, screenCanvas.offsetWidth-2, screenCanvas.offsetHeight-2);
        }
    }

    update(){
        //Sistema de Gravidade

        if(this.gravity > this.bottomSolid.yLast)
            this.gravity = this.bottomSolid.yLast;
        this.y += this.gravitySpeed;    

        if(this.gravitySpeed < 7){
            this.gravitySpeed += 0.5;
        }

        //Sistema Movimentação

        if(this.action == 'walkedRight'){
            this.x += this.jumping ? this.speed + 2 : this.speed;
            this.xMap += this.jumping ? this.speed + 2 : this.speed;
        }
    
        if(this.action == 'walkedLeft'){
            this.x -= this.jumping ? (this.speed + 2) : this.speed;
            this.xMap -= this.jumping ? this.speed + 2 : this.speed;
        }

        if(this.x > 200 && map.x < 5800-screenCanvas.offsetWidth){
            map.x += this.jumping ? this.speed + 2 : this.speed;
            map.mobs.map(function(mob){
                mob.x -= player.jumping ? player.speed + 2 : player.speed;
                mob.xLast -= player.jumping ? player.speed + 2 : player.speed;
            });
            this.x -= this.jumping ? this.speed + 2 : this.speed;
        }

        if((keysPressed.length == 0 || (keysPressed.length == 1 && keysPressed.indexOf(13) >= 0)) && !gamepadAPI.turbo && !this.jumping && !this.attacking){
            this.action = this.action.includes('Left') ? 'stopedLeft' : 'stoped';
            this.stoped();
        }

        //Sistema de Interação com Mapa

        this.collision();

        this.damage();

        if(this.x < 0){
            this.x = 0;
            if(map.x > 1){
                map.x -= this.jumping ? this.speed + 2 : this.speed;
                map.mobs.map(function(mob){
                    mob.x += player.jumping ? player.speed + 2 : player.speed;
                    mob.xLast += player.jumping ? player.speed + 2 : player.speed;
                });
            }
            this.xMap = map.x;
        }
        if(this.xMap+26 <= this.leftSolid.x){
            this.x += this.jumping ? this.speed + 2 : this.speed;
            this.xMap += this.jumping ? this.speed + 2 : this.speed;
        }
        
        if(this.xMap+this.width-26 >= this.rightSolid.x){
            this.x -= this.jumping ? this.speed + 2 : this.speed;
            this.xMap -= this.jumping ? this.speed + 2 : this.speed;
        }

        if(this.y < 0)
            this.y = 0;

        if(this.y+this.height > this.bottomSolid.yLast){
            this.gravitySpeed = 0;
            this.y = this.bottomSolid.yLast - this.height;
            if(this.jumping && !this.attacking){
                this.action = keysPressed.length == 0 ? this.action.includes('Left') ? 'stopedLeft' : 'stoped' : this.action.includes('Left') ? 'walkedLeft' : 'walkedRight';
                if(keysPressed.length == 0)
                    this.stoped();
                else
                    this.walk();
            }
            this.jumping = false;
        }

        if(this.bottomSolid.yLast > this.y+this.height){
            this.jumping = true;
            this.jump();
        }
        
        //Sistema de controle de animação do personagem

        this.frame++;

        if(this.frame == this.timeSprite || (this.attacking && this.frame == this.timeAttackSprite)){
            this.frame = 0;
            this.spriteNumber++;
        }

        if(this.spriteNumber >= this.quantSprite){
            this.spriteNumber = !this.jumping ? 0 : this.quantSprite-1;
            if(this.attacking){
                this.attacking = false;
                if(this.action.includes('walk'))
                    this.move('x',this.action.includes('Left') ? -1 : 1);
                else if(this.action.includes('stoped'))
                    this.stoped();
            }
        }

        //Vida

        if(this.kills >= 3){
            this.life.quant++;
            this.kills = 0;
        }

        //Entrar na piramede
        
        if(this.x >= 600){
            map.transition = 0.01;
            map.room = 'roomChef';
            this.x = 0;
            dialogBoss.show = true;
            songOut('songOutGameBottomMenu','bottom',0.02);
        }
    }

    collision(){
        //Resetar colisão do eixo y

        if(this.bottomSolid.xLast < this.xMap+26 || this.bottomSolid.x > this.xMap+26){
            this.bottomSolid.yLast = screenCanvas.offsetHeight+100;
            this.bottomSolid.x = 0;
            this.bottomSolid.xLast = screenCanvas.offsetWidth-2;
        }

        //Resetar colisão do eixo X

        if(!(this.bottomSolid.y > player.y && this.bottomSolid.yLast < player.y+player.height)){
            player.rightSolid.x = 5800;
            player.leftSolid.x = 0;
        }

        //Procurar objetos de colisão no mapa
        
        map.objects.map(function(object){
            var colisaoSolo = object.yLast <= player.y+player.height && object.x <= player.xMap+26 && object.xLast >= player.xMap+player.width-26;
            var colisaoParedeRight = object.x <= player.xMap+player.width-20 && object.x > player.xMap && object.xLast > player.xMap+player.width-20 && object.y > player.y && object.yLast < player.y+player.height-20;
            var colisaoParedeLeft = object.xLast >= player.xMap+20 && object.x < player.xMap && object.y > player.y && object.yLast < player.y+player.height-20;

            if(colisaoParedeRight && player.rightSolid.x > object.x)
                player.rightSolid.x = object.x;

            if(colisaoParedeLeft && player.leftSolid.x < object.xLast)
                player.leftSolid.x = object.xLast;

            if(colisaoSolo && player.bottomSolid.yLast > object.yLast){
                player.bottomSolid.xLast = object.xLast;
                player.bottomSolid.x = object.x;
                player.bottomSolid.yLast = object.yLast;
                player.bottomSolid.y = object.y;
            }
        });
    }

    move(direction,force){
        if(!this.attacking){
            //Efeito sonoro
            if(direction == 'x' && force < 0)
                this.action = 'walkedLeft';
            if(direction == 'x' && force > 0)
                this.action = 'walkedRight';
            this.walk();
        }
    }

    walk(){
        if(this.action.includes('Left'))
            this.sprite.src = 'sprites/player/walkedPlayerLeft.png';
        else
            this.sprite.src = 'sprites/player/walkedPlayer.png';
    }

    jump(){
        if(!this.attacking){
            if(!this.jumping){
                songOut('playerJump','playerSongEffect',0.03);
                this.jumping = true;
                this.gravitySpeed = -10;
            }
            if(this.action.includes('Left'))
                this.sprite.src = 'sprites/player/jumpPlayerLeft.png';
            else
                this.sprite.src = 'sprites/player/jumpPlayer.png';
        }
    }

    stoped(){
        if(this.action.includes('Left'))
            this.sprite.src = 'sprites/player/stopedPlayerLeft.png';
        else
            this.sprite.src = 'sprites/player/stopedPlayer.png';
    }

    attack(){
        if(!this.attacking && keysPressed.indexOf(13) < 0 && gamePadButtonsPressed.indexOf(2) < 0){
            this.attacking = true;
            if(this.jumping)
                if(this.action.includes('Left'))
                    this.sprite.src = 'sprites/player/attackJumpPlayerLeft.png';
                else
                    this.sprite.src = 'sprites/player/attackJumpPlayer.png';
            else if(this.action.includes('walk'))
                if(this.action.includes('Left'))
                    this.sprite.src = 'sprites/player/attackWalkPlayerLeft.png';
                else
                    this.sprite.src = 'sprites/player/attackWalkPlayer.png';
            else
                if(this.action.includes('Left'))
                    this.sprite.src = 'sprites/player/attackPlayerLeft.png';
                else
                    this.sprite.src = 'sprites/player/attackPlayer.png';
            
            map.mobs.map(function(mob){
                if(mob.lifed && ((player.x+5 <= mob.x+mob.width && player.x > mob.x) || (player.x+player.width-5 >= mob.x && player.x < mob.x)) && mob.y+5 < player.y+player.height && mob.y+mob.height-5 > player.y){
                    mob.lifed = false;
                    player.kills++;
                    songOut('mobDamage','mobSongEffect',0.03);
                }
            });
        }
    }

    damage(){
        map.mobs.map(function(mob){
            if(mob.lifed && player.x+player.width-26 >= mob.x+5 && player.x+26 <= mob.x+mob.width-5 && mob.y+5 < player.y+player.height && mob.y+mob.height-5 > player.y && player.timeDamege == 0){
                player.life.quant--;
                player.timeDamege = 60;
                songOut('playerDamage','playerSongEffect',0.03);
            }
        });
        if(this.timeDamege > 0)
            this.timeDamege--;
        if(this.life.quant <= 0){
            menu.gameOver();
            songOut('playerDead','bottom',0.02);
        }

        if(player.y > screenCanvas.height){
            this.life.quant = 0;
        }
    }
}