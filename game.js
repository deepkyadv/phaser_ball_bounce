const sessionData = [];
let sessionID;
let countdown;
let timerEvent;
let startTime;
let endTime;
let ball;

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image('back', 'assets/cloudWithSea.png');
    this.load.audio('clock', 'assets/audio/oldClock.mp3');
    this.load.image('ball', 'assets/ball.png');
  }

  create() {
    this.add.image(0, 0, 'back').setOrigin(0, 0); // Corrected background image placement
    this.clockSound = this.sound.add('clock');
    
    // Set the ball to start at the bottom of the screen
    ball = this.physics.add.image(500, 600, 'ball').setCollideWorldBounds(true).setBounce(0, 1);
    ball.setDisplaySize(100, 100);
    ball.setVelocity(0, 0); // Initially set the ball velocity to 0
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.startSession();
  }

  startSession() {
    document.getElementById('startSessionBtn').addEventListener('click', () => {
      sessionID = Phaser.Math.Between(1000, 9999).toString();
      countdown = Phaser.Math.Between(30, 120); // Changed back to 30-120 seconds for variability
      startTime = new Date().toLocaleTimeString();
      document.getElementById('sessionId').innerText = sessionID;
      document.getElementById('startTime').innerText = startTime;
      document.getElementById('counterValue').innerText = countdown;
      this.clockSound.play({ loop: true });
      
      // Set the ball velocity here on button click
      ball.setVelocity(0, -200); 
      
      timerEvent = this.time.addEvent({
        delay: 1000,
        callback: this.updateCountdown,
        callbackScope: this,
        loop: true
      });
    });
  }

  updateCountdown() {
    if (countdown > 0) {
      countdown--;
      document.getElementById('counterValue').innerText = countdown;
    } else {
      this.endSession();
    }
  }

  endSession() {
    endTime = new Date().toLocaleTimeString();
    sessionData.push({ sessionID, startTime, endTime });
    document.getElementById('endTime').innerText = endTime;
    this.updateSessionList();
    this.clockSound.stop();
    timerEvent.remove();
    ball.setVelocity(0, 0); // Stop ball movement
  }

  updateSessionList() {
    const sessionList = document.getElementById('sessionList');
    sessionList.innerHTML = '';
    sessionData.forEach(session => {
      const li = document.createElement('li');
      
      sessionList.appendChild(li);
    });
  }

  checkBallPosition() {
    if (ball.y < 325) { // If the ball crosses mid-height
      ball.setVelocityY(Math.abs(ball.body.velocity.y)); // Reverse the direction if it goes above mid-height
    }
  }

  update(time, delta) {
    this.checkBallPosition();
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 650,
  scene: MainScene,
  parent: 'gameContainer',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
