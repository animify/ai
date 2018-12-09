const peer = new Peer("app", {
    host: "localhost",
    port: 9000,
    path: "/"
});

peer.on("open", id => {
    console.log("My peer ID is: " + id);
});

peer.on("connection", conn => {
    console.log("Connected to server");

    conn.on("data", data => {
        console.log("got data", data);
    });
});

peer.on("disconnected", conn => {
    console.log("Disconnected from server");

    setTimeout(() => {
        peer.connect();
    }, 4000);
});
