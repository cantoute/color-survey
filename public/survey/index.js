Survey.StylesManager.applyTheme("modern");

var json = {
  questionTitlePattern: "requireNumTitle",
  questionStartIndex: "# A)",
  requiredText: "(*)",
  pages: [
    {
      title: "page {pageno} / {pagecount}",
      questions: [
        {
          type: "text",
          name: "name",
          title: "Please type your name",
          isRequired: true,
        },
        {
          type: "text",
          name: "email",
          title: "Please type your e-mail",
          isRequired: true,
          validators: [
            {
              type: "email",
            },
          ],
        },
      ],
    },
    {
      title: "This is the page {pageno} of {pagecount}.",
      questions: [
        {
          type: "comment",
          name: "comment",
          title: "{name}, please tell us what is on your mind",
        },
      ],
    },
  ],
  completedHtml:
    "<p><h4>Thank you for sharing this information with us.</h4></p><p>Your name is: <b>{name}</b></p><p>Your email is: <b>{email}</b></p><p>This is what is on your mind:</p><p>{comment}</p>",
};
window.survey = new Survey.Model(json);

survey
    .onComplete
    .add(function (result) {
        document
            .querySelector('#surveyResult')
            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
    });

var storageName = "survey_patient_history";
function saveSurveyData(survey) {
    var data = survey.data;
    data.pageNo = survey.currentPageNo;
    window
        .localStorage
        .setItem(storageName, JSON.stringify(data));
}
survey
    .onPartialSend
    .add(function (survey) {
        saveSurveyData(survey);
    });
survey
    .onComplete
    .add(function (survey, options) {
        saveSurveyData(survey);
    });

survey.sendResultOnPageNext = true;
var prevData = window
    .localStorage
    .getItem(storageName) || null;
if (prevData) {
    var data = JSON.parse(prevData);
    survey.data = data;
    if (data.pageNo) {
        survey.currentPageNo = data.pageNo;
    }
}
function onAngularComponentInit() {
    Survey
        .SurveyNG
        .render("surveyElement", {model: survey});
}
var HelloApp = ng
    .core
    .Component({selector: 'ng-app', template: '<div id="surveyContainer" class="survey-container contentcontainer codecontainer"><div id="surveyElement"></div></div> '})
    .Class({
        constructor: function () {},
        ngOnInit: function () {
            onAngularComponentInit();
        }
    });
document.addEventListener('DOMContentLoaded', function () {
    ng
        .platformBrowserDynamic
        .bootstrap(HelloApp);
});
