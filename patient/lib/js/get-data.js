//adapted from the lab 3.2 materials

// set up ratings
function barratings() {
    $('#mood_anxious').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodAnxious });
    $('#mood_elated').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodElated });
    $('#mood_bad').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodBad });
    $('#mood_angry').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodAngry });
    $('#mood_irritable').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodIrritable });
    $('#mood_energetic').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodEnergetic });
}

// helper function to process fhir resource to get the patient name.
function getPatientName(pt) {
  if (pt.name) {
    let names = pt.name.map(function(name) {
      return name.given.join(" ") + " " + name.family;
    });
    return names.join(" / ")
  } else {
    return "anonymous";
  }
}

// display the patient name gender and dob in the index page
function displayPatient(pt) {
  document.getElementById('patient_name').innerHTML = getPatientName(pt);
  document.getElementById('gender').innerHTML = pt.gender;
  document.getElementById('dob').innerHTML = pt.birthDate;
}

// Gets the BDRS questionnaire reference
async function checkQuestionnaire(client) {
    let result = await getQuestionnaire(client);
    if (result.total > 0) {
        return result.entry[0].resource;
    }
    result = await client.create(defaultQuestionnaire());
    return result;
}

function getQuestionnaire(client) {
    return client.request("Questionnaire?name=https://doi.org/10.1111/j.1399-5618.2007.00536.x");
}

// Given a list of .item s, sum their answer[0].valueInteger s
function tally(items) {
    let sum = 0;
    items.forEach((item) =>
    sum += item.answer[0].valueInteger);
    return sum;
}

function getLastQuestionnaireResponse(client) {
    getQuestionnaire(client).then((quest) => {
        if (quest.total > 0) {
            let id = quest.entry[0].resource.id;
            client.request("QuestionnaireResponse?questionnaire=" + id + "&status=completed&_sort=-authored&_count=100").then((bundle) => {
                console.log(bundle);
                document.getElementById('prior_bdrs').innerHTML = tally(bundle.entry[0].resource.item);
            });
        } else {
            console.log("Could not find questionnaire");
        }
    });
}

function addQuestionnaireResponse() {
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
    getQuestionnaire().then((result) => {
        console.log(result);
        quest = result.entry[0].resource.id;

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

///// Begin execution
    barratings();
    let current_response = {};
// LOCAL
//once fhir client is authorized then the following functions can be executed
//     const client = new FHIR.client({
//         serverUrl: "https://r4.smarthealthit.org",
//         tokenResponse: {
//             patient: "5214a564-9117-4ffc-a88c-25f90239240b"
//         }
//     });
// !LOCAL

// REMOTE
FHIR.oauth2.ready().then((client) => {
// !REMOTE

// get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then(
        function (patient) {
            displayPatient(patient);
        }
    );
    getLastQuestionnaireResponse(client);
    checkQuestionnaire(client).then((result) => {
        document.getElementById('bdrs_save').addEventListener('click', addQuestionnaireResponse);
    });


    //event listener when the add button is clicked to call the function that will add the note to the weight observation
    // document.getElementById('add').addEventListener('click', addWeightAnnotation);

//REMOTE
}).catch(console.error);
//REMOTE

