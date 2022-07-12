//main server file 2022-07-12
//Patrick Whitlock

const fs  = require('fs');
const util = require('util');
const WriteFilePromise = util.promisify(fs.writeFile);
const express = require('express');
const app = express();

//Run the program
runMainProgram();

async function runMainProgram()
{
    //Load master grocery list from file
    var groceryItemsMasterList = await readJSONfileAsync('public/groceryItems.json');

    //Start the web server
    app.listen(3257, ()=> console.log('Grocery List Generator server is starting!'));
    app.use(express.static('public'))

    //return master grocerylist to client

    //add new grocery item from client

    //modify a grocery item from client

    //delete a grocery item from client
}






//Needed functions
function readJSONfileAsync(fileName)
{
    return new Promise((resolve,reject) => {
        var dataObj = {};
        var fName = fileName;

        try
        {
            fs.readFile(fName, 'utf8', function(err, data) {
                dataObj = JSON.parse(data);
                resolve(dataObj);
            })
        }
        catch(err)
        {
            console.log(err) //createTickEvent(TickData,"CoinPair","readJSONfile (async)","error","Error! : "+err)
            reject(err)
        }
    });
}