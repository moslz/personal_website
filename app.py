import os, io, base64, asyncio, edge_tts 
from flask import Flask, Response, render_template, request, jsonify, session 
from together import Together 

app = Flask(
    __name__,
    static_folder="static",
    static_url_path="/my_website/static",
    template_folder="templates"
)

app.secret_key = os.getenv("FLASK_SECRET", "dev-only-change-me")

API_KEY = os.getenv("TOGETHER_API_KEY")
if not API_KEY:
    raise RuntimeError("TOGETHER_API_KEY env-var is missing")

client = Together(api_key=API_KEY)

MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"  # free and capable

# preload the prompt text once
with open("system_prompt.txt", "r", encoding="utf-8") as fh:
    SYSTEM_PROMPT = fh.read().strip()

def remote_llama(messages) -> str:
    """Call Together chat endpoint and return assistant reply."""
    resp = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=180,
        temperature=0.6,
        top_p=0.9,
    )
    return resp.choices[0].message.content.strip()

# text to speech helper function
async def generate_audio_async(
    text: str,
    voice: str = "en-US-JennyNeural"
) -> bytes:
    comm = edge_tts.Communicate(text, voice)
    audio_buf = io.BytesIO()
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio_buf.write(chunk["data"])
    return audio_buf.getvalue()

def generate_audio(text: str,
                   voice: str = "en-US-JennyNeural") -> bytes:
    return asyncio.run(generate_audio_async(text, voice))

@app.route("/")
def home():
    return render_template("index.html")


@app.post("/api/chat")
def chat():
    user_text = (request.get_json(force=True).get("message") or "").strip()
    if not user_text:
        return jsonify({"answer": "Ask me something 🙂"}), 400

    history = session.get("history", [])

    messages = (
        [{"role": "system", "content": SYSTEM_PROMPT}]
        + history
        + [{"role": "user", "content": user_text}]
    )

    try:
        answer = remote_llama(messages)
    except Exception as exc:
        print("LLM error:", exc)
        return jsonify({"answer": "⚠️  Sorry, the assistant is unavailable."}), 503

    history += [
        {"role": "user", "content": user_text},
        {"role": "assistant", "content": answer},
    ]
    session["history"] = history[-10:]

    return jsonify({"answer": answer})

@app.post("/api/tts")
def tts():
    text = (request.json or {}).get("text", "").strip()[:500]
    if not text:
        return Response(status=400)

    try:
        mp3_bytes = generate_audio(text)  
    except Exception as exc:
        print("TTS error:", exc)
        return Response(status=503)

    # encode to Base-64 so front-end can use data: URI
    b64_audio = base64.b64encode(mp3_bytes).decode("ascii")
    return jsonify({"audio": b64_audio})

if __name__ == "__main__":
    app.run(debug=True)
