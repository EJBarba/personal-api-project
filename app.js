// Must Initialize select 2 dropdown to properly work
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



function convertToUrl( amount, category, difficulty, type) {
    // shorthand if statement 
     amount = amount == 'x' ? '' : `amount=${amount}` ;
     category = category ==  'x' ? '' : `&category=${category}`;
     difficulty = difficulty =='x' ? '' : `&difficulty=${difficulty}`;
     type = type == 'x' ? '' : `&type=${type}`;
    console.log('yo');
    return (`${baseUrl}${amount}${category}${difficulty}${type}`);
}

// update slider value on DOM
$(document).on('input', '.numQuestions', function() {
    $('.label').html( $(this).val() );
});

// get Url 
const baseUrl = 'https://opentdb.com/api.php?'; // if any var is not specified, it results to random
var amount = ''; // required // no. of questions
var category = '';  
var difficulty = ''; // easy || medium || hard
var type = ''; //multiple choice (multiple) || true/false (boolean)

$('.button').on('click',() => {

    //get values
    amount = $('.numQuestions').val();
    category = $('.dropdownCategory').val();
    difficulty = $('.dropdownDifficulty').val();
    type = $('.dropdownType').val();
    
    newUrl = convertToUrl(amount, category, difficulty, type);
    getRequest(newUrl);
});



function removeBody(){
    $('div.body').fadeOut(500, function() {
        $(this).addClass("flex");
        $(this).addClass("hide");
    });
    setTimeout(function(){ 
        $('div.mainGame').fadeIn(500, function() {
            $(this).removeClass("hide");
        });    
     }, 500);
   
}
function removeCard(){
    $('.showNext').addClass('hide');
    $('div.mainGame').fadeOut(500, function() {
        $(this).addClass("hide");
    });
    setTimeout(function(){ 
        $('div.body').fadeIn(500, function() {
            $(this).addClass("flex");
            $(this).removeClass("hide");
        
        });    
     }, 200);
    
}

//restart game
$('.restart').on('click', () => {
    $( ".body" ).fadeIn();
    $('.showNext').removeClass('hide');
    removeCard();
});

//shows next question
function showCard(resultsArray, questionAt){
    //resets the card
    $('.showNext').addClass('hide');
    $('.showChoices').text('#');
    $('.showChoices').removeClass('hide');
    $('.restart').addClass('hide');
    console.log(resultsArray);
    console.log(questionAt);
    let showAll = resultsArray[questionAt];
    let category = showAll.category;
    let difficulty = showAll.difficulty;
    let question = showAll.question;
    let correct_answer = showAll.correct_answer;
    let incorrect_answers = showAll.incorrect_answers;  
    let type = showAll.type;
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
      }
      
    var choice = [];
    choice.push(correct_answer);
    console.log(choice);
    incorrect_answers.forEach(element => {
        choice.push(element);
        shuffle(choice);
    });
    
    
    $('.showIcon').attr("src",`img/${category}.png`);
    $('.showCategory').text(`${category} || ${difficulty}`); 
    $('.showDifficulty').text(`${difficulty}`);
    $('.showQuestion').html(question).text();
    console.log(choice);
    choice.forEach((element, index) =>{
        $(`#${index}`).html(element).text();
    });  
    
    if(type == 'boolean'){
        $('#2').addClass('hide');
        $('#3').addClass('hide');
    }
    if(type == 'multiple'){
        $('#2').removeClass('hide');
        $('#3').removeClass('hide');
    }
   

} 

function showEnd(questionAt){
    //resets the card
    $('.showNext').addClass('hide');
    $('.showChoices').text('#');
    $('.restart').removeClass('hide');
    $('.showChoices').addClass('hide');
    fetch('https://api.kanye.rest/') // get a random Kanye West quote
    .then(res => res.json())
    .then(res => $('.showQuestion').html(`${res.quote} <br> -Kanye West`).text());
    
    $('.showIcon').attr("src",`img/winner.png`);
    $('.showCategory').text(`You answered ${questionAt}`); 
}

function disableClicks(){
    //pointer-events:none;
    $('.showChoices').css( "pointer-events", "none" );
    alert('disabled');
}

function enableClicks(){
    $('.showChoices').css( "pointer-events", "auto" );
}

function getRequest(newUrl){
    const request = async () => {
        const response = await fetch(newUrl);
        const json = await response.json();
        
        const resultsArray = json.results;
        
        if(json.response_code == 1){ 
            // Code 1: No Results Could not return results. 
            // The API doesn't have enough questions for your 
            // query. (Ex. Asking for 50 Questions in a
            // Category that only has 20.)
            console.log('nopes');
            alert('Sorry, we dont have enough questions for your query. Try Again.')
        }
        else{ // returned results successfully
            console.log(json);
            removeBody();
            let theCards = json.results;
            var questionAt = 0;
            showCard(theCards,questionAt);
             //shows next question
             $('.showNext').on('click', () => {
                 if(questionAt == theCards.length - 1){ // user answered all questions
                     showEnd(questionAt + 1);
                 }
                 else{
                    questionAt += 1;
                    showCard(theCards,questionAt);
                    console.log('correct' + theCards[questionAt].correct_answer);
                 }
            });
            $('div.showChoices').off('click').on('click',function() {
                var text = $(this).text();
                console.log(text);
                
                if(theCards[questionAt].correct_answer == text){
                    alert('u got it');
                    // turnGreen(this)
                    $('.showNext').removeClass('hide');
                    $('.restart').addClass('hide');
                }
                else{
                    $('.restart').removeClass('hide');
                    disableClicks();
                }
            });          
        }
        return json;
    }
    request()
}
