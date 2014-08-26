



// Functions for opening screen flair:
function drawOpeningFlair() {
    var allLines = [];

    // fauxData = [{x: 25, y: 25}, {x: 50, y: 25}, {x: 25, y: 50}, {x: 50, y: 50}];
    fauxData = makeLine();

    paths = [
        ["M", 0, 0, "L", 0, 0 ],
        ["M", width, 0, "L", width, 0 ],
        ["M", 0, height, "L", 0, height],
        ["M", width, height, "L", width, height]
    ]
    path_index = Math.floor(Math.random() * 3);

    for (var i = 0; i < fauxData.length; i++) {
            if (i < fauxData.length - 1) {
                x1 = fauxData[i].x;
                y1 = fauxData[i].y;
                x2 = fauxData[i + 1].x;
                y2 = fauxData[i + 1].y;
            } else {
                x1 = fauxData[i].x;
                y1 = fauxData[i].y;
                x2 = fauxData[0].x;
                y2 = fauxData[0].y;
            }

            var line = paper.path(["M", x1, y1, "L", x2, y2 ]);
            line.attr("stroke", "#FFFFFF");
            line.attr("opacity", 0);
            allLines.push(line);
    }

    for (var i = 0; i < allLines.length; i++) {
        allLines[i].animate({opacity: 0.95}, 1500, function() {
            this.animate({opacity: 0, path: paths[path_index]}, 1000, function() {
                this.remove();
                });
            });
    }
}

// Functions for button visuals:
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
                this.remove();});
        });
    }
}

// may need to add a touchup function here to turn notes off...
function drawConnectionsFromButton(button) {
    var x1 = button.location.x;
    var y1 = button.location.y;
    var allLines = [];

    for (var i = 0; i < buttonData.length; i++) {
        var x2 = buttonData[i].location.x;
        var y2= buttonData[i].location.y;

        var line = paper.path( ["M", x1, y1, "L", x2, y2 ] );
        line.attr("stroke", "#FFFFFF");
        allLines.push(line);
    }

    for (var i = 0; i < allLines.length; i++) {
        allLines[i].animate({opacity: 0}, 500, function() {this.remove()});
    }
}

function applyButtonDrawings() {
    for (var i = 0; i < buttonData.length; i++) {
        var drawClick = partial(drawConnectionsFromButton, buttonData[i]);
        buttonData[i].button.node.addEventListener('touchstart', drawClick);
    }
}

function animateButtonSuccess() {
    for (var i = 0; i < buttonData.length; i++) {
        buttonData[i].button.animate({"fill": "#00FF00"}, 1500);
        buttonData[i].button.animate({"fill-opacity": 0.1}, 1500);
        buttonData[i].button.animate({"fill": "#FFFFFF"}, 4500);
    }
}