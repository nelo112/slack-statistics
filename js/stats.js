// Slack Word Statistics -- Settings
var slackToken = ""; // add token as string for own use
var paidPlan = true; // set to true if your team pays for Slack
var horizontalBar = true; // set to false if you want vertical bars
var labels = ["example1", "example2"]; // labels used by Slack Word Statistics

// Chart.js Graphs -- Settings
Chart.defaults.global.responsive = true; // responsive chart
Chart.defaults.global.defaultFontColor = '#E05038'; // font colour
Chart.defaults.global.maintainAspectRatio = true; // maintains aspect ratio
Chart.defaults.bar.scaleBeginAtZero = true; // graph starts from zero

function data(query, index) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://slack.com/api/search.messages?token=" + slackToken + "&query=" + query + "&pretty=1", true); // make GET request
    xhr.send();

    // when state change -> do processRequest
    xhr.addEventListener("readystatechange", processRequest, false);

    // checks if readyState equals 4 and status equals 200, search online for more info
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText); // parse response
            config.data.datasets[0].data[index] = response.messages.total; // set data in graph array to API data
            config.data.labels[index] = query; // add label in graph array, corresponding to data
            dataChart.update(); // update the graph
        }
    };
};

// function will run through all labels and make data() function calls
function callData(array) {
    var i = 0;
    while (i < array.length) {
        data(array[i], i);
        i++;
    }
};

// function returns correct description for graph
function getDescription() {
    if (paidPlan) {
        return "Usage in all messages"
    } else {
        return "Usage in last 10k messages"
    }
};

// function returns correct bar type
function getBarType() {
    if (horizontalBar) {
        return "horizontalBar"
    } else {
        return "bar"
    }
};

// get element with id = "counter"
var bar = document.getElementById("counter").getContext("2d");
var counterData = {
    labels: [], // values from the labels array
    datasets: [{
        label: getDescription(),
        fillColor: "#E05038",
        data: [] // value from API
    }]
};

// graph config -- see global settings
var config = {
    type: getBarType(),
    data: counterData
};

// make function call with "labels" array as parameter
callData(labels);

// define our graph
var dataChart = new Chart(bar, config);

// update the graph
dataChart.update();
