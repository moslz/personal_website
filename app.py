import os
import io, base64, asyncio        
import edge_tts
from flask import Flask, render_template, request, jsonify
from together import Together 
from flask import Response

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
