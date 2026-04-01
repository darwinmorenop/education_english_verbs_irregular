export const environment = {
  production: true,
  exercises: {
    sentences: {
      count: 10,
      showForm: false,
      showInfinitive: true,
      showTranslate: false,
      showMeaning: false
    },
    forms: {
      count: 10,
      showMeaning: false
    }
  },
  history: {
    allowClear: false
  },
  admin: {
    enabled: false,
    generation: {
      sentencesCount: 15,
      formsCount: 15
    }
  }
};
