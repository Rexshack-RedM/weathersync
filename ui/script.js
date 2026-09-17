const gtaWeatherIcons = {
	blizzard:       "❄️",
	clear:          "☀️",
	clearing:       "🌦️",
	clouds:         "⛅",
	extrasunny:     "☀️",
	foggy:          "🌫️",
	halloween:      "🎃",
	neutral:        "🌧️",
	overcast:       "☁️",
	rain:           "🌧️",
	smog:           "🌫️",
	snow:           "🌨️",
	snowlight:      "🌨️",
	thunder:        "⛈️",
	xmas:           "🌨️"
};

const rdrWeatherIcons = {
	blizzard:       "❄️",
	clouds:         "⛅",
	drizzle:        "🌦️",
	fog:            "🌫️",
	groundblizzard: "❄️",
	hail:           "🌨️",
	highpressure:   "☀️",
	hurricane:      "🌀",
	misty:          "🌫️",
	overcast:       "☁️",
	overcastdark:   "☁️",
	rain:           "🌧️",
	sandstorm:      "🌪️",
	shower:         "🌧️",
	sleet:          "🌧️",
	snow:           "🌨️",
	snowlight:      "🌨️",
	sunny:          "☀️",
	thunder:        "🌩️",
	thunderstorm:   "⛈️",
	whiteout:       "❄️"
};

const conditionLabels = {
	blizzard:       "Blizzard",
	clear:          "Clear",
	clearing:       "Clearing",
	clouds:         "Cloudy",
	extrasunny:     "Sunny",
	foggy:          "Foggy",
	halloween:      "Halloween",
	neutral:        "Rain",
	overcast:       "Overcast",
	rain:           "Rain",
	smog:           "Smog",
	snow:           "Snow",
	snowlight:      "Light Snow",
	thunder:        "Thunder",
	xmas:           "Snow",
	drizzle:        "Drizzle",
	fog:            "Fog",
	groundblizzard: "Ground Blizzard",
	hail:           "Hail",
	highpressure:   "High Pressure",
	hurricane:      "Hurricane",
	misty:          "Misty",
	overcastdark:   "Dark Overcast",
	sandstorm:      "Sandstorm",
	shower:         "Shower",
	sleet:          "Sleet",
	sunny:          "Sunny",
	thunderstorm:   "Thunderstorm",
	whiteout:       "Whiteout"
};

var weatherIcons = {};
var isRDR = false;

function toggleForecast() {
    var app = document.querySelector('#weather-app');
    if (!app) return;

    if (app.classList.contains('hidden')) {
        app.classList.remove('hidden');
    } else {
        app.classList.add('hidden');
    }
}

function dayOfWeek(day) {
	return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
}

function aggregateDaily(forecastData) {
	var days = {};
	for (var i = 0; i < forecastData.length; i++) {
		var d = forecastData[i].day;
		if (!days[d]) {
			days[d] = { day: d, weather: forecastData[i].weather };
		}
	}
	var result = [];
	for (var key in days) {
		result.push(days[key]);
	}
	return result;
}

function updateForecast(data) {
	var forecastData = JSON.parse(data.forecast);
	var app = document.querySelector('#weather-app');
	var dailyData = aggregateDaily(forecastData);

	document.querySelector('#current-condition').textContent = conditionLabels[forecastData[0].weather] || forecastData[0].weather;
	document.querySelector('#current-temp').textContent = data.temperature;

	var currentHiLo = 'H: ' + data.temperature + '  L: ' + data.temperature;
	document.querySelector('#current-hilo').textContent = currentHiLo;

	var hourlyScroll = document.querySelector('#hourly-scroll');
	hourlyScroll.innerHTML = '';
	for (var i = 0; i < forecastData.length; i++) {
		var item = document.createElement('div');
		item.className = 'hourly-item';

		var time = document.createElement('div');
		time.className = 'hourly-time';
		time.textContent = i === 0 ? 'Now' : forecastData[i].time;

		var icon = document.createElement('div');
		icon.className = 'hourly-icon';
		icon.textContent = weatherIcons[forecastData[i].weather] || '☀️';

		item.appendChild(time);
		item.appendChild(icon);
		hourlyScroll.appendChild(item);
	}

	var dailyList = document.querySelector('#daily-list');
	dailyList.innerHTML = '';

	var today = new Date();
	var todayDay = today.getDay();

	for (var j = 0; j < dailyData.length; j++) {
		var dd = dailyData[j];
		var row = document.createElement('div');
		row.className = 'daily-row';

		var dayLabel = document.createElement('div');
		dayLabel.className = 'daily-day';
		if (j === 0) {
			dayLabel.textContent = 'Today';
		} else {
			dayLabel.textContent = dayOfWeek((todayDay + j) % 7);
		}

		var icon2 = document.createElement('div');
		icon2.className = 'daily-icon';
		icon2.textContent = weatherIcons[dd.weather] || '☀️';

		var windStr = document.createElement('div');
		windStr.className = 'daily-wind';
		windStr.textContent = forecastData[j * Math.floor(forecastData.length / dailyData.length)]?.wind || '';

		row.appendChild(dayLabel);
		row.appendChild(icon2);
		row.appendChild(windStr);
		dailyList.appendChild(row);
	}

	document.querySelector('#wind-value').textContent = data.wind || '--';
	document.querySelector('#altitude-value').textContent = data.altitudeSea + 'm MSL';

	if (data.syncEnabled) {
		document.querySelector('#sync-indicator').textContent = 'Sync Active';
	} else {
		document.querySelector('#sync-indicator').textContent = 'Sync Disabled';
	}

	app.classList.remove('hidden');
}

function openAdminUi(data) {
	document.querySelector('#admin-ui').classList.remove('hidden');
}

function updateAdminUi(data) {
	var weatherTypes = JSON.parse(data.weatherTypes);
	var curDay = document.querySelector('#cur-day');
	var curHour = document.querySelector('#cur-hour');
	var curMin = document.querySelector('#cur-min');
	var curSec = document.querySelector('#cur-sec');
	var timescale = document.querySelector('#cur-timescale');
	var weather = document.querySelector('#cur-weather-type');
	var windDirection = document.querySelector('#cur-wind-direction');
	var windSpeed = document.querySelector('#cur-wind-speed');
	var syncDelay = document.querySelector('#sync-delay');

	curDay.value = dayOfWeek(data.day);
	curHour.value = data.hour;
	curMin.value = data.min;
	curSec.value = data.sec;
	timescale.value = data.timescale;
	weather.value = weatherIcons[data.weather] + ' ' + data.weather;
	windDirection.value = data.windDirection;
	windSpeed.value = data.windSpeed;
	syncDelay.value = data.syncDelay;

	var weatherSelect = document.querySelector('#new-weather-type');
	if (!weatherSelect.querySelector('option')) {
		for (i = 0; i < weatherTypes.length; ++i) {
			var option = document.createElement('option');
			option.value = weatherTypes[i];
			option.innerHTML = weatherTypes[i];
			weatherSelect.appendChild(option);
		}
	}
}

window.addEventListener('message', function (event) {
	switch (event.data.action) {
		case 'toggleForecast':
			toggleForecast();
			break;
		case 'updateForecast':
			updateForecast(event.data);
			break;
		case 'openAdminUi':
			openAdminUi();
			break;
		case 'updateAdminUi':
			updateAdminUi(event.data);
			break;
	}
});

window.addEventListener('load', function() {
	fetch('https://' + GetParentResourceName() + '/getGameName').then(function(resp) { return resp.json(); }).then(function(resp) {
		if (resp.gameName == "rdr3") {
			isRDR = true;
			weatherIcons = rdrWeatherIcons;
		} else {
			isRDR = false;
			weatherIcons = gtaWeatherIcons;
		}
	});

	document.querySelector('#apply-time-btn').addEventListener('click', function(event) {
		var day = document.querySelector('#new-day');
		var hour = document.querySelector('#new-hour');
		var min = document.querySelector('#new-min');
		var sec = document.querySelector('#new-sec');
		var transition = document.querySelector('#time-transition');
		var freeze = document.querySelector('#time-freeze');

		fetch('https://' + GetParentResourceName() + '/setTime', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				day: parseInt(day.value),
				hour: parseInt(hour.value),
				min: parseInt(min.value),
				sec: parseInt(sec.value),
				transition: parseInt(transition.value),
				freeze: freeze.checked
			})
		});
	});

	document.querySelector('#apply-timescale-btn').addEventListener('click', function(event) {
		var timescale = document.querySelector('#new-timescale')

		fetch('https://' + GetParentResourceName() + '/setTimescale', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				timescale: parseFloat(timescale.value)
			})
		});
	});

	document.querySelector('#apply-weather-btn').addEventListener('click', function(event) {
		var weather = document.querySelector('#new-weather-type');
		var transition = document.querySelector('#weather-transition');
		var freeze = document.querySelector('#weather-freeze');
		var permanentSnow = document.querySelector('#weather-permanent-snow');

		fetch('https://' + GetParentResourceName() + '/setWeather', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				weather: weather.value,
				transition: parseFloat(transition.value),
				freeze: freeze.checked,
				permanentSnow: permanentSnow.checked
			})
		});
	});

	document.querySelector('#apply-wind-btn').addEventListener('click', function(event) {
		var windDirection = document.querySelector('#new-wind-direction');
		var windSpeed = document.querySelector('#new-wind-speed');
		var freeze = document.querySelector('#wind-freeze');

		fetch('https://' + GetParentResourceName() + '/setWind', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				windSpeed: parseFloat(windSpeed.value),
				windDirection: parseFloat(windDirection.value),
				freeze: freeze.checked
			})
		});
	});

	document.querySelector('#apply-sync-delay-btn').addEventListener('click', function(event) {
		var syncDelay = document.querySelector('#sync-delay');

		fetch('https://' + GetParentResourceName() + '/setSyncDelay', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				syncDelay: parseInt(syncDelay.value)
			})
		});
	});

	document.querySelector('#admin-ui-close-btn').addEventListener('click', function(event) {
		document.querySelector('#admin-ui').classList.add('hidden');

		fetch('https://' + GetParentResourceName() + '/closeAdminUi', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: "{}"
		});
	});

	var forecastClose = document.querySelector('#forecast-close-btn');
	var forecastBack = document.querySelector('#forecast-back-btn');
	var adminCloseTop = document.querySelector('#admin-ui-close-btn-top');

	if (forecastClose) {
		forecastClose.addEventListener('click', function() {
			document.querySelector('#weather-app').classList.add('hidden');
		});
	}

	if (forecastBack) {
		forecastBack.addEventListener('click', function() {
			document.querySelector('#weather-app').classList.add('hidden');
		});
	}

	if (adminCloseTop) {
		adminCloseTop.addEventListener('click', function() {
			document.querySelector('#admin-ui').classList.add('hidden');
			fetch('https://' + GetParentResourceName() + '/closeAdminUi', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: "{}"
			});
		});
	}
});
