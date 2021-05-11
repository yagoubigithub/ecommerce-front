import React, { useState ,useEffect} from "react";

import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";

import { createCategory, createProduct, getCategories } from "./apiAdmin";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirecteToProfile: false,
    formData: "",
    categories : []
  });

  const {
    name,
    description,
    price,
    category,
    shipping,
    quantity,
    photo,
    loading,
    error,
    createdProduct,
    redirecteToProfile,
    formData,
    categories
  } = values;

 //load categories and setForm data

 const init = () =>{
   getCategories().then(data=>{
     if(data.error){

      setValues({...values, error : data.error})
     }else{
       setValues({
         ...values, categories :data,
         formData : new FormData()
       })
     }
   })
 }

  useEffect(() => {
   
   init()
  }, [])

  const handleChange = (name) => (event) => {

    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value)
    setValues({...values, [name] : value})
  };
  const clickSubmit = event =>{
    event.preventDefault();
    setValues({...values,error : "",loading : true});

    createProduct(user._id,token,formData)
    .then(data=>{
      if(data.error){
        setValues({...values, error : data.error})
      }else{
        setValues({...values, name : "", description : "", photo : "",price : "",quantity : "", loading : false,createdProduct : data.name})
      }
    })

  }
  const newPostForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            type="file"
            onChange={handleChange("photo")}
            name="photo"
            accept="image/*"
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>

        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          value={name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>

        <textarea
          type="text"
          className="form-control"
          onChange={handleChange("description")}
          value={description}
        />
      </div>


      <div className="form-group">
        <label className="text-muted">Price</label>

        <input
          type="number"
          className="form-control"
          onChange={handleChange("price")}
          value={price}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Category</label>

        <select className="form-control" onChange={handleChange("category")}>
          <option >Please selectt</option>
         {
          categories && categories.map((c,i)=>{
             return (<option key={i} value={c._id}>{c.name}</option>)
           })
         }
        </select>
      </div>


      
      <div className="form-group">
        <label className="text-muted">Quantity</label>

        <input
          type="number"
          className="form-control"
          onChange={handleChange("quantity")}
          value={quantity}
        />
      </div>



      <div className="form-group">
        <label className="text-muted">Shipping</label>

        <select className="form-control" onChange={handleChange("shipping")}>
        <option >Please selectt</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

<button className="btn btn-outline-primary">Create Product</button>
    </form>
  );

  const showError = () =>(
    <div className="alert alert-danger" style={{display : error ? "" : "none"}}>
      {error}
    </div>
  );

  const showSuccess = () =>(
    <div className="alert alert-info" style={{display : createdProduct ? "" : "none"}}>
      <h2>{`${createdProduct} is created`}</h2>
    </div>
  );

  const showLoading = () => loading && (
    <div className="alert alert-info">
      <h2>Loading ...</h2>
    </div>
  );
 
  return (
    <Layout
      title="Add  a new Product"
      description={`G'day ${user.name}! ,  ready to add new Product`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
        {showLoading()}
        {showSuccess()}
        {showError()}
        {newPostForm()}</div>
      </div>
    </Layout>
  );
};
export default AddProduct;
