const Product = require('../models/products')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures');

//Create new product that will be passed to url like /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

//Get all products from /api/v1/products?keyword=sandisk
exports.getProducts = catchAsyncErrors(async(req, res, next) => {

    const resultsPerPage = 4;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultsPerPage)

   // const products = await Product.find(); //find() -> return all products in database

   let products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
})

//Get single product details from /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        product
    })
})

//Update product and pass to url like /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    })
})

//Delete product from /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }
    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product is deleted"
    })
})

//Create new review -> /api/v1/review
exports.createReview = catchAsyncErrors(async(req, res, next) => {

    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )
    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){ //if same user is rating
                review.comment = comment; //replace new comment
                review.rating = rating; //replace new rating
            }
        })
    } else {
        product.reviews.push(review); //push new review
        product.numOfReviews = product.reviews.length; //update number of reviews
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false});

    res.status(200).json({
        success: true
    })

})