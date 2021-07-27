const indexedDB = window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB||window.shimIndexedDB
let db 

const req = indexedDB.open("budget",1)
req.onupgradeneeded = ({target}) =>{
    let db = target.result
    db.createObjectStore("pending",{autoIncrement:true})

}

req.onsuccess = ({target}) => {
db = target.result
if(navigator.onLine){
    checkDB()
}
}

function checkDB(){
    const transaction = db.transaction(["pending"],"readwrite")
    const store = transaction.objectStore("pending")
    const getAll = store.getAll()

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
            }
        })
        .then(response => {
            return response.json();
        })
        .then(() => {
            const transaction = db.transaction(["pending"], "readwrite");
            const store = transaction.objectStore("pending");
            store.clear();
        });
        }
    };
}

request.onerror = function(event) {
    console.log(event.target.errorCode);
};
function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}


window.addEventListener("online", checkDB);