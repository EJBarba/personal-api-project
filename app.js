// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
    $('.dropdownCategory').select2({
        placeholder: 'Select an option'
      });
    $('.dropdownDifficulty').select2({
    placeholder: 'Select an option'
    });
    $('.dropdownType').select2({
        placeholder: 'Select an option'
        });

    
});
const baseUrl = 'https://opentdb.com/api.php?'; // if any var is not specified, it results to random
var amount = '10'; // required // no. of questions
var category = '10';  
var difficulty = 'easy'; // easy || medium || hard
var type = 'multiple'; //multiple choice (multiple) || true/false (boolean)

// getVars gets called later, so the Vars are already overwritten
//will need temp vals
var amountTemp = amount;
var categoryTemp = category;
var difficultyTemp = difficulty;
var typeTemp = type;

function getVars(){
    return { amountTemp , categoryTemp , difficultyTemp , typeTemp }
}

// shorthand if statement 
amount = amount == 'x' ? '' : `amount=${amount}` ;
category = category ==  'x' ? '' : `&category=${category}`;
difficulty = difficulty =='x' ? '' : `&difficulty=${difficulty}`;
type = type == 'x' ? '' : `&type=${type}`;

var newUrl = `${baseUrl}${amount}${category}${difficulty}${type}`;
console.log(newUrl);

function getValues(){

}

function buttonEnter(){
    $('.button').on('click',() => {
        const vars = getVars();
        $('.body').fadeOut();
        getQuestions = $('.numQuestions').val();
        getCategory = $('.dropdownCategory').val();
        getDifficulty = $('.dropdownDifficulty').val();
        getType = $('.dropdownType').val();
        alert(getQuestions + getCategory + getDifficulty + getType);
        console.log(`${vars.amountTemp} - ${vars.categoryTemp} - ${vars.difficultyTemp} - ${vars.typeTemp} `);
    })
    
}

const request = async () => {
    const response = await fetch(newUrl);
    const json = await response.json();
    
    if(json.response_code == 1){ 
        // Code 1: No Results Could not return results. 
        // The API doesn't have enough questions for your 
        // query. (Ex. Asking for 50 Questions in a
        // Category that only has 20.)
        console.log('nopes');
    }
    else{ // returned results successfully
        console.log(json);
        // var category = json.results;
       
        getVars();
    }
    const btn = await buttonEnter();
    return 'yo';
}

var x = request();
console.log(x.then(console.log))