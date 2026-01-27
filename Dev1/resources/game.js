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

const noteName = ["DO","RE","MI","FA","SOL","LA","SI","DO'"];

const piano = ["piano_c4", "piano_d4", "piano_e4", "piano_f4",
                        "piano_g4", "piano_a4", "piano_b4", "piano_c5"];

const hchord = ["hchord_c4", "hchord_d4", "hchord_e4", "hchord_f4",
                        "hchord_g4", "hchord_a4", "hchord_b4", "hchord_c5"];

const xylo = ["xylo_c5", "xylo_d5", "xylo_e5", "xylo_f5",
                        "xylo_g5", "xylo_a5", "xylo_b5", "xylo_c6"];

let current = piano;

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

    PS.gridSize(27, 12);
    PS.gridColor(0xFFFFFF);
    PS.border(PS.ALL, PS.ALL, 0);
    PS.data(PS.ALL, PS.ALL, -1);

    // The color of the keys
    const colors = [
        0xFF0000, // Red
        0xFFA500, // Orange
        0xFFD700, // Golden
        0x00FF00, // Green
        0x00FFFF, // Cyan
        0x0000FF, // Blue
        0x800080,  // Purple
        0xFF0000
    ];

    // The size of the keys
    const keyWidth = 2;
    const keyHeight = 6;
    const keyGap = 1;

    // The size of the buttons
    const buttonWidth = 7;
    const buttonHeight = 2;
    const buttonGap = 1;

    // The keys should be at the middle
    const totalWidthKey = 8 * keyWidth + 7 * keyGap;
    const startXKey = Math.floor((27 - totalWidthKey) / 2);
    const startYKey = Math.floor((10 - keyHeight) / 2);

    // The buttons should be at the middle
    const totalWidthButton = 3 * buttonWidth + 2 * buttonGap;
    const startXButton = Math.floor((27 - totalWidthButton) / 2);
    const startYButton = startYKey + keyHeight + 1;

    // Every key is 2 * 6
    for (let i = 0; i < 8; i ++) {
        const x1 = startXKey + i * (keyWidth + keyGap); // The left part
        const x2 = x1 + keyWidth - 1; // The right part

        for (let x = x1; x <= x2; x ++) {
            for (let y = startYKey; y < startYKey + keyHeight; y ++) {
                PS.color(x, y, colors[i]);
                PS.data(x, y, i);
            }
        }
    }

    // Every button is 7 * 2
    const buttonTag = ["piano", "xylo", "hchord"];
    for (let i = 0; i < 3; i ++) {
        const x1 = startXButton + i * (buttonWidth + buttonGap); // The left part
        const x2 = x1 + buttonWidth - 1; // The right part

        for (let x = x1; x <= x2; x ++) {
            for (let y = startYButton; y < startYButton + buttonHeight; y ++) {
                PS.color(x, y, 0xF0F8FF );
                PS.data(x, y, buttonTag[i]);
            }
        }

        const midX = Math.floor((x1 + x2) / 2);
        const midY = startYButton + Math.floor(buttonHeight / 2);
    }

    for (let i = 0; i < 8; i ++) {
        PS.audioLoad(piano[i]);
        PS.audioLoad(hchord[i]);
        PS.audioLoad(xylo[i]);
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
    if (tag === "piano" || tag === "xylo" || tag === "hchord") {
        current = tag;
        return;
    }

    const i = tag;
    if (i < 0 || i > 7) {
        return;
    }
    if (current === "piano") {
        PS.audioPlay(piano[i]);
    } else if (current === "xylo") {
        PS.audioPlay(xylo[i]);
    } else if (current === "hchord") {
        PS.audioPlay(hchord[i]);
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

