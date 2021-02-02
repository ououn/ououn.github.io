function displayNextImage() {
    x = (x === imageInfo.length - 1) ? 0 : x + 1;
    document.getElementById("auto_change").src = imageInfo[x];
}

function displayPreviousImage() {
    x = (x <= 0) ? imageInfo.length - 1 : x - 1;
    document.getElementById("auto_change").src = imageInfo[x];
}

function startTimer() {
    setInterval(displayNextImage, 5000);
}

function open_currentAuto() {
    document.getElementById("auto_change").setAttribute("data-fresco-group", entryList[x]);
}

var stopTime;
var nothing = 0;
var imageInfo = [], x = -1;
imageInfo[0] = "../images/minecraft/model/01/00_thumb/raid_dervish_01.jpg";
imageInfo[1] = "../images/minecraft/model/01/00_thumb/raid_skytouched_shaman_01.jpg";
imageInfo[2] = "../images/minecraft/model/01/00_thumb/raid_vilespawn_01.jpg";
imageInfo[3] = "../images/minecraft/model/01/00_thumb/raid_harvest_jack_01.jpg";

var entryList = [
    "raid_01",
    "raid_02",
    "raid_03",
    "raid_05"
];