# 3NeVis: A 3D Network Visualization Tool 

This is a simple tool Visualization environment for plotting networks inside 3 Dimensions. It uses [Three.js](https://threejs.org/). 
You will have to prepare your network similar to the example in `assets/network/`. 
The directory structure should be 

```
/your-net/  
    nodes.txt  
    edgelist.txt  
    info.json
    edges/  
        0,1.txt  
        2,4.txt  
        ...
        

```
* __nodes.txt:__ should contain all 3D locations of nodes.
* __edges.txt:__ edge list (numbers correspond to rows in nodes.txt starting from 0, e.g "10 2" means the node in the 11th row in nodes.txt has a link with the 3nd node).
* __edges__: folder with filenames corresponding to the edges in edge list (e.g. "10 2" --> "10,2.txt"). Each of its files should contain a set of 3D points along the edge, from the starting point to the finish. The number of points along each edge can be arbitrary and different for each edge. The program interpolates the points and generates smooth curve. 

## How to Run
simply serve it as a static webpage. On Linux or Mac simply run the run.sh (it just calls `python SimpleHTTPServer`). Then go to localhost:8000 inside your browser. You can also specify a port like `./run.sh 8001`. On Windows too, if you have python, either type the command or execute `run.bat`. 

__Pro:__ It's all client-side javascript! Most of the required packages are included in the source files.  
__Con:__ It's all client-side javascript. So you can't easily upload an external directory. Yes, I could have made it such that the whole network would be a single JSON file... but the having directories was easier for my actual project. Anyhow, feel free to modify to your heart's content!  


### Load test network
Use The menu on the left to load you network directory. Prepare your network like the sample directory `assets/network/test/`. The text box "Network Name" should contain the path of your network's directory inside `assets/network/` (for example typing "test" in the textbox means your network directory is `assets/network/test`). Then click the "Viz" button to load the network. 

## Visualization options
Play with the options in the menu on the right. You can change colors, sizes and the level of details of the nodes and edges, as well as edge cross-section (check out edgeStarriness). Some options like "grow" and camera>follow only work if you select an edge by clicking on it. 

You can also hide an element by first clicking on it and then clicking on the button in the menu on the left in front of "Click to hide:". The text on the button tells you which node or link you've clicked on. 

The "conflicts" menu is another feature that I need for my project, but which you may skip. It's too long to explain, I'll just skip it. 


## File preparation.
See the files in asset/network/test/
Default assumes that all text files use a single space as the delimiter, but you can easily change that. 

## Download obj file
Click on the hyperlink on top of the menu on the left and eneter desired name for the obj file in the box that appears. 


## Structure of code
Check out the index.html to see which files are loaded. There is a short description about what each script does in index.html. The main file for the menus and visualization is a file inside `src/js/visualization`. It's called vis-conf-1.js in this version, but the other `vis[...].js` files should work too. The directory `src/js/vendor/` contains third party packages such as three.js and JQuery. `src/js/classes` contains the network classes for nodes and links and convenience functions for creating them and adding them to the scene. Explore the rest for yourself. The directory structure should be self-explanatory. There is a lot of old junk in the network class which I will clean up (eventually...) 



