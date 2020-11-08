function getValue(elem) {
    let id = 'mood' + elem.toString().padStart(2, '0');
    return parseInt(document.getElementById(id).value, 10);
}

function setTotalAndProgress(){
    let val = 0
    let total = 0;
    let count = 0;
    let qlength = 0;
    let completed = true;
    for (let i=1; i < 7; i++) {
        qlength += 1;
        switch (i) {
            default: val = getValue(i);
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
        document.getElementById('mood_save').style.background = '#006400';
    } else {
        document.getElementById('current_mood').innerHTML = Math.round((count / qlength) * 100).toString();
        document.getElementById('mood_save').style.background = '#2b4865';
    }
}

function setDescription(elem, val) {
    document.getElementById(elem + '-text').innerHTML = val;
    setTotalAndProgress();
}

function _setGeneralDescription(id, val) {
    let result = "undefined"; switch (val) {
    case "1": result = "not at all"; break;
    case "2": result = "just a little"; break;
    case "3": result = "occasionally"; break;
    case "4": result = "moderate"; break;
    case "5": result = "mostly"; break;
    case "6": result = "definitely"; break;
    case "7": result = "very much"; break;
    default: result = "undefined"; }
    setDescription(id, result);
}

function setDescriptionMoodAnxious(val) { _setGeneralDescription("mood01", val)}
function setDescriptionMoodElated(val) { _setGeneralDescription("mood02", val)}
function setDescriptionMoodBad(val) { _setGeneralDescription("mood03", val)}
function setDescriptionMoodAngry(val) { _setGeneralDescription("mood04", val)}
function setDescriptionMoodIrritable(val) { _setGeneralDescription("mood05", val)}
function setDescriptionMoodEnergetic(val) { _setGeneralDescription("mood06", val)}

function qName() {
    return "https://doi.org/10.1016/j.jad.2016.06.065:version:1.0";
}

function defaultQuestionnaire() {
    let qaire = {
        resourceType: "Questionnaire",
        status: "active",
        title: "Mood Zoom",
        date: "2016",
        name: qName(),
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
