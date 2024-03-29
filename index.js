var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "Shoney's ",
    description:
      "The best bar from Rick and Morty",
    dishes: [
      {
        name: "Beer",
        price: 27,
      },
      {
        name: "Jerry folded in 10",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Chez Paul",
    description:
      "Fancy sounding French food",
    dishes: [
      {
        name: "Baguette",
        price: 14,
      },
      {
        name: "Croissant",
        price: 18,
      },
      {
        name: "Escargot",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Chipotle",
    description:
      "My favorite rice and beans with medium salsa",
    dishes: [
      {
        name: "Beans",
        price: 12,
      },
      {
        name: "Rice",
        price: 11,
      },
      {
        name: "Salsa Verde",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => restaurants[arg.id],
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    restaurants.push({ name: input.name, email: input.email, age: input.age });
    return input;
  },
  deleterestaurant: ({ id }) => {
    const ok = Boolean(restaurants[id]);
    let delc = restaurants[id];
    restaurants = restaurants.filter((item) => item.id !== id);
    console.log(JSON.stringify(delc));
    return { ok };
  },
  editrestaurant: ({ id, ...restaurant }) => {
    if (!restaurants[id]) {
      throw new Error("restaurant doesn't exist");
    }
    restaurants[id] = {
      ...restaurants[id],
      ...restaurant,
    };
    return restaurants[id];
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

export default root;