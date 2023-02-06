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


}

module.exports = ApiFeatures;