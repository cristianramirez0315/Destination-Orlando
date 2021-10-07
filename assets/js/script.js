/* Begin Currency Converter */
  $( "#submitBtn2" ).click(function() {

    //clear-out converted amount before function
    $("#convertedAmount").empty();

    // set variables for currency 3-letter code and amount to be converted
    let from = $("#dropDown").val();
    console.log(from);
    let amount = $("#currencyType").val();
    console.log(amount);

    let convertedResults = {};

    // fetch from 
    fetch("https://data.fixer.io/api/convert?access_key=1d087b84a5b94e9e020a0f644ab8d97f&from=" + from + "&to=USD&amount=" + amount, {
      "method": "GET",
      contentType: "application/json",
      dataType: 'json',
    success: function(result){
      console.log(result);
    }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.result);
      $('#convertedAmount').append(data.result);
    })
  });

/* End Currency Converter */



/* Start Flight Info */
let date;

function fetchAirports() {
  $('#flight-list').hide();
  $('#danger-box').hide();

  let departureDate = $("#date").val();
  let locationName = $("#city").val();
  
  if (locationName === '') {
    displayErrorMessage("Departure location cannot be empty");
    return;
  }
  if (departureDate === '') {
    displayErrorMessage("Departure date cannot be empty");
    return;
  } else {
    date = departureDate;
  }

  // get all airports in the city
  let fetchAirports = `https://priceline-com-provider.p.rapidapi.com/v1/flights/locations?name=${locationName}`;
  fetch(fetchAirports, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "priceline-com-provider.p.rapidapi.com",
      "x-rapidapi-key": "83cd232f68mshc3e5ef9a184e7ebp170f42jsn4d1325862b3e",
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
  $('#danger-box').hide();
  // get airport code
  let departureAirportCode = $('#airport-selection-list').val();
  // must be like this 2021-10-10
  let numOfStops = 0;

  let fetchFlights =
    `https://priceline-com-provider.p.rapidapi.com/v1/flights/search?sort_order=PRICE&location_departure=${departureAirportCode}&date_departure=${date}&class_type=ECO&location_arrival=MCO&itinerary_type=ONE_WAY&number_of_stops=${numOfStops}`;
  fetch(fetchFlights, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "priceline-com-provider.p.rapidapi.com",
      "x-rapidapi-key": "83cd232f68mshc3e5ef9a184e7ebp170f42jsn4d1325862b3e",
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
  $("#flight-list").hide();
  $('#danger-box').hide();

  const prices = flights.pricedItinerary;
  const slices = flights.slice;
  const segments = flights.segment;

  if (prices === null) {
    displayErrorMessage("There are no direct flights from your location.");
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
    
    html = `
    <div class="box">
      <div class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <i class="fas fa-plane-departure icons"></i>
            <div> ${airline}-${flightNumber}</div>
          </div>
          <div class="level-item">
            <i class="fas fa-clock icons"></i>
            <div> ${convertMinsToHrsMins(flightDuration)} </div>
          </div>
          <div class="level-item">
            <div> ${getFormattedTime(departureTime)} </div>
              <i class="fas fa-arrow-right icons"></i>
              <div> ${getFormattedTime(arrivalTime)} </div>
          </div>
        </div>
    
        <!-- Right side -->
        <div class="level-right" style="font-weight: bold;">
          <i class="fas fa-dollar-sign"></i>
          <div class="level-item">${totalPrice} per person</div>
        </div>
      </div>
    </div>`;

    $("#flight-list").show();
    $("#flight-list").append(html);
  });
}

function convertMinsToHrsMins(minutes) {
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  if (h === 0) {
    return m + 'm';
  }
  if (m === 0) {
    return h + 'h';
  }
  return h + 'h' + ' ' + m + 'm';
}

function getTimeFromDateTime(string) {
  return string.substring(string.indexOf("T") + 1);
}

function convertTimeIntoFourDigits(time) {
  let newTime = time.substring(0, time.length - 2);
  let finalTime = newTime.replace(/[^\w\s]/gi, '');

  return finalTime;
}

function getFormattedTime(time) {
  // get only the time from the date-time
  let onlyTime = getTimeFromDateTime(time);
  // convert time into a four digit time
  let fourDigitTime = convertTimeIntoFourDigits(onlyTime);

  // convert military time into standard time
  let hours24 = parseInt(fourDigitTime.substring(0, 2),10);
  let hours = ((hours24 + 11) % 12) + 1;
  let amPm = hours24 > 11 ? 'pm' : 'am';
  let minutes = fourDigitTime.substring(2);

  return hours + ':' + minutes + amPm;
}

function displayErrorMessage(message) {
  $('#danger-box').html(`<p>${message}</p>`);
  $('#danger-box').show();
}

