function debug(str){
	var element = document.createElement("p");
	element.innerHTML = str;
	document.body.appendChild(element);
}

var city_url = 'http://informer.gismeteo.ru/xml/27612_1.xml';

var date = new Date();
var tod;
var img;
var temperatureMax;
var temperatureMin;

var timesOfDay = {
		0: 'ночь',
		1: 'утро', 
		2: 'день', 
		3: 'вечер'
};

var cloudiness = {
		0: 'ясно', 
		1: 'малооблачно',
		2: 'облачно',
		3: 'пасмурно'
};

var precipitation = {
		4: ', дождь',
		5: ', ливень',
		6: ', снег',
		7: ', снег', 
		8: ', гроза', 
		9: '', 
		10: ', без осадков'
};

function loadWeather(url) {
	$.ajax({ 
		url: 'http://intepra.ru/xml/get-xml.php', 
		data: {url: url},
		dataType: 'jsonp',
		success: function(data) { 
			data = data.result;
			console.log(data);
			var day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
			var m = date.getMonth() + 1;
			var month = (m < 10) ? '0' + m : m;
			var yy = date.getYear();
			var year = (yy < 1000) ? yy + 1900 : yy;
			$('.date').html(day + '.' + month + '.' + year);
			$(data).find('FORECAST').each(function(index, value){
				if($(value).attr('tod') == 3) {
					tod = 0;
				} else if($(value).attr('tod') == 2) {
					tod = 1;
				} else {
					tod = $(value).attr('tod')
				}
				
				$('.row' + index).find('.day').html(timesOfDay[$(value).attr('tod')] + ' ' + $(value).attr('day') + '/' + $(value).attr('month') + '/' + $(value).attr('year'));
				$('.row' + index).find('.info').html(cloudiness[$(value).find('PHENOMENA').attr('cloudiness')] + precipitation[$(value).find('PHENOMENA').attr('precipitation')]);
				img = 'images/weather/' + tod + '-' + $(value).find('PHENOMENA').attr('cloudiness') + '-' + $(value).find('PHENOMENA').attr('precipitation') + '.png';
				$('.row' + index).find('.icon > img').attr('src', img);

				temperatureMax = $(value).find('TEMPERATURE').attr('max');
				//temperatureMin = $(value).find('TEMPERATURE').attr('min');
				$('.row' + index).find('.gradus').html(temperatureMax + '&deg;');
			});
		}, 
		error: function(jqXHR, textStatus, errorThrown) { 
			alert('Error');
		} 
	});
}
function updateWeather() {
	loadWeather(city_url);	
}

jQuery(function($) {
	updateWeather();
});