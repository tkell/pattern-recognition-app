// New flair, with bad namespacing
function drawLinesAfterLoad() {
    // Loop over all button pairs, from 0,1 to -1,0, and define the lines.
    var lines = []
    for (var i = 0; i < buttonData.length; i++) {
        p1 = buttonData[i].location;
        if (i != buttonData.length - 1) {
            p2 = buttonData[i + 1].location;
        } else {
            p2 = buttonData[0].location;
        }

        var line = paper.path(['M', p1.x, p1.y, 'L', p1.x, p1.y]);
        line.attr("stroke", "#FFFFFF");
        lines.push(line);
    }
    animateLinesAfterLoad(buttonData, lines, 0);
}


function animateLinesAfterLoad(points, lines, i) {
    if (i == lines.length) {
        fadeLinesOutAfterLoad(points, lines);
        return;
    } else {
        p1 = points[i].location;
        if (i != points.length - 1) {
            p2 = points[i + 1].location;
        } else {
            p2 = points[0].location;
        }
        // will need to pick a speed and calculate time here
        dist = Math.pow(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2), 0.5)
        drawTime = parseInt(dist / 2.5);

        lines[i].animate({path: ['M', p1.x, p1.y, 'L', p2.x, p2.y]}, drawTime, function () {
            animateLinesAfterLoad(points, lines, i + 1);
        });
    }
}

function fadeLinesOutAfterLoad(points, lines) {
    for (var i = 0; i < lines.length; i++) {
        lines[i].animate({opacity : 0}, 500, function() {
            this.remove();
        });
    }
   drawCenterLinesAfterLoad(points);
}

function drawCenterLinesAfterLoad(points) {
    mean = {x: 0, y: 0};
    for (var i = 0; i < points.length; i++) {
        mean.x = mean.x + points[i].location.x;
        mean.y = mean.y + points[i].location.y;
    }
    mean.x = parseInt(mean.x / points.length);
    mean.y = parseInt(mean.y / points.length);


    centerLines = [];
    for (var i = 0; i < points.length; i++) {
        p1 = points[i].location;
        var line = paper.path(['M', mean.x, mean.y, 'L', p1.x, p1.y]);
        line.attr("stroke", "#FFFFFF");
        line.attr("opacity", 0);
        centerLines.push(line)
    }

    for (var i = 0; i < centerLines.length; i++) {
        centerLines[i].animate({opacity: 1.0}, 250, function() {
            this.animate({opacity : 0}, 750, function() {
                this.remove();});
        });
    }
}


// Functions for animations on button touch
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