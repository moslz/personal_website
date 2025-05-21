# my_website/app.py
from flask import Flask, render_template

app = Flask(
    __name__,
    static_folder="static",
    static_url_path="/my_website/static",
    template_folder="templates"
)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)