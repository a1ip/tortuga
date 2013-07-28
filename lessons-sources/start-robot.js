/*
Текст задачи:

Робот

lessons/start-robot.png

Нарисуйте робота.<br/>
&nbsp;&nbsp;Ширина туловища равна 100, высота туловища&nbsp;&mdash; 150.<br/>
&nbsp;&nbsp;Ширина ног и рук равна 30. Высота ног&nbsp;&mdash; 60. Высота рук&nbsp;&mdash;100<br/>
&nbsp;&nbsp;Размер головы равен 60, длина антенн&nbsp;&mdash; 15.

*/
var robot = function(t, p)
{
	//body
	t.tailDown()
	repeat(2)
	t.go(p.width).rotate(90).go(p.height).rotate(90)
	end()
	t.tailUp()

	//legs
	var legPrefix = (p.width - 2 * p.legWidth) / 4
	repeat(2)
	t.go(legPrefix).rotate(-90)
	t.tailDown()
	t.go(p.legHeight).rotate(90).go(p.legWidth).rotate(90).go(p.legHeight)
	t.tailUp()
	t.rotate(-90).go(legPrefix)
	end()

	//way to arm
	t.rotate(90).go(p.height - p.armHeight).rotate(-90)
	//arm
	t.tailDown()
	t.go(p.armWidth).rotate(90).go(p.armHeight).rotate(90).go(p.armWidth)
	t.tailUp()
	//way to another arm
	t.go(p.width)
	//another arm
	t.tailDown()
	t.go(p.armWidth).rotate(90).go(p.armHeight).rotate(90).go(p.armWidth)
	t.tailUp()

	//way to head
	t.rotate(90).go(p.armHeight).rotate(-90)

	//head
	var shoulderWidth = (p.width - p.headWidth) / 2
	t.go(shoulderWidth).rotate(90)
	t.tailDown()
	repeat(3)
	t.go(p.headWidth).rotate(-90)
	end()
	t.tailUp()
	//go to antenna
	var antennaPrefix = p.headWidth / 4
	t.rotate(-90).go(p.headWidth).rotate(90)
	repeat(2)
	t.go(antennaPrefix).rotate(-90)
	t.tailDown().go(antennaPrefix).tailUp().go(-antennaPrefix)
	t.rotate(90).go(antennaPrefix)
	end()

	//way to start
	t.go(shoulderWidth).rotate(90).go(p.headWidth).go(p.height).rotate(90)
}

var tortoise = createTortoise(300, 100, "#888");
clearCanvas();

robot(tortoise, 
	{
		width: 100,
		height: 150,
		legWidth: 30,
		legHeight: 60,
		armWidth: 30,
		armHeight: 100,
		headWidth: 60
	})

tortoise.go(1000);