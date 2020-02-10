'use strict';

const API_KEY = 'Pyg0ndLcveG5ku4g7eQndDszZZi2raLL112Li4Wa';
const baseURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length & i < maxResults; i++) {
        $('#results-list').append(`
      <li>
        <h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <a href="${responseJson.data[i].url}">Link to Website</a>
      </li>`);
    };
    $('#results').removeClass('hidden');
}

function getParkResults(query, maxResults = 10) {
    const params = {
        api_key: API_KEY,
        stateCode: query,
        limit: maxResults,
    }
    // console.log(params);

    // construct url
    const queryString = formatQueryParams(params);
    const url = baseURL + '?' + queryString;
    // console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => displayResults(responseJson, maxResults))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(function (event) {
        event.preventDefault();
        // what did the user input
        const inputState = $('#js-input-state').val();
        const maxResults = $('#js-max-results').val();
        // console.log(inputState, maxResults);
        getParkResults(inputState, maxResults);
    });
}

$(function () {
    console.log('App loaded')
    watchForm();
});