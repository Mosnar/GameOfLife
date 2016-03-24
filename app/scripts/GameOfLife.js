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
        col: 5,
        row: 5,

        width: 500,
        height: 380,

        canvas: null,
        ctx: null,

        config: {
            drawGrid: true,
            colorGrid: '#ddd',
            colorCell: '#fff'
        },

        helpers: {},
        eventHandlers: {},

        data: []
    };

    /**
     * Called on page load - initalizes the GameOfLife board
     */
    GameOfLife.init = function () {
        this.helpers.parent = this;
        // Get reference to DOM element and a 2d canvas
        this.canvas = document.getElementById("canv");
        this.ctx = this.canvas.getContext('2d');

        // Get the latest dimensions of the canvas element
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Render the grid
        this.drawGrid();

        // Initialize 2D array of data
        for (var c = 0; c < this.col; c++) {
            this.data[c] = [];
            for (var r = 0; r < this.row; r++) {
                this.data[c][r] = 0;
            }
        }

        console.log("Initialized data", this.data);

        this.drawCells();

        // Attach event listeners to canvas
        // this.canvas.addEventListener('mousemove', this.eventHandlers.mouseMove.bind(this), true);
        this.canvas.addEventListener('click', this.eventHandlers.mouseClick.bind(this), true);
    };

    GameOfLife.loadData = function () {

    };

    GameOfLife.exportData = function () {

    };

    /**
     * Render a grid
     */
    GameOfLife.drawGrid = function () {
        if (!this.config.drawGrid) return;
        var cellWidth = this.width / this.col;
        var cellHeight = this.height / this.row;

        for (var x = cellWidth; x < this.width; x += cellWidth) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.width);
        }

        for (var y = cellHeight; y < this.height; y += cellHeight) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }

        this.ctx.strokeStyle = this.config.colorGrid;
        this.ctx.stroke();
    };

    /**
     *
     * @param cell
     */
    GameOfLife.activateCell = function (cell) {
        // Return early if possible
        if(this.data[cell.x][cell.y] === 1) return;
        this.data[cell.x][cell.y] = 1;

        this.getCellNeighbors(cell);

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

    GameOfLife.clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
    };

    GameOfLife.handleMouseMove = function (pos) {
        this.activateCell(pos);
    };

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
