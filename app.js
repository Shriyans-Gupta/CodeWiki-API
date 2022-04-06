const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
  title : String ,
  content : String
});

const Article = mongoose.model('Article',articleSchema);


app.get("/",function(req,res){
  res.send("<h1>Hello There ...</h1>");
})

//route to acces the whole article
app.route("/articles")

.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err)
    {
      res.send(foundArticles);
    }else
    {
      console.log(err);
    }
  });
})

.post(function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);
  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      console.log("successfully inserted data..");
    }else{
      console.log(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      console.log("successfully deleted all the elements..");
    }else{
      console.log(err);
    }
  });
});

//route to acces a specific article

app.route("/articles/:articleTitle").get(
  function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("<h1>no articles matching the title found..</h1>");
      }
    });
})

.put(function(req,res){
  Article.findOneAndUpdate(
    {title : req.params.articleTitle},
    {title: req.body.title , content : req.body.content},
    {overwrite : true},
    function(err){
      if(!err)
      {
        res.send("The document has been successfully updated...");
      }
    });
})

.patch(function(req,res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set : req.body},
    function(err){
      if(!err){
        res.send("successfully updated the document..");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title : req.params.articleTitle},
    function(err){
      if(!err){
        res.send("succesfully deleted the document..");
      }else{
        res.send(err);
      }
    }
  );
});

app.listen(3000,function(req,res){
  console.log("server is listening in port number 3000...");
});
