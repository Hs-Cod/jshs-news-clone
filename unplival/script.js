var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var mySound = new sound("image/wow.mp3");


var myChart = new Chart(context, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }]

    },
    options: {
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return tooltipItem.index;
                }
            }
        }
    }
});

var times = 0;
var chocolate = 0;
var index = 100000;
var pointer = 0;
var colour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var chocolour = ['rgba(0, 0, 0, 0.1)',
    'rgba(255, 215, 100, 0.7)',
    'rgba(200, 125, 65, 0.8)',
    'rgba(130, 60, 10, 0.85)',
    'rgba(75, 50, 15, 1)'];


function refresh() {
    var tmpDat = [];
    colour.forEach(function (element) {
        tmpDat.push(chocolour[element]);
    });

    myChart.data.datasets[0].backgroundColor = tmpDat;
    myChart.update();
}
var rotation = 0;
function rotate(clockwise) {
    if (clockwise) {
        index--;
        rotation += 36;
    }
    else {
        index++;
        rotation -= 36;
    }
    $('#myCanvas').css('transform', 'rotate(' + rotation + 'deg)');
}
function guchigi() {
    var tmpDat = [];
    colour.forEach(function (elem) {
        if (elem > 0 && elem < 4) {
            tmpDat.push(elem + 1)
        } else if (elem != 4) {
            tmpDat.push(0);
        } else {
            tmpDat.push(4);
        }
    });
    colour = tmpDat;
    refresh()
}
function putaway() {
    if (colour[index % 10] == 4) {
        colour[index % 10] = 0;
        chocolate += 1;
        refresh()
    }
    else if (colour[index % 10] != 0) {
        colour[index % 10] = 0;
        refresh()
    }
    else {
        colour[index % 10] = 0;
        refresh()
    }
}

var imglist = ["image/짜기.png","image/만없 짜기.png","image/스위치.png","image/만있 시계 1 회전.png","image/만있 반시계 1 회전.png","image/시계 1 회전.png","image/반시계 1 회전.png","image/시계방향2.png","image/반시계 방향 2.png","image/꺼내기.png","image/만있 꺼내기.png","image/만있 굳히고 꺼내기.png","image/만없 꺼내기.png"];
var keylist = ['Q','W','E','R','T','A','S','D','F','Z','X','C','V'];

function doit(key) {
    times++;
    $('#imagepreview').attr('src',imglist[keylist.indexOf(key.toUpperCase())]);
    $('#dododo').val(key.toUpperCase());
    var tmpkey = key.toLowerCase();
    switch (tmpkey) {
        case 'q': //Q -> 초콜릿 짜기
            guchigi()
            colour[index % 10] = 1;
            refresh()
            break;

        case 'w': // W -> 만약 초콜릿 없다면 초콜릿 짜기
            if (colour[index % 10] == 0) {
                guchigi()
                colour[index % 10] = 1;
                refresh()
                break;
            }
            else {
                refresh()
                break;
            }

        case 'e': // E -> 스위치
            if (colour[index % 10] == 0) {
                guchigi()
                colour[index % 10] = 1;
                refresh()
                break;
            }
            else {
                putaway()
                guchigi()
                break;
            }

        case 'r': // R -> 만있 시계 1 회전
            if (colour[index % 10] != 0) {
                guchigi();
                rotate(true);
                break;
            }
            else {
                break;
            }
        case 't': // T -> 만있 반시계 1 회전
            if (colour[index % 10] != 0) {
                guchigi();
                rotate(false);
                break;
            }
            else {
                break;
            }

        case 'a': // A -> 시계 1 회전
            guchigi();
            rotate(true);
            break;
        case 's': // S -> 반시계 1 회전
            guchigi();
            rotate(false);
            break;
        case 'd': // D -> 시계 2 회전
            guchigi();
            rotate(true);
            rotate(true);
            break;
        case 'f': // F -> 반시계 2 회전
            guchigi();
            rotate(false);
            rotate(false);
            break;

        case 'z': // Z -> 꺼내기
            putaway();
            guchigi();
            break;
        case 'x': // X -> 만있 꺼내기
            if (colour[index % 10] != 0) {
                putaway();
                guchigi();
                break;
            }
            else {
                break;
            }
        case 'c': // C -> 만있 바로 굳히고 꺼내기
            if (colour[index % 10] != 0) {
                guchigi();
                colour[index % 10] = 4;
                refresh()
                setTimeout(function () {
                    putaway();
                    document.getElementById("chocolateNumber").innerHTML = " x " + chocolate;
                }, 500); //delay [ms]
                break;
            }
            else {
                break;
            }

        case 'v': // V -> 만없 제거하기
            if (colour[index % 10] == 0) {
                putaway();
                guchigi();
                break;
            }
            else {
                break;
            }

        default:
            times--;
    }
    document.getElementById("chocolateNumber").innerHTML = " x " + chocolate;
    document.getElementById("cardNumber").innerHTML = " 카드 사용 횟수 : " + times;
    // console.log('Items : ' + times);
    // console.log(colour)
    // console.log(chocolate)

}

$('#bag').css('margin-top', '-70px');
$('#commandworld').css('left', '0');

$(document).keypress(function (event) {
    doit(event.key);
    console.log(event.key);
});




// longkey

var longkeyindex =0;
var strr= [];
$('#longkey').click(()=>{
    var code = prompt('실행할 코드를 입력하세요 : ')
        strr = code.split('');

        doitatall();  
});


function doitatall(){
    if(longkeyindex < strr.length){
        setTimeout(function () {
            doit(strr[longkeyindex])
            console.log(strr[longkeyindex]);
            longkeyindex++;
            doitatall();
        }, 500);
    }else{
        clearCanvas();
        $('#doneworld').css('opacity','0');
        setTimeout(function(){
            $('canvas').show();
            $('#doneworld').show();
            $('#doneworld').css('opacity','1');
            $('#chocolateNumber2').html($('#chocolateNumber').html());
            mySound.play();
        },1200)
    }
}

function hideall(){

}

$('#closeresult').click(()=>{
    $('#doneworld').hide();
    $('canvas').hide();
    $('#myCanvas').show();
});




var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    mousePos = {
        x: 400,
        y: 300
    },

    // create canvas
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    particles = [],
    rockets = [],
    MAX_PARTICLES = 400,
    colorCode = 0;

// init
$(document).ready(function() {
    document.body.appendChild(canvas);
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    setInterval(launch, 800);
    setInterval(loop, 1000 / 50);
});

// update mouse position
$(document).mousemove(function(e) {
    e.preventDefault();
    mousePos = {
        x: e.clientX,
        y: e.clientY
    };
});

// launch more rockets!!!
$(document).mousedown(function(e) {
    for (var i = 0; i < 5; i++) {
        launchFrom(Math.random() * SCREEN_WIDTH * 2 / 3 + SCREEN_WIDTH / 6);
    }
});

function launch() {
    launchFrom(mousePos.x);
}

function launchFrom(x) {
    if (rockets.length < 10) {
        var rocket = new Rocket(x);
        rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
        rocket.vel.y = Math.random() * -3 - 4;
        rocket.vel.x = Math.random() * 6 - 3;
        rocket.size = 8;
        rocket.shrink = 0.999;
        rocket.gravity = 0.01;
        rockets.push(rocket);
    }
}

function loop() {
    // update screen size
    if (SCREEN_WIDTH != window.innerWidth) {
        canvas.width = SCREEN_WIDTH = window.innerWidth;
    }
    if (SCREEN_HEIGHT != window.innerHeight) {
        canvas.height = SCREEN_HEIGHT = window.innerHeight;
    }

    // clear canvas
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    var existingRockets = [];

    for (var i = 0; i < rockets.length; i++) {
        // update and render
        rockets[i].update();
        rockets[i].render(context);

        // calculate distance with Pythagoras
        var distance = Math.sqrt(Math.pow(mousePos.x - rockets[i].pos.x, 2) + Math.pow(mousePos.y - rockets[i].pos.y, 2));

        // random chance of 1% if rockets is above the middle
        var randomChance = rockets[i].pos.y < (SCREEN_HEIGHT * 2 / 3) ? (Math.random() * 100 <= 1) : false;

/* Explosion rules
             - 80% of screen
            - going down
            - close to the mouse
            - 1% chance of random explosion
        */
        if (rockets[i].pos.y < SCREEN_HEIGHT / 5 || rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
            rockets[i].explode();
        } else {
            existingRockets.push(rockets[i]);
        }
    }

    rockets = existingRockets;

    var existingParticles = [];

    for (var i = 0; i < particles.length; i++) {
        particles[i].update();

        // render and save particles that can be rendered
        if (particles[i].exists()) {
            particles[i].render(context);
            existingParticles.push(particles[i]);
        }
    }

    // update array with existing particles - old particles should be garbage collected
    particles = existingParticles;

    while (particles.length > MAX_PARTICLES) {
        particles.shift();
    }
}

function Particle(pos) {
    this.pos = {
        x: pos ? pos.x : 0,
        y: pos ? pos.y : 0
    };
    this.vel = {
        x: 0,
        y: 0
    };
    this.shrink = .97;
    this.size = 2;

    this.resistance = 1;
    this.gravity = 0;

    this.flick = false;

    this.alpha = 1;
    this.fade = 0;
    this.color = 0;
}

Particle.prototype.update = function() {
    // apply resistance
    this.vel.x *= this.resistance;
    this.vel.y *= this.resistance;

    // gravity down
    this.vel.y += this.gravity;

    // update position based on speed
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // shrink
    this.size *= this.shrink;

    // fade out
    this.alpha -= this.fade;
};

Particle.prototype.render = function(c) {
    if (!this.exists()) {
        return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    var x = this.pos.x,
        y = this.pos.y,
        r = this.size / 2;

    var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
    gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
    gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

    c.fillStyle = gradient;

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
};

Particle.prototype.exists = function() {
    return this.alpha >= 0.1 && this.size >= 1;
};

function Rocket(x) {
    Particle.apply(this, [{
        x: x,
        y: SCREEN_HEIGHT}]);

    this.explosionColor = 0;
}

Rocket.prototype = new Particle();
Rocket.prototype.constructor = Rocket;

Rocket.prototype.explode = function() {
    var count = Math.random() * 10 + 80;

    for (var i = 0; i < count; i++) {
        var particle = new Particle(this.pos);
        var angle = Math.random() * Math.PI * 2;

        // emulate 3D effect by using cosine and put more particles in the middle
        var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

        particle.vel.x = Math.cos(angle) * speed;
        particle.vel.y = Math.sin(angle) * speed;

        particle.size = 10;

        particle.gravity = 0.2;
        particle.resistance = 0.92;
        particle.shrink = Math.random() * 0.05 + 0.93;

        particle.flick = true;
        particle.color = this.explosionColor;

        particles.push(particle);
    }
};

Rocket.prototype.render = function(c) {
    if (!this.exists()) {
        return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    var x = this.pos.x,
        y = this.pos.y,
        r = this.size / 2;

    var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
    gradient.addColorStop(1, "rgba(205, 205, 205, " + this.alpha + ")");

    c.fillStyle = gradient;

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
};


function clearCanvas()
{
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }