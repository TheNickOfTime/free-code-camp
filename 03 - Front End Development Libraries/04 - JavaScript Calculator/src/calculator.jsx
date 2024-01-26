import { useEffect, useState } from "react"

export default function Calculator() {
    let [expression, setExpression] = useState("");
    let [current, setCurrent] = useState("0");

    const updateExpression = (event) => {
        event.preventDefault();
        const value = event.target.textContent;
        setExpression(() => {

            if (expression.length === 0) {
                return value;
            }
            const lastSymbol = expression.trim()[expression.length - 1].toString();
            const zeroRegEx = /[0]/;
            const lastSymbolRegEx = /[*/+-]/i;
            const currentSymbolRegex = /[*/+]/i;
            const negativeSymbolRegex = /[-]/;
            const decimalRegEx = /[.]/;

            // console.log(lastSymbol);

            switch (true) {
                case expression.includes("="):
                    if (lastSymbolRegEx.test(value) || decimalRegEx.test(value)) {
                        return current + value;
                    }
                    return value;
                case expression.length === 1 && zeroRegEx.test(lastSymbol) && zeroRegEx.test(value):
                    console.log("Pressed 0 when the only value was 0.")
                    return expression;
                case expression.length === 1 && zeroRegEx.test(lastSymbol) && !zeroRegEx.test(value) && !currentSymbolRegex.test(value):
                    console.log("The expression is currently '0' and the new input is not an operator or zero, replacing the 0 with the new input.");
                    return value;
                case current.includes(".") && decimalRegEx.test(value):
                    console.log("Current number already includes a decimal.")
                    return expression;
                case lastSymbolRegEx.test(lastSymbol) && currentSymbolRegex.test(value):
                    if (negativeSymbolRegex.test(lastSymbol)) {
                        return expression.slice(0, expression.length - 3) + value;
                    }
                    console.log("The previous and current symbols are both operators, swapping the previous operator for the current.");
                    return expression.slice(0, expression.length - 1) + value;
                case lastSymbolRegEx.test(lastSymbol) && negativeSymbolRegex.test(value):
                    if (negativeSymbolRegex.test(lastSymbol)) {
                        return expression.slice(0, expression.length - 3) + value;
                    }
                    console.log("The previous symbol was an operator, and the current is '-', adding a space to allow parsing.");
                    return expression + " " + value;
                default:
                    return expression + value;
                    
            }
        })

        setCurrent(() => {
            const symbolRegEx = /[*/+-]/i;
            const decimalRegex = /[.]/g;

            switch (true) {
                case expression.includes("="):
                    return value;
                case symbolRegEx.test(value) || symbolRegEx.test(current) || current === "0":
                    return value;
                case decimalRegex.test(current) && value === ".":
                    console.log("fuck");
                    return current;
                default:
                    return current + value;
            }
        })
    }

    useEffect(() => {
        // if(current === 110.5) {
        //     console.log("It did it", expression);
        // }
        console.log(expression, current);
    }, [expression]);

    const evaluteExpression = () => {
        const result = parseFloat(eval?.(`"use strict";(${expression})`).toFixed(4));
        setExpression(expression + " = " + result);
        setCurrent(result);
        // console.log(expression);
    }

    const clearExpression = () => {
        setExpression("")
        setCurrent("0")
    }

    return (
        <div id="calculator">
            <div id="screen">
                <div id="expression">
                    {expression}
                </div>
                <div id="display">
                    {current}
                </div>
            </div>
            <div id="buttons">
                <button id="clear" className="secondary" onClick={clearExpression}>AC</button>
                <button id="divide" className="tertiary" onClick={updateExpression}>/</button>
                <button id="multiply" className="tertiary" onClick={updateExpression}>*</button>

                <button id="seven" className="primary" onClick={updateExpression}>7</button>
                <button id="eight" className="primary" onClick={updateExpression}>8</button>
                <button id="nine" className="primary" onClick={updateExpression}>9</button>
                <button id="subtract" className="tertiary" onClick={updateExpression}>-</button>

                <button id="four" className="primary" onClick={updateExpression}>4</button>
                <button id="five" className="primary" onClick={updateExpression}>5</button>
                <button id="six" className="primary" onClick={updateExpression}>6</button>
                <button id="add" className="tertiary" onClick={updateExpression}>+</button>

                <button id="one" className="primary" onClick={updateExpression}>1</button>
                <button id="two" className="primary" onClick={updateExpression}>2</button>
                <button id="three" className="primary" onClick={updateExpression}>3</button>
                <button id="equals" className="secondary" onClick={evaluteExpression}>=</button>

                <button id="zero" className="primary" onClick={updateExpression}>0</button>
                <button id="decimal" className="primary" onClick={updateExpression}>.</button>
            </div>
        </div>
    )
}