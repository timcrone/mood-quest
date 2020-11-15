//adapted from the lab 3.2 materials

// set up ratings
function barratings() {
    $('#bdrs01').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS01 });
    $('#bdrs02a').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS02a });
    $('#bdrs02b').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS02b });
    $('#bdrs03a').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS03a });
    $('#bdrs03b').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS03b });
    $('#bdrs04').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS04 });
    $('#bdrs05').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS05 });
    $('#bdrs06').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS06 });
    $('#bdrs07').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS07 });
    $('#bdrs08').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS08 });
    $('#bdrs09').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS09 });
    $('#bdrs10').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS10 });
    $('#bdrs11').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS11 });
    $('#bdrs12').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS12 });
    $('#bdrs13').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS13 });
    $('#bdrs14').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS14 });
    $('#bdrs15').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS15 });
    $('#bdrs16').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS16 });
    $('#bdrs17').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS17 });
    $('#bdrs18').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS18 });
    $('#bdrs19').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS19 });
    $('#bdrs20').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionBDRS20 });
}

// // helper function to process fhir resource to get the patient name.
// function getPatientName(pt) {
//   if (pt.name) {
//     let names = pt.name.map(function(name) {
//       return name.given.join(" ") + " " + name.family;
//     });
//     return names.join(" / ")
//   } else {
//     return "anonymous";
//   }
// }
//
// display the patient name gender and dob in the index page
function displayPatientAndDOB(pt) {
  document.getElementById('patient_name').innerHTML = getPatientName(pt);
  document.getElementById('dob').innerHTML = pt.birthDate;
}

// Gets the BDRS questionnaire reference; returns the FHIR ID for the questionnaire
async function checkQuestionnaire(client) {
    let result = await getQuestionnaire(client);
    if (result.total > 0) {
        return result.entry[0].resource.id;
    }
    result = await client.create(defaultQuestionnaire());
    console.log(result);
    return result.entry[0].resource.id;
}

function getQuestionnaire(client) {
    let query = "Questionnaire?name=" + qName();
    return client.request(query);
}

// Given a list of .item s, sum their answer[0].valueInteger s
function tally(items) {
    let sum = 0;
    items.forEach((item) =>
    sum += item.answer[0].valueInteger);
    return sum;
}

function getQuestionnaireResponses(client) {
    const count = "1000";

    getQuestionnaire(client).then((quest) => {
        if (quest.total > 0) {
            let id = quest.entry[0].resource.id;
            client.request("QuestionnaireResponse?questionnaire=" + id + "&status=completed&_sort=-authored&_count=" + count).then((bundle) => {
                console.log(bundle);
                if (bundle.total > 0) {
                    // document.getElementById('prior_bdrs').innerHTML = tally(bundle.entry[0].resource.item);
                }
            });
        } else {
            console.log("Could not find questionnaire");
        }
    });
}

function _addResponseBody(client) {
    let date = new Date();

    //YYYY-MM-DDThh:mm:ss+zz:zz
    let time = date.getFullYear() + "-"
        + (date.getMonth() + 1).toString().padStart(2, '0') + "-"
        + date.getDate().toString().padStart(2, '0') + "T"
        + date.getHours().toString().padStart(2, '0') + ":"
        + date.getMinutes().toString().padStart(2, '0') + ":"
        + date.getSeconds().toString().padStart(2, '0') + '+'
        + (date.getTimezoneOffset() / 60).toString().padStart(2, '0') + ':'
        + (date.getTimezoneOffset() % 60).toString().padStart(2, '0');

    console.log("starting write");
    let completed = true;
    checkQuestionnaire(client).then((quest) => {
        let items = [];
        let val = 0;
        for (let i = 1; i < 21; i++) {
            let lid = i;
            switch (i) {
                case 2:
                case 3:
                    val = getValue("0" + i.toString() + "a");
                    lid = i.toString() + "a";
                    if (isNaN(val)) {
                        val = getValue("0" + i.toString() + "b");
                        lid = i.toString() + "b";
                    }
                    break;
                default:
                    val = getValue(i);
                    lid = i.toString();
            }
            if (isNaN(val)) {
                completed = false;
                // console.log("Skipping ", lid);
            } else {
                items.push({
                    linkId: lid,
                    answer: [{valueInteger: val}]
                });
            }
        }

        let cur_status = "in-progress";
        if (completed) {
            cur_status = "completed";
        }

        let response = {
            resourceType: "QuestionnaireResponse",
            status: cur_status,
            subject: client.patient.id,
            authored: time,
            item: items,
            questionnaire: "Questionnaire/" + quest
        }
        if (typeof current_response.id == 'undefined') {
            client.create(response).then((result) => {
                console.log("created: ", result);
                current_response = result;
            });
        } else {
            response.id = current_response.id;
            current_response = client.update(response).then((result) => {
                console.log("updated: ", result);
                current_response = result;
            });
        }
    });
}

function addQuestionnaireResponse() {
    if (LOCAL) {
        Promise.resolve(new FHIR.client({
            serverUrl: "https://r4.smarthealthit.org",
            tokenResponse: {
                patient: "5214a564-9117-4ffc-a88c-25f90239240b"
            }
        })).then((client) => {
            _addResponseBody(client)
        });
    } else {
        FHIR.oauth2.ready().then((client) => { _addResponseBody(client) });
    }
}

function displaySurvey() {
    document.getElementById('chartButton').removeEventListener('click', displaySurvey);
    document.getElementById('chartButton').addEventListener('click', buildChart);
    document.getElementById('chartSection').style.display = 'none';
    document.getElementById('surveySection').style.display = 'block';
}

function displayChart() {
    document.getElementById('chartButton').addEventListener('click', buildChart);
    document.getElementById('chartButton').addEventListener('click', displaySurvey);
    document.getElementById('chartSection').style.display = 'block';
    document.getElementById('surveySection').style.display = 'none';
}

function buildChart(client) {
    var bdrs_context = document.getElementById('bdrs-chart');
    var mood_context = document.getElementById('mood-chart');

    var bdrs_chart = new Chart(bdrs_context, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {label: 'bdrs01', data: [3, 1, 2, 3, 1, 3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs02', data: [2, 2, 2, 3, 0, 1], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs03', data: [1, 1, 1, 1, 2, 0], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs04', data: [3, 3, 1, 1, 2, 3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs05', data: [3, 0, 2, 3, 3, 3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs06', data: [2, 2, 3, 1, 1, 3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs07', data: [3, 2, 0, 0, 2, 3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs08', data: [2, 1, 2, 3, 1, 0], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs09', data: [3, 3, 2, 0, 1, 2], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs10', data: [1, 2, 1, 1, 0, 3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs11', data: [0, 2, 3, 1, 1, 1], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs12', data: [1, 1, 2, 1, 3, 2], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs13', data: [2, 1, 3, 0, 3, 1], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs14', data: [1, 3, 0, 1, 0, 0], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs15', data: [3, 0, 0, 1, 2, 3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs16', data: [3, 0, 2, 0, 0, 3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs17', data: [2, 0, 0, 3, 3, 1], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs18', data: [3, 1, 3, 1, 0, 0], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs19', data: [0, 0, 1, 1, 3, 1], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'bdrs20', data: [3, 2, 3, 2, 2, 1], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1}]
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
    var mood_chart = new Chart(mood_context, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {label: 'Anxious', data: [6,3,4,3,4,1], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'Elated', data: [4,6,1,5,5,3], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'Bad', data: [7,1,2,4,2,5], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'Angry', data: [1,2,4,6,6,1], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'Irritable', data: [3,4,3,4,6,6], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1},
                {label: 'Energetic', data: [7,2,3,3,7,5], backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'], borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'], borderWidth: 1}]
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
}

function _setupBody(client) {
// get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then((patient) => {
        displayPatientAndDOB(patient);
    });

    checkQuestionnaire(client).then((result) => {
        document.getElementById('bdrs_save').addEventListener('click', addQuestionnaireResponse);
    });

    document.getElementById('generateButton').addEventListener('click', createHistory);
    buildChart(client);
    document.getElementById('chartButton').addEventListener('click', displayChart);
}

