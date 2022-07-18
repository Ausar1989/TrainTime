// 1. Create Firebase link
// 2. Create initial train data in database
// 3. Create button for adding new trains - then update the html + update the database
// 4. Create a way to retrieve trains from the trainlist.
// 5. Create a way to calculate the time way. Using difference between start and current time.
//    Then take the difference and modulus by frequency. (This step can be completed in either 3 or 4)

// Initialize Firebase
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBmjHXK78Y_CJdohsAk3sMQf1lWb6cJO0o",
    authDomain: "train-time-c1252.firebaseapp.com",
    projectId: "train-time-c1252",
    storageBucket: "train-time-c1252.appspot.com",
    messagingSenderId: "664017014883",
    appId: "1:664017014883:web:43151d2f1869ed6edc2856"
  }

initializeApp(firebaseConfig);

  var trainData = firebase.database();


// 2. Populate Firebase Database with initial data (in this case, I did this via Firebase GUI)
// 3. Button for adding trains
$("#add-train-btn").on("click", function(event) {

  event.preventDefault();

  //takes users input
  var trainName = $("#train-name-input").val().trim();

  var destination = $("#destination-input").val().trim();

  var firstTrain = $("#first-train-input").val().trim();

  var frequency = $("#frequency-input").val().trim();
  
  // Creates local "temporary" object for holding train data
var newTrain = {
  name: trainName,
  destination: destination,
  firstTrain: firstTrain,
  frequency: frequency
}

//Uploads train data to the firebase database.
trainData.ref().push(newTrain);

//Train data being logged into the console.
console.log(newTrain.name);
console.log(newTrain.destination);
console.log(newTrain.firstTrain);
console.log(newTrain.frequency);

alert("Train Added");

//clears the text boxes.
$("#train-name-input").val("");
$("#destination-input").val("");
$("#first-train-input").val("");
$("#frequency-input").val("");

});
//4.Create Firebase event for adding trains to the database and a row in the html when a user adds an entry.
trainData.ref().on("child_added", function(childSnapshot, prevChildkey) {
  console.log(childSnapshot.val());

  //Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFirstTrain = childSnapshot.val().firstTrain;
  var tFrequency = childSnapshot.val().frequency;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tArrival;
  var tMinutes;

  // If the first train is later than the current time, sent arrival to the first train time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } 
  else {
     // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    //To calculate the arrival time, add the tMinutes to the current time.
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  //Add each train's data into the table
  $("#train-table > tbody").append($("<tr>").append(
    $("<td>").text(tName),
    $("<td>").text(tDestination),
    $("<td>").text(tFrequency),
    $("<td>").text(tArrival),
    $("<td>").text(tMinutes)
  ));


});



