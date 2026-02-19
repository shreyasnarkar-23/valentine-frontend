const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  || window.innerWidth < 1024;

if(isMobile){
  document.body.innerHTML = `
    <h2 style="text-align:top;margin-top:40vh;">
      🚫 This experience is only available on PC 💻
    </h2>
  `;
  throw new Error("Mobile blocked");
}
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

const q = [
  n=>`🌹 ${n}, What kind of moments do you value the most??`,
  "What makes you feel more special?",
  "In a relationship, what do you notice first?",
  "What matters more to you?"
];

const o = [
  ["🌅 Quiet moments with one person","🎉 Fun moments with lots of laughter"],
  ["💬 Meaningful conversations","🫶 Small unexpected gestures"],
  ["👀 The way they care","💗 The way they make you feel"],
  ["🤍 Feeling understood","💞 Feeling chosen every day"]
];

let i=0;
const question=document.getElementById("question");
const options=document.getElementById("options");
const music=document.getElementById("bgm");

document.addEventListener("click", ()=>{
  if(music.paused) music.play();
},{ once:true });


fetch(`https://website-backend-2fey.onrender.com/validate/${token}`)

.then(r=>r.json())
.then(d=>{
  if(!d.valid){
    document.body.innerHTML="⚠️ Link Expired ⚠️";
  } else show(d.name);
});

function show(name){
  if(i<4){
    question.innerText=typeof q[i]=="function"?q[i](name):q[i];
    options.innerHTML="";
    o[i].forEach(x=>{
      let b = document.createElement("button");
      b.className = "option-btn";
      b.innerText=x;
      b.onclick=()=>{i++;show(name)};
      options.appendChild(b);
    });
  } else proposal();
}

function proposal(){
  // heading and options box already exist: reset and size the options area
  question.innerText = " So… friends? ❤️✨";
  options.innerHTML = "";
  options.style.position = "relative";
  options.style.height = "160px";

  // YES button (centered)
  const yes = document.createElement("button");
  yes.innerText = "Yes 💖";
  yes.className = "yes";
  yes.onclick = () => {
  fetch(`https://website-backend-2fey.onrender.com/use/${token}`).catch(()=>{});

  // ❤️ Heart explosion
  for(let i = 0; i < 25; i++){
    const heart = document.createElement("div");
    heart.className = "explode-heart";
    heart.innerText = "❤️";

    heart.style.left = window.innerWidth / 2 + "px";
    heart.style.top = window.innerHeight / 2 + "px";

    const randomX = (Math.random() - 0.5) * 600 + "px";
    const randomY = (Math.random() - 0.5) * 600 + "px";

    heart.style.setProperty("--x", randomX);
    heart.style.setProperty("--y", randomY);

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  }

  // ✨ Fade-in message after slight delay
  setTimeout(() => {
    document.getElementById("app").innerHTML = `
  <div class="fade-in final-box">
    <h1 style="font-size:2.5em;">😌 I knew you wouldn’t say no.</h1>
    <p style="font-size:1.3em; margin-top:15px;">
      ❤️Here’s to new memories and better conversations.❤️
    </p>
  </div>
`;

  }, 400);
};


  // NO button (initially below YES, same size)
  const no = document.createElement("button");
  no.innerText = "No 😅";
  no.className = "no";

// append buttons (YES first so it's logically first)
  options.appendChild(yes);
  options.appendChild(no);

  // Force NO initial position BELOW YES
no.style.position = "absolute";
no.style.left = "50%";
no.style.top = "90px";          // below YES
no.style.transform = "translateX(-50%)";


  // make sure YES stays above NO visually
  yes.style.zIndex = "100";
  no.style.zIndex = "50";

  // block real clicks on NO (so it can never be selected)
  no.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Helper to move NO to a random spot inside options
  function moveNoToRandom() {
    // compute available area inside options
    const obRect = options.getBoundingClientRect();
    const noRect = no.getBoundingClientRect();
    const maxX = Math.max(0, obRect.width - noRect.width);
    const maxY = Math.max(0, obRect.height - noRect.height);

    // choose positions with some padding so button stays fully visible
    const x = Math.random() * maxX * 0.9;
    const y = Math.random() * maxY * 0.9;


    // set left/top relative to options container
    no.style.left = `${x}px`;
    no.style.top  = `${y}px`;
    no.style.transform = `none`; // we positioned using left/top; remove translateX(-50%)
  }

  // ultra-sensitive proximity handler: runs BEFORE the cursor touches NO
  // use assignment not addEventListener to avoid duplicate handlers if function runs multiple times
  options.onmousemove = (e) => {
    const noRect = no.getBoundingClientRect();
    // center of NO
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;

    // cursor coordinates
    const dx = Math.abs(e.clientX - noCenterX);
    const dy = Math.abs(e.clientY - noCenterY);

    // sensitivity thresholds — increase to be more jumpy
    const thresholdX = 180; // horizontal sensitivity
    const thresholdY = 120;  // vertical sensitivity

    if (dx < thresholdX && dy < thresholdY) {
      moveNoToRandom();
    }
  };
}

const bgContainer = document.getElementById("bg-hearts");

function createHeart(){
  const heart = document.createElement("div");
  heart.className = "bg-heart";

  const hearts = ["❤️","💗","💖","💕"];
  heart.innerText = hearts[Math.floor(Math.random()*hearts.length)];

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (14 + Math.random() * 20) + "px";
  heart.style.animationDuration = (6 + Math.random() * 6) + "s";

  bgContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 12000);
}

setInterval(createHeart, 400);



setTimeout(()=>document.body.innerHTML="⏳ Session Expired",180000);
