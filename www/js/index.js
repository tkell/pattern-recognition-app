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

function toggleSettings() {
    if (settingsStatus) {
        $(".settings").fadeTo(750, 0.0, function () {
            $(".settings").css("visibility", "hidden");
            settingsStatus = false;
        });
        
    } else {
        $(".settings").css("visibility", "visible");
        $(".settings").fadeTo(750, 1.0);
        settingsStatus = true;
    }
}

function toggleSettingsMode() {
    if (captureStatus) {
        captureStatus = false;
        $(".pre-capture").css("display", "block");
        $(".post-capture").css("display", "none");
    } else {
        captureStatus = true;
        $(".pre-capture").css("display", "none");
        $(".post-capture").css("display", "block");

    }
}

function captureImage() {
    console.log("well, this is going to do a lot");
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
        $(".listening").css("display", "none"); // maaybneee?

        // apply functions to the two buttons
        // that's the logo button and the capture image button, for now
        $(".logo-image").on( "tap", function(event) {
            toggleSettings();
        });

        $(".capture-button").on( "tap", function(event) {
            captureImage();
            toggleSettingsMode();
        });
  
    },

};
