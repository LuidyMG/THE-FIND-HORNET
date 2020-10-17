var canAudio = false;

function songOut(song,type,volume){
    if(canAudio){
        if(type == 'bottom'){
            for(var i = 0; i < document.getElementsByTagName('audio').length;i++){
                document.getElementsByTagName('audio')[i].pause();
            }
        }
        document.getElementById(song).volume = volume;
        document.getElementById(song).play();
    }
}

function songOutStop(song){
    document.getElementById(song).pause();
}