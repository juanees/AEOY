
var PoligonosDeLaMuerte = PoligonosDeLaMuerte || {};

PoligonosDeLaMuerte.Level1 = function (game){};


//var player;
var controls ={};
var PLAYER_SPEED=350;

var FIRE_RATE_NORMAL=250;
var FIRE_RATE_MACHINE_GUN=50;

var NEXT_FIRE=0;

var NEXT_WAVE=true;
var TIME_BTW_WAVES=2000;

var MAX_ZOMBIES=5;
var WAVE_INCREMENT=5;
var WAVE_COUNT=1;


var amountZombies=0;

var PLAYER_LIFE=30;





PoligonosDeLaMuerte.Level1.prototype ={
    create:function(game){
        
        this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);
        this.DEBUG = false;
		this.INMUNE_TIME=250; 
        
        this.stage.backgroundColor='#FFFFF';
        
        this.game.POINT_ENEMY_W_HAMB=5;
        this.game.POINT_ENEMY_WO_HAMB=10;
        this.game.POINT_ENEMY_BOSS=50;
		
		this.map = this.game.add.tilemap('map');
        

		this.map.addTilesetImage('tileset','tileset');
        

        this.backgroundLayer = this.map.createLayer('backgroundLayer');
        

		this.plataformLayer = this.map.createLayer('plataformLayer');
        
        
        this.keyBoard  = game.add.sprite(100,100,'keyBoard');
        var txt = game.add.text(this.game.width/2,100,'Con Q cambias el arma 🔫',{font:"26px Arial",fill:"#FF0000",align:"center"});
        this.initPauseMenu();
        this.BULLET_TYPE=['NORMAL','MACHINE_GUN','ZEUS'];//,'FLAME_THROWER'];
        this.actualWeapon=0;
       
        this.initRespawns()
        this.initPlayer()        
        this.initZeus();
        this.initBullets()
        this.game.hamburgers = this.game.add.group();
        this.initEnemies()
        this.initGUI();
        this.plataformLayer.resizeWorld();
        
        
		//Extiende la pantalla hasta completarla
		//this.backgroundLayer.wrap = true;
        
        
        
       
		this.map.setCollisionBetween(1, 100, true, 'plataformLayer');
        
		controls = {			
			right:this.input.keyboard.addKey(Phaser.Keyboard.D),
		
			left:this.input.keyboard.addKey(Phaser.Keyboard.A),
		
			up:this.input.keyboard.addKey(Phaser.Keyboard.W),
		
			shoot:this.input.keyboard.addKey(Phaser.Keyboard.E),

			down:this.input.keyboard.addKey(Phaser.Keyboard.S),
            
            change: this.input.keyboard.addKey(Phaser.Keyboard.Q)
		};
    },
	update:function(game){
        this.player.body.velocity.setTo(0, 0);        
        if(this.game.playerAlive){
            
            this.game.world.bringToTop(this.player);
            this.physics.arcade.collide(this.player, this.plataformLayer);
            this.enemies.forEach(function(enemy){
                if(!enemy.haveHamburger)
                {
                    this.physics.arcade.collide(enemy, this.player,this.getDamage.bind(this));
                }
            }.bind(this));
            
            this.physics.arcade.collide(this.player, this.game.hamburgers,this.getHealth.bind(this));
            
            if(this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[this.BULLET_TYPE.indexOf('NORMAL')] || this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[this.BULLET_TYPE.indexOf('MACHINE_GUN')]){
                    
            }else{
                               
            }
            if(this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[this.BULLET_TYPE.indexOf('ZEUS')]){
                this.player.loadTexture('playerLightning', 0, false);
                this.player.scale.setTo(0.4);  
                PLAYER_SPEED=350;
            }else{
                this.game.physics.arcade.collide(this.bullets, this.enemies, this.damageEnemy.bind(this));
                this.player.loadTexture('player', 0, false);
                this.player.scale.setTo(0.25);
                if(this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[this.BULLET_TYPE.indexOf('MACHINE_GUN')])
                {
                    PLAYER_SPEED=250;
                }else{
                    PLAYER_SPEED=350;
                }
            }
            
            if(controls.change.isDown && this.player.changeWeapon){
                this.player.changeWeapon = false;
                this.game.time.events.add(200, function() {
                this.player.changeWeapon = true;}, this);
                this.actualWeapon++;
                this.actualWeapon>this.BULLET_TYPE.length-1 ? this.actualWeapon=0 : this.actualWeapon=this.actualWeapon
            }
            this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
            
            if(controls.shoot.isDown || this.game.input.activePointer.isDown){
                this.shoot();
            }
            if(controls.up.isDown){
                //player.animations.play('run');
                this.player.body.velocity.y -= PLAYER_SPEED;
            }
            else if(controls.down.isDown) {
                //player.animations.play('run');
                this.player.body.velocity.y += PLAYER_SPEED;
            }
            if(controls.left.isDown) {
                //player.animations.play('run');
                //player.scale.setTo(-1.5,1.5);
                this.player.body.velocity.x-=PLAYER_SPEED;
            }
            else if(controls.right.isDown) {
                //player.animations.play('run');
                //player.scale.setTo(1.5,1.5);
                this.player.body.velocity.x+=PLAYER_SPEED;
            }
            if(this.player.body.velocity.x==0 && this.player.body.velocity.y==0)
            {
                //player.animations.play('idle');
            }
            // Spawn a new ZOMBIE
            this.zombieTimer -= this.game.time.elapsed;
            if(amountZombies<MAX_ZOMBIES){
                if (this.zombieTimer <= 0) {
                    this.zombieTimer = this.game.rnd.integerInRange(500, 1000);
                    this.generateEnemies();
                }
            }
        }
        else{
            var txt = game.add.text(this.player.x,this.player.y,'FIN',{font:"72px Amatic SC",fill:"#FF0000",align:"center"});
            txt.anchor.setTo(0.5);
            var txt2 = game.add.text(this.player.x,this.player.y+100,'Puntaje: '+this.player.score ,{font:"72px Arial",fill:"#FF0000",align:"center"});
            txt2.anchor.setTo(0.5);
            this.game.time.events.add(8000, function() {
                    this.resetGame();
                }, this);   
            
            }
	},
	render:function(game) {
        //this.game.debug.text('Vida: '+this.player.life, 32, 30  );
        /*
        this.game.debug.text('Enemigos Vivos: ' + this.enemies.countLiving(), 32, 45);
        this.game.debug.text('Enemigos creados: ' + amountZombies +' de: '+MAX_ZOMBIES, 32,60);
        this.game.debug.text('Arma: '+this.BULLET_TYPE[this.actualWeapon], 32, 75);
        if(this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[0] || this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[1] ){
            this.game.debug.text('Balas Activas: ' + this.bullets.countLiving() + ' / ' + this.bullets.total, 32, 90);
        }*/
        if(this.DEBUG ){
             this.enemies.forEach(function(e){game.debug.body(e);});
            this.bullets.forEach(function(p){game.debug.body(p);});
            this.game.hamburgers.forEach(function(h){game.debug.body(h);});
            this.enemies.forEach(function(e){game.debug.body(e);});
            game.debug.body(this.player);
        }
    },
    initGUI : function(){
        this.GUIElements = this.game.add.group();
        var gui = new PoligonosDeLaMuerte.GUITotalHamburguers(this.game,20,10,this.player);
        this.GUIElements.add(gui);  
    },
    initPauseMenu : function(){
        this.pause = new PoligonosDeLaMuerte.PauseMenu(this.game);
    },
    initBullets: function() {
        //  Add a variance to the bullet angle by +- this value
        this.bulletAngleVariance=Math.PI;
        this.BULLET_TYPE[this.actualWeapon]=this.BULLET_TYPE[0];
    	this.bullets = this.game.add.group();
        for(var i=0;i<50;i++){this.bullets.add(new PoligonosDeLaMuerte.Normal(this.game,999999,999999));}
    },
    initPlayer: function() {
    	this.player=this.add.sprite(this.game.world.width/2, this.game.world.height/2,'player');
		this.player.anchor.setTo(0.5);
        this.player.scale.setTo(0.25);
		this.physics.arcade.enable(this.player);
		this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        this.player.x=this.game.world.width/2;
        this.player.y=this.game.world.height/2;
        this.player.body.collideWorldBounds=true;
        this.player.immune=false;
        this.player.changeWeapon=true;
        this.player.score=0;
        this.player.name='player';
        this.player.addScore = function (score){
            this.score+=score;
        }
        this.player.life=PLAYER_LIFE;
        this.player.shootTimeZeus = 0;
        this.game.playerAlive=true;        
    },
    initRespawns:function(){
        //this.respawnGroup = this.game.add.group();
        this.respawnGroup =[];
        this.map.objects.respawnLayer.forEach(function(element,index){
            this.respawnGroup.push(element);
        }.bind(this));
        
        this.game.borders={'xm':this.respawnGroup[0].x,'ym':this.respawnGroup[0].y,'xM':this.respawnGroup[2].x,'yM':this.respawnGroup[2].y}
    
        
    },
    initEnemies:function(){
        this.zombieTimer = 0;
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
    },
	resetGame:function() {
        this.game.state.start('MainMenu');       
	},
    generateEnemies:function(){       
        if(NEXT_WAVE){
            //var txt = this.game.add.text(this.game.width/2,this.game.height/2,'Ola NUMERO: '+WAVE_COUNT,{font:"72px Arial",fill:"#FF0000",align:"center"});
            //txt.anchor.setTo(0.5);
            amountZombies++;
            if(amountZombies === MAX_ZOMBIES)
            {
                amountZombies=0;
                MAX_ZOMBIES+=WAVE_INCREMENT;
                var enemigo = new PoligonosDeLaMuerte.EnemyBoss(this.game,this.respawnGroup[0].x,this.respawnGroup[2].y/2,25, PLAYER_SPEED*0.80,this.player,this.plataformLayer);
                this.enemies.add(enemigo); 
                NEXT_WAVE=false;
                this.game.time.events.add(TIME_BTW_WAVES, function() {
                    NEXT_WAVE=true;
                    WAVE_COUNT++;
                    
                }, this);   
            }else
            {
            var xMin=this.respawnGroup[0].x;
            var yMin=this.respawnGroup[0].y;
            var xMax=this.respawnGroup[2].x;
            var yMax=this.respawnGroup[2].y;

            var spawnPoint={'x':xMin,'y':yMin};
            
            var spawnArea = this.game.rnd.integerInRange(0, 3);

            switch(spawnArea) {
                case 0:
                    spawnPoint.x=xMin;
                    spawnPoint.y=this.game.rnd.realInRange(yMin, yMax);
                    break;
                case 1:
                    spawnPoint.x=this.game.rnd.realInRange(xMin, xMax);
                    spawnPoint.y=yMax;
                    break;
                case 2:
                    spawnPoint.x=xMax;
                    spawnPoint.y=this.game.rnd.realInRange(yMin, yMax);
                    break;
                case 3:
                    spawnPoint.x=this.game.rnd.realInRange(xMin, xMax);;
                    spawnPoint.y=yMin;
                    break;
                default:

            }
            var enemigo = new PoligonosDeLaMuerte.EnemyNormal(this.game,spawnPoint.x,spawnPoint.y,2, PLAYER_SPEED*0.90,this.player,this.plataformLayer);
            
            this.enemies.add(enemigo); 
        } 
        }        
    },
    getDamage:function(enemy,player){
        if(this.game.playerAlive){
            if(PoligonosDeLaMuerte.EnemyBoss.prototype.isPrototypeOf(enemy)){
                if(!player.inmune){
                    this.damagePlayer(10);
                }
            }
            else if(PoligonosDeLaMuerte.EnemyNormal.prototype.isPrototypeOf(enemy)){
                if (!player.immune){
                    this.damagePlayer(1);
                    enemy.stealHamb();
            }
            }
               
            
        }
    },
    damagePlayer:function(damagePoints){
        damagePoints=damagePoints || 1;
        this.player.immune = true;
        this.player.alpha = 0.5;
        this.game.time.events.add(this.INMUNE_TIME, function() {
        this.player.immune = false;
        this.player.alpha = 1;}, this);
        this.player.life-=damagePoints;
        if(this.player.life<=0){
            this.player.life=0;
            this.game.playerAlive=false;
        }
        var emitter = this.game.add.emitter(this.player.x, this.player.y, 50);
        emitter.makeParticles('particulaSangre')
        emitter.minParticleSpeed.setTo(-50, -50);
        emitter.maxParticleSpeed.setTo(50, 50);
        emitter.gravity = 0;
        emitter.start(true, 250, null, 100);
        /*this.redHitSprite.x= this.game.camera.x;
        this.redHitSprite.y = this.game.camera.y;
            
        this.redHit.alpha = 0.5;
        this.game.add.tween(this.redHit)
            .to({ alpha: 0 }, 100, Phaser.Easing.Cubic.In)
            .start();
        
        this.game.camera.y = 0;
        this.game.add.tween(this.game.camera)
            .to({ y: -2.5 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
            .start();*/
        this.game.camera.flash(0xff0000, this.INMUNE_TIME);

    },
    getHealth:function(p,h){
        this.player.life+=1;
        h.destroy();
        this.game.camera.flash(0x8688ff, 500);
    },
    grabHamburgerEnemy:function(e,h){
        e.haveHamb();
    },
    damageEnemy: function(bullet, enemy) {
        bullet.kill();
        enemy.damage(1);
  },
    initZeus:function(){
        // Create a group for explosions
        this.explosionGroup = this.game.add.group();
        // Create a bitmap for the lightning bolt texture
        //ORIGINLA -- this.lightningBitmap = this.game.add.bitmapData(200, 1000);
        this.lightningBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        // Create a sprite to hold the lightning bolt texture
        this.lightning = this.game.add.image(this.game.world.width, this.game.world.height, this.lightningBitmap);
        //this.lightning = this.game.add.image(this.player.x, this.player.y, this.lightningBitmap);
    
        // This adds what is called a "fragment shader" to the lightning sprite.
        // See the fragment shader code below for more information.
        // This is an WebGL feature. Because it runs in your web browser, you need
        // a browser that support WebGL for this to work.

        this.lightning.filters = [ this.game.add.filter('Glow') ];
        // Set the anchor point of the sprite to center of the top edge
        // This allows us to position the lightning by simply specifiying the
        // x and y coordinate of where we want the lightning to appear from.
        this.lightning.anchor.setTo(0.5, 0);
        

    },
    shoot :function() {
        if(this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[this.BULLET_TYPE.indexOf('ZEUS')]){
            this.player.shootTimeZeus -= this.game.time.elapsed;
            if(this.player.shootTimeZeus<= 0){
                
            this.player.shootTimeZeus = this.game.rnd.integerInRange(200, 500);
                this.game.camera.shake(0.01,250,true,Phaser.Camera.SHAKE_BOTH,true);
                    
                this.lightning.reset(this.player.x,this.player.y);
                
                
    
                
            // Kill enemys within 50 pixels of the strike
            this.enemies.forEachAlive(function(enemy) {

                if (this.game.math.distance((this.game.input.activePointer.x+ this.game.camera.x) / this.game.camera.scale.x, (this.game.input.activePointer.y+ this.game.camera.y) / this.game.camera.scale.y,enemy.x, enemy.y) < 50) 
                {
                    enemy.damage(20);
                    this.getExplosion(enemy.x, enemy.y);
                    
                }
            }, this);
            this.lightning.rotation =this.game.math.angleBetween(this.lightning.x, this.lightning.y,(this.game.input.activePointer.x+ this.game.camera.x) / this.game.camera.scale.x, (this.game.input.activePointer.y+ this.game.camera.y) / this.game.camera.scale.y) - Math.PI/2;
            var distance = this.game.math.distance(
            this.lightning.x, this.lightning.y,
            (this.game.input.activePointer.x+ this.game.camera.x) / this.game.camera.scale.x, (this.game.input.activePointer.y+ this.game.camera.y) / this.game.camera.scale.y);
            this.createLightningTexture(this.lightningBitmap.width/2,0, 20, 3, false, distance);
            this.lightning.alpha = 1;
            this.game.add.tween(this.lightning)
                .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
                .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
                .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
                .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
                .to({ alpha: 0 }, 250, Phaser.Easing.Cubic.In)
                .start();
            }
        }
        else if(this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[this.BULLET_TYPE.indexOf('NORMAL')]){//Normal
            if(this.time.now>NEXT_FIRE && this.bullets.countLiving() < 50){
                this.bullet = this.bullets.getFirstExists(false);
                
                if(this.bullet){
                    this.bullet.reset(this.player.x,this.player.y);
                    NEXT_FIRE=this.time.now + FIRE_RATE_NORMAL;
                    this.game.physics.arcade.moveToPointer(this.bullet, PLAYER_SPEED*1.2);
                    
                    
                }
            }
        }else if(this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[this.BULLET_TYPE.indexOf('MACHINE_GUN')]){ //MACHINE_GUN
            if(this.time.now>NEXT_FIRE && this.bullets.countLiving() < 110){
                this.bullet = this.bullets.getFirstExists(false);
                if(!this.bullet){
                    this.bullet= new PoligonosDeLaMuerte.Normal(this.game,999999,999999);
                    this.bullets.add(this.bullet);
                }
                this.bullet.reset(this.player.x,this.player.y);
                var rotation = this.game.math.angleBetween(this.bullet.x, this.bullet.y, (this.game.input.activePointer.x+ this.game.camera.x) / this.game.camera.scale.x, (this.game.input.activePointer.y+ this.game.camera.y) / this.game.camera.scale.y);
                NEXT_FIRE=this.time.now + FIRE_RATE_MACHINE_GUN;
                
                var randomRotation=this.game.rnd.realInRange(-this.bulletAngleVariance,this.bulletAngleVariance);
                
                this.bullet.body.velocity.x = Math.cos(rotation) * PLAYER_SPEED*1.5;
                this.bullet.body.velocity.y = Math.sin(rotation) * PLAYER_SPEED*1.5;
                this.bullet.rotation = rotation;
                this.game.add.tween(this.bullet)
                    .to({ rotation: rotation+randomRotation }, 100,Phaser.Easing.Cubic.In)
                    .start();
                
                
                
                
            }
        }
        
        /*BUCKUP*/
        /*
        else if(this.BULLET_TYPE[this.actualWeapon]===this.BULLET_TYPE[0]){
            if(this.time.now>NEXT_FIRE && this.bullets.countDead() > 0){
                this.bullet = this.bullets.getFirstExists(false);
                
                if(this.bullet){
                    this.bullet.reset(this.player.x,this.player.y);
                    NEXT_FIRE=this.time.now + fireRate;
                    this.game.physics.arcade.moveToPointer(this.bullet, 300);
                }else{console.log(this.bullet);}
            }
        }
        */
    },
    getExplosion : function(x,y){
        var explosion = this.explosionGroup.getFirstDead();
        if (explosion === null){
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete. Plays the first frame several times to make the
        // explosion more visible after the screen flash.
        var animation = explosion.animations.add('boom', [0,0,0,0,1,2,3], 60, false);
        animation.killOnComplete = true;

        // Add the explosion sprite to the group
        this.explosionGroup.add(explosion);
        }
        
        // Revive the explosion (set it's alive property to true)
        // You can also define a onRevived event handler in your explosion objects
        // to do stuff when they are revived.
        explosion.revive();
        // Move the explosion to the given coordinates
        explosion.x = x;
        explosion.y = y;
        // Set rotation of the explosion at random for a little variety
        explosion.angle = this.game.rnd.integerInRange(0, 360);
        // Play the animation
        explosion.animations.play('boom');
        // Return the explosion itself in case we want to do anything else with it
        return explosion;        
    },
    createLightningTexture: function(x, y, segments, boltWidth, branch, distance) {
        // Get the canvas drawing context for the lightningBitmap
        var ctx = this.lightningBitmap.context;
        var width = this.lightningBitmap.width;    
        var height = this.lightningBitmap.height;
   
        // Our lightning will be made up of several line segments starting at    
        // the center of the top edge of the bitmap and ending at the target.
        // Clear the canvas
        if (!branch) ctx.clearRect(0, 0, width, height);
        // Draw each of the segments
        for(var i = 0; i < segments; i++) {
            // Set the lightning color and bolt width
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.lineWidth = boltWidth;
            ctx.beginPath();
            ctx.moveTo(x, y);
            // Calculate an x offset from the end of the last line segment and
            // keep it within the bounds of the bitmap
            if (branch) {
                // For a branch
                x += this.game.rnd.integerInRange(-10, 10);
            } else {
                // For the main bolt
                x += this.game.rnd.integerInRange(-30, 30);
            }
            if (x <= 10) x = 10;
            if (x >= width-10) x = width-10;
            if (branch) {
                y += this.game.rnd.integerInRange(10, 20);
            } 
            else {
                y += this.game.rnd.integerInRange(20, distance/segments);
            }
            if ((!branch && i == segments - 1) || y > distance) {
                // This causes the bolt to always terminate at the center
                // lightning bolt bounding box at the correct distance to
                // the target. Because of the way the lightning sprite is
                // rotated, this causes this point to be exactly where the
                // player clicked or tapped.
                y = distance;
                if (!branch) x = width/2;
            }
            // Draw the line segment
            ctx.lineTo(x, y);
            ctx.stroke();

            // Quit when we've reached the target
            if (y >= distance) break;

            // Draw a branch 20% of the time off the main bolt only
            if (!branch) {
                if (Phaser.Utils.chanceRoll(90)) {
                    // Draws another, thinner, bolt starting from this position
                    this.createLightningTexture(x, y, 10, 1, true, distance);
                }
            }
        }  
        // This just tells the engine it should update the texture cache
        this.lightningBitmap.dirty = true;
    }
};

Phaser.Filter.Glow = function (game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
        "precision lowp float;",
        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",
        'uniform sampler2D uSampler;',

        'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -4; xx <= 4; xx++) {',
                'for(int yy = -3; yy <= 3; yy++) {',
                    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                    'float factor = 0.0;',
                    'if (dist == 0.0) {',
                        'factor = 2.0;',
                    '} else {',
                        'factor = 2.0/abs(float(dist));',
                    '}',
                    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
                '}',
            '}',
            'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
        '}'
    ];
}
Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow


function checkOverlap (spriteA,spriteB) {
	var boundsA = spriteA.getBounds();
	var boundsB = spriteB.getBounds();
	return Phaser.Rectangle.intersects(boundsA,boundsB);
}	