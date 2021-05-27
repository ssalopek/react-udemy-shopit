import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import Loader from "./layout/Loader";

import { getProducts } from "../actions/productActions";

const Home = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { loading, products, productsCount, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts());
  }, [dispatch, alert, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
            </div>
          </section>
        </Fragment>
      )}
      <MetaData title={"HomePage"} />
    </Fragment>
  );
};

export default Home;
