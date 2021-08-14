import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';
import _ from 'lodash';
import markupLeng from './templates/markupLeng.hbs';
import fetchCountries from './fetchCountries';

const refs = {
  inputRef: document.querySelector('#input-id'),
  listRef: document.querySelector('#countries'),
};

const debouncedSearchFn = _.debounce(searchFn, 500);
refs.inputRef.addEventListener('input', debouncedSearchFn);

function searchFn(e) {
  e.preventDefault();
  refs.listRef.innerHTML = '';
  const query = e.target.value;

  fetchCountries(query)
    .then(countrys => {
      console.log(countrys.length);
      const countryArr = countrys.map(country => `<li>${country.name}</li>`).join('');

      if (countrys.length > 9) {
        alert({
          text: 'Братишка, давай попробуем другую страну',
          type: 'error',
          delay: 2000,
        });
        return;
      } else if (countrys.length > 1 && countrys.length < 9) {
        refs.listRef.insertAdjacentHTML('afterbegin', countryArr);
        return;
      } else {
        countrys.map(country => {
          markupOneCountry(country);
        });
      }
    })
    .catch(() => console.log('Что-то пошло не так!!!'));
}

function markupOneCountry(country) {
  const countryLanguages = markupLeng(country.languages);
  const countryFlag = `<img src=${country.flag} alt=${country.name} style='width:30%; hight:30%'>`;
  const markupCountry = `<h1>${country.name}</h1><h3>Capital: ${country.capital}</h3><h3>Population: ${country.population}</h3>${countryLanguages}${countryFlag}`;
  refs.listRef.insertAdjacentHTML('afterbegin', markupCountry);
}
