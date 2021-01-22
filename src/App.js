import React, { useState, useEffect } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.css";

function Timer(props) {
	return (
		<React.Fragment>
			<div id="timer-wrapper">
				<p id="timer-label">{props.label}</p>
				<h1 id="time-left">{props.session}</h1>
			</div>
			<button id="start_stop" onClick={props.handleStartStop}>
				<i class="fas fa-play"></i>
				<i class="fas fa-pause"></i>
			</button>

			<i id="reset" class="fas fa-sync" onClick={props.handleReset}></i>
			<audio
				id="beep"
				src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
			></audio>
		</React.Fragment>
	);
}

function Lengths(props) {
	return (
		<div id="Labels">
			<div id="break-label">
				<h3>Break Length</h3>
				<i
					class="fas fa-angle-down"
					id="break-decrement"
					onClick={props.handlebreakDecrease}
				></i>

				<span id="break-length">{props.breakLength}</span>
				<i
					class="fas fa-angle-up"
					id="break-increment"
					onClick={props.handlebreakIncrease}
				></i>
			</div>
			<div id="session-label">
				<h3>Session Length</h3>
				<i
					id="session-decrement"
					class="fas fa-angle-down"
					onClick={props.handlesessionDecrease}
				></i>
				<span id="session-length">{props.sessionLength}</span>
				<i
					id="session-increment"
					class="fas fa-angle-up"
					onClick={props.handlesessionIncrease}
				></i>
			</div>
		</div>
	);
}

function App() {
	const [breakLength, SetbreakLength] = useState(5);
	const [sessionLength, SetsessionLength] = useState(25);
	const [start, Setstart] = useState(false);
	const [sessionRun, SetsessionRun] = useState(true);
	const [timeLeft, SetTimeLeft] = useState({
		minutes: sessionLength,
		seconds: 0,
	});
	const [label, setLabel] = useState("Session");

	var val;
	const breakIncrease = () => {
		if (start === false && breakLength < 60) {
			SetbreakLength(breakLength + 1);
		}
	};

	const breakDecrease = () => {
		if (breakLength > 1 && start === false) {
			SetbreakLength(breakLength - 1);
		}
	};

	const sessionIncrease = () => {
		if (start === false && sessionLength < 60) {
			SetsessionLength(sessionLength + 1);
			SetTimeLeft({ minutes: sessionLength + 1, seconds: 0 });
		}
	};

	const sessionDecrease = () => {
		if (sessionLength > 1 && start === false) {
			SetsessionLength(sessionLength - 1);
			SetTimeLeft({ minutes: sessionLength - 1, seconds: 0 });
		}
	};

	const reset = () => {
		SetbreakLength(5);
		SetsessionLength(25);
		SetTimeLeft({ minutes: 25, seconds: 0 });
		Setstart(false);
		SetsessionRun(true);
		setLabel("Session");

		const holdon = document.getElementById("beep");
		holdon.pause();
		holdon.currentTime = 0;
	};

	const handleStartStop = () => {
		if (start === true) {
			Setstart(false);
		} else {
			Setstart(true);
		}
	};

	useEffect(() => {
		if (start === true) {
			if (timeLeft.seconds === 0 && timeLeft.minutes === 0) {
				soundAlarm();
			}

			val = setInterval(() => {
				SetTimeLeft((prevTime) => {
					if (prevTime.seconds === 0) {
						return { minutes: prevTime.minutes - 1, seconds: 59 };
					} else {
						return { ...prevTime, seconds: prevTime.seconds - 1 };
					}
				});
			}, 1000);
		}
		return () => clearInterval(val);
	});

	const soundAlarm = () => {
		const sound = document.getElementById("beep");

		sound.play();

		if (sessionRun) {
			SetTimeLeft({ minutes: breakLength, seconds: 0 });
			SetsessionRun(false);
			setLabel("Break");
		} else {
			SetTimeLeft({ minutes: sessionLength, seconds: 0 });
			SetsessionRun(true);
			setLabel("Session");
		}
	};

	return (
		<div id="wrapper">
			<h1 id="trial">25 + 5 Clock</h1>
			<Lengths
				sessionLength={sessionLength}
				breakLength={breakLength}
				handlebreakIncrease={breakIncrease}
				handlebreakDecrease={breakDecrease}
				handlesessionIncrease={sessionIncrease}
				handlesessionDecrease={sessionDecrease}
			/>
			<Timer
				handleReset={reset}
				session={`${
					timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes
				}:${timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}`}
				handleStartStop={handleStartStop}
				label={label}
			/>
		</div>
	);
}

export default App;
