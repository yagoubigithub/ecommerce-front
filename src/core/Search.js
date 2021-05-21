import React, { useState, useEffect } from "react";

import Card from "./Card";
import { getProducts, getCategories, list } from "./apiCore";

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = () => {
    if (search) {
      list({ search: search || undefined, category }).then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          setData({ ...data, results: response, searched: true });
        }
      });
    }
  };

  const searchSubmit = (e) => {
    //
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    //
    setData({ ...data, [name]: event.target.value, searched: false });
  };
  const searchForm = () => {
    return (
      <form onSubmit={searchSubmit}>
        <span className="input-group-text">
          <div className="input-group input-group-lg">
            <div className="input-group-prepend">
              <select className="btn mr-2" onChange={handleChange("category")}>
                <option value="All">Pick category</option>
                {categories.map((c, i) => (
                  <option key={i} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              className="form-control"
              onChange={handleChange("search")}
              placeholder="Search By Name"
            />
          </div>

          <div className="btn input-group-append" style={{ border: "none" }}>
            <button className="input-group-text">Search</button>
          </div>
        </span>
      </form>
    );
  };

 const searchMessage = () =>{
   if(searched && results.length > 0 ){
     return `Found ${results.length} products`

   }

   if(searched && results.length < 1){
    return `No Products found`
   }
 }
  const searchedProducts =  (results = []) => {

    return (
       <div>
       <h2 className="mb-4 mt-4">
{searchMessage(searched,results)}
       </h2>
          <div className="row">
        {
            results.map((p,i)=>(<Card product={p} key={i} />))
        }

        </div>
       </div>
    )
  }
  return (
    <div className="row">
      <div className="container mb-3">
      {searchForm()}
      
      
      </div>


      <div className="container-fluid mb-3">
      {searchedProducts(results)}
      
      
      </div>
    </div>
  );
};

export default Search;
