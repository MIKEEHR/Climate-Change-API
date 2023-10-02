const port = process.env.PORT || 8000
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const { response } = require('express')

const app = express()
// call express and stores in the app constant
// comes with all powers of express app.get, app.blah

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk/'
    },
    {
        name: 'hindustantimes',
        address: 'https://www.hindustantimes.com/ht-insight/climate-change',
        base: 'https://www.hindustantimes.com'
    },
    {
        name: 'wild',
        address: "https://wild.org/climate/?gclid=CjwKCAjw8KmLBhB8EiwAQbqNoN2t2I1776t5J1ChA_e0xA0kS6gqmfl026y4LoTHQRrcZDgKVj8-dhoCIhYQAvD_BwE",
        base: ''
    },
    {
        name: 'bbc',
        address: "https://www.bbc.com/news/science-environment-56837908",
        base: 'https://www.bbc.com'
    }
]
const articles = []

newspapers.forEach(newspapers => {
    axios.get(newspapers.address).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("climate")').each(function () {
            let title = $(this).text()
            let url = $(this).attr('href')
            articles.push({
                title,
                url: newspapers.base + url,
                source: newspapers.name
            })
        })
    }).catch((err) => { console.log(err) })
})

app.get('/', (req, res) => { res.json('Welome to my climate change api') })

app.get('/news', (req, res) => { res.json(articles) })

app.get('/news/:newspaperID', (req, res) => {

    const newspaperID = req.params.newspaperID


    const newspaperaddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address
    const newspaperbase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base

    axios.get(newspaperaddress).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const SpecficArticle = []


        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            SpecficArticle.push({
                title,
                url: newspaperbase + url,
                source: newspaperID

            })
        })
        res.json(SpecficArticle)

    }).catch((err) => { console.log(err) })

})
app.listen(port, () => console.log(`server running on port ${port}`))