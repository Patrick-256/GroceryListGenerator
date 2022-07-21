//main server file 2022-07-12
//Patrick Whitlock

const fs  = require('fs');
const util = require('util');
const WriteFilePromise = util.promisify(fs.writeFile);
const express = require('express');
const app = express();

//Run the program
runMainProgram();
//runTestProgram();

async function runMainProgram()
{
    //Load master grocery list from file
    var groceryItemsMasterList = await readJSONfileAsync('programData/groceryItems.json');

    //Start the web server
    app.listen(3257, ()=> console.log('Grocery List Generator server is starting!'));
    app.use(express.static('public'))

    
    //Program file request  //return master grocerylist to client
    app.get('/ProgramFileRequest/:fileName?', getProgramFile);

    async function getProgramFile(req, res) {
        var data = req.params;
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

        console.log(`USER IP: ${ip} is requesting fileName: ${data.fileName}`)

        reply = await readJSONfileAsync(`programData/${data.fileName}.json`)
        res.send(reply);
    }

    //add new grocery item from client, also adds new stores to items
    app.get('/addNewGroceryItemToMaster/:newItemName/:category/:store/:cost/:amount/:unit/:description/:preferredStore/:boolNewItem?', addNewGroceryItemToMaster);

    async function addNewGroceryItemToMaster(req,res) {
        var data = req.params;
        console.log(`adding ${data.newItemName} to master grocery list!`)

        if(data.boolNewItem == 'true') {
            groceryItemsMasterList[data.category][data.newItemName] = 
            {
                needed: false,
                acquiredFrom: {}
            };
        }
        
        groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store] = {};
        groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].description = data.description;
        groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].cost = data.cost;
        groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].forAmount = data.amount;
        groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].unit = data.unit;
        groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].preferredStore = data.preferredStore;

        //if this item already existed, and if the store being added is the preferred store, set the preferred store value 
        //of other stores to false
        if(data.boolNewItem != 'true') {
            if(data.preferredStore == 'true') {
                //set all stores to false
                for(const storeAcquredFrom in groceryItemsMasterList[data.category][data.newItemName].acquiredFrom)
                {
                    groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[storeAcquredFrom].preferredStore = false;
                }
                //set this store to true
                groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].preferredStore = data.preferredStore;
            }
        }

        //save master grocery list
        await WriteFilePromise('programData/groceryItems.json',JSON.stringify(groceryItemsMasterList,null,4))

        //res.send(`added ${data.newItemName} to master grocery list!`)
        res.redirect('/index.html')
    }

    //add another store to a grocery item - can also modify an existing store
    //app.get('/addAnotherStoreToItem/:category/:itemName/:store/:cost/:amount/:unit/:description?'
    

    //set a grocery item as needed
    app.get('/setGroceryItemNeeded/:category/:itemName/:isNeeded?', setGroceryItemNeeded);

    async function setGroceryItemNeeded(req,res) {
        var data = req.params;
        console.log(`setting ${data.itemName} isNeeded to ${data.isNeeded}`)
        var reply = 'blankReply';

        if(data.isNeeded == 'true') {
            groceryItemsMasterList[data.category][data.itemName].needed = true;
            reply = `set ${data.itemName} isNeeded to ${data.isNeeded}`
            
        }
        else if(data.isNeeded == 'false') {
            groceryItemsMasterList[data.category][data.itemName].needed = false;
            reply = `set ${data.itemName} isNeeded to ${data.isNeeded}`
            
        } else {
            //trying to set to an unexpected value
            reply = `value ${data.isNeeded} is not true or false!`
             
        }

        //save master list
        await WriteFilePromise('programData/groceryItems.json',JSON.stringify(groceryItemsMasterList,null,4))
        //res.send(reply) 
        res.redirect('/index.html')
    }

    //delete a grocery item from client

}


async function runTestProgram() {
    //load grocery list file
    var groceryItemsMasterList = await readJSONfileAsync('programData/groceryItemsV2.json');

    //add a new item
    var data = {
        "newItemName":"refried_beans",
        "category":"canned_goods",
        "store":"ralphs",
        "description":"1_can_of_beans",
        "cost":Number(1.49),
        "amount":Number(16),
        "unit":"oz" 
    }

    groceryItemsMasterList[data.category][data.newItemName] = 
    {
        needed: false,
        acquiredFrom: {}
    };
    groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store] = {};
    groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].description = data.description;
    groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].cost = data.cost;
    groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].forAmount = data.amount;
    groceryItemsMasterList[data.category][data.newItemName].acquiredFrom[data.store].unit = data.unit;

    //save
    await WriteFilePromise('programData/groceryItemsV2.json',JSON.stringify(groceryItemsMasterList,null,4))
}



//Needed functions
async function readJSONfileAsync(fileName)
{
    return new Promise((resolve,reject) => {
        var dataObj = {};
        var fName = fileName;

        try
        {
            fs.readFile(fName, 'utf8', function(err, data) {
                console.log(`Data read from ${fName}: `);
                console.log(data);
                dataObj = JSON.parse(data);
                resolve(dataObj);
            })
        }
        catch(err)
        {
            console.log(err) 
            reject(err)
        }
    });
}