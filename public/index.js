async function loadGroceryList()
{
    //ask server for the grocery list
    var MasterGroceryList = await getJSONfileAsync("groceryItems")

    //console.log(`test Variable: cost of first item from first store: ${MasterGroceryList.groceryListArray[0].acquiredFrom[0].cost} `)

    //now draw it on the screen
    //Draw it on the master list, if its currently needed, add it to the current grocery list

    for(const cate in MasterGroceryList)
    {
        //make the category header
        console.log(`${cate}: ${MasterGroceryList[cate]}`);
        var newCategoryEl = document.createElement("div");
        newCategoryEl.className = "category";
        newCategoryEl.textContent = cate;
        document.getElementById("masterListDisplay").appendChild(newCategoryEl)


        //for each category, list out its items
        for(const item in MasterGroceryList[cate])
        {
            //parent element for the master list
            var newGroceryItem = document.createElement("div")
            newGroceryItem.className = "groceryItem";
            console.log(`${item}: ${MasterGroceryList[cate][item]}`);

            //item needed checkbox
            var newGroceryItemNeeded = document.createElement("div")
            newGroceryItemNeeded.className = "groceryItemNeeded";
            if(MasterGroceryList[cate][item].needed == true) {
                newGroceryItemNeeded.textContent = ":)";
                newGroceryItemNeeded.style.backgroundColor = "green";
            } else {
                newGroceryItemNeeded.textContent = "-_-"
                newGroceryItemNeeded.style.backgroundColor = "blue";
            }
            newGroceryItem.appendChild(newGroceryItemNeeded);

            //item name
            var newGroceryItemName = document.createElement("div")
            newGroceryItemName.className = "groceryItemName";
            newGroceryItemName.textContent = item;
            newGroceryItem.appendChild(newGroceryItemName);


            //for each item, list out its stores
            var newGroceryItemAcquireFromArray = document.createElement("div")
            newGroceryItemAcquireFromArray.className = "groceryItemAcquireFromArray";

            for(const stor in MasterGroceryList[cate][item].acquiredFrom)
            {
                console.log(`${stor}: ${MasterGroceryList[cate][item].acquiredFrom[stor]}`);

                var newGroceryItemAcquiredFromStore = document.createElement("div");
                newGroceryItemAcquiredFromStore.className = "groceryItemAcquireFromStore";

                //store name
                var newGroceryItemAcquiredFromStoreName = document.createElement("div");
                newGroceryItemAcquiredFromStoreName.className = "groceryItemAcquireFromStoreName";
                newGroceryItemAcquiredFromStoreName.textContent = stor;
                newGroceryItemAcquiredFromStore.appendChild(newGroceryItemAcquiredFromStoreName);

                //description
                var newGroceryItemAcquiredFromStoreDescription = document.createElement("div");
                newGroceryItemAcquiredFromStoreDescription.className = "groceryItemAcquireFromStoreDescription";
                newGroceryItemAcquiredFromStoreDescription.textContent = MasterGroceryList[cate][item].acquiredFrom[stor].description;
                newGroceryItemAcquiredFromStore.appendChild(newGroceryItemAcquiredFromStoreDescription);

                //store price
                var newGroceryItemAcquiredFromStorePrice = document.createElement("div");
                newGroceryItemAcquiredFromStorePrice.className = "groceryItemAcquireFromStorePrice";
                newGroceryItemAcquiredFromStorePrice.textContent = MasterGroceryList[cate][item].acquiredFrom[stor].cost;
                newGroceryItemAcquiredFromStore.appendChild(newGroceryItemAcquiredFromStorePrice);

                //store amount
                var newGroceryItemAcquiredFromStoreAmount = document.createElement("div");
                newGroceryItemAcquiredFromStoreAmount.className = "groceryItemAcquireFromStoreAmount";
                newGroceryItemAcquiredFromStoreAmount.textContent = MasterGroceryList[cate][item].acquiredFrom[stor].forAmount;
                newGroceryItemAcquiredFromStore.appendChild(newGroceryItemAcquiredFromStoreAmount);

                //store unit
                var newGroceryItemAcquiredFromStoreUnit = document.createElement("div");
                newGroceryItemAcquiredFromStoreUnit.className = "groceryItemAcquireFromStoreUnit";
                newGroceryItemAcquiredFromStoreUnit.textContent = MasterGroceryList[cate][item].acquiredFrom[stor].unit;
                newGroceryItemAcquiredFromStore.appendChild(newGroceryItemAcquiredFromStoreUnit);


                //add this store to the array of stores
                newGroceryItemAcquireFromArray.appendChild(newGroceryItemAcquiredFromStore);

            }
            newGroceryItem.appendChild(newGroceryItemAcquireFromArray);
            //Add this item to the master list
            document.getElementById("masterListDisplay").appendChild(newGroceryItem)
        }
        
    }
}

//Add a new item the master grocery list
function addNewItemButtonHasBeenClicked()
{
    //get the input data
    var newItemName = document.getElementById("addNewItemName").value;
    var newItemCategory = document.getElementById("addNewItemCategory").value;
    var newItemStore = document.getElementById("addNewItemStore").value;
    var newItemCost = document.getElementById("addNewItemCost").value;
    var newItemAmount = document.getElementById("addNewItemAmount").value;
    var newItemUnit = document.getElementById("addNewItemUnit").value;
    var newItemDescription = document.getElementById("addNewItemDescription").value;

    //communicate with the server to add the new item
    var IOlink = `/addNewGroceryItemToMaster/${newItemName}/${newItemCategory}/${newItemStore}/${newItemCost}/${newItemAmount}/${newItemUnit}/${newItemDescription}?`;
    document.location = IOlink;
}

//add grocery item to current list
function addGroceryItemToCurrentList()
{
    
}



















async function getJSONfileAsync(fileName)
{
    return new Promise((resolve,reject) => {
        try
        {
            dataObjLink = `/ProgramFileRequest/${fileName}?`;

            var xhr = new XMLHttpRequest();  
            xhr.open('GET', dataObjLink, true);
            xhr.onload = function() {
                var dataObj = JSON.parse(this.responseText);

                resolve(dataObj);
            }
            xhr.send();
        }
        catch(err)
        {
            console.log(err)
            reject(err)
        }
    });
}