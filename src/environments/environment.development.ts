export const environment = {
  production: false,
  exercises: {
    sentences: {
      count: 1,
      showForm: false,
      showInfinitive: true,
      showTranslate: false,
      showMeaning: false
    },
    forms: {
      count: 1,
      showMeaning: false
    }
  },
  history: {
    allowClear: false
  },
  admin: {
    enabled: true,
    generation: {
      sentencesCount: 10,
      formsCount: 20
    }
  }
};
