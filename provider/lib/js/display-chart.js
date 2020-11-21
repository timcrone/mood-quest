function displayChart() {
    document.getElementById('chartButton').removeEventListener('click', buildChart);
    document.getElementById('chartButton').addEventListener('click', displaySurvey);
    document.getElementById('chartSection').style.display = 'block';
    document.getElementById('surveySection').style.display = 'none';
    if (LOCAL) {
        Promise.resolve(new FHIR.client({
            serverUrl: "https://r4.smarthealthit.org",
            tokenResponse: {
                patient: "5214a564-9117-4ffc-a88c-25f90239240b"
            }
        })).then((client) => {
            buildChart(client);
        });
    } else {
        FHIR.oauth2.ready().then((client) => { buildChart(client); });
    }
}

async function buildChart(client) {
    let bdrs_context = document.getElementById('bdrs-chart');
    let mood_context = document.getElementById('mood-chart');

    getQuestionnaireResponses(client).then((bdrs_data) => {
        console.log(bdrs_data);
        new Chart(bdrs_context, {
            type: 'line',
            data: {
                labels: bdrs_data.Date,
                datasets: [
                    { label: 'Depressed', data: bdrs_data.bdrs01, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Sleep', data: bdrs_data.bdrs02, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Appetite', data: bdrs_data.bdrs03, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Social', data: bdrs_data.bdrs04, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Energy', data: bdrs_data.bdrs05, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Motivation', data: bdrs_data.bdrs06, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Memory', data: bdrs_data.bdrs07, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Anxiety', data: bdrs_data.bdrs08, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Anhedonia', data: bdrs_data.bdrs09, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Flattening', data: bdrs_data.bdrs10, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Worthless', data: bdrs_data.bdrs11, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Hopeless', data: bdrs_data.bdrs12, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Suicidal', data: bdrs_data.bdrs13, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Guilt', data: bdrs_data.bdrs14, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Psychotic', data: bdrs_data.bdrs15, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Irritable', data: bdrs_data.bdrs16, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Lability', data: bdrs_data.bdrs17, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Drive', data: bdrs_data.bdrs18, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Speech', data: bdrs_data.bdrs19, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Agitation', data: bdrs_data.bdrs20, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 }
            ]},
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });
    getMoodQuestionnaireResponses(client).then((mood_data) => {
        console.log(mood_data);
        new Chart(mood_context, {
            type: 'line',
            data: {
                labels: mood_data.Date,
                datasets: [
                    { label: 'Anxious', data: mood_data.Anxious, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Elated', data: mood_data.Elated, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Bad', data: mood_data.Sad, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Angry', data: mood_data.Angry, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Irritable', data: mood_data.Irritable, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 },
                    { label: 'Energetic', data: mood_data.Energetic, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)'], borderWidth: 1 }
                    ]
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });
}
