const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const faker = require("./faker");
dotenv.config();

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});
let totalResponseTime = 0;
let requestCount = 0;

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    totalResponseTime += duration;
    requestCount += 1;
    console.log(`Request took ${duration} ms`);
  });

  next();
});

app.get("/", (req, res) => {
  db.query(
    "SELECT p.*, c.category_name,sb.subcategory_name FROM Product as p left join Category as c on c.id=p.category_id left join SubCategory as sb on p.subcategory_id=sb.id",
    (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
    }
  );
});

app.get("/average-response-time", (req, res) => {
  const averageResponseTime =
    requestCount > 0 ? totalResponseTime / requestCount : 0;
  res.json({ averageResponseTime });
});

app.get("/add-data", (req, res) => {
  const categories = faker.generateCategories(1000);
  const subcategories = faker.generateSubCategories(20, categories);
  const products = faker.generateProducts(10000, categories, subcategories);

  // Insert categories
  const categories_sql =
    "INSERT INTO Category (id, category_name, description, created_at) VALUES ?";
  const category_values = categories.map((cat) => [
    cat.id,
    cat.category_name,
    cat.description,
    cat.created_at,
  ]);

  db.query(categories_sql, [category_values], (err, result) => {
    if (err) {
      console.error("Error inserting categories:", err);
      return res.status(500).json({ error: "Failed to insert categories" });
    }

    // Insert subcategories
    const subcategories_sql =
      "INSERT INTO SubCategory (id, subcategory_name, category_id, description, created_at) VALUES ?";
    const subcategory_values = subcategories.map((sub) => [
      sub.id,
      sub.subcategory_name,
      sub.category_id,
      sub.description,
      sub.created_at,
    ]);

    db.query(subcategories_sql, [subcategory_values], (err, result) => {
      if (err) {
        console.error("Error inserting subcategories:", err);
        return res
          .status(500)
          .json({ error: "Failed to insert subcategories" });
      }

      // Insert products
      const products_sql =
        "INSERT INTO Product (id, product_name, category_id, subcategory_id, price, stock, description, created_at) VALUES ?";
      const product_values = products.map((prod) => [
        prod.id,
        prod.product_name,
        prod.category_id,
        prod.subcategory_id,
        prod.price,
        prod.stock,
        prod.description,
        prod.created_at,
      ]);

      db.query(products_sql, [product_values], (err, result) => {
        if (err) {
          console.error("Error inserting products:", err);
          return res.status(500).json({ error: "Failed to insert products" });
        }
        res.json({ message: "Data inserted successfully", result });
      });
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
