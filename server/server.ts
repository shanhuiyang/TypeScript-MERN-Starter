import errorHandler from "errorhandler";

import app from "./app";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get("server_port"), () => {
    console.log(
        "  App is running at %s:%d in %s mode",
        app.get("origin_uri"),
        app.get("server_port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;
