# mood-quest

This started as a project for school, but because I think it is valuable generally I've removed school-specific data and made it public.  I cannot promise it is the best Javascript I've ever written and the UI design is truly sad, but hopefully it will be useful to someone!

The patient interface implements a simple interface for a standard, peer-reviewed mood survey, containing questions designed to identify depressive, mixed, and manic mood states. It is intended to be used regularly by a patient, allowing long term relative monitoring of mood states as the patient's disease progresses.

The provider interface implements an additional standard survey for providers, intended to be used by professional diagnosticians to analyze various aspects of the patient's mental state. The provider also sees an aggregate of the BDRS in the top right of the screen, since this score is individually important diagnostically - see the BDRS paper for more information on interpreting these values. Providers also can access a summative interface, allowing them to analyze points of correspondance and divergence with patient-reported input over time. Finally, there is an option to generate data - this is quasi-random historical data pushed into FHIR for demonstration purposes, it does not actually go back in time and collect survey data from the patient!  If you were to implement this on a for-real server I would recommend disabling this last button. ;)

Both interfaces display some additional clarification of the question by hovering over the left column.  To view a qualitative definition of a value, click the value from the right column and the description in that column will change.  Some of the provider options are exclusive - if you choose from one selection column, the second will unset and vice versa.  Click the "Save" button in the top right to save either interim or completed survey data - a green button means the survey is 100% complete, and a black button means it has correctly saved.  Did I mention the UI was not great?

The links below point to a development workspace for demonstrating FHIR apps; survey results are not stored permanently because the smarthealthit database resets every few days.  You can set up a general FHIR server and change the pointer which would let you store and monitor the survey results indefinitely.  Keep in mind that the development portal is absolutely -not- secure so should -not- be used to store actual information.

* [Patient Interface](https://launch.smarthealthit.org/?auth_error=&fhir_version_1=r4&fhir_version_2=r4&iss=&launch_pp=1&launch_url=https%3A%2F%2Ftimcrone.github.io%2Fmood-quest%2Fpatient%2Flaunch.html&patient=&prov_skip_auth=1&provider=&pt_skip_auth=1&public_key=&sb=&sde=&sim_ehr=0&token_lifetime=15&user_pt=)

* [Provider Interface](https://launch.smarthealthit.org/?auth_error=&fhir_version_1=r4&fhir_version_2=r4&iss=&launch_ehr=1&launch_url=https%3A%2F%2Ftimcrone.github.io%2Fmood-quest%2Fprovider%2Flaunch.html&patient=&prov_skip_auth=1&provider=&pt_skip_auth=1&public_key=&sb=&sde=&sim_ehr=0&token_lifetime=15&user_pt=)
