/* Papa.parse('data/tournament_results.csv', {
    download: true,
    header: true,
    complete: function(results) {
        console.log(results.data); // View loaded data

        const players = results.data.slice(0, 10).map(row => row.name); // Player names
        const scores = results.data.slice(0, 10).map(row => parseFloat(row.score)); // Scores

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: players,
                datasets: [{
                    label: 'Score Relative to Par',
                    data: scores,
                    
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
}); */

/* 
// Step 1: Parse CSV and prepare data
let players = [];
let scores = [];

Papa.parse('data/tournament_results.csv', {
    download: true,
    header: true,
    complete: function(results) {
        console.log(results.data);

        players = results.data.slice(0, 10).map(row => row.name);
        scores = results.data.slice(0, 10).map(row => parseFloat(row.score));

        createChart(players, scores); // Step 2: Create the chart
    }
});

// Step 2: Function to create chart separately
function createChart(playerNames, playerScores) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: playerNames,
            datasets: [{
                label: 'Score Relative to Par',
                data: playerScores,
                backgroundColor: '#003C80',
                borderColor: '#f1373d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
} */

/*
let fullData = []; // Global: store full CSV data
let chart;         // Global: store chart instance

// Step 1: Parse CSV
Papa.parse('data/tournament_results.csv', {
    download: true,
    header: true,
    complete: function(results) {
        console.log(results.data);

        fullData = results.data; // Save the full raw data

        populateSeasonFilter(fullData); // Build the dropdown
        updateChart('All');             // Draw initial chart with "All" seasons
        
    }
});

// Step 2: Populate the Season Dropdown
function populateSeasonFilter(data) {
    const seasonFilter = document.getElementById('seasonFilter');
    const seasons = [...new Set(data.map(row => row.season))].sort(); // Get unique seasons

    seasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        seasonFilter.appendChild(option);
    });

    seasonFilter.addEventListener('change', function() {
        updateChart(this.value);
    });
}

// Step 3: Update the Chart Based on Selected Season
function updateChart(selectedSeason) {
    let filteredData = fullData;

    if (selectedSeason !== 'All') {
        filteredData = fullData.filter(row => row.season == selectedSeason);
    }

    const players = filteredData.slice(0, 10).map(row => row.name);
    const scores = filteredData.slice(0, 10).map(row => parseFloat(row.score));

    const ctx = document.getElementById('chart1').getContext('2d');

    // Destroy previous chart instance if it exists
    if (chart) {
        chart.destroy();
    }

    // Create new chart
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: players,
            datasets: [{
                label: 'Score Relative to Par',
                data: scores,
                backgroundColor: '#003C80',
                borderColor: '#f1373d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

*/




let fullData = [];
let chart1, chart2, chart3, chart4;

Papa.parse('data/tournament_results.csv', {
    download: true,
    header: true,
    complete: function(results) {
        fullData = results.data;
        
        buildTopEarners();
        buildTopWinners();
        buildBestAverageScoreChart();
        buildToughestTournamentsChart();
    }
});

function buildTopEarners() {
    const earningsByPlayer = {};

    fullData.forEach(row => {
        const player = row.name;
        const earning = parseFloat(row.earnings) || 0;
        if (player) {
            earningsByPlayer[player] = (earningsByPlayer[player] || 0) + earning;
        }
    });

    const topEarners = Object.entries(earningsByPlayer)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const players = topEarners.map(e => e[0]);
    const earnings = topEarners.map(e => e[1]);

    const ctx = document.getElementById('chart1').getContext('2d');
    chart1 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: players,
            datasets: [{
                label: 'Total Earnings ($)',
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
                    text: 'Top 5 Money Earners',
                    color: "#F1373D",
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '$' + value.toLocaleString()
                    }
                }
            }
        }
    });
}

// 2. Top Tournament Winners
function buildTopWinners() {
    const winsByPlayer = {};

    fullData.forEach(row => {
        if (row.position == 1) { // Only winners
            const player = row.name;
            winsByPlayer[player] = (winsByPlayer[player] || 0) + 1;
        }
    });

    const topWinners = Object.entries(winsByPlayer)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const players = topWinners.map(e => e[0]);
    const wins = topWinners.map(e => e[1]);

    const ctx = document.getElementById('chart2').getContext('2d');
    chart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: players,
            datasets: [{
                label: 'Tournament Wins',
                data: wins,
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
                    text: 'Top 5 Tournament Winners',
                    color: "#F1373D",
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 3. Best Average Scores
function buildBestAverageScoreChart() {
    const scoresByPlayer = {};
    const tournamentsByPlayer = {};

    fullData.forEach(row => {
        const player = row.name;
        const score = parseFloat(row.score) || 0;
        if (player) {
            scoresByPlayer[player] = (scoresByPlayer[player] || 0) + score;
            tournamentsByPlayer[player] = (tournamentsByPlayer[player] || 0) + 1;
        }
    });

    const averageScores = Object.entries(scoresByPlayer).map(([player, totalScore]) => {
        return [player, totalScore / tournamentsByPlayer[player]];
    });

    const topAvgPlayers = averageScores
        .sort((a, b) => a[1] - b[1]) // Lower average score is better
        .slice(0, 5);

    const players = topAvgPlayers.map(e => e[0]);
    const avgScores = topAvgPlayers.map(e => e[1]);

    const ctx = document.getElementById('chart3').getContext('2d');
    chart3 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: players,
            datasets: [{
                label: 'Average Score Relative to Par',
                data: avgScores,
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
                    text: 'Top 5 Best Average Scores',
                    color: "#F1373D",
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                    
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// 4. Toughest Tournaments (Highest Avg Score)
function buildPlayerYearlyEarnings(playerName) {
    const seasonEarnings = {};
    

    fullData.forEach(row => {
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

    const ctx = document.getElementById('chart4').getContext('2d');
    if (chart4) {
        chart4.destroy();
    }

    chart4 = new Chart(ctx, {
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
                    text: 'Toughest Tournaments',
                    color: "#F1373D",
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
