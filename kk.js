'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}



/*
 * Complete the 'isCurrency' function below.
 *
 * The function is expected to return a BOOLEAN.
 * The function accepts STRING strAmount as parameter.
 */

function isCurrency(strAmount) {
    // Write your code here
    const dollarSign = String.fromCharCode(0x24);
    const euroSign = String.fromCharCode(0x20AC);
    const yenSign = String.fromCharCode(0xFFE5);
    
    //split strAmount
    let currSplit = strAmount.split("");
    let currSplitLen = currSplit.length;
    let firstChar = currSplit[0];
    let secondChar = currSplit[1];
    let lastChar = currSplit[currSplitLen - 1];
    
    //check for currency symbol
    function currencyCheck(str){
       if(str === euroSign || dollarSign || yenSign) {
            return true;
        }else {
            return false;
        } 
    } 
    
    // check for the number input
    function numberCheck(currency, numString) {
        // check for dollar case
        if (!numString.length) return false;
        
        // check for $0.00 and $0 case
        if (numString[0] === dollarSign) {
            if (numString[1] !== '.' && numString != '0') {
                return false;
            }
        }
        if (currency === yenSign) {
            // Yen amounts may not contain decimal points;
            if (numString.indexOf('.') > -1) {
                return false;
            }
        } else {
        // dollar and euro may contain an amount of cents, represented to exactly two digits of precision.
            if (numString.indexOf('.') > -1) {
                const replace = numString.replace(/\,/g, '');
                if (!(/^(0|0?[1-9]\d*)\.\d\d$/).test(replace)) {
                    return false;
                }
            }
        }

        if (numString.indexOf(',') > -1) {
            // the amount may optionally contain thousands separators using the ',' character.
            if (!(/^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/).test       (numString)) {
                return false;
            }
        }
            // remove all , seperator validation done on above step;
            const string = numString.replace(/\,/g, '');
            return !isNaN(Number(string)) && Number(string) >= 0;
    }
    
    //check if first character starts with a () 0r -
    if (firstChar === '(' ) {
        //check if the closing bracket is present
        if(lastChar !== ')'){
            return false
        }else{
            if (currencyCheck(secondChar)){
                let numStr = currSplit.slice(2, currSplit.length - 1).join('');
                return numberCheck(secondChar, numStr);
            }else {
                return false
            }
        }
    } else if (firstChar === '-') {
        if (currencyCheck(secondChar)) {
            const numStr = currSplit.slice(2).join('');
            return numberCheck(secondChar, numStr);
        } else {
            return false;
        }     
    } else if (currencyCheck(firstChar)) {
        const numStr = currSplit.slice(1).join('');
        return numberCheck(firstChar, numStr);
    } else {
        return false;
    }
    
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const strAmount = readLine();

    const result = isCurrency(strAmount);

    ws.write((result ? 1 : 0) + '\n');

    ws.end();
}
