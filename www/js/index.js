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
var width;
var height;

var synth;

// Test image input
function loadDummyImage() {
    var dummyImagePath = "img/traffic_test.jpg";
    var c = paper.image(dummyImagePath, 0, 0, width, height);
}

function onCameraFail(e) {
    console.log('failed',e);
}

function onCameraSuccess(imageURI) {
    //var image = document.getElementById('myImage');
    //image.src = imageURI;
    var c = paper.image(imageURI, 0, 0, width, height);
}

function loadRealPicture() {
    navigator.camera.getPicture(onCameraSuccess, onCameraFail,
        {quality: 50, destinationType: Camera.DestinationType.FILE_URI });
}


function drawConnectingLines() {
    var allLines = [];
    for (var i = 0; i < buttonData.length; i++) {
        var x1 = buttonData[i].location.x;
        var y1= buttonData[i].location.y;

        for (var j = i + 1; j < buttonData.length; j++) {
            var x2 = buttonData[j].location.x;
            var y2= buttonData[j].location.y;

            var line = paper.path( ["M", x1, y1, "L", x2, y2 ] );
            line.attr("stroke", "#FFFFFF");
            line.attr("opacity", 0);
            allLines.push(line);
        }
    }
    for (var i = 0; i < allLines.length; i++) {
        allLines[i].animate({opacity: 0.95}, 1500, function() {
            this.animate({opacity : 0}, 1000, function() {
                this.remove();})
            ;});
    }
}

function animateButtonSuccess() {
    for (var i = 0; i < buttonData.length; i++) {
        buttonData[i].button.animate({"fill": "#00FF00"}, 1500);
        buttonData[i].button.animate({"fill-opacity": 0.1}, 1500);
        buttonData[i].button.animate({"fill": "#FFFFFF"}, 4500);
    }
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

    // Hard code adventure slider, for now
    var adventureVal = 1;
    return {'buttonData': cleanedButtonData, 'adventure': adventureVal};
}

function sendDataToServer() {
    // Remove the tap to make a button
    $("svg").off("touchstart");

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
                    if (req.status == 0 || (req.status >= 200 && req.status < 400)) {
                        var jsonRes = JSON.parse(req.responseText);
                        console.log("got a good result");

                        applyKnownMapping(jsonRes['mapping']);
                        console.log("mappings applied...");

                        animateButtonSuccess();
                        drawConnectingLines();
                        $(".send").fadeTo(750, 0.0);
                        $(".send").css("display", "none");

                    } else {
                        $(".send").text("error!");
                        console.log('Response returned with non-OK status');
                    }
                }
            };
        req.send(body);
    }
}


function createLocation(e) {
    var location = {'x': e.originalEvent.pageX, 'y': e.originalEvent.pageY};

    var lineSize = 75;
    var circleSize = 50;

    var line1 = paper.path(["M", location.x - lineSize, location.y, "L", location.x + lineSize, location.y]);
    line1.attr("stroke", "#90EE90");
    var line2 = paper.path(["M", location.x, location.y - lineSize, "L", location.x, location.y + lineSize]);
    line2.attr("stroke", "#90EE90");

    var circle = paper.circle(location.x, location.y, circleSize);
    circle.attr("stroke", "#90EE90");
    circle.attr("fill", "#90EE90");

    pathString = "M" + location.x + "," + location.y + "L" + location.x + "," + location.y;
    line1.animate({"path": pathString}, 315);
    line2.animate({"path": pathString}, 315);

    // we may do more here, eventually, in terms of grabbing colour / estimating shape, etc
    buttonData.push({"location": location, "button": circle});
};



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


    loadRealPicture();
    //loadDummyImage();
}

function activateManualMode() {
    console.log('Actvating manual button selection...');
    $(".title").css("left", "80px");
    $(".title").text("tap image to set button locations");
    $("svg").on("touchstart", function(e) {
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

        width = window.outerWidth;
        height = window.outerHeight;

        paper = Raphael(0, 0, width, height);

        synth = new Synth({
            context: tsw.context(),
            speakersOn: true
        });
        
        // Adjust CSS
        $(".title").css("left", width / 9);
        $(".title").css("top", height / 3);
        $(".title").css("font-size", width / 12);

        $(".capture").css("left", width / 2.6);
        $(".capture").css("top", height / 2);
        $(".capture").css("font-size", width / 24);

        $(".send").css("left", width / 2.75);
        $(".send").css("top", height / 1.15);
        $(".send").css("font-size", width / 18);

        $(".pre-capture").css("left", width / 3);
        $(".pre-capture").css("top", height / 1.1);
        $(".pre-capture").css("font-size", width / 24);

        $(".post-capture").css("left", width / 4);
        $(".post-capture").css("top", height / 1.1);
        $(".post-capture").css("font-size", width / 24);

        // apply functions to buttons
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
