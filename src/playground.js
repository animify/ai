import videos from "./videos";

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
    $(".status")
        .toggleClass("disconnected connected")
        .text("Connected");
});

dataConnection.on("close", data => {
    console.log("Disconnected from app");
    $(".status")
        .toggleClass("connected disconnected")
        .text("Disconnected");
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

    $(".videos").empty();

    Object.entries(videos).forEach(([id, video]) => {
        $(".videos").append(
            `<div command="play" video="${id}">${video.title}</div>`
        );
    });
});
