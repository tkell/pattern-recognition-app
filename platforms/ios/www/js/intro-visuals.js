// Functions for opening screen flair



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
    if (openingVisuals == true) {
        drawCircles(points);
    }
}

function drawCircles(points) {
    circles = [];
    for (var i = 0; i < points.length; i++) { 
        point = points[i];
        var circle = paper.circle(point.x, point.y, 10);
        circle.attr("stroke", "#FFFFFF");
        circle.attr("fill", "#FFFFFF");
        circle.attr("fill", "#FFFFFF");
        circle.attr("opacity", 0);
        circles.push(circle);
    }
    if (openingVisuals == true) {
        fadeCirclesIn(points, circles, 0);
    }
}

function fadeCirclesIn(points, circles, i) {
    if (i == circles.length) {
        if (openingVisuals == true) {
            drawLines(points);
        }
        return;
    } else {
        fadeTime = getRandomInt(700, 800);
        circles[i].animate({opacity: 1.0}, fadeTime, function () {
            fadeCirclesIn(points, circles, i + 1);
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

    if (openingVisuals == true) {
        animateLines(points, lines, 0);
    }
}

function animateLines(points, lines, i) {
    if (i == lines.length) {
        if (openingVisuals == true) {
            fadeLinesOut(points, lines);
        }
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
        
        drawTime = parseInt(dist / 2.0);
        circles[i].animate({opacity : 0}, drawTime * 3, function() {
            this.remove()
        });

        lines[i].animate({path: ['M', p1.x, p1.y, 'L', p2.x, p2.y]}, drawTime, function () {
            animateLines(points, lines, i + 1);
        });
    }
}

function fadeLinesOut(points, lines) {
    for (var i = 0; i < lines.length; i++) {
        lines[i].animate({opacity : 0}, 500, function() {
            this.remove();
        });
    }
    if (openingVisuals == true) {
        drawCenterLines(points);
    }
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
    if (openingVisuals == true) {
        drawOpeningFlair();
    }
}