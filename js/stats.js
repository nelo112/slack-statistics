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
    return new Promise(function(resolve, reject) { // Returning a promise!
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
                reject({ok: false, error: "Invalid request"})
        };

        xhr.send();
        /*
        * Changed to a load listener in order to not have to check for ready state
        */
        xhr.addEventListener("load", processRequest, false); // when state change -> do processRequest

        function processRequest(e) {
            // No need to check readyState now
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText); // parse response
                if (!response.ok) {
                    reject(response); //Slack returns its error message with a 200 code
                    return;
                }
                switch (proc) {
                    case "teamName":
                        teamName = response.team.name;
                        resolve(); //Resolve promise
                        break;
                    case "todayCount":
                        todayCount = response.messages.total;
                        resolve(); //Resolve promise
                        break;
                    case "yesterdayCount":
                        yesterdayCount = response.messages.total;
                        resolve(); //Resolve promise
                        break;
                    case "userList":
                        if (response.members[index].is_bot || response.members[index].profile.real_name != "slackbot") {
                            userList.push(response.members[index].profile.real_name);
                            userMessages.push("from:" + response.members[index].name);
                            resolve(); //Resolve promise
                        } else {
                            resolve(); //Resolve promise
                            return undefined;
                        };
                        break;
                    default:
                        reject({ok: false, error: "Invalid request"}); // Error on request and reject promise
                };
            } else {
                reject({ok: false, error: "Invalid response", code: xhr.status}); //Error on response type and reject promise
            }
        };
    });
};

function percentage() {
    var difference = todayCount - yesterdayCount;
    var percentage = Math.round(difference / Number(yesterdayCount) * 100);
    diffPercentage = percentage;
};

// TODO: Remove setTimeout, make use of promises instead
// setTimeout is very unreliable (time to wait for API to finish isn't constant)!

function getData() {
    // Chain all the requests and console.log caught errors
    data(null, "info", "teamName")
    .then( () => data(todayQuery, "search", "todayCount") )
    .then( () => data(yesterdayQuery, "search", "yesterdayCount") )
    .then( () => percentage() )
    .then( () => postToHTML() )
    .catch( error => console.log(error) )
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
// All promises are now resolved in the getData function
