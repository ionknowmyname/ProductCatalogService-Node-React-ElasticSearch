const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const client = new Client({ node: 'http://localhost:9200' });

/* const client = new Client({
    node: 'https://localhost:9200',
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_USERNAME
    },
    tls: {
        ca: fs.readFileSync('./http_ca.crt'),
        rejectUnauthorized: false
    }
}); */



const indexProduct = async (product) => {
    await client.index({
        index: 'products',
        body: product
    });
}

const searchIndexProductName = async (searchWord) => {

    const result = await client.search({
        index: 'products',
        body: {
            query: {
                fuzzy: {
                    productName: searchWord
                }
            }
        }
    });

    return result.hits.hits.map(hit => hit._source); 
}

const searchIndexProductCategory = async (searchWord) => {

    const result = await client.search({
        index: 'products',
        body: {
            query: {
                fuzzy: {
                    productCategory: searchWord
                }
            }
        }
    });

    return result.hits.hits.map(hit => hit._source);  
}

async function getAllDocuments(index) {

    const result = await client.search({
        index,
        body: {
            query: {
                match_all: {}
            }
        }
    });
  
    // console.log("body from getAllDocuments", result);

    return result.hits.hits.map(hit => hit._source);
}

module.exports = { indexProduct, searchIndexProductName, searchIndexProductCategory, getAllDocuments }