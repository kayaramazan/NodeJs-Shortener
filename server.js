const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortener', {
useNewUrlParser:true,useUnifiedTopology:true
})

app.set('view engine','ejs')
app.use(express.urlencoded({ extended:false }))
app.get('/', async (req,res) =>
{
    const urls = await ShortUrl.find() 
    res.render('index',{ urls: urls })
})
app.post('/shortUrl', async (req,res) =>
{
   await ShortUrl.create({
        full:req.body.fullUrl
    })
    res.redirect('/')
})
app.get('/:shortid', async (req,res)=>{
    const url =  ShortUrl.findOne({short:req.params.shortid});
    if (url == null) return res.statusCode(404)
    url.clicks++
    url.save()
    res.redirect(url.full)
})
app.listen(process.env.PORT || 3000)