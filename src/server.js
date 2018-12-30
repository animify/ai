var io = require("socket.io")();
io.on("connection", client => {
    client.on("command", data => {
        client.broadcast.emit("command", data);
    });
});
io.listen(3000);
