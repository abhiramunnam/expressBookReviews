const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are not provided" });
    }
  
    let userExists = users.some((user) => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
  
    return res.status(201).json({ message: "User registered successfully" });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const booksList = JSON.stringify(books, null, 5);
    res.send(booksList);
  //Write your code here

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;          
    const book = books[isbn];             
  
    if (book) {
      res.status(200).json(book);          
    } else {
      res.status(404).json({ message: "error" });  
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;         
    const authorbooks = [];                
  

    for (let isbn in books) {
      if (books[isbn].author === author) {
        authorbooks.push({ isbn, ...books[isbn] }); 
      }
    }

    if (authorbooks.length > 0) {
      res.status(200).json(authorbooks);
    } else {
      res.status(404).json({ message: "Error : no books found" });
    }
  });
  
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;            
    const titleBooks = [];                 
    for (let isbn in books) {
      if (books[isbn].title === title) {
        titleBooks.push({ isbn, ...books[isbn] }); 
      }
    }
  
    if (titleBooks.length > 0) {
      res.status(200).json(titleBooks);    
    } else {
      res.status(404).json({ message: "Error : no books found" });
    }
  });
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;      
    const book = books[isbn];          
  
    if (book) {
      res.status(200).json(book.reviews);   
    } else {
      res.status(404).json({ message: "Error : Book not found" });
    }
  });
  
  

module.exports.general = public_users;
