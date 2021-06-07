import React, { useState, useEffect } from "react";

import Layout from "./Layout";
import Card from "./Card";

import DropIn from "braintree-web-drop-in-react";
import { getBraintreeClientToken, processPayment } from "./apiCore";

import {emptyCart} from "./cartHelpers"
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const Checkout = ({ products }) => {
  const [data, setData] = useState({
    loading  :false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };
  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    {
      return isAuthenticated() ? (
        <div>{showDropIn()} </div>
      ) : (
        <Link to="/signin">
          <button className="btn btn-primary">Sign in to Checkout </button>
        </Link>
      );
    }
  };

  const buy = () => {
    setData({ loading: true });
    //

    //send the nonce to your server
    // nonce = data.instance.requestPaymentMethod()

    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        // once you nonce (card type, card  number) send nonce as 'paymentMethodNonce' to the backend
        // and also the total to be charged

        // console.log("send nonce and total to process : ", nonce ,getTotal(products))

        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        };

        processPayment(userId, token, paymentData)
          .then((responce) => {
            setData({ ...data, success: responce.success });


            //empty cart

            emptyCart(()=>{
              console.log("payment success and empty catrt")
              setData({ loading: false });
            })

            //create order
          })

          .catch((error) => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch((error) => {
        //console.log(" droping error",error);

        setData({ ...data, error: error.message });
      });
  };
  const showDropIn = () => {
    return (
      <div
        onBlur={() => {
          setData({ ...data, error: "" });
        }}
      >
        {data.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{
                authorization: data.clientToken,
                paypal : {
                  flow : "vault"
                }
              }}
              onInstance={(instance) => (data.instance = instance)}
            />

            <button onClick={buy} className="btn btn-success btn-block">
              Pay
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  const showError = (error) => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = (success) => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Thanks, your payment was successful!
    </div>
  );

  const showLoading = (loading) => loading && <h2>loading ...</h2>
  return (
    <div>
      <h2>Total : ${getTotal()} </h2>
      {showLoading(data.loading)}
      {showError(data.error)}
      {showSuccess(data.success)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
