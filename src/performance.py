import json
from flask import Flask, request, make_response

app = Flask(__name__)

@app.route('/ajax', methods=['POST', 'OPTIONS'])
def do_ajax():
    resp = make_response()
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    if request.method == 'POST':
        print request.data
    return resp;

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
