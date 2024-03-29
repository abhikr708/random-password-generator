// slider control
let inputSlider = document.querySelector('.slider');
let lengthDisplay = document.querySelector('[passLength]');

let passwordLength = 10;
handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
}

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider(); //update the input slider value and display value
});

//generate random inputs
function getRanInterger(min, max){
    return Math.floor(Math.random()*(max-min)+min)
}
const symbols = `!@#$%^&*()_+-=[]\{}|;':",./<>?`;

// getrandom uppercase
function getRanUpperCase(){
    return String.fromCharCode(getRanInterger(65, 91));
}

// getrandom lowercase
function getRandomLowerCase(){
    return String.fromCharCode(getRanInterger(97, 123));
}

//get random numbers
function getRanNumbers(){
    return getRanInterger(0,9);
}

//get random symbols
function getRanSymbols(){
    let index = getRanInterger(0, symbols.length);
    return symbols[index];
}

// Strength Color Based on Password 
let indicator = document.querySelector('.indicator');

// Set Indicator 
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

// Default Indicator 
setIndicator("#ccc");


//____Set the strength logic
const UpCase = document.querySelector('#upperCase');
const LowCase = document.querySelector("#lowerCase");
const num = document.querySelector("#numbers");
const sym = document.querySelector('#symbols');

function passStrength(){
    isUpper = false;
    isLower = false;
    isNumber = false;
    isSymbol = false;

    if(UpCase.checked) isUpper = true;
    if(LowCase.checked) isLower = true;
    if(num.checked) isNumber = true;
    if(sym.checked) isSymbol = true;

    if(isUpper && isLower && (isNumber||isSymbol) && passwordLength>=8){
        setIndicator('#4cca11');
    }
    else if((isUpper||isLower) && (isNumber||isSymbol) && passwordLength>=6){
        setIndicator('#ecde0f');
    }
    else
    {
        setIndicator('#d10e0e');
    }
}

// copy password
const copyMsg = document.querySelector('[copyMsg]');
const copyBtn = document.querySelector('.copyBtn');
const passDisplay = document.querySelector('[passwordDisplay]');

async function copyMessage(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText = 'Copied';
    }
    catch(e){
        copied.innerText = 'Failed';
    }
    copyMsg.classList.add('active');

    setTimeout(()=>{
        copyMsg.classList.remove('active');
    }, 2000);
}

copyBtn.addEventListener('click', ()=>{
    if(passDisplay.value){
        copyMessage();
    }
});

//shuffle the array using Fisher yates method
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


//main machanism
let checkBoxes = document.querySelectorAll("input[type=checkbox]");

let checkCount = 0;

function handleCheckCounts(){
    checkCount = 0;
    checkBoxes.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

checkBoxes.forEach((checkbox)=>{
    checkbox.addEventListener('click', handleCheckCounts);
});

let password = "";
let generatePassword = document.querySelector(".generatePassword");

generatePassword.addEventListener('click', ()=>{
    if(checkCount<=0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //remove old password
    password ="";
    
    let funcArray = [];
    
    if(UpCase.checked){
        funcArray.push(getRanUpperCase);
    }
    if(LowCase.checked){
        funcArray.push(getRandomLowerCase);
    }
    if(num.checked){
        funcArray.push(getRanNumbers);
    }
    if(sym.checked){
        funcArray.push(getRanSymbols);
    }

    //compulsory addition
    for(let i=0; i<funcArray.length; i++){
        password+=funcArray[i]();
    }

    //additional addition
    for(let i=0; i<passwordLength-funcArray.length; i++){
        let index = getRanInterger(0, funcArray.length);
        password+=funcArray[index]();
    }

    password = shuffle(Array.from(password));
    passDisplay.value = password;
    passStrength();
})