export default {
  translation: {
    elements: {
      head: 'RSS агрегатор',
      input: 'Ссылка RSS',
      tagline: 'Начните читать RSS сегодня! Это легко, это красиво.',
      example: 'Пример: https://ru.hexlet.io/lessons.rss',
      feeds: 'Фиды',
      posts: 'Посты',
    },
    buttons: {
      submitBtn: 'Добавить',
      viewBtn: 'Просмотр',
      readBtn: 'Читать полностью',
      closeBtn: 'Закрыть',
    },
    processes: {
      loaded: 'RSS успешно загружен',
    },
    errors: {
      validation: {
        url: 'Ссылка должна быть валидным URL',
        notOneOf: 'RSS уже существует',
      },
      rssError: 'Ресурс не содержит валидный RSS',
      networkError: 'Ошибка сети',
      unknownError: 'Неизвестная ошибка',
    },
  },
};
