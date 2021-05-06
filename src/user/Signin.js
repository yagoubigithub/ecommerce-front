import React, { useState } from "react";
import {Redirect} from "react-router-dom"

import Layout from "../core/Layout";

import { signin , authenticate , isAuthenticated } from "../auth";

const Signin = () => {
  const [values, setValues] = useState({
  
    email: "",
    password: "",
    loading: false,
    error: false,
    redirectToReferrer : false
  });

  const { email, password , error , loading,redirectToReferrer} = values;
  const {user }  = isAuthenticated()

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({...values, error : false , loading : true})
    signin({  email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
          authenticate(data, ()=>{
            setValues({
                ...values,
                redirectToReferrer: true,
              });
          })
        
      }
    });
  };
  const signUpForm = () => (
    <form>
    

      <div className="from-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          value={email}
          onChange={handleChange("email")}
          className="form-control"
        />
      </div>

      <div className="from-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          value={password}
          onChange={handleChange("password")}
          className="form-control"
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
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

  const showLoading = () => (
    <div
      className="alert alert-info"
      style={{ display: loading ? "" : "none" }}
    >
     <h2>loading ...</h2>
    </div>
  );

  const redirectUser = () =>{
      if(redirectToReferrer){
        if(user && user.role === 1){
          return <Redirect to="/admin/dashboard" />
        }else{
          return <Redirect to="/user/dashboard" />
        }
      }

      if(isAuthenticated()){
        return <Redirect to="/" />
      }
  }
  return (
    <Layout
      title="Signin Page"
      description="Node React e commerce website"
      className="container col-md-8 offset-md-2"
    >
      {showLoading()}
      {showError()}
      {signUpForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
