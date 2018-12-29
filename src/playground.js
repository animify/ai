import videos from "./videos";

$(document).ready(() => {
    alert("ready");

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

const peer = new Peer("playground", {
    host: "0.0.0.0",
    port: 9000,
    path: "/"
});

const dataConnection = peer.connect("app");

peer.on("open", function(id) {
    console.log("My peer ID is: " + id);
});

peer.on("error", function(id) {
    alert("error");
});

dataConnection.on("open", data => {
    console.log("opening", data);
    console.log("Connected to app");
    $(".status")
        .toggleClass("disconnected connected")
        .text("Connected");
});

dataConnection.on("close", data => {
    console.log("Disconnected from app");
    console.log("opening", data);
    $(".status")
        .toggleClass("connected disconnected")
        .text("Disconnected");
});

// console.log(peer);
