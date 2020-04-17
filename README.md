# AudioWorkletProcessor MP3 recorder example

This code records audio and encodes it to an MP3 Blob using the lame.js library and a Service Worker.

It uses an AudioWorkletProcessor instead of the deprecated ScriptProcessorNode.

Works on Google Chrome only. 

Must be served from a secure context.
