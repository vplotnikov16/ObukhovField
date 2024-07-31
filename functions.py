import json
import os

ABS_FILE_PATH = os.path.abspath(os.path.dirname(__file__))
ABS_DIR_PATH = os.path.dirname(ABS_FILE_PATH)
CONFIG_NAME = "field_config.json"


def load_config():
    if os.path.exists(ABS_DIR_PATH + "/" + CONFIG_NAME):
        with open(ABS_DIR_PATH + "/" + CONFIG_NAME) as f:
            return json.load(f)
    else:
        return {f"{i}": [] for i in range(1, 26)}


def save_config(config):
    with open(ABS_DIR_PATH + "/" + CONFIG_NAME, 'w') as f:
        json.dump(config, f, indent=4)
