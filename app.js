const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require('dotenv').config();

const url = process.env.MONGO_URL;
//"mongodb://127.0.0.1:27017/JournalDB";
mongoose.connect(url,{useNewUrlParser: true})
.then(()=>{console.log("Database is connected");})
.catch((err)=>{console.log(err);})

//schema 
const itemSchema = new mongoose.Schema({
  title:{
    type:String
  },
  content:{
    type:String
  }
});

//model
const Item = mongoose.model("item",itemSchema);




const homeStartingContent = 
"Welcome to our Daily Journal, a tranquil space where you're invited to weave the threads of your daily life. Here, amidst the digital pages, you can craft a tapestry of your thoughts, emotions, and observations. Like footprints left upon soft sand, your musings find their place within these serene virtual lines. Each entry is a gentle step on the path of introspection, a whisper of the heart's desires, a mirror to reflect upon your growth. Join us in this quiet corner of the internet, where simple words hold the power to illuminate the subtle beauty of our fleeting moments. Start your journey of self-expression here, where the ordinary meets the extraordinary, and the whispers of your soul find their voice.";
const aboutContent = "At our Daily Journal, we believe in the magic of capturing life's nuances through the written word. Our platform is born from the idea that every day holds a story worth telling, and every voice deserves a space to be heard. We are a community of introspective minds, seekers of solace, and enthusiasts of self-discovery. \n \n Our mission is to provide you with a digital haven, a place where your thoughts can unfold freely. Whether you're a seasoned writer or just beginning to explore the art of journaling, our platform is designed to embrace your journey. We are here to encourage your creativity, foster connections with fellow journalers, and inspire the preservation of fleeting moments.\n\n Join us in celebrating the extraordinary in the ordinary. As you pen down your reflections, dreams, and observations, you become a part of a collective endeavor to illuminate the myriad shades of human experience. Together, we delve into the pages of our lives, cherishing both the shadows and the light.\n\nWelcome to our About Us page, where we are more than a platform – we are a sanctuary for your thoughts, a companion in your daily musings, and a witness to the evolution of your inner landscape."
const contactContent = "We're here to listen, connect, and support. Whether you have questions, feedback, or stories to share, our virtual doors are wide open. Reach out to us at [email address] for any inquiries or simply to chat. You can also join our community on [Facebook/Instagram/Twitter] to stay updated and connect with fellow journaling enthusiasts. Your thoughts and experiences matter to us, and we're excited to hear from you."

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// const posts = [];

app.get('/',(req,res)=>{


  Item.find({})
  .then((item)=>{
      res.render("home",
      {
        posts:item,
        HomeContent:homeStartingContent
      });
  })
  .catch((err)=>{console.log(err);})

  

})


app.get('/about',(req,res)=>{
  res.render("about",
  {
    AboutContent:aboutContent
  });
})


app.get('/contact',(req,res)=>{
  res.render("contact",
  {
    ContactContent:contactContent
  });
})

app.get('/compose',(req,res)=>{
  res.render("compose")
})
app.post('/compose',(req,res)=>{
  const post =
  {
    title:req.body.postTitle,
    content:req.body.postText
  };
  Item.insertMany([post])
  .then(()=>{})
  .catch((err)=>{console.log(err)})

  res.redirect('/')
})

app.get('/posts/:val',function(req,res){

  let flag =1

  Item.find({title:req.params.val})
  .then((resp)=>{
    res.render("post",
        {
          title:resp[0].title,
          content:resp[0].content
        });
  }).catch((err)=>{console.log(err)})

})





let port =process.env.PORT;
if(port == null || port ==""){
  port = 3000
}

app.listen(port, function() {
  console.log("Server started on port: "+port);
});
