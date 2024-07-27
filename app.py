import random
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_signal', methods=['POST'])
def get_signal():
    number = request.json['number']
    stars_positions = random.sample(range(25), number)
    return jsonify(stars_positions=stars_positions)


if __name__ == '__main__':
    app.run(debug=True)
