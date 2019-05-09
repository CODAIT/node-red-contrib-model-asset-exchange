const Jimp = require('jimp');

function rect(img, x1, y1, x2, y2, height, fill, hexcolor)
{
	var white = Jimp.rgbaToInt(255, 255, 255, 255);
	var color = hexcolor;
	if(fill)
	{
		if(x1 < x2)
		{
			for(var x = x1; x <= x2; x++)
			{
				for(var y = y1; y <= height + y2; y++)
				{
					img.setPixelColor(color, x, y);
				}
			}
		}
	}
	if(! fill)
	{
		if(x1 < x2)
		{
			for(var x = x1; x <= x2; x++)
			{
				for(var y = y1; y <= height + y2; y++)
				{
					if(y == y1 || y == height || x == x1 || x == x2)
					{
						img.setPixelColor(color, x, y);
					}
					else
					{
						img.setPixelColor(white, x, y);
					}
				}
			}
		}
		if(x1 == x2)
			throw "Can't draw a rectangle on one point";
		if(x1 > x2)
		{
			for(var x = x2; x <= x1; x++)
			{
				for(var y = y1; y <= height + y2; y++)
				{
					if(y == y1 || y == height || x == x1 || x == x2)
					{
						img.setPixelColor(color, x, y);
					}
					else
					{
						img.setPixelColor(white, x, y);
					}
				}
			}
		}
	}
}

module.exports = rect;