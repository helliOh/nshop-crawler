function resultMapper(item){
    const { 
        rank, 
        scoreInfo,
        openDate,
        brand, 
        productTitle, 
        crUrl, 
        reviewCountSum, 
        purchaseCnt, 
        price, 
        mallInfoCache
    } = item

    let dateform = ''
    if(openDate){
        const yyyy = openDate.substr(0, 4)
        const mm = openDate.substr(4, 2)
        const dd = openDate.substr(6, 2)
        dateform = `${yyyy}-${mm}-${dd}`
    }

    return {
        '순위' : rank,
        '등록일' : dateform,
        '브랜드' : brand ? brand : '',
        '상품명' : productTitle,
        '판매처' : mallInfoCache? mallInfoCache.name : '가격비교상품',
        '가격' : price,
        '평점' : scoreInfo,
        '판매 건수' : purchaseCnt,
        '리뷰 수' : reviewCountSum,
        '주소' : crUrl,
    }
}

module.exports = resultMapper