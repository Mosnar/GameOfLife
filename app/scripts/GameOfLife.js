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

        cfgDrawGrid: true,

        helpers: {},
        eventHandlers: {}
    };

    /**
     * Called on page load - initalizes the GameOfLife board
     */
    GameOfLife.init = function () {
        this.canvas = document.getElementById("canv");
        this.ctx = this.canvas.getContext('2d');

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        if (this.cfgDrawGrid) {
            this.drawGrid();
        }

        this.drawCells();

        this.canvas.addEventListener('mousemove', this.eventHandlers.mouseMove.bind(this), true);
        this.helpers.parent = this;
        this.self = this;
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

    GameOfLife.drawCells = function () {
        var cellWidth = this.width / this.col;
        var cellHeight = this.height / this.row;
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, cellWidth, cellHeight);
    };

    GameOfLife.handleMouseMove = function(pos) {
        console.log(pos);
    };

    GameOfLife.eventHandlers.mouseMove = function (evt) {
        this.handleMouseMove(this.helpers.translateMousePos(this.helpers.getRelativeMousePos(evt)));
    };

    /**
     * Computes and returns the relative mouse position with the top-left being 0,0
     * @param evt
     * @returns {{x: number, y: number}}
     */
    GameOfLife.helpers.getRelativeMousePos = function(evt) {
        var rect = this.parent.canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        return {x: x, y: y};
    };

    /**
     * Translates relative mouse coordinates into cell coordinates
     * @param pos
     * @returns {{x: number, y: number}}
     */
    GameOfLife.helpers.translateMousePos = function(pos) {
        var cellWidth = this.parent.width / this.parent.col;
        var cellHeight = this.parent.height / this.parent.row;

        var xPos = Math.floor(pos.x / cellWidth);
        var yPos = Math.floor(pos.y / cellHeight);

        return {x: xPos, y: yPos};
    };


    // Event Listeners //
    // Initialize GameOfLife once the page is done loading
    window.addEventListener('load', GameOfLife.init(), false);
})();
