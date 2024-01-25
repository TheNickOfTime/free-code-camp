import * as React from 'react'
import { useState, useRef } from 'react'

export default function DrumPad(props) {

    const audioRef = useRef();

    const onClick = async () => {
        await audioRef.current.play();
        props.clickAction(props.data);
    }
    
    if (props.data) {
        return (
            <button id={`drum-pad-${props.data.letter}`} className='drum-pad' onClick={onClick}>
                {props.data.letter}
                <audio ref={audioRef} id={props.data.letter} className='clip' src={props.data.audio} onClick={() => console.log("wow")} />
                {/* {console.log()} */}
            </button>
        )
    }
}