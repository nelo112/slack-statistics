// Slack Statistics
// Settings
var slackToken = "PASTE SLACK TOKEN HERE";

// Queries
var todayQuery = "on:today";
var yesterdayQuery = "on:yesterday";

// Pre-defined Variables
var users = new Array(10);
var teamName, todayCount, yesterdayCount, diffPercentage;

// Data Function
function data(query, type, proc) {
    var xhr = new XMLHttpRequest();
    switch (type) {
        case "search":
            xhr.open("GET", "https://slack.com/api/search.messages?token=" + slackToken + "&query=" + query, true); // make GET request
            break;
        case "users":
            xhr.open("GET", "https://slack.com/api/users.list?token=" + slackToken, true);
            break;
        case "info":
            xhr.open("GET", "https://slack.com/api/team.info?token=" + slackToken, true);
            break;
        default:
            return "Error: no match";
    };

    xhr.send();
    xhr.addEventListener("readystatechange", processRequest, false); // when state change -> do processRequest

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText); // parse response
            switch (proc) {
                case "teamName":
                    teamName = response.team.name;
                    break;
                case "todayCount":
                    todayCount = response.messages.total;
                    break;
                case "yesterdayCount":
                    yesterdayCount = response.messages.total;
                    break;
                case "userList":
                    if (response.members[index].is_bot || response.members[index].profile.real_name != "slackbot") {
                        userList.push(response.members[index].profile.real_name);
                        userMessages.push("from:" + response.members[index].name);
                    } else {
                        return undefined;
                    };
                    break;
                default:
                    return "Error: no match";
            };
        };
    };
};

function percentage() {
    var difference = todayCount - yesterdayCount;
    var percentage = Math.round(difference / Number(yesterdayCount) * 100);
    diffPercentage = percentage;
};

// TODO: Remove setTimeout, make use of promises instead
// setTimeout is very unreliable (time to wait for API to finish isn't constant)!

function getData() {
    data(null, "info", "teamName");
    data(todayQuery, "search", "todayCount");
    data(yesterdayQuery, "search", "yesterdayCount");
    setTimeout(percentage, 1000); // REMOVE SETTIMEOUT
};

function postToHTML() {
    document.getElementById("title").innerHTML = 'Slack Statistics for "' + teamName + '"';
    document.getElementById("todayCounter").innerHTML = todayCount;
    document.getElementById("yesterdayCounter").innerHTML = yesterdayCount;
    if (diffPercentage >= 0) {
        document.getElementById("compare").innerHTML = "That's ~" + diffPercentage + "% messages more than yesterday!";
    } else {
        document.getElementById("compare").innerHTML = "That's ~" + Math.abs(diffPercentage) + "% messages less than yesterday!";
    };
};

getData();
setTimeout(postToHTML, 1000); // REMOVE SETTIMEOUT
