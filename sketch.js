var gameState;
var database;
var player1, playerIdle, playerImgRight, playerImgLeft;
var object, objectImg,objectGroup;
var playercount=0
var score=0;
var score1=0
var name1
function preload(){
  oi = loadImage("ob1.png");
  b1 = loadImage("cave.jpg");
  b2=loadImage("lava.jpg");
  playerIdle=loadImage("idle trans.png");
  playerImgRight=loadAnimation("right run1.png","right run2.png","right run3.png","right run4.png","right run5.png");
  playerImgLeft=loadAnimation("run1.png","run2.png","run3.png","run4.png");
}

function setup() {
  createCanvas(400, 400);

  database =firebase.database()
  gs = database.ref('gameState')
  gs.on("value",(state)=>{
    gameState=state.val()
  })

  pc=database.ref('playerCount')
  pc.on("value",(count)=>{
    playercount=count.val()
  })

  p1=database.ref('player1/position')
  p1.on("value",(d1)=>{
    pos1=d1.val()
    player1.x=pos1.x
    player1.y=pos1.y
  })

  p2=database.ref('player2/position')
  p2.on("value",(d2)=>{
    pos2=d2.val()
    player2.x=pos2.x
    player2.y=pos2.y
  })
  //background

  bg = createSprite(200,200,400,400)
  input1 = createInput('Name')
  button1=createButton('Hard')
  button2=createButton('Easy')
  title=createElement('h2')
  greeting=createElement('h2')
  objectGroup=createGroup();
  player1=createSprite(200,200,20,20);
  player1.visible=false
  player2=createSprite(200,200,20,20);
  player2.visible=false
  reset=createButton('RESET');
  reset.mousePressed(()=>{
    databasebase.ref('/').update({
      database:0,
      playerCount:0,
      'player1/time':0,
      'player2/time':0
    });

    database.ref('player1/position').update({
      'x':200,
      'y':200
    })

    database.ref('player2/position').update({
      'x':200,
      'y':200
    })
  })

}

function draw() {
  background(0);
  
if(gameState==0){
  button1.mousePressed(hide);
  button2.mousePressed(hide1);
  
}
if(gameState==1||gameState==2){
  score=score+Math.round(getFrameRate()/60);
  database.ref('player1/time').update({
    time:score
  })
  score1=score1+Math.round(getFrameRate()/60);
  database.ref('player2/time').update({
    time:score1
  })
  
}
  
if(gameState==1 && playercount == 2){
  bg.addImage(b1);
  bg.scale=0.4
  if(objectGroup.collide(player1)||objectGroup.collide(player2)){
    database.ref('/').update({
      'gameState' : 3
    })
    
  }
  player1.visible=true
  player2.visible=true
  if(keyDown("LEFT_ARROW")){
    player1.addAnimation("run",playerImgLeft);
    player1.velocityX=-5
    playe2.addAnimation("run",playerImgLeft);
    player2.velocityX=-5
    
    
  }else if(keyDown("RIGHT_ARROW")){
    player1.addAnimation("run1",playerImgRight);
    player1.velocityX=5
    player2.addAnimation("run1",playerImgRight);
    player2.velocityX=5
  }else{
    player1.addImage(playerIdle);
    player2.addImage(playerIdle);
  }
  objects();
  objectGroup.setVelocityYEach(10);
  
  database.ref('player1/position').update({
    x:player1.x,
    y:player1.y
  })
  database.ref('player2/position').update({
    x:player2.x,
    y:player2.y
  })
  greeting.hide()
}
  
if(gameState==2){
    player1.visible=true
    if(keyDown("LEFT_ARROW")){
    player1.addAnimation("run",playerImgLeft);
    player1.velocityX=-5
    
  }else if(keyDown("RIGHT_ARROW")){
    player1.addAnimation("run1",playerImgRight);
    player1.velocityX=5
  }else{
    player1.addImage(playerIdle);
  }
    bg.addImage(b1);
  bg.scale=0.4
  objects();
  objectGroup.setVelocityYEach(5);
  if(objectGroup.collide(player1)){
    database.ref('/').update({
      'gameState' : 3
    })
  }
}
if(gameState==3){
  objectGroup.setVelocityYEach(0)
    player1.velocityX=0
    objectGroup.destroyEach()
    bg.visible=false
    fill("yellow")
    textSize(20)
    text("GAME OVER ",0,100)
    if(score>score1){
    text("Player1 wins with lifetime:"+score,0,200)
    }
    else{
      text("Player1 wins with lifetime:"+score1,0,200)
    }
}
  drawSprites();
  text("Time:"+score,300,50);
}



function hide(){
  playercount=playercount+1
  database.ref('/').update({
    'playerCount' : playercount
  })
  if(playercount==2){
    database.ref('/').update({
      'gameState' : 1
    })
  }

  title.hide();
  button1.hide();
  button2.hide();
  input1.hide();
  name1 =input1.value()
  greeting.html("Hello " + name1)
  greeting.position(200,200)
 
}

function hide1(){
  database.ref('/').update({
    gameState : 2
  })
  title.hide();
  button1.hide();
  button2.hide();
  input1.hide();
}

function objects(){
  if(gameState==1){
    if(frameCount%5===0){
      object=createSprite(200,10,20,20);
      object.x = Math.round(random(20,300));
      object.addImage(oi);
      object.velocityY=5;
      object.scale=0.5
      object.lifetime=80;
      objectGroup.add(object);
  }
  }
  else if(gameState==2){
    if(frameCount%60===0){
      object=createSprite(200,10,20,20);
      object.x = Math.round(random(20,300));
      object.addImage(oi);
      object.velocityY=5;
      object.scale=0.5
      object.lifetime=80;
      objectGroup.add(object);
  }
  }
}
