import videos from "./videos";
import io from "socket.io-client";

const socket = io(`http://${window.location.hostname}:3000`);

socket.on("connect", () => {
    $(".status")
        .toggleClass("disconnected connected")
        .text("Connected");
});

socket.on("disconnect", () => {
    $(".status")
        .toggleClass("connected disconnected")
        .text("Disconnected");
});

$(document).ready(() => {
    $("body").on("click", "[command]", e => {
        e.preventDefault();

        const target = $(e.target);
        const command = target.attr("command");
        const video = target.attr("video");
        const data = {
            command
        };

        target.addClass("clicked");

        if (video) {
            data.video = video;
        }

        socket.emit("command", data);
    });

    $(".videos").empty();

    console.log(Object.entries(videos).sort((a, b) => a.order - b.order));
    Object.entries(videos)
        .filter(([id, video]) => video.order)
        .sort(([id1, video1], [id2, video2]) => video1.order - video2.order)
        .forEach(([id, video]) => {
            $(".videos").append(
                `<div command="play" video="${id}">${video.title}</div>`
            );
        });

    Object.entries(videos)
        .filter(([id, video]) => !video.order)
        .sort(([id1, video1], [id2, video2]) => video1.order - video2.order)
        .forEach(([id, video]) => {
            $(".buttons.options").append(
                `<div command="play" video="${id}">${video.title}</div>`
            );
        });
});
