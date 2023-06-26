import index

def test_main():
    index.lambda_handler({'path': '/hello', 'httpMethod': 'GET'}, None)
    index.lambda_handler({'path': '/fetch', 'httpMethod': 'GET'}, None)
