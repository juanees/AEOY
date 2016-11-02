var PoligonosDeLaMuerte = PoligonosDeLaMuerte || {score:0};
PoligonosDeLaMuerte.GameOver = function (game){};

var titlescreen;

PoligonosDeLaMuerte.GameOver.prototype ={
	create:function(game){
        this.game.stage.backgroundColor = '#000000';
        this.vidaText = game.add.text(game.world.centerX,game.world.y+60, "Puntaje: "+PoligonosDeLaMuerte.score);
        this.vidaText.fontSize = 100;
        this.vidaText.fixedToCamera=true;
        this.vidaText.font = 'Amatic SC';
        this.vidaText.fontSize = 100;
        this.vidaText.anchor.setTo(0.5);
    
    this.grdvidaText = this.vidaText.context.createLinearGradient(0, 0, 0, this.vidaText.canvas.height);
    this.grdvidaText.addColorStop(0, '#330000');   
    this.grdvidaText.addColorStop(1, '#ff0000');
    this.vidaText.fill = this.grdvidaText;
    
    this.vidaText.align = 'center';
    this.vidaText.stroke = '#000000';
    this.vidaText.strokeThickness = 2;
    this.vidaText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        var button = this.createButton(game,"Jugar de nuevo",game.world.centerX,game.world.centerY+32, 300,100,
			function() {
			this.state.start('Level1');
			});
		/*this.createButton(game,"Volver al inicio",game.world.centerX,game.world.centerY+192, 300,100,
			function() {
            
			});
		*/
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
			{font:"30px Arial",fill:"#000",align:"center"});
		txt.anchor.setTo(0.5);
        return button1;
	}
		
};