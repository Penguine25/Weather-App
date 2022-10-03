const fs = require('fs');
const http = require('http');
const url = require('url');
const axios = require('axios').default;
require('dotenv').config();

const homePage = fs.readFileSync(`${__dirname}/home.html`, 'utf-8');
const key = process.env.API_KEY;
var api = `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${key}`;

const changeIntoCelcius = (temp) => {
    return Math.round((temp - 273.15));
}

function replaceKeywords(place, title, temp) {
    let output = homePage.replace('{%TITLE%}', title);
    output = output.replace('{%PLACE%}', place);
    output = output.replace('{%DEGREE%}', temp);
    return output;
}

axios.get(api)
    .then(function(response){
        dataobj = response.data;
        temp = changeIntoCelcius(dataobj.main.temp);
        title = dataobj.weather[0].main;
        place = dataobj.name;
    })
    .catch(function(err){
        console.log(err);
    })
    
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if(pathname === '/' || pathname === '/home'){
        o = replaceKeywords(place, title, temp);
        res.writeHead(200, { 'Content-type' : 'text/html' });
        res.end(o);
    }
    else if(pathname === '/search'){
        console.log(query.place);
        api = `https://api.openweathermap.org/data/2.5/weather?q=${query.place}&appid=${key}`;
        axios.get(api)
            .then(function (response) {
                obj = response.data;
                temp_ = changeIntoCelcius(obj.main.temp);
                title_ = obj.weather[0].main;
                place_ = obj.name;
                j = replaceKeywords(place_, title_, temp_);
                res.end(j);
            })
            .catch(function (err) {
                res.writeHead(200, { 'Content-type' : 'text/html' });
                res.end('<h1>Place not recognized</h1>');
            })
    }
    else{
        res.writeHead(404, { 'Content-Type' : 'text/html'})
        res.end('<h1>Error 404: Page not Found</h1>');
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log('Server is listening at localhost:8000');
});
