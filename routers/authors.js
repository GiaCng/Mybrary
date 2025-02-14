const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const author = require('../models/author')
const Book = require('../models/book')

// All Authors Route
router.get(('/',''), async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name =new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }
})

//New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author()})
})

// Create Author Route
router.post('/', async (req,res) => {
    const author = new Author({
        name: req.body.name
    })
    await author.save().
    then((newAuthor) => {
        // res.redirect('authors/')
        res.render('authors/${newAuthor.id}')
    }).catch((err) =>{
        res.render('authors/new',{
            author:author,
            errorMessage: 'Error Creating Author...'
        })
    })
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) =>{
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author})
    } catch  {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) =>{
   let author
   try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
   } catch (error) {
        if (author == null) {
            res.redirect('/')
        }
        res.render('authors/new',{
            author:author,
            errorMessage: 'Error Updating Author...'
        })
   }
})


router.delete("/:id", async (req, res) => {
    let author;
    try {
      author = await Author.findById(req.params.id);
      console.log(author);
      await author.deleteOne();
      console.log("author deleted");
      res.redirect("/authors");
    } catch {
      if (author == null) {
        console.log("author not found");
        res.redirect("/");
      } else {
        console.log("can't delete author");
        res.redirect(`/authors/${author.id}`);
      }
    }
  })

module.exports = router