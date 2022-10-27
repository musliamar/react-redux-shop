import { client, Query, Field} from "@tilework/opus";

client.setEndpoint('http://localhost:4000');

export const getCategoriesList = async () => {

    const queryCategoriesList = new Query("categories", true)    
    .addFieldList(["name"])    
   
    return await client.post(queryCategoriesList)
  }

export const getCurrenciesList = async () => {
  
  const queryCurrencies = new Query("currencies", true)
    .addFieldList(['symbol', 'label']);

  return await client.post(queryCurrencies)
}

export const getCategory = async (category) => {
  
  const queryCategory = new Query("category", true)
    .addArgument("input", "CategoryInput", { title : category})
    .addField(new Field("products", true).addFieldList(["id", "name", "brand", "description", "category", "attributes{id, name, type, items{displayValue, value, id}}", "inStock", "gallery", "prices{amount, currency{label}}"]));    

  return await client.post(queryCategory)
}

export const getProduct = async (product) => {
  
  const queryProduct = new Query("product", true)
    .addArgument("id", "String!", product) 
    .addFieldList(["id", "name", "brand", "description", "category", "attributes{id, name, type, items{displayValue, value, id}}", "inStock", "gallery", "prices{amount, currency{label}}"]);    

  return await client.post(queryProduct)
}

export default getProduct;