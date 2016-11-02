var PoligonosDeLaMuerte = PoligonosDeLaMuerte || {score:0};
PoligonosDeLaMuerte.MainMenu = function (game){};

var titlescreen;

PoligonosDeLaMuerte.MainMenu.prototype ={
	create:function(game){
        this.game.stage.backgroundColor = '#000000';
		var button = this.createButton(game,"Play",game.world.centerX,game.world.centerY+32, 300,100,
			function() {
			this.state.start('Level1');
			});
		/*this.createButton(game,"Volver",game.world.centerX,game.world.centerY+192, 300,100,
			function() {
			console.log("Volver");
			});*/
		titlescreen  = game.add.sprite(game.world.centerX,game.world.centerY-192,'titlescreen');
		titlescreen.anchor.setTo(0.5);
        this.camera.follow(button, Phaser.Camera.FOLLOW_LOCKON);
    },
	update:function(game){

	},
	createButton:function(game,string,x,y,w,h,callback) {
		var button1 = game.add.button(x,y,'button',callback,this,2,1,0);
		
		button1.anchor.setTo(0.5);
		button1.width = w;
		button1.height = h;

		var txt = game.add.text(button1.x,button1.y,string,
			{font:"72px Arial",fill:"#000",align:"center"});
		txt.anchor.setTo(0.5);
        return button1;
	}
		
};