import random

from flask import Flask, render_template, request, jsonify
import json
from functions import load_config, save_config

application = Flask(__name__)
random_config = False


def generate_random_config(number):
    positions = []
    num_stars = int(number)
    while len(positions) < num_stars:
        row = random.randint(1, 5)
        col = random.randint(1, 5)
        pos = f"{row}-{col}"
        if pos not in positions:
            positions.append(pos)
    return positions


@application.route('/')
def index():
    return render_template('index.html')


@application.route('/get_signal', methods=['POST'])
def get_signal():
    data = request.get_json()
    number = str(data['number'])
    if random_config:
        positions = generate_random_config(number)
    else:
        positions = load_config().get(number, [])
    return jsonify({'stars_positions': positions})


@application.route('/get_config', methods=['GET'])
def get_field_config():
    field_config = load_config()
    return jsonify(field_config)


@application.route('/update_config', methods=['POST'])
def update_config():
    field_config = load_config()
    try:
        new_data = request.get_json()
        if new_data is None:
            return jsonify({'message': 'Invalid JSON'}), 400

        field_config.update(new_data)
        save_config(field_config)
        return jsonify({'message': 'Configuration updated successfully'})
    except json.JSONDecodeError:
        return jsonify({'message': 'Failed to decode JSON'}), 400


@application.route('/set_random_config', methods=['POST'])
def set_random_config():
    global random_config
    try:
        data = request.get_json()
        random_config = data.get('random_config', False)
        return jsonify({'message': 'Random configuration setting updated successfully'})
    except json.JSONDecodeError:
        return jsonify({'message': 'Failed to decode JSON'}), 400


if __name__ == '__main__':
    application.run(host="0.0.0.0", debug=True)
