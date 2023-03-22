var global_profile;
var global_summary;
var global_trend;
var global_chart;
var global_news;
var tickervalue;
var tab=0; //0-none, 1-profile, 2-summary, 3-chart, 4-news


var searchError = document.getElementById("searcherror");
var searchSuccess = document.getElementsByClassName("search_success");
var input = document.getElementById("ticker");
function resetform(){
   // console.log("hi")
    //console.log(searchSuccess)
    input.value = "";
    searchError.style.display = "none";
    for (var i=0;i<searchSuccess.length;i+=1){
        
        searchSuccess[i].style.display = "none";
      }

}

async function serverReq(ticker){

    //console.log("Serve func "+ticker);
    var url = "/company_profile/"+ticker;
    let response = await fetch(url);
    let data = await response.text();
    valid_response(data);

}


function fetch_ticker(event){
    event.preventDefault()
    var ticker = document.getElementById("ticker").value;
    if(ticker == ''){
        //console.log("no entry")
    }
    else{
        //console.log("fetch "+ticker);
        ticker = ticker.toUpperCase()
        tickervalue = ticker;
        serverReq(ticker);
    }
    
}

async function StockserverReq(ticker){

    //console.log("In stockserve");
    var url = "/stock_summary/"+ticker;
    let response = await fetch(url);
    let data = await response.text();
    // console.log(global_summary);
    global_summary = data;
    // console.log(ticker);
}

async function ChartserverReq(ticker){

    //console.log("In chartserve");
    var url = "/chart/"+ticker;
    //console.log("I am here"+ticker)
    let response = await fetch(url);
    let data = await response.text();
    //console.log(data)
    global_chart = data;
    // console.log(ticker);
}

async function RecommendserverReq(ticker){

    //console.log("In recommendserve");
    var url = "/recommendation_trends/"+ticker;
    //console.log("I am here"+ticker)
    let response = await fetch(url);
    let data = await response.text();
    //console.log(data)
    global_trend = data;
    // console.log(ticker);
}

async function NewsserverReq(ticker){

    //console.log("In bewsserve");
    var url = "/news/"+ticker;
    let response = await fetch(url);
    let data = await response.text();
    global_news= data;
    // console.log(ticker);
}


var searchError = document.getElementById("searcherror");
var searchSuccess = document.getElementsByClassName("search_success");


async function valid_response(data){
    // console.log("hey",data)
    //console.log(Object.keys(data).length)
    if (Object.keys(data).length == 3) {
        //console.log("I am here in if Empty outlook JSON, no such stock");
        searchError.style.display = "block";
        for (var i=0;i<searchSuccess.length;i+=1){
            searchSuccess[i].style.display = "none";
          }    } 
    
    else {
        //console.log("I am here in else Empty outlook JSON, no such stock");
        searchError.style.display = "none";
        for (var i=0;i<searchSuccess.length;i+=1){
            searchSuccess[i].style.display = "block";
          }
       
        global_profile = data;  
        
        if(tab == 0 || tab == 1){
            //console.log("tab",tab)
            show_company_profile();
        }
        
        await StockserverReq(tickervalue)
        await RecommendserverReq(tickervalue)
        if(tab == 2){
            //console.log("tab",tab)
            show_summary();
        }

        await ChartserverReq(tickervalue)
        highchart()
        if(tab == 3){
            //console.log("tab",tab)
            show_chart();
        }
        await NewsserverReq(tickervalue)
        if(tab == 4){
            //console.log("tab",tab)
            show_news();
        }
        
    }
}


var companybutton = document.getElementById("company");
var summarybutton = document.getElementById("summary");
var chartbutton = document.getElementById("charts");
var newsbutton = document.getElementById("news");

var chartContent = document.getElementById("chartcontent");

var outputcontrol = document.getElementById("output");
function show_company_profile(){
    data = global_profile;
    companybutton.classList.add("active");
    summarybutton.classList.remove("active");
    chartbutton.classList.remove("active");
    newsbutton.classList.remove("active");
    chartContent.style.display = "none";
    //console.log(global_profile);
    data = JSON.parse(data)
    tab = 1;
    //console.log("function tab",tab)

    let display = "<div class = 'profilecontent'><table class = 'tab1'>";
    display += "<tr><th colspan ='2' class = 'logo'>" + "<img src = '"+data["logo"] + "'></th></tr>";
    display += "<tr><th>Company Name</th><td>" + data["name"] + "</td></tr>";
    display += "<tr><th>Stock Ticker Symbol</th><td>" + data["ticker"] + "</td></tr>";
    display += "<tr><th>Stock Exchange Code</th><td>" + data["exchange"] + "</td></tr>";
    display += "<tr><th>Company Start Date</th><td>" + data["ipo"] + "</td></tr>";
    display += "<tr><th>Category</th><td>" + data["finnhubIndustry"] + "</td></tr></table></div>";

    
    outputcontrol.innerHTML = display;
         
}

var outputcontrol = document.getElementById("output");
function show_summary(){
    data = global_summary;
   // console.log(data)
    //console.log("function tab",tab)
    tab = 2;
    companybutton.classList.remove("active");
    summarybutton.classList.add("active");
    chartbutton.classList.remove("active");
    newsbutton.classList.remove("active");
    if (Object.keys(data).length == 3){
        outputcontrol.innerHTML = '<div class="error" style="margine-left: auto; margin-right: auto; margin-top:auto;">Error : Stock Sumamry Data could not be be found , please try another tab.</div>'
        chartContent.style.display = "none";
    }
    else{
        chartContent.style.display = "none";
        data = JSON.parse(data)
    
        let display = "<table class = 'tab1'>";
        display += "<tr style = 'border-top: 0.5px solid rgb(204, 204, 204);'><th>Stock Ticker Symbol</th><td>" + data["name"] + "</td></tr>";
        display += "<tr><th>Trading Day</th><td>" + data["date"] + "</td></tr>";
        display += "<tr><th>Previous Closing Price</th><td>" + data["pc"] + "</td></tr>";
        display += "<tr><th>Opening Price</th><td>" + data["o"] + "</td></tr>";
        display += "<tr><th>High Price</th><td>" + data["h"] + "</td></tr>";
        display += "<tr><th>Low Price</th><td>" + data["l"] + "</td></tr>";

        if(data["d"] < 0){
        display += "<tr><th>Change</th><td>" + data["d"] + "<img class = 'arrow' src = 'static/img/RedArrowDown.png'></td></tr>";
        }
        else{
            if(data["d"] == 0 || data['d']==null){
                display += "<tr><th>Change</th><td>" + data["d"] + "</td></tr>";
            }
            else{
            display += "<tr><th>Change</th><td>" + data["d"] + "<img class = 'arrow' src = 'static/img/GreenArrowUp.png'></td></tr>";
            }
        }

        if(data["dp"] < 0){
        display += "<tr><th>Change</th><td>" + data["dp"] + "<img class = 'arrow' src = 'static/img/RedArrowDown.png'></td></tr>";
        }
        else{
            if(data["dp"] == 0 || data['dp']==null){
                display += "<tr><th>Change Percent</th><td>" + data["dp"] + "</td></tr>";
            }
            else{
            display += "<tr><th>Change Percent</th><td>" + data["dp"] + "<img class = 'arrow' src = 'static/img/GreenArrowUp.png'></td></tr>";
            }
        }
        display += "</table>"
        trend = global_trend
        if (Object.keys(trend).length == 3 || Object.keys(trend).length == 0){
            var table = "<table><tr><td colspan = '6' style = 'text-align:center;'> No recommendation trend data found</td></tr></table>";
        }
        else{
            //console.log(trend);
        trend = JSON.parse(trend)
        
        var table = "<table class='rec'>"
        table += "<tr><td style = 'color: red; text-align:center;'>Strong<br> Sell</td><td bgcolor = 'red' style = 'text-align: center;'>"+ trend["strongSell"]+"</td><td bgcolor = '#B64851' style = 'text-align: center;'>"+ trend["sell"]+"</td> <td bgcolor = '#73A872' style = 'text-align: center;'>"+ trend["hold"]+"</td> <td bgcolor = '#38D335' style = 'text-align: center;'>"+ trend["buy"]+"</td> <td bgcolor = '#67FF64' style = 'text-align: center;'>"+ trend["strongBuy"]+"</td><td style = 'color: #67FF64; text-align:center;'>Strong<br> Buy</td></tr><tr><td colspan ='6' style = 'color: #73A872; text-indent:90px; padding-top:20px; font-size:16px; padding: 5px;'>Recommendation Trends</td></tr></table>"

        // console.log(display)
       // console.log(data)
        }
        display += table;
        outputcontrol.innerHTML = display;
  }
      
}


var chartContent = document.getElementById("chartcontent");

function highchart(){

    data = JSON.parse(global_chart);
    //console.log(data)
    
    
   // console.log(Object.keys(data).length)
    if (Object.keys(data).length == 3 || Object.keys(data).length == 0 ){
        chartContent.innerHTML = '<div class="error" style="margine-left: auto; margin-right: auto; margin-top:auto;">Error : Stock Chart Data could not be be found , please try another tab.</div>'
    }
    else{
    var volume = [];
    var price = [];
    var i =0;
    //console.log(data)
    for( i= 0; i< data['date'].length; i++){
        volume.push([data['date'][i],data['vol'][i]]);
        price.push([data['date'][i],data['price'][i]]);
    }

    // console.log(volume)
    // console.log(price)

    Highcharts.stockChart('chartcontent', {

        title: {text: 'Stock Price ' + tickervalue + ' ' + data['today']},

        subtitle: {
            text: '<a href="https://finnhub.io/" target="_blank">Source: Finhub</a>',
            useHTML: true
        },

        yAxis: [ {
            labels:{
                align:'right'
            },
            title: {text: 'Stock Price'},
            opposite: false,
           
        },
        {
            labels: {align: 'left'},
            title: {text: 'Volume'},            
            opposite:true,
        }
    ],
    
        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d'
            }, {
                type: 'day',
                count: 15,
                text: '15d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }],
            selected: 0,
            inputEnabled: false
        },

        series: [{
            type: 'area',
            name: 'Stock Price',
            data: price,
            threshold:null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
        },
            {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                pointPlacement: "on"
            }],
            plotOptions: {
                column: {
                    pointWidth: 3,
                    color: '#404040'
                }
            }
    });
}
}

var chartContent = document.getElementById("chartcontent");
var outputcontrol = document.getElementById("output");

var outputcontrol = document.getElementById("output");
function show_news(){
    //console.log(global_news)
    data = JSON.parse(global_news)
    tab = 4;
    //console.log("function tab",tab)
    companybutton.classList.remove("active");
    summarybutton.classList.remove("active");
    chartbutton.classList.remove("active");
    newsbutton.classList.add("active");
    //console.log(data)
    if (Object.keys(data).length == 3 || Object.keys(data).length == 0  ){
        outputcontrol.innerHTML = '<div class="error" style="margine-left: auto; margin-right: auto; margin-top:auto;">Error : Stock News Data could not be be found , please try another tab.</div>'
        chartContent.style.display = "none";
    }
    else{
        chartContent.style.display = "none";
        let newslist = "";
        let count= data.length;
        let i;
        //console.log("Total news: " + count);
        for (i = 0; i < count; i++) {
            //console.log(i);
            newslist += "<div class='news'><div class='list'>";
            newslist += "<img class='news_image' alt=\'Image\' src=\'" + data[i]["image"] + "\'/></div>";
            newslist += "<div class='news_headline'><p><b>" + data[i]["headline"] + "</b></p>";
            newslist += "<p><span>" + data[i]["datetime"] + "</span></p>";
            newslist += "<p><a href=\'" + data[i]["url"] + "\' target=\"_blank\">See Original Post</a></p></div></div>";
        }
        outputcontrol.innerHTML = newslist;
   } 
}

function show_chart(){
    //console.log(global_chart)
    tab = 3;
    //console.log("function tab",tab)
    companybutton.classList.remove("active");
    summarybutton.classList.remove("active");
    chartbutton.classList.add("active");
    newsbutton.classList.remove("active");
    outputcontrol.innerHTML = "";
    chartContent.style.display = "block";
    
} 

