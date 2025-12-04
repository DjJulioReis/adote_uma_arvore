document.addEventListener('DOMContentLoaded', () => {
    const startStreamButton = document.getElementById('start-stream');
    const stopStreamButton = document.getElementById('stop-stream');
    const rtspUrlInput = document.getElementById('rtsp-url');
    const videoPlayer = document.getElementById('video-player');
    const errorMessage = document.getElementById('error-message');

    let hls;
    let currentStreamId;

    startStreamButton.addEventListener('click', () => {
        const rtspUrl = rtspUrlInput.value;
        if (rtspUrl) {
            errorMessage.textContent = '';
            fetch(`/start-stream?rtsp_url=${encodeURIComponent(rtspUrl)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to start stream');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    currentStreamId = data.streamId;
                    if (Hls.isSupported()) {
                        hls = new Hls();
                        hls.loadSource(data.streamUrl);
                        hls.attachMedia(videoPlayer);
                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                            videoPlayer.play();
                            stopStreamButton.disabled = false;
                        });
                    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                        videoPlayer.src = data.streamUrl;
                        videoPlayer.addEventListener('loadedmetadata', () => {
                            videoPlayer.play();
                            stopStreamButton.disabled = false;
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    errorMessage.textContent = 'Error starting stream. Please check the RTSP URL and try again.';
                });
        }
    });

    stopStreamButton.addEventListener('click', () => {
        if (currentStreamId) {
            fetch(`/stop-stream?streamId=${currentStreamId}`)
                .then(() => {
                    if (hls) {
                        hls.destroy();
                    }
                    videoPlayer.pause();
                    videoPlayer.src = '';
                    stopStreamButton.disabled = true;
                    currentStreamId = null;
                });
        }
    });
});
