import { filterPhrases, nextLanguage, nextResult } from './phrases.js';

const languages = ['All', 'Spanish', 'Japanese', 'Arabic'];
let selectedLanguage = 'All';
let activeResult = 0;
const languageNav = document.querySelector('#languages');
const search = document.querySelector('#search');
const results = document.querySelector('#results');
const count = document.querySelector('#count');

function render() {
  const matches = filterPhrases(search.value, selectedLanguage);
  activeResult = Math.min(activeResult, Math.max(matches.length - 1, 0));
  languageNav.innerHTML = languages.map((language) => `<button class="${language === selectedLanguage ? 'selected' : ''}" data-language="${language}" aria-pressed="${language === selectedLanguage}">${language}</button>`).join('');
  count.textContent = `${matches.length} phrase${matches.length === 1 ? '' : 's'}`;
  results.innerHTML = matches.map((phrase, index) => `<article tabindex="${index === activeResult ? '0' : '-1'}" class="${index === activeResult ? 'active' : ''}"><span class="language">${phrase.language}</span><strong>${phrase.text}</strong><span class="pronunciation">${phrase.pronunciation}</span><span class="meaning">${phrase.meaning}</span></article>`).join('') || '<p class="empty">Nothing here yet. Try another word.</p>';
}

languageNav.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  selectedLanguage = button.dataset.language;
  activeResult = 0;
  render();
  search.focus();
});
languageNav.addEventListener('keydown', (event) => {
  if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
  event.preventDefault();
  selectedLanguage = nextLanguage(selectedLanguage, event.key === 'ArrowRight' ? 1 : -1);
  activeResult = 0;
  render();
  languageNav.querySelector(`[data-language="${selectedLanguage}"]`).focus();
});
search.addEventListener('input', () => { activeResult = 0; render(); });
search.addEventListener('keydown', (event) => {
  const cards = [...results.querySelectorAll('article')];
  if (event.key === 'ArrowDown' && cards.length) { event.preventDefault(); activeResult = nextResult(activeResult, 1, cards.length); render(); results.querySelector('.active').focus(); }
  if (event.key === 'ArrowUp' && cards.length) { event.preventDefault(); activeResult = nextResult(activeResult, -1, cards.length); render(); results.querySelector('.active').focus(); }
});
results.addEventListener('keydown', (event) => {
  const cards = [...results.querySelectorAll('article')];
  if (!['ArrowDown', 'ArrowUp'].includes(event.key) || !cards.length) return;
  event.preventDefault();
  activeResult = nextResult(activeResult, event.key === 'ArrowDown' ? 1 : -1, cards.length);
  render(); results.querySelector('.active').focus();
});
render();
