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
        col: 10,
        row: 10,

        width: 500,
        height: 380,

        canvas: null,
        ctx: null
    };

    /**
     * Called on page load - initalizes the GameOfLife board
     */
    GameOfLife.init = function () {
        this.canvas = document.getElementById("canv");
        this.ctx = this.canvas.getContext('2d');

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.drawGrid();
    };

    /**
     * 
     */
    GameOfLife.drawGrid = function () {
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

        this.ctx.strokeStyle = "#ddd";
        this.ctx.stroke();
    };

    // GameOfLife.drawCells = function () {
    //     var cellWidth = width / xCells;
    //     var cellHeight = height / yCells;
    //     ctx.fillStyle = 'white';
    //     ctx.fillRect(0, 0, cellWidth, cellHeight);
    // };

    // Event Listeners //

    // Initialize GameOfLife once the page is done loading
    window.addEventListener('load', GameOfLife.init(), false);
})();

//
// drawGrid(width, height, xCells, yCells);
// drawCells();
// ctx.strokeStyle = "#ddd";
// ctx.stroke();
//
