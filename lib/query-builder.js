const qs = require('qs')

const baseUrl = `https://search.shopping.naver.com/api/search/all`
const baseQuery = { 
    query : '',
    cat_id : '',
    frm : 'NVSHATC',
    pagingIndex : 1,
    pagingSize : 80
}

function queryInterface(filter){
    const { productName, page } = filter

    const query = Object.assign({}, baseQuery)

    query.pagingIndex = page ? page : 1
    query.query = productName ? productName : ''

    let url = baseUrl + qs.stringify(query, { addQueryPrefix : true })

    return url
}

module.exports = queryInterface