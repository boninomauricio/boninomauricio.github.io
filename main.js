const elements = {
  button: document.getElementById("enterBtn"),
  background: document.getElementById("background"),
  socials: document.getElementById("socials"),
  notification: document.getElementById("copyNotification"),
  music: document.getElementById("music"),
  muteBtn: document.getElementById("muteBtn"),
  sword: document.getElementById("sword")
};

let swordRotation = 0;

const titles = {
  normal: "on-site",
  away: "where are u?"
};

const showSword = () => {
  elements.sword.classList.remove("hidden");
  elements.sword.classList.add("show");

  elements.muteBtn.classList.remove("hidden");

  Object.assign(elements.music, {
    volume: 0.5,
    currentTime: 126
  });

  elements.music.play();
};

const showSocials = () => {
  elements.socials.classList.remove("hidden");
  elements.socials.classList.add("show");

  setTimeout(() => socials.classList.add("top"), 2000);
  setTimeout(() => showSword(), 2500);
};

const showNotification = text => {

  elements.notification.textContent = `copied to clipboard`;
  elements.notification.classList.add("show");

  setTimeout(() => elements.notification.classList.remove("show"), 2000);
};

const handleCopy = async ({ currentTarget }) => {
  const { copy } = currentTarget.dataset;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(copy);
      showNotification(copy);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = copy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification(copy);
    } catch (err) {
      alert("Failed to copy.");
    }
    document.body.removeChild(textArea);
  }
};

const handleEnter = () => {

  elements.background.style.filter = "blur(0)";
  elements.button.classList.add("hidden");

  setTimeout(showSocials, 800);

};

document.querySelectorAll(".social-btn").forEach(btn => btn.addEventListener("click", handleCopy));

elements.button.addEventListener("click", handleEnter);

document.addEventListener("visibilitychange", () => {
  document.title = document.hidden ? titles.away : titles.normal;
});

elements.muteBtn.addEventListener("click", () => {
  elements.music.muted = !elements.music.muted;
  elements.muteBtn.textContent = elements.music.muted ? "🔇" : "🔊";
});

document.addEventListener("click", ({ target }) => {
  if (
    !elements.sword.classList.contains("show") ||
    target.closest(".social-btn, #muteBtn")
  ) return;

  swordRotation += 360;

  elements.sword.style.transform =
    `translate(-50%, -50%) scale(1) rotate(${swordRotation}deg)`;
});