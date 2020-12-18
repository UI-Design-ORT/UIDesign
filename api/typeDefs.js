const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        id: ID!
        token: String!
        password: String!
        firstname: String
        lastname: String
        email: String
        dni: String!
        country: String
        city: String
        profileImage: String 
        medalAchievement: String
        products: [Product]
    }

    input UploadProductInput{
        title: String!
        size: String!
        quantity: Int!
        productImage: String
    }

    input RemoveProductInput {
        productId: ID!
    }

    type Product {
        id: ID!
        userId: ID
        title: String
        size: String
        quantity: Int
        productImage: String
    }

    type ShoppingCart {
        userId: ID!
        products: [Product]
    }

    type Query {
        products: [Product]!
        product(id: ID!): Product
        user: User
        shoppingCart: ShoppingCart
    }

    input UserInput {
        password: String
        firstname: String
        lastname: String
        email: String
        country: String
        city: String
        ci: String
        profileImage: String
    }

    input SignInInput {
        email: String!
        password: String!
    }

    input CartInput {
        productId: ID!
    }

    type Mutation {
        uploadProduct(input: UploadProductInput!): Product!
        removeProduct(input: RemoveProductInput!): Product!
        addProductToCart(input: CartInput!): ShoppingCart!
        removeProductFromCart(input: CartInput!): ShoppingCart!
        updateUser(input: UserInput!): User!
        signIn(input: SignInInput!): User!
        signUp(input: UserInput!): User!
        processOrder: ShoppingCart!
    }
`;

module.exports.typeDefs = typeDefs;