import os
import datetime
import plaid
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
import config

app = Flask(__name__)
CORS(app)

PLAID_CLIENT_ID = config.PLAID_CLIENT_ID
PLAID_SECRET = config.PLAID_PUBLIC_KEY
PLAID_PUBLIC_KEY = config.PLAID_PUBLIC_KEY
PLAID_ENV = config.PLAID_ENV
PLAID_PRODUCTS = config.PLAID_PRODUCTS
PLAID_COUNTRY_CODES = config.PLAID_COUNTRY_CODES

client = plaid.Client(client_id = PLAID_CLIENT_ID, secret=PLAID_SECRET, public_key=PLAID_PUBLIC_KEY, environment=PLAID_ENV, api_version='2019-05-29')


@app.route('/test', methods=['GET'])
def test():
  return "Hello"

@app.route('/storetoken', methods=['POST'])
def token_received():
  data = request.get_json(force=True)
  global access_token
  public_token = data['public_token']
  if (public_token):
    print(public_token)
    try:
      exchange_response = client.Item.public_token.exchange(public_token)
    except plaid.errors.PlaidError as e:
      print("ERROR IS: ", e)
      return e
    access_token = exchange_response['access_token']
    return jsonify(exchange_response)
  return "test"

# Retrieve Transactions for an Item
# https://plaid.com/docs/#transactions
@app.route('/transactions', methods=['GET'])
def get_transactions():
  start_date = '{:%Y-%m-%d}'.format(datetime.datetime.now() + datetime.timedelta(-365))
  end_date = '{:%Y-%m-%d}'.format(datetime.datetime.now())
  try:
    transactions_response = client.Transactions.get(access_token, start_date, end_date)
  except plaid.errors.PlaidError as e:
    return e

  credit_account_ids = []
  accounts = transactions_response["accounts"]
  for i in accounts:
    if i["subtype"] == "credit card":
      credit_account_ids.append(i["account_id"])

  data_response = []
  transactions = transactions_response["transactions"]
  for index, value in enumerate(transactions):
    if (value["account_id"] in credit_account_ids):
      amount = value["amount"]
      category = value["category"]
      date = value["date"]
      name = value["name"]
      single_data = {
        "name": name,
        "amount": amount,
        "category": category,
        "date": date
      }
      data_response.append(single_data)

  return jsonify({'error': None, 'transactions': data_response})



if __name__ == '__main__':
    # app.run(port=os.getenv('PORT', 5000), debug=True)
    app.run(host='0.0.0.0', debug=True)
