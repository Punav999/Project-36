//Create variables here
var dog,happyDog,sadDog;
var foodStock,foods;
var database;
var lastFed,foodObject;
var bedroom,garden,washroom;
var gameState = "Hungry";

function preload()
{
  sadDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  garden = loadImage("virtual pet images/Garden.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
	//load images here
}

function setup() {
	createCanvas(800, 700);
  database = firebase.database()
   
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  dog=createSprite(400,400)
  dog.addImage(happyDog);
  dog.scale=0.5;
  foodObject=new Food();

  feed=createButton("Feed Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog)
  
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  
 fedTime=database.ref('FeedTime');
 fedTime.on("value",function(data){
    lastFed=data.val(); 
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val()
  });
}


function draw() {  
background(46,139,87);

if(gameState!="Hungry"){
feed.hide();
addFood.hide();
dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}
currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObject.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObject.bedroom();
}else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
  update("Bathing");
  foodObject.washroom();
}else{
  update("Hungry")
  foodObject.display();
}

foodObject.display()
feedTime=database.ref('Feedtime')
feedTime.on("value",(data)=>{
  lastFed=data.val()
})
  drawSprites();
  //add styles here
textSize(20);
fill("white")
text("Food= "+foods,200,100)
}

function readStock(data){
  foods=data.val();
  foodObject.updateFoodStock(foods);
 
}

function writeStock(x){
  
  database.ref('/').update({
    Food:x
  })
}
function addFoods(){
   foods++;
   database.ref('/').update({ Food : foods });
   } 
   function feedDog(){
      dog.addImage(happyDog); 
      foodObject.updateFoodStock(foodObject.foodStock-1);
       database.ref('/').update({ Food : foodObject.foodStock, 
        FeedTime : hour(),
        gameState:"Hungry"
      }); 
    }

    function update(state){
      database.ref('/').update({
        gameState:state
      });
    }
