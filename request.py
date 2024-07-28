import requests

url = 'http://localhost:5000/update_config'
data = {
    "6": ["1-1",
          "1-2",
          "1-3",
          "1-4",
          "1-5",
          "2-1"
          ]
}
headers = {
    'Content-Type': 'application/json'
}

response = requests.post(url, json=data, headers=headers)
print(response.text)
