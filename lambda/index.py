import json
import requests

def lambda_handler(event, context):
    path = event['path']
    method = event['httpMethod']

    data = {
        'hello': 'world',
        'event': event
    }

    

    if path == '/hello':
        data['message'] = 'Hello World!'

    if path == '/fetch':
        res = requests.get('http://google.com', timeout=5)
        print('status', res.status_code)
        if res.status_code == 200:
            data['message'] = res.text
        else:
            data['message'] = 'Failed to fetch'

    return {
        "statusCode": 200,
        "body": json.dumps(data)
    }
