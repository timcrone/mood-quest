function getValue(elem) {
    let id = 'bdrs' + elem.toString().padStart(2, '0');
    return parseInt(document.getElementById(id).value, 10);
}

function setTotalAndProgress(){
    let val = 0
    let total = 0;
    let count = 0;
    let qlength = 0;
    let completed = true;
    for (let i=1; i < 21; i++) {
        qlength += 1;
        switch (i) {
            case 2: case 3:
                val = getValue("0"+i.toString()+"a");
                if (isNaN(val)) {
                    val = getValue("0"+i.toString()+"b");
                }
                break;
            default: val = getValue(i);
        }
        if (isNaN(val)) {
            completed = false;
        } else {
            total += val;
            count += 1;
        }
    }
    document.getElementById('current_bdrs').innerHTML = total.toString();
    if (completed) {
        document.getElementById('current_prog').innerHTML = '100';
        document.getElementById('bdrs_save').style.background = '#006400';
    } else {
        document.getElementById('current_prog').innerHTML = Math.round((count / qlength) * 100).toString();
        document.getElementById('bdrs_save').style.background = '#2b4865';
    }
}

function setDescription(elem, val) {
    document.getElementById(elem + '-text').innerHTML = val;
    setTotalAndProgress();
}

function setDescriptionMoodAnxious(val) { let id="mood_anxious"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "brief or transient periods of depression, or mildly depressed mood"; break;
    case "2": result = "depressed mood is clearly butnot consistently present and other emotions are ex-pressed, or depression is of moderate intensity"; break;
    case "3": result = "pervasive or continuous depressed mood of marked intensity"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionMoodElated(val) { let id="mood_elated"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "up to 2 hours"; break;
    case "2": result = "2-4 hours"; break;
    case "3": result = "more than 4 hours"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionMoodBad(val) { let id="mood_bad"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "less than 2 hours, or normal amount but non-restorative"; break;
    case "2": result = "greater than 2 hours"; break;
    case "3": result = "greater than 4 hours"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionMoodAngry(val) { let id="mood_angry"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "no change in food intake, but has to push self to eat or reports that food has lost taste"; break;
    case "2": result = "some decrease in food intake"; break;
    case "3": result = "marked decrease in food intake"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionMoodIrritable(val) { let id="mood_irritable"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "no change in food intake, but increased hunger"; break;
    case "2": result = "some increase in food intake, e.g., comfort eating"; break;
    case "3": result = "marked increase in food intake or cravings"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionMoodEnergetic(val) { let id="mood_energetic"; let result = "undefined"; switch (val) {
    case "0": result = "normal"; break;
    case "1": result = "slight reduction in social engage-ment with no impairment in social or interpersonalfunction"; break;
    case "2": result = "clear reduction in social engage-ment with some functional sequelae, e.g., avoidssome social engagements or conversations"; break;
    case "3": result = "marked reduction in social interac-tion or avoidance of almost all forms of socialcontact, e.g., refuses to answer the phone or see friends or family"; break;
    default: result = "undefined"; } setDescription(id, result); }

function defaultQuestionnaire() {
    let qaire = {
        resourceType: "Questionnaire",
        status: "active",
        title: "Bipolar Depression Rating Scale (BDRS)",
        date: "2007",
        name: "https://doi.org/10.1111/j.1399-5618.2007.00536.x",
        code: [ {
            system: "http://snomed.info/sct",
            code: "416767005"
        } ],
        item: [
            {
                linkId: "1",
                text: "Depressed mood",
                type: "integer"
            },
            {
                linkId: "2a",
                text: "Sleep disturbance: Insomnia",
                type: "integer"
            },
            {
                linkId: "2b",
                text: "Sleep disturbance: Hypersomnia",
                type: "integer"
            },
            {
                linkId: "3a",
                text: "Appetite disturbance: Loss of appetite",
                type: "integer"
            },
            {
                linkId: "3b",
                text: "Appetite disturbance: Increase in appetite",
                type: "integer"
            },
            {
                linkId: "4",
                text: "Reduced social engagement",
                type: "integer"
            },
            {
                linkId: "5",
                text: "Reduced energy and activity",
                type: "integer"
            },
            {
                linkId: "6",
                text: "Reduced motivation",
                type: "integer"
            },
            {
                linkId: "7",
                text: "Impaired concentration and memory",
                type: "integer"
            },
            {
                linkId: "8",
                text: "Anxiety",
                type: "integer"
            },
            {
                linkId: "9",
                text: "Anhedonia",
                type: "integer"
            },
            {
                linkId: "10",
                text: "Affective flattening",
                type: "integer"
            },
            {
                linkId: "11",
                text: "Worthlessness",
                type: "integer"
            },
            {
                linkId: "12",
                text: "Helplessness and hopelessness",
                type: "integer"
            },
            {
                linkId: "13",
                text: "Suicidal ideation",
                type: "integer"
            },
            {
                linkId: "14",
                text: "Guilt",
                type: "integer"
            },
            {
                linkId: "15",
                text: "Psychotic symptoms",
                type: "integer"
            },
            {
                linkId: "16",
                text: "Irritability",
                type: "integer"
            },
            {
                linkId: "17",
                text: "Lability",
                type: "integer"
            },
            {
                linkId: "18",
                text: "Increased motor drive",
                type: "integer"
            },
            {
                linkId: "19",
                text: "Increased speech",
                type: "integer"
            },
            {
                linkId: "20",
                text: "Agitation",
                type: "integer"
            }
        ]
    }
    console.log("Generated questionnaire");
    return(qaire);
}