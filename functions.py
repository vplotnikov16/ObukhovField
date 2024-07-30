import json


def load_config():
    with open('field_config.json') as f:
        return json.load(f)


def save_config(config):
    with open('field_config.json', 'w') as f:
        json.dump(config, f, indent=4)
