const input = document.getElementById("user-input");
const result = document.getElementById("results-div");
const dialButtons = [...document.getElementsByClassName("dial-button")];
const checkButton = document.getElementById("check-btn");
const clearButton = document.getElementById("clear-btn");

const defaultResultText = result.textContent;
const phoneRegexs = [
    /^(1 |1)?\d{10}$/, //9999999999
    /^(1 |1)?\d{3}(\s|-)\d{3}(\s|-)\d{4}$/, //999-999-9999 || //999 999 9999
    /^(1 |1)?(\(\d{3}\))(\s)?\d{3}(\s|-)?\d{4}$/, //(999) 999 9999 || //(999) 999-9999 || (999)9999999
]

input.addEventListener("submit", checkInput);
input.addEventListener("input", toggleClearButton);
checkButton.addEventListener("click", checkInput);
clearButton.addEventListener("click", clearInput);
for (let button in dialButtons) {
    dialButtons[button].addEventListener("click", (button) => {
        input.value += button.target.textContent;
        toggleClearButton();
    });
}

function checkInput(e) {
    e.preventDefault();

    const phoneNumber = input.value;

    if(!phoneNumber) {
        alert("Please provide a phone number");
        return
    }

    const isValid = phoneRegexs.some((regex) => regex.test(phoneNumber))

    result.textContent = `${isValid ? "Valid" : "Invalid"} US number: ${phoneNumber}`;
}

function clearInput(e) {
    e.preventDefault();

    input.value = "";
    toggleClearButton();
    result.textContent = '';
}

function toggleClearButton() {
    clearButton.style.visibility = input.value !== "" ? "visible" : "hidden";
}