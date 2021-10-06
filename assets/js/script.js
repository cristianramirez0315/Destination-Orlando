/* Begin Currency Converter */

/*fetch('https://api.currencyscoop.com/v1/latest?api_key=fd099489427af105e62f7e1eff802751')
  .then(response => response.json())
  .then(data => console.log(data));*/

$( "#submitBtn2" ).click(function() {

  // set variables for currency 3-letter code and amount to be converted
  let from = $("#dropDown").val();
  console.log(from);

  let amount = $("#currencyType").val();
  console.log(amount);
  
  // fetch from 
  fetch("https://data.fixer.io/api/latest?access_key=1d087b84a5b94e9e020a0f644ab8d97f&from=" + from + "&to=USD&amount=" + amount, {
    "method": "GET",
  })
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
});

/* End Currency Converter */

/* Start Flight Info */

function fetchAirports() {
  let locationName = document.getElementById("city").value;

  // get all airports in the city
  let fetchAirports = `https://priceline-com-provider.p.rapidapi.com/v1/flights/locations?name=${locationName}`;
  fetch(fetchAirports, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "priceline-com-provider.p.rapidapi.com",
      "x-rapidapi-key": "d02c73e7c4msh961701991ae268cp14fca5jsn4327054c12da",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // display airport names
      displayAirportNames(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function getFlights() {
  // get airport code
  let departureAirportCode = $('#airport-selection-list').val();
  // must be like this 2021-10-10
  let departureDate = $("#date").val();
  let numOfStops = 0;

  let fetchFlights =
    `https://priceline-com-provider.p.rapidapi.com/v1/flights/search?sort_order=PRICE&location_departure=${departureAirportCode}&date_departure=${departureDate}&class_type=ECO&location_arrival=MCO&itinerary_type=ONE_WAY&number_of_stops=${numOfStops}`;
  fetch(fetchFlights, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "priceline-com-provider.p.rapidapi.com",
      "x-rapidapi-key": "d02c73e7c4msh961701991ae268cp14fca5jsn4327054c12da",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayFlightInformation(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function displayAirportNames(airports) {
  $("#airport-selection-list").html('');
  $("#airport-list").show();

  airports.forEach((airport, index) => {
    let airportName = `<option value=${airport.id}>${airport.itemName}</option>`;
    $("#airport-selection-list").append(airportName);
  });
}

function displayFlightInformation(flights) {
  $("#flight-list").html('');

  const prices = flights.pricedItinerary;
  const slices = flights.slice;
  const segments = flights.segment;

  if (prices === null) {
    let html = `<div id="danger-box" class="notification is-danger is-light">
                <button class="delete"></button>
                There are no direct flights from your location.
                </div>`;
    $("#flight-list").html(html);
    return;
  }

  // loop through prices
  prices.forEach((price) => {
    const sliceId = price.slice[0].uniqueSliceId;
    let segmentId;

    slices.forEach(slice => {
      // find my slice by id 
      if (slice.uniqueSliceId === sliceId) {
        // get the segment id from my slice
        segmentId = slice.segment[0].uniqueSegId;
      }
    });

    let segment;
    segments.forEach(seg => {
      // find my slice by id 
      if (seg.uniqueSegId === segmentId) {
        // get the segment id from my slice
        segment = seg;
      }
    });

    let totalPrice = price.pricingInfo.totalFare;
    let arrivalTime = segment.arrivalDateTime;
    let departureTime = segment.departDateTime;
    let flightDuration = segment.duration;
    let flightNumber = segment.flightNumber;
    let airline = segment.marketingAirline;

    html = `<div class="box">
      <div>Total price: $${totalPrice} per person</div>
      <div>Arrival time: ${arrivalTime}</div>
      <div>Departure time: ${departureTime}</div>
      <div>Flight duration: ${convertMinsToHrsMins(flightDuration)}</div>
      <div>Flight number: ${flightNumber}</div>
      <div>Airline: ${airline}</div>
      </div>`;

    $("#flight-list").append(html);
  });
}

function convertMinsToHrsMins(minutes) {
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return h + ':' + m;
}

