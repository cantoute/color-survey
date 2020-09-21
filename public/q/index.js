(function ($) {
  Survey.StylesManager.applyTheme("modern");

  const storageName = "color_survey";
  let surveyId = undefined;

  const sessionClear = () => {
    window.localStorage.removeItem(storageName);
  }

  const saveSurveyData = (survey, completed = false) => {
    var data = survey.data;
    data.pageNo = survey.currentPageNo;

    if (surveyId) {
      window.localStorage.setItem(storageName, JSON.stringify(data));
      $.ajax({
        method: "PUT",
        url: `/surveys/${surveyId}`,
        data: {
          json: data,
        },
      }).then((_) => {
        if (completed) {
          sessionClear();
        }
      });
    } else {
      console.log("posting", data);
      $.post({
        url: "/surveys/",
        data: {
          json: data,
        },
      }).then((resp) => {
        data.surveyId = resp.id;
        window.localStorage.setItem(storageName, JSON.stringify(data));
      });
    }
  }

  $.get("./survey.json").then((json) => {
    window.survey = new Survey.Model(json);

    // survey.onComplete.add(function (result) {
    //   document.querySelector("#surveyResult").textContent =
    //     "Result JSON:\n" + JSON.stringify(result.data, null, 3);
    // });

    survey.onPartialSend.add(function (survey) {
      saveSurveyData(survey);
    });
    survey.onComplete.add(function (survey, options) {
      saveSurveyData(survey, true);
    });

    survey.sendResultOnPageNext = true;
    var prevData = window.localStorage.getItem(storageName) || null;
    if (prevData) {
      var data = JSON.parse(prevData);
      survey.data = data;
      if (data.pageNo) {
        survey.currentPageNo = data.pageNo;
      }
      if (data.surveyId) {
        surveyId = data.surveyId;
      }
    }
    $("#surveyElement").Survey({ model: survey });
  });
})(jQuery);
