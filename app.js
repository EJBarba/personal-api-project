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

//restart game
$('.restart').on('click', () => {
 
    $( ".body" ).fadeIn();
});

function removeBody(){
    $('.body').fadeOut();
    setTimeout(() => {
        $('.mainGame').fadeIn();
    }, 2000)
    
}

//shows next question
function showCard(resultsArray, questionAt){
    console.log(resultsArray);
    console.log(questionAt);
    let showAll = resultsArray[questionAt];
    let category = showAll.category;
    let difficulty = showAll.difficulty;
    let question = showAll.question;
    let correct_answer = showAll.correct_answer;
    let incorrect_answers = showAll.incorrect_answers;  

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
    console.log(choice);
    function getChoices(){
        choice.forEach(element =>{
            let x = `<div class="showChoices">${element}</div>`
            $('.mainGame').append(x);
        });  
    }
   
    
    var getNext = $('.showNext').detach();
    let card = `
    <img class="showIcon" src="img/${category}.png" alt="">
    <h4 class="showCategory">${category} <span>| | </span> <span class="showDifficulty">${difficulty}</span></h4>
    <h1 class="showQuestion">${question}</h1>`;
    
    let firstQuestion = `<div class="showNext">Next Question -> </div>`;
    if (questionAt < 1){
        $('.mainGame').append(card);
        getChoices();
        $('.mainGame').append(firstQuestion);
       
        console.log('f')
    }
    else{
        $('.mainGame').empty();
        $('.mainGame').append(card);
        getChoices();
        $('.mainGame').append(getNext);
        $('div.showChoices').bind( "click", function() {
            var text = $(this).text();
            console.log(text);
            // do something with the text
            console.log(questionAt);
          });
        console.log("next");
    }
    
} 


// function turnGreen(correctAnswer){
    
//     $(".mainGame").css("border", "15px solid  green");
//     $('.showChoices').css("border", "5px solid  red");
//     $(correctAnswer).css("border", "5px solid  green");
//     $(correctAnswer).css('background-color', 'green');
    
// }
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
                questionAt += 1;
                showCard(theCards,questionAt);
                console.log('correct' + theCards[questionAt].correct_answer);
            });
            
            $('div.showChoices').click(function() {
                var text = $(this).text();
                console.log(text);
                
                if(theCards[questionAt].correct_answer == text){
                    alert('u got it');
                    // turnGreen(this)
                }
            
            });

         
            
                    
        }
        return json;
    }
    request()
    // mainGame.then(res => console.log(res))
    // //console.log(mainGame.then(console.log))
}



