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
                backgroundColor: '#E7C474',
                borderColor: '#5d8547',
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
