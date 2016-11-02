var PoligonosDeLaMuerte = PoligonosDeLaMuerte || {};

PoligonosDeLaMuerte.GUITotalHamburguers = function(game, x, y,player) {
	Phaser.Sprite.call(this, game, x, y, 'hamburger');
    //this.anchor.setTo(0.5);
    this.scale.setTo(0.4);
    this.game=game;
    this.player=player;
    this.fixedToCamera=true;
    
    this.vidaText = this.game.add.text(x+this.width-10, y, " X "+this.player.life);
    this.vidaText.fixedToCamera=true;
    this.vidaText.font = 'Amatic SC';
    this.vidaText.fontSize = 50;
    
    this.grdvidaText = this.vidaText.context.createLinearGradient(0, 0, 0, this.vidaText.canvas.height);
    this.grdvidaText.addColorStop(0, '#330000');   
    this.grdvidaText.addColorStop(1, '#ff0000');
    this.vidaText.fill = this.grdvidaText;
    
    this.vidaText.align = 'center';
    this.vidaText.stroke = '#000000';
    this.vidaText.strokeThickness = 2;
    this.vidaText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    
    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    
    this.puntajeText = this.game.add.text(x+this.width+this.vidaText.width, y, " Puntaje: "+ this.player.score);
    this.puntajeText.fixedToCamera=true;
    this.puntajeText.font = 'Amatic SC';
    this.puntajeText.fontSize = 50;
    
    this.grdpuntajeText = this.puntajeText.context.createLinearGradient(0, 0, 0, this.puntajeText.canvas.height);
    this.grdpuntajeText.addColorStop(0, '#330000');   
    this.grdpuntajeText.addColorStop(1, '#ff0000');
    this.puntajeText.fill = this.grdpuntajeText;
    
    this.puntajeText.align = 'center';
    this.puntajeText.stroke = '#000000';
    this.puntajeText.strokeThickness = 2;
    this.puntajeText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
}
PoligonosDeLaMuerte.GUITotalHamburguers.prototype = Object.create(Phaser.Sprite.prototype);
PoligonosDeLaMuerte.GUITotalHamburguers.prototype.constructor = PoligonosDeLaMuerte.GUITotalHamburguers;

PoligonosDeLaMuerte.GUITotalHamburguers.prototype.update = function() {
    this.vidaText.text=" X "+this.player.life;
    this.puntajeText.text=" Puntaje: "+ this.player.score;
}