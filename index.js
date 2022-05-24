const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require("./app/routes/bookRoutes");
// automatically creating table on startup and inserting data
const sequelize = require("./app/model/dbconfig");
const Book = require("./app/model/book");
const axios = require('axios');

const app = express();
app.use(express.json());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
// application routes
app.use("/api", bookRoutes.routes);

app.get('/', (req, res) => {
  axios
  .get("http://127.0.0.1:3005/api/books")
  .then(function (response) {
    console.log('zvaita', response.data.context);
    return res.render('index', {books: response.data.context});
  }).catch((error)=>{
    console.log('error', error);
  });
});

app.get('/get-book-row/:id', (req, res) => {
  const id = req.params.id;
  axios
  .get(`http://127.0.0.1:3005/api/book/${id}`)
  .then(function (response) {
    return res.send(`<tr>
    <td>${response.data.name}</td>
    <td>${response.data.author}</td>
    <td>
        <button class="btn btn-primary"
            hx-get="/get-edit-form/${id}">
            Edit Book
        </button>
    </td>
    <td>
        <button hx-delete="/delete/${id}"
            class="btn btn-primary">
            Delete
        </button>
    </td>
</tr>`)
  }).catch((error)=>{
    console.log('error', error);
  });
});

app.get('/get-edit-form/:id', (req, res) => {
  const id = req.params.id;
  axios
  .get(`http://127.0.0.1:3005/api/book/${id}`)
  .then(function (response) {
    //console.log('zvaita', response.data);
    return res.send(`<tr hx-trigger='cancel' class='editing' hx-get="/get-book-row/${id}">
    <td><input name="title" value="${response.data.name}"/></td>
    <td><input name="author" value="${response.data.author}"/></td>
    <td>
      <button class="btn btn-primary" hx-get="/get-book-row/${id}">
        Cancel
      </button>
      <button class="btn btn-primary" hx-put="/update/${id}" hx-include="closest tr">
        Save
      </button>
    </td>
  </tr>`);
  }).catch((error)=>{
    console.log('error', error);
  });
});

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  // update book
  axios.put(`http://127.0.0.1:3005/api/book/${id}`, {
    name: req.body.title,
    author: req.body.author
  })
  .then(function () {
    return res.send(`<tr>
    <td>${req.body.title}</td>
    <td>${req.body.author}</td>
    <td>
        <button class="btn btn-primary"
            hx-get="/get-edit-form/${id}">
            Edit Book
        </button>
    </td>
    <td>
        <button hx-delete="/delete/${id}"
            class="btn btn-primary">
            Delete
        </button>
    </td>
</tr>`)
})
.catch(function (error) {
});
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  axios
  .delete(`http://127.0.0.1:3005/api/book/${id}`)
  .then(function (response) {
    return res.send("");
  }).catch((error)=>{
    console.log('error', error);
  });
});

app.post('/submit', (req, res) => {
  console.log('body - ', req.body);
  axios.post('http://127.0.0.1:3005/api/book', {
    name: req.body.title,
    author: req.body.author
  })
  .then(function (response) {
    console.log('response id - ', response.data);
    return res.send(`<tr>
    <td>${req.body.title}</td>
    <td>${req.body.author}</td>
    <td>
        <button class="btn btn-primary"
            hx-get="/get-edit-form/${response.data.id}">
            Edit Book
        </button>
    </td>
    <td>
        <button hx-delete="/delete/${response.data.id}}"
            class="btn btn-primary">
            Delete
        </button>
    </td>
</tr>`);
  })
  .catch(function (error) {
    //console.log(error);
  });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Service endpoint = http://localhost:${PORT}`);
});