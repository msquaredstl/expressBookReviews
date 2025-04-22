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
/*
public_users.get('/',function (req, res) {
 //Write your code here
 res.send(JSON.stringify(books,null,4));
});
*/

public_users.get('/', async function (req, res) {
    try {
        // Simulate an async data-fetch (e.g., pretend we're calling an external API)
        const getBooksAsync = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(books), 100); // simulate 100ms delay
            });
        };

        const allBooks = await getBooksAsync();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list." });
    }
});

// Get book details based on ISBN
/*
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
  */

public_users.get('/isbn/:isbn', async function (req, res) {
    const requestedIsbn = req.params.isbn;

    // Simulate an async function that "fetches" the book by ISBN
    const getBookByIsbn = (isbn) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            }, 100); // Simulate async delay
        });
    };

    try {
        const book = await getBookByIsbn(requestedIsbn);
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});


// Get book details based on author
/*
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
*/
public_users.get('/author/:author', async function (req, res) {
    const requestedAuthor = req.params.author.toLowerCase();

    // Simulate an async operation that filters books by author
    const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            const matchingBooks = [];

            bookKeys.forEach(isbn => {
                if (books[isbn].author.toLowerCase() === author) {
                    matchingBooks.push({ isbn, ...books[isbn] });
                }
            });

            setTimeout(() => {
                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject("No books found by that author.");
                }
            }, 100); // Simulated async delay
        });
    };

    try {
        const booksByAuthor = await getBooksByAuthor(requestedAuthor);
        return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});


// Get all books based on title
/*
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
*/
public_users.get('/title/:title', async function (req, res) {
    const requestedTitle = req.params.title.toLowerCase();

    // Simulate an async operation to search books by title
    const getBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            const matchingBooks = [];

            bookKeys.forEach(isbn => {
                if (books[isbn].title.toLowerCase() === title) {
                    matchingBooks.push({ isbn, ...books[isbn] });
                }
            });

            setTimeout(() => {
                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject("No books found with that title.");
                }
            }, 100); // Simulated async delay
        });
    };

    try {
        const booksByTitle = await getBooksByTitle(requestedTitle);
        return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } catch (err) {
        return res.status(404).json({ message: err });
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
