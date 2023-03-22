from flask import Flask,jsonify
import requests
from datetime import datetime
from datetime import date
from dateutil.relativedelta import relativedelta

app = Flask(__name__)

key = "#####" 
#key removed for github

@app.route('/')
def index():
    return app.send_static_file('index.html')  

@app.route("/company_profile/<string:ticker>", methods=['GET'])
def company_profile(ticker):
    #print(ticker)
    url = "https://finnhub.io/api/v1/stock/profile2?symbol=%s&token=%s" % (ticker,key)
    #print(url)
    r = requests.get(url)
    #print(r)
    
    res = r.json()
    if 'error' in res:
        return jsonify({})
    #print(res)
    return jsonify(res)

@app.route("/stock_summary/<string:ticker>", methods=['GET'])
def stock_summary(ticker):
    #print(ticker)
    url = "https://finnhub.io/api/v1/quote?symbol=%s&token=%s" % (ticker,key)
    #print(url)
    r = requests.get(url)
    res = r.json()
    #print(res)
    #print(len(res))
    if 'error' in res:
        return jsonify({})
    new_res = {}
    new_res['name'] = ticker
    new_res['pc'] = res['pc']
    new_res['o'] = res['o']
    new_res['h'] = res['h']
    new_res['l'] = res['l']
    new_res['d'] = res['d']
    new_res['dp'] = res['dp']
    epoch_time = res['t']
    time_formatted = datetime.fromtimestamp(epoch_time)
    my_date = time_formatted.strftime("%d %B, %Y")
    new_res['date'] = my_date
    
    return jsonify(new_res)

@app.route("/recommendation_trends/<string:ticker>", methods=['GET'])
def recommendation_trends(ticker):
    #print(ticker)
    url = "https://finnhub.io/api/v1/stock/recommendation?symbol=%s&token=%s" % (ticker,key)
    #print(url)
    r = requests.get(url)
    res = r.json()
    #print(res)
    if 'error' in res or len(res) < 1:
        return jsonify({})
    #print(res)
    res.sort(key = lambda x:x['period'], reverse = True)
    #print(len(res))
    return jsonify(res[0])

@app.route("/chart/<string:ticker>", methods=['GET'])
def chart_data(ticker):
    #print(ticker)
    today = datetime.now()
    ##print(today)
    prev = today - relativedelta(months=6,days=1)
    prev = prev.strftime("%Y-%m-%d")
    prev = datetime.fromisoformat(prev)
    prevdate = int(prev.timestamp())
    ##print(prevdate)
    todaydate =  int(today.timestamp())
    resolution = 'D'
    url = "https://finnhub.io/api/v1/stock/candle?symbol=%s&resolution=%s&from=%s&to=%s&token=%s" % (ticker,resolution,str(prevdate), str(todaydate), key)
    #print(url)
    r = requests.get(url)
    ##print(r)
    res = r.json()
    #print(res)
    if 'error' in res or len(res) < 3:
        return jsonify({})
    #print(res)
    #print(len(res))
    new_res = {}
    new_res['price'] = res['c']
    new_res['vol'] = res['v']   
    epoch_time = res['t']
    for i in range(len(epoch_time)):
        epoch_time[i] = epoch_time[i]*1000

    #print(epoch_time)
    new_res['date'] = epoch_time
    new_res['today'] = today.strftime("%Y-%m-%d")
    #print(len(new_res))
    return jsonify(new_res)

@app.route("/news/<string:ticker>", methods=['GET'])
def news_data(ticker):
    #print(ticker)
    today = datetime.now()    
    prev = today - relativedelta(days=30)
    prev = prev.strftime("%Y-%m-%d")
    today = today.strftime("%Y-%m-%d")
    url = "https://finnhub.io/api/v1/company-news?symbol=%s&from=%s&to=%s&token=%s" % (ticker,prev, today, key)
    #print(url)
    r = requests.get(url)
    res = r.json()
    #print(res)
    if 'error' in res:
        return jsonify({})
    #print(len(res))
    new_res = []
    i = 0
    ctr = 5
    k = 0
    while k < 5 and i < len(res):
        if ('headline' in res[i] and res[i]['headline'] != '') and ('image' in res[i] and res[i]['image'] != '') and ('datetime' in res[i] and res[i]['datetime'] != '') and ('url' in res[i] and res[i]['url'] != ''):
            time_formatted = datetime.fromtimestamp(res[i]['datetime']) 
            res[i]['datetime'] = time_formatted.strftime("%d %B, %Y")
            new_res.append(res[i])
            #print(new_res[k])
            k+=1
        else:
            pass
        i+=1

    #print(new_res)
    return jsonify(new_res)


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
