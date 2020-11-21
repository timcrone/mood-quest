//adapted from the lab 3.2 materials

// set up ratings
function barratingsMood() {
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

// Gets the mood questionnaire reference; returns the FHIR ID for the questionnaire
async function checkMoodQuestionnaire(client) {
    let result = await getMoodQuestionnaire(client);
    try { return result.entry[0].resource.id; } catch {}
    console.log("mood questionnaire search results:", result);
    result = await client.create(defaultMoodQuestionnaire());
    console.log("created new mood questionnaire: ", result);
    try { return result.entry[0].resource.id; } catch {}
    return result.id;
}

function getMoodQuestionnaire(client) {
    let query = {
        url: "Questionnaire?name=" + qMoodName(),
        cache: "reload"
    };
    let result = client.request(query);
    return result;
}

// Given a list of .item s, sum their answer[0].valueInteger s
function tally(items) {
    let sum = 0;
    items.forEach((item) =>
    sum += item.answer[0].valueInteger);
    return sum;
}

function getMoodQuestionnaireResponses(client) {
    const count = "250";

    return new Promise((resolve, reject) => {
        getMoodQuestionnaire(client).then((quest) => {
            try {
                let id = quest.entry[0].resource.id;
                client.request("QuestionnaireResponse?questionnaire=" + id + "&status=completed&_sort=-authored&_count=" + count).then((bundle) => {
                    let retdata = {
                        Anxious: [],
                        Elated: [],
                        Sad: [],
                        Angry: [],
                        Irritable: [],
                        Energetic: [],
                        Date: [],
                        FirstDate: moment()
                    };
                    bundle.entry.forEach((record) => {
                        retdata.Anxious.unshift(record.resource.item[0].answer[0].valueInteger);
                        retdata.Elated.unshift(record.resource.item[1].answer[0].valueInteger);
                        retdata.Sad.unshift(record.resource.item[2].answer[0].valueInteger);
                        retdata.Angry.unshift(record.resource.item[3].answer[0].valueInteger);
                        retdata.Irritable.unshift(record.resource.item[4].answer[0].valueInteger);
                        retdata.Energetic.unshift(record.resource.item[5].answer[0].valueInteger);
                        retdata.Date.unshift(moment(record.resource.authored).format("YYYY-MM-DD"));
                        if (moment(record.resource.authored) < retdata["FirstDate"]) {
                            retdata["FirstDate"] = moment(record.resource.authored);
                        }
                    });
                    resolve(retdata);
                });
            } catch {
                console.log("Could not find questionnaire");
                resolve({
                    Anxious: [],
                    Elated: [],
                    Sad: [],
                    Angry: [],
                    Irritable: [],
                    Energetic: [],
                    Date: [],
                    FirstDate: moment()
                });
            }
        });
    });
}

function _addMoodResponseBody(client, data, date, forceCreate) {
    if (isNaN(date)) {
        date = moment();
    }

    //YYYY-MM-DDThh:mm:ss+zz:zz
    let time = date.format();
    // date.getFullYear() + "-"
    //     + (date.getMonth() + 1).toString().padStart(2, '0') + "-"
    //     + date.getDate().toString().padStart(2, '0') + "T"
    //     + date.getHours().toString().padStart(2, '0') + ":"
    //     + date.getMinutes().toString().padStart(2, '0') + ":"
    //     + date.getSeconds().toString().padStart(2, '0') + '+'
    //     + (date.getTimezoneOffset() / 60).toString().padStart(2, '0') + ':'
    //     + (date.getTimezoneOffset() % 60).toString().padStart(2, '0');

    let completed = true;
    checkMoodQuestionnaire(client).then((quest) => {
        let items = [];
        let val = 0;
        for (let i = 1; i < 7; i++) {
            let lid = i;
            switch (i) {
                default:
                    if (data === false) {
                        val = getMoodValue(i);
                    } else {
                        val = data[i - 1];
                    }
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
        if (forceCreate || typeof current_mood_response.id == 'undefined') {
            client.create(response).then((result) => {
                // console.log("created: ", result);
                current_mood_response = result;
            });
        } else {
            response.id = current_mood_response.id;
            current_mood_response = client.update(response).then((result) => {
                // console.log("updated: ", result);
                current_mood_response = result;
            });
        }
    });
    try { document.getElementById('mood_save').style.background = '#000000'; } catch {}
}

function addMoodQuestionnaireResponseFromWeb() {
    if (LOCAL) {
        Promise.resolve(new FHIR.client({
            serverUrl: "https://r4.smarthealthit.org",
            tokenResponse: {
                patient: "5214a564-9117-4ffc-a88c-25f90239240b"
            }
        })).then((client) => {
            _addMoodResponseBody(client, false)
        });
    } else {
        FHIR.oauth2.ready().then((client) => { _addMoodResponseBody(client, false) });
    }
}

function _setupMoodBody(client) {
// get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then((patient) => {
        displayPatient(patient);
    });

    checkMoodQuestionnaire(client).then((result) => {
        document.getElementById('mood_save').addEventListener('click', addMoodQuestionnaireResponseFromWeb);
    });
}
