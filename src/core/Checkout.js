import React, { useState, useEffect } from "react";

import Layout from "./Layout";
import Card from "./Card";

import DropIn from "braintree-web-drop-in-react";
import { getBraintreeClientToken, processPayment } from "./apiCore";

import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const Checkout = ({ products }) => {
  const [data, setData] = useState({
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

            //create order
          })

          .catch((error) => {
            console.log(error);
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
              }}
              onInstance={(instance) => (data.instance = instance)}
            />

            <button onClick={buy} className="btn btn-success btn-block">
              Pay
            </button>
          </div>
        ) : (
          <div>hesedff</div>
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
  return (
    <div>
      <h2>Total : ${getTotal()} </h2>
      {showError(data.error)}
      {showSuccess(data.success)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
