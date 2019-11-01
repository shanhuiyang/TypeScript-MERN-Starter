const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(proxy("/api", { 
        target: "http://localhost:3001/",
        headers: {
            "Connection": "keep-alive"
        }
    }));
    app.use(proxy("/auth", { target: "http://localhost:3001/" }));
    app.use(proxy("/oauth2", { target: "http://localhost:3001/" }));
};