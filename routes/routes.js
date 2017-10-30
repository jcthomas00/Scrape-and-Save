const db = require(`../models`),
  axios = require(`axios`),
  cheerio = require(`cheerio`);

module.exports = (app) => {
  app.get(`/`, (req, res) => {  
    axios.get("http://www.ign.com/").then((response) => {
      let $ = cheerio.load(response.data),
        articleHolder = {};
      $(".listElmnt  ").each((index, element)=>{
        articleHolder.article_body = $(element).children(".listElmnt-blogItem").children("p").text();
        articleHolder.article_title = $(element).children(".listElmnt-blogItem").children("a.listElmnt-storyHeadline").text();
        articleHolder.article_url = $(element).children(".listElmnt-blogItem").children("a").attr("href");
        articleHolder.article_image = $(element).children(".listElmnt-thumb").children(".thumb").children("img").attr("data-original") ?
          $(element).children(".listElmnt-thumb").children(".thumb").children("img").attr("data-original") :
          $(element).children(".listElmnt-thumb").children(".thumb").children("img").attr("src");
        if(articleHolder.article_image){
          db.ignArticles.findOne({article_url : articleHolder.article_url}).then( (err, data) =>{
            if (!data){
              db.ignArticles.create(articleHolder);//db.create
            }
          });
        }
      });//.each
    });//axios.get

    db.ignArticles.find({}).then((articles) => {
      res.render(`index`, {article:articles});
      articles.each((index, article) => {
        if(article.notes.length>0) {
          db.ignNotes.find({id : article.article_notes}).then((notes) => {
            article.notes = notes;
            console.log(article.notes);
          })
        }
      }).then(res.render(`index`, {article:articles}));
    });
  })//app.get

  app.post("/comment/:article_id", (req, res) => {
    db.ignNotes.create({note_title : req.body.note, note_body : req.body.note}, (error, note) => {
      console.log(note);
      db.ignArticles.findById(req.params.article_id, (err, article) => {
        if(err) {console.log(err);}
        //console.log()
        article.article_notes.push(note._id);
      });
    });

  });//app.post add comment
};

