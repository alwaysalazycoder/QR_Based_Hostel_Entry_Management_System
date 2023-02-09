class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {

        let keyword = {};
        
        keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};

        if (this.queryStr.enroll) {
            keyword.enrollment_no = Number(this.queryStr.enroll);
        }

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr}; 
        
        // Remove some field for category.. 
        const removeFields = ["keyword","page","limit","enrollment_no"];
        removeFields.forEach(key => {
            delete queryCopy[key]
        });

        let filterProperty = {};

        if(queryCopy.status){
            filterProperty.status = queryCopy.status;
        }
        if(queryCopy.floor){
            filterProperty.floor = queryCopy.floor;
        }
       
        this.query = this.query.find({...filterProperty});
        return this;

    }

    pagination(resultPerPage){ 

        const currentPage = Number(this.queryStr.page )|| 1; 

        const skip = (resultPerPage * (currentPage-1));

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }


}

module.exports = ApiFeatures;