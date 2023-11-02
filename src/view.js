import onChange from 'on-change';

const renderCard = (title, i18n) => {
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'border-0');

  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t(title);

  cardBodyDiv.append(cardTitle);
  cardDiv.append(cardBodyDiv);

  return cardDiv;
};

const renderPostsList = (state, index) => {
  const { feedsPostsList } = state;
  const postsToRender = feedsPostsList.filter(({ feedId }) => feedId === index);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const liElements = postsToRender.map(({ title, link, id }) => {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', link);
    a.setAttribute('id', id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;

    li.append(a);
    return li;
  });
  ul.append(...liElements);
  return ul;
};

const renderFeedsList = (state) => {
  const { feedsChannelList } = state;

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const liElements = feedsChannelList.map((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;

    li.append(h3, p);
    return li;
  });
  ul.append(...liElements);
  return ul;
};

const renderFeedsAndPostsLists = (state, elements, i18n) => {
  const feedsCard = renderCard('feeds', i18n);
  const postsCard = renderCard('posts', i18n);
  const feedsList = renderFeedsList(state);
  const postsList = state.feedsChannelList.map(({ id }) => renderPostsList(state, id));

  elements.feedsDiv.replaceChildren(feedsCard, feedsList);
  elements.postsDiv.replaceChildren(postsCard, ...postsList);
};

const renderElements = (elements, i18n) => {
  const h1 = document.createElement('h1');
  h1.classList.add('display-3', 'mb-0');
  h1.textContent = i18n.t('heading');

  const p = document.createElement('p');
  p.classList.add('lead');
  p.textContent = i18n.t('tagline');

  const form = document.createElement('form');
  form.setAttribute('action', '');
  form.classList.add('rss-form', 'text-body');

  const row = document.createElement('div');
  row.classList.add('row');

  const col = document.createElement('div');
  col.classList.add('col');

  const div = document.createElement('div');
  div.classList.add('form-floating');

  const input = document.createElement('input');
  input.setAttribute('id', 'url-input');
  input.setAttribute('autofocus', '');
  input.setAttribute('required', '');
  input.setAttribute('name', 'url');
  input.setAttribute('aria-label', 'url');
  input.setAttribute('placeholder', i18n.t(input));
  input.setAttribute('autocomplete', 'off');
  input.classList.add('form-control', 'w-100');

  const label = document.createElement('label');
  label.setAttribute('for', 'url-input');
  label.textContent = i18n.t('input');

  div.append(input, label);
  col.append(div);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('col-auto');

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-lg', 'btn-primary', 'h-100', 'px-sm-5');
  button.textContent = i18n.t('submitBtn');

  buttonDiv.append(button);
  row.append(col, buttonDiv);
  form.append(row);

  const example = document.createElement('p');
  example.classList.add('mt-2', 'mb-0', 'muted');
  example.textContent = i18n.t('example');

  elements.div.append(h1, p, form, example);
};

const renderErrorFeedBackElement = (state, elements, i18n) => {
  const { error } = state.form;

  const currentFeedBackElement = document.querySelector('.feedback');

  const feedbackElement = document.createElement('p');
  feedbackElement.classList.add('feedback', 'm0', 'position-absolute', 'small', 'text-danger');
  feedbackElement.textContent = i18n.t(error.key);

  if (currentFeedBackElement) {
    currentFeedBackElement.replaceWith(feedbackElement);
  }

  elements.div.appendChild(feedbackElement);
};

const renderFormErrors = (state, elements, i18n) => {
  const { error } = state.form;
  const input = document.querySelector('input');

  if (error) {
    if (error.key === 'failing') {
      renderErrorFeedBackElement(state, elements, i18n);
    } else {
      input.classList.add('is-invalid');
      renderErrorFeedBackElement(state, elements, i18n);
    }
  } else {
    input.classList.remove('is-invalid');
    const feedbackElement = document.querySelector('.feedback');
    feedbackElement.remove();
  }
};

const renderSuccessFeedbackElement = (elements, i18n) => {
  const currentFeedbackElement = document.querySelector('.feedback');

  const feedbackElement = document.createElement('p');
  feedbackElement.classList.add('feedback', 'm0', 'position-absolute', 'small', 'text-success');
  feedbackElement.textContent = i18n.t('loading');

  if (currentFeedbackElement) {
    currentFeedbackElement.replaceWith(feedbackElement);
  }
  elements.div.append(feedbackElement);
};

const renderErrors = (state) => {
  const { error } = state;
  const { name, message, code } = error;

  const errorDiv = document.createElement('div');
  errorDiv.classList.add('justify-content-start', 'p-5', 'column');

  const errorCode = document.createElement('h5');
  errorCode.classList.add('text-danger');
  errorCode.textContent = `Request failed with ${name}:`;

  const p1Err = document.createElement('p');
  p1Err.classList.add('text-white', 'pt-3', 'mb-0');
  p1Err.textContent = code;

  const p2Err = document.createElement('p');
  p2Err.classList.add('text-white', 'mt-0');
  p2Err.textContent = message;

  errorDiv.append(errorCode, p1Err, p2Err);

  const pDiv = document.createElement('div');
  pDiv.classList.add(
    'd-flex',
    'align-items-center',
    'justify-content-start',
    'flex-column',
  );

  const div = document.createElement('div');
  div.classList.add(
    'd-flex',
    'bg-dark',
    'flex-grow-1',
    'row',
  );

  const p1 = document.createElement('h3');
  p1.classList.add('text-white', 'fw-bold');
  p1.textContent = 'Что-то пошло не так...';

  const p2 = document.createElement('h3');
  p2.classList.add('text-white', 'fw-bold');
  p2.textContent = 'Попробуйте перезагрузить страницу.';

  pDiv.append(p1, p2);

  const body = document.querySelector('body');
  body.innerHTML = '';

  div.append(errorDiv, pDiv);
  body.append(div);
};

const deleteFeedbackElement = () => {
  const feedback = document.querySelector('.feedback');

  if (feedback) {
    feedback.remove();
  }
};

const render = (state, elements, i18n) => {
  const { process } = state.form;
  switch (process) {
    case 'filling':
      renderElements(elements, i18n);
      break;
    case 'submitted':
      document.querySelector('form').reset();
      break;
    case 'loading':
      deleteFeedbackElement();
      break;
    case 'loaded':
      renderFeedsAndPostsLists(state, elements, i18n);
      renderSuccessFeedbackElement(elements, i18n);
      break;
    default: break;
  }
};

const watch = (state, elements, i18n) => onChange(state, (path) => {
  // console.log(state.form.process);
  // console.log(state.feedsPostsList);
  switch (path) {
    case 'form.error':
      renderFormErrors(state, elements, i18n);
      break;
    case 'error':
      renderErrors(state, i18n);
      break;
    case 'form.process':
      render(state, elements, i18n);
      break;
    default: break;
  }
});

export default watch;
