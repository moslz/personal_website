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

// Translation content for multi-language support
const translations = {
  "de": {
    navHome: "Start",
    navAbout: "Über mich",
    navExperience: "Erfahrung",
    navSkills: "Kenntnisse",
    navProjects: "Projekte",
    navContact: "Kontakt",
    aboutTitle: "Über mich",
    expTitle: "Erfahrung",
    skillsTitle: "Kenntnisse",
    projectsTitle: "Projekte",
    contactTitle: "Kontakt",
    workTitle: "Berufserfahrung",
    eduTitle: "Ausbildung",
    homeIntro: "Softwareentwickler & Masterstudent (Medieninformatik)",
    aboutPara1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.",
    aboutPara2: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    aboutPara3:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    aboutPara4:"Sunt in culpa qui officia deserunt mollit anim id est laborum. Phasellus pretium, justo at facilisis egestas, purus lacus volutpat urna, id vehicula eros libero at purus.",
    aboutPara5:"Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Nulla porttitor accumsan tincidunt. Proin eget tortor risus.",
    job1_role:   "Position 1",
    job1_org:    "Unternehmen / Einrichtung",
    job1_date:   "YYYY – YYYY",
    job1_desc:   "Kurze Beschreibung der Tätigkeiten…",
    job2_role:   "Position 2",
    job2_org:    "Unternehmen / Einrichtung",
    job2_date:   "YYYY – YYYY",
    job2_desc:   "Kurze Beschreibung der Tätigkeiten…",
    edu1_degree: "Abschlussbezeichnung",
    edu1_school: "Bildungseinrichtung",
    edu1_date:   "YYYY – YYYY",
    edu2_degree: "Abschlussbezeichnung",
    edu2_school: "Bildungseinrichtung",
    edu2_date:   "YYYY – YYYY",
    skillML: "Maschinelles Lernen",
    skillNLP: "NLP",
    proj1_title: "Projekt 1",
    proj1_desc: "Kurzbeschreibung des Projekts (Platzhalter).",
    proj2_title: "Projekt 2",
    proj2_desc: "Kurzbeschreibung des Projekts (Platzhalter).",
    contactEmail: "E-Mail:"
  },
  "en": {
    navHome: "Home",
    navAbout: "About",
    navExperience: "Experience",
    navSkills: "Skills",
    navProjects: "Projects",
    navContact: "Contact",
    aboutTitle: "About Me",
    expTitle: "Experience",
    skillsTitle: "Skills",
    projectsTitle: "Projects",
    contactTitle: "Contact",
    workTitle: "Work Experience",
    eduTitle: "Education",
    homeIntro: "Software Developer & Master's Student (Computer Science)",
    aboutPara1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.",
    aboutPara2: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    aboutPara3:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    aboutPara4:"Sunt in culpa qui officia deserunt mollit anim id est laborum. Phasellus pretium, justo at facilisis egestas, purus lacus volutpat urna, id vehicula eros libero at purus.",
    aboutPara5:"Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Nulla porttitor accumsan tincidunt. Proin eget tortor risus.",
    job1_role: "Job Title 1",
    job1_org: "Company / Organization",
    job1_date:  "YYYY – YYYY",
    job1_desc: "Brief description of your responsibilities…",
    job2_role: "Job Title 2",
    job2_org: "Company / Organization",
    job2_date: "YYYY – YYYY",
    job2_desc: "Brief description of your responsibilities…",
    edu1_degree: "Degree Name",
    edu1_school: "Institution Name",
    edu1_date: "YYYY – YYYY",
    edu2_degree: "Degree Name",
    edu2_school: "Institution Name",
    edu2_date: "YYYY – YYYY",
    skillML: "Machine Learning",
    skillNLP: "NLP",
    proj1_title: "Project 1",
    proj1_desc: "Short project description (placeholder).",
    proj2_title: "Project 2",
    proj2_desc: "Short project description (placeholder).",
    contactEmail: "Email:"
  },
};

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

// Theme toggle (light <-> dark)
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

// Skills section animation: fill bars when scrolled into view
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


// helpers for chatbot
const el = (tag, cls) => { const n=document.createElement(tag); n.className=cls; return n; };

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
        b   = el('div','bot-msg');
  b.textContent = text;
  row.appendChild(b);
  if(replaceNode) replaceNode.parentNode.replaceWith(row);
  else msgArea.appendChild(row);
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

  // fake bot reply 
  const thinkingBubble = appendThinking();
  setTimeout(()=>{
    appendBot('🤖  (I will answer once you hook me up to an LLM)', thinkingBubble);
    msgArea.scrollTop = msgArea.scrollHeight;
  }, 1200);
});

// auto-scroll when new messages appear 
const observer = new MutationObserver(()=> msgArea.scrollTop = msgArea.scrollHeight);
observer.observe(msgArea, {childList:true});
