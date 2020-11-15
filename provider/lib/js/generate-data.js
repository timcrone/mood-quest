// Generates BDRS and mood data for the patient
// Automatically generates responses for the patient
// Erases all extant responses for the patient
// * BDRS: retrospective responses up to 48 biweekly instances, at 75% probability
// * mood: retrospective responses up to 730 daily instances, at 70% probability
// * Random BDRS and mood results are scaled to the published means and standard deviations
// * Individual mood results are only allowed to vary by 2 points per day, if the prior day exists
// * Restricted values are defined to be the same scaled value, e.g. (7-1)/2 = 3 and so on
// * Negative restricted values are defined to be the inverse of the scaled value, e.g. 3 - (7-1)/2=0
// * The following correspondences are enforced for mood results:
//   - None
// * The following correspondences are used to generate BDRS results:
//   - If a mood report on the day of the BDRS report it is used as the basis
//   - Below thresholds apply at (value * given)/7, e.g. (75% * 7)/7 = 75%
//   - Anxiety: 75%: anxiety is restricted
//   - Anxiety: 25%: agitation is restricted
//   - Elated: 75%: depression is negative restricted
//   - Elated: 25%: energy reduction is negative restricted
//   - Elated: 25%: increased speech
//   - Sad: 60%: depression is restricted
//   - Sad: 25%: motivation is restricted
//   - Sad: 15%: energy is restricted
//   - Sad: 50%: anhedonia is restricted
//   - Sad: 25%: sleep disturbance is restricted
//   - Angry: 75%: irritability is restricted
//   - Angry: 25%: social impairment is restricted
//   - Irritable: 75%: irritability is restricted
//   - Irritable: 25%: social impairment is restricted
//   - Energetic: 75%: increased motor drive is restricted
//   - Energetic: 50%: increased speech is restricted

// https://stackoverflow.com/questions/22619719/javascript-generate-random-numbers-with-fixed-mean-and-standard-deviation
// generateValues generates a list of values that have characteristics such that the mean and stdev are about right.
// Pass mean = 0 and stdev = 0 to just get a normal distribution.
// min / max define the outside scope of the resulting list
// maxdelta defines the absolute maximum amount of change between successive steps during the generation of
//   the normal distribution.
function generateRandValues(count, mean, stdev, min, max, maxdelta) {
    let nums = [];
    let fnums = [];
    let redo = true;
    for (let _count=0; _count < count; _count++) {
        redo = true;
        while (redo) {
            nums[_count] = math.random(min, max);
            if (_count === 0) {
                redo = false;
            } else if (math.abs(nums[_count] - nums[_count - 1]) <= maxdelta) {
                redo = false;
            }
        }
    }
    if (mean === 0 && stdev === 0) {
        for (let _count=0; _count < count ; _count++) {
            nums[_count] = math.round(nums[_count])
        }
        return nums
    }
    let cur_std = math.std(nums);
    console.log(cur_std);
    let cur_avg = math.mean(nums);
    console.log(cur_avg);
    for (let _count=0; _count < count; _count++) {
        fnums[_count] = math.round(stdev * (nums[_count] - cur_avg) / cur_std + mean);
        if (fnums[_count] > max) {
            fnums[_count] = max;
        } else if (fnums[_count] < min) {
            fnums[_count] = min;
        }
    }
    console.log(fnums);
    return fnums;
}

function createMoodData(count) {
    let values = {
        angry: generateRandValues(count, 0, 0, 1, 7, 2),
        anxiety: generateRandValues(count, 0, 0, 1, 7, 2),
        elated: generateRandValues(count, 0, 0, 1, 7, 2),
        energetic: generateRandValues(count, 0, 0, 1, 7, 2),
        irritable: generateRandValues(count, 0, 0, 1, 7, 2),
        sad: generateRandValues(count, 0, 0, 1, 7, 2)
    }
    console.log(values);
    return values;
}

function generateMoodHistory(client) {
    let count = 730; // time window
    let prob = 0.70; // probability of getting a reading for a day
    let data = createMoodData(count);
    let now = moment();
    for (let _count = 0; _count < count; _count++) {
        if (Math.random() < prob) {
            _addMoodResponseBody(client, [data["anxiety"][_count], data["elated"][_count], data["sad"][_count], data["angry"][_count], data["irritable"][_count], data["energetic"][_count]], now.subtract(_count, "days"));
        }
    }
    return data;
}

function generateBDRS(client, moodData) {

}

function generateEverything(client) {
    let moodData = generateMoodHistory(client);
    generateBDRS(client, moodData);
}

function createHistory() {
    console.log("Generating mood data");
    createMoodData();
    if (LOCAL) {
        Promise.resolve(new FHIR.client({
            serverUrl: "https://r4.smarthealthit.org",
            tokenResponse: {
                patient: "5214a564-9117-4ffc-a88c-25f90239240b"
            }
        })).then((client) => {
            generateEverything(client)
        });
    } else {
        FHIR.oauth2.ready().then((client) => { generateEverything(client) });
    }
}