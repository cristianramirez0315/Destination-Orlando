fetch('https://api.currencyscoop.com/v1/latest?api_key=fd099489427af105e62f7e1eff802751')
  .then(response => response.json())
  .then(data => console.log(data));
