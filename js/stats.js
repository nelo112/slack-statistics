// token to access the API
var slackToken = ""; // add token for own use

function data(token, query, index) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://slack.com/api/search.messages?token=" + token + "&query=" + query + "&pretty=1", true); // make GET request
    xhr.send();

    // when state change -> do processRequest
    xhr.addEventListener("readystatechange", processRequest, false);

    // checks if readyState equals 4 and status equals 200, search Google for more info
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText); // parse response
            config.data.datasets[0].data[index] = response.messages.total; // set data in graph array to API data
            config.data.labels[index] = query; // add label in graph array, corresponding to data
            dataChart.update(); // update the graph
        }
    };
};

// data(token, label, index);
// your label is the same as the word you want to track
data(slackToken, "label1", 0);
data(slackToken, "label2", 1);
data(slackToken, "label3", 2);
data(slackToken, "label4", 3);
data(slackToken, "label5", 4);

// global graph settings
Chart.defaults.global.responsive = true; // responsive chart
Chart.defaults.global.defaultFontColor = '#E05038'; // font colour
Chart.defaults.global.maintainAspectRatio = true; // maintains aspect ratio
Chart.defaults.bar.scaleBeginAtZero = true; // graph starts from zero

// get element with id = "counter"
var bar = document.getElementById("counter").getContext("2d");

var counterData = {
    labels: [], // values from the calls "data(token, query, index)", line 25 - 29
    datasets: [{
        label: "Used in last 10k messages",
        fillColor: "#E05038",
        data: [] // value from API
    }]
};

// graph config
var config = {
    type: 'horizontalBar',
    data: counterData
};

// define our graph
var dataChart = new Chart(bar, config);

// update the graph
dataChart.update();
