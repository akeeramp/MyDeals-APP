var reflection = {};

//http://ejohn.org/blog/simple-javascript-inheritance/
(function(){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function(){};
   
	// Create a new Class that inherits from this class
	Class.extend = function(prop, ref_name) {
		if(ref_name)
			reflection[ref_name] = Class;
			
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
		 
		// Copy the properties over onto the new prototype
		for (var name in prop) {
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] == "function" && 
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);        
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) :
			prop[name];
		}
		 
		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
				this.init.apply(this, arguments);
		}
		 
		// Populate our constructed prototype object
		Class.prototype = prototype;
		 
		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;
		 
		return Class;
	};
})();


var Input = Class.extend({
	init: function() {
		this.reset();
	},
	reset: function() {
		this.left = false;
		this.right = false;
		this.accelerate = false;
		this.up = false;
		this.down = false;
	},
	bind: function() {
	},
	unbind: function() {
	},
	accelerate : false,
	left : false,
	up : false,
	right : false,
	down : false,
});

var KeyBoard = Input.extend({
	init: function() {
		this._super();
	},
	bind: function() {
		var me = this;
		$(document).on('keydown', function(event) {	
			return me.handler(event, true);
		});
		$(document).on('keyup', function(event) {	
			return me.handler(event, false);
		});
	},
	unbind: function() {
		$(document).off('keydown');
		$(document).off('keyup');
	},
	handler: function(event, status) {
        switch (event.keyCode) {
			case 57392://CTRL on MAC
			case 17://CTRL
			case 65://A
				this.accelerate = status;
				break;
			case 40://DOWN ARROW
				this.down = status;
				break;
			case 39://RIGHT ARROW
				this.right = status;
				break;
			case 37://LEFT ARROW
				this.left = status;			
				break;
            case 38://UP ARROW
            case 32://SPACE
				this.up = status;
				break;
			default:
				return true;
		}
			
		event.preventDefault();
		return false;
	}
});


var AUDIOPATH  = 'Content/audio/';
var BASEPATH   = 'Content/';
var DIV        = '<div />';
var CANVAS     = '<canvas />';
var CLS_FIGURE = 'figure';
var CLS_MATTER = 'matter';
var CLS_TOOL   = 'tool';

var directions = {
	none  : 0,
	left  : 1,
	up    : 2,
	right : 3,
	down  : 4
};

var mario_states = {
	normal : 0,
	fire  : 1
};

var bobafett_mode = {
	sleep : 0,
	awake : 1
};

var size_states = {
	small : 1,
	big   : 2
};

var coffee_mode = {
    coffee: 0,
    donut: 1
};

var death_modes = {
    normal: 0,
    bantha: 1
};

var ground_blocking = {
	none   : 0,
	left   : 1,
	top    : 2,
	right  : 4,
	bottom : 8,
	all    : 15
};

var images = {
	enemies : BASEPATH + 'mario-enemies.png',
	sprites : BASEPATH + 'mario-sprites.png',
	objects : BASEPATH + 'mario-objects.png',
	sage   : BASEPATH + 'mario-sage.png',
	bobafett   : BASEPATH + 'mario-bobafett.png'
};

var constants = {
	interval        : 20,
	bounce          : 15,
	cooldown        : 20,
	gravity         : 2,
	start_lives     : 3,
	max_width       : 400,
	max_height      : 15,
	jumping_v       : 27,
	walking_v       : 5,
	coffee_v        : 3,
	jawa_v          : 2,
	spiked_turtle_v : 1.5,
	small_turtle_v  : 3,
	big_turtle_v    : 2,
	bantha_v        : 10,
	bantha_wait     : 25,
	star_vx         : 4,
	star_vy         : 16,
	bullet_v        : 12,
	max_hearts      : 100,
	pipesarlacc_count : 150,
	pipesarlacc_v     : 1,
	invincible      : 10800,
	invulnerable    : 1000,
	blinkfactor     : 5
};

/*
 * -------------------------------------------
 * C2U METHOD (CONSTANT TO URL)
 * -------------------------------------------
 */
var c2u = function(s) {
	return 'url(' + s + ')';
};

/*
 * -------------------------------------------
 * Q2Q METHOD (QUADER TO QUADER COLLISION CHECK)
 * -------------------------------------------
 */
var q2q = function(figure, opponent) {
	if(figure.x > opponent.x + 16)
		return false;		
	else if(figure.x + 16 < opponent.x)
		return false;		
	else if(figure.y + figure.state * 32 - 4 < opponent.y)
		return false;		
	else if(figure.y + 4 > opponent.y + opponent.state * 32)
		return false;
		
	return true;
};

/*
 * -------------------------------------------
 * MATH.SIGN METHOD
 * -------------------------------------------
 */
Math.sign = function(x) {
	if(x > 0)
		return 1;
	else if(x < 0)
		return -1;
		
	return 0;
};


var SoundManager = Class.extend({
	// Constructor for sound Manager class
	init: function(settings, callback) {
		var n = 0;
		var test = document.createElement('audio');
		this.onload = callback;
		this.soundNames = [ 'jump' , 'heart' , 'enemy_die' , 'grow' , 'hurt' , 'coffee' , 'bantha' , 'shoot' , 'lifeupgrade' ];
		this.musicNames = [ 'game', 'invincible', 'die', 'success', 'gameover', 'sage', 'ending', 'menu', 'editor' ];
		this.musicLoops = [ true, false, false, false, false, true, false, true, true ];
		this.count = this.soundNames.length + this.musicNames.length;
		this.sounds = [];
		this.tracks = [];
		this.settings = settings || { musicOn : true };
		this.currentMusic = null;
		this.support = (typeof test.canPlayType === 'function' && (test.canPlayType('audio/mpeg') !== '' || test.canPlayType('audio/ogg') !== ''));
		this.toLoad = 0;
		this.sides = 0;
		
		if(this.support) {
			var ext = test.canPlayType('audio/ogg').match(/maybe|probably/i) ? '.ogg' : '.mp3';
			var me = this;
			
			var start = function() {
				if(n++ < 25 && me.toLoad > 0)
					setTimeout(function() { start(); }, 100);
				else
					me.loaded();
			};
			
			for(var i = 0, n = this.soundNames.length; i < n; i++)  {
				me.increment();
				var t = document.createElement('audio');
				t.addEventListener('error', function() { me.decrement(); }, false);
				t.addEventListener('loadeddata', function() { me.decrement(); }, false);
				t.src = AUDIOPATH + me.soundNames[i] + ext;
				t.preload = 'auto';
				me.sounds.push([t]);
			}
			
			for(var i = 0, n = this.musicNames.length; i < n; i++)  {
				me.increment();
				var t = document.createElement('audio');
				t.addEventListener('error', function() { me.decrement(); }, false);
				t.addEventListener('loadeddata', function() { me.decrement(); }, false);
				t.src = AUDIOPATH + me.musicNames[i] + ext;

				if(me.musicLoops[i]) {
					if (typeof t.loop == 'boolean') {
						t.loop = true;
					} else {
						t.addEventListener('ended', function() {
							this.currentTime = 0;
							this.play();
						}, false);
					}
				} else {
					t.addEventListener('ended', function() {
						me.sideMusicEnded();
					}, false);
				}

				t.preload = 'auto';
				me.tracks.push(t);
			}
			
			if(callback)
				start();
		} else
			this.loaded();
	},
	// Callback if everything loaded correctly
	loaded: function() {
		if(this.onload) {
			var me = this;
			setTimeout(function() { 
				me.onload();
			}, 10);
		}
	},
	// Decrements the toLoad property of the soundManager instance
	increment: function() {
		++this.toLoad;
	},
	// Decrements the toLoad property of the soundManager instance
	decrement: function() {
		--this.toLoad;
	},
	//Plays a certain sound effect
	play: function(name) {
		if(!this.settings || !this.settings.musicOn || !this.support)
			return;
			
		for(var i = this.soundNames.length; i--;) {  
			if(this.soundNames[i] === name) {
				var t = this.sounds[i];
				
				for(var j = t.length; j--; ) {
					if(t[j].duration === 0)
						return;
					
					if(t[j].ended)
						t[j].currentTime = 0;
					else if(t[j].currentTime > 0)
						continue;
						
					t[j].play();
					return;
				}
				
				var s = document.createElement('audio');
				s.src = t[0].src;
				t.push(s);
				s.play();
				return;
			}
		}
	},
	//Pauses the current music
	pauseMusic: function() {
		if(this.support && this.currentMusic)
			this.currentMusic.pause();
	},
	//Plays the current music
	playMusic: function() {
		if(this.support && this.currentMusic && this.settings.musicOn)
			this.currentMusic.play();
	},
	//When the Side music ended
	sideMusicEnded: function() {
		this.sides--;

		if(this.sides === 0) {
			this.currentMusic = this.previous;
			this.playMusic();
		}
	},
	//Plays some side music
	sideMusic: function(id) {
		var me = this;

		if(!me.support)
			return;

		if(me.sides === 0) {
			me.previous = me.currentMusic;
			me.pauseMusic();
		}

		for(var i = me.musicNames.length; i--; ) {
			if(me.musicNames[i] === id) {
				if(me.currentMusic !== me.tracks[i]) {
					me.sides++;
					me.currentMusic = me.tracks[i];
				}

				try {
					me.currentMusic.currentTime = 0;
					me.playMusic();
				} catch(e) { 
					me.sideMusicEnded();
				}
			}
		}		
	},
	//Changes the current music
	music: function(id, noRewind) {
		if(!this.support)
			return;

		for(var i = this.musicNames.length; i--; ) {
			if(this.musicNames[i] === id) {
				var m = this.tracks[i];

				if(m === this.currentMusic)
					return;

				this.pauseMusic();
				this.currentMusic = m;
		
				if(!this.support)
					return;
		
				try {
					if(!noRewind)
						this.currentMusic.currentTime = 0;
				
					this.playMusic();
				} catch(e) { }
			}
		}	
	},
});





/*
 * -------------------------------------------
 * BASE CLASS
 * -------------------------------------------
 */
var Base = Class.extend({
	init: function(x, y) {
		this.setPosition(x || 0, y || 0);
		this.clearFrames();
	},
	setPosition: function(x, y) {
		this.x = x;
		this.y = y;
	},
	getPosition: function() {
		return { x : this.x, y : this.y };
	},
	setImage: function(img, x, y) {
		this.image = {
			path : img,
			x : x,
			y : y
		};
	},
	setSize: function(width, height) {
		this.width = width;
		this.height = height;
	},
	getSize: function() {
		return { width: this.width, height: this.height };
	},
	setupFrames: function(fps, frames, rewind, id) {
		if(id) {
			if(this.frameID === id)
				return true;
			
			this.frameID = id;
		}
		
		this.frameCount = 0;
		this.currentFrame = 0;
		this.frameTick = frames ? (1000 / fps / constants.interval) : 0;
		this.frames = frames;
		this.rewindFrames = rewind;
		return false;
	},
	clearFrames: function() {
		this.frameID = undefined;
		this.frames = 0;
		this.currentFrame = 0;
		this.frameTick = 0;
	},
	playFrame: function() {
		if(this.frameTick && this.view) {
			this.frameCount++;
			
			if(this.frameCount >= this.frameTick) {			
				this.frameCount = 0;
				
				if(this.currentFrame === this.frames)
					this.currentFrame = 0;
					
				var $el = this.view;
				$el.css('background-position', '-' + (this.image.x + this.width * ((this.rewindFrames ? this.frames - 1 : 0) - this.currentFrame)) + 'px -' + this.image.y + 'px');
				this.currentFrame++;
			}
		}
	},
});

/*
 * -------------------------------------------
 * GAUGE CLASS
 * -------------------------------------------
 */
var Gauge = Base.extend({
	init: function(id, startImgX, startImgY, fps, frames, rewind) {
		this._super(0, 0);
		this.view = $('#' + id);
		this.setSize(this.view.width(), this.view.height());
		this.setImage(this.view.css('background-image'), startImgX, startImgY);
		this.setupFrames(fps, frames, rewind);
	},
});

/*
 * -------------------------------------------
 * LEVEL CLASS
 * -------------------------------------------
 */
var Level = Base.extend({
	init: function(id) {
		this.world = $('#' + id);
		this.nextCycles = 0;
		this._super(0, 0);
        this.input = [];
		this.reset();
		this.heartGauge = new Gauge('heart', 0, 0, 10, 4, true);
		this.liveGauge = new Gauge('live', 0, 48, 6, 6, true);
	},
	reload: function() {
		var settings = {};
		
		if(this.mario) {
			settings.lifes = this.mario.lifes - 1;
			settings.hearts = this.mario.hearts;
			
			if(settings.lifes < 0) {				
				this.playMusic('gameOver');
				$(DIV).appendTo(this.world).addClass('gameover').css('left', this.x).html('Game Over');
				this.deadCycles = Math.floor(5000 / constants.interval);
				return;
			}
		}
		
		this.pause();
		this.reset();		
		this.load(this.raw);
		
		if(this.mario) {
			this.mario.setLifes(settings.lifes || 0);
			this.mario.setHearts(settings.hearts || 0);
            this.invokeSameCallback();
		}
		
		this.start();
	},
	setSameCallback: function(callback) {
		this.sameCallback = callback;
	},
	setNextCallback: function(callback) {
		this.nextCallback = callback;
	},
	invokeNextCallback: function() {
		if(this.nextCycles)
			return;
		
		if(this.nextCallback)
			this.nextCallback();
	},
	invokeDeadCallback: function() {
		if(this.deadCycles)
			return;
			
		if(this.deadCallback)
			this.deadCallback();
	},
	invokeSameCallback: function() {
		if(this.sameCallback)
			this.sameCallback();
	},
	setDeadCallback: function(callback) {
		this.deadCallback = callback;
	},
	exportSaveGame: function() {
		var settings = {};
		
		if(this.mario) {
			settings.lifes = this.mario.lifes;
			settings.hearts = this.mario.hearts;
			settings.state = this.mario.state;
			settings.marioState = this.mario.marioState;
		}
		
		return settings;
	},
	importSaveGame: function(settings) {
		if(this.mario) {
			this.mario.setLifes(settings.lifes || 0);
			this.mario.setHearts(settings.hearts || 0);
			this.mario.setState(settings.state || size_states.small);
			this.mario.setMarioState(settings.marioState || mario_states.normal);
		}
	},
	setInput: function(input) {
		this.input.push(input);
	},
    bindInput: function() {
        for(var i = this.input.length; i--; )
			this.input[i].bind();
    },
	clearInput: function() {
		for(var i = this.input.length; i--; )
			this.input[i].unbind();
	},
	getInput: function() {
        var actions = { left: false, down: false, right: false, up: false, accelerate: false };

        for(var i = this.input.length; i--; ) {
		    for(var action in actions)
                actions[action] = actions[action] || (this.input[i])[action];
        }
		
		return actions;
	},
	load: function(level) {
		if(this.active) {
			if(this.loop)
				this.pause();

			this.reset();
		}
			
		this.setPosition(0, 0);
		this.setSize(level.width * 32, level.height * 32);
		this.setImage(level.background);
		this.raw = level;
		this.id = level.id;
		this.active = true;
		var data = level.data;
        level.data.splice(level.width);
		
		for(var i = 0; i < level.width; i++) {
			var t = [];
			
			for(var j = 0; j < level.height; j++)
				t.push('');
			
			this.obstacles.push(t);
		}
		
		for(var i = 0, width = data.length; i < width; i++) {
			var col = data[i];
			
			for(var j = 0, height = col.length; j < height; j++) {
                var value = col[j];

                if(/^fig_/.test(value))
                    value = value.substr(4);

                if(/_\dx\d$/.test(value))
                    value = value.substr(0, value.length - 4);

				if(reflection[value])
					new (reflection[value])(i * 32, (height - j - 1) * 32, this);
			}
		}
	},
	next: function() {
		this.nextCycles = Math.floor(7000 / constants.interval);
	},
	getGridWidth: function() {
		return this.raw.width;
	},
	getGridHeight: function() {
		return this.raw.height;
	},
	setSounds: function(manager) {
		this.sounds = manager;
	},
	playSound: function(label) {
		if(this.sounds)
			this.sounds.play(label);
	},
	playMusic: function(label) {
		if(this.sounds)
			this.sounds.sideMusic(label);
	},
	reset: function() {
		this.active = false;
		this.world.empty();
		this.figures = [];
		this.obstacles = [];
		this.items = [];
		this.decorations = [];
		this.mario = undefined;
	},
	tick: function() {
		if(this.nextCycles) {
			this.nextCycles--;
			this.invokeNextCallback();			
			return;
		}
		
		if(this.deadCycles) {
			this.deadCycles--;
			this.invokeDeadCallback();
			return;
		}
		
		var i = 0, j = 0, figure, opponent;
		
		for(i = this.figures.length; i--; ) {
			figure = this.figures[i];
			
			if(figure.dead) {
				if(!figure.death()) {
					if(figure instanceof Mario)
						return this.reload();
						
					figure.view.remove();
					this.figures.splice(i, 1);
				} else
					figure.playFrame();
			} else {
				if(i) {
					for(j = i; j--; ) {
						if(figure.dead)
							break;
							
						opponent = this.figures[j];
						
						if(!opponent.dead && q2q(figure, opponent)) {
							figure.hit(opponent);
							opponent.hit(figure);
						}
					}
				}
			}
			
			if(!figure.dead) {
				figure.move();
				figure.playFrame();
			}
		}
		
		for(i = this.items.length; i--; )
			this.items[i].playFrame();
		
		this.heartGauge.playFrame();
		this.liveGauge.playFrame();
	},
	start: function() {
		var me = this;
        me.bindInput();
		me.loop = setInterval(function() {
			me.tick.apply(me);
		}, constants.interval);
	},
	pause: function() {
		clearInterval(this.loop);
        this.clearInput();
		this.loop = undefined;
	},
	setPosition: function(x, y) {
		this._super(x, y);
		this.world.css('left', -x);
	},
	setImage: function(index) {
		var img = BASEPATH + 'backgrounds/' + ((index < 10 ? '0' : '') + index) + '.png';
		this.world.parent().css({
			backgroundImage : c2u(img),
			backgroundPosition : '0 -380px'
		});
		this._super(img, 0, 0);
	},
	setSize: function(width, height) {
		this._super(width, height);
	},
	setParallax: function(x) {
		this.setPosition(x, this.y);
		this.world.parent().css('background-position', '-' + Math.floor(x / 3) + 'px -380px');
	},
});

/*
 * -------------------------------------------
 * FIGURE CLASS
 * -------------------------------------------
 */
var Figure = Base.extend({
	init: function(x, y, level) {
		this.view = $(DIV).addClass(CLS_FIGURE).appendTo(level.world);
		this.dead = false;
		this.onground = true;
		this.setState(size_states.small);
		this.setVelocity(0, 0);
		this.direction = directions.none;
		this.level = level;
		this._super(x, y);
		level.figures.push(this);
	},
	setState: function(state) {
		this.state = state;
	},
	setImage: function(img, x, y) {
		this.view.css({
			backgroundImage : img ? c2u(img) : 'none',
			backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px',
		});
		this._super(img, x, y);
	},
	setPosition: function(x, y) {
		this.view.css({
			left: x,
			bottom: y
		});
		this._super(x, y);
		this.setGridPosition(x, y);
	},
	setSize: function(width, height) {
		this.view.css({
			width: width,
			height: height
		});
		this._super(width, height);
	},
	setGridPosition: function(x, y) {
		this.i = Math.floor((x + 16) / 32);
		this.j = Math.ceil(this.level.getGridHeight() - 1 - y / 32);
		
		if(this.j > this.level.getGridHeight())
			this.die();
	},
	getGridPosition: function(x, y) {
		return { i : this.i, j : this.j };
	},
	setVelocity: function(vx, vy) {
		this.vx = vx;
		this.vy = vy;
		
		if(vx > 0)
			this.direction = directions.right;
		else if(vx < 0)
			this.direction = directions.left;
	},
	getVelocity: function() {
		return { vx : this.vx, vy : this.vy };
	},
	hit: function(opponent) {
		
	},
	collides: function(is, ie, js, je, blocking) {
		var isHero = this instanceof Hero;
		js = Math.max(js, 0);
		
		if(is < 0 || ie >= this.level.obstacles.length)
			return true;
			
		if(je >= this.level.getGridHeight())
			return false;
			
		for(var i = is; i <= ie; i++) {
			for(var j = je; j >= js; j--) {
				var obj = this.level.obstacles[i][j];
				
				if(obj) {
					if(obj instanceof Item && isHero && (blocking === ground_blocking.bottom || obj.blocking === ground_blocking.none))
						obj.activate(this);
					
					if((obj.blocking & blocking) === blocking)
						return true;
				}
			}
		}
		
		return false;
	},
	move: function() {
		var vx = this.vx;
		var vy = this.vy - constants.gravity;
		
		var s = this.state;
		
		var x = this.x;
		var y = this.y;
		
		var dx = Math.sign(vx);
		var dy = Math.sign(vy);
		
		var is = this.i;
		var ie = is;
		
		var js = Math.ceil(this.level.getGridHeight() - s - (y + 31) / 32);
		var je = this.j;
		
		var d = 0, b = ground_blocking.none;
		var onground = false;
		var t = Math.floor((x + 16 + vx) / 32);
		
		if(dx > 0) {
			d = t - ie;
			t = ie;
			b = ground_blocking.left;
		} else if(dx < 0) {
			d = is - t;
			t = is;
			b = ground_blocking.right;
		}
		
		x += vx;
		
		for(var i = 0; i < d; i++) {
			if(this.collides(t + dx, t + dx, js, je, b)) {
				vx = 0;
				x = t * 32 + 15 * dx;
				break;
			}
			
			t += dx;
			is += dx;
			ie += dx;
		}
		
		if(dy > 0) {
			t = Math.ceil(this.level.getGridHeight() - s - (y + 31 + vy) / 32);
			d = js - t;
			t = js;
			b = ground_blocking.bottom;
		} else if(dy < 0) {
			t = Math.ceil(this.level.getGridHeight() - 1 - (y + vy) / 32);
			d = t - je;
			t = je;
			b = ground_blocking.top;
		} else
			d = 0;
		
		y += vy;
		
		for(var i = 0; i < d; i++) {
			if(this.collides(is, ie, t - dy, t - dy, b)) {
				onground = dy < 0;
				vy = 0;
				y = this.level.height - (t + 1) * 32 - (dy > 0 ? (s - 1) * 32 : 0);
				break;
			}
			
			t -= dy;
		}
		
		this.onground = onground;
		this.setVelocity(vx, vy);
		this.setPosition(x, y);
	},
	death: function() {
		return false;
	},
	die: function() {
		this.dead = true;
	},
});

/*
 * -------------------------------------------
 * MATTER CLASS
 * -------------------------------------------
 */
var Matter = Base.extend({
	init: function(x, y, blocking, level) {
		this.blocking = blocking;
		this.view = $(DIV).addClass(CLS_MATTER).appendTo(level.world);
		this.level = level;
		this._super(x, y);
		this.setSize(32, 32);
		this.addToGrid(level);
	},
	addToGrid: function(level) {
		level.obstacles[this.x / 32][this.level.getGridHeight() - 1 - this.y / 32] = this;
	},
	setImage: function(img, x, y) {
		this.view.css({
			backgroundImage : img ? c2u(img) : 'none',
			backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px',
		});
		this._super(img, x, y);
	},
	setPosition: function(x, y) {
		this.view.css({
			left: x,
			bottom: y
		});
		this._super(x, y);
	},
});

/*
 * -------------------------------------------
 * GROUND CLASS
 * -------------------------------------------
 */
var Ground = Matter.extend({
	init: function(x, y, blocking, level) {
		this._super(x, y, blocking, level);
	},
});

/*
 * -------------------------------------------
 * GRASS CLASSES
 * -------------------------------------------
 */
var TopGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 888, 404);
	},
}, 'grass_top');
var TopRightGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top + ground_blocking.right;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 922, 404);
	},
}, 'grass_top_right');
var TopLeftGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.left + ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 854, 404);
	},
}, 'grass_top_left');
var RightGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.right;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 922, 438);
	},
}, 'grass_right');
var LeftGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.left;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 854, 438);
	},
}, 'grass_left');
var TopRightRoundedGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 922, 506);
	},
}, 'grass_top_right_rounded');
var TopLeftRoundedGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 854, 506);
	},
}, 'grass_top_left_rounded');

/*
 * -------------------------------------------
 * GRASS-SOIL CLASSES
 * -------------------------------------------
 */
var TopRightGrassSoil = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 990, 506);
	},
}, 'grass_top_right_rounded_soil');
var TopLeftGrassSoil = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 956, 506);
	},
}, 'grass_top_left_rounded_soil');

/*
 * -------------------------------------------
 * STONE CLASSES
 * -------------------------------------------
 */
var Stone = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.all;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 550, 160);
	},
}, 'stone');
var BrownBlock = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.all;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 514, 194);
	},
}, 'brown_block');

/*
 * -------------------------------------------
 * PIPE CLASSES
 * -------------------------------------------
 */
var RightTopPipe = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.all;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 36, 358);
	},
}, 'pipe_top_right');
var LeftTopPipe = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.all;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 2, 358);
	},
}, 'pipe_top_left');
var RightPipe = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.right + ground_blocking.bottom;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 36, 390);
	},
}, 'pipe_right');
var LeftPipe = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.left + ground_blocking.bottom;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 2, 390);
	},
}, 'pipe_left');

/*
 * -------------------------------------------
 * DECORATION CLASS
 * -------------------------------------------
 */
var Decoration = Matter.extend({
	init: function(x, y, level) {
		this._super(x, y, ground_blocking.none, level);
		level.decorations.push(this);
	},
	setImage: function(img, x, y) {
		this.view.css({
			backgroundImage : img ? c2u(img) : 'none',
			backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px',
		});
		this._super(img, x, y);
	},
	setPosition: function(x, y) {
		this.view.css({
			left: x,
			bottom: y
		});
		this._super(x, y);
	},
});

/*
 * -------------------------------------------
 * DECORATION GRASS CLASSES
 * -------------------------------------------
 */
var TopRightCornerGrass = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 612, 868);
	},
}, 'grass_top_right_corner');
var TopLeftCornerGrass = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 648, 868);
	},
}, 'grass_top_left_corner');

/*
 * -------------------------------------------
 * SOIL CLASSES
 * -------------------------------------------
 */
var Soil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 888, 438);
	},
}, 'soil');
var RightSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 922, 540);
	},
}, 'soil_right');
var LeftSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 854,540);
	},
}, 'soil_left');

/*
 * -------------------------------------------
 * BUSH CLASSES
 * -------------------------------------------
 */
var RightBush = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 382, 928);
	},
}, 'bush_right');
var RightMiddleBush = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 314, 928);
	},
}, 'bush_middle_right');
var MiddleBush = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 348, 928);
	},
}, 'bush_middle');
var LeftMiddleBush = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 212, 928);
	},
}, 'bush_middle_left');
var LeftBush = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 178, 928);
	},
}, 'bush_left');

/*
 * -------------------------------------------
 * PLANTED SOIL CLASSES
 * -------------------------------------------
 */
var RightPlantedSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 782, 832);
	},
}, 'planted_soil_right');
var MiddlePlantedSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 748, 832);
	},
}, 'planted_soil_middle');
var LeftPlantedSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 714, 832);
	},
}, 'planted_soil_left');

/*
 * -------------------------------------------
 * PIPE DECORATION
 * -------------------------------------------
 */
var RightPipeGrass = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 36, 424);
	},
}, 'pipe_right_grass');
var LeftPipeGrass = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 2, 424);
	},
}, 'pipe_left_grass');
var RightPipeSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 36, 458);
	},
}, 'pipe_right_soil');
var LeftPipeSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 2, 458);
	},
}, 'pipe_left_soil');

/*
 * -------------------------------------------
 * ITEM CLASS
 * -------------------------------------------
 */
var Item = Matter.extend({
	init: function(x, y, isBlocking, level) {
		this.isBouncing = false;
		this.bounceCount = 0;
		this.bounceFrames = Math.floor(50 / constants.interval);
		this.bounceStep = Math.ceil(10 / this.bounceFrames);
		this.bounceDir = 1;
		this.isBlocking = isBlocking;
		this._super(x, y, isBlocking ? ground_blocking.all : ground_blocking.none, level);
		this.activated = false;
		this.addToLevel(level);
		this.backDecoration = this.detectBackDecoration(level);
	},
	detectBackDecoration: function(level) {
		if(!this.level.raw)
			return;

		var name = 'soil';
		var direction = [1, -1];
		var count = 0;

		for(var k = 0; k < 2; k++) {
			for(var l = 0; l < direction.length; l++) {
				var x = Math.floor(this.x / 32);
				var y = Math.floor(14 - this.y / 32);

				if(k === 0)
					x += direction[l];
				else
					y += direction[l];

				if(x < 0 || x >= this.level.raw.width || y < 0 || y > 14)
					continue;

				if(this.level.raw.data[x][y].indexOf(name) > -1) {
					count++;
				} else {
					var success = true;

					while(this.level.raw.data[x][y] === 'heart') {
						if(k === 0)
							x += direction[l];
						else
							y += direction[l];

						if(x < 0 || x >= this.level.raw.width || y < 0 || y > 14) {
							success = false;
							break;
						}
					}

					if(success && this.level.raw.data[x][y].indexOf(name) > -1)
						count++;
				}
			}
		}

		if(count > 1) {
			return $(DIV).addClass(CLS_MATTER).css({
				backgroundImage : c2u(images.objects),
				backgroundPosition : '-888px -438px',
				zIndex : 0,
				bottom: this.y,
				left: this.x
			}).appendTo(this.view.parent());
		}
	},
	addToLevel: function(level) {
		level.items.push(this);
	},
	activate: function(from) {
		this.activated = true;
	},
	bounce: function() {
		this.isBouncing = true;
		
		for(var i = this.level.figures.length; i--; ) {
			var fig = this.level.figures[i];
			
			if(fig.y === this.y + 32 && fig.x >= this.x - 16 && fig.x <= this.x + 16) {
				if(fig instanceof ItemFigure) {
					fig.setVelocity(fig.vx, constants.bounce);
				} else {
					fig.die();
				}
			}
		}
	},
	playFrame: function() {
		if(this.isBouncing) {
			this.view.css({ 'bottom' : (this.bounceDir > 0 ? '+' : '-') + '=' + this.bounceStep + 'px' });
			this.bounceCount += this.bounceDir;
			
			if(this.bounceCount === this.bounceFrames) {
				this.bounceDir = -1;
			} else if(this.bounceCount === 0) {
				this.bounceDir = 1;
				this.isBouncing = false;
			}
		}
		
		this._super();
	},
});

/*
 * -------------------------------------------
 * HEART CLASSES
 * -------------------------------------------
 */
var Heart = Item.extend({
	init: function(x, y, level) {
		this._super(x, y, false, level);
		this.setImage(images.objects, 0, 0);
		this.setupFrames(10, 4, true);
	},
	activate: function(from) {
		if(!this.activated) {
			this.level.playSound('heart');
			from.addHeart();
			this.remove();
		}
		this._super(from);
	},
	remove: function() {
		this.view.remove();
	},
}, 'heart');
var HeartBoxHeart = Heart.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 96, 0);
		this.clearFrames();
		this.view.hide();
		this.count = 0;
		this.frames = Math.floor(150 / constants.interval);
		this.step = Math.ceil(30 / this.frames);
	},
	remove: function() { },
	addToGrid: function() { },
	addToLevel: function() { },
	activate: function(from) {
		this._super(from);
		this.view.show().css({ 'bottom' : '+=8px' });
	},
	act: function() {
		this.view.css({ 'bottom' : '+=' + this.step + 'px' });
		this.count++;
		return (this.count === this.frames);
	},
});
var HeartBox = Item.extend({
	init: function(x, y, level, amount) {
		this._super(x, y, true, level);
		this.setImage(images.objects, 346, 328);
		this.setAmount(amount || 1);
	},
	setAmount: function(amount) {
		this.items = [];
		this.actors = [];
		
		for(var i = 0; i < amount; i++)
			this.items.push(new HeartBoxHeart(this.x, this.y, this.level));
	},
	activate: function(from) {
		if(!this.isBouncing) {
			if(this.items.length) {
				this.bounce();
				var heart = this.items.pop();
				heart.activate(from);
				this.actors.push(heart);
				
				if(!this.items.length)
					this.setImage(images.objects, 514, 194);
			}
		}
			
		this._super(from);
	},
	playFrame: function() {
		for(var i = this.actors.length; i--; ) {
			if(this.actors[i].act()) {
				this.actors[i].view.remove();
				this.actors.splice(i, 1);
			}
		}
		
		this._super();
	},
}, 'heartbox');
var MultipleHeartBox = HeartBox.extend({
	init: function(x, y, level) {
		this._super(x, y, level, 8);
	},
}, 'multiple_heartbox');

/*
 * -------------------------------------------
 * ITEMFIGURE CLASS
 * -------------------------------------------
 */
var ItemFigure = Figure.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
	},
});

/*
 * -------------------------------------------
 * STARBOX CLASS
 * -------------------------------------------
 */
var StarBox = Item.extend({
	init: function(x, y, level) {
		this._super(x, y, true, level);
		this.setImage(images.objects, 96, 33);
		this.star = new Star(x, y, level);
		this.setupFrames(8, 4, false);
	},
	activate: function(from) {
		if(!this.activated) {
			this.star.release();
			this.clearFrames();
			this.bounce();
			this.setImage(images.objects, 514, 194);
		}
		
		this._super(from);
	},
}, 'starbox');
var Star = ItemFigure.extend({
	init: function(x, y, level) {
		this._super(x, y + 32, level);
		this.active = false;
		this.setSize(32, 32);
		this.setImage(images.objects, 32, 69);
		this.view.hide();
	},
	release: function() {
		this.taken = 4;
		this.active = true;
		this.level.playSound('coffee');
		this.view.show();
		this.setVelocity(constants.star_vx, constants.star_vy);
		this.setupFrames(10, 2, false);
	},
	collides: function(is, ie, js, je, blocking) {
		return false;
	},
	move: function() {
		if(this.active) {
			this.vy += this.vy <= -constants.star_vy ? constants.gravity : constants.gravity / 2;
			this._super();
		}
		
		if(this.taken)
			this.taken--;
	},
	hit: function(opponent) {
		if(!this.taken && this.active && opponent instanceof Mario) {
			opponent.invincible();
			this.die();
		}
	},
});

/*
 * -------------------------------------------
 * COFFEEBOX CLASS
 * -------------------------------------------
 */
var CoffeeBox = Item.extend({
	init: function(x, y, level) {
		this._super(x, y, true, level);
		this.setImage(images.objects, 96, 33);
		this.max_mode = coffee_mode.donut;
		this.coffee = new Coffee(x, y, level);
		this.setupFrames(8, 4, false);
	},
	activate: function(from) {
		if(!this.activated) {
			if(from.state === size_states.small || this.max_mode === coffee_mode.coffee)
				this.coffee.release(coffee_mode.coffee);
			else
				this.coffee.release(coffee_mode.donut);
			
			this.clearFrames();
			this.bounce();
			this.setImage(images.objects, 514, 194);
		}
			
		this._super(from);
	},
}, 'coffeebox');
var Coffee = ItemFigure.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.active = false;
		this.setSize(32, 32);
		this.setImage(images.objects, 582, 60);
		this.released = 0;
		this.view.css('z-index', 94).hide();
	},
	release: function(mode) {
		this.released = 4;
		this.level.playSound('coffee');
		
		if(mode === coffee_mode.donut)
			this.setImage(images.objects, 548, 60);
			
		this.mode = mode;
		this.view.show();
	},
	move: function() {
		if(this.active) {
			this._super();
		
			if(this.mode === coffee_mode.coffee && this.vx === 0)
				this.setVelocity(this.direction === directions.right ? -constants.coffee_v : constants.coffee_v, this.vy);
		} else if(this.released) {
			this.released--;
			this.setPosition(this.x, this.y + 8);
			
			if(!this.released) {
				this.active = true;
				this.view.css('z-index', 99);
				
				if(this.mode === coffee_mode.coffee)
					this.setVelocity(constants.coffee_v, constants.gravity);
			}
		}
	},
	hit: function(opponent) {
		if(this.active && opponent instanceof Mario) {
			if(this.mode === coffee_mode.coffee)
				opponent.grow();
			else if(this.mode === coffee_mode.donut)
				opponent.shooter();
				
			this.die();
		}
	},
});




/*
 * -------------------------------------------
 * GOTEAMBOX CLASS
 * -------------------------------------------
 */
var GoTeamBox = Item.extend({
	init: function(x, y, level) {
		this._super(x, y, true, level);
		this.setImage(images.objects, 1120, 680);
		this.max_mode = coffee_mode.donut;
		this.coffee = new Coffee(x, y, level);
		this.setupFrames(1, 4, false);
	},
	activate: function(from) {
		if(!this.activated) {
			if(from.state === size_states.small || this.max_mode === coffee_mode.coffee)
				this.coffee.release(coffee_mode.coffee);
			else
				this.coffee.release(coffee_mode.donut);
			
			this.clearFrames();
			this.bounce();
			this.setImage(images.objects, 514, 194);
		}
			
		this._super(from);
	},
}, 'goteambox');


/*
 * -------------------------------------------
 * BULLET CLASS
 * -------------------------------------------
 */
var Bullet = Figure.extend({
	init: function(parent) {
		this._super(parent.x + (parent.direction === directions.right ? 31 : 0), parent.y + 14, parent.level);
		this.parent = parent;
		this.setImage(images.sprites, 252, 61);
		this.setSize(16, 16);
		this.direction = parent.direction;
		this.vy = 0;
		this.life = Math.ceil(2000 / constants.interval);
		this.speed = constants.bullet_v;
		this.vx = this.direction === directions.right ? this.speed : -this.speed;
	},
	setVelocity: function(vx, vy) {
		this._super(vx, vy);
	
		if(this.vx === 0) {
			var s = this.speed * Math.sign(this.speed);
			this.vx = this.direction === directions.right ? -s : s;
		}
		
		if(this.onground)
			this.vy = constants.bounce;
	},
	move: function() {
		if(--this.life)
			this._super();
		else
			this.die();
	},
	hit: function(opponent) {
		if(!(opponent instanceof Mario || opponent instanceof Bantha)) {
			opponent.die();
			this.die();
		}
	},
});

/*
 * -------------------------------------------
 * HERO CLASS
 * -------------------------------------------
 */
var Hero = Figure.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
	},
});

/*
 * -------------------------------------------
 * MARIO CLASS
 * -------------------------------------------
 */
var Mario = Hero.extend({
	init: function(x, y, level) {
		this.standSprites = [
			[[{ x : 256, y : 0},{ x: 64, y : 0}],[{ x : 0, y : 0},{ x: 96, y : 0}]],
			[[{ x : 256, y : 88},{ x: 64, y : 88}],[{ x : 0, y : 88},{ x: 96, y : 88}]],
			[[{ x : 256, y : 150},{ x: 64, y : 150}],[{ x : 0, y : 150},{ x: 96, y : 150}]]
		];
		this.crouchSprites = [
			[{ x : 128, y : 0},{ x: 160, y : 0}],
			[{ x : 128, y : 88},{ x: 160, y : 88}],
			[{ x : 128, y : 150},{ x: 160, y : 150}]
		];
		this.deadly = 0;
		this.invulnerable = 0;
		this._super(x, y, level);
		this.blinking = 0;
		this.setSize(32, 46);
		this.cooldown = 0;
		level.mario = this;
		this.setMarioState(mario_states.normal);
		this.setLifes(constants.start_lives);
		this.setHearts(0);
		this.deathBeginWait = Math.floor(700 / constants.interval);
		this.deathEndWait = 0;
		this.deathFrames = Math.floor(600 / constants.interval);
		this.deathStepUp = Math.ceil(200 / this.deathFrames);
		this.deathDir = 1;
		this.deathCount = 0;
		this.direction = directions.right;
		this.setImage(images.sprites, 0, 0);
		this.crouching = false;
		this.fast = false;
	},
	setMarioState: function(state) {
		this.marioState = state;
	},
	setState: function(state) {
		if(state !== this.state) {
			this.setMarioState(mario_states.normal);

			if(state === size_states.small)
				this.setSize(32, 46);
			else
				this.setSize(32, 62);

			this._super(state);
		}
	},
	setPosition: function(x, y) {
		this._super(x, y);
		var r = this.level.width - 640;
		var w = (this.x <= 210) ? 0 : ((this.x >= this.level.width - 230) ? r : r / (this.level.width - 440) * (this.x - 210));		
		this.level.setParallax(w);

		if(this.onground && this.x >= this.level.width - 128)
			this.victory();
	},
	input: function(keys) {
		this.fast = keys.accelerate;
		this.crouching = keys.down;
		
		if(!this.crouching) {
			if(this.onground && keys.up)
				this.jump();
				
			if(keys.accelerate && this.marioState === mario_states.fire)
				this.shoot();
				
			if(keys.right || keys.left)
				this.walk(keys.left, keys.accelerate);
			else
				this.vx = 0;
		}
	},
	victory: function() {
		this.level.playMusic('success');
		this.clearFrames();
        this.blinking = 0;
        this.invulnerable = 0;
		this.view.show();
		var showy;
		
		if(this.state === size_states.small)
			showy = 0;
		else {
			if(this.marioState === mario_states.normal)
				showy = 88;
			else if(this.marioState === mario_states.fire)
				showy = 150;
		}
		
		this.setImage(images.sprites, 384, showy);
		this.level.next();
	},
	shoot: function() {
		if(!this.cooldown) {
			this.cooldown = constants.cooldown;
			this.level.playSound('shoot');
			new Bullet(this);
		}
	},
	setVelocity: function(vx, vy) {
		if(this.crouching) {
			vx = 0;
			this.crouch();
		} else {
			if(this.onground && vx > 0)
				this.walkRight();
			else if(this.onground && vx < 0)
				this.walkLeft();
			else
				this.stand();
		}
	
		this._super(vx, vy);
	},
	blink: function(times) {
		this.blinking = Math.max(2 * times * constants.blinkfactor, this.blinking || 0);
	},
	invincible: function() {
		this.level.playMusic('invincibility');
		this.deadly = Math.floor(constants.invincible / constants.interval);
		this.invulnerable = this.deadly;
		this.blink(Math.ceil(this.deadly / (2 * constants.blinkfactor)));
	},
	grow: function() {
		if(this.state === size_states.small) {
			this.level.playSound('grow');
			this.setState(size_states.big);
			this.blink(3);
		}
	},
	shooter: function() {
		if(this.state === size_states.small)
			this.grow();
		else
			this.level.playSound('grow');
			
		this.setMarioState(mario_states.fire);
	},
	walk: function(reverse, fast) {
		this.vx = constants.walking_v * (fast ? 2 : 1) * (reverse ? - 1 : 1);
	},
	walkRight: function() {
		if(this.state === size_states.small) {
			if(!this.setupFrames(8, 2, false, 'WalkRightSmall'))
				this.setImage(images.sprites, 32, 0);
		} else {
			if(this.marioState === mario_states.normal) {
				if(!this.setupFrames(9, 2, false, 'WalkRightBig'))
					this.setImage(images.sprites, 32, 88);
			} else if(this.marioState === mario_states.fire) {
				if(!this.setupFrames(9, 2, false, 'WalkRightFire'))
					this.setImage(images.sprites, 32, 150);
			}
		}
	},
	walkLeft: function() {
		if(this.state === size_states.small) {
			if(!this.setupFrames(8, 2, false, 'WalkLeftSmall'))
				this.setImage(images.sprites, 288, 0);
		} else {
			if(this.marioState === mario_states.normal) {
				if(!this.setupFrames(9, 2, false, 'WalkLeftBig'))
					this.setImage(images.sprites, 288, 88);
			} else if(this.marioState === mario_states.fire) {
				if(!this.setupFrames(9, 2, false, 'WalkLeftFire'))
					this.setImage(images.sprites, 288, 150);
			}
		}
	},
	stand: function() {
		var s = this.state + this.marioState - 1;
		var coords = this.standSprites[s][this.direction === directions.left ? 0 : 1][this.onground ? 0 : 1];
		this.setImage(images.sprites, coords.x, coords.y);
		this.clearFrames();
	},
	crouch: function() {
		var s = this.state + this.marioState - 1;
		var coords = this.crouchSprites[s][this.direction === directions.left ? 0 : 1];
		this.setImage(images.sprites, coords.x, coords.y);
		this.clearFrames();
	},
	jump: function() {
		this.level.playSound('jump');
		this.vy = constants.jumping_v;
	},
	move: function() {
		this.input(this.level.getInput());
		this._super();
	},
	addHeart: function() {
		this.setHearts(this.hearts + 1);
	},
	playFrame: function() {		
		if(this.blinking) {
			if(this.blinking % constants.blinkfactor === 0)
				this.view.toggle();
				
			this.blinking--;
		}
		
		if(this.cooldown)
			this.cooldown--;
		
		if(this.deadly)
			this.deadly--;
		
		if(this.invulnerable)
			this.invulnerable--;
		
		this._super();
	},
	setHearts: function(hearts) {
		this.hearts = hearts;
		
		if(this.hearts >= constants.max_hearts) {
			this.addLife()
			this.hearts -= constants.max_hearts;
		}

		this.level.world.parent().children('#heartNumber').text(this.hearts);
	},
	addLife: function() {
		this.level.playSound('lifeupgrade');
		this.setLifes(this.lifes + 1);
	},
	setLifes : function(lifes) {
		this.lifes = lifes;
		this.level.world.parent().children('#liveNumber').text(this.lifes);
	},
	death: function() {
		if(this.deathBeginWait) {
			this.deathBeginWait--;
			return true;
		}
		
		if(this.deathEndWait)
			return --this.deathEndWait;
		
		this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px' });
		this.deathCount += this.deathDir;
		
		if(this.deathCount === this.deathFrames)
			this.deathDir = -1;
		else if(this.deathCount === 0)
			this.deathEndWait = Math.floor(1800 / constants.interval);
			
		return true;
	},
	die: function() {
		this.setMarioState(mario_states.normal);
		this.deathStepDown = Math.ceil(240 / this.deathFrames);
		this.setSize(32, 48);
		this.setupFrames(9, 2, true);
		this.setImage(images.sprites, 416, 0);
		this.level.playMusic('die');
		this._super();
	},
	hurt: function(from) {
		if(this.deadly)
			from.die();
		else if(this.invulnerable)
			return;
		else if(this.state === size_states.small) {
			this.die();
		} else {
			this.invulnerable = Math.floor(constants.invulnerable / constants.interval);
			this.blink(Math.ceil(this.invulnerable / (2 * constants.blinkfactor)));
			this.setState(size_states.small);
			this.level.playSound('hurt');			
		}
	},
}, 'mario');

/*
 * -------------------------------------------
 * SAGE CLASS
 * -------------------------------------------
 */
var Sage = Hero.extend({
	init: function(x, y, level) {
		this.width = 80;
		this._super(x, y, level);
		this.setSize(46, 64);
		this.direction = directions.right;
		this.setImage(images.sage, 0, 80);
	},
	setVelocity: function(vx, vy) {
		this._super(vx, vy);
		
        if(vx !== 0) {
			if(!this.setupFrames(6, 4, false, 'Walk'))
				this.setImage(images.sage, 138, 80);
		} else if(this.frameTick) {
            this.clearFrames();
			this.setImage(images.sage, 0, 80);
		}
	},
}, 'sage');

/*
 * -------------------------------------------
 * BIGMARIO CLASS
 * -------------------------------------------
 */
var BigMario = Hero.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.direction = directions.right;
		this.setSize(32, 62);
		this.setImage(images.sprites, 0, 88);
	},
	setVelocity: function(vx, vy) {
		this._super(vx, vy);
		
        if(vx !== 0) {
			if(!this.setupFrames(9, 2, false, 'WalkRightBig'))
				this.setImage(images.sprites, 32, 88);
		} else if(this.frameTick) {
            this.clearFrames();
			this.setImage(images.sprites, 0, 88);
		}
	},
}, 'bigmario');

/*
 * -------------------------------------------
 * ENEMY CLASS
 * -------------------------------------------
 */
var Enemy = Figure.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.speed = 0;
	},
	hide: function() {
		this.invisible = true;
		this.view.hide();
	},
	show: function() {	
		this.invisible = false;
		this.view.show();
	},
	move: function() {
		if(!this.invisible) {
			this._super();
		
			if(this.vx === 0) {
				var s = this.speed * Math.sign(this.speed);
				this.setVelocity(this.direction === directions.right ? -s : s, this.vy);
			}
		}
	},
	collides: function(is, ie, js, je, blocking) {
		if(this.j + 1 < this.level.getGridHeight()) {
			for(var i = is; i <= ie; i++) {
				if(i < 0 || i >= this.level.getGridWidth())
					return true;
					
				var obj = this.level.obstacles[i][this.j + 1];
				
				if(!obj || (obj.blocking & ground_blocking.top) !== ground_blocking.top)
					return true;
			}
		}
		
		return this._super(is, ie, js, je, blocking);
	},
	setSpeed: function(v) {
		this.speed = v;
		this.setVelocity(-v, 0);
	},
	hurt: function(from) {
		this.die();
	},
	hit: function(opponent) {
		if(this.invisible)
			return;
			
		if(opponent instanceof Mario) {
			if(opponent.vy < 0 && opponent.y - opponent.vy >= this.y + this.state * 32) {
				opponent.setVelocity(opponent.vx, constants.bounce);
				this.hurt(opponent);
			} else {
				opponent.hurt(this);
			}
		}
	},
});

/*
 * -------------------------------------------
 * JAWA CLASS
 * -------------------------------------------
 */
var Jawa = Enemy.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setSize(34, 32);
		this.setSpeed(constants.jawa_v);
		this.death_mode = death_modes.normal;
		this.deathCount = 0;
	},
	setVelocity: function(vx, vy) {
		this._super(vx, vy);
		
		if(this.direction === directions.left) {
			if(!this.setupFrames(6, 2, false, 'LeftWalk'))
				this.setImage(images.enemies, 34, 188);
		} else {
			if(!this.setupFrames(6, 2, true, 'RightWalk'))
				this.setImage(images.enemies, 0, 228);
		}
	},
	death: function() {
		if(this.death_mode === death_modes.normal)
			return --this.deathCount;
		
		this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + this.deathStep + 'px' });
		this.deathCount += this.deathDir;
		
		if(this.deathCount === this.deathFrames)
			this.deathDir = -1;
		else if(this.deathCount === 0)
			return false;
			
		return true;
	},
	die: function() {
		this.clearFrames();
		
		if(this.death_mode === death_modes.normal) {
			this.level.playSound('enemy_die');
			this.setImage(images.enemies, 102, 228);
			this.deathCount = Math.ceil(600 / constants.interval);
		} else if(this.death_mode === death_modes.bantha) {
			this.level.playSound('bantha');
			this.setImage(images.enemies, 68, this.direction === directions.right ? 228 : 188);
			this.deathFrames = Math.floor(250 / constants.interval);
			this.deathDir = 1;
			this.deathStep = Math.ceil(150 / this.deathFrames);
		}
		
		this._super();
	},
}, 'jawa');

/*
 * -------------------------------------------
 * BANTHA CLASS
 * -------------------------------------------
 */
var Bantha = Enemy.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setSize(54, 32);
		this.speed = 0;
		this.setImage(images.enemies, 0, 494);
	},
	activate: function(x, y) {
		this.setupFrames(6, 4, false)
		this.setPosition(x, y);
		this.show();
	},
	takeBack: function(where) {
		if(where.setBantha(this))
			this.clearFrames();
	},
	move: function() {
		this._super();
	},
	hit: function(opponent) {
		if(this.invisible)
			return;
			
		if(this.vx) {
			if(opponent instanceof Mario) {
				if(opponent.y >= this.y + this.height / 2) {
					this.setSpeed(0);
					opponent.setVelocity(opponent.vx, constants.bounce);
				} else {
					opponent.hurt(this);
				}
			} else {
				opponent.deathMode = death_modes.bantha;
				opponent.die();
			}
		} else {
			if(opponent instanceof Mario) {
				this.setSpeed(opponent.direction === directions.right ? -constants.bantha_v : constants.bantha_v);
				opponent.setVelocity(opponent.vx, constants.bounce);
			} else if(opponent instanceof TuskenRaider && opponent.state === size_states.small)
				this.takeBack(opponent);
		}
	},
	collides: function(is, ie, js, je, blocking) {		
		if(is < 0 || ie >= this.level.obstacles.length)
			return true;
			
		if(js < 0 || je >= this.level.getGridHeight())
			return false;
			
		for(var i = is; i <= ie; i++) {
			for(var j = je; j >= js; j--) {
				var obj = this.level.obstacles[i][j];
				
				if(obj && ((obj.blocking & blocking) === blocking))
					return true;
			}
		}
		
		return false;
	},
}, 'bantha');

/*
 * -------------------------------------------
 * TUSKENRAIDER CLASS
 * -------------------------------------------
 */
var TuskenRaider = Enemy.extend({
	init: function(x, y, level) {
		this.walkSprites = [
			[{ x : 54, y : 382 },{ x : 0, y : 437 }],
			[{ x : 54, y : 266 },{ x : 0, y : 325 }]
		];
		this._super(x, y, level);
		this.wait = 0;
		this.deathMode = death_modes.normal;
		this.deathFrames = Math.floor(250 / constants.interval);
		this.deathStepUp = Math.ceil(150 / this.deathFrames);
		this.deathStepDown = Math.ceil(182 / this.deathFrames);
		this.deathDir = 1;
		this.deathCount = 0;
		this.setSize(54, 54);
		this.setBantha(new Bantha(x, y, level));
	},
	setBantha: function(bantha) {
		if(this.bantha || this.wait)
			return false;
			
		this.bantha = bantha;
		bantha.hide();
		this.setState(size_states.big);
		return true;
	},
	setState: function(state) {
		this._super(state);
		
		if(state === size_states.big)
			this.setSpeed(constants.big_turtle_v);
		else
			this.setSpeed(constants.small_turtle_v);
	},
	setVelocity: function(vx, vy) {
		this._super(vx, vy);
		var rewind = this.direction === directions.right;
		var coords = this.walkSprites[this.state - 1][rewind ? 1 : 0];
		var label = Math.sign(vx) + '-' + this.state;
		
		if(!this.setupFrames(6, 2, rewind, label))
			this.setImage(images.enemies, coords.x, coords.y);
	},
	die: function() {
		this._super();
		this.clearFrames();
		
		if(this.deathMode === death_modes.normal) {
			this.level.playSound('enemy_die');
			this.deathFrames = Math.floor(600 / constants.interval);
			this.setImage(images.enemies, 140, 437);
		} else if(this.deathMode === death_modes.bantha) {
			this.level.playSound('bantha');
			this.setImage(images.enemies, 68, (this.state === size_states.small ? (this.direction === directions.right ? 437 : 382) : 325));
		}
	},
	death: function() {
		if(this.deathMode === death_modes.normal)
			return --this.deathFrames;
			
		this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px' });
		this.deathCount += this.deathDir;
		
		if(this.deathCount === this.deathFrames)
			this.deathDir = -1;
		else if(this.deathCount === 0)
			return false;
			
		return true;
	},
	move: function() {
		if(this.wait)
			this.wait--;
			
		this._super();
	},
	hurt: function(opponent) {		
		if(this.state === size_states.small)
			return this.die();
		
		this.level.playSound('enemy_die');
		this.wait = constants.bantha_wait;
		this.setState(size_states.small);
		this.bantha.activate(this.x, this.y);
		this.bantha = undefined;
	},
	hit: function(opponent) {
		if(this.wait)
			return;

		this._super(opponent);
	}
}, 'tuskenraider');

/*
 * -------------------------------------------
 * SPIKEDTURTLE CLASS
 * -------------------------------------------
 */
var SpikedTurtle = Enemy.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setSize(34, 32);
		this.setSpeed(constants.spiked_turtle_v);
		this.deathFrames = Math.floor(250 / constants.interval);
		this.deathStepUp = Math.ceil(150 / this.deathFrames);
		this.deathStepDown = Math.ceil(182 / this.deathFrames);
		this.deathDir = 1;
		this.deathCount = 0;
	},
	setVelocity: function(vx, vy) {
		this._super(vx, vy);
		
		if(this.direction === directions.left) {
			if(!this.setupFrames(4, 2, true, 'LeftWalk'))
				this.setImage(images.enemies, 0, 106);
		} else {
			if(!this.setupFrames(6, 2, false, 'RightWalk'))
				this.setImage(images.enemies, 34, 147);
		}
	},
	death: function() {
		this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px' });
		this.deathCount += this.deathDir;
		
		if(this.deathCount === this.deathFrames)
			this.deathDir = -1;
		else if(this.deathCount === 0)
			return false;
			
		return true;
	},
	die: function() {
		this.level.playSound('bantha');
		this.clearFrames();
		this._super();
		this.setImage(images.enemies, 68, this.direction === directions.left ? 106 : 147);
	},
	hit: function(opponent) {
		if(this.invisible)
			return;
			
		if(opponent instanceof Mario) {
			opponent.hurt(this);
		}
	},
}, 'spikedturtle');

/*
 * -------------------------------------------
 * BOBAFETT CLASS
 * -------------------------------------------
 */
var BobaFett = Enemy.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setSize(41, 64);
		this.setMode(bobafett_mode.sleep, directions.left);
	},
	die: function() {
        //Do nothing here!
    },
	setMode: function(mode, direction) {
		if(this.mode !== mode || this.direction !== direction) {
			this.mode = mode;
			this.direction = direction;
			this.setImage(images.bobafett, 41 * (mode + direction - 1), 0);
		}
	},
	move: function() {
		var mario = this.level.mario;
		
		if(mario && Math.abs(this.x - mario.x) <= 800) {
			var dx = Math.sign(mario.x - this.x);
			var dy = Math.sign(mario.y - this.y) * 0.5;
			var direction = dx ? dx + 2 : this.direction;
			var mode = mario.direction === direction ? bobafett_mode.awake : bobafett_mode.sleep;
			this.setMode(mode, direction);
			
			if(mode)		
				this.setPosition(this.x + dx, this.y + dy);
		} else 
			this.setMode(bobafett_mode.sleep, this.direction);
	},
	hit: function(opponent) {			
		if(opponent instanceof Mario) {
			opponent.hurt(this);
		}
	},
}, 'bobafett');

/*
 * -------------------------------------------
 * SARLACC CLASS
 * -------------------------------------------
 */
var Sarlacc = Enemy.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setSize(34, 42);
		this.setupFrames(5, 2, true);
		this.setImage(images.enemies, 0, 3);
	},
	setVelocity: function(vx, vy) {
		this._super(0, 0);
	},
	die: function() {
		this.level.playSound('bantha');
		this.clearFrames();
		this._super();
	},
	hit: function(opponent) {
		if(this.invisible)
			return;
			
		if(opponent instanceof Mario) {
			opponent.hurt(this);
		}
	},
});

/*
 * -------------------------------------------
 * STATICSARLACC CLASS
 * -------------------------------------------
 */
var StaticSarlacc = Sarlacc.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.deathFrames = Math.floor(250 / constants.interval);
		this.deathStepUp = Math.ceil(100 / this.deathFrames);
		this.deathStepDown = Math.ceil(132 / this.deathFrames);
		this.deathDir = 1;
		this.deathCount = 0;
	},
	die: function() {
		this._super();
		this.setImage(images.enemies, 68, 3);
	},
	death: function() {
		this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px' });
		this.deathCount += this.deathDir;
		
		if(this.deathCount === this.deathFrames)
			this.deathDir = -1;
		else if(this.deathCount === 0)
			return false;
			
		return true;
	},
}, 'staticsarlacc');

/*
 * -------------------------------------------
 * PIPESARLACC CLASS
 * -------------------------------------------
 */
var PipeSarlacc = Sarlacc.extend({
	init: function(x, y, level) {
		this.bottom = y - 48;
		this.top = y - 6;
		this._super(x + 16, y - 6, level);
		this.setDirection(directions.down);
		this.setImage(images.enemies, 0, 56);
		this.deathFrames = Math.floor(250 / constants.interval);
		this.deathFramesExtended = 6;
		this.deathFramesExtendedActive = false;
		this.deathStep = Math.ceil(100 / this.deathFrames);
		this.deathDir = 1;
		this.deathCount = 0;
		this.view.css('z-index', 95);
	},
	setGridPosition: function(x, y) {
		this.i = Math.floor(x / 32);
		this.j = Math.ceil(this.level.getGridHeight() - 1 - (y + 6) / 32);
		
		if(this.j > this.level.getGridHeight())
			this.die();
	},
	setDirection: function(dir) {
		this.direction = dir;
	},
	setPosition: function(x, y) {
		if(y === this.bottom || y === this.top) {
			this.minimum = constants.pipesarlacc_count;
			this.setDirection(this.direction === directions.up ? directions.down : directions.up);
		}
		
		this._super(x, y);
	},
	blocked: function() {
		if(this.y === this.bottom) {
			var state = false;
			this.y += 48;
			
			for(var i = this.level.figures.length; i--; ) {
				if(this.level.figures[i] != this && q2q(this.level.figures[i], this)) {
					state = true;
					break;
				}
			}
			
			this.y -= 48;
			return state;
		}
		
		return false;
	},
	move: function() {
		if(this.minimum === 0) {
			if(!this.blocked())
				this.setPosition(this.x, this.y - (this.direction - 3) * constants.pipesarlacc_v);
		} else
			this.minimum--;
	},
	die: function() {		
		this._super();
		this.setImage(images.enemies, 68, 56);
	},
	death: function() {
		if(this.deathFramesExtendedActive) {
			this.setPosition(this.x, this.y - 8);
			return --this.deathFramesExtended;
		}
		
		this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + this.deathStep + 'px' });
		this.deathCount += this.deathDir;
		
		if(this.deathCount === this.deathFrames)
			this.deathDir = -1;
		else if(this.deathCount === 0)
			this.deathFramesExtendedActive = true;
			
		return true;
	},
}, 'pipesarlacc');
