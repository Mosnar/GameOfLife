/**
 * Created by Ransom on 3/21/16.
 */
/**
 * @title GameOfLife JS for Asymmetrik
 * @author Ransom Roberson (ransomr@vt.edu)
 * @date 2016.03.18
 */
(function () {
    var GameOfLife = {
        col: 20,
        row: 20,

        width: 500,
        height: 380,

        canvas: null,
        ctx: null,

        running: false,

        config: {
            drawGrid: true,
            colorGrid: '#ddd',
            colorCell: '#fff',
            speed: 500
        },

        helpers: {},
        eventHandlers: {},

        data: []
    };

    /**
     * Called on page load - initializes the GameOfLife board
     */
    GameOfLife.init = function () {
        this.helpers.parent = this;
        // Get reference to DOM element and a 2d canvas
        this.canvas = document.getElementById("canv");
        this.ctx = this.canvas.getContext('2d');
        this.$btnStep = document.getElementById("btnStep");
        this.$btnPlay = document.getElementById("btnPlay");

        // Get the latest dimensions of the canvas element
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Render the grid
        this.drawGrid();

        // Initialize 2D array of data
        for (var x = 0; x < this.col; x++) {
            this.data[x] = [];
            for (var y = 0; y < this.row; y++) {
                this.data[x][y] = 0;
            }
        }

        // Render canvas
        this.drawCells();

        // Attach event listeners to canvas
        // When you click the canvas, spawn a cell
        this.canvas.addEventListener('click', this.eventHandlers.mouseClick.bind(this), true);
        // When the "Step" button is clicked, go to next iteration
        this.$btnStep.addEventListener('click', this.eventHandlers.stepClick.bind(this), true);
        // When the play button is clicked...
        this.$btnPlay.addEventListener('click', this.eventHandlers.playClick.bind(this), true);
    };

    /**
     * Run next iteration ad draw
     */
    GameOfLife.stepAndRender = function() {
        this.logicalStep();
        this.clear();
        this.drawCells();
        if (this.running) {
            setTimeout(function () {
                GameOfLife.stepAndRender();
            }, this.config.speed);
        }
    };

    GameOfLife.loadData = function () {
        // TODO:
    };

    GameOfLife.exportData = function () {
        // TODO:
    };

    /**
     * Render a grid
     */
    GameOfLife.drawGrid = function () {
        if (!this.config.drawGrid) return;
        var dim = this.helpers.getCellDimensions();

        for (var x = dim.w; x < this.width; x += dim.w) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.width);
        }

        for (var y = dim.h; y < this.height; y += dim.h) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }

        this.ctx.strokeStyle = this.config.colorGrid;
        this.ctx.stroke();
    };

    /**
     * Activate a cell on the board
     * @param cell
     */
    GameOfLife.activateCell = function (cell) {
        // Return early if possible
        if(this.data[cell.x][cell.y] === 1) return;
        this.data[cell.x][cell.y] = 1;

        // Clear the grid and re-render the cells
        this.clear();
        this.drawCells();
    };

    /**
     *
     * @param cell
     */
    GameOfLife.deactivateCell = function (cell) {
        // Return early if possible
        if(!this.data[cell.x][cell.y]) return;
        this.data[cell.x][cell.y] = 0;

        // Clear the grid and re-render the cells
        this.clear();
        this.drawCells();
    };

    /**
     * Gets all activated neighbor cells surrounding a cell
     * @param cell
     * @returns {Array}
     */
    GameOfLife.getCellNeighbors = function(cell) {
        var neighbors = [];

        var tempX, tempY, tempCell;
        // Check all 8 bordering cells for occupancy
        for (var i = -1; i <= 1 ; i++) {
            for (var j = -1; j <= 1; j++) {
                // Skip origin cell
                if (i == 0 && j == 0) continue;
                tempX = cell.x + i;
                tempY = cell.y + j;
                tempCell = {x: tempX, y: tempY};
                // If the cell is in the bounds of the canvas and it's activated, add it to result set
                if (this.helpers.isCellValid(tempCell) && this.data[tempCell.x][tempCell.y] === 1) {
                    neighbors.push(tempCell);
                }
            }
        }
        return neighbors;
    };

    /**
     * Checks if a cell is within the bounds of the map
     * @param cell
     * @returns {boolean}
     */
    GameOfLife.helpers.isCellValid = function(cell) {
        if (cell.x < 0 || cell.y < 0) return false;
        if (cell.x >= this.parent.col || cell.y >= this.parent.row) return false;
        return true;
    };

    /**
     * Draws a cell on the canvas
     * @param cell {{x: number, y: number}}
     */
    GameOfLife.renderCell = function (cell) {
        var dim = this.helpers.getCellDimensions();

        var x = dim.w * cell.x;
        var y = dim.h * cell.y;

        this.ctx.fillStyle = this.config.colorCell;
        this.ctx.fillRect(x, y, dim.w, dim.h);
    };


    GameOfLife.drawCells = function () {
        for (var c = 0; c < this.col; c++) {
            for (var r = 0; r < this.row; r++) {
                if(this.data[c][r] === 1) {
                    this.renderCell({x: c, y: r});
                }
            }
        }
    };

    /**
     * Actual game of life code. Updates the array. Note the use of a buffer array. I had considered creating a better
     * defined "Cell" object with an update state to avoid this, but decided against it in exchange for simplicity.
     */
    GameOfLife.logicalStep = function () {
        /*
         Game of Life Rules
         Source: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
         1) Any live cell with fewer than two live neighbours dies, as if caused by under-population.
         2) Any live cell with two or three live neighbours lives on to the next generation.
         3) Any live cell with more than three live neighbours dies, as if by over-population.
         4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
         */

        var neighbors, tempCell;
        var tempArray = this.data.map(function(arr) {
            return arr.slice();
        });

        for (var x = 0; x < this.col; x++) {
            for (var y = 0; y < this.row; y++) {
                tempCell = {x: x, y: y};
                neighbors = this.getCellNeighbors(tempCell);
                // Live cell rules:
                if (this.data[x][y] === 1) {
                    if (neighbors.length < 2) {
                        tempArray[x][y] = 0;
                        // console.log("Killing [<2]", tempCell);
                    }
                    if (neighbors.length > 3) {
                        tempArray[x][y] = 0;
                        // console.log("Killing [>3]", tempCell);
                    }
                // Dead cell rules:
                } else {
                    if (neighbors.length == 3) {
                        // console.log("Spawning [=3]", tempCell);
                        tempArray[x][y] = 1;
                    }
                }

            }
        }
        this.data = tempArray;
    };

    /**
     * Clear the canvas
     */
    GameOfLife.clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
    };

    /**
     * MouseMove handler - unused in this version
     * @param pos
     */
    GameOfLife.handleMouseMove = function (pos) {
        this.activateCell(pos);
    };

    /**
     * Mouse click handler
     * @param pos
     */
    GameOfLife.handleMouseClick = function (pos) {
        this.activateCell(pos);
    };

    GameOfLife.eventHandlers.mouseMove = function (evt) {
        this.handleMouseMove(this.helpers.translateMousePos(this.helpers.getRelativeMousePos(evt)));
    };

    GameOfLife.eventHandlers.mouseClick = function (evt) {
        this.handleMouseClick(this.helpers.translateMousePos(this.helpers.getRelativeMousePos(evt)));
    };

    /**
     * Called when the step button is clicked - moves one cycle forward
     * @param evt
     * @returns {boolean}
     */
    GameOfLife.eventHandlers.stepClick = function (evt) {
        this.stepAndRender();
        evt.preventDefault();
        return false;
    };

    /**
     * Plays/Pauses the simulation
     * @param evt
     * @returns {boolean}
     */
    GameOfLife.eventHandlers.playClick = function (evt) {
        if (this.running) {
            this.running = false;
            this.$btnPlay.innerText = "Play";
            this.$btnStep.removeAttribute('disabled');
        } else {
            this.running = true;
            this.$btnPlay.innerText = "Pause";
            this.$btnStep.setAttribute('disabled', 'true');
            this.stepAndRender();
        }
        evt.preventDefault();
        return false;
    };

    /**
     * Computes and returns the relative mouse position with the top-left being 0,0
     * @param evt
     * @returns {{x: number, y: number}}
     */
    GameOfLife.helpers.getRelativeMousePos = function (evt) {
        var rect = this.parent.canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        return {x: x, y: y};
    };

    /**
     * Calculates the size of each cell based on config and canvas size
     * @returns {{w: number, h: number}}
     */
    GameOfLife.helpers.getCellDimensions = function () {
        var cellWidth = this.parent.width / this.parent.col;
        var cellHeight = this.parent.height / this.parent.row;
        return {w: cellWidth, h: cellHeight};
    };

    /**
     * Translates relative mouse coordinates into cell coordinates
     * @param pos {{x: number, y: number}}
     * @returns {{x: number, y: number}}
     */
    GameOfLife.helpers.translateMousePos = function (pos) {
        // Get the width and height of each individual cell
        var cellDim = this.getCellDimensions();
        // Calculate the cell from the grid based on x,y coords
        var xPos = Math.floor(pos.x / cellDim.h);
        var yPos = Math.floor(pos.y / cellDim.w);
        return {x: xPos, y: yPos};
    };


    // Initialize GameOfLife once the page is done loading
    window.addEventListener('load', GameOfLife.init(), false);
})();
