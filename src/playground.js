const peer = new Peer("playground", {
    host: "localhost",
    port: 9000,
    path: "/"
});

const dataConnection = peer.connect("app");

peer.on("open", function(id) {
    console.log("My peer ID is: " + id);
});

dataConnection.on("open", data => {
    console.log("Connected to app");
});

dataConnection.on("close", data => {
    console.log("Disconnected from app");
});

console.log(peer);

$(document).ready(() => {
    $("body").on("click", "[message]", e => {
        e.preventDefault();
        const target = $(e.target);
        const message = target.attr("message");

        console.log("message", message);
        dataConnection.send({
            message
        });
    });
});
