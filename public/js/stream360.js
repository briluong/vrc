/**
 * Created by MichaelWang on 2018-08-01.
 */
AFRAME.registerComponent('arrow-key-rotation', {
    schema: {
        enabled: {default: true},
        dx: {default: 2.0},
        dy: {default: 2.0},
    },
    init: function () {
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.directionX = 0;
        this.directionY = 0;
    },
    play: function () {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    },
    pause: function () {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    },
    onKeyDown: function (evt) {
        switch (evt.keyCode) {
            case 37: this.directionX = 1; break;
            case 38: this.directionY = 1; break;
            case 39: this.directionX = -1; break;
            case 40: this.directionY = -1; break;
        }
    },
    onKeyUp: function (evt) {
        switch (evt.keyCode) {
            case 37: this.directionX = 0; break;
            case 38: this.directionY = 0; break;
            case 39: this.directionX = 0; break;
            case 40: this.directionY = 0; break;
        }
    },
    tick: function (t, dt) {
        if (!this.data.enabled) { return; }
        var rotation = this.el.getAttribute('rotation');
        if (!rotation) { return; }
        if (this.directionX || this.directionY) {
            rotation.x += this.data.dx * this.directionY;
            rotation.y += this.data.dy * this.directionX;
            this.el.setAttribute('rotation', rotation);
        }
    }
});

AFRAME.registerComponent('play-on-vrdisplayactivate-or-enter-vr', {
    init: function () {
        this.playVideo = this.playVideo.bind(this);
        this.playVideoNextTick = this.playVideoNextTick.bind(this);
    },
    play: function () {
        window.addEventListener('vrdisplayactivate', this.playVideo);
        this.el.sceneEl.addEventListener('enter-vr', this.playVideoNextTick);
    },
    pause: function () {
        this.el.sceneEl.removeEventListener('enter-vr', this.playVideoNextTick);
        window.removeEventListener('vrdisplayactivate', this.playVideo);
    },
    playVideoNextTick: function () {
        setTimeout(this.playVideo);
    },
    playVideo: function () {
        var video = this.el.components.material.material.map.image;
        if (!video) { return; }
        video.play();
    }
});
