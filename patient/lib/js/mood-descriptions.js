function getMoodValue(elem) {
    let id = 'mood' + elem.toString().padStart(2, '0');
    return parseInt(document.getElementById(id).value, 10);
}

function setMoodTotalAndProgress(){
    let val = 0
    let total = 0;
    let count = 0;
    let qlength = 0;
    let completed = true;
    for (let i=1; i < 7; i++) {
        qlength += 1;
        switch (i) {
            default: val = getMoodValue(i);
        }
        if (isNaN(val)) {
            completed = false;
        } else {
            total += val;
            count += 1;
        }
    }
    document.getElementById('current_mood').innerHTML = total.toString();
    if (completed) {
        document.getElementById('current_mood').innerHTML = '100';
        document.getElementById('mood_save').style.background = '#00FF00';
    } else {
        document.getElementById('current_mood').innerHTML = Math.round((count / qlength) * 100).toString();
        document.getElementById('mood_save').style.background = '#F7FE2E';
    }
}

function setMoodDescription(elem, val) {
    document.getElementById(elem + '-text').innerHTML = val;
    setMoodTotalAndProgress();
}

function _setMoodGeneralDescription(id, val) {
    let result = "undefined"; switch (val) {
    case "1": result = "not at all"; break;
    case "2": result = "just a little"; break;
    case "3": result = "occasionally"; break;
    case "4": result = "moderate"; break;
    case "5": result = "mostly"; break;
    case "6": result = "definitely"; break;
    case "7": result = "very much"; break;
    default: result = "undefined"; }
    setMoodDescription(id, result);
}

function setDescriptionMoodAnxious(val) { _setMoodGeneralDescription("mood01", val)}
function setDescriptionMoodElated(val) { _setMoodGeneralDescription("mood02", val)}
function setDescriptionMoodBad(val) { _setMoodGeneralDescription("mood03", val)}
function setDescriptionMoodAngry(val) { _setMoodGeneralDescription("mood04", val)}
function setDescriptionMoodIrritable(val) { _setMoodGeneralDescription("mood05", val)}
function setDescriptionMoodEnergetic(val) { _setMoodGeneralDescription("mood06", val)}

function qMoodName() {
    return "https://doi.org/10.1016/j.jad.2016.06.065:version:1.0.1";
}

function defaultMoodQuestionnaire() {
    let qaire = {
        resourceType: "Questionnaire",
        status: "active",
        title: "Mood Zoom",
        date: "2016",
        name: qMoodName(),
        code: [ {
            system: "http://snomed.info/sct",
            code: "416767005"
        } ],
        item: [
            {
                linkId: "1",
                text: "Anxious",
                type: "integer"
            },
            {
                linkId: "2",
                text: "Elated",
                type: "integer"
            },
            {
                linkId: "3",
                text: "Sad",
                type: "integer"
            },
            {
                linkId: "4",
                text: "Angry",
                type: "integer"
            },
            {
                linkId: "5",
                text: "Irritable",
                type: "integer"
            },
            {
                linkId: "6",
                text: "Energetic",
                type: "integer"
            }
        ]
    }
    console.log("Generated mood questionnaire");
    return(qaire);
}
