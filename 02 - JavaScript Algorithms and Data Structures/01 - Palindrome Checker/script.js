const inputText = document.getElementById("text-input");
const checkButton = document.getElementById("check-btn");
const resultText = document.getElementById("result");

const emptyStringCheck = /^$/;
const singleLetterCheck = /^[a-z]{1}$/i;
const palindromeCheck = (dirtyString) => {
    const cleanString = dirtyString.replace(/[^a-z0-9]/gi, "").toLowerCase();
    const reverseString = cleanString.split('').reverse().join('');
    console.log(cleanString + ", " + reverseString)
    for (let i = 0; i < cleanString.length; i++) {
        if (cleanString[i] !== reverseString[i]) {
            return false
        }
    }
    return true
};


function throwAlert(text) {
    console.log("Alert: " + text);
    alert(text);
}

function outputResult(isPalindrome) {
    const result = isPalindrome ? "is a palindrome" : "is not a palindrome"
    resultText.innerText = `${inputText.value} ${result}`;

}

function onCheckRequested(e) {
    e.preventDefault();
    const query = inputText.value;

    switch (true) {
        case emptyStringCheck.test(query):
            throwAlert("Please input a value");
            break;
        case palindromeCheck(query):
            outputResult(true);
            break;
        default:
            outputResult(false);
            console.log("no regex match :(");
            break;
    }
}

inputText.addEventListener("submit", onCheckRequested);
checkButton.addEventListener("click", onCheckRequested);