/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var settingsStatus = false;
var captureStatus = false;

var buttonData = [];
var paper;

// Test image input
function loadDummyImage() {
    var screensize = {x: 868, y: 512};
    var c = paper.image("img/traffic_test.jpg", 0, 0, screensize.x, screensize.y);
}


function prepButtonData() {
    cleanedButtonData = [];
    for (var i = 0; i < buttonData.length; i++) {
        cleanButton = {};
        keys = Object.keys(buttonData[i]);
        for (var j = 0; j < keys.length; j++) {
            if (keys[j] != 'button') {
                cleanButton[keys[j]] = buttonData[i][keys[j]];
            }
        }
        cleanedButtonData.push(cleanButton);
    } 

    // Manual adventure slider, for now
    var adventureVal = 1;
    return {'buttons': cleanedButtonData, 'adventure': adventureVal};
}

function sendDataToServer() {
    // Remove the tap to make a buttn
    $("svg").unbind("tap");

    var url = "http://quiet-wildwood-4860.herokuapp.com/analysis";
    preppedButtonData = prepButtonData();

    var body = JSON.stringify(preppedButtonData);
    console.log('button data prepared');
    var req = new XMLHttpRequest();
    if ('withCredentials' in req) {
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    console.log('req state is 4', req);
                    if (req.status == 0 || req.status >= 200) {
                        var jsonRes = JSON.parse(req.responseText);
                        $(".about-button").text(jsonRes["result"]);

                        //applyKnownMapping(jsonRes['mapping']);
                        //drawConnectingLines();
                        //drawAnnotations(jsonRes['mapping']);
                        //applyButtonDrawings();
                    } else {
                        $(".about-button").text("ERROR");
                        console.log('Response returned with non-OK status');
                    }
                }
            };
        req.send(body);
    }
}


function createLocation(e) {
    var location = {'x': e.pageX, 'y': e.pageY};

    var lineSize = 10;
    var line1 = paper.path(["M", location.x - lineSize, location.y, "L", location.x + lineSize, location.y]);
    line1.attr("stroke", "#90EE90");
    var line2 = paper.path(["M", location.x, location.y - lineSize, "L", location.x, location.y + lineSize]);
    line2.attr("stroke", "#90EE90");

    var circle = paper.circle(location.x, location.y, 5);
    circle.attr("stroke", "#90EE90");

    pathString = "M" + location.x + "," + location.y + "L" + location.x + "," + location.y;
    line1.animate({"path": pathString}, 315);
    line2.animate({"path": pathString}, 315);

    // we may do more here, eventually, in terms of grabbing colour / estimating shape, etc
    buttonData.push({'location': location});
}



 function openSettings() {
        $(".settings").css("visibility", "visible");
        $(".settings").fadeTo(750, 1.0);
        settingsStatus = true;
 }

 function closeSettings() {
    $(".settings").fadeTo(750, 0.0, function () {
        $(".settings").css("visibility", "hidden");
        settingsStatus = false;
    });
 }

function toggleSettings() {
    if (settingsStatus) {
        closeSettings();
    } else {
        openSettings();
    }
}

function toggleSettingsMode() {
    if (captureStatus) {
        captureStatus = false;
        $(".pre-capture").css("display", "block");
        $(".post-capture").css("display", "none");
        $(".logo").css("left", "105px");
    } else {
        captureStatus = true;
        $(".pre-capture").css("display", "none");
        $(".post-capture").css("display", "block");
        $(".logo").css("left", "80px");
    }
}

function captureImage() {
    closeSettings();  // Unsure if this is the desired behavior
    $(".title").fadeTo(750, 0.0);
    $(".capture").fadeTo(750, 0.0);
    // remove title and capture functions
    $(".capture-button").unbind( "tap");
    $(".capture").css("display", "none");
    $(".title").css("display", "none");

    loadDummyImage();
}

function activateManualMode() {
    console.log('Actvating manual button selection...');
    $(".title").css("left", "80px");
    $(".title").text("tap image to set button locations");

    $("svg").on( "tap", function(e) {
        createLocation(e);
    });

    $(".title").fadeTo(750, 1.0, function () {
        $(".title").fadeTo(3000, 0.0, function() {
            $(".title").css("display", "none");
        });
    });

    $(".send").css("display", "block");
    $(".send").fadeTo(750, 1.0);
    $(".send").on( "tap", function(e) {
        sendDataToServer();
    });
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'

    onDeviceReady: function() {
        $(".listening").css("display", "none"); // Trying to get rid of the weird Loading thing...

        var screensize = {x: 868, y: 512};
        paper = Raphael(0, 0, screensize.x, screensize.y);
        console.log('init');

        // apply functions to the two buttons
        // that's the logo button and the capture image button, for now
        $(".logo-image").on( "tap", function(event) {
            toggleSettings();
        });

        $(".capture-button").on( "tap", function(event) {
            captureImage();
            toggleSettingsMode();
        });

        $(".manual-button").on( "tap", function(event) {
            activateManualMode();
        });
  
    },

};
