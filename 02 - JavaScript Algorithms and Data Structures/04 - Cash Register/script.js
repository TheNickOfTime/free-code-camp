const cash = document.getElementById("cash");
const priceText = document.getElementById("price");
const changeDue = document.getElementById("change-due");
const purchaseButton = document.getElementById("purchase-btn");

let price = 19.5;
let cid = [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];

let tenderValues = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.10,
    "QUARTER": 0.25,
    "ONE": 1.00,
    "FIVE": 5.00,
    "TEN": 10.00,
    "TWENTY": 20.00,
    "ONE HUNDRED": 100.00,
}

let isOpen = true;

purchaseButton.addEventListener("click", onPurchase);


priceText.textContent = `Price: $${price.toFixed(2)}`
changeDue.textContent = "Change Due: $0.00"

const fixPrecision = input => parseFloat(input.toFixed(2));

function onPurchase(e) {
    e.preventDefault();

    const cashAmount = parseFloat(cash.value);

    if (cashAmount < price) {
        alert("Customer does not have enough money to purchase the item");
    } else if (cashAmount === price) {
        changeDue.textContent = "No change due - customer paid with exact cash";
    }  else {
        changeDue.textContent = composeChangeDue(calculateChange(cashAmount));
    }
}

function calculateChange(amount) {
    const sortedDrawer = cid.slice(0).reverse();
    const drawerAmount = calculateTotalCid();
    let changeAmount = amount - price;
    let changeComp = {};

    // console.log(drawerAmount, changeAmount);

    //Check drawer
    if (drawerAmount < changeAmount) {
        return undefined
    }
    
    if(drawerAmount === changeAmount) {
        isOpen = false;
    }

    //Make change
    for (let tender in sortedDrawer) {
        const tenderName = sortedDrawer[tender][0]
        const tenderValue = tenderValues[tenderName];
        let tenderAmount = sortedDrawer[tender][1];
        const cidIndex = cid.indexOf(sortedDrawer[tender]);

        console.log(isOpen, tenderName, tenderValue, changeAmount);
        if (!isOpen && tenderValue <= changeAmount) {
            changeComp[tenderName] = 0;
            
        }

        while (changeAmount >= tenderValue && tenderAmount >= tenderValue) {
            changeAmount -= tenderValue;
            tenderAmount -= tenderValue;
            tenderAmount = fixPrecision(tenderAmount);
            changeComp[tenderName] ? changeComp[tenderName] += tenderValue : changeComp[tenderName] = tenderValue;
            changeAmount = fixPrecision(changeAmount);
        }
    }
    const returnCondition = changeAmount === 0;
    return returnCondition ? changeComp : undefined
}

function calculateTotalCid () {
    const total = cid.reduce((a, b) => a + b[1], 0);
    return fixPrecision(total)
}

function composeChangeDue(change) {
    let string = `Status: ${isOpen ? "OPEN" : "CLOSED"} `;
    
    if (change === undefined) {
        string = "Status: INSUFFICIENT_FUNDS";
        return string
    }

    const entries = Object.keys(change);
    entries.forEach(entry => {
        const subString = `${entry}: $${fixPrecision(change[entry])} `;
        string += subString;
    });

    console.log(string);

    return string.trim();
}