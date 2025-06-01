import os
from flask import Flask, render_template, request, jsonify
from together import Together 

app = Flask(
    __name__,
    static_folder="static",
    static_url_path="/my_website/static",
    template_folder="templates"
)

API_KEY = os.getenv("TOGETHER_API_KEY")
if not API_KEY:
    raise RuntimeError("TOGETHER_API_KEY env-var is missing")

client = Together(api_key=API_KEY)

MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"  # free and capable

# preload the prompt text once
with open("system_prompt.txt", "r", encoding="utf-8") as fh:
    SYSTEM_PROMPT = fh.read().strip()

def remote_llama(user_text: str) -> str:
    """Call Together chat endpoint and return plain string."""
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_text},
        ],
        max_tokens=180,
        temperature=0.6,
        top_p=0.9,
    )
    return resp.choices[0].message.content.strip()

@app.route("/")
def home():
    return render_template("index.html")


@app.post("/api/chat")
def chat():
    data      = request.get_json(force=True)
    user_text = (data.get("message") or "").strip()

    if not user_text:
        return jsonify({"answer": "Ask me something 🙂"}), 400

    try:
        answer = remote_llama(user_text)
    except Exception as exc:                     
        print("LLM error:", exc)
        return jsonify({"answer": "⚠️  Sorry, the assistant is unavailable."}), 503

    return jsonify({"answer": answer})



if __name__ == "__main__":
    app.run(debug=True)
