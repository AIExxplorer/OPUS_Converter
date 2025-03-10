# Sample OPUS Files

This directory is intended for sample OPUS files that can be used to test the OPUS Converter application.

## How to Add Sample Files

1. Find or create OPUS audio files (.opus extension)
2. Place them in this directory
3. Make sure the files are small (preferably under 1MB) and free of copyright restrictions

## Where to Find OPUS Files

- You can convert existing audio files to OPUS format using tools like FFmpeg
- Some websites offer free OPUS samples for testing
- You can record your own audio and save it in OPUS format

## Example Command to Create an OPUS File with FFmpeg

```
ffmpeg -i input.mp3 -c:a libopus -b:a 64k output.opus
```

This will convert an MP3 file to OPUS format with a bitrate of 64kbps. 