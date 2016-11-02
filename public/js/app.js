var PoligonosDeLaMuerte = PoligonosDeLaMuerte || {score:0};

PoligonosDeLaMuerte.game = new Phaser.Game('100%', '100%', Phaser.WEBGL, 'game-canvas');


PoligonosDeLaMuerte.game.state.add('Boot', PoligonosDeLaMuerte.Boot);
PoligonosDeLaMuerte.game.state.add('Preloader', PoligonosDeLaMuerte.Preloader);
PoligonosDeLaMuerte.game.state.add('MainMenu', PoligonosDeLaMuerte.MainMenu);
PoligonosDeLaMuerte.game.state.add('Level1', PoligonosDeLaMuerte.Level1);
PoligonosDeLaMuerte.game.state.add('GameOver', PoligonosDeLaMuerte.GameOver);
PoligonosDeLaMuerte.game.state.start('Boot');
