'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
  countriesContainer.style.opacity = 1;
};

const renderCountry = function (country, className = '') {
  const html = `<article class="country ${className}">
      <img class="country__img" src="${country.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${country.name.official}</h3>
        <h4 class="country__region">${country.region}</h4>
        <p class="country__row"><span>📍</span>${country.capital}</p>
        <p class="country__row"><span>👫</span>${(
          +country.population / 1000000
        ).toFixed(1)}</p>
        <p class="country__row"><span>🗣️</span>${
          country.languages[Object.keys(country.languages)[0]]
        }</p>
        <p class="country__row"><span>💰</span>${
          country.currencies[Object.keys(country.currencies)[0]].name
        }</p>
      </div>
      </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

// getCountryAndNeighbour('portugal');

const getJSON = function (url, errorMsg = 'Something went worng') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// getPosition().then(res => console.log(res));

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(resp => {
      if (!resp.ok) throw new Error(`Problem with Geocoding ${resp.status}`);
      return resp.json();
    })
    .then(data => {
      return fetch(`https://restcountries.com/v3.1/alpha/${data.prov}`);
    })
    .then(resp => {
      if (!resp.ok) throw new Error(`Problem with Geocoding ${resp.status}`);
      return resp.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) throw new Error('No Neighbour Found!');

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country Not Found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => renderError(`${err.message}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', whereAmI);
