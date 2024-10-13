const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON bodies

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kerenhait7@',
  database: 'data'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// API Endpoint to get all toys
app.get('/data', (req, res) => {
  connection.query('SELECT * FROM stocks', (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(result);
  });
});

// API Endpoint to get a product by name
app.get('/product', (req, res) => {
  const { product_name } = req.query; 
  const query='SELECT * FROM stocks WHERE LOWER(product_name) = LOWER(?)'
  connection.query(query, [product_name], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }

    if (result.length === 0) {
      return res.status(404).send('Product not found');  // Handle case when no product is found
    }

    res.json(result); 
  });
});
// API Endpoint to get cart items for a user
app.get('/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  
  connection.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error fetching cart:', err);
      return res.status(500).send('Error fetching cart');
    }
    res.json(result);
  });
});

// API Endpoint to add item to cart
app.post('/cart', (req, res) => {
  const { userId, productId } = req.body;

  connection.query('INSERT INTO cart (user_id, product_id) VALUES (?, ?)', [userId, productId], (err, result) => {
    if (err) {
      console.error('Error adding item to cart:', err);
      return res.status(500).send('Error adding item to cart');
    }
    res.status(201).send('Item added to cart');
  });
});

// API Endpoint to remove item from cart
app.delete('/cart', (req, res) => {
  const { userId, productId } = req.body;

  connection.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId], (err, result) => {
    if (err) {
      console.error('Error removing item from cart:', err);
      return res.status(500).send('Error removing item from cart');
    }
    res.send('Item removed from cart');
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
