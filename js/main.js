//Niloofar Zamani

"use strict";

function btnClick1() {
    states[currentState].btnClick1();
}
function btnClick2() {
    states[currentState].btnClick2();
}
function btnClick3() {
    states[currentState].btnClick3();
}

let mode = false; //a flag for clock format
let currentState = 'clock'; //initial state
let interval = null;
let lapClicked1 = false; //a flag to check if lap id is created or not
let lapClicked2 = false; // a flag for printing laps

let states = {
    clock: {
        render: renderClock,
        clock: '<span>00</span>:<span>00</span>:<span>00</span><span></span>',
        controller: '<button onClick="btnClick1()">12/24</button><button onClick="btnClick2()">Stopwatch</button><button onClick="btnClick3()">Timer</button>',
        btnClick1: function(){ //changes the format of clock
            mode = !mode;
            this.render();
        },
        btnClick2: function() { //changes the state to stopwatch
            document.getElementById("clock").innerHTML = states.stopwatch.clock;
            document.getElementById("controller").innerHTML = states.stopwatch.controller;
            currentState='stopwatch';
            clearInterval(interval);
        },
        btnClick3: function() { //changes the state to timer
            document.getElementById("clock").innerHTML = states.timer.clock;
            document.getElementById("controller").innerHTML = states.timer.controller;
            currentState = 'timer';
            clearInterval(interval);
        }
    },

    stopwatch: {
        render: renderStopwatch,
        clock: '<span>00</span>:<span>00</span>:<span>00</span><span></span>',
        controller: '<button onClick="btnClick1()">Back</button><button onClick="btnClick2()">Start</button>',
        counter: 0, //it'll be used in renderStopwatch
        btnClick1: function() { //changes the state to clock
            document.getElementById("clock").innerHTML = states.clock.clock;
            document.getElementById("controller").innerHTML = states.clock.controller;
            currentState='clock';
            clearInterval(interval);
            liveClock();
        },
        btnClick2: function() { //starts the stopwatch counting and changes the state to stopwatchRun
            document.getElementById("controller").innerHTML = states.stopwatchRun.controller;
            currentState = 'stopwatchRun';
            liveStopwatch();
        }
    },

    stopwatchRun: {
        controller: '<button onClick="btnClick1()">Stop</button><button onClick="btnClick2()">Lap</button>',
        btnClick1: function() { //stops the stopwatch and changes the state to stopwatchStop
            currentState = 'stopwatchStop';
            clearInterval(interval);
            document.getElementById("controller").innerHTML = states.stopwatchStop.controller;
        },
        btnClick2: function() { //creates lap section
            if (!lapClicked1) { //if lap is not created, it will be created
                let lap = document.createElement('div');
                let parent = document.body;
                parent.appendChild(lap);
                lap.id = "lap";
                lap.innerHTML = 'Laps:';
                lapClicked1 = true;
            }
            lapClicked2 = true; //this will be used in renderStopwatch for printing lap
        }
    },

    stopwatchStop: {
        controller: '<button onClick="btnClick1()">Resume</button><button onClick="btnClick2()">Restart</button>',
        btnClick1: function() { //resumes the stopwatch and changes the state to stopwatchRun
            document.getElementById("controller").innerHTML = states.stopwatchRun.controller;
            currentState = 'stopwatchRun';
            liveStopwatch();
        },
        btnClick2: function() { //stops the stopwatch and changes the state to stopwatch. also removes lap section
            document.getElementById("controller").innerHTML = states.stopwatch.controller;
            currentState = 'stopwatch';
            clearInterval(interval);
            document.getElementById("clock").innerHTML = states.stopwatch.clock;
            states.stopwatch.counter = 0; //counter should be 0 again for a new stopwatch
            if (lapClicked1) { //if lap was created, it will be removed
                document.body.removeChild(document.getElementById("lap"));
                lapClicked1 = false;
            }
        }
    },

    timer: {
        render: renderTimer,
        clock: `<input type="number" id="hour" name="hour" min="00" max="23" value="00" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">:
                <input type="number" id="minute" name="minute" min="00" max="59" value="00" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">:
                <input type="number" id="second" name="second" min="00" max="59" value="00" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">`,
        controller: '<button onClick="btnClick1()">Back</button><button onClick="btnClick2()">Start</button>',
        btnClick1: function() { //changes the state to clock
            document.getElementById("clock").innerHTML = states.clock.clock;
            document.getElementById("controller").innerHTML = states.clock.controller;
            currentState='clock';
            clearInterval(interval);
            liveClock();
        },
        btnClick2: function() { //starts the timer and changes the state to timerRun
            document.getElementById("controller").innerHTML = states.timerRun.controller;
            currentState = 'timerRun';
            states.timer.timerHour = document.getElementById("hour").value; //timerHour property will be created and its value is the value of the input with hour id
            states.timer.timerMinute = document.getElementById("minute").value; //timerMinute property will be created and its value is the value of the input with minute id
            states.timer.timerSecond = document.getElementById("second").value; //timerSecond property will be created and its value is the value of the input with second id

            states.timer.timerHour == "" ? states.timer.timerHour = "00" : states.timer.timerHour; //if the input with hour id didn't have value, timerHour value will be 00
            states.timer.timerMinute == "" ? states.timer.timerMinute = "00" : states.timer.timerMinute; //if the input with minute id didn't have value, timerMinute value will be 00
            states.timer.timerSecond == "" ? states.timer.timerSecond = "00" : states.timer.timerSecond; //if the input with second id didn't have value, timerSecond value will be 00

            states.timer.count = states.timer.timerHour * 3600 + states.timer.timerMinute * 60 + +states.timer.timerSecond; //count property will be created to be used in renderTimer
            document.getElementById("clock").innerHTML = `<span>${this.timerHour}</span>:<span>${this.timerMinute}</span>:<span>${this.timerSecond}</span><span></span>`;
            liveTimer();
        }
    },

    timerRun: {
        controller: '<button onClick="btnClick1()">Pause</button><button onClick="btnClick2()">Restart</button>',
        btnClick1: function() { //changes the state to timerPause and timer will be paused.
            currentState = 'timerPause';
            clearInterval(interval);
            document.getElementById("controller").innerHTML = states.timerPause.controller;
        },
        btnClick2: function() { //restarts the timer from the beginning
            document.getElementById("clock").innerHTML = '<span>' + states.timer.timerHour + '</span>:<span>' + states.timer.timerMinute + '</span>:<span>' + states.timer.timerSecond + '</span><span></span>';
            states.timer.count = states.timer.timerHour * 3600 + states.timer.timerMinute * 60 + +states.timer.timerSecond;
            clearInterval(interval);
            liveTimer();
        }
    },

    timerPause: {
        controller: '<button onClick="btnClick1()">Resume</button><button onClick="btnClick2()">Reset</button>',
        btnClick1: function() { //resumes the timer and changes the state to timerRun
            document.getElementById("controller").innerHTML = states.timerRun.controller;
            currentState = 'timerRun';
            liveTimer();
        },
        btnClick2: function() { //resets the timer and changes the state to timer
            document.getElementById("controller").innerHTML = states.timer.controller;
            currentState = 'timer';
            clearInterval(interval);

            //the time that we entered in the beginning will be in timer
            document.getElementById("clock").innerHTML = `<input type="number" id="hour" name="hour" min="00" max="23" value="${states.timer.timerHour}" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">:
            <input type="number" id="minute" name="minute" min="00" max="59" value="${states.timer.timerMinute}" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">:
            <input type="number" id="second" name="second" min="00" max="59" value="${states.timer.timerSecond}" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">`;
            states.timer.count = states.timer.timerHour * 3600 + states.timer.timerMinute * 60 + +states.timer.timerSecond;
        }
    }
};

function liveClock() {
    renderClock();
    interval = setInterval(()=>{
        states.clock.render();
    },1000);
}

function liveStopwatch() {
    interval = setInterval(()=>{
        states.stopwatch.render();
    },10);
}

function liveTimer() {
    interval = setInterval(()=>{
        states.timer.render();
    },1000);
}

function renderClock() {
    const now = new Date();
    const hour = now.getHours();
    [mode ? (hour > 12 ? hour - 12 : hour == 0 ? 12 : hour) : hour ,now.getMinutes(),now.getSeconds()].forEach((item,index)=>{
        if (item.toLocaleString('en',{minimumIntegerDigits:2}) !== document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText){
            document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText = item.toLocaleString('en',{minimumIntegerDigits:2});
        }
    })
    document.querySelector('#clock>span:last-of-type').innerText = mode ? (hour >= 12 ? 'pm' : 'am') : '';
}

function renderStopwatch() {
    states.stopwatch.counter++; //every 10 ms counter will be increased by 1
    const cSec = states.stopwatch.counter % 100; //value of millisecond will be from 0 to 99
    const counterSec = (states.stopwatch.counter - cSec) / 100; //this will count seconds
    const hour = Math.floor(counterSec / 3600); //value of hour
    const min = Math.floor((counterSec % 3600) / 60); //value of minute
    const sec = counterSec % 60; //value of second will be from 0 to 59
    [hour,min,sec,cSec].forEach((item,index)=>{
        if (item.toLocaleString('en',{minimumIntegerDigits:2}) !== document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText){
            document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText = item.toLocaleString('en',{minimumIntegerDigits:2});
        }
    })

    if (lapClicked2) { //if lapClicked2 is true (or if lap button is clicked) it will print current time of stopwatch
        let currentLap = document.getElementById("lap").innerHTML;
        currentLap += `<br>${hour.toLocaleString('en',{minimumIntegerDigits:2})}:${min.toLocaleString('en',{minimumIntegerDigits:2})}:${sec.toLocaleString('en',{minimumIntegerDigits:2})}.${cSec.toLocaleString('en',{minimumIntegerDigits:2})}`;
        document.getElementById("lap").innerHTML = currentLap;
        lapClicked2 = false;
    }
}

function renderTimer() {
    const hour = Math.floor(states.timer.count/3600); //value of hour
    const min = Math.floor((states.timer.count%3600)/60); //value of minute
    const sec = states.timer.count%60; //value of second
    [hour,min,sec].forEach((item,index)=>{
        if (item.toLocaleString('en',{minimumIntegerDigits:2}) !== document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText){
            document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText = item.toLocaleString('en',{minimumIntegerDigits:2});
        }
    })
    if (!states.timer.count--) { //decreases count by 1 and checks if count is 0 or not
        clearInterval(interval);

        //when count reaches 0, the state changes to timer
        currentState = 'timer';
        document.getElementById("controller").innerHTML = states.timer.controller;

        //the time that we entered in the beginning will be in timer
        document.getElementById("clock").innerHTML = `<input type="number" id="hour" name="hour" min="00" max="23" value="${states.timer.timerHour}" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">:
        <input type="number" id="minute" name="minute" min="00" max="59" value="${states.timer.timerMinute}" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">:
        <input type="number" id="second" name="second" min="00" max="59" value="${states.timer.timerSecond}" placeholder="00" onchange="if(parseInt(this.value,10)<10)this.value='0'+this.value;">`;
        states.timer.count = states.timer.timerHour * 3600 + states.timer.timerMinute * 60 + +states.timer.timerSecond;
    }
}

document.body.onload = liveClock; //when pages is loaded, liveClock will be executed