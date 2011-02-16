var statdelay;
var time = new Date().getTime();
var fps, smoothfps = 0;

var selected;

var stats = new Array();

function botstats( braindump )
{
	if( selected == -1 )
	{
		document.getElementById( "botstats" ).style.display = "none";
		document.getElementById( "worldopts" ).style.display = "block";
		return;
	}

	document.getElementById( "botstats" ).style.display = "block";
	document.getElementById( "worldopts" ).style.display = "none";

	document.getElementById( "botgenspan" ).innerHTML = bots[selected].generation;
	document.getElementById( "botagespan" ).innerHTML = bots[selected].age;
	document.getElementById( "botdepthspan" ).innerHTML = bots[selected].braindepth;
	document.getElementById( "botsizespan" ).innerHTML = bots[selected].brainsize;
	document.getElementById( "botfoodspan" ).innerHTML = Math.round( bots[selected].foodlevel );
	document.getElementById( "botratespan" ).innerHTML = bots[selected].mutationrate.toFixed(4);
	document.getElementById( "botchildspan" ).innerHTML = bots[selected].children;
	document.getElementById( "botdotsspan" ).innerHTML = bots[selected].dotseaten;
	
	if( braindump )
	{
		document.getElementById( "braindata" ).value = bots[selected].getdata();
		refreshlist();
	}
		
	bctx = document.getElementById( "brain" ).getContext( "2d" );

	bctx.clearRect( 0, 0, 160, 160 );
	
	for( var x=0; x<bots[selected].brainsize; x++ )
	for( var y=0; y<bots[selected].braindepth; y++ )
	{
		var act = Math.round( bots[selected].neurons[y][x].activation*255.0 );
		bctx.fillStyle = "rgb( "+act+", "+act+", "+act+" )";
		bctx.fillRect( x*10, y*10, 10, 10 );
	}
}

function do_stats()
{
	var currstats = {};
	var age, rate;
	
	currstats.population = bots.length;
	currstats.foodcount = food.length;
	
	age = 0;
	rate = 0;
	
	for( var i in bots )
	{
		age += bots[i].age;
		rate += bots[i].mutationrate;
	}

	currstats.avgage = age / bots.length;
	currstats.avgrate = rate / bots.length;
	
	document.getElementById( "popspan" ).innerHTML = currstats.population;
	document.getElementById( "foodspan" ).innerHTML = currstats.foodcount;
	document.getElementById( "agespan" ).innerHTML = Math.round(currstats.avgage);
	document.getElementById( "ratespan" ).innerHTML = currstats.avgrate.toFixed(4);
	smoothfps = smoothfps*0.9+fps*0.1;
	document.getElementById( "fpsspan" ).innerHTML = Math.round( smoothfps );
	
	stats.unshift( currstats );
	if( stats.length >= 500 )
		stats.pop();
	
	var sctx = document.getElementById( "stats" ).getContext( "2d" );
	
	sctx.clearRect( 0, 0, 500, 102 );

	for( var i=0; i<=10; i++ )
	{
		sctx.beginPath();
		sctx.moveTo( 0, i*10+1 );
		sctx.lineTo( 500, i*10+1 );
		sctx.strokeStyle = "rgb( 200, 200, 200 )"	
		sctx.stroke();
	}

	sctx.strokeStyle = "rgb( 0, 0, 0 )"
	sctx.strokeRect( 0, 0, 500, 102 );

	sctx.beginPath();
	for( var i in stats )
		sctx.lineTo( 499-i, 101-stats[i].avgage/100.0 );
	sctx.strokeStyle = "rgb( 0, 0, 255 )"	
	sctx.stroke();
	
	sctx.beginPath();
	for( var i in stats )
		sctx.lineTo( 499-i, 101-stats[i].avgrate*100.0 );
	sctx.strokeStyle = "rgb( 0, 0, 0 )"	
	sctx.stroke();

	sctx.beginPath();
	for( var i in stats )
		sctx.lineTo( 499-i, 101-stats[i].foodcount*0.5 );
	sctx.strokeStyle = "rgb( 0, 255, 0 )"	
	sctx.stroke();

	sctx.beginPath();
	for( var i in stats )
		sctx.lineTo( 499-i, 101-stats[i].population*0.5 );
	sctx.strokeStyle = "rgb( 255, 0, 0 )"	
	sctx.stroke();
	
	botstats( false );
}

