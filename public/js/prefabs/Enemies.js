var PoligonosDeLaMuerte = PoligonosDeLaMuerte || {score:0};

PoligonosDeLaMuerte.EnemyNormal = function(game, x, y, health,speed,target,collisionLayer) {
	Phaser.Sprite.call(this, game, x, y, 'zombie1');
    this.anchor.setTo(0.5);
    this.scale.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.game=game;
    this.player=target;
    this.target={'x':target.x,'y':target.y,'obj':this.player};
    this.collisionLayer = collisionLayer;
    this.health = health;
    this.MAX_SPEED = speed; // pixels/second
    this.MIN_DISTANCE_PLAYER = 10; // pixel
    this.MIN_DISTANCE_HAMBURGER = 100; // pixel
    //this.body.setSize(175,175,50,75);
    this.haveHamburger=false;
    this.playerDistance=0;
    this.hamburgerDistance=0;
    this.targets={};
    this.destroyFlag=false;
    this.borders=this.game.borders;
    
    this.getClosestTarget();
}

PoligonosDeLaMuerte.EnemyNormal.prototype = Object.create(Phaser.Sprite.prototype);
PoligonosDeLaMuerte.EnemyNormal.prototype.constructor = PoligonosDeLaMuerte.EnemyNormal;


PoligonosDeLaMuerte.EnemyNormal.prototype.update = function() {
    this.body.velocity.setTo(0, 0);  
    if(this.game.playerAlive){
        if(!this.destroyFlag){
            if(this.haveHamburger){
                this.game.physics.arcade.collide(this, this.collisionLayer,this.destroyEnemy.bind(this));
                this.moveEnemy(this.target.x, this.target.y);
            }else{
                this.game.physics.arcade.collide(this, this.collisionLayer);
                this.game.physics.arcade.collide(this, this.game.hamburgers,this.pickHamb.bind(this));
                if(this.target.obj !== undefined && this.target.obj.alive){
                    switch(this.target.obj.name) {
                        case "player":
                            this.moveEnemy(this.target.obj.x, this.target.obj.y);
                            
                            break;
                        case "hamburger":
                            this.moveEnemy(this.target.obj.x, this.target.obj.y);
                            
                            break;
                        default:
                            console.log("Error - "+this.target.obj.key);
                            this.body.velocity.setTo(0, 0);
                    }
                }else{
                    this.getClosestTarget();
                }
            }
        }else{
            this.destroy();
        }
    }
    else{
        this.body.velocity.setTo(0, 0);
    }
};


PoligonosDeLaMuerte.EnemyNormal.prototype.destroyEnemy = function(){
this.game.time.events.add(100, function() {
       this.destroyFlag=true;
    }, this);    
}

PoligonosDeLaMuerte.EnemyNormal.prototype.moveEnemy= function(x,y){
    var distance = this.game.math.distance(this.x, this.y, x, y);
    
    if (distance > this.MIN_DISTANCE_PLAYER) {
        var rotation = this.game.math.angleBetween(this.x, this.y, x, y);
        this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
        this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
        this.rotation = rotation;
    }else{
        this.body.velocity.setTo(0, 0);   
    }
}

PoligonosDeLaMuerte.EnemyNormal.prototype.getClosestTarget= function(){
    //Calcular distancia entre el enemigo y el personaje
    //Calcular distancia entre el enemigo y las hamburguesas
    //La distancia mas corta, se convierte en el proximo target
    
    var player_distance = this.game.math.distance(this.x, this.y, this.player.x, this.player.y);
    var distances = [];
    var minDis = player_distance;
    var target = {'x':this.player.x,'y':this.player.y,'obj':this.player};
    if(this.game.hamburgers.children.length>0){
        this.game.hamburgers.forEach(function(h,i){
            var dis=this.game.math.distance(this.x, this.y, h.x, h.y);
            distances.push({"obj":h,"distance":dis});
        }.bind(this));
        
        distances.forEach(function(d){
            if(!d.obj.isFollowed){
            if(d.distance < minDis){
                minDis=d.distance;
                target= {'x':d.obj.x,'y':d.obj.y,'obj':d.obj};
            }
            }
        });
        if(target.obj.key==='hamburger'){
            target.obj.isFollowed = true;
            this.target = target;
            console.log('targeteando a hamb')
        }else{
            console.log('targeteando a player')
        }
    }
    
    this.target={'x':target.x,'y':target.y,'obj':target.obj}
    
    
}


PoligonosDeLaMuerte.EnemyNormal.prototype.damage = function(amount) {
  
  this.health -= amount;
    
  if(this.health <= 0) {
    var emitter = this.game.add.emitter(this.x, this.y, 50);
    emitter.makeParticles('particulaSangre')
    emitter.minParticleSpeed.setTo(-50, -50);
    emitter.maxParticleSpeed.setTo(50, 50);
    emitter.gravity = 0;
    emitter.start(true, 250, null, 100);
    if(this.haveHamburger){
        var hamb= new PoligonosDeLaMuerte.Hamburgers(this.game,this.x,this.y);
        this.game.hamburgers.add(hamb);
        this.player.addScore(this.game.POINT_ENEMY_W_HAMB)
    }else{
        this.player.addScore(this.game.POINT_ENEMY_WO_HAMB)
        if(this.target.obj!== undefined && this.target.obj.key==='hamburger'){
         this.target.obj.isFollowed = false;
      }
    }  
    this.destroy();
  }
};


PoligonosDeLaMuerte.EnemyNormal.prototype.pickHamb = function(e,h) {
    this.loadTexture('zombie2', 0, false);
    this.haveHamburger=true;
    
    this.getClosestBorder();
    h.destroy();    
} 
PoligonosDeLaMuerte.EnemyNormal.prototype.stealHamb = function() {
    this.loadTexture('zombie2', 0, false);
    
    this.haveHamburger=true;
    
    this.getClosestBorder();   
} 

PoligonosDeLaMuerte.EnemyNormal.prototype.getClosestBorder = function(y,h) {   
    
    var goToPoint={'x':this.borders.xm,'y':this.borders.ym};
    var spawnArea = this.game.rnd.integerInRange(0, 3);
    switch(spawnArea) {
                case 0:
                    goToPoint.x=this.borders.xm;
                    goToPoint.y=this.game.rnd.realInRange(this.borders.ym, this.borders.yM);
                    break;
                case 1:
                    goToPoint.x=this.game.rnd.realInRange(this.borders.xm, this.borders.xM);
                    goToPoint.y=this.borders.yM;
                    break;
                case 2:
                    goToPoint.x=this.borders.xM;
                    goToPoint.y=this.game.rnd.realInRange(this.borders.ym, this.borders.yM);
                    break;
                case 3:
                    goToPoint.x=this.game.rnd.realInRange(this.borders.xm, this.borders.xM);;
                    goToPoint.y=this.borders.yM;
                    break;
                default:
    }
     this.target=goToPoint;   
};



PoligonosDeLaMuerte.EnemyBoss = function(game, x, y, health,speed,target,collisionLayer) {
	Phaser.Sprite.call(this, game, x, y, 'zombie1');
    this.anchor.setTo(0.5);
    this.scale.setTo(1.1);
    this.game.physics.arcade.enable(this);
    this.game=game;
    this.player=target;
    this.target={'x':target.x,'y':target.y};
    this.collisionLayer = collisionLayer;
    this.health = health;
    this.MAX_SPEED = speed; // pixels/second
    this.MIN_DISTANCE_PLAYER = 10; // pixel
    //this.body.setSize(175,175,50,75);
    this.haveHamburger=false;
    
    this.borders=this.game.borders;
}

PoligonosDeLaMuerte.EnemyBoss.prototype = Object.create(Phaser.Sprite.prototype);
PoligonosDeLaMuerte.EnemyBoss.prototype.constructor = PoligonosDeLaMuerte.EnemyBoss;


PoligonosDeLaMuerte.EnemyBoss.prototype.update = function() {
     this.body.velocity.setTo(0, 0);  
    if(this.game.playerAlive){
        if(!this.destroyFlag){
            if(this.haveHamburger){
                this.game.physics.arcade.collide(this, this.collisionLayer,this.destroyEnemy.bind(this));
                this.moveEnemy(this.target.x, this.target.y);
            }else{
                this.target={'x':this.player.x,'y':this.player.y};
                
                this.game.physics.arcade.collide(this, this.collisionLayer);
                this.moveEnemy(this.target.x, this.target.y);
                    }
        }else{
            this.destroy();
        }
    }
    else{
        this.body.velocity.setTo(0, 0);
    }
};

PoligonosDeLaMuerte.EnemyBoss.prototype.stealHamb = function() {
    this.loadTexture('zombie3', 0, false);
    //this.body.setSize(175,175,50,75);
    this.haveHamburger=true;
    
    this.getClosestBorder();   
} 

PoligonosDeLaMuerte.EnemyBoss.prototype.damage = function(amount) {
  
  this.health -= amount;
    var emitter = this.game.add.emitter(this.x, this.y, 50);
    emitter.makeParticles('particulaSangre')
    emitter.minParticleSpeed.setTo(-50, -50);
    emitter.maxParticleSpeed.setTo(50, 50);
    emitter.gravity = 0;
    emitter.start(true, 250, null, 100);
    
  if(this.health <= 0) {    
      this.player.addScore(this.game.POINT_ENEMY_BOSS);
      if(this.haveHamburger){
          this.circle = new Phaser.Circle(this.x, this.y, 250);
          var p = new Phaser.Point();
          for (var c = 0; c < 5; c++)
          {
              this.circle.random(p);
              //  We'll floor it as setPixel needs integer values and random returns floats
              p.floor();
              
              var hamb= new PoligonosDeLaMuerte.Hamburgers(this.game,p.x,p.y);
              this.game.hamburgers.add(hamb);
          }
      }
      this.destroy();
  }
};
PoligonosDeLaMuerte.EnemyBoss.prototype.getClosestBorder = function() {   
    
    var goToPoint={'x':this.borders.xm,'y':this.borders.ym};
    var spawnArea = this.game.rnd.integerInRange(0, 3);
    switch(spawnArea) {
                case 0:
                    goToPoint.x=this.borders.xm;
                    goToPoint.y=this.game.rnd.realInRange(this.borders.ym, this.borders.yM);
                    break;
                case 1:
                    goToPoint.x=this.game.rnd.realInRange(this.borders.xm, this.borders.xM);
                    goToPoint.y=this.borders.yM;
                    break;
                case 2:
                    goToPoint.x=this.borders.xM;
                    goToPoint.y=this.game.rnd.realInRange(this.borders.ym, this.borders.yM);
                    break;
                case 3:
                    goToPoint.x=this.game.rnd.realInRange(this.borders.xm, this.borders.xM);;
                    goToPoint.y=this.borders.yM;
                    break;
                default:
    }
     this.target=goToPoint;   
};
PoligonosDeLaMuerte.EnemyBoss.prototype.moveEnemy= function(x,y){
    var distance = this.game.math.distance(this.x, this.y, x, y);
    
    if (distance > this.MIN_DISTANCE_PLAYER) {
        var rotation = this.game.math.angleBetween(this.x, this.y, x, y);
        this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
        this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
        this.rotation = rotation;
    }else{
        this.body.velocity.setTo(0, 0);   
    }
}
PoligonosDeLaMuerte.EnemyBoss.prototype.destroyEnemy = function(){
this.game.time.events.add(100, function() {
       this.destroyFlag=true;
    }, this);    
}