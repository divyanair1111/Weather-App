from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = '97c7014b915315fdd9966c507ede2e41'

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City is required'}), 400

    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({'error': 'City not found'}), 404

    data = response.json()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
