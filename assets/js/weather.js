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
               const {icon} = data.weather[0];
               const {temp_min} = data.main
               const {temp_max} = data.main
               console.log(icon,temp_max,temp_min)

               document.querySelector(".temp").innerText = temp_max + "°C" + "|" + temp_min + "°C"
               document.querySelector(".icon").src = "http://openweathermap.org/img/wn/" + icon + ".png"
           }
       };



    