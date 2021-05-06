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

