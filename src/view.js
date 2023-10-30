import onChange from 'on-change';

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

const renderErrors = (state, elements, i18n) => {
  const { error } = state.form;
  const input = document.querySelector('input');
  if (error) {
    input.classList.add('is-invalid');
    const feedbackElement = document.createElement('p');
    feedbackElement.classList.add('feedback', 'm0', 'position-absolute', 'small', 'text-danger');
    feedbackElement.textContent = i18n.t(error.key);
    elements.div.appendChild(feedbackElement);
  } else {
    input.classList.remove('is-invalid');
    const feedbackElement = document.querySelector('.feedback');
    feedbackElement.remove();
  }
};

const renderForm = (state, elements, i18n) => {
  const { process } = state.form;
  switch (process) {
    case 'filling':
      renderElements(elements, i18n);
      break;
    case 'submitted':
      document.querySelector('form').reset();
      break;
    default: break;
  }
};

const watch = (state, elements, i18n) => onChange(state, (path) => {
  switch (path) {
    case 'form.error':
      renderErrors(state, elements, i18n);
      break;
    case 'form.process':
      renderForm(state, elements, i18n);
      break;
    default: break;
  }
});

export default watch;
