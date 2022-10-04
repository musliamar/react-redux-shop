import { client, Query, Field} from "@tilework/opus";

const { REACT_APP_GRAPHQL_ENDPOINT } = process.env;
client.setEndpoint(REACT_APP_GRAPHQL_ENDPOINT);

const getCategoriesList = async () => {

    const queryCategoriesList = new Query("category", true)    
    .addField(new Field("products", true).addFieldList(["category"]))    
   
    return await client.post(queryCategoriesList)
  }

const getCategory = async (category) => {
  
    const queryCategory = new Query("category", true)
      .addArgument("input", "CategoryInput", { title : category})
      .addField(new Field("products", true).addFieldList(["id", "name", "brand", "attributes{id, items{value, id}}", "inStock", "gallery", "prices{amount}"]))    
  
    return await client.post(queryCategory)
}

const Queries = {getCategoriesList, getCategory};

export default Queries;