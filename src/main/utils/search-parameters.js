class SearchParameters {
	static validOptions = ['title', 'username', 'content', 'all'];

    constructor(query, searchBy) {
        this.query = query || '';  
        this.searchBy = this.validateSearchBy(searchBy);
    }

	validateSearchBy(searchBy) {
        return SearchParameters.validOptions.includes(searchBy) ? searchBy : 'all'; 
    }
}

module.exports = SearchParameters;