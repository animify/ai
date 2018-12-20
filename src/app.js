import VoiceWaves from "./waves";

$(document).ready(() => {
    const container = document.querySelector("#waves");
    const containerSpeech = document.querySelector("#wavesspeech");
    const opt = {
        width: 600,
        height: 80,
        speed: 0.05,
        amplitude: 0.8,
        container,
        autostart: false
    };
    const optSpeech = {
        ...opt,
        width: 80,
        amplitude: 1,
        speed: 0.005,
        container: containerSpeech,
        autostart: true
    };
    let voicewaves = new VoiceWaves(opt);
    let voicespeech = new VoiceWaves(optSpeech);

    $(".getaudio").bind("click", e => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then(() => {
                $(".alert").addClass("hidden");
                $(".try").attr("disabled", false);
            });
    });

    $(".try").bind("click", e => {
        $("main#intro").fadeOut(1000, () => {
            $(".access").remove();
            $("#vui").fadeIn(1000);
        });
    });

    $(".talk").bind("click", e => {
        $(e.target).hide();
        $("#waves").css("height", opt.height);
        $(".dialogue").text("I'm listening...");
        $(".speech")
            .css("height", 0)
            .hide();

        setTimeout(() => {
            $(".dialogue").text("Go on, mhm...");
        }, 3000);

        setTimeout(() => {
            $(".dialogue").text("Still listening...");
        }, 10000);

        voicewaves.start();
    });
});

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
