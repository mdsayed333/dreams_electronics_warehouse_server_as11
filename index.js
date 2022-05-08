const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xe5ym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productsCollection = client
      .db("dreams-electronics")
      .collection("products");

    const monthlyReport = client
      .db("dreams-electronics")
      .collection("monthly-report");

    // find all products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // Find Product Details
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // Add a new Product
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // Delete product in manage item route
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const newProduct = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          quantity: newProduct.quantity,
        },
      };
      const result = await productsCollection.updateOne(
        query,
        updateProduct,
        options
      );
      res.send(result);
    });

    app.get("/myProduct", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = productsCollection.find(query);
      const orders = await cursor.toArray();
      console.log("Orders: ", orders);
      res.send(orders);
    });

    // get data for monthly
    app.get("/report", async (req, res) => {
      const query = {};
      const cursor = monthlyReport.find(query);
      const reports = await cursor.toArray();
      res.send(reports);
    });
  } finally {
    // client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Dreams server is running...");
});

app.listen(port, () => {
  console.log("Dreams Server Port: ", port);
});
