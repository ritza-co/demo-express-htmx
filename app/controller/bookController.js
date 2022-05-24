// represents the jpa layer to fetch data from db
const Book = require("../model/book");
 
const getAllBooks = async (req, res) => {
  const books = await Book.findAndCountAll();
  res.send({
    context: books.rows,
    total: books.count
  });
};
 
const getBook = async (req, res) => {
  const id = req.params.id;
  await Book.findOne({ where: { id: id } }).then((item) => {
    if (item != null) {
      res.send(item);
    } else {
      res.sendStatus(404);
    }
  });
};
 
const saveBook = async (req, res) => {
  const book = {
    name: req.body.name,
    author: req.body.author
  };
  await Book.create(book).then((x) => {
      //console.log('id- ', x.null)
      // send id of recently created item
    res.send({'id': x.null});
  });
};
 
const updateBook = async (req, res) => {
  const id = req.params.id;
  await Book.findByPk(id).then((item) => {
    if (item != null) {
      item
        .update({
          name: req.body.name,
          author: req.body.author
        })
        .then(() => {
          res.sendStatus(204);
        });
    } else {
      res.sendStatus(404);
    }
  });
};
 
const deleteBook = async (req, res) => {
  const id = req.params.id;
  //await Book.findByPk(id).then((item) 
  await Book.findOne({ where: { id: id } }).then((item) => {
    if (item != null) {
        console.log("Item is ", item)
      item.destroy();
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
};
 
module.exports = {
  getAllBooks,
  getBook,
  saveBook,
  updateBook,
  deleteBook
};
