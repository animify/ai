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
    $("body").on("click", "[command]", e => {
        e.preventDefault();
        const target = $(e.target);
        const command = target.attr("command");
        const video = target.attr("video");
        const data = {
            command
        };

        if (video) {
            data.video = video;
        }

        dataConnection.send(data);
    });
});
