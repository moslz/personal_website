# my_website/app.py
from flask import Flask, render_template

# static_folder and template_folder are defaults, 
# but you can specify them explicitly if you like:
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