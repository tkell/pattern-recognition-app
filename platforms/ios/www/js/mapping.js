// From http://stackoverflow.com/questions/321113/
function partial(func /*, 0..n args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}

// Mouse on / off functions:
function betterNoteClick(synth, note) {
    synth.playNote(note);
}

function betterNoteStop(synth, note) {
    synth.stopNote(note);
}

// The jQuery mobile ones are cleaner, but they don't allow multiple touches
function makeAndMap(theButton, noteFreq) {
    var mouseDownFunc = partial(betterNoteClick, synth, noteFreq);
    var mouseUpFunc = partial(betterNoteStop, synth, noteFreq);
    theButton.button.node.addEventListener('touchstart', mouseDownFunc);
    theButton.button.node.addEventListener('touchend', mouseUpFunc);
}

// Takes a list of buttonData, with mapping info, and applies it.
// This data will, 9999/10000 times, come from the server
function applyKnownMapping(returnedButtonData) {
    for (var i = 0; i < buttonData.length; i++) {
        // find the match in returnedButtonData, and map it
        for (var j = 0; j < returnedButtonData.length; j++) {
            if (buttonData[i].location.x == returnedButtonData[j].location.x && buttonData[i].location.y == returnedButtonData[j].location.y) {
                makeAndMap(buttonData[i], returnedButtonData[j].noteFreq);
                break;
            }
        }
    }
}