const fs = require('fs');
const http = require('http');
const url = require('url');
const axios = require('axios').default;

const homePage = fs.readFileSync(`${__dirname}/home.html`, 'utf-8');
const api = 'https://api.openweathermap.org/data/2.5/weather?q=Ranchi&appid=38bd620eb77090ab0e878c33719f4685';

const changeIntoCelcius = (temp) => {
    return Math.round((temp - 273.15));
}

axios.get(api)
    .then(function(response){
        dataobj = response.data;
        global.temp = changeIntoCelcius(dataobj.main.temp);
        global.title = dataobj.weather[0].main;
        global.place = dataobj.name;
    })
    .catch(function(err){
        console.log(err);
    })

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if(pathname === '/' || pathname === '/home'){
        let o = homePage.replace('{%TITLE%}', global.title);
        o = o.replace('{%PLACE%}', global.place);
        o = o.replace('{%DEGREE%}', global.temp);
        res.writeHead(200, { 'Content-type' : 'text/html' });
        res.end(o);
    }
    else{
        res.writeHead(404, { 'Content-Type' : 'text/html'})
        res.end('<h1>Error 404: Page not Found</h1>');
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log('Server is listening at localhost:8000');
});
