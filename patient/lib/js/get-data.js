//adapted from the lab 3.2 materials

const LOCAL=true

// set up ratings
function barratings() {
    $('#mood01').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodAnxious });
    $('#mood02').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodElated });
    $('#mood03').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodBad });
    $('#mood04').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodAngry });
    $('#mood05').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodIrritable });
    $('#mood06').barrating('show', { theme: 'bars-square', showValues: true, showSelectedRating: false, onSelect: setDescriptionMoodEnergetic });
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
    getQuestionnaire(client).then((result) => {
        // console.log(result);
        quest = result.entry[0].resource.id;

        let items = [];
        let val = 0;
        for (let i = 1; i < 7; i++) {
            let lid = i;
            switch (i) {
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

function _setupBody(client) {
// get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then((patient) => {
        displayPatient(patient);
    });

    checkQuestionnaire(client).then((result) => {
        document.getElementById('mood_save').addEventListener('click', addQuestionnaireResponse);
    });
}

///// Begin execution
    barratings();
    let current_response = {};

    if (LOCAL) {
        Promise.resolve(new FHIR.client({
            serverUrl: "https://r4.smarthealthit.org",
            tokenResponse: {
                patient: "5214a564-9117-4ffc-a88c-25f90239240b"
            }
        })).then((client) => {
            _setupBody(client);
        });
    } else {
        FHIR.oauth2.ready().then((client) => {
            _setupBody(client)
        });
    }
