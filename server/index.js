require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 3000;
const app = express();
// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  const plantsCollection = client.db("plantNetDB").collection("plants");
  const ordersCollection = client.db("plantNetDB").collection("orders");
  const usersCollection = client.db("plantNetDB").collection("users");

  try {
    // again repeat
    // Generate jwt token
    app.post("/jwt", async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });
    // Logout
    app.get("/logout", async (req, res) => {
      try {
        res
          .clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // ADD a plant db api
    app.post("/plants", async (req, res) => {
      const plant = req.body;
      console.log(plant);
      const result = await plantsCollection.insertOne(plant);
      res.send(result);
    });
    // get all plants data from db
    app.get("/plants", async (req, res) => {
      const cursor = await plantsCollection.find().toArray();
      res.send(cursor);
    });
    // get a single  plant data from db
    app.get("/plant/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = await plantsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(cursor);
    });

    // create payment intent api for order
    app.post("/create-payment-intent", async (req, res) => {
      const { quantity, plantId } = req.body;
      const plant = await plantsCollection.findOne({
        _id: new ObjectId(plantId),
      });
      if (!plant)
        return res.status(404).send({ message: "plant id Not found" });

      const totalPrice = quantity * plant?.price * 100;
      // stripe payment intent
      const { client_secret } = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({ clientSecret: client_secret });
    });

    // save or update a user info in db
    app.post("/user", async (req, res) => {
      const userData = req.body;
      userData.role = "customer";
      userData.created_at = new Date().toISOString();
      userData.last_loggedIn = new Date().toISOString();
      const query = {
        email: userData?.email,
      };
      const alreadyExists = await usersCollection.findOne(query);
      console.log(!!alreadyExists)

      if (!!alreadyExists) {
        console.log("updating user Data...")
        const result = await usersCollection.updateOne(
           query ,
          { $set: { last_loggedIn: new Date().toISOString() } }
        );
        return res.send(result);
      }
       console.log("creating user Data...")

      //  return console.log(userData)
      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    // save order data in orders collection id db

    app.post("/order", async (req, res) => {
      const orderData = req.body;
      const result = await ordersCollection.insertOne(orderData);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from plantNet Server..");
});

app.listen(port, () => {
  console.log(`plantNet is running on port ${port}`);
});
