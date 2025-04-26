let allData = [];
let myChart;

Papa.parse('data/tournament_results.csv', {
    download: true,
    header: true,
    complete: function(results) {
        allData = results.data;
        
        //test case
        //buildPlayerYearlyEarnings('Tiger Woods');
        playerSelection();
    }
});

function playerSelection() {
    const playerSelect = document.getElementById('playerSelect');

    const earningsByPlayer = {};

    allData.forEach(row => {
        const playerName = row.name;
        const earning = parseFloat(row.earnings) || 0;

        if (playerName) {
            earningsByPlayer[playerName] = (earningsByPlayer[playerName] || 0) + earning;
        }
    });

    const topEarners = Object.entries(earningsByPlayer)
        .sort((a, b) => b[1] - a[1]) //sorting by earnings
        .slice(0, 50); // top 50 earners

    console.log(topEarners);
    topEarners.forEach(([playerName, totalEarnings]) => {
        const option = document.createElement('option');
        option.value = playerName;
        option.textContent = playerName;
        playerSelect.appendChild(option);
    });

    let randomIndex = Math.floor(Math.random() * topEarners.length);
    let randomPlayer = topEarners[randomIndex][0];
    playerSelect.value = randomPlayer;

    buildPlayerYearlyEarnings(randomPlayer);

    playerSelect.addEventListener('change', function() {
        buildPlayerYearlyEarnings(this.value);
    });
}


function buildPlayerYearlyEarnings(playerName) {
    const seasonEarnings = {};
    
    allData.forEach(row => {
        if (row.name === playerName) {
            const season = row.season;
            const earning = parseFloat(row.earnings) || 0;

            if (season) {
                seasonEarnings[season] = (seasonEarnings[season] || 0) + earning;
            }
        }
    });

    const seasons = Object.keys(seasonEarnings).sort();
    const earnings = seasons.map(season => seasonEarnings[season]);

    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: seasons,
            datasets: [{
                label: 'Earnings of ' + playerName,
                data: earnings,
                backgroundColor: '#003C80',
                borderColor: '#f1373d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Yearly Earnings of ' + playerName,
                    color: "#F1373D",
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#f5f5f5' 
                    },
                    grid: {
                        color: '#333' 
                    }
                },
                y: {
                    ticks: {
                        color: '#f5f5f5',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: '#333' 
                    },
                }
            },
            elements: { //customizes data points
                point: {
                    radius: 5,
                    hoverRadius: 7,
                    backgroundColor: '#f1373d',
                    borderColor: '#003C80',
                    borderWidth: 2
                }
            }
        }
    });
}
