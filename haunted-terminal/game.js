(() => {
  const screen = document.querySelector('#screen');
  const form = document.querySelector('#command-form');
  const input = document.querySelector('#command');
  const state = { stage: 0 };
  const lines = {
    intro: 'NIGHT SHIFT OS v1.3\nA message waits in the spooler. The building is empty.\n\nTry: help',
    help: 'Commands: look, spool, read message, answer, reset',
    look: 'The cursor blinks. Somewhere behind the monitor, a fan has stopped.',
    spool: 'One item: MESSAGE-13  [unread]\nTry: read message',
    read: 'MESSAGE-13:\n“Do not turn around. I am using the terminal because it is polite.”\n\nTry: answer',
    answer: 'You type: hello?\n\nThe terminal replies: “Thank you. I only wanted to know I was remembered.”\n\nThe green cursor settles. Dawn finds the room exactly as you left it.\n\nType reset for another shift.'
  };
  function print(text, kind = '') { const p = document.createElement('p'); p.className = `line ${kind}`; p.textContent = text; screen.append(p); screen.scrollTop = screen.scrollHeight; }
  function reset() { state.stage = 0; screen.replaceChildren(); print(lines.intro); }
  function run(raw) {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    print(`guest@nightshift:~$ ${command}`, 'echo');
    if (command === 'reset') return reset();
    if (command === 'help') return print(lines.help);
    if (command === 'look') return print(lines.look);
    if (command === 'spool') { state.stage = Math.max(state.stage, 1); return print(lines.spool); }
    if (command === 'read message' && state.stage >= 1) { state.stage = 2; return print(lines.read); }
    if (command === 'answer' && state.stage >= 2) { state.stage = 3; return print(lines.answer); }
    if (['read message', 'answer'].includes(command)) return print('The terminal waits for the next thing you know to do.', 'warning');
    print(`Unknown command: ${command}. Type help.`, 'warning');
  }
  form.addEventListener('submit', (event) => { event.preventDefault(); run(input.value); input.value = ''; });
  document.addEventListener('pointerdown', () => input.focus());
  reset();
})();
