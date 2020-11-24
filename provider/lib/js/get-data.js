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
    try { return result.entry[0].resource.id; } catch {}
    console.log("questionnaire search results:", result);
    result = await client.create(defaultQuestionnaire());
    console.log("created new mood questionnaire: ", result);
    try { return result.entry[0].resource.id; } catch {}
    return result.id;
}

function getQuestionnaire(client) {
    let query = {
        url: "Questionnaire?name=" + qName() + "&_sort=-date",
        cache: "reload"
        // headers: {
        //     "Cache-Control": "no-cache"
        // }
    };
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
    const count = "250";

    return new Promise((resolve, reject) => {
        checkQuestionnaire(client).then((id) => {
            // if (quest.total > 0) {
                let pid = client.patient.id;
                // let id = quest.entry[0].resource.id;
                let req = "QuestionnaireResponse?questionnaire=" + id + "&status=completed&subject=Patient/" + pid + "&_sort=-authored&_count=" + count;
                console.log(req);
                client.request(req).then((bundle) => {
                      let retdata = { bdrs01: [{}], bdrs02: [{}], bdrs03: [{}], bdrs04: [{}], bdrs05: [{}], bdrs06: [{}], bdrs07: [{}], bdrs08: [{}], bdrs09: [{}],
                        bdrs10: [{}], bdrs11: [{}], bdrs12: [{}], bdrs13: [{}], bdrs14: [{}], bdrs15: [{}], bdrs16: [{}], bdrs17: [{}], bdrs18: [{}], bdrs19: [{}],
                        bdrs20: [{}], FirstDate: moment() };
                    try {
                        bundle.entry.forEach((record) => {
                            retdata.bdrs01.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[0].answer[0].valueInteger
                            });
                            retdata.bdrs02.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[1].answer[0].valueInteger
                            });
                            retdata.bdrs03.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[2].answer[0].valueInteger
                            });
                            retdata.bdrs04.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[3].answer[0].valueInteger
                            });
                            retdata.bdrs05.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[4].answer[0].valueInteger
                            });
                            retdata.bdrs06.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[5].answer[0].valueInteger
                            });
                            retdata.bdrs07.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[6].answer[0].valueInteger
                            });
                            retdata.bdrs08.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[7].answer[0].valueInteger
                            });
                            retdata.bdrs09.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[8].answer[0].valueInteger
                            });
                            retdata.bdrs10.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[9].answer[0].valueInteger
                            });
                            retdata.bdrs11.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[10].answer[0].valueInteger
                            });
                            retdata.bdrs12.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[11].answer[0].valueInteger
                            });
                            retdata.bdrs13.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[12].answer[0].valueInteger
                            });
                            retdata.bdrs14.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[13].answer[0].valueInteger
                            });
                            retdata.bdrs15.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[14].answer[0].valueInteger
                            });
                            retdata.bdrs16.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[15].answer[0].valueInteger
                            });
                            retdata.bdrs17.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[16].answer[0].valueInteger
                            });
                            retdata.bdrs18.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[17].answer[0].valueInteger
                            });
                            retdata.bdrs19.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[18].answer[0].valueInteger
                            });
                            retdata.bdrs20.unshift({
                                x: moment(record.resource.authored),
                                y: record.resource.item[19].answer[0].valueInteger
                            });
                            // retdata.Date.unshift(moment(record.resource.authored).format("YYYY-MM-DD"));
                            if (moment(record.resource.authored) < retdata["FirstDate"]) {
                                retdata["FirstDate"] = moment(record.resource.authored);
                            }
                        });
                    } catch(err) { console.log(err); }
                    resolve(retdata);
                });
            // } else {
            //     console.log("Could not find questionnaire");
            //     resolve( { bdrs01: [{}], bdrs02: [{}], bdrs03: [{}], bdrs04: [{}], bdrs05: [{}], bdrs06: [{}], bdrs07: [{}], bdrs08: [{}], bdrs09: [{}],
            //         bdrs10: [{}], bdrs11: [{}], bdrs12: [{}], bdrs13: [{}], bdrs14: [{}], bdrs15: [{}], bdrs16: [{}], bdrs17: [{}], bdrs18: [{}], bdrs19: [{}],
            //         bdrs20: [{}], FirstDate: moment() } );
            // }
        });
    });
}

function _addResponseBody(client, data, date, forceCreate) {
    if (isNaN(date)) {
        date = moment();
    }

    //YYYY-MM-DDThh:mm:ss+zz:zz
    let time = date.format();
    // let time = date.getFullYear() + "-"
    //     + (date.getMonth() + 1).toString().padStart(2, '0') + "-"
    //     + date.getDate().toString().padStart(2, '0') + "T"
    //     + date.getHours().toString().padStart(2, '0') + ":"
    //     + date.getMinutes().toString().padStart(2, '0') + ":"
    //     + date.getSeconds().toString().padStart(2, '0') + '+'
    //     + (date.getTimezoneOffset() / 60).toString().padStart(2, '0') + ':'
    //     + (date.getTimezoneOffset() % 60).toString().padStart(2, '0');

    let completed = true;
    checkQuestionnaire(client).then((quest) => {
        let items = [];
        let val = 0;
        for (let i = 1; i < 21; i++) {
            let lid = i.toString();
            switch (i) {
                case 2:
                case 3:
                    if (data === false) {
                        val = getValue("0" + i.toString() + "a");
                        // lid = i.toString() + "a";
                        if (isNaN(val)) {
                            val = getValue("0" + i.toString() + "b");
                            // lid = i.toString() + "b";
                        }
                    } else {
                        val = data[i - 1];
                    }
                    break;
                default:
                    if (data === false) {
                        val = getValue(i);
                    } else {
                        val = data[i - 1];
                    }
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
            subject: {
                reference: "Patient/" + client.patient.id
            },
            authored: time,
            item: items,
            questionnaire: "Questionnaire/" + quest
        }
        if (forceCreate || typeof current_response.id == 'undefined') {
            client.create(response).then((result) => {
                // console.log("created: ", result);
                current_response = result;
            });
        } else {
            response.id = current_response.id;
            current_response = client.update(response).then((result) => {
                // console.log("updated: ", result);
                current_response = result;
            });
        }
    });
    document.getElementById('bdrs_save').style.background = '#000000';
}

function addQuestionnaireResponse() {
    if (LOCAL) {
        Promise.resolve(new FHIR.client({
            serverUrl: "https://r4.smarthealthit.org",
            tokenResponse: {
                patient: "5214a564-9117-4ffc-a88c-25f90239240b"
            }
        })).then((client) => {
            _addResponseBody(client, false)
        });
    } else {
        FHIR.oauth2.ready().then((client) => { _addResponseBody(client, false) });
    }
}

function displaySurvey() {
    document.getElementById('chartButton').removeEventListener('click', displaySurvey);
    document.getElementById('chartButton').addEventListener('click', buildChart);
    document.getElementById('chartSection').style.display = 'none';
    document.getElementById('surveySection').style.display = 'block';
}

function _setupBody(client) {
// get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then((patient) => {
        displayPatientAndDOB(patient);
    });

    checkQuestionnaire(client).then((result) => {
        document.getElementById('bdrs_save').addEventListener('click', addQuestionnaireResponse);
    });

    checkMoodQuestionnaire(client).then((result) => {
        document.getElementById('generateButton').addEventListener('click', createHistory);
        document.getElementById('chartButton').addEventListener('click', displayChart);
    })
}

