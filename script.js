let MOVE_SPEED = 3, GRAVITY = 0.5;
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
let sound_point = new Audio("sounds effect/point.mp3");
let sound_die = new Audio("sounds effect/die.mp3");

// getting bird element properties
let bird_props = bird.getBoundingClientRect();

// This method returns DOMReact -> top, right, bottom, left, x, y, width and height
let background = document.querySelector(".background").getBoundingClientRect();

let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && game_state != "Play") {
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block";
    bird.style.top = "40vh";
    game_state = "Play";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    flappyBird.play();
  }
});

const flappyBird = {
  move: function () {
    if (game_state != "Play") return;

    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bird_props.left + bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          bird_props.top + bird_props.height > pipe_sprite_props.top
        ) {
          game_state = "End";
          message.innerHTML =
            "Game Over".fontcolor("red") + "<br>Press Enter To Restart";
          message.classList.add("messageStyle");
          img.style.display = "none";
          sound_die.play();
          return;
        } else {
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + MOVE_SPEED >= bird_props.left &&
            element.increase_score == "1"
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_sprite_props.left - MOVE_SPEED + "px";
        }
      }
    });
    requestAnimationFrame(flappyBird.move);
  },
  bird_dy: 0,
  apply_gravity: function () {
    if (game_state != "Play") return;
    flappyBird.bird_dy = flappyBird.bird_dy + GRAVITY;
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/Bird-2.png";
        flappyBird.bird_dy = -7.6;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/Bird.png";
      }
    });

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      game_state = "End";
      message.style.left = "28vw";
      window.location.reload();
      message.classList.remove("messageStyle");
      return;
    }
    bird.style.top = bird_props.top + flappyBird.bird_dy + "px";
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(flappyBird.apply_gravity);
  },
  pipe_seperation: 0,
  pipe_gap: 35,
  create_pipe: function () {
    if (game_state != "Play") return;

    if (flappyBird.pipe_seperation > 115) {
      flappyBird.pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
      pipe_sprite_inv.style.left = "100vw";

      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.top = pipe_posi + flappyBird.pipe_gap + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";

      document.body.appendChild(pipe_sprite);
    }
    flappyBird.pipe_seperation++;
    requestAnimationFrame(flappyBird.create_pipe);
  },
  play: function () {
    requestAnimationFrame(flappyBird.move);

    requestAnimationFrame(flappyBird.apply_gravity);
    
    requestAnimationFrame(flappyBird.create_pipe);
  },
};
