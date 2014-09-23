// variables, which can end up being influenced by location of the website
module.exports = {
    port: process.env.PORT || 8000,
    dbConnectionString: process.env.MONGOLAB_URI || 'mongodb://localhost/stockSerrelharia'
};
