// Generates BDRS and mood data for the patient
// Automatically generates responses for the patient
// Erases all extant responses for the patient
// * BDRS: retrospective responses up to 48 biweekly instances, at 50% probability to start and then at 90% probability for the remainder of the term
// * mood: retrospective responses up to 730 daily instances, at 90% probability for 20% of the time and 30% probability for 80% of the time
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
function generateMoodValues(count, mean, stdev, min, max, maxdelta) {
    let nums = [];
    let fnums = [];
    let redo = true;
    for (let _count=0; _count < count; _count++) {
        redo = true;
        while (redo) {
            nums[_count] = math.random([min, max]);
            if (_count === 0) {
                redo = false;
            } else if (math.abs(nums[_count] - nums[_count - 1]) < maxdelta) {
                redo = false;
            }
        }
    }
    if (mean === 0 && stdev === 0) {
        return nums
    }
    console.log(nums);
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

function createMoodData() {
    let result = {
        anxiety: 0,
        elated: 0,
        sad: 0,
        angry: 0,
        irritable: 0,
        energetic: 0
    }
    let _anx = generateMoodValues(730, 0, 0, 1, 7, 2);
    console.log(_anx);
}

function createHistory() {
    createMoodData()
}