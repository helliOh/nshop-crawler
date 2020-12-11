const fs = require('fs')

const xlsx = require('node-xlsx')

function save(path, sheetArray){
    try{
        console.time('build');
        console.timeLog('build');
        const buffer = xlsx.build(sheetArray
            .map(sheet => ({
                    name : sheet.name,
                    data : json2Array(sheet.data)
                })
            )
        );
        console.timeEnd('build');

        fs.writeFileSync(path, buffer);
    }
    catch(e){
        throw e;
    }
}

function json2Array(objArr){
    if(!objArr) throw new Error('[json2Array]\tWrong Parameter\targument[0] should be array of json\targument is not defined');
    if(!(objArr instanceof Array)) throw new Error('[json2Array]\tWrong Parameter\targument[0] should be array of json\targument is not Array');
    if(!objArr.every(obj => obj instanceof Object)) throw new Error('[json2Array]\tWrong Parameter\targument[0] should be array of json\telement is not Object');

    const header = Object.keys(objArr[0]);

    const arr = [];
    arr.push(header);

    console.time('json2Array');
    console.timeLog('json2Array');
    for(const obj of objArr){
        const values = Object.values(obj);
        
        arr.push(values);
    }
    console.timeEnd('json2Array');

    return arr;
}

function array2Json(arr){
    if(!arr) throw new Error('[array2Json]\tWrong Parameter\targument[0] should be 2-dimension array\targument is not defined');
    if(!(arr instanceof Array)) throw new Error('[array2Json]\tWrong Parameter\targument[0] should be 2-dimension array\targument is not Array');
    if(!arr.every(elem => elem instanceof Array)) throw new Error('[array2Json]\tWrong Parameter\targument[0] should be 2-dimension array\telement is not Array');
    if(arr[0].every(elem => typeof(elem) != 'string' )) throw new Error('[array2Json]\tWrong Parameter\targument[0] should have header\tfirst element of arg[0] should be header');

    const header = arr.shift()
    .map((propName, index) => ({ [propName] : index }))
    .reduce((a, b) => Object.assign(a, b));
    
    const objArr = [];

    console.time('array2Json');
    console.timeLog('array2Json');
    for(const row of arr){
        const json = row.map((value, index) =>{
            const propName = Object.keys(header).find(key => header[key] == index);

            return { 
                [propName] :  value
            }
        })
        .reduce((a, b) => Object.assign(a, b));

        objArr.push(json);
    }
    console.timeEnd('array2Json');

    return objArr;
}

module.exports.save = save;
module.exports.array2Json = array2Json;
module.exports.json2Array = json2Array;
