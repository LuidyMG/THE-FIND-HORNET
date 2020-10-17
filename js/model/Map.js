var colisao = 5;

class Map{
    x;
    xLast;
    y;
    yLast;
    objects = [{
        Name: 'solo',
        x: 0,
        y: 600,
        xLast: 2740,
        yLast: 520+colisao
    },
    {
        Name: 'solo1',
        x: 2851,
        y: 600,
        xLast: 2946,
        yLast: 552+colisao
    },
    {
        Name: 'solo2',
        x: 409,
        y: 600,
        xLast: 724,
        yLast: 448+colisao
    },
    {
        Name: 'solo3',
        x: 970,
        y: 600,
        xLast: 1059,
        yLast: 483+colisao
    },
    {
        Name: 'solo4',
        x: 1153,
        y: 600,
        xLast: 2285,
        yLast: 391+colisao
    },
    {
        Name: 'solo5',
        x: 1485,
        y: 600,
        xLast: 1605,
        yLast: 333+colisao
    },
    {
        Name: 'solo6',
        x: 3032,
        y: 600,
        xLast: 3172,
        yLast: 520+colisao
    },
    {
        Name: 'solo7',
        x: 3120,
        y: 600,
        xLast: 3770,
        yLast: 453+colisao
    },
    {
        Name: 'solo8',
        x: 3250,
        y: 600,
        xLast: 3770,
        yLast: 408+colisao
    },
    {
        Name: 'solo9',
        x: 3359,
        y: 600,
        xLast: 3770,
        yLast: 357+colisao
    },
    {
        Name: 'solo10',
        x: 3465,
        y: 600,
        xLast: 3780,
        yLast: 298+colisao
    },
    {
        Name: 'solo11',
        x: 3847,
        y: 600,
        xLast: 4189,
        yLast: 520+colisao
    },
    {
        Name: 'solo12',
        x: 4257,
        y: 553,
        xLast: 4357,
        yLast: 475+colisao
    },
    {
        Name: 'solo13',
        x: 4446,
        y: 542,
        xLast: 4758,
        yLast: 440+colisao
    },
    {
        Name: 'solo14',
        x: 4841,
        y: 579,
        xLast: 4941,
        yLast: 501+colisao
    },
    {
        Name: 'solo15',
        x: 4999,
        y: 600,
        xLast: 5800,
        yLast: 520+colisao
    }];
    mobs = [new Mob(409,448+colisao,724),new Mob(731,520+colisao,960),new Mob(1066,520+colisao,1140),new Mob(1160,390+colisao,1474),new Mob(1701,390+colisao,2189),new Mob(2294,520+colisao,2639),new Mob(2420,520+colisao,2731),new Mob(3124,453+colisao,3244),new Mob(3470,298+colisao,3776),new Mob(3851,520+colisao,4187),new Mob(4448,443+colisao,4752)];
    mobChef = new Mob(550,150,'mobChef');
    map = new Image();
    fundo = new Image();
    roomChef = new Image();
    room = 'mapa';

    frame = 0;
    timeSprite = 20;
    quantSprite = 4;
    spriteNumber = 0;
    
    frameTrasition = 0;
    transition = 1;
    timeTransition = 15;

    constructor(x,y){
        this.x = x;
        this.y = y;
        this.xLast = this.x+(screenCanvas.offsetWidth-2);
        this.yLast = this.y-(screenCanvas.offsetHeight-2);

        this.map.src = 'maps/map1/map.png';
        this.fundo.src = 'maps/map1/fundoAreia.png';
        this.roomChef.src = 'maps/map1/salaChef.png';
    }

    draw(){
        if(this.room == 'mapa'){
            ctx.drawImage(this.fundo, 0,0,(screenCanvas.offsetWidth-2),this.x+(screenCanvas.offsetHeight-2),0,0,(screenCanvas.offsetWidth-2),this.x+(screenCanvas.offsetHeight-2));
            ctx.drawImage(this.map, this.x,this.y,(screenCanvas.offsetWidth-2),this.x+(screenCanvas.offsetHeight-2),0,0,(screenCanvas.offsetWidth-2),this.x+(screenCanvas.offsetHeight-2));
        }else{
            ctx.drawImage(this.roomChef, 0+(this.spriteNumber*(screenCanvas.offsetWidth-2)),0,(screenCanvas.offsetWidth-2),this.x+(screenCanvas.offsetHeight-2),0,0,(screenCanvas.offsetWidth-2),this.x+(screenCanvas.offsetHeight-2));
            this.mobChef.draw();
        }
        if(this.room == 'mapa'){
            this.mobs.map(function(mob){
                mob.draw();
            })
        }
        ctx.fillStyle = 'rgba(0,0,0,'+(1-this.transition)+')';
        ctx.fillRect(0,0,900,600);
    }

    update(){
        if(this.room == 'mapa'){
            this.mobs.map(function(mob){
                mob.update();
            });
        }else{
            this.mobChef.update();
        }

        this.frame++;
        this.frameTrasition++;

        if(this.frame == this.timeSprite){
            this.frame = 0;
            this.spriteNumber++;
        }

        if(this.frameTrasition == this.timeTransition){
            this.frameTrasition = 0;
            this.transition+=0.1;
        }

        if(this.spriteNumber >= this.quantSprite){
            this.spriteNumber = 0;
        }
    }
}