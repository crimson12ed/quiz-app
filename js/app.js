(function() {
"use strict";

function escapeHTML(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderQuestions(element) {

    var questionSet = data.questions[0];
    var question = escapeHTML(questionSet.question);
    var choiceA = escapeHTML(questionSet.choices.a);
    var choiceB = escapeHTML(questionSet.choices.b);
    var choiceC = escapeHTML(questionSet.choices.c);
    var choiceD = escapeHTML(questionSet.choices.d);

    var result = ('<p>' + question + '</p><ul>' +
            '<li class="a">' + choiceA + '</li>' +
            '<li class="b">' + choiceB + '</li>' +
            '<li class="c">' + choiceC + '</li>' +
            '<li class="d">' + choiceD + '</li></ul>'
    );

    element.html(result);
}

$(document).ready(function() {

    $(".js-start-button").click(function(event) {
        event.preventDefault();

        $(this).addClass("hidden");
        renderQuestions($(".panel"));
    });
});

})();
