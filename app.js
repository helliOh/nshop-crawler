const fetch = require('./lib/fetcher')
const build = require('./lib/query-builder')
const mapper = require('./lib/mapper')

const xlsx = require('./lib/node-xlsx-util')

async function getProductTraffic(productName){
    const url = build({ productName, page : 1 })
    console.log(url)
    
    console.time("API response")
    console.timeLog('API response')
    const result = await fetch(url)
    console.timeEnd('API response')

    const nonAdProducts = result.shoppingResult.products.map(a => mapper(a))

    const compareProducts = nonAdProducts.filter(item => item['판매처'] == '가격비교상품')
    .map(item =>{
        return {
            '순위' : item['순위'],
            '등록일' : item['등록일'],
            '브랜드' : item['브랜드'],
            '상품명' : item['상품명'],
            '가격' : item['가격'],
            '평점' : item['평점'],
            '리뷰 수' : item['리뷰 수'],
            '주소' : item['주소']
        }
    })

    const normalProducts = nonAdProducts.filter(item => item['판매처'] != '가격비교상품')
    .map(item =>{
        return {
            '순위' : item['순위'],
            '등록일' : item['등록일'],
            '브랜드' : item['브랜드'],
            '상품명' : item['상품명'],
            '판매처' : item['판매처'],
            '가격' : item['가격'],
            '판매 건수' : item['판매 건수'],
            '리뷰 수' : item['리뷰 수'],
            '주소' : item['주소']
        }
    })
    
    normalProducts.sort((a, b) => b['판매 건수'] - a['판매 건수'])

    return [
        compareProducts,
        normalProducts
    ]
}

function replaceSymbol(str){  
    var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    //특수문자 검증
    if(reg.test(str)){
      //특수문자 제거후 리턴
      return str.replace(reg, "");    
    } else {
      //특수문자가 없으므로 본래 문자 리턴
      return str;
    } 
} 

(async() =>{
    const shared = []
    const private = []
    
    const namelist = [
        '기모 후드티',
        '랄프로렌 맨투맨'
    ]

    for(const name of namelist){
        const result = await getProductTraffic(name)
        
        const [ catalogue, normal ] = result

        shared.push(catalogue)

        let sheetName = replaceSymbol(name.slice(0, 26))//엑셀 시트 이름 31자 이하, 시트 이름 = 26자 +3자, ex 시트이름겹침2
        const dup = private.filter(res => res.name.includes(sheetName))

        if(dup.length) sheetName += (dup.length + 1).toString()


        console.log(sheetName)
        private.push({ name : sheetName, data : normal })
    }

    xlsx.save(
        'report.xlsx', 
        [
            { name : '가격비교상품', data : shared.reduce((a, b) => a.concat(b)), },
            ...private
        ]
    )

})()
