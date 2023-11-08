export const renderFormElements = (elements, i18n) => {
  const h1 = document.createElement('h1');
  h1.classList.add('display-3', 'mb-0');
  h1.textContent = i18n.t('elements.head');

  const p = document.createElement('p');
  p.classList.add('lead');
  p.textContent = i18n.t('elements.tagline');

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
  label.textContent = i18n.t('elements.input');

  div.append(input, label);
  col.append(div);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('col-auto');

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-lg', 'btn-primary', 'h-100', 'px-sm-5');
  button.textContent = i18n.t('buttons.submitBtn');

  buttonDiv.append(button);
  row.append(col, buttonDiv);
  form.append(row);

  const example = document.createElement('p');
  example.classList.add('mt-2', 'mb-0', 'muted');
  example.textContent = i18n.t('elements.example');

  elements.div.append(h1, p, form, example);
};

export const renderSuccessFeedbackElement = (elements, i18n) => {
  const currentFeedbackElement = document.querySelector('.feedback');

  const feedbackElement = document.createElement('p');
  feedbackElement.classList.add('feedback', 'm0', 'position-absolute', 'small', 'text-success');
  feedbackElement.textContent = i18n.t('processes.loaded');

  if (currentFeedbackElement) {
    currentFeedbackElement.replaceWith(feedbackElement);
  }
  elements.div.append(feedbackElement);
};

export const deleteFeedbackElement = () => {
  const feedback = document.querySelector('.feedback');

  if (feedback) {
    feedback.remove();
  }
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

export const renderFormErrors = (state, elements, i18n) => {
  const { error } = state.form;
  const input = document.querySelector('input');

  if (error) {
    if (error.key === 'errors.rssError') {
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

export const hideModal = (elements) => {
  const { modal } = elements;
  modal.classList.replace('show', 'fade');
  modal.removeAttribute('style');
};

export const showModal = (state, elements) => {
  const { selectedPostId } = state.uiState;
  const { postsList } = state.feeds;
  const {
    modal,
    modalBody,
    modalHeader,
    modalFooterLink,
  } = elements;

  const selectedPost = postsList.find(({ id }) => id === selectedPostId);

  modal.classList.replace('fade', 'show');
  modal.setAttribute('style', 'display: block');
  modalBody.textContent = selectedPost.description;

  const h5 = modalHeader.querySelector('h5');
  h5.textContent = selectedPost.title;

  modalFooterLink.setAttribute('href', selectedPost.link);
  // eslint-disable-next-line
  // state.uiState.modal.linkClicked ? modalFooterLink.classList.add('active') : modalFooterLink.classList.remove('active');
};

export const renderModal = (state, elements) => {
  const { modalVisibility } = state.uiState.modal;
  if (modalVisibility) {
    showModal(state, elements);

    const { modalHeaderBtnClose, modalFooterLink, modalFooterBtnClose } = elements;

    [modalHeaderBtnClose, modalFooterBtnClose].forEach((button) => {
      button.addEventListener('click', () => {
        // eslint-disable-next-line
        state.uiState.modal.modalVisibility = false;
        renderModal(state, elements);
      });
    });

    modalFooterLink.addEventListener('click', () => {
      // eslint-disable-next-line
      state.uiState.modal.linkClicked = true;
      renderModal(state, elements);
    });
  } else {
    hideModal(elements);
  }
};

export const renderPostsList = (state, elements, currentFeedId, i18n) => {
  const { uiState } = state;
  const { postsList } = state.feeds;
  const postsToRender = postsList.filter(({ feedId }) => feedId === currentFeedId);

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
    const aClasses = uiState.selectedPostsIds.includes(id) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];
    a.classList.add(...aClasses);
    a.setAttribute('href', link);
    a.setAttribute('id', id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;

    a.addEventListener('click', (e) => {
      // eslint-disable-next-line
      const { id } = e.target;
      if (!state.uiState.selectedPostsIds.includes(id)) {
        state.uiState.selectedPostsIds.push(id);
        // eslint-disable-next-line
        renderFeedsAndPostsLists(state, elements, i18n);
      }
    });

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18n.t('buttons.viewBtn');

    button.addEventListener('click', (e) => {
      // eslint-disable-next-line
      const { id } = e.target.dataset;
      // eslint-disable-next-line
      state.uiState.selectedPostId = id;
      if (!state.uiState.selectedPostsIds.includes(id)) {
        state.uiState.selectedPostsIds.push(id);
        renderModal(state, elements);
      }
      // eslint-disable-next-line
      state.uiState.modal.modalVisibility = true;
      // eslint-disable-next-line
      renderFeedsAndPostsLists(state, elements, i18n);
      renderModal(state, elements);
    });

    li.append(a, button);
    return li;
  });
  ul.append(...liElements);
  return ul;
};

export const renderFeedsList = (state) => {
  const { channelList } = state.feeds;

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const liElements = channelList.map((feed) => {
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

export const renderFeedsAndPostsLists = (state, elements, i18n) => {
  // eslint-disable-next-line
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

  const feedsCard = renderCard('elements.feeds', i18n);
  const postsCard = renderCard('elements.posts', i18n);
  const feedsList = renderFeedsList(state);
  const postsList = state.feeds.channelList
    .map(({ id }) => renderPostsList(state, elements, id, i18n));

  elements.feedsDiv.replaceChildren(feedsCard, feedsList);
  elements.postsDiv.replaceChildren(postsCard, ...postsList);
};
