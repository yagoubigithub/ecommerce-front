import { API } from "../Config";

export const createCategory = (userId, token , category) => {
    return fetch(`${API}/category/create/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization :  `Bearer ${token}`
      },

      body: JSON.stringify(category),
    })
      .then((responce) => {
        return responce.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };


  
export const createProduct = (userId, token , product) => {
  return fetch(`${API}/product/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization :  `Bearer ${token}`
    },

    body: product
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      console.log(err);
    });
};


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



export const listOrders = (userId,token) => {
  return fetch(`${API}/order/list/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => console.log(err));
};


export const getStatusValues = (userId,token) => {
  return fetch(`${API}/order/status-values/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => console.log(err));
};