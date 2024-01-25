import React from 'react'
import DrumPad from './drum-pad';
import { useState, useEffect } from 'react';

export default function DrumMachine () {

    const padData = [
        {letter: "Q", name: "Piano 1", audio: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3"},
        {letter: "W", name: "Piano 2", audio: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3"},
        {letter: "E", name: "Piano 3", audio: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"},
        {letter: "A", name: "Symbol 1", audio: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3"},
        {letter: "S", name: "Symbol 2", audio: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3"},
        {letter: "D", name: "Symbol 3", audio: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3"},
        {letter: "Z", name: "Drum 1", audio: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3"},
        {letter: "X", name: "Drum 2", audio: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3"},
        {letter: "C", name: "Drum 3", audio: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"},
    ];

    const intitialComp = [
        {letter: ">"},
        {letter: "_"}
    ]

    const maxBeats = 23;

    let [drumPads, setDrumPads] = useState([]);
    let [composition, setComposition] = useState(intitialComp);
    let [lastBeatName, setLastBeatName] = useState("Press a key...")
    let [currentIndex, setCurrentIndex] = useState(1);
    let [isPlaying, setIsPlaying] = useState(false);

    const keyPressed = (data) => {
        // setLastBeatName(event.target.props.data.name)
        setLastBeatName(`${data.letter}: ${data.name}`)
        setComposition(() => {
            const newComp = composition.length < maxBeats ? [...composition, {letter: "_"}] : [...composition];
            newComp[currentIndex] = data;
            
            // console.log(newComp.length, currentIndex);

            return newComp;
        })
        setCurrentIndex(currentIndex + 1 < maxBeats ? currentIndex + 1 : 1);
    };

    const play = () => {
        setIsPlaying(!isPlaying);
        // console.log(isPlaying);
    };

    useEffect(() => {
        if (isPlaying) {
            playSequence();
        }
        console.log(isPlaying);
    }, [isPlaying])

    const playSequence = async () => {
        const filteredComp = composition.filter(entry => {
            return /[^>]/.test(entry.letter);
        });
        
        setCurrentIndex(1);

        for await (const comp of composition.slice(1)) {
            const audio = new Audio();
            const validEntry = comp.audio;
            // console.log(validEntry);

            if (validEntry && isPlaying) {
                audio.src = comp.audio;
                audio.play();
                setLastBeatName(comp.name)
                setCurrentIndex(currentIndex + 1);

                

                await new Promise(res => setTimeout(res, 1000));
            }
        }

        setIsPlaying(false)
        setCurrentIndex(composition.length - 1);
    }
    

    const reset = () => {
        setComposition(intitialComp);
        setCurrentIndex(1);
        setIsPlaying(false);
    };

    const forwardBack = (direction) => {
        const newIndex = Math.min(Math.max(currentIndex + direction, 1), composition.length - 1);
        // console.log(newIndex);
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            const validKey = document.getElementById(`drum-pad-${event.key.toUpperCase()}`);
            // console.log(event.key)
            if (validKey) {
                validKey.click();
            }
        })
    });

    return (
        <div id="drum-machine">
            <div id="track-display" class="display">
                {composition.map( (entry, index) => <span className={currentIndex === index ? "active-comp" : "inactive-comp"}>{entry.letter}</span> )}
            </div>
            <div id="controls">
                <div id="pads">
                    {padData.map( pad => <DrumPad data={pad} clickAction={keyPressed} /> )}
                </div>
                <div id="functions">
                    <div id="display" class="display">
                        {lastBeatName}
                    </div>
                    <div id="logo">
                        Beat-O-Matic
                    </div>
                    <div id="buttons-primary">
                        <button id="play" onClick={play}><i class="fa-solid fa-play" /> <i class="fa-solid fa-pause" /></button>
                        <button id="reset" onClick={reset}><i class="fa-solid fa-rotate-left" /></button>
                    </div>
                    <div id="buttons-secondary">
                        <button id="back" onClick={() => forwardBack(-1)}><i class="fa-solid fa-backward-step" /></button>
                        <button id="forward" onClick={() => forwardBack(1)}><i class="fa-solid fa-forward-step" /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}