let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let tickBuffer;
let activeSources = [];

fetch("./Lucky Draw.mp3")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((buffer) => {
        tickBuffer = buffer;
    })
    .catch((error) => console.error("Error loading audio:", error));

export function playSound() {
    if (!tickBuffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = tickBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    activeSources.push(source);

    source.onended = () => {
        activeSources = activeSources.filter((s) => s !== source);
    };
}

export function stopSound() {
    activeSources.forEach((source) => source.stop(0));
    activeSources = []; 
}