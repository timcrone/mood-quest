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

function setDescriptionBDRS01(val) { let id="bdrs01"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "brief or transient periods of depression, or mildly depressed mood"; break;
    case "2": result = "depressed mood is clearly but not consistently present and other emotions are expressed, or depression is of moderate intensity"; break;
    case "3": result = "pervasive or continuous depressed mood of marked intensity"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS02a(val) { let id="bdrs02a"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "up to 2 hours"; break;
    case "2": result = "2-4 hours"; break;
    case "3": result = "more than 4 hours"; break;
    default: result = "undefined"; } setDescription(id, result);
    if (val in ["0", "1", "2", "3"]) {$("#bdrs02b").barrating('clear'); setDescriptionBDRS02b('reset');}}

function setDescriptionBDRS02b(val) { let id="bdrs02b"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "less than 2 hours, or normal amount but non-restorative"; break;
    case "2": result = "greater than 2 hours"; break;
    case "3": result = "greater than 4 hours"; break;
    default: result = "undefined"; } setDescription(id, result);
    if (val in ["0", "1", "2", "3"]) {$("#bdrs02a").barrating('clear'); setDescriptionBDRS02a('reset');}}

function setDescriptionBDRS03a(val) { let id="bdrs03a"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "no change in food intake, but has to push self to eat or reports that food has lost taste"; break;
    case "2": result = "some decrease in food intake"; break;
    case "3": result = "marked decrease in food intake"; break;
    default: result = "undefined"; } setDescription(id, result);
    if (val in ["0", "1", "2", "3"]) {$("#bdrs03b").barrating('clear'); setDescriptionBDRS03b('reset');}}

function setDescriptionBDRS03b(val) { let id="bdrs03b"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "no change in food intake, but increased hunger"; break;
    case "2": result = "some increase in food intake, e.g. comfort eating"; break;
    case "3": result = "marked increase in food intake or cravings"; break;
    default: result = "undefined"; } setDescription(id, result);
    if (val in ["0", "1", "2", "3"]) {$("#bdrs03a").barrating('clear'); setDescriptionBDRS03a('reset');}}

function setDescriptionBDRS04(val) { let id="bdrs04"; let result = "undefined"; switch (val) {
    case "0": result = "normal"; break;
    case "1": result = "slight reduction in social engagement with no impairment in social or interpersonal function"; break;
    case "2": result = "clear reduction in social engagement with some functional sequelae, e.g. avoids some social engagements or conversations"; break;
    case "3": result = "marked reduction in social interaction or avoidance of almost all forms of social contact, e.g. refuses to answer the phone or see friends or family"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS05(val) { let id="bdrs05"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "able to engage in usual activities but with increased effort"; break;
    case "2": result = "significant reduction in energy leading to reduction of some role-specific activities"; break;
    case "3": result = "leaden paralysis or cessation of almost all role-specific activities, e.g. spends excessive time in bed, avoids answering the phone, poor personal hygiene"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS06(val) { let id="bdrs06"; let result = "undefined"; switch (val) {
    case "0": result = "normal motivation"; break;
    case "1": result = "slight reduction in motivation with no reduction in function"; break;
    case "2": result = "reduced motivation or drive with significantly reduced volitional activity or requires substantial effort to maintain usual level of function"; break;
    case "3": result = "reduced motivation or drive such that goal-directed behaviour or function is markedly reduced"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS07(val) { let id="bdrs07"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "slight impairment of attention, concentration, or memory with no functional impairment"; break;
    case "2": result = "significant impairment of attention, concentration, or forgetfulness with some functional impairment"; break;
    case "3": result = "marked impairment of concentration or memory with substantial functional impairment, e.g. unable to read or watch TV"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS08(val) { let id="bdrs08"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "transient worry or tension about minor matters"; break;
    case "2": result = "significant anxiety, tension or worry, or some accompanying somatic features"; break;
    case "3": result = "marked continuous anxiety, tension or worry that interferes with normal activity, or panic attacks"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS09(val) { let id="bdrs09"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "slight reduction in pleasure from usually pleasurable activities"; break;
    case "2": result = "significant reduction in pleasure from usually pleasurable activities; some pleasure from isolated activities retained"; break;
    case "3": result = "complete inability to experience pleasure"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS10(val) { let id="bdrs10"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "slight constriction of range of affect, or transient reduction in range or intensity of feelings"; break;
    case "2": result = "signiﬁcant constriction of range or intensity of feelings with preservation of some emotions, e.g. unable to cry"; break;
    case "3": result = "marked and pervasive constriction of range of affect or inability to experience usual emotions"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS11(val) { let id="bdrs11"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "slight decrease in sense of self-worth"; break;
    case "2": result = "some thoughts of worthlessness and decreased self-worth"; break;
    case "3": result = "marked, pervasive, or persistent feelings of worthlessness, e.g. feels others better off without them, unable to appreciate positive attributes"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS12(val) { let id="bdrs12"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "occasional and mild feelings of not being able to cope as usual, or pessimism"; break;
    case "2": result = "often feels unable to cope, or significant feelings of helplessness or hopelessness which lift at times"; break;
    case "3": result = "marked and persistent feelings of pessimism, helplessness, or hopelessness"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS13(val) { let id="bdrs13"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "thoughts that life is not worthwhile or is meaningless"; break;
    case "2": result = "thoughts of dying or death, but with no active suicide thoughts or plans"; break;
    case "3": result = "thoughts or plans of suicide"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS14(val) { let id="bdrs14"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "slight decrease in self-esteem or increased self-criticism"; break;
    case "2": result = "significant thoughts of failure, self-criticism, inability to cope, or ruminations regarding past failures and the effect on others; able to recognize as excessive"; break;
    case "3": result = "marked, pervasive, or persistent guilt, e.g. feelings of deserving punishment, or does not clearly recognize as excessive"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS15(val) { let id="bdrs15"; let result = "undefined"; switch (val) {
    case "0": result = "absent"; break;
    case "1": result = "mild overvalued ideas, e.g. self-criticism or pessimism without clear effect on behaviour"; break;
    case "2": result = "significant overvalued ideas with clear effect on behaviour, e.g. strong guilt feelings, clear thoughts that others would be better off without them"; break;
    case "3": result = "clear psychotic symptoms, e.g. delusions or hallucinations"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS16(val) { let id="bdrs16"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "slight subjective irritability; may not be overtly present"; break;
    case "2": result = "verbal snappiness and irritability that is clearly observable in the interview"; break;
    case "3": result = "reports of physical outbursts, e.g. throwing ⁄ breaking objects, or markedly abusive verbal outbursts"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS17(val) { let id="bdrs17"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "subjective reports of mild increase in mood lability"; break;
    case "2": result = "mood lability clearly observable, moderate in intensity"; break;
    case "3": result = "marked and dominant mood lability, frequent or dramatic swings in mood"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS18(val) { let id="bdrs18"; let result = "undefined"; switch (val) {
    case "0": result = "normal motor drive"; break;
    case "1": result = "slight increase in drive, not observable in interview"; break;
    case "2": result = "clear and observable increase in energy and drive"; break;
    case "3": result = "marked or continuous increase in drive"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS19(val) { let id="bdrs19"; let result = "undefined"; switch (val) {
    case "0": result = "nil"; break;
    case "1": result = "slight increase in the rate or quantity of speech"; break;
    case "2": result = "racing thoughts, significantly more talkative, clearly distractible, or some circumstantiality; does not impede interview"; break;
    case "3": result = "flight of ideas; interferes with interview"; break;
    default: result = "undefined"; } setDescription(id, result); }

function setDescriptionBDRS20(val) { let id="bdrs20"; let result = "undefined"; switch (val) {
    case "0": result = "normal"; break;
    case "1": result = "slight restlessness"; break;
    case "2": result = "clear increase in level of agitation"; break;
    case "3": result = "marked agitation, e.g. near continuous pacing or wringing hands"; break;
    default: result = "undefined"; } setDescription(id, result); }

function qName() {
    return "https://doi.org/10.1111/j.1399-5618.2007.00536.x:v1.0";
}

function defaultQuestionnaire() {
    let qaire = {
        resourceType: "Questionnaire",
        status: "active",
        title: "Bipolar Depression Rating Scale (BDRS)",
        date: "2007",
        name: qName(),
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
    return(qaire);
}