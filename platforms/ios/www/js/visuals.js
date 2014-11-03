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