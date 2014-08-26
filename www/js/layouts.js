function makeLine() {
    startingPoint = {x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height)};
    length = Math.floor(Math.random() * 7) + 3;
    spacing = Math.floor(Math.random() * 50) + 10;
    buttonRadius = {x: Math.floor(Math.random() * 15) + 10, y: Math.floor(Math.random() * 15) + 10};
    angle = 0;

    buttons = [];
    for (var i = 0; i < length; i++) {
        var x = Math.floor(Math.cos(angle) * (i * (spacing + 2 * buttonRadius.x))) + startingPoint.x;
        var y = Math.floor(Math.sin(angle) * (i * (spacing + 2 * buttonRadius.y))) + startingPoint.y;
        var location = {x: x, y: y};
        buttons.push(location);
    } 
    return buttons
}