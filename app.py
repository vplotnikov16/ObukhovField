from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)


def load_config():
    with open('field_config.json') as f:
        return json.load(f)


def save_config(config):
    with open('field_config.json', 'w') as f:
        json.dump(config, f, indent=4)


field_config = load_config()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_signal', methods=['POST'])
def get_signal():
    global field_config
    data = request.get_json()
    number = str(data['number'])
    field_config = load_config()
    positions = field_config.get(number, [])
    return jsonify({'stars_positions': positions})


@app.route('/update_config', methods=['POST'])
def update_config():
    global field_config
    try:
        new_data = request.get_json()
        if new_data is None:
            return jsonify({'message': 'Invalid JSON'}), 400

        field_config.update(new_data)
        save_config(field_config)
        return jsonify({'message': 'Configuration updated successfully'})
    except json.JSONDecodeError:
        return jsonify({'message': 'Failed to decode JSON'}), 400


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=False)
