var stage,
		shapes = [],
		slots = [],
		score = 0;

/**
 * Initializing the game
 */
function init () {
	stage = new createjs.Stage('canvas');
	buildShapes();
	setBlocks();
	startGame();
}

/**
 * Build the slots and draw them on canvas,
 * build the shapes and prepare to randomize them.
 * Every slot and shape gets a key to bind them together.
 * Both shapes and slots were pushed in their arrays.
 */
function buildShapes () {
	var colors = ['rect', 'circle', 'star', 'roundrect'],
			i,
			shape,
			slot;
	for ( i = 0; i < colors.length; i++ ) {
		slot = new createjs.Shape();
		slot.graphics.beginStroke('#000000');
		slot.graphics.beginFill('#ffffff');
		switch (i) {
			case i = 0:
				slot.graphics.drawRect(0, 0, 100, 100);
				slot.regX = slot.regY = 50;
				break;
			case i = 1:
				slot.graphics.drawCircle(0, 0, 50);
				slot.regX = slot.regY = 0;
				break;
			case i = 2:
				slot.graphics.drawPolyStar(0, 0, 50, 6, 0.6, -90);
				slot.regX = slot.regY = 0;
				break;
			case i = 3:
				slot.graphics.drawRoundRect(0, 0, 100, 100, 5);
				slot.regX = slot.regY = 50;
				break;
		}
		slot.key = i;
		slot.y = 80;
		slot.x = (i * 130) + 100;
		stage.addChild(slot);
		slots.push(slot);
		shape = new createjs.Shape();
		shape.graphics.beginFill('#000000');
		switch (i) {
			case i = 0:
				shape.graphics.drawRect(0, 0, 100, 100);
				shape.regX = shape.regY = 50;
				break;
			case i = 1:
				shape.graphics.drawCircle(0, 0, 50);
				shape.regX = shape.regY = 0;
				break;
			case i = 2:
				shape.graphics.drawPolyStar(0, 0, 50, 6, 0.6, -90);
				shape.regX = shape.regY = 0;
				break;
			case i = 3:
				shape.graphics.drawRoundRect(0, 0, 100, 100, 5);
				shape.regX = shape.regY = 50;
				break;
		}
		shape.key = i;
		shapes.push(shape);
	}
}

/**
 * Set the blocks on stage on random places
 */
function setBlocks () {
	var i,
			r,
			shape,
			l = shapes.length;
	for ( i = 0; i < l; i++ ) {
		r = Math.floor(Math.random() * shapes.length);
		shape = shapes[r];
		shape.homeY = 320;
		shape.homeX = (i * 130) + 100;
		shape.y = shape.homeY;
		shape.x = shape.homeX;
		shape.addEventListener('mousedown', startDrag);
		stage.addChild(shape);
		shapes.splice(r, 1);
	}
}

/**
 * Game logic:
 * Drag and drop the shapes,
 * test if they are over a suitable slot,
 * if yes, place them in slot and count up,
 * if no, remove them to their home place.
 *
 * @param {event} e - mousedown event
 */
function startDrag (e) {
	var shape = e.target,
			slot = slots[shape.key];
	stage.setChildIndex(shape, stage.getNumChildren() - 1);
	stage.addEventListener('stagemousemove', function (e) {
		shape.x = e.stageX;
		shape.y = e.stageY;
	});
	stage.addEventListener('stagemouseup', function (e) {
		var pt = slot.globalToLocal(stage.mouseX, stage.mouseY);
		stage.removeAllEventListeners();
		if ( shape.hitTest(pt.x, pt.y) ) {
			shape.removeEventListener('mousedown', startDrag);
			score++;
			createjs.Tween.get(shape).to({x:slot.x, y:slot.y}, 200,
				createjs.Ease.quadOut).call(checkGame);
		}
		else {
			createjs.Tween.get(shape).to({x:shape.homeX, y:shape.homeY}, 200,
				createjs.Ease.quadOut);
		}
	});
}

/**
 * Check if the shapes are all placed correctly.
 * If yes, give the user feedback.
 */
function checkGame () {
	if ( score === 4 ) {
		alert('You win!');
	}
}

/**
 * Start and update the game
 */
function startGame () {
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', function (e) {
		stage.update();
	});
}
