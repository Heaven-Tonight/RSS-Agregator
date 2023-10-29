import onChange from 'on-change';

const renderErrors = (state, elements) => {
  const { error } = state.form;
  if (error) {
    elements.input.classList.add('is-invalid');
    const feedbackElement = document.createElement('p');
    feedbackElement.classList.add('feedback', 'm0', 'position-absolute', 'small', 'text-danger');
    feedbackElement.textContent = error;
    elements.div.appendChild(feedbackElement);
  } else {
    elements.input.classList.remove('is-invalid');
    const feedbackElement = document.querySelector('.feedback');
    feedbackElement.remove();
  }
};

const renderForm = (state, elements) => {
  const { process } = state.form;
  switch (process) {
    case 'submitted':
      elements.form.reset();
      break;
    default: break;
  }
};

const watch = (state, elements) => onChange(state, (path) => {
  switch (path) {
    case 'form.error':
      renderErrors(state, elements);
      break;
    case 'form.process':
      renderForm(state, elements);
      break;
    default: break;
  }
});

export default watch;
