var temperature = document.querySelector(".temp")
var iconsetter = document.querySelector(".icon")

window.onload = function() {
    weather.fetchWeather();
    weather.displayWeather();
};

let weather = {
        apiKey: "df17e74bdf20873e07b163232f18dea1",
           fetchWeather: function() {
               fetch(
                   'https://api.openweathermap.org/data/2.5/weather?q=orlando&appid='
                   + this.apiKey +
                   '&units=metric'
               )
                   .then((response) => response.json())
               .then((data) => this.displayWeather(data));
       
           },
           displayWeather: function(data){
               let { icon } = "01n";
               let { temp_min } = data.main;
               let { temp_max } = data.main;
               console.log(icon,temp_max,temp_min)

               var WeatherHeader = document.createElement('p');
                WeatherHeader.setAttribute("class", "temp");
                WeatherHeader.setAttribute("id", "weathertemp")
                WeatherHeader.innerHTML = temp_max + "°C" + "|" + temp_min + "°C"
                temperature.appendChild(WeatherHeader)

                var icondisplay = document.createElement('img');
                icondisplay.setAttribute("class", "icon" );
                icondisplay.setAttribute("id", "weathericon")
                icondisplay.src = "http://openweathermap.org/img/wn/" + icon + ".png"
                iconsetter.appendChild
           }
       };



    
