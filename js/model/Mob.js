class Mob{
    type = 'mob';

    //Tamanho

    height = 80;
    width = 55;

    //Movimentação

    speed = 1;
    areaMove;
    direction = 'right';

    //Coordenadas
    
    x = 0;
    xLast;
    xMap = 0;
    y;

    //Animação

    frame = 0;
    timeSprite = 8;
    quantSprite = 4;
    spriteNumber = 0;
    sprite = new Image();

    //Vida

    lifed = true;
    life;

    constructor(x,y,areaMove){
        if(areaMove == 'mobChef'){
            this.type = areaMove;
            this.height = 80;
            this.width = 52;
            this.quantSprite = 2;
            this.timeSprite = 50;
            this.life = new Life('lifeChef',5,this,-15,300);  
        }

        //Iniciar coordenadas

        this.x = x;
        this.xMap = x;
        this.y = y-this.height;

        //Iniciar zona de movimentação

        if(this.type != 'mobChef'){
            this.xLast = areaMove-this.width;
            this.areaMove = this.xLast-x;

            this.sprite.src = 'sprites/mobs/cactus/cactusMoveRight.png';
        }else{
            this.sprite.src = 'sprites/mummy/mummyBreathing.png';
        }
    }

    draw(){
        if(this.lifed)
            ctx.drawImage(this.sprite, 0+(this.width*this.spriteNumber),0,this.width,this.height,this.x,this.y,this.type == 'mobChef' ? this.width+200 : this.width,this.type == 'mobChef' ? this.height+250 : this.height);
        else if(this.spriteNumber <= this.quantSprite)
            ctx.drawImage(this.sprite, 0+(this.width*this.spriteNumber),0,this.width,this.height,this.x,this.y,this.width,this.height);
        if(this.life != undefined){
            this.life.draw();
        }
    }

    update(){
        if(!this.lifed && this.sprite.src != 'sprites/dead/dead.png'){
            this.sprite.src = 'sprites/dead/dead.png';
            this.quantSprite = 5;
        }
        if(this.type == 'mob'){
            if(this.lifed && !pauseGame){
                //Sistema Movimentação

                if(this.direction == 'right'){
                    this.x += this.speed;
                }

                if(this.direction == 'left')
                    this.x -= this.speed;

                if(this.x >= this.xLast){
                    this.direction = 'left';
                    this.sprite.src = 'sprites/mobs/cactus/cactusMoveLeft.png';
                }
                
                if(this.x <= this.xLast-this.areaMove){
                    this.direction = 'right';
                    this.sprite.src = 'sprites/mobs/cactus/cactusMoveRight.png';
                }
            }
        }

        //Sistema de controle de animação

        this.frame++;

        if(this.frame == this.timeSprite){
            this.frame = 0;
            this.spriteNumber++;
        }

        if(this.spriteNumber >= this.quantSprite)
            if(this.lifed)
                this.spriteNumber = 0;
    }
}