import React, { useState, useEffect } from "react";

import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";

import { getProduct, getCategories, updateProduct } from "./apiAdmin";
import { Redirect } from "react-router-dom";

const UpdateProduct = ({ match }) => {
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
    formData: new FormData(),
    categories: [],
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
    categories,
  } = values;

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        //populate the state
        const fd = new FormData()
        fd.set("name", data.name);
        fd.set("description", data.description);
        fd.set("price", data.price);
        fd.set("category", data.category._id);
        fd.set("shipping", data.shipping);
       
        fd.set("quantity", data.quantity);
        //fd.set("photo", data.photo);
        console.log(data)
       
        const newValues = {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category._id,
            shipping: data.shipping,
            quantity: data.quantity,
            formData : fd,
        }

      
       
        //load categories
        initCategories(newValues);
      }
    });
  };

  //load categories and setForm data

  const initCategories = (newValues) => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
            ...values,
            ...newValues,
          categories: data
        });
        
        
      }
    });

   
  };

  useEffect(() => {
    init(match.params.productId);
  }, []);

  const handleChange = (formData , name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value , formData});
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            photo: "",
            price: "",
            quantity: "",
            loading: false,
            createdProduct: data.name,
          });
        }
      }
    );
  };
  const newPostForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            type="file"
            onChange={handleChange(formData,"photo")}
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
          onChange={handleChange(formData,"name")}
          value={name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>

        <textarea
          type="text"
          className="form-control"
          onChange={handleChange(formData,"description")}
          value={description}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>

        <input
          type="number"
          className="form-control"
          onChange={handleChange(formData,"price")}
          value={price}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Category</label>

        <select className="form-control" onChange={handleChange(formData,"category")}>
          <option>Please selectt</option>
          {categories &&
            categories.map((c, i) => {
              return (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              );
            })}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>

        <input
          type="number"
          className="form-control"
          onChange={handleChange(formData,"quantity")}
          value={quantity}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Shipping</label>

        <select className="form-control" onChange={handleChange(formData,"shipping")}>
          <option>Please selectt</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <button className="btn btn-outline-primary">Update Product</button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>{`${createdProduct} is updated`}</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading ...</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirecteToProfile) {
      if (!error) {
        return <Redirect to="/"></Redirect>;
      }
    }
  };

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
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};
export default UpdateProduct;
