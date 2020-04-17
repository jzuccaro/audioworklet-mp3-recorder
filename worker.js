 importScripts('lame.min.js');


 let mp3Encoder = "";
 let dataBuffer = [];
 const maxSamples = 1152;

 const init = () => {
   mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128);
   dataBuffer = [];
 };

 const appendToBuffer = mp3Buf => {
   dataBuffer.push(new Int8Array(mp3Buf));
 };

 const floatTo16BitPCM = (input, output) => {
   for (let i = 0; i < input.length; i++) {
     let s = Math.max(-1, Math.min(1, input[i]));
     output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF);
   }
 };

 const convertBuffer = arrayBuffer => {
   let data = new Float32Array(arrayBuffer);
   let out = new Int16Array(arrayBuffer.length);
   floatTo16BitPCM(data, out)
   return out;
 };

//Encodes the received arrayBuffer 
 const encode = arrayBuffer => {
   samplesMono = convertBuffer(arrayBuffer);
   let remaining = samplesMono.length;
   for (let i = 0; remaining >= 0; i += maxSamples) {
     let left = samplesMono.subarray(i, i + maxSamples);
     let mp3buf = mp3Encoder.encodeBuffer(left);
     appendToBuffer(mp3buf);
     remaining -= maxSamples;
   }
 };

 //Posts the Buffer to the main page
 const finish = () => {
   appendToBuffer(mp3Encoder.flush());
   self.postMessage({
     cmd: 'end',
     buf: dataBuffer
   });
   dataBuffer = [];
 }

 //Process Messages
 self.onmessage = function(e) {
   switch (e.data.cmd) {
     case 'init':
       init();
       break;
     case 'encode':
       encode(e.data.buf);
       break;
     case 'finish':
       finish();
       break;
   }
 };
