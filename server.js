const express = require('express');
const app = express()
const cors = require('cors');
const request = require('request')
const port = 4000

app.use(cors());

let runBuildParser = (query) => new Promise(function(success, nosuccess) {

    const { spawn } = require('child_process');
    const buildParser = spawn('py', ['./buildParser.py', query]);

    buildParser.stdout.on('data', function(data) {
        success(data);
    });

    buildParser.stderr.on('data', (data) => {
        nosuccess(data);
    });
});

let runItemPricer = (query) => new Promise(function(success, nosuccess) {
    request(`https://poeprices.info/api?l=Scourge&i=${query}`, function(
        error,
        response,
        body
    ) {
        if (body) {
            let data = {
                body: body,
                query: query
            }
            success(data)
        }
        if (error) {
            let data = {
                error: error,
                query: query
            }
            nosuccess(data)
        }
    })
});

app.get('/priceItem', (req, res) => {
    // console.log(req.query.item)
    runItemPricer(req.query.item).then(function(fromRunItemPricer) {
        // console.log(fromRunBuildParser.toString());
        res.send(fromRunItemPricer);
    }).catch(data => {
        res.send(data)
    })
})

app.get('/parseBuild', (req, res) => {
    runBuildParser(req.query.pastebin).then(function(fromRunBuildParser) {
        // console.log(fromRunBuildParser.toString());
        res.send(fromRunBuildParser.toString());
    }).catch(data => {
        res.send(data)
    })
})

app.listen(port, () => {
  console.log(`Build parser listening on http://localhost:${port}`)
})

//https://pastebin.com/wE2gTPdy