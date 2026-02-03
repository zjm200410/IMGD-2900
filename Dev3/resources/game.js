/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// Note name for the white keys
const noteNameWhite = ["DO","RE","MI","FA","SOL","LA","SI"];

const pianoWhite = ["l_piano_c4", "l_piano_d4", "l_piano_e4", "l_piano_f4",
                            "l_piano_g4", "l_piano_a4", "l_piano_b4", "l_piano_c5",
                            "l_piano_d5", "l_piano_e5", "l_piano_f5",
                            "l_piano_g5", "l_piano_a5", "l_piano_b5",];

const hchordWhite = ["l_hchord_c4", "l_hchord_d4", "l_hchord_e4", "l_hchord_f4",
                            "l_hchord_g4", "l_hchord_a4", "l_hchord_b4","l_hchord_c5",
                            "l_hchord_d5", "l_hchord_e5", "l_hchord_f5",
                            "l_hchord_g5", "l_hchord_a5", "l_hchord_b5"];

const xyloWhite = ["xylo_c5", "xylo_d5", "xylo_e5", "xylo_f5",
                            "xylo_g5", "xylo_a5", "xylo_b5","xylo_c6",
                            "xylo_d6", "xylo_e6", "xylo_f6",
                            "xylo_g6", "xylo_a6", "xylo_b6"];

// Note name for the black keys
const noteNameBlack = ["DO#","RE#","FA#","SOL#","LA#"];

const pianoBlack = ["l_piano_db4", "l_piano_eb4", "l_piano_gb4", "l_piano_ab4", "l_piano_bb4",
                            "l_piano_db5", "l_piano_eb5", "l_piano_gb5", "l_piano_ab5", "l_piano_bb5"];

const hchordBlack = ["l_hchord_db4", "l_hchord_eb4", "l_hchord_gb4", "l_hchord_ab4", "l_hchord_bb4",
                            "l_hchord_db5", "l_hchord_eb5", "l_hchord_gb5", "l_hchord_ab5", "l_hchord_bb5"];

const xyloBlack = ["xylo_db5", "xylo_eb5", "xylo_gb5", "xylo_ab5", "xylo_bb5",
                            "xylo_db6", "xylo_eb6", "xylo_gb6", "xylo_ab6", "xylo_bb6"];

let current = "piano";

// Label of the keys
const whiteLabel = ["Z","X","C","V","B","N","M"];
const blackLabel = ["S","D","G","H","J"];

// When the button is pressed down, the color of the button will change
const barUp = 0xADD8E6;
const barDown = 0xE1FFFF;

const paintBar = function (barTag, color) {
    for (let y = 0; y < 32; y ++) {
        for (let x = 0; x < 31; x ++) {
            if (PS.data(x, y) === barTag) {
                PS.color(x, y, color);
            }
        }
    }
};

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

    PS.gridSize(31, 32);
    PS.gridColor(0xFFFFFF);
    PS.border(PS.ALL, PS.ALL, 0);
    PS.data(PS.ALL, PS.ALL, -1);

    // The color of the white keys
    const whiteColor = [
        0xFF0000, // Red
        0xFFA500, // Orange
        0xFFD700, // Gold
        0x00FF00, // Green
        0x00FFFF, // Cyan
        0x0000FF, // Blue
        0x800080, // Purple
    ];

    // The color of the black keys
    const blackColor = [
        0xD2691E, // Chocolate Brown
        0xDAA520, // Dark Gold
        0x222222, // Black, Placeholder
        0x40E0D0, // Turquoise
        0x00BFFF, // Sky Blue
        0x8A2BE2, // Violet
    ];

    // The size of the white keys
    const whiteKeyWidth = 3;
    const whiteKeyHeight = 7;
    const keyGap = 2;

    // The size of the black keys
    const blackKeyWidth = 2;
    const blackKeyHeight = 6;

    // The size of the buttons
    const buttonWidth = 7;
    const buttonHeight = 2;
    const buttonGap = 2;

    // The keys should be at the middle
    const totalWidthKey = 7 * whiteKeyWidth + 5 * keyGap;
    let startXKey = Math.floor((31 - totalWidthKey) / 2);
    const startYKey = Math.floor((10 - whiteKeyHeight) / 2);
    let startXKeyCopy = startXKey;

    // The buttons should be at the middle
    const totalWidthButton = 3 * buttonWidth + 2 * buttonGap;
    const startXButton = Math.floor((31 - totalWidthButton) / 2);
    const startYButton = startYKey + whiteKeyHeight + 2;

    // 6 gaps between 7 white keys, MI-FA has no gap
    // 1 = normal gap, 0 = no gap
    const whiteGaps = [1, 1, 0, 1, 1, 1];

    // Every white key is 3 * 7
    for (let i = 0; i < 7; i ++) {
        const whiteX1 = startXKey; // The left part
        const whiteX2 = whiteX1 + whiteKeyWidth - 1; // The right part

        const centerX = startXKey + Math.floor(whiteKeyWidth / 2);
        const centerY = startYKey + Math.floor(whiteKeyHeight / 2);

        for (let x = whiteX1; x <= whiteX2; x ++) {
            for (let y = startYKey; y < startYKey + whiteKeyHeight; y ++) {
                PS.color(x, y, whiteColor[i]);
                PS.data(x, y, { kind: "white", index: i});
            }
        }

        if (i < 6) {
            startXKey += whiteKeyWidth + (whiteGaps[i] ? keyGap : 0);
        }
    }

    // Replace every gap with black keys
    const hasBlack = [true, true, false, true, true, true];
    for (let i = 0; i < 6; i++) {
        const gapSize = whiteGaps[i] ? keyGap : 0;
        const gapStart = startXKeyCopy + whiteKeyWidth;

        if (hasBlack[i] && gapSize > 0) {
            const blackX1 = gapStart + Math.floor((gapSize - blackKeyWidth) / 2);
            const blackX2 = blackX1 + blackKeyWidth - 1;

            for (let x = blackX1; x <= blackX2; x ++) {
                for (let y = startYKey; y < startYKey + blackKeyHeight; y ++) {
                    PS.color(x, y, blackColor[i]);
                    PS.data(x, y, { kind: "black", index: i});
                }
            }
        }

        startXKeyCopy += whiteKeyWidth + gapSize;
    }

    // Every button is 7 * 2
    const buttonTag = ["piano", "xylo", "hchord"];
    for (let i = 0; i < 3; i ++) {
        const x1 = startXButton + i * (buttonWidth + buttonGap); // The left part
        const x2 = x1 + buttonWidth - 1; // The right part

        for (let x = x1; x <= x2; x ++) {
            for (let y = startYButton; y < startYButton + buttonHeight; y ++) {
                PS.color(x, y, barUp );
                PS.data(x, y, buttonTag[i]);
            }
        }
    }

    for (let i = 0; i < 7; i ++) {
        PS.audioLoad(pianoWhite[i]);
        PS.audioLoad(hchordWhite[i]);
        PS.audioLoad(xyloWhite[i]);
    }
    for (let i = 0; i < 5; i ++) {
        PS.audioLoad(pianoBlack[i]);
        PS.audioLoad(hchordBlack[i]);
        PS.audioLoad(xyloBlack[i]);
    }

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.
    PS.statusText("Choose one of the three bars under and start!");

    // Add any other initialization code you need here.
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
    const tag = PS.data(x, y);
    if (tag === undefined || tag === -1) {
        return;
    }

    if (tag === "piano") {
        paintBar(tag, barDown);
        PS.audioPlay(pianoWhite[0]);
        current = tag;
        return;
    } else if (tag === "xylo") {
        paintBar(tag, barDown);
        PS.audioPlay(xyloWhite[0]);
        current = tag;
        return;
    } else if (tag === "hchord") {
        paintBar(tag, barDown);
        PS.audioPlay(hchordWhite[0]);
        current = tag;
        return;
    }


    const kind = tag.kind;
    const index  = tag.index;

    // Identify the musical instrument being played
    let white;
    let black;

    if (current === "piano") {
        white = pianoWhite;
        black = pianoBlack;
    }
    else if (current === "xylo") {
        white = xyloWhite;
        black = xyloBlack;
    }
    else if (current === "hchord") {
        white = hchordWhite;
        black = hchordBlack;
    }

    if (kind === "white") {
        if (index < 0 || index > 6) {
            return;
        }
        PS.audioPlay(white[index]);
        return;
    }

    if (kind === "black") {
        const blackKeyIndex = [0, 1, -1, 2, 3, 4];
        if (index < 0 || index > 5) {
            return;
        }
        const b = blackKeyIndex[index];
        if (b === -1) {
            return;
        }
        PS.audioPlay(black[b]);
    }
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
    const tag = PS.data(x, y);
    if (tag === "piano" || tag === "xylo" || tag === "hchord") {
        paintBar(tag, barUp);
    }
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
    const ch = String.fromCharCode(key).toLowerCase();

    let white = pianoWhite;
    let black = pianoBlack;

    if (current === "xylo") {
        white = xyloWhite;
        black = xyloBlack;
    } else if (current === "hchord") {
        white = hchordWhite;
        black = hchordBlack;
    } else if (current === "xylo") {
        white = xyloWhite;
        black = xyloBlack;
    }

    // White Keys
    if (ch === "z") { PS.audioPlay(white[0]); return; } // C
    if (ch === "x") { PS.audioPlay(white[1]); return; } // D
    if (ch === "c") { PS.audioPlay(white[2]); return; } // E
    if (ch === "v") { PS.audioPlay(white[3]); return; } // F
    if (ch === "b") { PS.audioPlay(white[4]); return; } // G
    if (ch === "n") { PS.audioPlay(white[5]); return; } // A
    if (ch === "m") { PS.audioPlay(white[6]); return; } // B
    if (ch === "q") { PS.audioPlay(white[7]); return; } // C
    if (ch === "w") { PS.audioPlay(white[8]); return; } // D
    if (ch === "e") { PS.audioPlay(white[9]); return; } // E
    if (ch === "r") { PS.audioPlay(white[10]); return; } // F
    if (ch === "t") { PS.audioPlay(white[11]); return; } // G
    if (ch === "y") { PS.audioPlay(white[12]); return; } // A
    if (ch === "u") { PS.audioPlay(white[13]); return; } // B

    // Black Keys
    if (ch === "s") { PS.audioPlay(black[0]); return; } // C#
    if (ch === "d") { PS.audioPlay(black[1]); return; } // D#
    if (ch === "g") { PS.audioPlay(black[2]); return; } // F#
    if (ch === "h") { PS.audioPlay(black[3]); return; } // G#
    if (ch === "j") { PS.audioPlay(black[4]); return; } // A#
    if (ch === "2") { PS.audioPlay(black[5]); return; } // C#
    if (ch === "3") { PS.audioPlay(black[6]); return; } // D#
    if (ch === "5") { PS.audioPlay(black[7]); return; } // F#
    if (ch === "6") { PS.audioPlay(black[8]); return; } // G#
    if (ch === "7") { PS.audioPlay(black[9]); return; } // A#
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

