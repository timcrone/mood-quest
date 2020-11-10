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
function generateValues(count, mean, stdev) {
    
}

function createMoodData(prior) {
    let result = {
        anxiety: 0,
        elated: 0,
        sad: 0,
        angry: 0,
        irritable: 0,
        energetic: 0
    }
    if (typeof prior == 'undefined') {

    }
}