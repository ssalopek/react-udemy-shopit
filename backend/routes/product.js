const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

//GET ALL AND SINGLE
router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);

//ADMIN GET ALL
router.route("/admin/products").get(getAdminProducts);

//POST
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

//PUT
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

//DELETE
router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

//Create review
router.route("/review").put(isAuthenticatedUser, createReview);

//Get product review
router.route("/admin/reviews").get(isAuthenticatedUser, getProductReviews);

//Delete product review
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
