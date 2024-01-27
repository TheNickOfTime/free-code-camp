export default function Controls(props) {
    return (
        <span className="controls">
            <span>I want to <strong id={`${props.label}-label`}>{props.label === "session" ? "work" : "take a break"}</strong> for </span>
            <button id={`${props.label}-decrement`} onClick={props.onClick}>-</button>
            <em><p id={`${props.label}-length`}>{props.length}</p></em>
            <button id={`${props.label}-increment`} onClick={props.onClick}>+</button>
            <em> minutes</em>
        </span>
    )
}