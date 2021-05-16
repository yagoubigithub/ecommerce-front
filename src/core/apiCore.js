import { API } from "../Config";



export const getProducts = ( sortBy ) =>{
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`,
    {
      method : "GET" 
     })
     .then(responce=>{
       return responce.json()
     })
     .catch(err=>console.log(err))
  }


  
export const getCategories = ( ) =>{
  return fetch(`${API}/categories`,
  {
    method : "GET" 
   })
   .then(responce=>{
     return responce.json()
   })
   .catch(err=>console.log(err))
}