const express = require('express');
const http = require('http');
const { spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);

const streams = {}; // To store ffmpeg processes

app.use(express.static(__dirname));

const streamsDir = path.join(__dirname, 'streams');
if (!fs.existsSync(streamsDir)) {
    fs.mkdirSync(streamsDir);
}

app.use('/streams', express.static(streamsDir));


app.get('/start-stream', (req, res) => {
    const { rtsp_url } = req.query;

    if (!rtsp_url) {
        return res.status(400).send('RTSP URL is required');
    }

    const streamId = crypto.randomBytes(8).toString('hex');
    const streamDir = path.join(streamsDir, streamId);
    fs.mkdirSync(streamDir);

    let ffmpegExited = false;

    const ffmpeg = spawn('ffmpeg', [
        '-i', rtsp_url,
        '-c:v', 'copy',
        '-c:a', 'copy',
        '-f', 'hls',
        '-hls_time', '2',
        '-hls_list_size', '3',
        '-hls_flags', 'delete_segments',
        path.join(streamDir, 'stream.m3u8')
    ]);

    streams[streamId] = ffmpeg;

    ffmpeg.stderr.on('data', (data) => {
        console.error(`[${streamId}] ffmpeg stderr: ${data}`);
    });

    const timeout = setTimeout(() => {
        if (!ffmpegExited) {
            ffmpeg.kill('SIGINT');
            res.status(500).send('Failed to start stream in time.');
        }
    }, 10000); // 10 second timeout

    ffmpeg.on('close', (code) => {
        console.log(`[${streamId}] ffmpeg process exited with code ${code}`);
        ffmpegExited = true;
        clearTimeout(timeout);
        delete streams[streamId];
        // Clean up stream directory
        fs.rm(streamDir, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error(`Error removing stream directory ${streamDir}:`, err);
            }
        });
    });

    // Check for the existence of the playlist file
    const checkPlaylist = setInterval(() => {
        if (fs.existsSync(path.join(streamDir, 'stream.m3u8'))) {
            clearInterval(checkPlaylist);
            clearTimeout(timeout);
            res.json({ streamId, streamUrl: `/streams/${streamId}/stream.m3u8` });
        }
    }, 500);

});

// Endpoint to stop a stream
app.get('/stop-stream', (req, res) => {
    const { streamId } = req.query;
    const ffmpegProcess = streams[streamId];

    if (ffmpegProcess) {
        ffmpegProcess.kill('SIGINT');
        res.send(`Stream ${streamId} stopped.`);
    } else {
        res.status(404).send(`Stream ${streamId} not found.`);
    }
});


server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    for (const streamId in streams) {
        streams[streamId].kill('SIGINT');
    }
    server.close(() => {
        console.log('Server shut down.');
        process.exit(0);
    });
});
