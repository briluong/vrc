AFRAME.registerComponent('edit', {

  init: function () {
    var data = this.data;
    var el = this.el;

  el.addEventListener('click', function () {
    console.log("hellllo")
    el.setAttribute('value', 'test');
  });

  }
});



AFRAME.registerComponent('button_down', {
  schema: {
    text: {default: 'Press For Help'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    el.addEventListener('mousedown', function () {
      var ui = document.querySelector('#UI');
      var button = document.querySelector('#buttonText');


      if (ui.getAttribute('visible')) {
        //console.log(ui);
        ui.setAttribute('visible', false);
        button.setAttribute('value', 'Press For Help');

      } else {
        ui.setAttribute('visible', true);
        button.setAttribute('value', 'Press To Cancel');
        //send the message here
      }

    });
  }
});

AFRAME.registerComponent('random_color', {

  init: function () {
          var el = this.el;
   var rand = Math.floor(Math.random() * Math.floor(3));
        console.log("ayyyyyy");

    console.log(rand);

    if (rand == 0) {
      el.setAttribute('color', '#ff5050');
    } else if (rand == 1) {
      el.setAttribute('color', '#6699ff');
    } else if (rand == 2) {
      el.setAttribute('color', '#33cc33');

    }
  }
});


AFRAME.registerComponent('teleport', {
  schema: {
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    var steps = document.querySelector('#steps');

    el.addEventListener('mousedown', function () {
      var player = document.querySelector('#player');
      var pos = el.getAttribute('position');

      player.setAttribute('position', pos.x + " 1.3 " + pos.z);

    });

    el.addEventListener('mouseenter', function (evt) {
      steps.setAttribute("visible", "true");
    });

    el.addEventListener('mouseleave', function (evt) {
      steps.setAttribute("visible", "false");
    });

  }
});

AFRAME.registerComponent('teleport2', {
  schema: {
    entered: {default: false}
  },

  init: function () {
    var data = this.data;
    var el = this.el;


   // var crosshair = document.querySelector('#crosshair');
    var circle = document.querySelector('#circle');

    var steps = document.querySelector('#steps');
    var target = document.querySelector('#target');


    el.addEventListener('mousedown', function () {
      var player = document.querySelector('#player');

     // player.setAttribute('position', pos.x + " 1.3 " + pos.z);

      var camera = document.querySelector('#player');
      var cameraPos = camera.getAttribute('position');
      var cameraRot = camera.object3D.getWorldDirection ();

      var mult = cameraPos.y / cameraRot.y;
      var line_rot = {
        x: cameraPos.x - cameraRot.x * mult,
        y: cameraPos.y - cameraRot.y * mult,
        z: cameraPos.z - cameraRot.z * mult
      };

      //var test = document.querySelector('#test');

      //test.setAttribute('position', line_rot);

      player.setAttribute('position', line_rot.x + " 1.3 " + line_rot.z);


    });

    el.addEventListener('mouseenter', function (evt) {
      steps.setAttribute("visible", "true");
   //   crosshair.setAttribute("visible", "true");
      circle.setAttribute("visible", "false");

      data.entered = true;
      target.setAttribute('visible', true);
    });

    el.addEventListener('mouseleave', function (evt) {
      steps.setAttribute("visible", "false");
    //  crosshair.setAttribute("visible", "false");
      circle.setAttribute("visible", "true");

      data.entered = false;
      target.setAttribute('visible', false);


    });
  },

  tick: function (time, timeDelta) {

    if (this.data.entered) {
    var target = document.querySelector('#target');

    var camera = document.querySelector('#player');
    var cameraPos = camera.getAttribute('position');
    var cameraRot = camera.object3D.getWorldDirection ();

    var mult = cameraPos.y / cameraRot.y;
    var line_rot = {
      x: cameraPos.x - cameraRot.x * mult,
      y: cameraPos.y - cameraRot.y * mult,
      z: cameraPos.z - cameraRot.z * mult
    };

    target.setAttribute('position', line_rot);
  }
  }


});



//Drawing on the Board
AFRAME.registerComponent('button_down_board', {
  schema: {
    index: {default: 0},
    doodle_index: {default: 0},
    drawing: {default: false},
    start: {default: false},
    color: {default: 'blue'},
    //counter stuff
    counter: {default: 0},
    delay: {default: 0}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    var scene = document.querySelector('a-scene');
    var cursor = document.querySelector('#cursor');

    var crosshair = document.querySelector('#crosshair');
    var circle = document.querySelector('#circle');

    var pen = document.querySelector('#pen');


    el.addEventListener('mousedown', function (evt) {
      //console.log(scene);
      data.start = true;
      data.drawing = true;
      data.index = 0;
      data.counter = 0;
    });

    el.addEventListener('mouseup', function (evt) {
      if (data.drawing) {
        data.doodle_index++;
        data.drawing = false;
        data.index = 0;
        data.counter = 0;
      }
    });

    el.addEventListener('mouseenter', function (evt) {
      crosshair.setAttribute("visible", "true");
      circle.setAttribute("visible", "false");

      pen.setAttribute("visible", "true");


    });

    el.addEventListener('mouseleave', function (evt) {
      if (data.drawing) {
        data.doodle_index++;
        data.drawing = false;
        data.index = 0;
        data.counter = 0;
      }

      crosshair.setAttribute("visible", "false");
      circle.setAttribute("visible", "true");

      pen.setAttribute("visible", "false");
    });

    el.addEventListener('change_color', function (event) {
      //console.log('Entity collided with', event.detail.collidingEntity);
      //console.log('new color: ' + event.detail.color);
      data.color = event.detail.color;
    });

    el.addEventListener('erase_toggle', function (event) {
      //console.log('Entity collided with', event.detail.collidingEntity);
      //console.log('erase_toggle');

      //console.log(scene.querySelectorAll('[index]'));
      scene.querySelectorAll('[line]').forEach(function (element) {
        element.parentNode.removeChild(element);
        //console.log(element);
      });

    });

  },

  tick: function (time, timeDelta) {

    var cursor = document.querySelector('#cursor');

    if (cursor.getAttribute("geometry")) {
      cursor.removeAttribute("geometry");
    }

    var data = this.data;

    if (data.drawing) {
      if (data.counter === data.delay) {
        data.counter = 0;
        var scene = document.querySelector('a-scene');
        var line = document.createElement('a-entity');

        line.setAttribute('networked', 'template:#doodle-template');
        line.setAttribute('id', 'doodle__' + data.doodle_index);
        line.setAttribute('class', 'eraseable');
        line.setAttribute('erase_line', 'color: red');

        //console.log(line);
        scene.appendChild(line);

        var camera = document.querySelector('#player');


        var cameraPos = camera.getAttribute('position');
        var cameraRot = camera.object3D.getWorldDirection ();

        var mult = (6.9 - cameraPos.z) / -cameraRot.z;
        var line_rot = line_rot = {
          x: cameraPos.x - cameraRot.x * mult,
          y: cameraPos.y - cameraRot.y * mult,
          z: cameraPos.z - cameraRot.z * mult
        };


        if (line_rot.x > 5) {
          line_rot.x = 5;
        } else if (line_rot.x < -5) {
          line_rot.x = -5;
        }

        if (line_rot.y > 5) {
          line_rot.y = 5;
        } else if (line_rot.y < 0) {
          line_rot.y = 0;
        }

        if (data.start) {
          //console.log(data.doodle_index);

          line.setAttribute('line', {
            start: {
              x:line_rot.x,
              y:line_rot.y,
              z:line_rot.z
            },
            end: {
              x:line_rot.x,
              y:line_rot.y,
              z:line_rot.z
            },
            color: data.color
          });

          data.start = false;
        } else {

          //TODO add a distance threshold to update to save memory
          //console.log('#doodle__' + (data.doodle_index - 1));
          var previous_doodle = document.querySelector('#doodle__' + (data.doodle_index - 1));
          var previous_line = previous_doodle.getDOMAttribute('line');
          line.setAttribute('line', {
              start: {
                x:previous_line.end.x,
                y:previous_line.end.y,
                z:previous_line.end.z
              },
              end: {
                x:line_rot.x,
                y:line_rot.y,
                z:line_rot.z
              },
              color: data.color
            }
          );
        }
        data.doodle_index++;
      } else {
        //counter
        data.counter++;
      }
    }
  },

  change_color: function (color) {
    data.color = color;
  }
});

AFRAME.registerComponent('change-color-on-hover', {
  schema: {
    color: {default: 'red'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;  // <a-box>
    var defaultColor = el.getAttribute('material').color;

    var crosshair = document.querySelector('#crosshair');
    var circle = document.querySelector('#circle');

    el.addEventListener('mouseenter', function () {
      el.setAttribute('color', data.color);

      crosshair.setAttribute("visible", "true");
      circle.setAttribute("visible", "false");
    });

    el.addEventListener('mouseleave', function () {
      el.setAttribute('color', defaultColor);

      crosshair.setAttribute("visible", "false");
      circle.setAttribute("visible", "true");
    });
  }
});

AFRAME.registerComponent('change-drawing-color', {
  schema: {
    color: {default: 'red'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    var crosshair = document.querySelector('#crosshair');
    var circle = document.querySelector('#circle');

    var paint = document.querySelector('#paint');

    el.addEventListener('mouseenter', function () {
      crosshair.setAttribute("visible", "true");
      circle.setAttribute("visible", "false");

      paint.setAttribute("visible", "true");

    });

    el.addEventListener('mouseleave', function () {
      crosshair.setAttribute("visible", "false");
      circle.setAttribute("visible", "true");

      paint.setAttribute("visible", "false");

    });

    el.addEventListener('mousedown', function () {

      var pen_color = document.querySelector('#board');
      pen_color.emit('change_color', {color: data.color}, false);

      paint.setAttribute("material", {color: data.color});
    });
  }
});

AFRAME.registerComponent('erase_toggle', {
  init: function () {
    var data = this.data;
    var el = this.el;

    var eraser = document.querySelector('#eraser');
    var crosshair = document.querySelector('#crosshair');
    var circle = document.querySelector('#circle');

    el.addEventListener('mouseenter', function () {
      crosshair.setAttribute("visible", "true");
      circle.setAttribute("visible", "false");
      eraser.setAttribute("visible", "true");

    });

    el.addEventListener('mouseleave', function () {
      crosshair.setAttribute("visible", "false");
      circle.setAttribute("visible", "true");

      eraser.setAttribute("visible", "false");

    });

    el.addEventListener('mousedown', function () {

      var board = document.querySelector('#board');

      board.emit('erase_toggle');
    });
  }
});

AFRAME.registerComponent('index', {
  schema: {
    ind: {default: 0}
  }
});

AFRAME.registerComponent('erase_line', {
  schema: {
    color: {default: 'red'}
  },
  init: function () {
    var data = this.data;
    var el = this.el;

    el.addEventListener('mouseenter', function (evt) {

      //console.log(evt.detail);

      var board = document.querySelector('#board');

      el.parentNode.removeChild(el);

    });
  }
});
