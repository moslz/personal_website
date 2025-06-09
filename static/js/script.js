window.addEventListener('DOMContentLoaded', () => {
  const codeEl = document.getElementById('live-code');
  codeEl.textContent = codeString;         
  Prism.highlightElement(codeEl);           
});

// Chat UI constants 
const toggleBtn   = document.getElementById('chatbot-toggle');
const chatBox     = document.getElementById('chatbot-container');
const closeBtn    = document.getElementById('chatbot-close');
const msgArea     = document.getElementById('chatbot-messages');
const form        = document.getElementById('chatbot-form');
const input       = document.getElementById('chatbot-input');

// Chat voice constants
const el = (tag, cls) => { const n=document.createElement(tag); n.className=cls; return n; };
const playIcon = "▶";   

// Engaging code editor window on the home page
const codeString = `const profile = (...qualities) =>
  'With my ' + qualities.slice(0, -1).join(', ') +
  ', and ' + qualities.at(-1) +
  ', I’m poised to drive innovation ' +
  'and collaborate effectively.';

console.log(
  profile(
    'good programming skills',
    'ability to work in a team',
    'eagerness to learn more',
    'a Computer Science degree'
  )
);`;

// Apply translations for given language code
function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  // Update html lang and direction for proper text flow
  document.documentElement.lang = lang;
  if (lang === 'fa') {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
}

// language setup (German default)
setLanguage('de');

// Language toggle buttons
const langButtons = document.querySelectorAll('.lang-toggle button');
langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedLang = btn.getAttribute('data-lang');
    setLanguage(selectedLang);
    langButtons.forEach(b => b.classList.toggle('active-lang', b === btn));
  });
});

// Theme toggle (light or dark)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    themeToggle.textContent = '☀️';  // switch to sun icon for light mode
  } else {
    themeToggle.textContent = '🌙';  // switch to moon icon for dark mode
  }
});

// Hamburger menu toggle for mobile
const burger = document.querySelector('.burger');
const navMenu = document.getElementById('nav-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
// Close menu when a nav link is clicked (on mobile)
document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      burger.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });
});

// Skills section animation, fill bars when scrolled into view
let skillsAnimated = false;
function animateSkillBars() {
  document.querySelectorAll('.skill-level').forEach(bar => {
    const level = bar.getAttribute('data-level');
    bar.style.width = level + '%';
  });
}
window.addEventListener('scroll', () => {
  if (!skillsAnimated) {
    const skillsSection = document.getElementById('skills');
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      animateSkillBars();
      skillsAnimated = true;
    }
  }
});

function appendUser(text){
  const row = el('div','chat-row'),
        b   = el('div','user-msg');
  b.textContent = text.trim();
  row.appendChild(b);
  msgArea.appendChild(row);
}

function appendThinking(){
  const row = el('div','chat-row'),
        b   = el('div','bot-msg'),
        dots= el('div','bot-thinking');
  ['','',''].forEach(()=>dots.appendChild(el('span','')));
  b.appendChild(dots);
  row.appendChild(b);
  msgArea.appendChild(row);
  return b;         // return the bubble so we can replace it later
}

function appendBot(text, replaceNode){
  const row = el('div','chat-row'),
        b   = el('div','bot-msg'),
        p   = el('button','play-btn');

  b.textContent = text;
  p.textContent = playIcon;
  b.appendChild(p);
  row.appendChild(b);

  if(replaceNode) replaceNode.parentNode.replaceWith(row);
  else msgArea.appendChild(row);

let url = null, audioEl = null, loaded = false;

p.addEventListener('click', () => {
  if (loaded) {                      
    audioEl.currentTime = 0;
    audioEl.play().catch(console.error);
    return;
  }

  p.disabled = true;
  fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  .then(r => r.ok ? r.json() : Promise.reject(r))
  .then(({ audio }) => {
    url      = `data:audio/mpeg;base64,${audio}`;
    audioEl  = new Audio(url);         
    loaded   = true;
    p.disabled = false;                 
    p.textContent = "🔊";                
  })
  .catch(err => {
    console.error(err);
    p.textContent = "⚠";
    p.disabled = false;
  });
});

}

// open, close 
function openChat(){
  chatBox.classList.remove('hidden');
  chatBox.classList.add('show');
  input.focus();
}
function closeChat(){
  chatBox.classList.add('hidden');
  chatBox.classList.remove('show');
}

// event wiring 
toggleBtn.addEventListener('click', openChat);
closeBtn .addEventListener('click', closeChat);

form.addEventListener('submit', e=>{
  e.preventDefault();
  const text = input.value;
  if(!text.trim()) return;
  appendUser(text);
  input.value = '';

  // bot reply 
  const thinkingBubble = appendThinking();

fetch('/api/chat', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({message: text})
})
  .then(res => res.ok ? res.json() : Promise.reject(res))
  .then(data => {
    appendBot(data.answer || '🤖 …', thinkingBubble);
    msgArea.scrollTop = msgArea.scrollHeight;
  })
  .catch(err => {
    console.error(err);
    appendBot('⚠️  Sorry, the assistant is unavailable.', thinkingBubble);
  });

});

// auto-scroll on new messages appear 
const observer = new MutationObserver(()=> msgArea.scrollTop = msgArea.scrollHeight);
observer.observe(msgArea, {childList:true});
