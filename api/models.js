const mongoose = require("mongoose");


const MONGO_CONNECTION_STRING =
    "mongodb+srv://rodrigo:K2ImFqfXudhVOdHq@cluster0.nwl11.mongodb.net/miRopa?retryWrites=true&w=majority";
mongoose.connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Product = mongoose.model("Product", {
    title: String,
    size: String,
    quantity: String,
    productImage: String,
    userId: mongoose.Schema.Types.ObjectId
});

const User = mongoose.model("User", {
    username: String,
    password: String,
    name: String,
    lastname: String,
    email: String,
    dni: String,
    country: String,
    city: String,
    profileImage: String
});

const ShoppingCart = mongoose.model("ShoppingCart", {
    userId: mongoose.Schema.Types.ObjectId,
    productIds: [mongoose.Schema.Types.ObjectId]
});

exports.User = User;
exports.Product = Product;
exports.ShoppingCart = ShoppingCart;