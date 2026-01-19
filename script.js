// Handle login
async function loginUser(event) {
  event.preventDefault();
  const section = document.getElementById("section").value;
  const roll = document.getElementById("roll").value;

  // Load student data
  const response = await fetch("data.json");
  const data = await response.json();

  const key = section + roll;

  if (data[key]) {
    // Hide login card, show invitation card
    document.getElementById("loginCard").classList.add("hidden");
    const inviteCard = document.getElementById("inviteCard");
    inviteCard.classList.remove("hidden");

    document.getElementById("inviteName").innerText = "Hello " + data[key].name;
    document.getElementById("inviteMessage").innerText = data[key].invitation;

    // Confetti animation
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = inviteCard.offsetWidth;
    canvas.height = inviteCard.offsetHeight;
    const confetti = Array.from({length:100}, () => ({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*6+2,
      d: Math.random()*0.5+0.5,
      color: 'hsl('+Math.random()*360+',100%,50%)'
    }));
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      confetti.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2,true);
        ctx.fillStyle=p.color;
        ctx.fill();
        p.y+=p.d;
        if(p.y>canvas.height){
          p.y=0; p.x=Math.random()*canvas.width;
        }
      });
    }
    setInterval(draw,20);

  } else {
    // Special funny case for roll number 69
    if (roll === "69") {
      document.getElementById("welcome").innerText = "chal! chal! chal!";
      const audio69 = document.getElementById("audio69");
      if (audio69) audio69.play();
    } else {
      const funnyMessage = "Oops! Wrong roll number. Did you borrow it from Hogwarts?";
      document.getElementById("welcome").innerText = funnyMessage;
      const audioWrong = document.getElementById("audioWrong");
      if (audioWrong) audioWrong.play();
    }
  }
}

// Puzzle check for farewell.html
function checkAnswer() {
  const ans = document.getElementById("answer").value.toLowerCase();
  const video = document.getElementById("farewellVideo");

  if (ans === "farewell") {
    document.getElementById("result").innerText = "Correct! Enjoy your clip 🎬";
    video.classList.remove("hidden");
    video.play();
    video.focus();

    // Fullscreen
    if (video.requestFullscreen) video.requestFullscreen();

    // Keyboard shortcuts
    document.addEventListener("keydown", function(e) {
      switch(e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          if (video.paused) video.play(); else video.pause();
          break;
        case "arrowup":
          video.volume = Math.min(1, video.volume + 0.1);
          break;
        case "arrowdown":
          video.volume = Math.max(0, video.volume - 0.1);
          break;
        case "f":
          if (!document.fullscreenElement) video.requestFullscreen();
          else document.exitFullscreen();
          break;
        case "escape":
          if (document.fullscreenElement) document.exitFullscreen();
          break;
      }
    });

    // Reset layout after video ends
    video.addEventListener("ended", () => {
      document.getElementById("result").innerText = "Hope you enjoyed! 🎉";
      video.classList.add("hidden");

      // Add replay button
      if (!document.getElementById("replayBtn")) {
        const replayBtn = document.createElement("button");
        replayBtn.id = "replayBtn";
        replayBtn.innerText = "Replay Video 🔁";
        replayBtn.onclick = () => {
          video.classList.remove("hidden");
          video.play();
          video.focus();
          if (video.requestFullscreen) video.requestFullscreen();
        };
        document.querySelector(".card").appendChild(replayBtn);
      }
    });

  } else {
    document.getElementById("result").innerText = "Try again!";
    const audioWrong = document.getElementById("audioWrong");
    if (audioWrong) audioWrong.play();
  }
}
