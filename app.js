const port = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//Connect mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Mongoose connected to MongoDB.");
  }
});

//Schema
const articleSchema = {
  title: String,
  content: String
};

//Model
const Article = mongoose.model("Article", articleSchema);

//route for /articles
app.route('/articles')
  .get((req, res) => {
    //fetch all articles
    Article.find({}, (err, articles) => {
      if (err) {
        //Error
        res.send({
          success: false,
          error: err
        });
      } else {
        //Found
        res.send({
          success: true,
          articles: articles
        });
      }
    });
  })
  .post((req, res) => {
    //create new article
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save((err, result) => {
      if (err) {
        //There was an error.
        res.send({
          success: false,
          error: err
        });
      } else {
        //New article created.
        res.send({
          success: true,
          result: result
        });
      }
    });
  })
  .delete((req, res) => {
    //This deletes all articles.
    Article.deleteMany({}, (err) => {
      if (err, result) {
        //There was an error.
        res.send({
          success: false,
          error: err
        });
      } else {
        //Good job, you deleted everything.  I hope you are proud.
        res.send({
          success: true,
          result: result
        });
      }
    });
  });

// route for /articles/:id
app.route("/articles/:articleTitle")
  .get((req, res) => {
    //get article
    Article.findOne({
      title: req.params.articleTitle
    }, (err, article) => {
      if (err) {
        //There was an error
        res.send({
          success: false,
          error: err
        });
      } else {
        if (article) {
          //Found it!
          res.send({
            success: true,
            article: article
          });
        } else {
          //Not found.
          res.send({
            success: false,
            error: "Article not found."
          });
        }
      }
    });
  })
  .put((req, res) => {
    //Update whole article

    Article.replaceOne({
      title: req.params.articleTitle
    }, req.body, (err, result) => {
      if (err) {
        //There was an error
        console.log(req);
        res.send({
          result: "error",
          error: err
        });
      } else {
        //Update successful
        res.send({
          success: true,
          result: result
        });
      }
    })
  })
  .patch((req, res) => {
    //Update only part of an article
    Article.updateOne({
      title: req.params.articleTitle
    }, req.body, (err, result) => {
      if (err) {
        //There was an error
        console.log(req);
        res.send({
          success: false,
          error: err
        });
      } else {
        //Update successful
        res.send({
          success: true,
          result: result
        });
      }
    })
  })
  .delete((req, res) => {
    //Delete a specific article
    Article.deleteOne({
      title: req.params.articleTitle
    }, (err, result) => {
      if (err) {
        //There was an error.
        res.send({
          success: false,
          error: err
        });
      } else {
        //Delete successful
        res.send({
          success: true,
          result: result
        });
      }
    });
  });

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server started on ${port}`);
  }
});
