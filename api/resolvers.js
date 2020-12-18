/* const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "secrettoken"; */
const Bcrypt = require("bcrypt");
const { User, Product, ShoppingCart } = require("./models");
const { generateToken } = require("./auth");

const userResolver = async (root, args, ctx, info) => {
    const userId = ctx.user._id;
    const user = await User.findById(userId);

    const products = await Product.find();

    var userProducts = [];
    products.forEach(function (product) {
        if (String(product.userId) === String(userId)) {
            userProducts.push(product);
        }
    })

    user.products = userProducts;
    if (user.medalAchievement !== undefined) {
        if (userProducts.length > 0 && userProducts.length < 5) {
            user.medalAchievement = 'level1';
        } else if (userProducts.length < 10) {
            user.medalAchievement = 'level2';
        } else if (userProducts.length >= 10) {
            user.medalAchievement = 'level3';
        }
    }

    await user.save();
    return user;
}

const productResolver = async (root, { id }, ctx, info) => {
    const product = await Product.findById(id);
    return product;
}

const productsResolver = async (root, args, ctx, info) => {
    const products = await Product.find();
    return products;
}

const shoppingCartResolver = async (root, args, ctx, info) => {
    const userId = ctx.user._id;
    const shoppingCart = await ShoppingCart.findOne({ userId });
    return shoppingCart;
}

const signInResolver = async (
    root,
    { input: { email, password } },
    ctx,
    info
) => {
    const user = await User.findOne({ email });
    if (user && Bcrypt.compareSync(password, user.password || "")) {
        return user;
    }
};

const signUpResolver = async (
    root,
    { input: { password, firstname, lastname, email, ci, country, city } }, //falta agregar imagen, si no sabemos la pelamos
    ctx,
    info
) => {
    const currentUser = await User.findOne({ email });
    if (currentUser) {
        throw new Error("UsernameAlreadyInUse");
    }
    const user = new User({
        password: Bcrypt.hashSync(password, 10),
        firstname,
        lastname,
        email,
        dni: ci,
        country,
        city
    });
    await user.save();
    return user.toJSON();
};

const uploadProductResolver = async (
    root,
    { input: { title, size, quantity, productImage } },
    ctx,
    info
) => {
    if (title.length === 0) {
        throw new Error("Debe ingresar un título.");
    }
    const newProduct = new Product({
        title,
        size,
        quantity,
        productImage
    });
    newProduct.userId = ctx.user._id;
    await newProduct.save();
    return newProduct.toJSON();
};

const removeProductResolver = async (
    root,
    { input: { productId } },
    ctx,
    info
) => {
    const userId = ctx.user._id;
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    var included = user.products.includes(product);

    if (!included) {
        throw new Error("No puedes eliminar una prenda que no sea tuya.");
    }

    await product.remove();
    return product.toJSON();
};

const updateUserResolver = async (
    root,
    { input: { username, password, firstname, lastname, email, country, city, profileImage } },
    ctx,
    info
) => {
    const userId = ctx.user._id;
    const user = await User.findById(userId);

    user.username = username;
    user.password = Bcrypt.hashSync(password, 10);
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.country = country;
    user.city = city;
    user.profileImage = profileImage;

    await user.save();
    return user.toJSON();
};

const addProductToCartResolver = async (
    root,
    {
        input: {
            productId
        } },
    ctx,
    info
) => {
    const userId = ctx.user._id;

    let shoppingCart = await ShoppingCart.findOne({ userId });
    if (!shoppingCart) {
        shoppingCart = new ShoppingCart();
        shoppingCart.userId = userId;
        shoppingCart.productIds = [];
    }

    const product = await Product.findById(productId);

    let productAlreadyExists = false;
    shoppingCart.productIds.forEach(async (productId) => {
        if (product._id === productId) {
            productAlreadyExists = true;
        }
    });
    if (!productAlreadyExists) {
        await shoppingCart.productIds.push(product._id);
        await shoppingCart.save();
    }

    return shoppingCart.toJSON();
};


const removeProductFromCartResolver = async (
    root,
    {
        input: {
            productId,
        } },
    ctx,
    info
) => {
    const userId = ctx.user._id;

    let shoppingCart = await ShoppingCart.findOne({ userId });

    const index = shoppingCart.productIds.indexOf(productId);
    if (index > -1) {
        await shoppingCart.productIds.splice(index, 1);
    }

    await shoppingCart.save();
    return shoppingCart.toJSON();
};

const processOrderResolver = async (root, args, ctx, info) => {
    const userId = ctx.user._id;
    const shoppingCart = await ShoppingCart.findOne({ userId });
    shoppingCart.productIds.forEach(async (productIdOrdered) => {
        const product = await Product.findById(productIdOrdered);
        if (product) {
            if (product.quantity === 0) {
                throw new Error('No se ha podido procesar la orden. El producto ' + product.title + ' ya no está disponible.');
            }
            if (product.quantity === 1) {
                await product.remove();
            }
            else {
                product.quantity--;
                await product.save();
            }
        }
    });
    shoppingCart.productIds = [];
    await shoppingCart.save();
    return shoppingCart.toJSON();
};

export const resolvers = {
    Query: {
        products: productsResolver,
        product: productResolver,
        user: userResolver,
        shoppingCart: shoppingCartResolver
    },
    Mutation: {
        signIn: signInResolver,
        signUp: signUpResolver,
        addProductToCart: addProductToCartResolver,
        removeProductFromCart: removeProductFromCartResolver,
        uploadProduct: uploadProductResolver,
        removeProduct: removeProductResolver,
        updateUser: updateUserResolver,
        processOrder: processOrderResolver
    },
    User: {
        id: user => user._id,
        token: (user, args, ctx, info) => {
            const token = generateToken(user);

            // ctx.cookie("token", token, {
            //   expires: new Date(Date.now() + 9999999999),
            //   secure: true,
            //   sameSite: "None"
            // });
            return token;
        }

        /*
           favorites: async user => {
               // Return favorite pokemons
               // const favorites = await PokemonFavorites.find({ userId: user.id });
               // const pokemons = await fetchPokemons();
               // return pokemons.filter(x => favorites.includes(x.id));
               return [];
           } */
    },
    Product: {
        id: product => product._id
    },
    ShoppingCart: {
        products: async shoppingCart => {
            let products = [];
            shoppingCart.productIds.forEach(async (productId) => {
                const product = Product.findById(productId);
                products.push(product);
            });
            return products;
        }
    }
};
