(function() {
"use strict";

var state = {
    currentQuestion: 0,
    currentAnswer: "",
    correctCount: 0
};

function escapeHTML(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function goToNextQuestion(state, isFirstQuestion=false) {
    if (!isFirstQuestion) state.currentQuestion += 1;

    if (state.currentQuestion < data.questions.length) {
        state.currentAnswer = data.questions[state.currentQuestion].answer;
        return true;
    } else {
        return false;
    }
}

function renderQuestionContent(state, element) {

    var questionSet = data.questions[state.currentQuestion];
    var question = escapeHTML(questionSet.question);
    var choices = questionSet.choices;

    var output = '<p>' + escapeHTML(questionSet.question) + '</p><ul>';
    for (var key in choices) {
        output += '<li><input type="radio" name="group" value="' + key + '"> ' + escapeHTML(choices[key]) + '</input></li>';
    }
    output += '</ul><button class="js-submit-button">Submit Answer</button>';

    element.html(output);
}


function validateAnswer(state, userSubmissionElement) {
    var choicesElement = userSubmissionElement.parent().parent();
    var questionSet = data.questions[state.currentQuestion];
    var answer = questionSet.answer;
    var userResponse = userSubmissionElement.val();

    choicesElement.find('input[value="' + answer + '"]').parent().addClass("correct");
    choicesElement.siblings(".js-submit-button").attr("disabled", "disabled");

    if (answer === userResponse) {
        state.correctCount++;
        return

    } else {
        userSubmissionElement.parent().addClass("incorrect");
        return
    }
}

function renderAnswerContent(state, element) {
    var output = '<button class="js-next-button">Go To Next Question</button>';

    element.html(output);
}

$(document).ready(function() {
    var startButton = $(".js-start-button");
    var questionContent = $(".js-question-content");
    var answerContent = $(".js-answer-content");

    startButton.click(function(event) {
        event.preventDefault();

        $(this).parent().addClass("hidden");
        questionContent.removeClass("hidden");

        goToNextQuestion(state, true);
        renderQuestionContent(state, questionContent);
    });

    // When submit answer clicked
    // - check if answer is correct
    // - show answer
    questionContent.on("click", ".js-submit-button", function(event) {
        event.preventDefault();

        // Get user answer
        var userSubmissionElement = $(this).siblings("ul").find("input[type='radio']:checked");
        var result = validateAnswer(state, userSubmissionElement);

        answerContent.removeClass("hidden");
        renderAnswerContent(state, answerContent);
    });

    answerContent.on("click", ".js-next-button", function(event) {
        event.preventDefault();

        console.log(state);

        answerContent.addClass("hidden");
        var hasNextQuestion = goToNextQuestion(state);

        if (hasNextQuestion) {
            renderQuestionContent(state, questionContent);
        } else {
            console.log("Done!");
        }
    });
});

})();
