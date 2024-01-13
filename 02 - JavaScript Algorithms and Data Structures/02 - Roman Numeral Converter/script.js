const numberInput = document.getElementById("number");
const convertButton = document.getElementById("convert-btn");
const output = document.getElementById("output");

const numeralDict = {
    "1000": "M",
    "900": "CM",
    "500": "D",
    "400": "CD",
    "100": "C",
    "90": "XC",
    "50": "L",
    "40": "XL",
    "10": "X",
    "9": "IX",
    "5": "V",
    "4": "IV",
    "1": "I"
}

function onSubmit (e) {
    e.preventDefault();
    const string = numberInput.value;
    const number = parseInt(string);
    let result = "...";

    switch (true) {
        case number === NaN || string === "":
            result = "Please enter a valid number";
            break;
        case number < 0:
            result = "Please enter a number greater than or equal to 1";
            break;
        case number >= 4000:
            result = "Please enter a number less than or equal to 3999";
            break;
        default:
            result = convert(number);
    }

    output.textContent = result;
}

function convert(value) {
    let string = '';
    const numberValues = Object.keys(numeralDict).reverse();;

    numberValues.forEach((num) => {
        const numeral = numeralDict[num];
        while(value >= num) {
            value -= num;
            string += numeral;
            console.log(string)
        }
    })
    return string
}

// numberInput.addEventListener("submit", onSubmit);
convertButton.addEventListener("click", onSubmit);