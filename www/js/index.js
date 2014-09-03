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

var menuStatus = false;
var captureStatus = false;
var playbackStatus = false;
var openingVisuals = true;

var fadeTime = 500;

var buttonData = [];
var adventure = 0;

var paper;
var width;
var height;

var synth;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Test image input
function loadDummyImage() {
    var dummyImagePath = "img/traffic_test.jpg";
    var c = paper.image(dummyImagePath, 0, 0, width, height);
    activateManualMode();
}

// Cancel function
function onCameraFail(e) {
    console.log('failed',e);

    if (!captureStatus) {
        paper.clear();
        openingVisuals = true;
        drawOpeningFlair();
    } else if (playbackStatus) {
        // From having an instrument made.
        closeMenu();
    } else if (captureStatus && !playbackStatus) {
        // For the capture page
        closeMenu();
    }
}

function onCameraSuccess(imageURI) {
    if (!captureStatus) {
        // From the opening page to the add buttons stage
        $(".title").css("opacity", 0.0);
        $(".title").css("visbility", "hidden");
        paper.clear();
        openingVisuals = false;

        $(".capture").fadeTo(fadeTime, 0.0);
        $(".capture-button").unbind( "tap");
        $(".capture").css("display", "none");

    } else if (playbackStatus) {
        // From having an instrument made.
        paper.clear();   
    } else if (captureStatus && !playbackStatus) {
        // From the capture page
        paper.clear();
    }

    var c = paper.image(imageURI, 0, 0, width, height);
    playbackStatus = false;
    activateManualMode();
}

// Had to remove EXIF code from CDVCamera.m, 
// in order to not get the location services pop-up.
// Explanation here:  http://stackoverflow.com/questions/17253139/how-to-remove-location-services-request-from-phonegap-ios-6-app
function loadRealPicture() {
    openingVisuals = false;
    
    navigator.camera.getPicture(onCameraSuccess, onCameraFail,
        {quality: 50, 
         destinationType: Camera.DestinationType.FILE_URI, 
         correctOrientation: true});
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

    // adventure is automatically updated via the UI
    return {'buttonData': cleanedButtonData, 'adventure': adventure};
}

function sendDataToServer() {
    // Remove the tap to make a button
    $("svg").off("touchstart");
    playbackStatus = true;

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
                    if (req.status == 0 || (req.status >= 200 && req.status < 400)) {
                        var jsonRes = JSON.parse(req.responseText);

                        applyKnownMapping(jsonRes['mapping']);

                        $(".current-mapping").text("current mapping:  " + jsonRes['result']);
                        animateButtonSuccess();
                        drawConnectingLines();
                        applyButtonDrawings();
                        $(".send").fadeTo(fadeTime, 0.0);
                        $(".send").css("visibility", "hidden");

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

 function openMenu() {
        $(".menu").css("visibility", "visible");
        $(".menu").fadeTo(fadeTime, 1.0);
        menuStatus = true;
 }

 function closeMenu() {
    $(".menu").fadeTo(fadeTime, 0.0, function () {
        $(".menu").css("visibility", "hidden");
        menuStatus = false;
    });
 }

function toggleMenu() {
    if (menuStatus) {
        closeMenu();
    } else {
        openMenu();
    }
}

function displaySettings() {
    $(".settings-fader").css("display", "block");
    $(".settings-fader").fadeTo(fadeTime, 0.5);

    // Display the settings page
    $(".title").css("visibility", "hidden");
    $(".send").css("visibility", "hidden");
    $(".capture").css("visibility", "hidden");

    $(".title").css("opacity", 0.0);
    $(".send").css("opacity", 0.0);
    $(".capture").css("opacity", 0.0);

    $(".title").css("display", "none");
    $(".send").css("display", "none");
    $(".capture").css("display", "none");

    $(".settings-page").css("display", "block");
    $(".settings-page").css("visibility", "visible");
    $(".settings-page").fadeTo(fadeTime, 1.0);

    $(".settings-button").off("tap"); 
    $(".settings-button").on( "tap", function(event) {
        hideSettings();
    }); 

    updateAdventure();
    $(".logo").css("margin-top", "65%");
}

function hideSettings() {
    // Hide the settings page
    $(".settings-page").css("visibility", "hidden");
    $(".settings-page").css("display", "none");
    $(".settings-page").css("opacity", 0.0);

    $(".settings-fader").css("opacity", 0.0);
    $(".settings-fader").css("display", "none");

    
    if (captureStatus && !playbackStatus) {
        // For the capture page
        $(".title").css("display", "block");
        $(".send").css("display", "block");
        $(".send").css("visibility", "visible");
        $(".send").fadeTo(fadeTime, 1.0);   
    } else if (!captureStatus) {
        // For the main page
        $(".title").css("display", "block");
        $(".capture").css("display", "block");

        $(".title").css("visibility", "visible");
        $(".capture").css("visibility", "visible");   

        $(".title").fadeTo(fadeTime, 1.0);       
        $(".capture").fadeTo(fadeTime, 1.0);
    }
    else if (playbackStatus) {
        // For playback
        $(".title").css("display", "block");
        $(".capture").css("display", "block");
        $(".title").css("visibility", "visible");
        $(".capture").css("visibility", "visible");         
    }


    $(".settings-button").off("tap"); 
    $(".settings-button").on( "tap", function(event) {
        displaySettings();
    }); 
    $(".logo").css("margin-top", "50%");   
}

function increaseAdventure() {
    if (adventure < 4) {
        adventure = adventure + 1;
        updateAdventure();
    }
}

function decreaseAdventure() {
    if (adventure > 0) {
        adventure = adventure - 1;
        updateAdventure();
    }
}

function updateAdventure() {

    $(".adventure-value").text(adventure + 1);
}

// Dispose of the old image, get a new one.
function getNew() {
    buttonData = [];
    captureImage();
}

function captureImage() {
    closeMenu();
    loadRealPicture();
    //loadDummyImage();
}

function activateManualMode() {
    captureStatus = true;
    $(".title").css("visibility", "visible");
    $(".title").text("tap to make buttons");
    $("svg").on("touchstart", function(e) {
        createLocation(e);
    });

    $(".title").fadeTo(fadeTime, 1.0, function () {
        $(".title").fadeTo(3000, 0.0, function() {
            $(".title").css("visibility", "hidden");
        });
    });

    $(".send").css("visibility", "visible");
    $(".send").css("display", "block");
    $(".send").fadeTo(fadeTime, 1.0);
    $(".send").on("touchstart", function(e) {
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
        width = window.outerWidth;
        height = window.outerHeight;

        // hopeful hack to prevent scrolling
        document.body.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);

        paper = Raphael(0, 0, width, height);

        synth = new Synth({
            context: tsw.context(),
            speakersOn: true
        });
        
        // Adjust CSS
        $(".title").css("font-size", width / 12);
        $(".capture").css("font-size", width / 18);
        $(".send").css("font-size", width / 18);

        $(".pre-capture").css("font-size", width / 24);
        $(".post-capture").css("font-size", width / 24);

        $(".settings-page").css("font-size", width / 24);

        $(".logo-image").on("tap", function(event) {
            toggleMenu();
        });

        $(".capture-button").on("tap", function(event) {
            captureImage();
        });

        $(".new-button").on("tap", function(event) {
            getNew();
        }); 


        $(".settings-button").on("tap", function(event) {
            displaySettings();
        });

        // Magic jQuery thing to catch elements added later
        $("body").on("tap", ".close-settings-button", function(event) {
            hideSettings();
        }); 

        $("body").on("tap", ".adventure-up", function(event) {
            increaseAdventure();
        });

        $("body").on("tap", ".adventure-down", function(event) {
            decreaseAdventure();
        });

        drawOpeningFlair();
    },

};
