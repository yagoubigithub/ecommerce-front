import React, { useState, useEffect } from "react";

import Layout from "./Layout";
import Card from "./Card";
import { read  , listRelated} from "./apiCore";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);
  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);

        //fetch related product

        listRelated(data._id).then(data=>{
          if (data.error) {
            setError(data.error);
          }else{

            setRelatedProduct(data)
          }
        })
      }
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;

    loadSingleProduct(productId);
  }, [props]);
  return (
    <Layout
      title={product && product.name}
      description={product && product.description}
      className="container-fluid"
    >
      <h2 className="mb-4">Single Product</h2>
      <div className="row">
        <div className="col-8">

        { product._id !== undefined && <Card product={product} showViewProductButton={false} />}
        </div>
        <div className="col-4">

          <h4>Related Product</h4>
          {

relatedProduct.map((p,i)=>(<div className="mb-3">
<Card product={p} />
</div>))
          }

        </div>
      </div>
    </Layout>
  );
};

export default Product;
