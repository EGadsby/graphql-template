const { graphqlHandler, graphqlError } = require('graphql-serverless')
const { makeExecutableSchema } = require('graphql-tools')
const { app } = require('webfunc')

const itemMocks = [
  { id: 1, name: 'Knock Bits', quantity: 88, price: 12.67, supplier_id: 1 },
  { id: 2, name: 'Widgets', quantity: 10, price: 35.50, supplier_id: 3 },
  { id: 3, name: 'Widgets', quantity: 11, price: 45.50, supplier_id: 4 }]

const suppliers = [
      { id: 1, name: 'yeah', address: '123 5th ave' },
      { id: 2, name: 'alright', address: '456 6th ave'}
]

const schema = `
  type Item {
    id: ID!
    name: String!
    quantity: Int
    price: Float
    supplier_id: Int
  }

  type Supplier {
   id: ID!
   name: String!
   address: String!
}
 
  type Query {
      itemsById(id: Int): Item
      allitems:[Item]
      itemsbyname(name: String): [Item]
      itemsByPrice(price: Float): Item
      itemsbysupplier: Int
      supplierByid(id: Int): Supplier
  }

  type Mutation {
      additem(name: String, quantity: Int, price: Float, supplier_id: Int): Item
}
  
`
const itemResolver = {
  Query: {
      itemsById(root, { id }, context) {
                const results = id ? itemMocks.filter(p => p.id == id) : itemMocks
                      if (results.length > 0)
                        return results.pop()
                      else
                        throw graphqlError(404, `Item with id ${id} does not exist.`)
      },  
     allitems(root, {}, context) {
return itemMocks
   },  
   itemsbyname(root, { name }, context) {
   const names = name ? itemMocks.filter(p => p.name == name) : itemMocks
         if (names.length > 0)
                return names
         else
                throw graphqlError(404, `Item with name ${name} does not exist.`)
},
 supplierByid(root, { id }, context) {
                 const supplier = id ? suppliers.filter(p => p.id == id) : suppliers
                       if (supplier.length > 0)
                         return supplier.pop()
                       else
                         throw graphqlError(404, `supplier with id ${id} does not exist.`)
      }
},
 Mutation: {
  additem(root, { name, quantity, price, supplierID }, context) {
   const item = {
   id: itemMocks.length + 1,
         name: name,
         quantity: quantity,
         price: price,
         supplier_id: supplierID
};
    itemMocks.push(item);
     return item;
        }
 }
}

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: itemResolver
})



const graphqlOptions = {
  schema: executableSchema,
  graphiql: {
    endpoint: '/graphiql'
  },
  context: {
        someVar: 'This variable is passed in the "context" object in each resolver.'
  }
}

app.all(['/','/graphiql'], graphqlHandler(graphqlOptions))

eval(app.listen('app', 4000))
                                                                                               
