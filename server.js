const express = require('express');
const app = express()
const cors = require('cors');
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

app.get('/parseBuild', (req, res) => {
    console.log(req.query.pastebin)
    runBuildParser(req.query.pastebin).then(function(fromRunBuildParser) {
        console.log(fromRunBuildParser.toString());
        res.send(fromRunBuildParser.toString());
    }).catch(data => {
        res.send(data)
    })
})

app.listen(port, () => {
  console.log(`Build parser listening on http://localhost:${port}`)
})

//https://pastebin.com/wE2gTPdy