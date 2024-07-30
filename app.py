from flask import Flask, render_template, request, jsonify
import json

from functions import load_config, save_config

app = Flask(__name__)


# field_config = load_config()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_signal', methods=['POST'])
def get_signal():
    data = request.get_json()
    number = str(data['number'])
    positions = load_config().get(number, [])
    return jsonify({'stars_positions': positions})


@app.route('/update_config', methods=['POST'])
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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=False, ssl_context=('/server-cert.pem', '/server-key.pem'))
