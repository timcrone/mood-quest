// Sets up the activities and so on for the web page.

const LOCAL=false

barratingsMood();
let current_mood_response = {};
let currentMoodQuestionnaire = "";

if (LOCAL) {
    Promise.resolve(new FHIR.client({
        serverUrl: "https://r4.smarthealthit.org",
        tokenResponse: {
            patient: "5214a564-9117-4ffc-a88c-25f90239240b"
        }
    })).then((client) => {
        _setupMoodBody(client);
    });
} else {
    FHIR.oauth2.ready().then((client) => {
        _setupMoodBody(client)
    });
}
