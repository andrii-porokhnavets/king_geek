from flask import Flask, jsonify, request
from flask_cors import CORS
from markupsafe import escape
from psycopg2 import extras
from config import DB_NAME, DB_USER, DB_PASSWORD
import psycopg2
import requests


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": r"http://localhost:3000/*"}})  # disable cors for local development

conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
cur = conn.cursor()

COVID_API = 'https://api.covid19api.com/dayone/country/'


# Utils
def to_country_obj(value):
    return {
        'id': value[0],
        'name': value[1],
        'iso2': value[2],
    }


@app.errorhandler(404)
def not_found(err):
    message = {
        'detail': 'The requested URL was not found on the server'
    }

    return jsonify(message), 404


@app.route('/stats/<country_code>', methods=["GET", "POST"])
def stats(country_code):
    iso2 = escape(country_code).upper()
    
    if request.method == 'GET':
        sql = "SELECT s.id, s.confirmed, s.deaths, s.recovered, s.active, c.name, s.date FROM stats AS s " \
                "JOIN countries AS c " \
                "ON s.country_id = c.id " \
                f"WHERE c.iso2 = '{iso2}'" \
                "ORDER BY s.date"

        try:
            cur.execute(sql)
            res = cur.fetchall()
        except psycopg2.Error:
            return jsonify({'detail': 'Retrieving data is failed'}), 500
        else:
            statistic = [{
                'id': r[0],
                'confirmed': r[1],
                'deaths': r[2],
                'recovered': r[3],
                'active': r[4],
                'country': r[5],
                'date': r[6]
            } for r in res]

            return jsonify(statistic)
    else:
        country_id = request.json.get('country_id')

        try:
            response = requests.get(COVID_API + iso2)
        except requests.exceptions.RequestException:
            return jsonify({'detail': 'Something wrong happened on the server https://api.covid19api.com/'}), 500

        data = [(country_id, s['Confirmed'], s['Deaths'], s['Recovered'], s['Active'], s['Date'])
                for s in response.json()]
        print(data[0])
        try:
            sql = 'INSERT INTO stats (country_id, confirmed, deaths, recovered, active, date) ' \
                  'VALUES (%s, %s, %s, %s, %s, %s)'
            extras.execute_batch(cur, sql, data)
            conn.commit()
        except psycopg2.Error:
            return jsonify({'detail': 'Inserting data failed'}), 500

        return jsonify(), 204


@app.route('/countries', methods=["GET", "POST"])
def countries():
    if request.method == "GET":
        sql = "SELECT * FROM countries ORDER BY countries.iso2"

        try:
            cur.execute(sql)
            res = cur.fetchall()
        except psycopg2.Error as e:
            print(e)
            return jsonify({'detail': 'Retrieving list of countries is failed'}), 500

        return jsonify([to_country_obj(row) for row in res])

    else:
        try:
            response = requests.get('https://api.covid19api.com/countries')
        except requests.exceptions.RequestException:
            return jsonify({'detail': 'Something wrong happened on the server https://api.covid19api.com/'}), 500

        data = [(country['Country'], country['ISO2']) for country in response.json()]

        try:
            extras.execute_batch(cur, 'INSERT INTO countries(name, iso2) VALUES (%s, %s)', data)
            conn.commit()
        except psycopg2.Error:
            return jsonify({'detail': 'Inserting countries data failed'}), 500

        return jsonify(), 204


@app.route('/countries/<country_code>')
def get_country(country_code):
    iso2 = escape(country_code).upper()
    sql = f"SELECT * FROM countries WHERE iso2 = '{iso2}'"

    try:
        cur.execute(sql)
        res = cur.fetchone()
    except psycopg2.Error:
        return jsonify({'detail': f'Retrieving data about country "{iso2}" is failed'}), 500
    else:
        return jsonify(to_country_obj(res))


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
