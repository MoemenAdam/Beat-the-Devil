'use strict';
// Music Start

var sound = new Howl({
    urls: ['Music/Song2.mp3'],
    loop :true,
    volume : 0.01,
});

var sound2 = new Howl({
    urls: ['Music/AttackSound2.mp3'],
    autoplay : false,
    volume : 0.1,
});

var sound3 = new Howl({
    urls: ['Music/hit.mp3'],
    autoplay : false,
    volume : 0.1,
});
// Music End

let canvas = document.getElementById('GameScreen');
let c = canvas.getContext('2d');


/* Main varaiables */
canvas.width = 1500;
canvas.height = 576;
let Gravity = 0.5;
let MainWidth = 55,Mainheight = 100;
let xPressed=false;
let LeftP=false,RightP=false,xP=false,Dash=false;
let LastL=false,LastUpdated='idle';
let EnemyDone=false;
let NextPhases=false,cntr=0;
/* Main varaiables */



// Background Calss 
class Assets{
    constructor(a,b,imageSrc){
        this.position={
            x : a,
            y : b,
        };
        this.image=new Image();
        this.image.src=imageSrc;
    }
    imageDraw(){
        if(this.image)
            c.drawImage(this.image,this.position.x,this.position.y,canvas.width,canvas.height)
    }

    imageUpdate(){
        this.imageDraw();
    }
};

// Player an others like (Enemy etc..) Class
class Player{
    constructor(a,b,FramesRate=9,imageSrc,animation,PlayerGraph=330,hitboxX=80,hitboxY=141){
        // position of x,y for each player
        this.position={
            x : a,
            y : b,
        };

        this.CanMove={
            x:0,
            y:1,
        }
        this.height;
        this.width;
        this.FramesRate=FramesRate;
        this.PlayerGraph=PlayerGraph;
        this.hitboxX=hitboxX;
        this.hitboxY=hitboxY;
        
        this.Scale=0.5;
        this.image=new Image();
        this.image.onload = () =>{
            this.width=((this.image.width/this.FramesRate) + 600)*this.Scale;
            this.height=(this.image.height + 600)*this.Scale;
        };
        this.image.src=imageSrc;
        this.Frame=0;
        this.NumberofFramesPassed=0;
        this.Delay=15;

        this.CurrentAnimation;
        // this.CurrentAnimation.isActive=false;

        Mainheight=this.height;
        MainWidth=this.width;


        this.Animation = animation;
        for(let i in this.Animation){
            const image=new Image();
            image.src = this.Animation[i].imageSrc;
            this.Animation[i].image=image;
        }
        this.loop=true;
    }
    swichAnimation(key){
        if(this.image === this.Animation[key].image)return;

        this.image = this.Animation[key].image;
        this.Delay = this.Animation[key].Delay;
        this.FramesRate = this.Animation[key].FrameRate;
        this.CurrentAnimation = this.Animation[key];
        if(key === 'Death' || key === 'start' || key === 'end')this.loop=false;
    }


    PlayerDraw(){
        if(!this.image)return;

        const Box={
            position : {
                x:this.Frame * (this.image.width/this.FramesRate),
                y:0,
            },
            width : (this.image.width/this.FramesRate),
            height : this.image.height,

        };
        c.drawImage(
            this.image,
            Box.position.x,
            Box.position.y,
            Box.width,
            Box.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        
    }

    PlayerGoDown(){
        /*
            here we have to change our Gravity Variable
            Stop Our Graphity when whe touch the ground
        */
       
        this.position.y+=this.CanMove.y;

        
        if(this.position.y +  this.CanMove.y<(this.PlayerGraph + canvas.height-576))this.CanMove.y+=Gravity;
        else this.CanMove.y=0;
    }

    PlayerMoving(){
        /*
           here we have to change our Moving Variable
           Stop Our Moving Key when whe touch the borders
           of our GameScreen (right,left) not Monitor Screen
        */
        
        if(this.position.x + this.hitBox.width + this.CanMove.x<=canvas.width &&
             this.position.x + this.hitBox.width + this.CanMove.x>=120)
            this.position.x+=1.5*this.CanMove.x;
        else this.CanMove.x=0;

    }
    FrameUpdate(){
        this.NumberofFramesPassed++;

        if(this.NumberofFramesPassed%this.Delay === 0){
            if(this.Frame<(this.FramesRate-1))this.Frame++;
            else if(this.loop) this.Frame=0;
        }

        if(this.CurrentAnimation?.onComplete){
            if(this.Frame === this.FramesRate-0.9 || this.Frame === this.FramesRate-0.1){
                this.CurrentAnimation.onComplete()
            }
            if(this.Frame === this.FramesRate-1 && !this.CurrentAnimation.isActive){
                this.CurrentAnimation.onComplete();
                if(EnemyDone){
                    this.image.src='images/None.png';
                    document.querySelector('.parent').style.opacity='0.2';
                    document.querySelector('.DivelSpeach').style.display='block';
                    document.querySelector('.DivelSpeach').innerHTML = '<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&duration=3000&pause=500&color=F7F7F7&width=1000&lines=uhh+You+Got+Me+.+.+.+.+.+.+.;My+Lord+Is+not+Weak+like+Me;After+all+he+is+the+Devil+and+iam+his+Servant;"/>';
                    NextPhases=true;
                }
                this.CurrentAnimation.isActive=true;
            }
        }
    }

    PlayerUpdate(){
        this.FrameUpdate();
        this.hitBox = {
            position:{
                x : this.position.x+this.hitboxX ,
                y : this.position.y+this.hitboxY 
            },

            width : 150,
            height : 115,
        }

        // c.fillStyle='rgba(255,0,0,0.2)';
        // c.fillRect(this.hitBox.position.x,this.hitBox.position.y,
        //     this.hitBox.width,this.hitBox.height);

        this.PlayerDraw();
        this.PlayerGoDown();
        this.PlayerMoving();
    }
};
//Math.floor(Math.random() * (canvas.width-MainWidth)),canvas.height-Mainheight

const overlay = {
    opacity:0,
}


let Player1;
let Enemy;
let Portal;
let background;

let Level = 1;
let Levels ={
    1:{
        init:()=>{
            background = new Assets(0,0,'images/Background/Background3.png');
            Portal = new Player(1160,320,8,'images/Portalidle.png',{
                idle:{
                    imageSrc : 'images/Portalidle.png',
                    FrameRate : 8,
                    Delay : 15
                },
                start:{
                    imageSrc : 'images/Portalstart.png',
                    FrameRate : 8,
                    Delay : 15,
                },
                end:{
                    imageSrc : 'images/Portalend.png',
                    FrameRate : 8,
                    Delay : 15,
                    loop:false,
                },
                None:{
                    imageSrc : 'images/None.png',
                    FrameRate : 1,
                    Delay : 1
                }
            });
            Enemy = new Player(1160,320,9,'images/idle/idleLeft.png',{
                idle:{
                    imageSrc : 'images/idle/idleLeft.png',
                    FrameRate : 9,
                    Delay : 15
                },
                idleLeft:{
                    imageSrc : 'images/idle/idle.png',
                    FrameRate : 9,
                    Delay : 15
                },
                Run:{
                    imageSrc : 'images/Movement/RunLeft.png',
                    FrameRate : 6,
                    Delay : 15
                },
                RunLeft:{
                    imageSrc : 'images/Movement/Run.png',
                    FrameRate : 6,
                    Delay : 15
                },
                Attack:{
                    imageSrc : 'images/Attack/AttackLeft.png',
                    FrameRate : 12.08,
                    Delay : 10
                },
                AttackLeft:{
                    imageSrc : 'images/Attack/Attack.png',
                    FrameRate : 11.9,
                    Delay : 10
                },
                Death:{
                    imageSrc : 'images/Death/Death.png',
                    FrameRate : 23,
                    Delay : 15,
                    onComplete:() =>{
                        
                    },
                },
                None:{
                    imageSrc : 'images/None.png',
                    FrameRate : 1,
                    Delay : 1
                }
            });
            Player1 = new Player(0,420,4,'images/Warrior/idle.png',{
                idle:{
                    imageSrc : 'images/Warrior/idle.png',
                    FrameRate : 4,
                    Delay : 25
                },
                idleLeft:{
                    imageSrc : 'images/Warrior/idleLeft.png',
                    FrameRate : 4,
                    Delay : 25
                },
                Run:{
                    imageSrc : 'images/Warrior/Run.png',
                    FrameRate : 6,
                    Delay : 15
                },
                RunLeft:{
                    imageSrc : 'images/Warrior/RunLeft.png',
                    FrameRate : 6,
                    Delay : 15
                },
                Attack:{
                    imageSrc : 'images/Warrior/Attack.png',
                    FrameRate : 6.9,
                    Delay : 10,
                    onComplete:() =>{
                        cntr++;
                        if(cntr%10==0){sound2.play();}
                    },
                },
                AttackLeft:{
                    imageSrc : 'images/Warrior/AttackLeft.png',
                    FrameRate : 7.1,
                    Delay : 10,
                    onComplete:() =>{
                        cntr++;
                        if(cntr%10==0){sound2.play();}
                    },
                },
                Death:{
                    imageSrc : 'images/Warrior/Death.png',
                    FrameRate : 11,
                    Delay : 30
                },
                None:{
                    imageSrc : 'images/None.png',
                    FrameRate : 5,
                    Delay : 2
                }
            },430,-20,40);
        }
    },
    2:{
        init:()=>{
            background = new Assets(0,0,'images/Background/Background2.png');
            Portal = new Player(1160,320,8,'images/Portalidle.png',{
                idle:{
                    imageSrc : 'images/Portalidle.png',
                    FrameRate : 8,
                    Delay : 15
                },
                None:{
                    imageSrc : 'images/None.png',
                    FrameRate : 1,
                    Delay : 1
                }
            });
            Enemy = new Player(1160,320,9,'images/idle/idleLeft.png',{
                idle:{
                    imageSrc : 'images/idle/idleLeft.png',
                    FrameRate : 9,
                    Delay : 15
                },
                idleLeft:{
                    imageSrc : 'images/idle/idle.png',
                    FrameRate : 9,
                    Delay : 15
                },
                Run:{
                    imageSrc : 'images/Movement/RunLeft.png',
                    FrameRate : 6,
                    Delay : 15
                },
                RunLeft:{
                    imageSrc : 'images/Movement/Run.png',
                    FrameRate : 6,
                    Delay : 15
                },
                Attack:{
                    imageSrc : 'images/Attack/AttackLeft.png',
                    FrameRate : 12.08,
                    Delay : 10
                },
                AttackLeft:{
                    imageSrc : 'images/Attack/Attack.png',
                    FrameRate : 11.9,
                    Delay : 10
                },
                Death:{
                    imageSrc : 'images/Death/Death.png',
                    FrameRate : 23,
                    Delay : 15,
                    onComplete:() =>{
                        
                    },
                },
                None:{
                    imageSrc : 'images/None.png',
                    FrameRate : 1,
                    Delay : 1
                }
            });
            Player1 = new Player(0,420,4,'images/Warrior/idle.png',{
                idle:{
                    imageSrc : 'images/Warrior/idle.png',
                    FrameRate : 4,
                    Delay : 25
                },
                idleLeft:{
                    imageSrc : 'images/Warrior/idleLeft.png',
                    FrameRate : 4,
                    Delay : 25
                },
                Run:{
                    imageSrc : 'images/Warrior/Run.png',
                    FrameRate : 6,
                    Delay : 15
                },
                RunLeft:{
                    imageSrc : 'images/Warrior/RunLeft.png',
                    FrameRate : 6,
                    Delay : 15
                },
                Attack:{
                    imageSrc : 'images/Warrior/Attack.png',
                    FrameRate : 6.9,
                    Delay : 10,
                    onComplete:() =>{
                        cntr++;
                        if(cntr%10==0){sound2.play();}
                    },
                },
                AttackLeft:{
                    imageSrc : 'images/Warrior/AttackLeft.png',
                    FrameRate : 7.1,
                    Delay : 10,
                    onComplete:() =>{
                        cntr++;
                        if(cntr%10==0){sound2.play();}
                    },
                },
                Death:{
                    imageSrc : 'images/Warrior/Death.png',
                    FrameRate : 11,
                    Delay : 30
                },
                None:{
                    imageSrc : 'images/None.png',
                    FrameRate : 5,
                    Delay : 2
                }
            },430,-20,40);
        }
    }
};


Levels[Level].init();

let DamageCounter=0,Damage2Counter=0,AttackCounter=0,Attack2Counter=0,EnemyHealthBar=10,PlayerHealthBar=1;
let EnemySpeed=5,ShouldiStop=false,EnemyDeath=false,PlayerDeath=false;

let DefPlayerX=0,DefPlayerY=320,DefEnemyX,DefEnemyY,DeathFrames=0,PlayerStaminaBar=1,cntrStamina=0;
let StaminaDelay=0;
Enemy.Scale=0.5;
Player1.Scale=0.23;
const arr=[128,366];
let EnemyDelay=0;


function DeathScene(){
    window.requestAnimationFrame(DeathScene);  
    background.imageUpdate();
    Player1.PlayerUpdate();
    Enemy.PlayerUpdate();
    document.querySelector('#PlayerStaminaBar').style.width='0%';
    document.querySelector('.parent').style.opacity = '0.2';

    

    Player1.CanMove.x=0;
    Player1.CanMove.y=0;
    Player1.swichAnimation('Death');

    if(ShouldiStop === false){
        Player1.swichAnimation('Death');
    }

    if(Player1.position.x > Enemy.position.x)Enemy.swichAnimation('idleLeft');
    else Enemy.swichAnimation('idle');
    DeathFrames++;

    if(DeathFrames>=220){
        Player1.swichAnimation('None');
        Player1.CanMove.x=0;
        Player1.CanMove.y=0;
        ShouldiStop=true;
    }
}

function EnemyDeathScene(){
    window.requestAnimationFrame(EnemyDeathScene);  
    background.imageUpdate();
    Player1.PlayerUpdate();
    Enemy.PlayerUpdate();
    Player1.CanMove.x=0;
    document.querySelector('#PlayerStaminaBar').style.width='0%';
    document.querySelector('.parent').style.opacity = '0.2';
    


    if(ShouldiStop === false){
        Enemy.swichAnimation('Death');
        Enemy.position.y=330;
        Enemy.CanMove.x=0;
    }

    if(Player1.position.x > Enemy.position.x)Player1.swichAnimation('idleLeft');
    else Player1.swichAnimation('idle');
    DeathFrames++;
    if(DeathFrames>=220){
        Enemy.swichAnimation('None');
        Enemy.position.y=330;
        Enemy.CanMove.x=0;
        Enemy.CanMove.y=0;
        ShouldiStop=true;
    }
    
}

let test=35,testy=310;
function Anime(){
    // Main Screen Reapeat
    if(Level>=2 && EnemyDone){
        console.log('Won');
        document.querySelector('.DivelSpeach').style.display='none';
        document.querySelector('#winScreen').style.display='block';
        document.querySelector('#winScreenBTN').addEventListener("click",()=>{
            location.reload();
        });
        ShouldiStop=true;
        EnemyDeath=true;
    }
    if(!ShouldiStop)window.requestAnimationFrame(Anime);
    else {
        ShouldiStop=false;
        
        if(PlayerDeath)DeathScene();
        else if(EnemyDeath)EnemyDeathScene();
    }
    EnemyDelay++;
    // Allways draw our Background top of other Characters and players  
    background.imageUpdate();

    // Draw our (Players/Enemies) everytime
    
    Player1.Animation['Attack'].image.height=test;
    Player1.Animation['AttackLeft'].image.height=test;
    if(NextPhases && Level <2){
        Portal.PlayerUpdate();
        if(Portal.position.x-Player1.position.x <=-60 && Portal.position.x-Player1.position.x>=-127 && Player1.CanMove.y==0){
            // document.querySelector('#WinScreen').style.display='block';
            // document.querySelector('#WinScreenBTN').addEventListener("click",()=>{
            //     location.reload();
            // });
            // ShouldiStop=true;
            // EnemyDeath=true;
            Player1.CanMove.x=0;
            document.querySelector('.DivelSpeach').style.display='none';
            NextPhases=false;
            gsap.to(overlay,{
                opacity:1,
                onComplete: ()=>{
                    Level++;
                    Levels[Level].init();
                    Player1.Scale=0.23;
                    gsap.to(overlay,{
                        opacity:0,
                    })
                    sound.play();
                }
            });
            EnemyDone=false;
            EnemyHealthBar=0;
            document.querySelector('#PlayerHealthBar').style.width='0%';
            document.querySelector('#HealthBar').style.width ='0%';
            document.querySelector('.parent').style.opacity='1';
            DamageCounter=0;Damage2Counter=0;AttackCounter=0;Attack2Counter=0;EnemyHealthBar=10;PlayerHealthBar=1;
            EnemySpeed=5;ShouldiStop=false;EnemyDeath=false;PlayerDeath=false;
            DefPlayerX=0,DefPlayerY=320,DefEnemyX,DefEnemyY,DeathFrames=0,PlayerStaminaBar=1,cntrStamina=0;
            StaminaDelay=0;
            Enemy.Scale=0.5;
            Player1.Scale=0.23;
            EnemyDelay=0;
        }
    }
    
    Player1.PlayerUpdate();
    Enemy.PlayerUpdate();
    // Move enemy towards Our Player
    if(!EnemyDone){
        if(EnemyDelay>=120){
            if(Player1.position.x +10 < Enemy.position.x ){
                Enemy.swichAnimation('Run');
                Enemy.position.x-=EnemySpeed;
                AttackCounter=0;
            }else{
                if(Player1.position.x  > Enemy.position.x + 230){
                    AttackCounter=0;
                    Enemy.swichAnimation('RunLeft');
                    Enemy.position.x+=EnemySpeed;
                }else{
                    Enemy.position.y=345;
                    if(Player1.CanMove.y === 0){   
                        if(Player1.position.x  -100 <= Enemy.position.x)Enemy.swichAnimation('Attack');
                        else Enemy.swichAnimation('AttackLeft');
                        AttackCounter++;
                        if(Player1.position.x+100 >= Enemy.position.x)DamageCounter+=(1/120);
                        
                    }else {
                        AttackCounter=0;
                        if(Player1.position.x>= Enemy.position.x)Enemy.swichAnimation('idleLeft');
                        else Enemy.swichAnimation('idle');
                    }

                    if(DamageCounter>=0.8){
                        DamageCounter=0;
                        AttackCounter=0;
                        document.querySelector('#PlayerHealthBar').style.width = EnemyHealthBar +'%';
                        EnemyHealthBar +=10;
                        sound3.play();
                    }
                    // Player  Dies
                    if(EnemyHealthBar >= 110){
                        document.querySelector('#LoseScreen').style.display='block';
                        document.querySelector('#LoseScreenBTN').addEventListener("click",()=>{
                            location.reload();
                        });
                        ShouldiStop=true;
                        PlayerDeath=true;
                    }
                    if(EnemyHealthBar >=110){
                        EnemyHealthBar-=10;
                    }   
                }
            }
        }
    }

    Player1.CanMove.x=0;
    Enemy.CanMove.x=0;
    if(LeftP){
        Player1.swichAnimation('RunLeft');
        Player1.CanMove.x=-5;
        LastUpdated='RunLeft';
    }
    else if(RightP){
        Player1.swichAnimation('Run');
        Player1.CanMove.x=5;
        LastUpdated='Run';
    }else if(Player1.CanMove.y === 0){
        if(LastL){Player1.swichAnimation('idleLeft');LastUpdated='idleLeft';}
        else {Player1.swichAnimation('idle');LastUpdated='idle';}
    }
    
    if(xP){
        if(LastL){Player1.swichAnimation('AttackLeft');LastUpdated='AttackLeft';}
        else {Player1.swichAnimation('Attack');LastUpdated='Attack';}
        // xP=false;
        // Edit if Enemy Attacked
        if(Player1.position.x <= Enemy.position.x+150)if(Player1.position.x <= Enemy.position.x+150  && Player1.position.x+50 >= Enemy.position.x  && Player1.CanMove.y===0)Damage2Counter+=(1/120);
        
        if(Damage2Counter>=0.07){
            Damage2Counter=0;
            document.querySelector('#HealthBar').style.width = PlayerHealthBar +'%';
            PlayerHealthBar +=1;

        }
        // Enemy Dies
        if(PlayerHealthBar === 101){
            // document.querySelector('#WinScreen').style.display='block';
            // document.querySelector('#WinScreenBTN').addEventListener("click",()=>{
            //     location.reload();
            // });
            // ShouldiStop=true;
            // EnemyDeath=true;
            if(!EnemyDone)Enemy.swichAnimation('Death');
            EnemyDone=true;
        }
        if(PlayerHealthBar >101){
            PlayerHealthBar-=1;
        }
    }
    StaminaDelay++;
    if(StaminaDelay >=150){
        document.querySelector('#PlayerStaminaBar').style.width='0%';
        PlayerStaminaBar=1;
    }
    if(Dash && PlayerStaminaBar<=100){
        StaminaDelay=0;
        if(LastL){
            document.querySelector('#PlayerStaminaBar').style.width = PlayerStaminaBar +'%';
            PlayerStaminaBar++;
            Player1.swichAnimation(LastUpdated);
            Player1.CanMove.x=-11;
            Player1.swichAnimation('RunLeft');
        }
        else {
            document.querySelector('#PlayerStaminaBar').style.width = PlayerStaminaBar +'%';
            PlayerStaminaBar++;
            Player1.swichAnimation(LastUpdated);
            Player1.CanMove.x=11;
            Player1.swichAnimation('Run');
        }
    }


    c.save();
    c.globalAlpha = overlay.opacity;
    c.fillstyle='black';
    c.fillRect(0,0,canvas.width,canvas.height);
    c.restore();
}
Anime();


window.addEventListener("keydown",(e)=>{
    switch(e.key){
        case 'ArrowLeft':
            LeftP=true;
            LastL=true;
            break;
        case 'ArrowRight':
            RightP=true;
            LastL=false;
            break;
        case 'ArrowUp':
        case ' ':
            if(Player1.CanMove.y==0)Player1.CanMove.y=-20;
            break;    
        case 'Shift':
            Dash=true;
            break;
        case 'x':
        case 'X':
        case 'ء':
        case ' ْ':
            xP=true;
            xPressed=true;
            break;
    }
});

window.addEventListener("keyup",(e)=>{
    switch(e.key){
        case 'ArrowLeft':
            LeftP=false;
            break;
        case 'ArrowRight':
            RightP=false;
            break;
        case 'Shift':
            Dash=false;
            break;
        case 'x':
        case 'X':
        case 'ء':
        case ' ْ':
            xP=false;
            // xPressed=true;
            break;
    }
});
