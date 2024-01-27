import { useState } from "react";
import Controls from "./controls";
import { useEffect } from "react";
import { useRef } from "react";

export default function Clock () {
    let [active, setActive] = useState(false);
    let [currentTime, setCurrentTime] = useState(0);
    let [breakLength, setBreakLength] = useState(5);
    let [sessionLength, setSessionLength] = useState(25);
    let [currentLength, setCurrentLength] = useState(25);
    let [currentMode, setCurrentMode] = useState("Session");
    let [nextMode, setNextMode] = useState("Break");
    let [modeStartTime, setModeStartTime] = useState(0);
    let [pauseTime, setPauseTime] = useState(0);

    let audio = useRef();

    const toggleActive = () => {
        const newState = !active;

        if (newState) {
            const previousTime = pauseTime - modeStartTime;
            // console.log(pauseTime - modeStartTime);
            setModeStartTime(new Date().getTime() - previousTime);
            console.log("Timer active");
        } else {
            setPauseTime(new Date().getTime())
            setCurrentLength
            console.log("Timer paused")
        }

        setActive(newState);
    }

    const getCurrentTime = () => {
        setInterval(() => setCurrentTime(new Date().getTime()), 1000);
    }

    useEffect(() => getCurrentTime)

    const reset = () => {
        setActive(false);
        setBreakLength(5);
        setSessionLength(25);
        setCurrentLength(25);
        setCurrentMode("Session");
        setNextMode("Break");
        setModeStartTime(0);
        setPauseTime(0);
        audio.current.pause();
        audio.current.currentTime = 0;
    }

    const getTimeLeft = () => {
        const msSince = Math.floor((active ? currentTime : pauseTime) - modeStartTime);
        const msLeft = currentLength * 1000 * 60 - msSince;
        const minutesLeft = Math.floor(msLeft / 1000 / 60);
        const secondsLeft = Math.floor(msLeft / 1000 - minutesLeft * 60);


        if (msLeft <= 0) {
            switchMode();
            audio.current.play();
        }

        return `${minutesLeft.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
    }

    const switchMode = () => {
        setModeStartTime(new Date());

        const newCurrent = nextMode;
        const newNext = currentMode;

        setCurrentMode(newCurrent);
        setNextMode(newNext);

        setCurrentLength(newCurrent === "Session" ? sessionLength : breakLength);
    }

    const updateLength = (event) => {
        const isIncrement = event.target.id.includes("increment");
        const isSession = event.target.id.includes("session");
        const isCurrent = currentMode === (isSession ? "Session" : "Break");

        let value = isIncrement ? 1 : -1;
        if (isSession) {
            value = Math.min(Math.max(sessionLength + value, 1), 60);
            setSessionLength(value);
        } else {
            value = Math.min(Math.max(breakLength + value, 1), 60);
            setBreakLength(value);
        }

        if(!active && isCurrent) {
            setCurrentLength(value);
        }
    }

    return (
        <div id="clock">
            <h1>This is a {sessionLength} + {breakLength} Clock...</h1>
            <div id="session-controls">
                <div><span><Controls label="session" length={sessionLength} onClick={updateLength} />, and then</span></div>
                <div><Controls label="break" length={breakLength} onClick={updateLength} /></div>
            </div>
            <div id="timer">
                <audio ref={audio} id="beep" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
                <span>
                    You are <span id="timer-label">
                        <em>{currentMode === "Session" ? "working" : "resting"}</em>
                    </span> for <span id="time-left">
                        <strong>{getTimeLeft()}</strong>
                    </span>, then <span id="next-label">
                        <em>{nextMode === "Session" ? "working" : "resting"}</em>
                    </span>.
                </span>
            </div>
            <div id="timer-controls">
                I want to <button id="start_stop" onClick={toggleActive} >{active ? "pause" : "start"}</button> / <button id="reset" onClick={reset}>reset</button> my clock.
            </div>
        </div>
    )
}