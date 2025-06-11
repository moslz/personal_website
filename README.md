# My personal_website

Deutsch: Meine persönliche Website ist eine einseitige Flask-Webapp, die meine Erfahrungen, Fähigkeiten und Projekte vorstellt. Sie bietet ein Light/Dark mode, eine deutsch-englische Übersetzung und einen KI-Assistenten („Jenny“), der Fragen zum Lebenslauf beantwortet und die Antworten mit Microsoft Edge TTS laut vorlesen kann.

English: My personal website is s single-page Flask web-app that showcases my Experience, skills and projects.
It offers a dark/light theme, German–English Translation, and a AI assistant (“Jenny”) that answers CV-related questions and can read its replies aloud using Microsoft Edge TTS.

---

# How to run?

```bash
# 1) clone & enter
git clone https://github.com/<your-repo>/personal-website.git
cd personal-website

# 2) create a clean env
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate

# 3) install runtime deps
pip install -r requirements.txt

# 4) set the two secrets, Most importantly you will need a free and easy to set API KEY from https://www.together.ai/
export TOGETHER_API_KEY="together_live_xxx"          # Llama-3 endpoint
export FLASK_SECRET="something-unguessable"          # signs the session cookie

# 5) run locally, On first launch the site downloads no model files—calls go directly to Together AI.
python app.py     # ⇢ http://127.0.0.1:5000

# Any host that can run a WSGI app with Python 3.10+ works.
# No GPU or large disk is required—the LLM and TTS are cloud-hosted.
```

# What's inside code modules?

`app.py` Flask app: routes, Together AI chat, Edge-TTS audio  
`templates/index.html` Single-page layout with sections for home, about, experience, skills, projects, contact
`static/css/style.css` Theme variables, responsive layout, chatbot styling  
`static/js/script.js` UI logic, language switcher, dark-mode toggle, chat widget  
`static/js/translations.js` German & English strings (easy to extend)  
`system_prompt.txt` System prompt for “Jenny”
