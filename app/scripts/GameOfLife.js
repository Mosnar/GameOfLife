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

        canvas: null
    };

    GameOfLife.init = function () {
        this.canvas = document.getElementById("canv");
        console.log(this.canvas);
    };

    // Event Listeners //

    // Initialize GameOfLife once the page is done loading
    window.addEventListener('load', GameOfLife.init(), false);
    //     this.ctx = canvas.getContext("2d");
    //
    //     var width = 500;
    //     var height = 380;
    //
    //     this.setHeight = function (height) {
    //         this.height = height;
    //         return this;
    //     };
    //
    //     this.setWidth = function (width) {
    //         this.width = width;
    //         return this;
    //     };
    //
    //     this.getHeight = function () {
    //         return this.height;
    //     };
    //
    //     this.getWidth = function () {
    //         return this.width;
    //     };
    // };
})();

//
//
// var app = {
//     width: 500,
//     height: 380,
//
//     xCells: 20,
//     yCells: 20,
//
//     setWidth: function (width) {
//         this.width = width;
//     },
//
//     setHeight: function (height) {
//         this.height = height;
//     },
//
//     drawGrid: function () {
//         var cellWidth = width / xCells;
//         var cellHeight = height / yCells;
//
//         for (var x = cellWidth; x < this.width; x += cellWidth) {
//             ctx.moveTo(x, 0);
//             ctx.lineTo(x, this.width);
//         }
//
//         for (var y = cellHeight; y < this.height; y += cellHeight) {
//             ctx.moveTo(0, y);
//             ctx.lineTo(this.width, y);
//         }
//     },
//
//     drawCells: function () {
//         var cellWidth = width / xCells;
//         var cellHeight = height / yCells;
//         ctx.fillStyle = 'white';
//         ctx.fillRect(0, 0, cellWidth, cellHeight);
//     }
// };
//
// drawGrid(width, height, xCells, yCells);
// drawCells();
// ctx.strokeStyle = "#ddd";
// ctx.stroke();
//
