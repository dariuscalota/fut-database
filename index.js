var rp = require('request-promise');

var jsonfile = require('jsonfile');

var TOTAL_PAGES=0;

var players = [];

function getPlayersPages(PAGE) {
    console.log('Page ',PAGE,' of ',TOTAL_PAGES);
    console.log('Records: ', players.length);
    if(PAGE <= 3){
        var options = {
            uri: 'https://www.easports.com/fifa/ultimate-team/api/fut/item?jsonParamObject=%7B%22page%22:'+PAGE+',%22position%22:%22LF,CF,RF,ST,LW,LM,CAM,CDM,CM,RM,RW,LWB,LB,CB,RB,RWB%22%7D',
            json: true
        };
        rp(options)
            .then(function (response) {
                players.push.apply(players, response.items);
                PAGE++;
                setTimeout(function() {
                    getPlayersPages(PAGE);
                }, Math.random() * 2000);
                
            })
            .catch(function (err) {
                console.log(err);
                process.exit();
            });
    } else {
        console.log('finished players');
        console.log('scraping goalkeepers');
        getGoalkeepers();
    }

};

function getGKPages(PAGE) {
    console.log('Page ',PAGE,' of ',TOTAL_PAGES);
    console.log('Records: ', players.length);
    if(PAGE <= 3){
        var options = {
            uri: 'https://www.easports.com/fifa/ultimate-team/api/fut/item?jsonParamObject=%7B%22page%22:'+PAGE+',%22position%22:%22GK%22%7D',
            json: true
        };
        rp(options)
            .then(function (response) {
                players.push.apply(players, response.items);
                PAGE++;
                setTimeout(function() {
                    getGKPages(PAGE);
                }, Math.random() * 2000);
            })
            .catch(function (err) {
                console.log(err);
                process.exit();
            });
    } else {
        console.log('finished goalkeepers');
        console.log('writing to file');
        writeToFile();
    }

};

function getPlayers() {

    var options = {
        uri: 'https://www.easports.com/fifa/ultimate-team/api/fut/item?jsonParamObject=%7B%22page%22:1,%22position%22:%22LF,CF,RF,ST,LW,LM,CAM,CDM,CM,RM,RW,LWB,LB,CB,RB,RWB%22%7D',
        json: true // Automatically parses the JSON string in the response
    };

    rp(options)
        .then(function (response) {
            TOTAL_PAGES = response.totalPages
            console.log(response.totalPages);
            getPlayersPages(1);
        })
        .catch(function (err) {
            console.log(err);
            process.exit();
        });
}

function getGoalkeepers() {

    var options = {
        uri: 'https://www.easports.com/fifa/ultimate-team/api/fut/item?jsonParamObject=%7B%22page%22:1,%22position%22:%22GK%22%7D',
        json: true // Automatically parses the JSON string in the response
    };
    rp(options)
        .then(function (response) {
            TOTAL_PAGES = response.totalPages
            console.log(response.totalPages);
            getGKPages(1);
        })
        .catch(function (err) {
            console.log('dafuq');
            console.log(err);
            process.exit();
        });
}

function writeToFile() {
    var file = './export/players.json';
    
    jsonfile.writeFile(file, players, function (err) {
        if(err){
            console.error(err);
        }
        console.log('success');
        process.exit();
    })
}

getPlayers();