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


// Via http://stackoverflow.com/questions/5073799/how-to-sort-a-javascript-array-of-objects-by-nested-object-property
var deepSort = function (prop, arr) {
    prop = prop.split('.');
    var len = prop.length;

    arr.sort(function (a, b) {
        var i = 0;
        while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    });
    return arr;
};

var scales = [
    [2, 2, 3, 2, 3],
    [2, 2, 1, 2, 2, 2, 1],
    [2, 1, 2, 2, 1, 2, 2],
    [2, 1],
    [1]
];

function freqFromMidi(note) {
    exponent = (note - 69) / 12.0;
    return Math.pow(2, exponent) * 440;
}

function applyDefaultMapping() {
    // sort!
    sortedbuttonData = buttonData;
    sortedbuttonData = deepSort('location.y', sortedbuttonData);
    sortedbuttonData = deepSort('location.x', sortedbuttonData);

    // pick a scale based on Adventure
    var theScale = scales[adventure];
    var note = 60;

    // line up the frequencies
    var frequencies = []
    frequencies.push(freqFromMidi(note))
    for (var i = 1; i < sortedbuttonData.length; i++) {
        var index = i % theScale.length
        note = note + theScale[index]
        frequencies.push(freqFromMidi(note))
    }
    
    // find the match in sortedbuttonData, and map it using the frequencies list
    for (var i = 0; i < buttonData.length; i++) {
        for (var j = 0; j < sortedbuttonData.length; j++) {
            if (buttonData[i].location.x == sortedbuttonData[j].location.x && buttonData[i].location.y == sortedbuttonData[j].location.y) {
                makeAndMap(buttonData[i], frequencies[j]);
                break;
            }
        }
    }
}