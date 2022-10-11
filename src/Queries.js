import { client, Query, Field} from "@tilework/opus";

const { REACT_APP_GRAPHQL_ENDPOINT } = process.env;
client.setEndpoint(REACT_APP_GRAPHQL_ENDPOINT);

const getCategoriesList = async () => {

    const queryCategoriesList = new Query("categories", true)    
    .addFieldList(["name"])    
   
    return await client.post(queryCategoriesList)
  }

const getCategory = async (category) => {
  
    const queryCategory = new Query("category", true)
      .addArgument("input", "CategoryInput", { title : category})
      .addField(new Field("products", true).addFieldList(["id", "name", "brand", "attributes{id, name, type, items{displayValue, value, id}}", "inStock", "gallery", "prices{amount, currency{label}}"]));    
  
    return await client.post(queryCategory)
}

const getAllCurrencies = async () => {
  
  const queryCurrencies = new Query("currencies", true)
    .addFieldList(['symbol', 'label']);

  return await client.post(queryCurrencies)
}

const getSingleProduct = async (product) => {
  
  const querySingleProduct = new Query("product", true)
  .addArgument("id", "String!", product)
  .addFieldList(["id", "name", "description", "brand", "attributes{id, name, type, items{displayValue, value, id}}", "inStock", "gallery", "prices{amount, currency{label}}"]);   

  return await client.post(querySingleProduct)
}

const Queries = {getCategoriesList, getCategory, getAllCurrencies, getSingleProduct};

export default Queries;