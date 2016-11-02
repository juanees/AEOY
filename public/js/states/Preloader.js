var PoligonosDeLaMuerte = PoligonosDeLaMuerte || {score:0};

PoligonosDeLaMuerte.Preloader = function (game){
	this.preloadBar=null;
};

PoligonosDeLaMuerte.Preloader.prototype ={
	preload : function(){

		this.preloadBar=this.add.sprite(this.world.centerX,this.world.centerY,'preloaderBar');

		this.game.stage.backgroundColor = '#999999';
        this.preloadBar.anchor.setTo(0.5);
		
		this.time.advancedTiming = true;

		this.load.setPreloadSprite(this.preloadBar);
        
        this.load.tilemap('map','assets/data/level2.json',null,Phaser.Tilemap.TILED_JSON);
        this.load.image('tileset','assets/images/map/tileset.png'); 
        this.load.image('dirt','assets/images/map/dirt.png');
        
		this.load.image('player','assets/images/player2.png'); 
        this.load.image('playerLightning','assets/images/player_lightStrike.png'); 
        
        this.load.image('background','assets/images/background4.png');
        
        this.load.image('zombie1','assets/images/zombie1.png');
        this.load.image('zombie2','assets/images/zombie2.png');
        this.load.image('zombie3','assets/images/zombie3.png');
        
        
        this.load.image('hamburger','assets/images/hamburger.png');
        this.load.image('bullet','assets/images/bullet.png');
		this.load.image('titlescreen','assets/images/titlescreen.png');
		this.load.image('button','assets/images/button.png');
        
        this.load.image('keyBoard','assets/images/wasd.png');
        
        
    this.game.load.spritesheet('explosion', 'assets/gfx/explosion.png', 128, 128);
        
        
		this.load.image('particulaSangre','assets/images/particulaSangre.png');
	},
	create:function(){
      
		  this.state.start('MainMenu');
        //this.state.start('Level1');
        //this.state.start('GameOver');
	}
}