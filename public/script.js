// assigning the generated API key from OpenWeatherMap weather APi
const apiKey = "2330df5d55c932dafb7326a1f767dc45";

// getting the elements with their specifeid ids
const cityName = document.getElementById("cityname");
const sBtn = document.getElementById("sbtn");
const locBtn = document.getElementById("locbtn");
const recDiv = document.getElementById("recdiv");
const recent = document.getElementById("recent");
const curCity = document.getElementById("curcity");
const temp = document.getElementById("temp");
const wind = document.getElementById("wind");
const humid = document.getElementById("humid");
const icon = document.getElementById("icon");
const weatherDes = document.getElementById("weatherdes");
const days = document.getElementById("days");
const more = document.getElementById("more");

// retreiving & parsing recCity array from local storage OR assigning empty array to recCity
let recCity = JSON.parse(localStorage.getItem("recCity")) || [];

// updating the recently searched city list
function updateCityList() {
  // setting the default inner text value to Select a city
  recent.innerHTML = "<option>Select a city</option>";
  // iterates over each city in recCity array
  recCity.forEach((city) => {
    // creating a element & setting inner text value to city
    const option = document.createElement("option");
    option.value = city;
    option.innerHTML = city;
    // adding option element to recent element
    recent.appendChild(option);
  });
}

// fetching data for particular city
async function fetchWeather(city) {
  try {
    // fetches data asynchronously using given url & throws error if response is not successful
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    // asynchronously parses json response
    const data = await response.json();
    // calling function disweather and passing fetched data as arguments
    disWeather(data);

    // updating the recent searched city list if the passed city is not included in the list already
    if (!recCity.includes(city)) {
      // adds the city at end of the list
      recCity.push(city);
      // adds city name to the array in local storage
      localStorage.setItem("recCity", JSON.stringify(recCity));
      // calling function updatecitylist
      updateCityList();
    }
    // calling function forecast & passing arguments- city latitude and longitude co-ordinates
    forecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    // if any error is catched shows an error message
    alert(error.message);
  }
}

// getting the five days forecast & taking latitude and logitude as parameters
async function forecast(lat, lon) {
  try {
    // fetching data asynchronously & throws error if response is not successful
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Failed to get forecast");
    // parsing json response
    const data = await response.json();
    // calling function disforcast & passing list of the data
    disForecast(data.list);
  } catch (error) {
    // if any error is catched shows an error message
    alert(error.message);
  }
}

// diplaying the weather data in the screen
function disWeather(data) {
  // changing inner value to fetched city name & also gives the date according to the city
  curCity.innerHTML = `${data.name} (${new Date().toLocaleDateString()})`;
  // changing the inner values of the elements to the specific fetched data
  temp.innerHTML = `${data.main.temp} °C`; 
  humid.innerHTML = `Humidity: ${data.main.humidity}%`;
  wind.innerHTML = `Wind: ${data.wind.speed} m/s`;
  icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherDes.innerHTML = data.weather[0].description;
}

// showing 5 day fore cast of the city
function disForecast(foreData) {
  // clearing value if any from the days variable
  days.innerHTML = "";
  // filters data for each 8th or 8th multiple index as it gives a single day forecast since APIs gives forecast in 3 intervals in 24 hours & saves it in datforecat array
  const dayForecast = foreData.filter((_, index) => index % 8 === 0);
  // iterates over day in dayforecast array
  dayForecast.forEach((day) => {
    // gives dates
    const date = new Date(day.dt_txt).toLocaleDateString();
    // displays the weather details
    days.innerHTML += `
            <div class="bg-black/15 p-4 rounded-2xl shadow text-center hover:scale-125">
                <p>${date}</p>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon" class="mx-auto">
                <p class="text-3xl p-2">${day.main.temp} °C</p>
                <p>Wind: ${day.wind.speed} m/s</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
  });
}

// added event listener to search button
sBtn.addEventListener("click", () => {
  // styling elements visibility,padding & font size
  temp.style.fontSize = "50px";
  recDiv.style.visibility = "visible";
  icon.style.visibility = "visible";
  days.style.padding = "0";
    // trims amy extra spaces & assigns the value of entered city name to city element
  const city = cityName.value.trim();
  if (city) {
    // calling fetchWeather function and passing entered city name as arguments 
    fetchWeather(city);
    // clearing the input field for further use
    cityName.value = "";
  } else {
    // if the search button is clicked without entering city name then it gives alert to enter a city name
    alert("Please enter a city name");
  }
});

// added event listener to search with location button
locBtn.addEventListener("click", () => {
  // changing font size & visibility 
  temp.style.fontSize = "50px";
  icon.style.visibility = "visible";
  if (navigator.geolocation) {
    // fetching device location with navigator.geolocation method & get co-ordinates of location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // gets longitude & latitude from position object
        const { latitude, longitude } = position.coords;
        // calling function fetchwether loc
        fetchWeatherLoc(latitude, longitude);
      },
      () => {
        // gives alert if location wasn't retreived
        alert("Unable to retrieve location");
      }
    );
  } else {
    // gives alert message if browser doesn't allow using device location
    alert("Geolocation is not supported by this browser.");
  }
});

// function for getting current location weather details & accepting latitude & longitude as parameters
async function fetchWeatherLoc(lat, lon) {
  try {
    // fetching data asynchronously
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    // parsing json respnse
    const data = await response.json();
    // calling function disweather
    disWeather(data);
    // calling function forecast
    forecast(lat, lon);
  } catch (error) {
    // gives alert message if error is catched
    alert(error.message);
  }
}

// added event listener to dropdown list using event as change
recent.addEventListener("change", () => {
// getting the selected value from dropdown menu in an element
  const selectedCity = recent.value;
//   if a city is selected then it fetches the selected city data and displays it
  if (selectedCity) {
    // calling function fetchweather
    fetchWeather(selectedCity);
  }
});

// added event listener using iife to see more button
more.addEventListener("click", () => {
// added styling for visibility to display wind & humidity when required
  more.style.visibility = "hidden";
  wind.style.visibility = "visible";
  humid.style.visibility = "visible";
})

// added event listener to whole document as it won't need to wait for updating the dropdown menu
document.addEventListener("DOMContentLoaded", () => {
// calling function updatecitylist
  updateCityList();
});

