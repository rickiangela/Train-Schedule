// Initialize Firebase
var config = {
    apiKey: "AIzaSyBJTkoi722BNP9xM2k6rhPcXaxWFv3Zw58",
    authDomain: "train-scheduler-93cb9.firebaseapp.com",
    databaseURL: "https://train-scheduler-93cb9.firebaseio.com",
    projectId: "train-scheduler-93cb9",
    storageBucket: "train-scheduler-93cb9.appspot.com",
    messagingSenderId: "664875631154"
  };
firebase.initializeApp(config);

var database = firebase.database();

//on click submit
$("#submit-button").click(function (event) {

    // prevent default events
    event.preventDefault();

    // clicking submit grabs all of the information given
    var updateTrain = $("#nameInput").val().trim();
    var updateDestination = $("#destinationInput").val().trim();
    var updateTime = $("#timeInput").val().trim();
    var updateFrequency = $("#frequencyInput").val().trim();

    // puts information in an object
    trainObj = {
        train: updateTrain,
        destination: updateDestination,
        time: updateTime,
        frequency: updateFrequency
    };

    //console log the new data
    console.log(trainObj);

    // clear input data
    $("#nameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");

    // Calculating "Next Arrival" and "Minutes Away"
    var timeConverted = moment(updateTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(timeConverted), "minutes");
    var timeRemainder = diffTime % updateFrequency;
    var minutesAway = updateFrequency - timeRemainder;
    var nextTrain = moment().add(minutesAway, "minutes");
    var nextArrival = moment(nextTrain).format("hh:mm A");

    console.log(nextArrival, minutesAway);

    // new row of data
    $("#myTable > tbody").append("<tr><td>" + updateTrain + "</td> <td>" + updateDestination + "</td> <td>" +
        updateFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");


    // Pushing the values to the database
    database.ref().set({
        trainName: updateTrain,
        destination: updateDestination,
        firstTrainTime: updateTime,
        frequency: updateFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });
});