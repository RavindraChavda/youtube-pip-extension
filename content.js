function addPiPButton() {
  if (document.getElementById('custom-pip-button')) return;

  const controls = document.querySelector("#top-level-buttons-computed");
  if (!controls) return;

  const button = document.createElement("button");
  button.id = "custom-pip-button";
  button.innerText = "📺 PiP";
  button.style.marginLeft = "8px";
  button.style.padding = "6px 10px";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";
  button.style.background = "#cc0000";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "4px";

  button.onclick = () => {
    const video = document.querySelector("video");
    if (video) {
      video.requestPictureInPicture().catch(console.error);
    } else {
      alert("No video element found.");
    }
  };

  controls.appendChild(button);
}

const observer = new MutationObserver(() => {
  addPiPButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
