const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if both fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    // Add the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const requestedIsbn = req.params.isbn;
  
    const bookKeys = Object.keys(books);
    let foundBook = null;
  
    bookKeys.forEach(isbn => {
      if (isbn === requestedIsbn) {
        foundBook = { isbn, ...books[isbn] };
      }
    });
  
    if (foundBook) {
      res.send(JSON.stringify(foundBook, null, 4));
    } else {
      res.status(404).send({ message: "Book not found with the given ISBN." });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    const matchingBooks = [];
  
    // Get all keys from the books object
    const bookKeys = Object.keys(books);
  
    // Iterate through each book and check for matching author
    bookKeys.forEach(isbn => {
      const book = books[isbn];
      if (book.author.toLowerCase() === requestedAuthor.toLowerCase()) {
        matchingBooks.push({ isbn, ...book });
      }
    });
  
    if (matchingBooks.length > 0) {
      res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
      res.status(404).send({ message: "No books found by that author." });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const requestedTitle = req.params.title.toLowerCase();
    const matchingBooks = [];
  
    const bookKeys = Object.keys(books);
  
    bookKeys.forEach(isbn => {
      const book = books[isbn];
      if (book.title.toLowerCase() === requestedTitle) {
        matchingBooks.push({ isbn, ...book });
      }
    });
  
    if (matchingBooks.length > 0) {
      res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
      res.status(404).send({ message: "No books found with that title." });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const requestedIsbn = req.params.isbn;
    const bookKeys = Object.keys(books);
    let foundReviews = null;
  
    bookKeys.forEach(isbn => {
      if (isbn === requestedIsbn && books[isbn].reviews) {
        foundReviews = books[isbn].reviews;
      }
    });
  
    if (foundReviews) {
      res.send(JSON.stringify(foundReviews, null, 4));
    } else {
      res.status(404).send({ message: "No reviews found for the given ISBN." });
    }
  });
  

module.exports.general = public_users;
