const tabs = [...document.querySelectorAll('.tab')];
const panels = [...document.querySelectorAll('.panel')];
const status = document.querySelector('#status');

function show(name) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.panel === name;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', selected);
  });
  panels.forEach((panel) => { panel.hidden = panel.id !== name; });
  status.textContent = `Showing ${name === 'context' ? 'missing context' : name}.`;
}

tabs.forEach((tab) => tab.addEventListener('click', () => show(tab.dataset.panel)));
document.querySelector('#reset').addEventListener('click', () => show('claims'));
show('claims');
