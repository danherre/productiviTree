// necessary variables for keeping track of times
let working = false;
let timerInitiated = false;
let worktime = 25;
let resttime = 5;
let changingSetting = false;
let pausing = false;
startBtnString = "<button onClick='startPauseBtn()' style='background: url(" + "../static/images/start-button.png" + "); background-size: 80px auto;'></button>";
pauseBtnString = "<button onClick='startPauseBtn()' style='background: url(" + "../static/images/pause-button.png" + "); background-size: 80px auto;'></button>";
stopBtnString = "<button onClick='stopTimes()' style='background: url(" + "../static/images/stop-button.png" + "); background-size: 80px auto;'></button>";
settingsString = "<p id='settings-btn'><button onClick='changeSettings()' style='background: url(" + "../static/images/settings-button.png" + "); background-size: 80px auto;'></button></p>";

//necessary for keeping track of money/happiness/plant evolution
const CAN_COST = 10;
const SUN_COST = 20;
const FERT_COST = 30;
let money = 25;
let happiness = 0;
let numPlants = 0;
let nameDoesExist = false;
let loginNotified = false;
let plantString = "";

//necessary for music and cat purring audios
let radioIsOn = false;
let music = new Audio('../static/audio/clair_de_lune.mp3'); https://www.youtube.com/watch?v=NTfeMhyyy5o
music.loop = true;
let catPurring = false;
let purring = new Audio('../static/audio/cat_purr.mp3'); // https://www.youtube.com/watch?v=2Ckbk_flMhQ

// Necessary variables for opening instructions modal
let instrModal = document.getElementById("instr-modal"); // Get the modal
let instrBtn = document.getElementById("instr-button"); // Get the button that opens the modal
let instrCloseSpan = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

let username = "";
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDBOF4gfXkEjhXN7x4hMaipv-G02PPgsa8",
    authDomain: "productivity-fd14a.firebaseapp.com",
    databaseURL: "https://productivity-fd14a.firebaseio.com",
    projectId: "productivity-fd14a",
    storageBucket: "productivity-fd14a.appspot.com",
    messagingSenderId: "667038018522",
    appId: "1:667038018522:web:811be8765f48dc1f11eee3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// console.log("THIS IS DATABASE", database);

window.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("username")) {
        username = document.getElementById("username").value;
    }
    nameDoesExist = (document.getElementById("name_exists").value == 'True');
    if (nameDoesExist) {
        firebase.database().ref('/users/' + username).once('value').then((snapshot) => {
            let user_info = snapshot.val();
            happiness = parseInt(user_info['happiness']);
            money = parseInt(user_info['money']);
            numPlants = parseInt(user_info['numPlants']);
            updateDisplay();
        });
    }
    else openInstr();
}, false);

let evolution = 1; // Just for debugging, can be deleted later

// Function which manages the start and pause button
function startPauseBtn() {
    if (!nameDoesExist && !loginNotified) {
        loginNotified = true;
        alert("Warning: You are not logged in so your plant growing progress will not be saved!");
    }
    else if (!timerInitiated) {
        setTimes();
    }
    else if (!pausing) {
        document.getElementById("start-pause-btn").innerHTML = startBtnString;
        pausing = true;
    }
    else {
        document.getElementById("start-pause-btn").innerHTML = pauseBtnString;
        pausing = false;
    }
}

// Function for when user wants to change settings
function changeSettings() {
    if (working) {
        alert("You can only change settings when you're not working!");
    }
    else {
        changingSetting = true;
        divString1 = "<div id='leftcontent' style='margin-top: 15px'>";
        divString2 = "</div><div id='buttons' style='margin-top: 15px'>";
        divString3 = "</div>";
        workTimeForm = "Input work time: <form><input type='text' id='input-work-time' value='" + worktime + "'></form>"
        restTimeForm = "Input rest time: <form><input type='text' id='input-rest-time' value='" + resttime + "'></form>"
        saveButton = "<p id='save-btn'><button onClick='saveSettings()' style='background: url(" + "../static/images/save-button.png" + "); background-size: 80px auto;'></button></p>";
        closeButton = "<p id='close-btn'><button onClick='closeSettings()' style='background: url(" + "../static/images/close-button.png" + "); background-size: 80px auto;'></button></p>";
        document.getElementById("visible").innerHTML = divString1 + workTimeForm + restTimeForm + divString2 + saveButton + closeButton + divString3;
    }
}

// Save settings
function saveSettings() {

    // input error checking
    let worktimeInput = document.getElementById("input-work-time");
    let resttimeInput = document.getElementById("input-rest-time");
    worktimeInput = parseFloat(worktimeInput.value);
    resttimeInput = parseFloat(resttimeInput.value);

    // no input or float value
    // amount of time is too large or too small
    if (!worktimeInput || !resttimeInput || worktimeInput % 1 != 0 || resttimeInput % 1 != 0 ||
        worktimeInput < 1 || worktimeInput > 240 || resttimeInput < 1 || resttimeInput > 240) {
        alert("Please enter integer value from 1 to 240!");
    }
    else {
        // Changing the worktime and resttime variables
        worktime = worktimeInput;
        resttime = resttimeInput;
        closeSettings();
    }
}

// Close settings
function closeSettings() {
    // If there is a timer running already, make sure the returned timer shows that
    // Else, show the new selected work time
    buttonString = "";
    if (pausing) {
        buttonString = startBtnString;
    }
    else {
        buttonString = pauseBtnString;
    }
    leftContentString1 = "<div id='leftcontent'><p id='mins' class='times'>";
    leftContentString2 = "m </p><p id='secs' class='times'>";
    leftContentString3 = "s </p><h2 id='end'>";
    buttonsString1 = "</h2></div><div id='buttons'>" + settingsString;
    buttonsString2 = "<p id='start-pause-btn'>";
    buttonsString3 = "</button></p><p id='stop-btn'>" + stopBtnString + "</button></p></div>";
    if (working) timerMessage = "Working";
    else timerMessage = "Enjoy your break";
    if (timerInitiated) {
        document.getElementById("visible").innerHTML = leftContentString1 + minutes + leftContentString2 + seconds + leftContentString3 + timerMessage + buttonsString1 + buttonsString2 + buttonString + buttonsString3;
    }
    else {
        buttonString = startBtnString;
        document.getElementById("visible").innerHTML = leftContentString1 + worktime + leftContentString2 + "0" + leftContentString3 + buttonsString1 + buttonsString2 + buttonString + buttonsString3;
    }
    changingSetting = false;
}

// Function to run when start is hit
function setTimes() {

    working = true;
    timerInitiated = true;
    // Retrieval and manipulation of minute data
    var timeleft = worktime;
    timeleft = timeleft * 60;
    document.getElementById("start-pause-btn").innerHTML = pauseBtnString;
    document.getElementById("end").innerHTML = "Working";

    timerInterval = setInterval(function () {

        // Calculating the minutes and seconds left
        minutes = Math.floor(timeleft / 60);
        seconds = timeleft % 60;

        // Result is output to the specific element and change button text
        if (!changingSetting && !pausing) {
            document.getElementById("mins").innerHTML = minutes + "m ";
            document.getElementById("secs").innerHTML = seconds + "s ";
        }

        if (!pausing) {
            timeleft -= 1;
        }

        // Change between break and work when timeleft is < 0
        // Also gives money reward when work is finished - added later
        if (timeleft < 0) {
            if (working) {
                working = false;
                timeleft = resttime * 60;
                if (!changingSetting) {
                    document.getElementById("end").innerHTML = "Enjoy your break";
                }
                // Give reward and update display:
                money += worktime;
                updateDisplay();
            }
            else {
                working = true;
                timeleft = worktime * 60;
                if (!changingSetting) {
                    document.getElementById("end").innerHTML = "Working";
                }
            }
        }
    }, 1000);
}

// Function to run when stop is hit
function stopTimes() {
    if (timerInitiated) {
        clearInterval(timerInterval);
        document.getElementById("mins").innerHTML = worktime + "m ";
        document.getElementById("secs").innerHTML = "0s ";
        document.getElementById("end").innerHTML = "";
        document.getElementById("start-pause-btn").innerHTML = startBtnString;
        working = false;
        timerInitiated = false;
        pausing = false;
    }
}

//Here down is logic for growing the plant and keeping track of money / happiness


// This should be called any time the amount of money changes
function updateDisplay() {

    //update fertilizer opacity
    if (money < FERT_COST) {
        document.getElementById("fertilizer").style.opacity = "0.25";
        document.getElementById("cost-fert").style.color = "#b5b5b5";
    }
    else {
        document.getElementById("fertilizer").style.removeProperty('opacity');
        document.getElementById("cost-fert").style.removeProperty('color');
    }

    //update sun opacity
    if (money < SUN_COST) {
        document.getElementById("sun").style.opacity = "0.25";
        document.getElementById("cost-sun").style.color = "#b5b5b5";
    }
    else {
        document.getElementById("sun").style.removeProperty('opacity');
        document.getElementById("cost-sun").style.removeProperty('color');
    }

    //update watering can opacity
    if (money < CAN_COST) {
        document.getElementById("watering-can").style.opacity = "0.25";
        document.getElementById("cost-can").style.color = "#b5b5b5";
    }
    else {
        document.getElementById("watering-can").style.removeProperty('opacity');
        document.getElementById("cost-can").style.removeProperty('color');
    }

    //update plant evolution
    if (happiness < 100) {
        evolution = 1;
        document.getElementById("plant1").style.display = "block";
        document.getElementById("plant2").style.display = "none";
        document.getElementById("plant3").style.display = "none";
    }
    else if (happiness < 200) {
        evolution = 2;
        document.getElementById("plant1").style.display = "none";
        document.getElementById("plant3").style.display = "none";
        document.getElementById("plant2").style.display = "block";
    }
    else if (happiness < 300) {
        evolution = 3;
        document.getElementById("plant1").style.display = "none";
        document.getElementById("plant2").style.display = "none";
        document.getElementById("plant3").style.display = "block";
    }
    else {
        numPlants += 1;
        happiness -= 300;
        evolution = 1;
        document.getElementById("plant1").style.display = "block";
        document.getElementById("plant2").style.display = "none";
        document.getElementById("plant3").style.display = "none";
        //TODO: Display updated numPlants
        //TODO: Congratulate them?
    }

    //update happiness meter
    if (happiness % 100 < 10) document.getElementById("happy-bar").src = "../static/images/0-points.PNG";
    else if (happiness % 100 < 20) document.getElementById("happy-bar").src = "../static/images/10-points.PNG";
    else if (happiness % 100 < 30) document.getElementById("happy-bar").src = "../static/images/20-points.PNG";
    else if (happiness % 100 < 40) document.getElementById("happy-bar").src = "../static/images/30-points.PNG";
    else if (happiness % 100 < 50) document.getElementById("happy-bar").src = "../static/images/40-points.PNG";
    else if (happiness % 100 < 60) document.getElementById("happy-bar").src = "../static/images/50-points.PNG";
    else if (happiness % 100 < 70) document.getElementById("happy-bar").src = "../static/images/60-points.PNG";
    else if (happiness % 100 < 80) document.getElementById("happy-bar").src = "../static/images/70-points.PNG";
    else if (happiness % 100 < 90) document.getElementById("happy-bar").src = "../static/images/80-points.PNG";
    else if (happiness % 100 < 100) document.getElementById("happy-bar").src = "../static/images/90-points.PNG";

    console.log("Amount of money: ", money);
    console.log("Total happiness: ", happiness);
    console.log("Plant evolution: ", evolution);
    console.log("Number of plants: ", numPlants);

    document.getElementById('money').innerHTML = money;
    if (numPlants == 1) plantString = " plant ";
    else plantString = " plants ";
    document.getElementById('numPlants').innerHTML = numPlants + plantString;
    console.log("money");
    if (nameDoesExist) {
        firebase.database().ref('/users/' + username + '/money').set(money);
        firebase.database().ref('/users/' + username + '/happiness').set(happiness);
        firebase.database().ref('/users/' + username + '/numPlants').set(numPlants);
    }
}

function giveWater() {
    console.log("GIVING WATER", money);
    if (money >= 10) {
        money -= 10;
        happiness += 10;
        updateDisplay();
    }
}

function giveSun() {
    if (money >= 20) {
        money -= 20;
        happiness += 30;
        updateDisplay();
    }
}

function giveFert() {
    if (money >= 30) {
        money -= 30;
        happiness += 50;
        updateDisplay();
    }
}

function startRadio() {
    if (!radioIsOn && !catPurring) {
        console.log("play")
        music.play();
        radioIsOn = true;
    }
    else {
        console.log("stop")
        music.pause();
        music.currentTime = 0;
        radioIsOn = false;
    }
}

function purr() {
    if (!catPurring && !radioIsOn) {
        console.log("purr")
        purring.play();
        catPurring = true;
    }
    else {
        console.log("stop purr")
        purring.pause();
        purring.currentTime = 0;
        catPurring = false;
    }
}

// When the user clicks on the button, open the modal
function openInstr() {
    instrModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
instrCloseSpan.onclick = function () {
    instrModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == instrModal) {
        instrModal.style.display = "none";
    }
}
