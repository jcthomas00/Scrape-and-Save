const db = require(`../models`),
  axios = require(`axios`),
  cheerio = require(`cheerio`);

module.exports = (app) => {

  app.get(`/`, (req, res) => { 
    //scrape ign with axios 
    axios.get("http://www.ign.com/").then((response) => {
      //load the response into cheerio for jquery-like usage
      let $ = cheerio.load(response.data),
        articleHolder = {}; //reset temp holder at every iteration
      //go through each article and pull required details
      $(".listElmnt  ").each((index, element)=>{
        articleHolder.article_body = $(element).children(".listElmnt-blogItem").children("p").text();
        articleHolder.article_title = $(element).children(".listElmnt-blogItem").children("a.listElmnt-storyHeadline").text();
        articleHolder.article_url = $(element).children(".listElmnt-blogItem").children("a").attr("href");
        articleHolder.article_image = $(element).children(".listElmnt-thumb").children(".thumb").children("img").attr("data-original") ?
          $(element).children(".listElmnt-thumb").children(".thumb").children("img").attr("data-original") :
          $(element).children(".listElmnt-thumb").children(".thumb").children("img").attr("src");
        //if this article is real, put it in our database
        if(articleHolder.article_image){
              try{
                db.ignArticles.create(articleHolder,(e,d)=>{});//db.create
              }catch(e){}
        }
       })//.each
    });//axios.get

    //get all the articles and render them on screen
    db.ignArticles.find().populate(`article_notes`).then((articles) => {
      res.render(`index`, {article : articles})
    })  

  })//app.get

  app.post("/comment/:article_id", (req, res) => {
    //create the note
    db.ignNotes.create({note_title : req.body.note, note_body : req.body.note}, (error, note) => {
      //find the related article and push this comment
      db.ignArticles.findByIdAndUpdate(req.params.article_id, 
        {$push : {article_notes:note}},
        {safe: true, upsert: true},
        function(err, model) {
            console.log(err);
        }
      );
    });
    //refresh page
    res.redirect('/');
  });//app.post add comment
};

