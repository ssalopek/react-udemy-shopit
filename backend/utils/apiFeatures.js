class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    //Search by keyword and display results by name
    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword, //$regex provides regular expression capabilities for pattern matching strings in queries.
                $options: 'i' //'i' means case insensitive
            }
        } : {}

        //console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(){
        const queryCopy = { ...this.queryString };

        //Remove fields that are not needed when filtering by category
        const removeFields = ['keyword', 'limit', 'page'] //remove these fields
        removeFields.forEach(el => delete queryCopy[el]);
        //console.log(queryCopy);

        //Advanced filter for price
        let queryString = JSON.stringify(queryCopy)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`) //https://jsfiddle.net/c52z8ewr/ 
        //that is console result you get here. Solution to catch that $ operator
        //console.log(queryString); 

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }   

    pagination(resultsPerPage){
        const currentPage = Number(this.queryString.page) || 1; //1 is default page
        /** SKIP PAGE LOGIC 
         * I have 10 products per page (30 total items). Take 10 products and multiplay with currentPage-1. 
         * That means that on page 2 I will skip 10 products.
         * On page 3 I will skip 20 products...
        */
        const skip = resultsPerPage * (currentPage - 1); 
        this.query = this.query.limit(resultsPerPage).skip(skip)
        return this;
    }
}

module.exports = APIFeatures