const socket = io();
const roomLink = document.getElementById("roomLink");
socket.emit("createRoom", function (roomId) {
  roomLink.href = "/comment?roomId=" + roomId;
});
