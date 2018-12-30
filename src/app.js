import VoiceWaves from "./waves";
import videos from "./videos";
import { RefCountDisposable } from "rx";

$(document).ready(() => {
    App.buildWaves();
    App.populateVideos();

    $("[access-mic]").bind("click", App.getMicAccess);
    $("[load-command]").bind("click", App.loadCommand);
    $("[start-listening]").bind("click", App.startListening);
    $("[load-home]").bind("click", App.loadHome);
    $("[stop-listening]").bind("click", App.stopListening.bind(null, false));
});

class App {
    static optWaves(container) {
        const opt = {
            width: 600,
            height: 80,
            speed: 0.05,
            amplitude: 0.8,
            autostart: false
        };

        if (container) {
            opt.container = container;
        }

        return opt;
    }

    static optBall(container) {
        const opt = {
            height: 80,
            width: 80,
            amplitude: 1,
            speed: 0.005,
            autostart: true
        };

        if (container) {
            opt.container = container;
        }

        return opt;
    }

    static get videoAttributes() {
        return {
            width: 400,
            height: 400
        };
    }

    static populateVideos() {
        $(".videos").empty();

        Object.entries(videos).forEach(([id, video]) => {
            const newVideo = $("<video></video>");
            const newSrc = $(`<source src="${video.path}" type="video/mp4" />`);

            Object.entries(App.videoAttributes).forEach(([key, value]) =>
                newVideo.attr(key, value)
            );

            newVideo.attr("video-id", id);
            newVideo.append(newSrc);

            $(".videos").append(newVideo);
        });
    }

    static buildWaves() {
        App.waves = new VoiceWaves(App.optWaves($("#waves").get(0)));
        App.waveball = new VoiceWaves(App.optBall($("#wavesspeech").get(0)));
    }

    static loadHome() {
        $("main#vui").fadeOut(1000, () => {
            App.stopListening();
            $("main#intro").fadeIn(1000);
        });
    }

    static loadCommand() {
        $("main#intro, main#vid").fadeOut(1000);

        setTimeout(() => {
            $("main#vui").fadeIn(1000);
            $(".videos video").hide();
        }, 1000);
    }

    static loadResponse() {
        $("main#intro, main#vui").fadeOut(1000);

        setTimeout(() => {
            $("main#vid").fadeIn(1000);
        }, 1000);
    }

    static getMicAccess() {
        window.navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then(() => {
                $(".alert").addClass("hidden");
                $("[load-command]").attr("disabled", false);

                setTimeout(() => {
                    $(".access").remove();
                }, 1000);
            });
    }

    static startListening() {
        clearTimeout(App.timeouts.d1);
        clearTimeout(App.timeouts.d2);

        const dialogue = $(".dialogue");

        dialogue.text("I'm listening...");

        $(".talk").hide();
        $("#waves")
            .fadeIn(400)
            .css("height", App.optWaves().height);
        $(".speech")
            .fadeOut(400)
            .css("height", 0);

        App.timeouts.d1 = setTimeout(() => {
            dialogue.text("Go on, mhm...");
        }, 3000);

        App.timeouts.d2 = setTimeout(() => {
            dialogue.text("Still listening...");
        }, 10000);

        App.waves.start();
    }

    static stopListening(delay = false) {
        clearTimeout(App.timeouts.d1);
        clearTimeout(App.timeouts.d2);

        $("#waves")
            .fadeOut(400)
            .css("height", 0);

        App.waves.stop();
        App.waves.clear();

        setTimeout(
            () => {
                $(".talk").fadeIn(400);
                $(".speech")
                    .fadeIn()
                    .css("height", "auto");
                $(".dialogue").text("How may I help you today?");
            },
            delay ? 1400 : 400
        );
    }

    static runCommand(data) {
        switch (data.command) {
            case "start":
                App.startListening();
                break;
            case "stop":
                App.stopListening();
                break;
            case "play":
                App.stopListening(true);
                App.loadResponse();
                setTimeout(() => {
                    App.playVideo(data.video);
                }, 1000);
                break;
        }
    }

    static playVideo(number) {
        console.log("playing video num", number);
        const video = $(".videos")
            .find(`video[video-id="${number}"]`)
            .show()
            .get(0);

        $("main#vid")
            .find("h1")
            .text(`"${videos[number].response}"`);

        video.pause();
        video.currentTime = 0;
        video.play();

        video.onended = () => {
            App.loadCommand();
        };
    }
}

App.waves = null;
App.waveball = null;
App.timeouts = {
    d1: null,
    d2: null
};

const peer = new Peer("app", {
    host: "0.0.0.0",
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
        App.runCommand(data);
    });
});

peer.on("disconnected", conn => {
    console.log("Disconnected from server");

    setTimeout(() => {
        peer.connect();
    }, 4000);
});

// ADD FLAG
// chrome://flags/#autoplay-policy
