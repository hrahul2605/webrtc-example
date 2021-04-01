# webrtc-example

This is just an example usage of the WenRTC API.

Public STUN servers used

- stun:stun.l.google.com:19302
- stun:stun1.l.google.com:19302
- stun:stun2.l.google.com:19302


If you are behind Symmetric NAT, sorry I didnot use any TURN servers, so you probably wont be able to join rooms on this example.  
Neverthless, you can add TURN servers in the ICE configuration.

Socket.IO is used for signaling, i.e sending SDP of peers to one another.

This example just allows 2 peers in a single room.

Deployed on heroku. [Link](https://webrtc-ex.herokuapp.com/)