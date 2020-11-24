// Generates BDRS and mood data for the patient
// Automatically generates responses for the patient
// * BDRS: retrospective responses up to 14 biweekly instances, at 75% probability
// * mood: retrospective responses up to 196 daily instances, at 70% probability
// * Random BDRS results are scaled to the published means and standard deviations
// * Random mood results are initially generated along a normal distribution
// * Individual mood results are only allowed to vary by 2 points per day, if the prior day exists
// * Restricted values are defined to be the same scaled value, e.g. (7-1)/2 = 3 and so on
// * Negative restricted values are defined to be the inverse of the scaled value, e.g. 3 - (7-1)/2=0
// * The following correspondences are enforced for mood results:
//   - None

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
    let cur_avg = math.mean(nums);
    for (let _count=0; _count < count; _count++) {
        fnums[_count] = math.round(stdev * (nums[_count] - cur_avg) / cur_std + mean);
        if (fnums[_count] > max) {
            fnums[_count] = max;
        } else if (fnums[_count] < min) {
            fnums[_count] = min;
        }
    }
    return fnums;
}

function createMoodData(count) {
    let values = {
        angry: generateRandValues(count, 2, 2, 1, 7, 1),
        anxiety: generateRandValues(count, 2, 2, 1, 7, 1),
        elated: generateRandValues(count, 2, 2, 1, 7, 1),
        energetic: generateRandValues(count, 2, 2, 1, 7, 1),
        irritable: generateRandValues(count, 2, 2, 1, 7, 1),
        sad: generateRandValues(count, 2, 2, 1, 7, 1)
    }
    return values;
}

function generateMoodHistory(client) {
    let count = 730; // time window
    let prob = 0.70; // probability of getting a reading for a day
    let data = createMoodData(count);
    for (let _count = 0; _count < count; _count++) {
        if (Math.random() < prob) {
            _addMoodResponseBody(client, [data["anxiety"][_count], data["elated"][_count], data["sad"][_count], data["angry"][_count], data["irritable"][_count], data["energetic"][_count]], moment().subtract(_count, "days"), true);
        } else {
            data["anxiety"][_count] = 0;
            data["elated"][_count] = 0;
            data["sad"][_count] = 0;
            data["angry"][_count] = 0;
            data["irritable"][_count] = 0;
            data["energetic"][_count] = 0;
        }
    }
    return data;
}

function createBDRSData(count) {
    let values = []
    // Means and standard deviations from the original paper
    let m_std = [[1.65, 0.9], [1.48, 1.04], [1.16, 1.04], [1.5, 1.01], [1.48, 0.86],
                 [1.6, 1.06], [1.71, 0.88], [1.54, 0.9], [1.43, 0.95], [1.33, 0.98],
                 [1.39, 1.09], [1.38, 1.11], [0.9, 1.09], [1.25, 0.96], [0.45, 0.79],
                 [0.93, 0.84], [0.89, 0.91], [0.17, 0.51], [0.3, 0.69], [0.28, 0.63]]
    values = []
    for (let _quest = 0; _quest < m_std.length; _quest++) {
        values.push(generateRandValues(count, m_std[_quest][0], m_std[_quest][1], 0, 3, 4));
    }
    return values;
}

function _restrict(odds, baseValue, moodValue, negative) {
    let restricted = Math.trunc((moodValue - 1) / 2);
    if (Math.random() < odds) {
        if (negative) {
            return 3 - restricted
        }
        return restricted
    }
    return baseValue
}

// Correlates a day's values between mood and BDRS
function correlateValues(bdrs, mood) {
    // * The following correspondences are then used to generate BDRS results:
    //   - If a mood report is on the day of the BDRS report it is used as the basis
    //   - Anxiety (1): 75%: anxiety (8) is restricted
    bdrs[7] = _restrict(0.75, bdrs[7], mood[0], false);
    //   - Anxiety (1): 25%: agitation (20) is restricted
    bdrs[19] = _restrict(0.25, bdrs[19], mood[0], false);

    //   - Elated (2): 10%: depressed mood (1) is negative restricted
    bdrs[0] = _restrict(0.10, bdrs[0], mood[1], true);
    //   - Elated (2): 45%: energy reduction (5) is negative restricted
    bdrs[4] = _restrict(0.45, bdrs[4], mood[1], true);
    //   - Elated (2): 25%: increased speech (19) is restricted
    bdrs[19] = _restrict(0.25, bdrs[19], mood[1], false);

    //   - Sad (3): 60%: depressed mood (1) is restricted
    bdrs[0] = _restrict(0.60, bdrs[0], mood[2], false);
    //   - Sad (3): 25%: motivation (6) is restricted
    bdrs[5] = _restrict(0.25, bdrs[5], mood[2], false);
    //   - Sad (3): 15%: energy reduction (5) is restricted
    bdrs[4] = _restrict(0.25, bdrs[4], mood[2], false);
    //   - Sad (3): 50%: anhedonia (9) is restricted
    bdrs[8] = _restrict(0.25, bdrs[8], mood[2], false);
    //   - Sad (3): 25%: sleep disturbance (2) is restricted
    bdrs[1] = _restrict(0.25, bdrs[1], mood[2], false);

    //   - Angry (4): 75%: psychotic (15) is restricted
    bdrs[14] = _restrict(0.75, bdrs[14], mood[3], false);
    //   - Angry (4): 25%: impaired concentration (7) is restricted
    bdrs[6] = _restrict(0.25, bdrs[6], mood[3], false);
    //   - Angry (4): 50%: reduced social engagement (4) is negative restricted
    bdrs[3] = _restrict(0.50, bdrs[3], mood[3], true);

    //   - Irritable (5): 75%: irritability (16) is restricted
    bdrs[15] = _restrict(0.75, bdrs[15], mood[4], false);
    //   - Irritable (5): 25%: social impairment (4) is restricted
    bdrs[3] = _restrict(0.25, bdrs[3], mood[4], false);
    //   - Irritable (5): 35%: affective flattening (10) is negative restricted
    bdrs[9] = _restrict(0.35, bdrs[9], mood[4], false);

    //   - Energetic (6): 75%: increased motor drive (18) is restricted
    bdrs[17] = _restrict(0.75, bdrs[17], mood[5], false);
    //   - Energetic (6): 50%: increased speech (19) is restricted
    bdrs[18] = _restrict(0.50, bdrs[18], mood[5], false);

    return bdrs;
}

function generateBDRSHistory(client, moodData) {
    let count = 52; // number of iterations
    let prob = 0.75; // probability
    let data = createBDRSData(count);
    for (let _bdrsCount = 0; _bdrsCount < count; _bdrsCount++) {
        if (Math.random() < prob) {
            let _moodCount = _bdrsCount * 14;
            let bd = [];
            for (let _bc = 0; _bc < data.length; _bc++) {
                bd.push(data[_bc][_bdrsCount]);
            }
            if (moodData["angry"][_moodCount] !== 0) {
                //   - If a mood report is on the day of the BDRS report it is used as the basis
                let md = [moodData["anxiety"][_moodCount], moodData["elated"][_moodCount], moodData["sad"][_moodCount],
                          moodData["angry"][_moodCount], moodData["irritable"][_moodCount], moodData["energetic"][_moodCount]]
                bd = correlateValues(bd, md);
            }
            _addResponseBody(client, bd, moment().subtract(_moodCount, "days"), true);
        }
    }
}

function generateEverything(client) {
    let moodData = generateMoodHistory(client);
    generateBDRSHistory(client, moodData);
}

function createHistory() {
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