export const environment = {
  production: true,
  exercises: {
    sentences: {
      count: 10,
      showForm: false,
      showInfinitive: true,
      showTranslate: true,
      showMeaning: true
    },
    forms: {
      count: 10,
      showMeaning: true
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
