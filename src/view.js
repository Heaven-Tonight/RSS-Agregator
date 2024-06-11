import onChange from 'on-change';

const createElement = (tagName, options = {}) => {
  const element = document.createElement(tagName);

  Object.entries(options).forEach(([key, value]) => {
    switch (key) {
      case 'textContent':
        element.textContent = value;
        break;
      case 'classList':
        element.classList.add(...value);
        break;
      case 'attributeList':
        value.forEach(([attrName, attrValue]) => element.setAttribute(attrName, attrValue));
        break;
      case 'dataSetList':
        // eslint-disable-next-line no-return-assign
        value.forEach(([dataSetKey, dataSetValue]) => element.dataset[dataSetKey] = dataSetValue);
        break;
      default:
        break;
    }
  });
  return element;
};

const disableForm = () => {
  const input = document.querySelector('form input');
  input.setAttribute('readonly', 'true');

  const formButton = document.querySelector('form button');
  formButton.setAttribute('disabled', 'true');

  const feedback = document.querySelector('.feedback');
  if (feedback) {
    feedback.textContent = '';
  }
};

const resetForm = (i18n, elements) => {
  const input = document.querySelector('input');
  input.removeAttribute('readonly');
  input.classList.remove('is-invalid');
  input.focus();

  const formButton = document.querySelector('form button');
  formButton.removeAttribute('disabled');

  elements.form.reset();

  const currentFeedbackElement = document.querySelector('.feedback');
  currentFeedbackElement.classList.replace('text-danger', 'text-success');
  currentFeedbackElement.textContent = i18n.t('processes.loaded');
};

const renderFormElements = (elements, i18n) => {
  const head = createElement('h1', {
    textContent: i18n.t('elements.head'),
    classList: ['display-3', 'mb-0'],
  });

  const tagLine = createElement('p', {
    textContent: i18n.t('elements.tagline'),
    classList: ['lead'],
  });

  const row = createElement('div', { classList: ['row'] });
  const col = createElement('div', { classList: ['col'] });
  const div = createElement('div', { classList: ['form-floating'] });

  const input = createElement('input', {
    classList: ['form-control', 'w-100'],
    attributeList: [
      ['id', 'url-input'],
      ['autofocus', ''],
      ['required', ''],
      ['name', 'url'],
      ['aria-label', 'url'],
      ['placeholder', i18n.t('input')],
      ['autocomplete', 'off'],
    ],
  });

  const label = createElement('label', {
    textContent: i18n.t('elements.input'),
    attributeList: [['for', 'url-input']],
  });

  div.append(input, label);
  col.append(div);

  const buttonCol = createElement('div', { classList: ['col-auto'] });

  const button = createElement('button', {
    textContent: i18n.t('buttons.submitBtn'),
    classList: ['btn', 'btn-lg', 'btn-primary', 'h-100', 'px-sm-5'],
    attributeList: [['type', 'submit'], ['aria-label', 'add']],
  });

  const { form, formDiv } = elements;

  buttonCol.append(button);
  row.append(col, buttonCol);
  form.append(row);

  const example = createElement('p', {
    textContent: i18n.t('elements.example'),
    classList: ['mt-2', 'mb-0', 'muted'],
  });

  const feedback = createElement('p', {
    classList: ['feedback', 'm0', 'position-absolute', 'small', 'text-danger'],
  });

  formDiv.insertBefore(head, form);
  formDiv.insertBefore(tagLine, form);

  formDiv.insertBefore(example, form.nextSibling);
  formDiv.insertBefore(feedback, example.nextSibling);
};
const renderFormErrors = (state, elements, i18n) => {
  const input = document.querySelector('input');
  input.removeAttribute('readonly');

  const formButton = document.querySelector('form button');
  formButton.removeAttribute('disabled');

  const { error } = state.form;

  if (error.key !== 'errors.rssError') {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
  const currentFeedBackElement = document.querySelector('.feedback');
  currentFeedBackElement.classList.add('text-danger');
  currentFeedBackElement.textContent = i18n.t(error.key);
};

export const renderModal = (state, elements, i18n) => {
  const { selectedPostId } = state.uiState;
  const { postsList } = state.feeds;
  const {
    modalBody,
    modalTitle,
    modalFooterLink,
    modalCloseButton,
  } = elements;

  const selectedPost = postsList.find(({ id }) => id === selectedPostId);

  modalBody.textContent = selectedPost.description;
  modalTitle.textContent = selectedPost.title;

  modalCloseButton.textContent = i18n.t('buttons.closeBtn');

  modalFooterLink.textContent = i18n.t('buttons.readBtn');
  modalFooterLink.setAttribute('href', selectedPost.link);
};

export const renderFeeds = (state, elements, i18n) => {
  const { channelList, postsList } = state.feeds;
  const { uiState } = state;

  const createCard = (title) => {
    const card = createElement('div', {
      classList: ['card', 'border-0'],
    });

    const cardBody = createElement('div', {
      classList: ['card-body'],
    });

    const cardTitle = createElement('h2', {
      textContent: i18n.t(title),
      classList: ['card-title', 'h4'],
    });

    cardBody.append(cardTitle);
    card.append(cardBody);

    return card;
  };

  const feedCard = createCard('elements.feeds');
  const postCard = createCard('elements.posts');

  const feedsList = createElement('ul', {
    classList: ['list-group', 'border-0', 'rounded-0'],
  });

  const feeds = channelList.map(({ title, description }) => {
    const feedLiElement = createElement('li', {
      classList: ['list-group-item', 'border-0', 'border-end-0'],
    });

    const feedTitle = createElement('h3', {
      textContent: title,
      classList: ['h6', 'm-0'],
    });

    const feedDescription = createElement('p', {
      textContent: description,
      classList: ['m-0', 'small', 'text-black-50'],
    });

    feedLiElement.append(feedTitle, feedDescription);
    return feedLiElement;
  });

  feedsList.append(...feeds);

  const postsLists = channelList
    .map(({ id }) => {
      const postsToRender = postsList.filter(({ feedId }) => feedId === id);

      const postsUlElement = createElement('ul', {
        classList: ['list-group', 'border-0', 'rounded-0'],
      });

      // eslint-disable-next-line no-shadow
      const posts = postsToRender.map(({ title, link, id }) => {
        const postsLiElement = createElement('li', {
          classList: [
            'list-group-item',
            'd-flex',
            'justify-content-between',
            'align-items-start',
            'border-0',
            'border-end-0',
          ],
        });

        const postLinkClasses = uiState.viewedPostsIds.includes(id) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];

        const postLink = createElement('a', {
          textContent: title,
          classList: postLinkClasses,
          attributeList: [
            ['href', link],
            ['id', id],
            ['target', '_blank'],
            ['rel', 'noopener noreferrer'],
          ],
        });

        const postButton = createElement('button', {
          textContent: i18n.t('buttons.viewBtn'),
          classList: ['btn', 'btn-outline-primary', 'btn-sm'],
          attributeList: [['type', 'button']],
          dataSetList: [['id', id], ['bsToggle', 'modal'], ['bsTarget', '#modal']],
        });

        postsLiElement.append(postLink, postButton);
        return postsLiElement;
      });
      postsUlElement.append(...posts);
      return postsUlElement;
    });

  elements.feedsDiv.replaceChildren(feedCard, feedsList);
  elements.postsDiv.replaceChildren(postCard, ...postsLists);
};

export const renderFormState = (state, elements, i18n) => {
  const { process } = state.form;

  switch (process) {
    case 'initial':
      renderFormElements(elements, i18n);
      break;
    case 'submitting':
      disableForm();
      break;
    case 'submitted':
      resetForm(i18n, elements);
      break;
    case 'failed':
      renderFormErrors(state, elements, i18n);
      break;
    default: break;
  }
};

const watch = (state, elements, i18n) => onChange(state, (path) => {
  const { process } = state.feeds;
  switch (path) {
    case 'form.process':
      renderFormState(state, elements, i18n);
      break;
    case 'feeds.process':
      if (process === 'loaded' || process === 'updated') {
        renderFeeds(state, elements, i18n);
      }
      break;
    case 'uiState.viewedPostsIds':
      renderFeeds(state, elements, i18n);
      break;
    case 'uiState.selectedPostId':
      renderModal(state, elements, i18n);
      break;
    default: break;
  }
});

export default watch;
