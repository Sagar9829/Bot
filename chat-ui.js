document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("sagarbot-root");

  const bubble = document.createElement("div");
  bubble.innerText = "💬";
  bubble.style.cssText = "position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:#4b7bec;border-radius:50%;color:#fff;font-size:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:1000;";
  root.appendChild(bubble);

  const chatWindow = document.createElement("div");
  chatWindow.style.cssText = "display:none;position:fixed;bottom:90px;right:20px;width:350px;height:450px;background:#fff;border:1px solid #ccc;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.2);padding:10px;z-index:1000;overflow:auto;";
  chatWindow.innerHTML = `
    <div id="chat-log" style="height:85%;overflow-y:auto;margin-bottom:10px;"></div>
    <input id="chat-input" type="text" placeholder="Type your message..." style="width:70%;padding:5px;" />
    <button id="chat-send">Send</button>
    <div style="margin-top:10px;">
      <button class="quick-btn">Track Order</button>
      <button class="quick-btn">Return Policy</button>
      <button class="quick-btn">Offers</button>
    </div>
  `;
  root.appendChild(chatWindow);

  bubble.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
  };

  const log = document.getElementById("chat-log");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");

  sendBtn.onclick = sendMessage;
  chatWindow.querySelectorAll(".quick-btn").forEach(btn => {
    btn.onclick = () => {
      input.value = btn.innerText;
      sendMessage();
    };
  });

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    log.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    input.value = "";
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    log.innerHTML += `<div><strong>SagarBot:</strong> ${data.reply || "Something went wrong!"}</div>`;
    log.scrollTop = log.scrollHeight;
  }
});
