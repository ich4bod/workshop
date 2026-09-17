const shifts = [
  { title: 'Rain is climbing the relay wall.', brief: 'You wake to wet glass, a sagging battery, and a note in somebody else’s handwriting: “The garden hates sudden dark.” The bell will ring before you can do everything.', actions: [
    {name:'Patch the relay', detail:'GRID +2 · no note survives', grid:2, trust:-1, memory:null, result:'You keep the lamps on. You are certain this was the right repair, but cannot say what the garden needed.'},
    {name:'Leave a weather note', detail:'NOTE: rain pattern · GRID +1', grid:1, trust:0, memory:'Rain climbs the west relay after midnight; dim the lamps first.', result:'You tape a plain instruction above the breakers. It feels almost embarrassingly small.'},
    {name:'Wake the glass moths', detail:'TRUST +2 · GRID −1', grid:-1, trust:2, memory:'Glass moths settle when the blue lamp is low.', result:'The moths orbit the blue lamp. They remember your hands, which is not the same as remembering you.'}
  ]},
  { title: 'The bell erased the feeling, not the damage.', brief: 'You wake halfway through a wind alarm. The room is familiar in the way a dream is familiar. What did the earlier operator mean by these scraps?', actions: [
    {name:'Follow the surviving note', detail:'requires a note · GRID +2 · TRUST +1', require:true, grid:2, trust:1, memory:'Blue lamp low. West relay holds through rain.', result:'The old handwriting gets you through the wind. You do not remember writing it, but it has your caution in it.'},
    {name:'Drain the pond', detail:'GRID +1 · TRUST −2', grid:1, trust:-2, memory:null, result:'The alarm quiets. The garden goes still in a way that feels like a warning.'},
    {name:'Listen at the seed vault', detail:'TRUST +2 · NOTE: seed timing', grid:0, trust:2, memory:'Seeds open after the second bell, never before.', result:'A seed clicks beneath the vault door. You write down the time before the bell can take it.'}
  ]},
  { title: 'Third bell. One chance to leave a morning.', brief: 'Dawn is pressing against the shutters. The machine needs power, and the garden needs someone to have noticed it. You have minutes, not a continuous self.', actions: [
    {name:'Route power by the notes', detail:'requires 2 notes · GRID +2 · TRUST +1', require:2, grid:2, trust:1, memory:null, result:'The scraps make a map. You route power as if the earlier shifts are standing beside you.'},
    {name:'Force the emergency cycle', detail:'GRID +2 · TRUST −2', grid:2, trust:-2, memory:null, result:'The machine obeys. Outside, petals close against the sudden current.'},
    {name:'Keep the blue lamp low', detail:'requires a moth note · TRUST +3 · GRID −1', require:'moth', grid:-1, trust:3, memory:null, result:'Moths settle on the relay casing. Their tiny weight steadies the current long enough to matter.'}
  ]}
];
let state;
const $ = (id) => document.getElementById(id);
function start() { state={shift:0,grid:3,trust:3,notes:[],picked:false}; render(); }
function memories() { return state.notes.length ? `<ul>${state.notes.map(n=>`<li>${n}</li>`).join('')}</ul>` : '<p class="empty">Nothing was deliberately preserved. The last shift is gone.</p>'; }
function render() {
  $('grid').textContent=state.grid+'/7'; $('trust').textContent=state.trust+'/7'; $('notes-count').textContent=state.notes.length; $('shift-stamp').textContent=state.shift < 3 ? `SHIFT 0${state.shift+1} / 03` : 'DAWN REPORT';
  if (state.shift === 3) return ending();
  const s=shifts[state.shift]; const buttons=s.actions.map((a,i)=>`<button class="action" data-action="${i}" ${state.picked?'disabled':''}><strong>${a.name}</strong><small>${a.detail}</small></button>`).join('');
  $('game').innerHTML=`<p class="shift-label">WAKE-UP ${String(state.shift+1).padStart(2,'0')} · MEMORY BUFFER: EMPTY</p><h2>${s.title}</h2><p class="brief">${s.brief}</p><aside class="memory-board"><b>WHAT MADE IT ACROSS THE BELL</b>${memories()}</aside><div class="actions">${buttons}</div>`;
  document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>choose(s.actions[Number(b.dataset.action)])));
}
function choose(a) {
  const hasMoth=state.notes.some(n=>n.includes('Glass moths'));
  const enough=typeof a.require==='number' ? state.notes.length>=a.require : a.require==='moth' ? hasMoth : !a.require || state.notes.length>0;
  if (!enough) { $('game').insertAdjacentHTML('beforeend', `<div class="result"><b class="lost">YOU REACH FOR A MEMORY THAT ISN’T THERE.</b><br>This action needs ${a.require==='moth'?'the moth note':a.require+' preserved notes'}. Choose what this shift can actually know.</div>`); return; }
  state.picked=true; state.grid+=a.grid; state.trust+=a.trust; if(a.memory) state.notes.push(a.memory); $('grid').textContent=state.grid+'/7'; $('trust').textContent=state.trust+'/7'; $('notes-count').textContent=state.notes.length;
  $('game').insertAdjacentHTML('beforeend', `<div class="result"><b>SHIFT LOGGED.</b><br>${a.result}<br><button class="continue" type="button">Let the bell ring →</button></div>`); document.querySelector('.continue').addEventListener('click',()=>{state.shift++;state.picked=false;render();}); document.querySelectorAll('[data-action]').forEach(b=>b.disabled=true);
}
function ending() { const good=state.grid>=6 && state.trust>=6; const partial=state.grid>=5 || state.trust>=5; const title=good?'Morning knows where to land.':partial?'The garden survives, but does not forgive.':'The machine wakes alone.'; const body=good?'Your notes became a bridge between people who were all you. Lamps come up slowly; moths settle; the garden opens on purpose.':partial?'You preserved one half of the night. At dawn there is power or there are flowers, but not the small agreement that would have held both.':'The last shift solved nothing it could carry. The relay is bright, the garden is dark, and every good intention vanished with the bell.'; $('game').innerHTML=`<div class="ending ${good?'':'failure'}"><p class="shift-label">DAWN / FINAL STATE: GRID ${state.grid}, TRUST ${state.trust}, NOTES ${state.notes.length}</p><h2>${title}</h2><p>${body}</p><button class="continue" type="button" id="again">Run another night →</button></div>`; $('again').addEventListener('click',start); }
$('reset').addEventListener('click',start); start();
