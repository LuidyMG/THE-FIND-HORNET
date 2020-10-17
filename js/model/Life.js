class Life{
    x;
    y;

    quant;
    frame = 0;
    timeSprite = 3;
    quantSprite;
    sprite = new Image();

    constructor(img,quant,entidade,x,y){
        this.x = x;
        this.y = y;

        this.quant = quant;
        this.sprite.src = 'sprites/life/'+img+'.png';
    }

    draw(){
        for(var i = 1; i <= this.quant; i++){
            ctx.drawImage(this.sprite, 0,0,32,32,this.x+(i*(32+5)),this.y,32,32);
        }
    }
}