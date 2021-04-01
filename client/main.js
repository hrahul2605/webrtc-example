const input = document.getElementById("roomID");
const socket = io();

const iceConfigation = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ], // Public STUN server
    },
  ],
};

const connection = new RTCPeerConnection(iceConfigation);
const remoteStream = new MediaStream();

connection.onicecandidate = (e) => {
  if (e.candidate === null) return;

  socket.emit("sendIceCandidate", { id: socket.id, candidate: e.candidate });
};

connection.onconnectionstatechange = (e) => {
  console.log(e.currentTarget.connectionState);
};

socket.on("recieveIceCandidates", (args) => {
  if (args.id !== socket.id) {
    connection.addIceCandidate(args.candidate);
  }
});

const openMediaDevices = async () => {
  return await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
};

const getMedia = async () => {
  try {
    const localStream = await openMediaDevices();
    document.querySelector("video#local").srcObject = localStream;

    localStream.getTracks().forEach((track) => {
      connection.addTrack(track, localStream);
    });
  } catch (err) {
    console.log("Error accessing media devices", err);
  }
};

const handleJoinRoom = async () => {
  socket.emit("join", { roomID: input.value || "1" });
  await getMedia();

  const offer = await connection.createOffer();

  await connection.setLocalDescription(offer);

  socket.emit("sendOffer", { id: socket.id, offer });
};

socket.on("recieveOffer", async ({ id, offer }) => {
  if (id !== socket.id) {
    await connection.setRemoteDescription(offer);

    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);
    socket.emit("sendAnswer", { id: socket.id, answer });
  }
});

socket.on("recieveAnswer", async ({ id, answer }) => {
  if (id !== socket.id) {
    await connection.setRemoteDescription(answer);
  }
});

connection.ontrack = (e) => {
  remoteStream.addTrack(e.track, remoteStream);
  document.querySelector("video#remote").srcObject = remoteStream;
};

document.getElementById("joinRoom").addEventListener("click", handleJoinRoom);
