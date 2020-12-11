const axios = require('axios')

async function fetcher(url){
    return new Promise(async (resolve, reject) =>{
        try{
            const response = await axios.get(url)
            const { data } = response

            resolve(data)
        }
        catch(e){
            reject(e)
        }
    })
}

module.exports = fetcher