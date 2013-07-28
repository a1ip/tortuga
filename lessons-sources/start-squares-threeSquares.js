/*
Текст задачи:

Пирамида

lessons/start-squares-threeSquares.png

Нарисуйте квадраты. Размеры квадратов: 120, 90, 50, 20;
*/
var square = function(t, size)
{
	t.tailDown()
	repeat(4)
	t.go(size).rotate(90)
	end()
	t.tailUp()
}
var drawAndGo = function(t, sizes, index)
{
	var size = sizes[index];
	square(t, size)
	if(index < sizes.length - 1)
	{
		t.rotate(90).go(size).rotate(-90)
		var gap = (size - sizes[index + 1]) / 2
		t.go(gap)
		drawAndGo(t, sizes, index + 1)
		t.go(-gap)
		t.rotate(90).go(-size).rotate(-90)
	}
}

var sizes = [120, 90, 50, 20]
clearCanvas();
var tortoise = createTortoise(300, 50, "#666")
drawAndGo(tortoise, sizes, 0)
tortoise.go(1000)