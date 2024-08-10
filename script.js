// script.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('results-container');
    document.querySelector('main').appendChild(resultsContainer);

    let travelData = null;

    // Fetch data from JSON file
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            travelData = data;
        })
        .catch(error => console.error('Error fetching data:', error));

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    resetBtn.addEventListener('click', clearResults);

    function performSearch() {
        if (travelData) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const results = searchData(travelData, searchTerm);
            displayResults(results);
        } else {
            console.error('Travel data not loaded yet');
        }
    }

    function searchData(data, searchTerm) {
        const results = [];

        if (matchesKeyword(searchTerm, ['beach', 'beaches'])) {
            results.push(...data.beaches);
        }

        if (matchesKeyword(searchTerm, ['temple', 'temples'])) {
            results.push(...data.temples);
        }

        if (matchesKeyword(searchTerm, ['country', 'countries'])) {
            data.countries.forEach(country => {
                results.push({
                    name: country.name,
                    imageUrl: country.cities[0].imageUrl,
                    description: `A country with cities like ${country.cities.map(city => city.name).join(', ')}.`
                });
            });
        }

        // If no category matches, search all categories
        if (results.length === 0) {
            results.push(...searchAllCategories(data, searchTerm));
        }

        return results;
    }

    function matchesKeyword(searchTerm, keywords) {
        return keywords.some(keyword => searchTerm === keyword || searchTerm === keyword + 's');
    }

    function searchAllCategories(data, searchTerm) {
        const results = [];

        // Search countries and cities
        data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(searchTerm)) {
                results.push({
                    name: country.name,
                    imageUrl: country.cities[0].imageUrl,
                    description: `A country with cities like ${country.cities.map(city => city.name).join(', ')}.`
                });
            }
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(searchTerm)) {
                    results.push(city);
                }
            });
        });

        // Search temples
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(searchTerm)) {
                results.push(temple);
            }
        });

        // Search beaches
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(searchTerm)) {
                results.push(beach);
            }
        });

        return results;
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('result-item');
            resultElement.innerHTML = `
                <h3>${result.name}</h3>
                <img src="${result.imageUrl}" alt="${result.name}">
                <p>${result.description}</p>
            `;
            resultsContainer.appendChild(resultElement);
        });
    }

    function clearResults() {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    }
});