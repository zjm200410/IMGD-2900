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

const soil = 0;
const tree = 1;
const fire = 2;
const water = 3;

const soilColor = 0xDAA520; // Brown
const treeColor = 0x00FF7F; // Green
const fireColor = 0xDC143C; // Red
const waterColor = 0x00FFFF; // Blue

let gameOver = false;
let fireTimer = 0;
let waterTimer = 0;
let waterUnder = {};

function setState(x, y, state) {
    PS.data(x, y, state);

    if (state === tree) {
        PS.color(x, y, treeColor);
    }
    else if (state === fire) {
        PS.color(x, y, fireColor);
    }
    else if (state === water) {
        PS.color(x, y, waterColor);
    }
    else {
        PS.color(x, y, soilColor);
    }
}

function getState(x, y) {
    return PS.data(x, y);
}

function spreadFire() {
    if (gameOver) {
        return;
    }

    let newFire = [];
    for (let x = 0; x < 30; x++) {
        for (let y = 0; y < 30; y++) {

            if (getState(x, y) === fire) {
                if (y > 0 && getState(x, y - 1) === tree) {
                    newFire.push([x, y - 1]);
                }
                if (y < 29 && getState(x, y + 1) === tree) {
                    newFire.push([x, y + 1]);
                }
                if (x > 0 && getState(x - 1, y) === tree) {
                    newFire.push([x - 1, y]);
                }
                if (x < 29 && getState(x + 1, y) === tree) {
                    newFire.push([x + 1, y]);
                }
            }
        }
    }

    for (let i = 0; i < newFire.length; i++) {
        let fx = newFire[i][0];
        let fy = newFire[i][1];
        setState(fx, fy, fire);
    }

    if (newFire.length > 0) {
        let sound = ["fx_blast1", "fx_blast2", "fx_blast3", "fx_blast4"];
        let i = Math.floor(Math.random() * 4);
        PS.audioPlay(sound[i]);
    }

    // Check Win / Lose
    let treeLeft = 0;
    let fireLeft = 0;

    for (let x = 0; x < 30; x++) {
        for (let y = 0; y < 30; y++) {
            let state = getState(x, y);
            if (state === tree) {
                treeLeft += 1;
            }
            else if (state === fire) {
                fireLeft += 1;
            }
        }
    }

    if (!gameOver && fireLeft === 0) {
        gameOver = true;
        PS.timerStop(fireTimer);
        PS.audioPlay("fx_tada");
        PS.statusText("Forest saved: (" + Math.round((treeLeft / 900) * 100) + "%)");
    }
    else if (!gameOver && treeLeft === 0) {
        gameOver = true;
        PS.timerStop(fireTimer);
        PS.statusText("The forest is gone.");
    }
}

function keyOf(x, y) {
    return x + "," + y;
}

function makeWater(cx, cy) {

    if (waterTimer !== 0) {
        PS.timerStop(waterTimer);
        clearWater();
    }

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {

            let x = cx + dx;
            let y = cy + dy;

            if (x < 0 || x >= 30 || y < 0 || y >= 30) {
                continue;
            }

            let under = getState(x, y);
            if (under === fire) {
                under = soil;
            }

            waterUnder[keyOf(x, y)] = under;
            setState(x, y, water);
        }
    }
    waterTimer = PS.timerStart(150, clearWater);
}

function clearWater() {
    for (let k in waterUnder) {
        let parts = k.split(",");
        let x = parseInt(parts[0]);
        let y = parseInt(parts[1]);

        if (getState(x, y) === water) {
            setState(x, y, waterUnder[k]);
        }
    }

    waterUnder = {};
    waterTimer = 0;
}

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

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

	PS.gridSize(30, 30);
    PS.gridColor(0xFFFFFF);
    PS.border(PS.ALL, PS.ALL, 0);
    PS.data(PS.ALL, PS.ALL, -1);

    for (let x = 0; x < 30; x++) {
        for (let y = 0; y < 30; y++) {
            setState(x, y, tree);
        }
    }

    for (let i = 0; i < 6; i++) {

        let randomX = PS.random(30) - 1;
        let randomY = PS.random(30) - 1;

        setState(randomX, randomY, fire);
    }

    fireTimer = PS.timerStart(60, spreadFire);
    PS.statusText("Put out the Fire!");

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// PS.statusText( "Game" );

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
    if (gameOver) {
        return;
    }

    let state = getState(x, y);

    if (state === fire) {
        setState(x, y, soil);
        PS.audioPlay("fx_drip2");
        makeWater(x, y);
    }
    else if (state === tree) {
        PS.audioPlay("fx_pop");
        for (let yy = 0; yy < 30; yy++) {
            if (getState(x, yy) === tree) {
                setState(x, yy, soil);
            }
        }
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

