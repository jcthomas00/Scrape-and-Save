const express = require(`express`),
  expressHandlebars = require(`express-handlebars`),
  mongoose = require(`mongoose`),
  bodyParser = require(`body-parser`),
  cheerio = require(`cheerio`),
  request = require(`request`),
  db = require(`./models`),
  port = process.env.PORT || 3000,
  app = express();

  app.use(bodyParser.urlencoded({extended:false}));
  app.use(express.static(`public`));

  mongoose.Promise = Promise;
  mongoose.connect(`mongodb://localhost/ignArticles`, {useMongoClient:true});

  app.engine("handlebars", expressHandlebars({ defaultLayout : "main" }));
  app.set("view engine", "handlebars");

  require (`./routes/routes.js`)(app);

  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  })