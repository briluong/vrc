/**
 * Created by MichaelWang on 2018-07-08.
 */
let backgroundImage = function() {
    // randomly return a background image
    var backgroundImages = ['background1.jpg', 'background2.jpg', 'background3.jpg', 'background4.jpg', 'background5.jpg']
    var i = Math.floor(Math.random() * backgroundImages.length)
    document.getElementById("backgroundPicture").src = backgroundImages[i]
}

backgroundImage()