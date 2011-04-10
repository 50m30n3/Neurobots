var mousedown;
var lastx, lasty;

function wheelzoom( event )
{
	if( event.detail )
		delta = -event.detail;
	else
		delta = event.wheelDelta;

	if( delta < 0 )
		zoom *= 1.1;
	else
		zoom *= 0.9;

	if( zoom > 10.0 ) zoom = 10.0;
	if( zoom < 0.25 ) zoom = 0.25;

	if( ! running )
		draw();

	event.preventDefault();
}

function movecam( event )
{
	if( ! mousedown ) return;

	var dx = event.clientX-lastx;
	var dy = event.clientY-lasty;
	
	lastx = event.clientX;
	lasty = event.clientY;
	
	camx += dx/zoom;
	camy += dy/zoom;
	
	if( camx > worldsize ) camx = worldsize;
	if( camx < -worldsize ) camx = -worldsize;
	if( camy > worldsize ) camy = worldsize;
	if( camy < -worldsize ) camy = -worldsize;

	if( ! running )
		draw();
}

function winresize( event )
{
	var canvas = document.getElementById( "canvas" );
	var container = document.getElementById( "container" );

	var width = container.clientWidth-10;
	var aspect = window.innerWidth/window.innerHeight;

	canvas.width = width;
	canvas.height = width/aspect;
}

function mouse_down( event )
{
	if( event.button != 1 ) return;

	mousedown = true;
	lastx = event.clientX;
	lasty = event.clientY;
}

function mouse_up( event )
{
	mousedown = false;
}

function mouse_click( event )
{
	if( event.button == 0 )
	{
		var x = event.pageX-event.target.offsetLeft;
		var y = event.pageY-event.target.offsetTop;
		var cx = (x-ctx.canvas.width/2)/zoom-camx;
		var cy = (y-ctx.canvas.height/2)/zoom-camy;

		var smallest = worldsize*2;
		var sel = -1;

		for( var i in bots )
		{
			if( i == selected ) continue;

			var dist = Math.sqrt( (cx-bots[i].x)*(cx-bots[i].x)+(cy-bots[i].y)*(cy-bots[i].y) );
			if( dist < smallest )
			{
				smallest = dist;
				sel = i;
			}
		}
		
		if( ( sel != -1 ) && ( smallest < 10 ) )
		{
			selected = sel;
		}
		else
		{
			selected = -1;
		}
		
		botstats( true );
	}

	if( ! running )
		draw();
}

function resetcam()
{
	zoom = 1.0;
	camx = 0.0;
	camy = 0.0;

	if( ! running )
		draw();
}

function startsim()
{
	if( ! running )
	{
		timer = setInterval( loop, 20 );
		document.getElementById("startbutton").disabled = true;
		document.getElementById("stopbutton").disabled = false;
		running = true;
	}
}

function stopsim()
{
	if( running )
	{
		clearInterval( timer );
		document.getElementById("startbutton").disabled = false;
		document.getElementById("stopbutton").disabled = true;
		running = false;
	}
}

function addbot()
{
	var value = parseInt( document.getElementById( "bdepthbox" ).value );
	if( ( value <= 16 ) && ( value >= 2 ) )
		braindepth = value;
	else
	{
		alert( "Brain size out of range (2-16)" );
		return;
	}
	
	value = parseInt( document.getElementById( "bsizebox" ).value );
	if( ( value <= 16 ) && ( value >= 4 ) && ( value%4 == 0 ) )
		brainsize = value;
	else
	{
		alert( "Brain complexity out of range (4-16) or not a multiple of 4" );
		return;
	}

	bots.push( new neurobot( 0,0, Math.PI*2*Math.random() ) );
}

function injectbrain()
{
	if( selected != -1 )
	{
		var result = bots[selected].loaddata( document.getElementById("braindata").value );
		if( result.success != true )
		{
			alert( result.msg );
		
		}

		botstats( true );
		
		if( ! running )
			draw();
	}
}

function foodratechange( value )
{
	if( ( value <= 50 ) && ( value >= 5 ) )
		foodrate = value;
}

function refreshlist()
{
	list = document.getElementById( "savename" );
	while( list.options.length > 0 )
		list.remove(0);

	var opt = new Option();
	opt.disabled = true;
	opt.value = "-";
	opt.selected = true;
	if( localStorage.length > 0 )
	{
		opt.text = "Select brain to load";
		list.disabled = false;
	}
	else
	{
		opt.text = "No saved brains";
		list.disabled = true;
	}
	list.options.add( opt );

	document.getElementById( "deletebutton" ).disabled = true;

	for( var i=0; i<localStorage.length; i++ )
	{
		list.options.add( new Option( localStorage.key(i), localStorage.key(i) ) );
	}
}

function listselect( value )
{
	if( value != "-" )
	{
		document.getElementById( "deletebutton" ).disabled = false;
		document.getElementById( "braindata" ).value = localStorage.getItem( list.value );
	}
	else
	{
		document.getElementById( "deletebutton" ).disabled = true;
	}
}

function deletebrain()
{
	list = document.getElementById( "savename" );
	if( list.value != "-" )
	{
		localStorage.removeItem( list.value );
		refreshlist()
	}
}

function savebrain()
{
	if( selected == -1 )
		return;

	var data = bots[selected].getdata();
	var filename = data.split( "!" )[1].substr(0,6) + "-" + bots[selected].braindepth + "x" + bots[selected].brainsize + "-Gen." + bots[selected].generation;
	localStorage.setItem( filename, data );
	refreshlist()
}

function selnewest()
{
	var newest = -1;
	var maxgen = -1;
	for( var i in bots )
	{
		if( bots[i].generation > maxgen )
		{
			maxgen = bots[i].generation;
			newest = i;
		}
	}
	if( newest != -1 )
	{
		selected = newest;
		botstats( true );
	}
}

function selbest()
{
	var best = -1;
	var bestval = -1;
	for( var i in bots )
	{
		if( (bots[i].age/100+bots[i].children*100+bots[i].dotseaten*10) > bestval )
		{
			bestval = (bots[i].age/100+bots[i].children*100+bots[i].dotseaten*10);
			best = i;
		}
	}
	if( best != -1 )
	{
		selected = best;
		botstats( true );
	}
}

