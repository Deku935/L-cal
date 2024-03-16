let redMarkElement; // TO MARK INPUT BOXES RED 
let invalidInputIds = ""; // List of invalid input Ids.
let infoMessageString = ""; // messagae for info section.
let totalUnitAddition;
let singleUnitPrice = 0;
let billAmount = 0;
let totalPrice;
let textToBeCopied = "";

const oldReading = new Array(4);
const newReading = new Array(4);
const unitArray  = new Array(4);
const priceArray = new Array(4);

const copyPriceWithStar = new Array(4);

function calculateBill() {
    // RESETTING MESSAE BOX.
    infoMessageString = "";
    closeInfoWindow(); // Closes info popup if open;
    resetDashboard(); // resets dashboard if wrong input;

    // READING INPUT.
    for (let i = 0; i < oldReading.length; i++) {
        oldReading[i] = parseInt(document.getElementById("OldShop"+(i+1)).value);
        newReading[i] = parseInt(document.getElementById("NewShop"+(i+1)).value);
        redMarkElement = document.getElementById("OldShop"+(i+1));
        redMarkElement.style.border ="1px green solid";
        redMarkElement.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)";
        redMarkElement.style.marginBottom = "3px";
        redMarkElement = document.getElementById("NewShop"+(i+1));
        redMarkElement.style.border ="1px green solid";
        redMarkElement.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)";
        redMarkElement.style.marginBottom = "3px";
    } 
    // READING  VALIDATION.
    readingInputValidation(oldReading,newReading);
    
    // BILL AMOUNT INPUT.
    billAmount = parseInt(document.getElementById("BillAmount").value);
    redMarkElement = document.getElementById("BillAmount");
    redMarkElement.style.border ="1px green solid";
    redMarkElement.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)";
    // BILL AMOUNT VALIDATION.
    billInputValidation(billAmount);

    // CALLING TO MARK RED OUTLINE AND CHECK NO INPUT ERRORS.
    if(markRedInputBorder(invalidInputIds)){
        totalUnitAddition = 0;
        for(let i = 0; i < 4; i++){
           unitArray[i] =  newReading[i] - oldReading[i];
           totalUnitAddition = totalUnitAddition + unitArray[i];
        }

        // WARNING HANDLING ALL UNNIT DIFFERENCE IS ZERO
        let allUnitDiffZero = true;
        for(let i = 0; i < 4; i++){
            if(unitArray[i] !== 0){
                allUnitDiffZero = false;
            }
        }

        if(allUnitDiffZero){
            alertUnitDifferenceZero();
            return;
        }

        singleUnitPrice = billAmount/totalUnitAddition;
        totalPrice = 0;
        for(let i = 0; i < 4; i++){
            priceArray[i] = unitArray[i] * singleUnitPrice;
            totalPrice = totalPrice + roundNumber(priceArray[i]);
        }

        // UPDATE DASHBOARD
        updateDashBoard(totalPrice,singleUnitPrice,newReading,oldReading,unitArray,priceArray);

        greenDashBoardBorderAnimation();

        // UPDATE INFO SECTION
        alertSuccess();
        console.log(generateCopyText());
    }
    console.log(infoMessageString);
}

// UTILITY FUNCTIONS -----------------------------------------------------------------------
// FUNCTION TO ROUND THE DECIMAL VALUE
function roundNumber(num) {
    const decimalPart = num % 1; // Get the decimal part
    return decimalPart > 0.49 ? Math.ceil(num) : Math.floor(num);
}

// FUNCTION TO FORMAT STRING WITH BLANK SPACES AT END.
function formatString(str, length) {
    return str.padEnd(length, " ");
}

// FUNCTION TO PAD NUMBER USING 0000
function padNumber(num,len) {
    const numString = String(num);
    const paddingLength = len - numString.length; // Calculate padding length dynamically
    return paddingLength > 0 ? "0".repeat(paddingLength) + numString : numString;
}

// FUNCTION TO FORMAT DATE
function formatDate(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    const suffix = getDaySuffix(day);
  
    return `${day}${suffix} ${monthNames[monthIndex]} ${year}`;
  }
  
  function getDaySuffix(day) {
    if (day === 1 || day === 11 || day === 21 || day === 31) {
      return "st";
    }
    if (day === 2 || day === 12 || day === 22) {
      return "nd";
    }
    if (day === 3 || day === 13 || day === 23) {
      return "rd";
    }
    return "th";
  }

// INPUT VALIDATION FUNCTIONS -----------------------------------------------------------------------
// FUNCTION FOR READING INPUT VALIDATION.
function readingInputValidation(oldReading,newReading){
    invalidInputIds ="";

   for (let i = 0; i < oldReading.length; i++) {
        // CHECK FOR OLD READINGS: 1. NULL CHECK, 2.NEGATIVE VALUE CHECK.
        if(isNaN(oldReading[i])){                
            // COLLECTING INVALID IDs.
            invalidInputIds = invalidInputIds+"OldShop"+(i+1)+",";
            // MESSAGE TO DISPLAY AT INFO SECTION.
            infoMessageString = infoMessageString +"Please enter numerical value at Old Reading, Number"+(i+1)+".\n";
            // CHANGING INFO
            alertDanger();
        }else if(oldReading[i] < 0){
            invalidInputIds = invalidInputIds+"OldShop"+(i+1)+",";
            infoMessageString = infoMessageString +"Please enter a positive value for Old Reading, Number"+(i+1)+".\n";
            alertDanger();
        }

        // CHECK FOR NEW READINGS: 1. NULL CHECK, 2.NEGATIVE VALUE CHECK, 3.LESS VALUE CHECK.
        if(isNaN(newReading[i])){              
            invalidInputIds = invalidInputIds+"NewShop"+(i+1)+",";
            infoMessageString = infoMessageString +"Please enter numerical value at New Reading, Number"+(i+1)+".\n";
            alertDanger();
        }else if(newReading[i] < 0){
            invalidInputIds = invalidInputIds+"NewShop"+(i+1)+",";
            infoMessageString = infoMessageString +"Please enter a positive value for New Reading, Number"+(i+1)+".\n";
            alertDanger();
        }  
        if ( !isNaN(oldReading[i])  || !isNaN(newReading[i])) {
            if(oldReading[i] > newReading[i]){
                invalidInputIds = invalidInputIds+"NewShop"+(i+1)+",";
                infoMessageString = infoMessageString +"New reading cannot be smaller than old reading. Check Number"+(i+1)+".\n";
                alertDanger();
            }             
        }
    }
}

// FUNCTION FOR BILL INPUT VALIDATION.
function billInputValidation(billAmcount) {
    if(isNaN(billAmcount)){
        // MESSAGE TO DISPLAY AT INFO SECTION.
        infoMessageString = infoMessageString +"Please enter numerical value at Bill Amount.\n";
        // COLLECTING INVALID IDs
        invalidInputIds = invalidInputIds+"BillAmount";
        // CHANGING INFO
        alertDanger();
    }else if(billAmcount <= 0){
        infoMessageString = infoMessageString +"Please enter a positive value for the Bill Amount.\n";
        invalidInputIds = invalidInputIds+"BillAmount";
        alertDanger();
    }
}

// FUNCTION TO MARK RED BORDER.
function markRedInputBorder(invalidIds){
    let invalidIdArray;
    
    if(invalidIds.slice(-1) === ","){
        invalidIdArray = invalidIds.slice(0,invalidIds.length-1).split(",");
    }else{
        invalidIdArray = invalidIds.split(",");
    }

    if(invalidIdArray[0] !== ''){
        for(let i=0; i<invalidIdArray.length; i++){
            redMarkElement = document.getElementById(invalidIdArray[i]);
            redMarkElement.style.border ="1px red solid";
            redMarkElement.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.2)";
        }
    }else{
        return true;
    }

}

// FUNCTION TO UPDATE DASH BOARD -----------------------------------------------------------------------
function updateDashBoard(totalPrice,singleUnitPrice,newReading,oldReading,unitArray,priceArray){
    
    const dbTitle = document.getElementById("db-title");
    dbTitle.textContent = "Light Bill Calculated...";
    
    const dbTotalBill = document.getElementById("db-total-bill");
    dbTotalBill.textContent = `Total Bill : ${padNumber(totalPrice,4)}\u{20B9} \u00A0\u00A0\u00A0`;

    const dbSingleUnitPrice = document.getElementById("db-sup");
    dbSingleUnitPrice.textContent = `Single Unit Price : ${singleUnitPrice.toFixed(2)}\u{20B9}`;

    for(let i = 0; i < oldReading.length; i++){
        const nruData = document.getElementById("db-nru-"+(i+1));
        nruData.textContent =`${padNumber(newReading[i],4)} Units`;

        const oruData = document.getElementById("db-oru-"+(i+1));
        oruData.textContent =`${padNumber(oldReading[i],4)} Units`;

        const uaData = document.getElementById("db-ua-"+(i+1));
        uaData.textContent =`${padNumber(unitArray[i],2)} Units`;

        let roundedVal = roundNumber(priceArray[i]);
        if(roundedVal > Math.floor(priceArray[i])){
            const paData = document.getElementById("db-pa-"+(i+1));
            paData.textContent =`${padNumber(roundedVal,4)}\u{20B9}*`;
            copyPriceWithStar[i] = `${padNumber(roundedVal,4)}\u{20B9}*`;
        }else{
            const paData = document.getElementById("db-pa-"+(i+1));
            paData.textContent =`${padNumber(roundedVal,4)}\u{20B9}`;
            copyPriceWithStar [i] = `${padNumber(roundedVal,4)}\u{20B9}`;
        }
    }
}

// FUNCTIONS FOR INFO SECTION -----------------------------------------------------------------------
// COMMON FUNCTION FOR ALERT DANGER
function alertDanger(){
    changeInfoToIconToTriangle();
    changeInfoRed();
    changeInfoTextToDanger();
}

// COMMON FUNCTION FOR INFO (DEFAULT)
function alertInfo(){
    changeInfoToIconToInfo();
    changeInfoBlue();
    changeInfoTextToInfo();
}

// COMMON FUNCTION FOR SUCCESS 
function alertSuccess(){
    changeInfoToIconToCircle();
    changeInfoGreen();
    changeInfoTextToSuccess();
}

// COMMON FUNCTION FOR WARNING => ALL UNIT DIFFERENCE IS ZERO
function alertUnitDifferenceZero(){
    changeInfoToIconToTriangle();
    changeInfoYellow();
    changeInfoTextToWarning();
}

// CHANGE INFO ICON TO TRIANGLE
function changeInfoToIconToTriangle(){
    const alertIcon = document.getElementById("alert-icon");
    alertIcon.setAttribute("xlink:href", "#exclamation-triangle-fill");
}

// CHANGE INFO ICON TO INFO
function changeInfoToIconToInfo(){
    const alertIcon = document.getElementById("alert-icon");
    alertIcon.setAttribute("xlink:href", "#info-fill");
}

// CHANGE INFO ICON TO CIRCLE
function changeInfoToIconToCircle(){
    const alertIcon = document.getElementById("alert-icon");
    alertIcon.setAttribute("xlink:href", "#check-circle-fill");
}

// CHANGE INFO BG TO RED
function changeInfoRed(){
    const alertColor = document.getElementById("info-section");
    alertColor.classList.remove("alert-info");
    alertColor.classList.remove("alert-success");
    alertColor.classList.remove("alert-warning");
    alertColor.classList.add("alert-danger");
    redInfoBorderAnimation();
}

// CHANGE INFO BG TO GREEN
function changeInfoGreen(){
    const alertColor = document.getElementById("info-section");
    alertColor.classList.remove("alert-info");
    alertColor.classList.remove("alert-danger");
    alertColor.classList.remove("alert-warning");
    alertColor.classList.add("alert-success");
}

// CHANGE INFO BG TO YELLOW
function changeInfoYellow(){
    const alertColor = document.getElementById("info-section");
    alertColor.classList.remove("alert-info");
    alertColor.classList.remove("alert-danger");
    alertColor.classList.remove("alert-success");
    alertColor.classList.add("alert-warning");
    redInfoBorderAnimation();
}

// CHANGE INFO TEXT TO RED.
function changeInfoTextToDanger(){
    const alertText = document.getElementById("info-text");
    alertText.innerHTML = "The input seems invalid. Please ";
    alertText.appendChild(createSpanDanger());
    alertText.insertAdjacentHTML('beforeend', ' for further details.');
}

function createSpanDanger(){
    const errorSpan = document.createElement("span");
    errorSpan.textContent = "click here";  
    errorSpan.id = "error-info-details";
    errorSpan.addEventListener("click", openInfoWindow); 
    return errorSpan;
}

// CHANGE INFO TEXT TO YELLOW.
function changeInfoTextToWarning(){
    const alertText = document.getElementById("info-text");
    alertText.textContent = "Difference between all units are 0s, calculation can't be done.";
}

// CHANGE INFO TEXT TO GREEN.
function changeInfoTextToSuccess(){
    const alertText = document.getElementById("info-text");
    alertText.innerHTML = "Results are available. ";
    alertText.appendChild(createSpanSuccess());
    alertText.insertAdjacentHTML('beforeend', ' to copy results.');
}

function createSpanSuccess(){
    const successSpan = document.createElement("span");
    successSpan.textContent = "click here";  
    successSpan.id = "success-copy-result";
    successSpan.addEventListener("click", copyText); 
    return successSpan;
}

// FUNCTIONS FOR COPY FUNCTIONALITY -----------------------------------------------------------------------
function generateCopyText(){
    const today = new Date();
    const formattedDate = formatDate(today);
    const jockey = formatString("Jockey", 15)+formatString(padNumber(newReading[0],4)+" Units", 15)+formatString(padNumber(oldReading[0],4)+" Units", 15)+formatString(padNumber(unitArray[0],2)+" Units", 15)+formatString(priceArray[0].toFixed(2)+"\u{20B9}", 15)+copyPriceWithStar[0]+"\n";
    const electronics = formatString("Electronics", 15)+formatString(padNumber(newReading[1],4)+" Units", 15)+formatString(padNumber(oldReading[1],4)+" Units", 15)+formatString(padNumber(unitArray[1],2)+" Units", 15)+formatString(priceArray[1].toFixed(2)+"\u{20B9}", 15)+copyPriceWithStar[1]+"\n";
    const kidsWare = formatString("Kidsware", 15)+formatString(padNumber(newReading[2],4)+" Units", 15)+formatString(padNumber(oldReading[2],4)+" Units", 15)+formatString(padNumber(unitArray[2],2)+" Units", 15)+formatString(priceArray[2].toFixed(2)+"\u{20B9}", 15)+copyPriceWithStar[2]+"\n";
    const cloths=formatString("Cloths", 15)+formatString(padNumber(newReading[3],4)+" Units", 15)+formatString(padNumber(oldReading[3],4)+" Units", 15)+formatString(padNumber(unitArray[3],2)+" Units", 15)+formatString(priceArray[3].toFixed(2)+"\u{20B9}", 15)+copyPriceWithStar[3]+"\n\n";

    textToBeCopied = "Calculated on : "+formattedDate+".\n\n"+formatString("Shop Name", 15)+formatString("New Readings",15)+formatString("Old Readiings",15)+formatString("Unit",15)+formatString("Price",15)+"Final Price\n";
    textToBeCopied = textToBeCopied+jockey+electronics+kidsWare+cloths;
    textToBeCopied = textToBeCopied+"Single Unit Price : "+singleUnitPrice.toFixed(2)+"\u{20B9} \nOriginal Bill : "+billAmount+"\u{20B9} \nTotal Calculated Bill : "+totalPrice+"\u{20B9}";
    
    return textToBeCopied;
}

// FUNCTION TO COPY TEXT TO CLIPBOARD
function copyText(){   
    const textToCopy = generateCopyText();
    navigator.clipboard.writeText(textToCopy).then(function() {
        alert("Text copied to clipboard!\nClick OK to continue.");
    }).catch(function(err) {
        console.error("Failed to copy text: ", err);
    });
}


// RESET DASHBOARD -----------------------------------------------------------------------
function resetWindow(){
    window.location.reload();
}

function resetDashboard(){
    const dbTitle = document.getElementById("db-title");
    dbTitle.textContent = "Calculations to be done !!!";
    
    const dbTotalBill = document.getElementById("db-total-bill");
    dbTotalBill.textContent = `Total Bill : 0000\u{20B9} \u00A0\u00A0\u00A0`;

    const dbSingleUnitPrice = document.getElementById("db-sup");
    dbSingleUnitPrice.textContent = `Single Unit Price : 00.00\u{20B9}`;

    for(let i = 0; i < 4; i++){
        const nruData = document.getElementById("db-nru-"+(i+1));
        nruData.textContent =`0000 Units`;

        const oruData = document.getElementById("db-oru-"+(i+1));
        oruData.textContent =`0000 Units`;

        const uaData = document.getElementById("db-ua-"+(i+1));
        uaData.textContent =`00 Units`;

        const paData = document.getElementById("db-pa-"+(i+1));
        paData.textContent =`0000\u{20B9}*`;
    }
}



// FUNCTION TO ANIMATE INFO BORDER RED  DASHBOARD BORDER GREEN -----------------------------------------------------------------------
function redInfoBorderAnimation(){
    const targetDiv = document.getElementById("info-section");
    targetDiv.classList.add("animated-border-red");
    setTimeout(function() {
        targetDiv.classList.remove("animated-border-red");
    }, 800);
}

function greenDashBoardBorderAnimation(){
    const targetDiv = document.getElementById("dash-board-id");
    targetDiv.classList.add("animated-border-green");
    setTimeout(function() {
        targetDiv.classList.remove("animated-border-green");
    }, 800);
}

// POPUP FUNCTIONALITY -----------------------------------------------------------------------
function generatePopupErrorMessages(){
    const para = document.getElementById("popup-message-id");
    para.innerHTML = infoMessageString.replace(/\n/g, "<br>");
}

function openInfoWindow(){
    const displayPopup = document.getElementById("my-custom-popup");
    displayPopup.classList.remove("hidden-popup");
    generatePopupErrorMessages();
}

function closeInfoWindow(){
    const displayPopup = document.getElementById("my-custom-popup");
    displayPopup.classList.add("hidden-popup");
}