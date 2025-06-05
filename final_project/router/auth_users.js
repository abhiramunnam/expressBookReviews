const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return users.some(user => user.username === username);//returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    return users.some(user => user.username === username && user.password === password);//returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  

    if (authenticatedUser(username, password)) {

      let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '2h' });

      req.session.authorization = { accessToken, username };
  
      return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
      return res.status(401).json({ message: "Invalid login. Check username and password." });
    }
  });

// Add a book review
// Add a book review or modify it
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review content is missing" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/modified successfully",
      reviews: books[isbn].reviews
    });
  });
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const book = books[isbn];
  
    if (book.reviews && book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: `Review by '${username}' deleted successfully.` });
    } else {
      return res.status(404).json({ message: "No review by this user to delete." });
    }
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
