const input = document.getElementById('conditionInput');
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnclear');
const resultsDiv = document.getElementById('results');

// Função para carregar o JSON
function fetchData(callback) {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao carregar o arquivo: ${response.status}`);
            return response.json();
        })
        .then(data => callback(data))
        .catch(error => {
            console.error('Erro:', error);
            resultsDiv.innerHTML = '<p>Não foi possível carregar os dados.</p>';
        });
}

// Evento botão pesquisar
btnSearch.addEventListener('click', () => {
    const keyword = input.value.trim().toLowerCase();

    if (!keyword) {
        resultsDiv.innerHTML = '<p>Por favor, digite uma palavra-chave.</p>';
        return;
    }

    fetchData(data => {
        let filteredResults = [];

        // Filtrar cidades
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(keyword) || city.description.toLowerCase().includes(keyword)) {
                    filteredResults.push({
                        type: 'Cidade',
                        name: city.name,
                        description: city.description,
                        imageUrl: city.imageUrl
                    });
                }
            });
        });

        // Filtrar templos
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(keyword) || temple.description.toLowerCase().includes(keyword)) {
                filteredResults.push({
                    type: 'Templo',
                    name: temple.name,
                    description: temple.description,
                    imageUrl: temple.imageUrl
                });
            }
        });

        // Filtrar praias
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(keyword) || beach.description.toLowerCase().includes(keyword)) {
                filteredResults.push({
                    type: 'Praia',
                    name: beach.name,
                    description: beach.description,
                    imageUrl: beach.imageUrl
                });
            }
        });

        // Exibir resultados em cards
        resultsDiv.innerHTML = '';
        if (filteredResults.length === 0) {
            resultsDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        } else {
            filteredResults.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('result-card');
                card.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div class="result-info">
                        <h3>${item.name}</h3>
                        <span class="result-type">${item.type}</span>
                        <p>${item.description}</p>
                    </div>
                `;
                resultsDiv.appendChild(card);
            });
        }
    });
});

// Botão limpar
btnClear.addEventListener('click', () => {
    input.value = '';
    resultsDiv.innerHTML = '';
});
