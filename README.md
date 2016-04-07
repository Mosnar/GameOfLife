# Conway's Game of Life
## Instructions
Run `npm install` and `gulp serve`

The browser should open automatically and run the application. The application will start in a paused state. Clicking
on the canvas will spawn cells. Clicking the "run" button will start the simulation.

Alternatively, you may simply open the `index.html` file in the `dist` directory. This directory was generated
with `gulp default` which copies files and minifies scripts.

#Acknowledgements and Thoughts
* No thirdparty dependencies are necessary to run the GameOfLife code (this was intentional)
* I think this would have worked well as a jQuery plugin. Definitely would have liked to isolate the code better to 
 allow for multiple concurrent instances. Currently would not work without minor alterations.
* Didn't implement any edge case logic, so right now, cells die at edge of screen.
* Some weird rendering stuff happens when you draw a cell that causes the grid to change colors. Almost seems like its not getting cleared properly. Needs further investigation. 
* Would have liked to build a speed slider. Next version?
* Most game attributes may be changed from the config variable in GameOfLife.js
* Would have liked to implement loading and saving of layouts (especially allowing for standard game of life file formats)
* Based on the [Web Starter Kit](https://github.com/google/web-starter-kit) from Google
* Built for [Asymmetrik](asymmetrik.com) interview
