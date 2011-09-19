var running;
var timer;

var ctx;
var zoom, camx, camy;

var bots;
var food;

var fooddelay;
var foodrate;

var worldsize = 600;
var foodradius = 500;

function draw()
{
	ctx.save();
	ctx.fillStyle = "rgb( 70, 80, 60 )"
	ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
	
	ctx.translate( ctx.canvas.width/2, ctx.canvas.height/2 );
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

	if( bots.length <= 0 )
		reset_bots();

	if( ( fooddelay <= 0 ) && ( food.length < (foodradius*foodradius)/2000 ) )
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

function reset_bots()
{
	bots = [];
	for( var i=0; i<(worldsize*worldsize)/15000; i++ )
		bots.push( new neurobot( worldsize*2.0*(Math.random()-0.5), worldsize*2.0*(Math.random()-0.5), Math.PI*2*Math.random() ) );
}

function reset_food()
{
	food = [];
	for( var i=0; i<(foodradius*foodradius)/2000; i++ )
	{
		var ang = Math.PI*2*Math.random();
		var dist = Math.random();
		dist = dist*foodradius;
	
		food.push( new plant( Math.cos(ang)*dist, Math.sin(ang)*dist, 150 ) );
	}
}

function resetsim()
{
	selected = -1;

	var value = parseInt( document.getElementById( "bdepthbox" ).value );
	if( ( value ) && ( value <= 16 ) && ( value >= 2 ) )
		braindepth = value;
	else
	{
		alert( "Brain size out of range (2-16)" );
		return;
	}
	
	value = parseInt( document.getElementById( "bsizebox" ).value );
	if( ( value ) && ( value <= 16 ) && ( value >= 4 ) && ( value%4 == 0 ) )
		brainsize = value;
	else
	{
		alert( "Brain complexity out of range (4-16) or not a multiple of 4" );
		return;
	}

	value = parseInt( document.getElementById( "foodareabox" ).value );
	if( ( value ) && ( value >= 100 ) )
		foodradius = value;
	else
	{
		alert( "Food area out of range (>100)" );
		return;
	}

	value = parseInt( document.getElementById( "worldsizebox" ).value );
	if( ( value ) && ( value >= 100 ) )
		worldsize = value;
	else
	{
		alert( "Word size out of range (>100)" );
		return;
	}

	if( foodradius > worldsize )
	{
		foodradius = worldsize;
		document.getElementById( "foodareabox" ).value = worldsize;
	}

	reset_bots();

	reset_food();

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
		window.onresize = winresize;
		
		winresize();

		if( canvas.addEventListener )
			canvas.addEventListener( 'DOMMouseScroll', wheelzoom, false );

		resetsim();

		fooddelay = 0;
		foodrate = 10;

		draw();

		statdelay = 0;

		running = true;
		timer = setInterval( loop, 20 );
	}
}

