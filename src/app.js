import VoiceWaves from "./waves";

$(document).ready(() => {
    App.buildWaves();

    $("[access-mic]").bind("click", App.getMicAccess);
    $("[load-command]").bind("click", App.loadCommand);
    $("[start-listening]").bind("click", App.startListening);
    $("[load-home]").bind("click", App.loadHome);
    $("[stop-listening]").bind("click", App.stopListening);
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
    static buildWaves() {
        App.waves = new VoiceWaves(App.optWaves($("#waves").get(0)));
        App.waveball = new VoiceWaves(App.optBall($("#wavesspeech").get(0)));
    }

    static loadHome() {
        $("main#vui").fadeOut(1000, () => {
            stopListening();
            $("main#intro").fadeIn(1000);
        });
    }

    static loadCommand() {
        $("main#intro").fadeOut(1000, () => {
            $("main#vui").fadeIn(1000);
        });
    }

    static loadResponse() {
        $("main#intro, main#vui").fadeOut(1000, () => {
            $("main#vid").fadeIn(1000);
        });
    }

    static getMicAccess() {
        window.navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then(() => {
                $(".alert").addClass("hidden");
                setTimeout(() => {
                    $(".access").remove();
                }, 1000);
                $("[load-command]").attr("disabled", false);
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

    static stopListening() {
        clearTimeout(App.timeouts.d1);
        clearTimeout(App.timeouts.d2);

        $("#waves")
            .fadeOut(400)
            .css("height", 0);

        App.waves.stop();
        App.waves.clear();

        setTimeout(() => {
            $(".talk").fadeIn(400);
            $(".speech")
                .fadeIn()
                .css("height", "auto");
            $(".dialogue").text("How may I help you today?");
        }, 400);
    }

    static runCommand(data) {
        // alert(`playing video ${num}`);

        switch (data.command) {
            case "start":
                App.startListening();
                break;
            case "stop":
                App.stopListening();
                break;
            case "play":
                App.stopListening();
                App.playVideo(data.video);
                break;
        }
    }

    static playVideo(number) {
        console.log("playing video num", number);

        App.loadResponse();

        $(".video")
            .find(`video[video-id="${number}"]`)
            .get(0)
            .play();
    }
}

App.waves = null;
App.waveball = null;
App.timeouts = {
    d1: null,
    d2: null
};

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
        App.runCommand(data);
    });
});

peer.on("disconnected", conn => {
    console.log("Disconnected from server");

    setTimeout(() => {
        peer.connect();
    }, 4000);
});
