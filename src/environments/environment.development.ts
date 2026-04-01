export const environment = {
  production: false,
  exercises: {
    sentences: {
      count: 1,
      showForm: false,
      showInfinitive: true,
      showTranslate: true,
      showMeaning: true
    },
    forms: {
      count: 1,
      showMeaning: true
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
