import json
import os

ABS_DIR_PATH = os.path.abspath(os.path.dirname(__file__))
CONFIG_NAME = "field_config.json"

def load_config():
    if os.path.exists(ABS_DIR_PATH + "/" + CONFIG_NAME):
        with open(ABS_DIR_PATH + "/" + CONFIG_NAME) as f:
            return json.load(f)
    else:
        return {f"{i}": [] for i in [1, 3, 5, 7]}

def save_config(config):
    with open(ABS_DIR_PATH + "/" + CONFIG_NAME, 'w') as f:
        json.dump(config, f, indent=4)
