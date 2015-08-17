import json
from flask import Flask, request, make_response

app = Flask(__name__)

@app.route('/rum', methods=['GET'])
def do_ajax():
    resp = make_response()
    resp.headers['Access-Control-Allow-Origin'] = '*'
    if request.method == 'GET':
        print request.data
    return resp;

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
