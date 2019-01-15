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

var num = 1;

// when you click submit
$("#submit-button").on("click", function (event) {
    event.preventDefault();

    // taking user input
    var name = $("#nameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var trainTime = $("#timeInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();


    // math
    var timeConvert = moment(trainTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(timeConvert), "minutes");
    var tRemainder = diffTime % frequency;
    var timeRemaining = frequency - tRemainder;
    var nextTrain = moment().add(timeRemaining, "minutes");
    var nextTrainReal = moment(nextTrain).format("hh:mm A");

    // Pushing the values
    database.ref().push({
        trainName: name,
        destination: destination,
        firstTrainTime: trainTime,
        frequency: frequency,
        nextTrainFormatted: nextTrainReal,
        minutesTillTrain: timeRemaining
    })
});

// firebase
database.ref().on("child_added", function (snapshot) {

    console.log(snapshot.val());

    var trains = snapshot.val();

    // new rows
    $('#myTable').last().append($(

        "<tr class='table-row' id=" + "'" + snapshot.key + "'" + ">" +
        "<td>" + num++ + "</td>" +
        "<td>" + trains.trainName + "</td>" +
        "<td>" + trains.destination + "</td>" +
        "<td>" + trains.frequency + "</td>" +
        "<td>" + trains.nextTrainFormatted + "</td>" +
        "<td>" + trains.minutesTillTrain + "</td>" +
        "<td>" + '<p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs update" data-title="Edit" data-toggle="modal" data-target="#edit"><span class="glyphicon glyphicon-pencil"></span></button></p>' + "</td>" +
        "<td>" + '<p data-placement="top" data-toggle="tooltip" title="Delete"><button id="remove-train"class="btn btn-danger btn-xs delete" data-title="Delete" data-toggle="modal" data-target="#delete"><span class="glyphicon glyphicon-trash"></span></button></p>' +
        "</tr>"));

});

//edit
$("body").on("click", ".update", function () {
    var keyToUpdate = $(this).parent().parent().parent().attr('id');
    var indexToUpdate = $(this).parent().parent().parent().index();

    // grabbing input
    var databaseRow = database.ref().child(keyToUpdate);
    databaseRow.on("value", function (snapshot) {
        var row = snapshot.val();
        console.log(row.destination);

        //output
        $("#modal-trainName").val(row.trainName);
        $("#modal-trainDestination").val(row.destination);
        $("#modal-trainTime").val(row.nextTrainFormatted.split(" ")[0]);
        console.log(row.nextTrainFormatted.split(" "));
        $("#modal-trainFrequeny").val(row.frequency);
        console.log(row.frequency);

    });

});

//delete
$("body").on("click", ".delete", function () {
    keyToUpdate = $(this).parent().parent().parent().attr('id');
    indexToUpdate = $(this).parent().parent().parent().index();
});

$(".modal-footer").on("click", "#remove-train", function () {
    $("#myTable tbody tr:nth-child(" + (indexToUpdate + 1) + ")").remove();
    $("#delete").modal("hide");

    database.ref().child(keyToUpdate).remove();

});

// Updating rows	
$(".modal-footer").on("click", "#update-train", function () {

    var databaseRow = database.ref().child(keyToUpdate);
    databaseRow.on("value", function (snapshot) {

        //Getting vals
        var TrainNameupdated = $("#modal-trainName").val().trim();
        var TrainDestinationupdated = $("#modal-trainDestination").val().trim();
        var TrainTimeupdated = $("#modal-trainTime").val().trim();
        var TrainFrequency = $("#modal-trainFrequeny").val().trim();

        //update
        databaseRow.update({
            'trainName': TrainNameupdated,
            'destination': TrainDestinationupdated,
            'firstTrainTime': TrainTimeupdated,
            'frequency': TrainFrequency
        });


    });

});