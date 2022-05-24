// represents the router class
const express = require("express");
const {
    getAllBooks,
    getBook,
    getBookDelete,
    saveBook,
    updateBook,
    deleteBook
} = require("../controller/bookController");
 
const router = express.Router();
 
router.get("/books", getAllBooks);
 
// http://localhost:3005/api/profile/id
router.get("/book/:id", getBook);
 
// http://localhost:3005/api/profile
/*
{
    "name": "{{$randomFullName}}",
    "email": "{{$randomEmail}}",
    "phone": "{{$randomPhoneNumber}}"
}
*/
router.post("/book", saveBook);
 
// http://localhost:3005/api/profile/id
/*
{
    "name": "{{$randomFullName}}",
    "email": "{{$randomEmail}}",
    "phone": "{{$randomPhoneNumber}}"
}
*/
router.put("/book/:id", updateBook);
 
// http://localhost:3005/api/profile/id
router.delete("/book/:id", deleteBook);
 
module.exports = {
  routes: router
};