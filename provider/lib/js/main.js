const LOCAL=true

///// Begin execution
barratings();
let current_response = {};
let current_mood_response = {};

if (LOCAL) {
    Promise.resolve(new FHIR.client({
        serverUrl: "https://r4.smarthealthit.org",
        tokenResponse: {
            patient: "5214a564-9117-4ffc-a88c-25f90239240b"
        }
    })).then((client) => {
        _setupBody(client);
    });
} else {
    FHIR.oauth2.ready().then((client) => {
        _setupBody(client)
    });
}
