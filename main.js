'use strict';
// Music Start


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
    constructor(a,b,FramesRate=9,imageSrc,animation){
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
        Mainheight=this.height;
        MainWidth=this.width;


        this.Animation = animation;
        for(let i in this.Animation){
            const image=new Image();
            image.src = this.Animation[i].imageSrc;
            this.Animation[i].image=image;
        }
    }
    swichAnimation(key){
        if(this.image === this.Animation[key].image)return;

        this.image = this.Animation[key].image;
        this.Delay = this.Animation[key].Delay;
        this.FramesRate = this.Animation[key].FrameRate;
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

        
        if(this.position.y +  this.CanMove.y<(330 + canvas.height-576))this.CanMove.y+=Gravity;
        else this.CanMove.y=0;
    }

    PlayerMoving(){
        /*
           here we have to change our Moving Variable
           Stop Our Moving Key when whe touch the borders
           of our GameScreen (right,left) not Monitor Screen
        */
        
        if(this.position.x + this.hitBox.width + this.CanMove.x<=canvas.width-90 &&
             this.position.x + this.hitBox.width + this.CanMove.x>=60)
            this.position.x+=1.5*this.CanMove.x;
        else this.CanMove.x=0;

    }
    FrameUpdate(){
        this.NumberofFramesPassed++;

        if(this.NumberofFramesPassed%this.Delay === 0){
            if(this.Frame<(this.FramesRate-1))this.Frame++;
            else this.Frame=0;
        }
    }

    PlayerUpdate(){
        this.FrameUpdate();
        this.hitBox = {
            position:{
                x : this.position.x+80 ,
                y : this.position.y+135 
            },

            width : 150,
            height : 115,
        }
        // c.fillStyle='rgba(0,255,0,0.2)';
        // c.fillRect(this.position.x,this.position.y,this.width,this.height);

        // c.fillStyle='rgba(255,0,0,0.2)';
        // c.fillRect(this.hitBox.position.x,this.hitBox.position.y,
        //     this.hitBox.width,this.hitBox.height);

        this.PlayerDraw();
        this.PlayerGoDown();
        this.PlayerMoving();
    }
};
//Math.floor(Math.random() * (canvas.width-MainWidth)),canvas.height-Mainheight

const Player1 = new Player(0,320,9,'images/idle/idle.png',{
    idle:{
        imageSrc : 'images/idle/idle.png',
        FrameRate : 9,
        Delay : 15
    },
    idleLeft:{
        imageSrc : 'images/idle/idleLeft.png',
        FrameRate : 9,
        Delay : 15
    },
    Run:{
        imageSrc : 'images/Movement/Run.png',
        FrameRate : 6,
        Delay : 15
    },
    RunLeft:{
        imageSrc : 'images/Movement/RunLeft.png',
        FrameRate : 6,
        Delay : 15
    },
    Attack:{
        imageSrc : 'images/Attack/Attack.png',
        FrameRate : 11.9,
        Delay : 2
    },
    AttackLeft:{
        imageSrc : 'images/Attack/AttackLeft.png',
        FrameRate : 12.06,
        Delay : 2
    },
    Death:{
        imageSrc : 'images/Death/Death.png',
        FrameRate : 23,
        Delay : 15
    },
    Hit:{
        imageSrc : 'images/Hit/Hit.png',
        FrameRate : 4.7,
        Delay : 20
    },
    None:{
        imageSrc : 'images/None.png',
        FrameRate : 5,
        Delay : 2
    }
});
const Enemy = new Player(1160,320,9,'images/idle/idleLeft.png',{
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
        FrameRate : 11.9,
        Delay : 2 
    },
    AttackLeft:{
        imageSrc : 'images/Attack/Attack.png',
        FrameRate : 12.06,
        Delay : 2
    },
    Death:{
        imageSrc : 'images/Death/Death.png',
        FrameRate : 23,
        Delay : 15
    },
    Hit:{
        imageSrc : 'images/Hit/Hit.png',
        FrameRate : 5,
        Delay : 2
    },
    None:{
        imageSrc : 'images/None.png',
        FrameRate : 1,
        Delay : 1
    }
});
const background = new Assets(0,0,'images/Background/Background3.png');

let DamageCounter=0,Damage2Counter=0,AttackCounter=0,Attack2Counter=0,EnemyHealthBar=20,PlayerHealthBar=1;
let EnemySpeed=5,ShouldiStop=false,EnemyDeath=false,PlayerDeath=false;

let DefPlayerX=0,DefPlayerY=320,DefEnemyX,DefEnemyY,DeathFrames=0,PlayerStaminaBar=1,cntrStamina=0;
let StaminaDelay=0;
Enemy.Scale=0.5;
function DeathScene(){
    window.requestAnimationFrame(DeathScene);  
    background.imageUpdate();
    Player1.PlayerUpdate();
    Enemy.PlayerUpdate();
    Player1.CanMove.x=0;
    Player1.CanMove.y=0;
    Player1.swichAnimation('Death');

    if(ShouldiStop === false){
        Player1.swichAnimation('Death');
        Player1.position.y=330;
    }

    if(Player1.position.x > Enemy.position.x)Enemy.swichAnimation('idleLeft');
    else Enemy.swichAnimation('idle');
    DeathFrames++;

    if(DeathFrames>=220){
        Player1.swichAnimation('None');
        Player1.position.y=320;
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
    Player1.position.y=330;
    Player1.CanMove.x=0;
    

    if(ShouldiStop === false){
        Enemy.swichAnimation('Death');
        Enemy.position.y=330;
        Enemy.CanMove.x=0;
    }

    if(Player1.position.x > Enemy.position.x)Player1.swichAnimation('idleLeft');
    else Player1.swichAnimation('idle');
    DeathFrames++;
    // console.log(DeathFrames);
    if(DeathFrames>=220){
        Enemy.swichAnimation('None');
        Enemy.position.y=330;
        Enemy.CanMove.x=0;
        Enemy.CanMove.y=0;
        ShouldiStop=true;
    }
}
let EnemyDelay=0
function Anime(){
    // Main Screen Reapeat
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
    Player1.PlayerUpdate();
    Enemy.PlayerUpdate();
    // Move enemy towards Our Player
    
    if(EnemyDelay>=120){
        if(Player1.position.x < Enemy.position.x - 100){
            Enemy.swichAnimation('Run');
            Enemy.position.x-=EnemySpeed;
            AttackCounter=0;
        }else{
            if(Player1.position.x > Enemy.position.x + 100){
                AttackCounter=0;
                Enemy.swichAnimation('RunLeft');
                Enemy.position.x+=EnemySpeed;
            }else{
                Enemy.Animation['AttackLeft'].Delay=10;
                Enemy.Animation['Attack'].Delay=10;
                Enemy.Animation['AttackLeft'].FrameRate=11.9;
                Enemy.Animation['Attack'].FrameRate=12.08;
                Enemy.position.y=345;
                if(Player1.CanMove.y === 0){   
                    if(Player1.position.x <=Enemy.position.x)Enemy.swichAnimation('Attack');
                    else Enemy.swichAnimation('AttackLeft');
                    AttackCounter++;
                    if(Player1.position.x+100 >= Enemy.position.x)DamageCounter+=(1/120);
                    
                }else {
                    AttackCounter=0;
                    if(Player1.position.x > Enemy.position.x)Enemy.swichAnimation('idleLeft');
                    else Enemy.swichAnimation('idle');
                }

                if(DamageCounter>=0.8){
                    DamageCounter=0;
                    AttackCounter=0;
                    document.querySelector('#PlayerHealthBar').style.width = EnemyHealthBar +'%';
                    EnemyHealthBar +=10;
                }
                // Player/Enemy  Dies
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

    Player1.CanMove.x=0;
    Enemy.CanMove.x=0;
    if(xP){ 
        if(LastL){Player1.swichAnimation('AttackLeft');LastUpdated='AttackLeft';}
        else {Player1.swichAnimation('Attack');LastUpdated='Attack';}
        // xP=false;
        // Edit if Enemy Attacked
        if(Player1.position.x <= Enemy.position.x+200  && Player1.position.x+180 >= Enemy.position.x  && Player1.CanMove.y===0)Damage2Counter+=(1/120);
        if(Damage2Counter>=0.1){
            Damage2Counter=0;
            document.querySelector('#HealthBar').style.width = PlayerHealthBar +'%';
            PlayerHealthBar +=1;
        }
            // Player/Enemy  Dies
        if(PlayerHealthBar === 101){
            document.querySelector('#LoseScreen').style.display='block';
            document.querySelector('#LoseScreenBTN').addEventListener("click",()=>{
                location.reload();
            });
            ShouldiStop=true;
            EnemyDeath=true;
        }
        if(PlayerHealthBar >=101){
            PlayerHealthBar-=1;
        }   
    }else if(LeftP){
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
        }
        else {
            document.querySelector('#PlayerStaminaBar').style.width = PlayerStaminaBar +'%';
            PlayerStaminaBar++;
            Player1.swichAnimation(LastUpdated);
            Player1.CanMove.x=11;
        }
    }
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

// window.addEventListener("keyup",(e)=>{
//     if(e.key === 'x' || e.key === 'X' || e.key === 'ء' || e.key === ' ْ'){
//         xP=true;
//         xPressed=false;
//     }
// });

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
