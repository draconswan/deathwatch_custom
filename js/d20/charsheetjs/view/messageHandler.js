window.onmessage = (e) => {
  switch (e.data.type) {
    case 'colorThemeToggle':
      colorThemeToggle(e.data.theme);
      break;
    default:
      break;
  }
};

const colorThemeToggle = (theme) => {
  const body = document.querySelector('body');
  if (theme === 'dark') {
    body.classList.add('sheet-darkmode');
  } else {
    body.classList.remove('sheet-darkmode');
  }
};
