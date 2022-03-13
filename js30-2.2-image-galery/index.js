const url =
  'https://api.unsplash.com/search/photos?query=spring&per_page=30&orientation=landscape&client_id=3L-53OB_hw9rg746Hi_J9_oW4AKbvodkUf1GQRETdrY';

const galleryContainer = document.querySelector('.gallery-container');
const input = document.querySelector('.input');
const searchBtn = document.querySelector('.btn-search');
const clearIcon = document.querySelector('.icon-clear');

const showData = (data) => {
  const applyImg = (el) => {
    const img = `<a href="${el.urls.full}" target="_blank"><img class="gallery-img" src="${el.urls.regular}" alt="image"></a>`;
    galleryContainer.insertAdjacentHTML('beforeend', img);
  };

  while (galleryContainer.hasChildNodes()) {
    galleryContainer.removeChild(galleryContainer.firstChild);
  }

  data.results.map(applyImg);
};

async function getData(urll = url) {
  const res = await fetch(urll);
  const data = await res.json();
  showData(data);
}

getData();

const onSearchIconClick = () => {
  const userSearchReq = input.value;

  const newUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    userSearchReq
  )}&per_page=30&orientation=landscape&client_id=3L-53OB_hw9rg746Hi_J9_oW4AKbvodkUf1GQRETdrY`;

  getData(newUrl);
};

searchBtn.addEventListener('click', onSearchIconClick);

input.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' || e.code === 'NumpadEnter') {
    onSearchIconClick();
  }
});

const onClearIconClick = () => {
  input.value = '';
  getData();
};

clearIcon.addEventListener('click', onClearIconClick);
