// necessary variables for keeping track of times
let working = false;
let timerInitiated = false;
let worktime = 25;
let resttime = 5;
let changingSetting = false;
let pausing = false;
document.getElementById("mins").innerHTML = worktime + "m ";

// Function which manages the start and pause button
function startPauseBtn() {
    if (!timerInitiated) {
        console.log("START TIMER");
        setTimes();
    }
    else if (!pausing) {
        console.log("PAUSE");
        document.getElementById("start-pause-btn").innerHTML = "<img src='../static/images/start-button.png' class='btn-img'>";
        pausing = true;
    }
    else {
        console.log("RESUME");
        document.getElementById("start-pause-btn").innerHTML = "<img src='../static/images/pause-button.png' class='btn-img'>";
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
        divString1 = "<div id='leftcontent'>";
        divString2 = "</div><div id='buttons'>";
        divString3 = "</div>";
        workTimeForm = "Input work time: <form><input type='text' id='input-work-time' value='" + worktime + "'></form>"
        restTimeForm = "Input rest time: <form><input type='text' id='input-rest-time' value='" + resttime + "'></form>"
        saveButton = "<p><button onClick='saveSettings()' id='save-btn'><img src='../static/images/save-button.png' class='btn-img'></button></p>"
        closeButton = "<p><button onClick='closeSettings()' id='close-btn'><img src='../static/images/close-button.png' class='btn-img'></button></p>"
        document.getElementById("visible").innerHTML = divString1 + workTimeForm + restTimeForm + divString2 + saveButton + closeButton + divString3;
    }
}

// Save settings
function saveSettings() {
    // Changing the worktime and resttime variables
    worktime = document.getElementById("input-work-time");
    worktime = parseInt(worktime.value);
    resttime = document.getElementById("input-rest-time");
    resttime = parseInt(resttime.value);

    closeSettings();
}

// Close settings
function closeSettings() {
    // If there is a timer running already, make sure the returned timer shows that
    // Else, show the new selected work time
    buttonString = "";
    if (pausing) {
        buttonString = "<img src='../static/images/start-button.png' class='btn-img'>";
    }
    else {
        buttonString = "<img src='../static/images/pause-button.png' class='btn-img'>";
    }
    leftContentString1 = "<div id='leftcontent'><p id='mins' class='times'>";
    leftContentString2 = "m </p><p id='secs' class='times'>";
    leftContentString3 = "s </p><h2 id='end'></h2></div>";
    buttonsString1 = "<div id='buttons'><p><button onClick='changeSettings()' id='settings-btn'><img src='../static/images/settings-button.png' class='btn-img'></button></p>";
    buttonsString2 = "<p><button onClick='startPauseBtn()' id='start-pause-btn'>";
    buttonsString3 = "</button></p><p><button onClick='stopTimes()' id='stop-btn'><img src='../static/images/stop-button.png' class='btn-img'></button></p></div>";
    if (timerInitiated) {
        document.getElementById("visible").innerHTML = leftContentString1 + minutes + leftContentString2 + seconds + leftContentString3 + buttonsString1 + buttonsString2 + buttonString + buttonsString3;
    }
    else {
        buttonString = "<img src='../static/images/start-button.png' class='btn-img'>";
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
    document.getElementById("start-pause-btn").innerHTML = "<img src='../static/images/pause-button.png' class='btn-img'>";
    document.getElementById("end").innerHTML = "Working";

    timerInterval = setInterval(function() {
    
        // Calculating the minutes and seconds left
        minutes = Math.floor(timeleft / 60);
        seconds = timeleft % 60;
            
        // Result is output to the specific element and change button text
        if (!changingSetting) {
            document.getElementById("mins").innerHTML = minutes + "m ";
            document.getElementById("secs").innerHTML = seconds + "s ";
        }
        
        if (!pausing) {
            timeleft -= 1;
        }

        // Change between break and work when timeleft is < 0
        if (timeleft < 0) {
            if (working) {
                working = false;
                timeleft = resttime * 60;
                if (!changingSetting) {
                    document.getElementById("end").innerHTML = "Enjoy your break";
                }
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
        document.getElementById("start-pause-btn").innerHTML = "<img src='../static/images/start-button.png' class='btn-img'>";
        working = false;
        timerInitiated = false;
        pausing = false;
    }
}