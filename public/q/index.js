(function ($) {
  Survey.StylesManager.applyTheme('modern');

  var localSurveyStrings = {
    pagePrevText: 'Précédent',
    pageNextText: 'Suivant',
    completeText: 'Finaliser',
  };

  // Survey.surveyLocalization.locales["fr"] = localSurveyStrings;

  const storageName = 'color_survey';
  let surveyId = undefined;

  const surveyInit = () => {
    $.get('./survey.json').then((json) => {
      window.survey = new Survey.Model(json);

      survey.locale = 'fr';

      Object.assign(survey, {
        pagePrevText: 'Précédent',
        pageNextText: 'Suivant',
        completeText: 'Finaliser',
      });

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

        if (data.surveyId) {
          surveyId = data.surveyId;
          delete data.surveyId;
        }

        survey.data = data;

        if (data.pageNo) {
          survey.currentPageNo = data.pageNo;
        }
      }
      $('#surveyElement').Survey({ model: survey });
    });
  };

  const surveySessionClear = () => {
    window.localStorage.removeItem(storageName);
    surveyId = undefined;
  };

  const saveSurveyData = (survey, doSurveySessionClear = false) => {
    var data = survey.data;
    data.pageNo = survey.currentPageNo;

    if (surveyId) {
      window.localStorage.setItem(
        storageName,
        JSON.stringify(Object.assign({}, data, { surveyId }))
      );

      $.ajax({
        method: 'PUT',
        url: `/surveys/${surveyId}`,
        data: {
          json: data,
        },
      }).then((_) => {
        if (doSurveySessionClear) {
          surveySessionClear();
        }
      });
    } else {
      $.post({
        url: '/surveys/',
        data: {
          json: data,
        },
      })
        .then((resp) => {
          surveyId = resp.id;
          window.localStorage.setItem(
            storageName,
            JSON.stringify(Object.assign({}, data, { surveyId }))
          );
        })
        .catch((error) => {
          window.localStorage.setItem(storageName, JSON.stringify(data));
        });
    }
  };

  $(() => {
    surveyInit();

    $('.surveyReset').click(() => {
      surveySessionClear();
      survey.clear(true, true);
    });
  });
})(jQuery);
