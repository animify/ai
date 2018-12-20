import VoiceWaves from "./waves";

let dialogueTimeout1 = null;
let dialogueTimeout2 = null;

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

    $("[access-mic]").bind("click", e => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then(() => {
                $(".alert").addClass("hidden");
                $("[load-command]").attr("disabled", false);
            });
    });

    $("[load-command]").bind("click", loadCommand);

    $("[load-listening]").bind("click", loadListening);

    $("[load-home]").bind("click", loadHome);

    $("[stop-listening]").bind("click", stopListening);

    function loadHome() {
        $("#vui").fadeOut(1000, () => {
            $("main#intro").fadeIn(1000);
        });
    }

    function loadCommand() {
        $("main#intro").fadeOut(1000, () => {
            $(".access").remove();
            $("#vui").fadeIn(1000);
        });
    }

    function loadListening() {
        clearTimeout(dialogueTimeout1);
        clearTimeout(dialogueTimeout2);

        const dialogue = $(".dialogue");

        dialogue.text("I'm listening...");

        $(".talk").hide();
        $("#waves")
            .fadeIn(400)
            .css("height", opt.height);
        $(".speech")
            .fadeOut(400)
            .css("height", 0);

        dialogueTimeout1 = setTimeout(() => {
            dialogue.text("Go on, mhm...");
        }, 3000);

        dialogueTimeout2 = setTimeout(() => {
            dialogue.text("Still listening...");
        }, 10000);

        voicewaves.start();
    }

    function stopListening() {
        clearTimeout(dialogueTimeout1);
        clearTimeout(dialogueTimeout2);

        $("#waves")
            .fadeOut(400)
            .css("height", 0);

        voicewaves.stop();
        voicewaves.clear();

        setTimeout(() => {
            $(".talk").fadeIn(400);
            $(".speech")
                .fadeIn()
                .css("height", "auto");
            $(".dialogue").text("How may I help you today?");
        }, 400);
    }
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
