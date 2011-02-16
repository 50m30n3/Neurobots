var running;
var timer;

var ctx;
var zoom, camx, camy;

var bots;
var food;

var fooddelay;
var foodrate;

const worldsize = 600;
const foodradius = 500;

function draw()
{
	ctx.save();
	ctx.fillStyle = "rgb( 70, 80, 60 )"
	ctx.fillRect( 0, 0, 800, 600 );
	
	ctx.translate( 400, 300 );
	ctx.scale( zoom, zoom );
	ctx.translate( camx, camy );

	ctx.strokeStyle = "rgb( 0, 0, 0 )"
	ctx.strokeRect( -worldsize, -worldsize, worldsize*2, worldsize*2 );

	for( var i in food )
		food[i].draw( ctx );

	for( var i in bots )
		bots[i].draw( ctx );
	
	ctx.restore();
}

function loop()
{
	(function checkbots() {
        for( var i=0; i<bots.length; i++ )
	{
		if( bots[i].alife == false )
		{
			if( selected == i )
				selected = -1;
			if( selected > i )
				selected -= 1;

			bots.splice( i, 1 );
			i--;
		}
		else
		{
			bots[i].step();
		}
	}
        })();

        (function checkfood() {
	for( var i=0; i<food.length; i++ )
	{
		if(food[i].alife == false )
		{
			food.splice( i, 1 );
			i--;
		}
		else
		{
			food[i].step();
		}
	}
        })();

	if( bots.length < 5 )
		bots.push( new neurobot( worldsize*2.0*(Math.random()-0.5), worldsize*2.0*(Math.random()-0.5), Math.PI*2*Math.random() ) );

	if( ( fooddelay <= 0 ) && ( food.length < 200 ) )
	{
		fooddelay = foodrate;

		var ang = Math.PI*2*Math.random();
		var dist = Math.random();
		dist = dist*foodradius;
		
		food.push( new plant( Math.cos(ang)*dist, Math.sin(ang)*dist ) );
	}

	if( fooddelay > 0 )
		fooddelay--;

	draw();
	
	var now = new Date().getTime();
	fps = 1000/(now-time);
	time = now;

	statdelay--;
	if( statdelay <= 0 )
	{
		do_stats()
		statdelay = 10;
	}
}

function resetsim()
{
	selected = -1;

	var value = parseInt( document.getElementById( "bdepthbox" ).value );
	if( ( value <= 16 ) && ( value >= 2 ) )
		braindepth = value;
	else
	{
		alert( "Brain size out of range (2-16)" );
		return;
	}
	
	value = parseInt( document.getElementById( "bsizebox" ).value );
	if( ( value <= 16 ) && ( value >= 4 ) && ( value%2 == 0 ) )
		brainsize = value;
	else
	{
		alert( "Brain complexity out of range (4-16) or not a multiple of 2" );
		return;
	}

	bots = new Array();
	for( var i=0; i<25; i++ )
		bots.push( new neurobot( worldsize*2.0*(Math.random()-0.5), worldsize*2.0*(Math.random()-0.5), Math.PI*2*Math.random() ) );

	food = new Array();
	for( var i=0; i<200; i++ )
	{
		var ang = Math.PI*2*Math.random();
		var dist = Math.random();
		dist = dist*foodradius;
	
		food.push( new plant( Math.cos(ang)*dist, Math.sin(ang)*dist, 150 ) );
	}

	fooddelay = 0;
	
	draw();
}

function init()
{
	var canvas = document.getElementById( "canvas" );

	if( canvas.getContext )
	{
		ctx = canvas.getContext( "2d" );

		resetcam();

		mousedown = false;
		canvas.onmousewheel = wheelzoom;
		canvas.onmousedown = mouse_down;
		canvas.onclick = mouse_click;
		document.onmouseup = mouse_up;
		document.onmousemove = movecam;

		resetsim();

		fooddelay = 0;
		foodrate = 10;

		draw();

		statdelay = 0;

		running = true;
		timer = setInterval( loop, 20 );
	}
}

