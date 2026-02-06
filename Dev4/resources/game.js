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

    let selectedBottle = null;
    let keyE = false;
    let keyF = false;

    function drawBottle(outerX, outerY, width, height, capacity, name) {

    const bottleColor = 0x303030;
    const insideColor = 0xFFFFFF;

    // The area inside the bottle
    const innerXLeft = outerX + 1;
    const innerXRight = outerX + width - 2;
    const innerYTop = outerY + 1;
    const innerYBottom = outerY + height - 2;

    // Draw the outer bottle
    for (let i = outerX; i < outerX + width; i ++) {
        for (let j = outerY; j < outerY + height; j++) {
            const isLeftWall = (i === outerX);
            const isRightWall = (i === outerX + width -1);
            const isBottomWall = (j === outerY + height -1);
            const isTopWall = (j === outerY);
            // This is a bottle with an opening at the top.
            const isWall = (isLeftWall || isRightWall || isBottomWall) && !isTopWall;

            if (isWall) {
                PS.color(i, j, bottleColor);
                PS.data(i, j, {kind: "wall", bottle: name});
            }
        }
    }

    // Draw the inner bottle
    for (let i = innerXLeft; i <= innerXRight; i ++) {
        for (let j = innerYTop; j <= innerYBottom; j ++) {
            PS.color(i, j, insideColor);

            const waterLevel = innerYBottom - j;

            if (waterLevel >= 0 && waterLevel < capacity) {
                PS.data(i, j, {kind: "water", bottle: name, level: waterLevel});
            } else {
                // This is the Top Wall, which is not water level.
                PS.data(i, j, {kind: "empty", bottle: name});
            }
        }
    }
}

    const bottleState = {
        A: {capacity: 10, amount: 0},
        B: {capacity: 6, amount: 0}
    }

    const waterColor = 0x4AA3FF;
    const emptyColor = 0xFFFFFF;

    // Renders the water inside a bottle based on its current amount.
    function renderBottle(name){
        const amount = bottleState[name].amount;
        for (let x = 0; x < 20; x ++) {
            for (let y = 0; y < 20; y ++) {
                const data = PS.data(x, y);

            if (data && data.kind === "water" && data.bottle === name) {
                if (data.level < amount) {
                    PS.color(x, y, waterColor);
                } else {
                    PS.color(x, y, emptyColor);
                }
            }
        }
    }
}

    // Transfers as much water as possible from one bottle to another.
    function pour(fromName, toName) {
        const from = bottleState[fromName];
        const to = bottleState[toName];

        const space = to.capacity - to.amount;
        if (space <= 0 || from.amount <= 0) {
            return;
        }
        const move = Math.min(from.amount, space);

        from.amount -= move;
        to.amount += move;

        renderBottle(fromName);
        renderBottle(toName);
        checkWin();
    }

    // Fills a bottle to its maximum capacity.
    function fillBottle(name) {
        bottleState[name].amount = bottleState[name].capacity;
        renderBottle(name);
        checkWin();
    }

    // Empties all water from a bottle.
    function emptyBottle(name) {
        bottleState[name].amount = 0;
        renderBottle(name);
        checkWin();
    }

    function bottleAt(x, y) {
        const data = PS.data(x, y);
        if (data && data.bottle) {
            return data.bottle;
        }
        return null;
    }

    let hasWon = false;
    // Check if players solve the puzzle.
    function checkWin() {
        if (hasWon) {
            return;
        }

        // 4L of water, 2 pixel for 1L
        if (bottleState.A.amount === 8) {
            hasWon = true;
            onWin();
            return true;
        }
        return false;
    }

    function onWin() {
        PS.statusText("You did it, didn't you?");
        PS.audioPlay("fx_tada");
    }

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

    PS.gridSize(20, 20);
    PS.gridColor(0xFFFFFF);
    PS.border(PS.ALL, PS.ALL, 0);
    PS.data(PS.ALL, PS.ALL, -1);

    drawBottle(3, 4, 5, 12, 10, "A");
    drawBottle(12, 8, 5, 8, 6, "B");

    bottleState.A.amount = 0;
    bottleState.B.amount = 0;
    renderBottle("A");
    renderBottle("B");

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText( "Can you measure out 4 liters of water?" );

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
    const hit = bottleAt(x, y);

    if (!hit) {
        // click water bottle + air == waste water
        if (selectedBottle !== null) {
            emptyBottle(selectedBottle);
            selectedBottle = null;
            PS.statusText( "Please cherish water resources." );
            return;
        }
        selectedBottle = null;
        return;
    }

    // F + click == fill
    if (keyF) {
        fillBottle(hit);
        selectedBottle = null;
        PS.statusText( "Well done. A full bottle. Now empty it." );
        return;
    }

    // E + click == empty
    if (keyE) {
        emptyBottle(hit);
        selectedBottle = null;
        PS.statusText( "Never cry over spilled water." );
        return;
    }

    // just click == pour
    if (selectedBottle === null) {
        selectedBottle = hit;
        return;
    }

    if (selectedBottle === hit) {
        selectedBottle = null;
        return;
    }

    pour(selectedBottle, hit);
    if (!hasWon) {
        PS.statusText("That didn't help much, did it?");
    }
    selectedBottle = null;
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
    const ch = String.fromCharCode(key).toLowerCase();
    if (ch === "e") {
        keyE = true;
        return;
    }

    if (ch === "f") {
        keyF = true;
        return;
    }
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
    const ch = String.fromCharCode(key).toLowerCase();
    if (ch === "e") {
        keyE = false;
        return;
    }

    if (ch === "f") {
        keyF = false;
        return;
    }
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

