(function() {
"use strict";

// requrire data variable - as var data;

var state = {
    currentQuestion: 0,
    currentAnswer: "",
    correctCount: 0,
    totalQuestions: 0
};

function escapeHTML(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function initializeState(state, data) {
    state.correctCount = 0;
    state.currentQuestion = 0;
    state.totalQuestions = data.questions.length;

    goToNextQuestion(state, true);
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

function renderScore(state, element) {
    var output = '<p>' + state.correctCount + ' correct, ' + (state.currentQuestion -  state.correctCount) + ' incorrect</p>';
    element.html(output);
}

function renderQuestionContent(state, element) {

    var questionSet = data.questions[state.currentQuestion];
    var question = escapeHTML(questionSet.question);
    var choices = questionSet.choices;

    var output = '<h3>Question ' + (state.currentQuestion + 1) + ' out of ' + state.totalQuestions + '</h3>';
    output += '<p>' + escapeHTML(questionSet.question) + '</p><ul>';
    for (var key in choices) {
        output += '<li><input type="radio" name="group" value="' + key + '"> ' + escapeHTML(choices[key]) + '</input></li>';
    }
    output += '</ul><button class="js-submit-button" disabled="disabled">Submit Answer</button>';

    element.html(output);
}

function validateAnswer(state, userSubmissionElement) {
    var choicesElement = userSubmissionElement.parent().parent();
    var questionSet = data.questions[state.currentQuestion];
    var answer = questionSet.answer;
    var userResponse = userSubmissionElement.val();

    choicesElement.find('input[value="' + answer + '"]').parent().addClass("correct");
    choicesElement.siblings(".js-submit-button").attr("disabled", "disabled");
    choicesElement.find('input[type="radio"]').attr("disabled", "disabled");

    if (answer === userResponse) {
        state.correctCount++;
        return true;

    } else {
        userSubmissionElement.parent().addClass("incorrect");
        return false;
    }
}

function renderAnswerContent(state, element, result) {
    var answer = '';

    if (result) {
        answer += "correct!";

    } else {
        answer += "incorrect.";
    }

    var output = ('<p>You got the answer ' + answer + '</p><button class="js-next-button">Go To Next Question</button>');

    element.html(output);
}

function renderEndContent(state, element) {
    var output = '<button class="js-restart-button">Restart Quiz</button>';

    element.html(output);
}

$(document).ready(function() {
    var startButton = $(".js-start-button");
    var questionContent = $(".js-question-content");
    var scoreContent = $(".js-score-content");
    var answerContent = $(".js-answer-content");
    var hasNextQuestion = false;

    startButton.click(function(event) {
        event.preventDefault();

        $(this).parent().addClass("hidden");
        questionContent.removeClass("hidden");
        scoreContent.removeClass("hidden");

        //Start Quiz
        initializeState(state, data);
        renderScore(state, scoreContent);
        renderQuestionContent(state, questionContent);
    });

    questionContent.on("click", "input", function(event) {
        $(".js-submit-button").prop("disabled", false);
    });

    questionContent.on("click", ".js-submit-button", function(event) {
        event.preventDefault();

        // Get user answer
        var userSubmissionElement = $(this).siblings("ul").find("input[type='radio']:checked");
        var result = validateAnswer(state, userSubmissionElement);

        hasNextQuestion = goToNextQuestion(state);
        renderScore(state, scoreContent);

        answerContent.removeClass("hidden");
        renderAnswerContent(state, answerContent, result);
    });

    answerContent.on("click", ".js-next-button", function(event) {
        event.preventDefault();

        console.log(state);

        answerContent.addClass("hidden");

        if (hasNextQuestion) {
            renderQuestionContent(state, questionContent);
        } else {
            scoreContent.addClass("hidden");
            answerContent.removeClass("hidden");

            renderScore(state, questionContent);
            renderEndContent(state, answerContent);
        }
    });

    answerContent.on("click", ".js-restart-button", function(event) {
        event.preventDefault();

        scoreContent.removeClass("hidden");
        answerContent.addClass("hidden");

        initializeState(state, data);
        renderScore(state, scoreContent);
        renderQuestionContent(state, questionContent);
    });
});

})();
