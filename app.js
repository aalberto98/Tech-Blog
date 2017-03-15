var express          = require("express"),
    app              = express(),
    expressSanitizer = require("express-sanitizer"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    methodOverride   = require("method-override");

// app config
mongoose.connect("mongodb://localhost/blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// database model 
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//routes

app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({},function(err,blogs){
        if (err){
            console.log(err);
        } else {
            res.render("index", {blogs : blogs});
        }
    });
});

app.get("/blogs/new",function(req, res) {
    res.render("new");
})

app.post("/blogs", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, nuevoPost){
        if (err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundID){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog : foundID});
        }
    })
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundID){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog : foundID});
        }
    })
});

app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, resultado){
        if (err){
            res.redirect("/");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blogs");
        } else {
             res.redirect("/blogs");
        }
    });
})

// conection 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("si jala");
});
