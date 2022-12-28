// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

// Set some global variables for the audio player
let savedVolume = 1.0;
let muted = false;

let Hooks = {}

Hooks.AudioPlayer = {
    mounted(){
        this.player = this.el.querySelector("audio");
        this.player.src = "https://audio.cfrc.ca/stream";
        this.player.volume = 1.0;
        let enableAudio = () => {
            if(this.player.src){
              document.removeEventListener("click", enableAudio)
              if(this.player.readyState === 0){
                this.player.play().catch(error => null)
                this.player.pause()
              }
            }
          }
        document.addEventListener("click", enableAudio)
        this.el.addEventListener("js:play_pause", () => {
            if (this.player.paused){
                this.play();
            } else {
                this.pause();
            }
        })

        this.el.addEventListener("js:volume_up", () =>{
            this.adjustVol("up");
        })
        this.el.addEventListener("js:volume_down", () =>{
            this.adjustVol("down");
        })
        this.el.addEventListener("js:volume_off", () =>{
            this.adjustVol("off");
        })
        this.el.addEventListener("js:volume_on", () =>{
            this.adjustVol("on");
        })

        this.handleEvent("play", () => {
            this.play({sync: true});
        })
        this.handleEvent("pause", () => this.pause());
        this.handleEvent("stop", () => this.stop());
    },

    adjustVol(direction) {
        let volume = this.player.volume;
        //let savedVolume = getSavedVolume();
        switch (direction) {
            case "up":
                 if (volume == 0.0) {
                    this.player.volume = 0.1;
                } else if (volume > 0.9) {
                    this.player.volume = 1.0;
                }else if (volume < 1.0) {
                    this.player.volume = volume + 0.1;
                }
                savedVolume = this.player.volume;
                break;
            case "down":
                if (volume == 1.0) {
                    this.player.volume = 0.9;
                }
                else if (volume < 0.14) {
                    this.player.volume = 0.0;
                }
                else {
                    this.player.volume = volume - 0.1;
                }
                savedVolume = this.player.volume;
                break;
            case "off":
                if (!muted) {
                    muted = true;
                    this.player.volume = 0.0;
                }
                break;
            case "on":
                if (muted) {
                    muted = false;
                    this.player.volume = savedVolume;
                }
                break;
            default: 
                console.log("Error: Default case reached.");
                break;
        }
        volume = this.player.volume;
        //console.log("Volume: ", this.player.volume);
        //console.log("Saved Volume: ", savedVolume);
    },

    play () {
        this.player.play();
    },

    pause(){
        this.player.pause();
    }, 

    stop(){
        this.player.pause();
    }, 
}
// Set global variable for volume input range slider
const volume = document.querySelector("#volume");
const muteControl = document.querySelector("#muteControl");
let isMuted = false;

function unMute() {
    isMuted = false;
        muteControl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16">
            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
            <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
        </svg>
    `;
}

volume.addEventListener("input", () => {
    music.volume = volume.value; 
    savedVolume = volume.value;
    if (isMuted) {
         unMute();
    }
});

muteControl.addEventListener("click", () => {
    if (isMuted) {
      // Unmute the stream
      music.volume = savedVolume;
      volume.value = savedVolume;
      unMute();
    } else {
        // Mute the stream
        isMuted = true;
        music.volume = 0.0;
        volume.value = 0.0;
        muteControl.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16">
                <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
            </svg>
        `;
    }
});

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
    hooks: Hooks,
    params: {_csrf_token: csrfToken}
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", info => topbar.delayedShow(200))
window.addEventListener("phx:page-loading-stop", info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

