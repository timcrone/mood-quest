//adapted from the cerner smart on fhir guide. updated to utalize client.js v2 library and FHIR R4

//create a fhir client based on the sandbox enviroment and test paitnet.

const client = new FHIR.client({
  serverUrl: "https://r4.smarthealthit.org",
  tokenResponse: {
    patient: "5214a564-9117-4ffc-a88c-25f90239240b"
  }
});

// helper function to process fhir resource to get the patient name.
function getPatientName(pt) {
  if (pt.name) {
    var names = pt.name.map(function(name) {
      return name.given.join(" ") + " " + name.family;
    });
    return names.join(" / ")
  } else {
    return "anonymous";
  }
}

// display the patient name gender and dob in the index page
function displayPatient(pt) {
  document.getElementById('patient_name').innerHTML = getPatientName(pt);
  document.getElementById('gender').innerHTML = pt.gender;
  document.getElementById('dob').innerHTML = pt.birthDate;
}

//function to display list of medications
function displayMedication(meds) {
  med_list.innerHTML += "<li> " + meds + "</li>";
}

//helper function to get quanity and unit from an observation resoruce.
function getQuantityValueAndUnit(ob) {
  if (typeof ob != 'undefined' &&
    typeof ob.valueQuantity != 'undefined' &&
    typeof ob.valueQuantity.value != 'undefined' &&
    typeof ob.valueQuantity.unit != 'undefined') {
    return Number(parseFloat((ob.valueQuantity.value)).toFixed(2)) + ' ' + ob.valueQuantity.unit;
  } else {
    return undefined;
  }
}

// helper function to get both systolic and diastolic bp
function getBloodPressureValue(BPObservations, typeOfPressure) {
  var formattedBPObservations = [];
  BPObservations.forEach(function(observation) {
    var BP = observation.component.find(function(component) {
      return component.code.coding.find(function(coding) {
        return coding.code == typeOfPressure;
      });
    });
    if (BP) {
      observation.valueQuantity = BP.valueQuantity;
      formattedBPObservations.push(observation);
    }
  });

  return getQuantityValueAndUnit(formattedBPObservations[0]);
}

// create a patient object to initalize the patient
function defaultPatient() {
  return {
    height: {
      value: ''
    },
    weight: {
      value: ''
    },
    sys: {
      value: ''
    },
    dia: {
      value: ''
    },
    ldl: {
      value: ''
    },
    hdl: {
      value: ''
    },
    note: 'No Annotation',
  };
}

//helper function to display the annotation on the index page
function displayAnnotation(annotation) {
  note.innerHTML = annotation;
}

//function to display the observation values you will need to update this
function displayObservation(obs) {
  hdl.innerHTML = obs.hdl;
  ldl.innerHTML = obs.ldl;
  sys.innerHTML = obs.sys;
  dia.innerHTML = obs.dia;
  weight.innerHTML = obs.weight;
  height.innerHTML = obs.height;
}

// get patient object and then display its demographics info in the banner
client.request(`Patient/${client.patient.id}`).then(
  function(patient) {
    displayPatient(patient);
  }
);

// get observation resource values
// you will need to update the below to retrieve the weight and height values
var query = new URLSearchParams();

query.set("patient", client.patient.id);
query.set("_count", 100);
query.set("_sort", "-date");
query.set("code", [
  'http://loinc.org|8462-4',
  'http://loinc.org|8480-6',
  'http://loinc.org|2085-9',
  'http://loinc.org|2089-1',
  'http://loinc.org|55284-4',
  'http://loinc.org|3141-9',
  'http://loinc.org|29463-7',
  'http://loinc.org|8302-2'
].join(","));

client.request("Observation?" + query, {
  pageLimit: 0,
  flat: true
}).then(
  function(ob) {

    // group all of the observation resoruces by type into their own
    var byCodes = client.byCodes(ob, 'code');
    var systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
    var diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
    var hdl = byCodes('2085-9');
    var ldl = byCodes('2089-1');
    var weight = byCodes('29463-7');
    var height = byCodes('8302-2')

    // create patient object
    var p = defaultPatient();

    // set patient value parameters to the data pulled from the observation resoruce
    if (typeof systolicbp != 'undefined') {
      p.sys = systolicbp;
    } else {
      p.sys = 'undefined'
    }

    if (typeof diastolicbp != 'undefined') {
      p.dia = diastolicbp;
    } else {
      p.dia = 'undefined'
    }

    p.hdl = getQuantityValueAndUnit(hdl[0]);
    p.ldl = getQuantityValueAndUnit(ldl[0]);

    p.weight = getQuantityValueAndUnit(weight[0]);
    p.height = getQuantityValueAndUnit(height[0]);

    displayObservation(p)

  });

function medName(code) {
    displayMedication(code.text);
}

// http://docs.smarthealthit.org/client-js/request.html
client.patient.request("MedicationRequest").then(
    data => data.entry.map(item => medName(
        item.resource.medicationCodeableConcept
    ))
);

function addAnnotation(observations, ann) {
    // Only noting on the first annotation
    obs = observations[0]
    if (document.getElementById("note").value !== ann.text) {
        if (typeof obs.note === 'undefined') {
            obs.note = [ann];
        } else {
            obs.note.push(ann);
        }
        console.log(obs.id)
        client.update(obs).then(
            console.log(obs)
        );
    displayAnnotation(annotation.value);

    }
}

//update function to take in text input from the app and add the note for the latest weight observation annotation
//you should include text and the author can be set to anything of your choice. keep in mind that this data will
// be posted to a public sandbox
function addWeightAnnotation() {
  let annotation = document.getElementById("annotation");
  let author = "notinguser";
  let date = new Date();
  //YYYY-MM-DDThh:mm:ss+zz:zz
  let time = date.getFullYear() + "-"
      + (date.getMonth() + 1).toString().padStart(2, '0') + "-"
      + date.getDate().toString().padStart(2, '0') + "T"
      + date.getHours().toString().padStart(2, '0') + ":"
      + date.getMinutes().toString().padStart(2, '0') + ":"
      + date.getSeconds().toString().padStart(2, '0') + '+'
      + (date.getTimezoneOffset() / 60).toString().padStart(2, '0') + ':'
      + (date.getTimezoneOffset() % 60).toString().padStart(2, '0');
  let result = {};
  let ann = {};
  ann.author = {};
  ann.author.authorString = author;
  ann.time = time;
  ann.text = annotation.value;

  client.patient.request("Observation?code=29463-7", {flat: true}).then(
      data => addAnnotation(data, ann)
  );
}

//event listener when the add button is clicked to call the function that will add the note to the weight observation
document.getElementById('add').addEventListener('click', addWeightAnnotation);
