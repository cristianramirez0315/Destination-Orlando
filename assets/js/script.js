/*fetch('https://api.currencyscoop.com/v1/latest?api_key=fd099489427af105e62f7e1eff802751')
  .then(response => response.json())
  .then(data => console.log(data));*/

// Currency Coverter  -  set endpoint and access key
endpoint = 'convert';
api_key = 'fd099489427af105e62f7e1eff802751';

// set variables for currency 3-letter code and amount to be converted
function getFrom(){
  var fromEl = document.getElementById('dropDown').value;
  console.log(fromEl);

  var amountEl = document.getElementById('currencyType').value;
  console.log(amountEl);

// define from currency, to currency, and amount
from =  "'" + fromEl + "'" ;
to = 'USD';
amount = "'" + amountEl + "'" ;

// execute the conversion using the "convert" endpoint:
$.ajax({
url: 'https://api.currencyscoop.com/' + endpoint + '?api_key=' + api_key +'&from=' + from + '&to=' + to +
'&amount=' + amount,
dataType: 'jsonp',
success: function(json) {

  // access the conversion result in json.result
  alert(json);

  console.log(json.result);
}
});
};
