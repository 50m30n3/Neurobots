function plant( x, y, size )
{
	this.alife = true;
	this.x = x;
	this.y = y;
	
	if( ! size )
		this.size = 50;
	else
		this.size = size;

	this.step = function()
	{
		if( this.size < 150 )
			this.size += 0.25;
	}
	

	this.draw = function( ctx )
	{
		ctx.save();

		ctx.translate( this.x, this.y );
		
		ctx.fillStyle = "rgb( "+(Math.round(this.size)+50)+", 200, 0 )"
		ctx.strokeStyle = "rgb( 0, 0, 0 )"
		
		ctx.beginPath();
		ctx.arc( 0, 0, 3, 0, 2*Math.PI, false );
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
	}
}

