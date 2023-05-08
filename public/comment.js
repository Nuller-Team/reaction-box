const socket = io();
const roomId = new URLSearchParams(window.location.search).get("roomId");
const link = window.location.href + "/comment.html?roomId=" + roomId
const link1 = "/comment.html?roomId="
socket.emit("joinRoom", roomId);
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
commentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const comment = commentInput.value;
  if (comment) {
    socket.emit("newComment", comment);
    commentInput.value = "";
  }
});
document.getElementById("viewer-button").href = link1 + roomId + "&viewer=true";
document.getElementById("share-button").href = link1 + roomId + "&share=true";
socket.on("newComment", function (comment) {
  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.id = "comment";
  commentElement.textContent = comment;
  commentElement.style.left = Math.floor(Math.random() * (window.innerWidth)) + "px";
  document.getElementById("comments").appendChild(commentElement);
  commentElement.addEventListener("animationend", function () {
    commentElement.remove();
  });
});
const params = new URLSearchParams(window.location.search);
if (params.get("viewer") === "true") {
  const commentForm = document.getElementById("commentForm");
  if (commentForm) {
    commentForm.style.display = "none";
  }
}
else if (params.get("viewer") !== "true") {
  const commentviewer = document.getElementById("comments");
  if (commentviewer) {
    commentviewer.style.display = "none";
  }
}
if (params.get("share") == "true") {
  document.getElementById("modal").style.display = "block";
  document.getElementById("qrcode").src = "https://api.qrserver.com/v1/create-qr-code/?data=" + link;
  document.getElementById("close").href = link1 + roomId;
}