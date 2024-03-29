/**
 * Created by MichaelWang on 2018-07-11.
 */
// Authentication middleware.

function isLoggedIn(req, res, next) {
    // Continue if the user is authenticated.
    if (req.isAuthenticated()) {
        return next();
    }
    // Redirect unauthenticated users to the home page.
    res.redirect("/");
}


module.exports = {
    isLoggedIn: isLoggedIn
};
