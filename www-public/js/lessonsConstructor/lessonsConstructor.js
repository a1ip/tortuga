ns("Torguta");
(function(){
var getLinkAreaText = function(areaValue)
{
	var link = Tortuga.ParamsUtil.getLessonLink(areaValue);
	return link;
}

var createLesson = function(text)
{
	var lines = text.split("\n");
	var size = lines.length;

	var lesson = [];
	for(var i = 0; i < size; i += 3)
	{
		lesson.push({
				title: lines[i + 0],
				src: lines[i + 1],
				description: lines[i + 2]
			});
	}
	return lesson;
}

var updateLinkArea = function(linkarea, areaValue)
{
	var url = getLinkAreaText(createLesson(areaValue));

	linkarea.innerHTML = "";
	if(url.length < 2000)
	{
		var textinput = document.createElement("INPUT");
		textinput.type = "text";
		textinput.disabled = true;
		textinput.value = url;

		var link = document.createElement("A");
		link.href = url;
		link.innerHTML = "Try lesson";

		linkarea.appendChild(textinput);
		linkarea.appendChild(link);
		textinput.select();
	}
	else
	{
		linkarea.innerHTML = "Слишком длинный урок (" + areaValue.length + ")";
	}
}

Tortuga.initLessonConstructor = function(area, button, linkarea)
{
	button.onclick = function(e){updateLinkArea(linkarea, area.value)}

}
})()