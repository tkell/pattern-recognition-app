
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Functions for opening screen flair:

function fadeCirclesIn(points, circles, i) {
    if (i == circles.length) {
        console.log(points);
        drawLines(points);
        return;
    } else {
        fadeTime = getRandomInt(700, 800);
        circles[i].animate({opacity: 1.0}, fadeTime, function () {
            fadeCirclesIn(points, circles, i + 1);
        });
    }
}

function drawCircles(points) {
    circles = [];
    for (var i = 0; i < points.length; i++) { 
        point = points[i];
        var circle = paper.circle(point.x, point.y, 2);
        circle.attr("stroke", "#FFFFFF");
        circle.attr("fill", "#FFFFFF");
        circle.attr("fill", "#FFFFFF");
        circle.attr("opacity", 0);
        circles.push(circle);
    }
    fadeCirclesIn(points, circles, 0);
}


function animateLines(points, lines, i) {
    if (i == lines.length) {
        fadeLinesOut(points, lines);
        return;
    } else {

        p1 = points[i];
        if (i != points.length - 1) {
            p2 = points[i + 1];
        } else {
            p2 = points[0];
        }
        // will need to pick a speed and calculate time here
        dist = Math.pow(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2), 0.5)
        
        drawTime = parseInt(dist / 1.1);
        circles[i].animate({opacity : 0}, drawTime * 3, function() {
            this.remove()
        });

        lines[i].animate({path: ['M', p1.x, p1.y, 'L', p2.x, p2.y]}, drawTime, function () {
            animateLines(points, lines, i + 1);
        });
    }
}

function drawLines(points) {
    lines = [];
    for (var i = 0; i < points.length; i++) { 
        p1 = points[i];
        if (i != points.length - 1) {
            p2 = points[i + 1];
        } else {
            p2 = points[0];
        }
        var line = paper.path(['M', p1.x, p1.y, 'L', p1.x, p1.y]);
        line.attr("stroke", "#FFFFFF");
        lines.push(line);
    }

    animateLines(points, lines, 0);
}


function fadeLinesOut(points, lines) {
    for (var i = 0; i < lines.length; i++) {
        lines[i].animate({opacity : 0}, 500, function() {
            this.remove();
        });
    }
    drawCenterLines(points);
}

function drawCenterLines(points) {
    mean = {x: 0, y: 0};
    for (var i = 0; i < points.length; i++) {
        mean.x = mean.x + points[i].x;
        mean.y = mean.y + points[i].y;
    }
    mean.x = parseInt(mean.x / points.length);
    mean.y = parseInt(mean.y / points.length);


    lines = [];
    for (var i = 0; i < points.length; i++) {
        p1 = points[i];
        var line = paper.path(['M', mean.x, mean.y, 'L', p1.x, p1.y]);
        line.attr("stroke", "#FFFFFF");
        line.attr("opacity", 0);
        lines.push(line)
    }

    for (var i = 0; i < lines.length; i++) {
        lines[i].animate({opacity: 1.0}, 250, function() {
            this.animate({opacity : 0}, 750, function() {
                this.remove();});
        });
    }

    // Loooooop!
    drawOpeningFlair();
}

function drawOpeningFlair() {
    numPoints = getRandomInt(4, 10);
    points = [];

    xGrid = getRandomInt(6, 12);
    yGrid = getRandomInt(8, 16);

    for (var i = 0; i < numPoints; i++) {
        xVal = parseInt(width / xGrid) * getRandomInt(1, xGrid - 1);
        yVal = parseInt(width / yGrid) * getRandomInt(1, yGrid - 1);
        point = {x:  xVal, y:  yVal};
        points.push(point);
    }
    drawCircles(points);
}

// Functions for button visuals:
function drawConnectingLines() {
    var allLines = [];
    for (var i = 0; i < buttonData.length; i++) {
        var x1 = buttonData[i].location.x;
        var y1 = buttonData[i].location.y;

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