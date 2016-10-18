document.mouse = {
    x: 0,
    y: 0
};
document.touch = {
    x: 0,
    y: 0
};
events = {
    getMouse: function(e) {
        document.mouse.x = e.clientX;
        document.mouse.y = e.clientY;
    },
    
    getTouch: function(e) {
        document.touch.x = e.touches[0].clientX;
        document.touch.y = e.touches[0].clientY;
    },

    dragAround: function(id) {

        var elem = document.getElementById(id);
        var loc = elem.getBoundingClientRect();
        elem.newLoc = {
            x: loc.left,
            y: loc.top
        };
        elem.style.left = elem.newLoc.x + "px";
        elem.style.top = elem.newLoc.y + "px";
        elem.draggable = true;

        elem.ondrag = elem.ontouchmove = function(e) {
            var curX = parseInt(elem.style.left.slice(0, -2));
            var curY = parseInt(elem.style.top.slice(0, -2));
            //console.log('dragging', e.clientX, e.touches[0].clientX);
            if (e.touches){
                var left = (curX + (e.touches[0].clientX - document.touch.x)) + "px";
                var top = (curY + (e.touches[0].clientY - document.touch.y)) + "px";
                elem.newLoc = {
                    x: left,
                    y: top
                };
            }
            if (e.clientX > 0) {
                var left = (curX + (e.clientX - document.mouse.x)) + "px";
                var top = (curY + (e.clientY - document.mouse.y)) + "px";
                elem.newLoc = {
                    x: left,
                    y: top
                };
            }

        };

        elem.ondragend = elem.ontouchend =  function() {
            elem.style.left = elem.newLoc.x;
            elem.style.top = elem.newLoc.y;
        };
        

    },

};

document.addEventListener('mousedown', events.getMouse,false);
document.addEventListener('mousewheel', events.wheel, false );
document.addEventListener('touchstart', events.getTouch,false);
