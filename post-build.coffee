#Feed = require('feed')
#filter = require 'lodash/filter'
#sortBy = require 'lodash/sortBy'
#moment = require 'moment'
#MarkdownIt = require 'markdown-it'
#fs = require 'fs'
#frontmatter = require 'front-matter'

#md = MarkdownIt({
  #html: true
  #linkify: true
  #typographer: true
#})

#module.exports = (pages, callback) ->
  #generateAtomFeed(pages)
  #callback()

#generateAtomFeed = (pages) ->
  #feed = new Feed({
    #title:       'Daemons',
    #description: 'A blog by Naqushab',
    #link:        'http://naqushab.github.io/blog/',
    #id:        'http://naqushab.github.io/blog/',
    #copyright:   'All rights reserved 2017, Naqushab Neyazee',
    #author: {
      #name:    'Naqushab Neyazee',
      #email:   'naqushab.neyazee24@gmail.com',
    #}
  #})

  ## Sort by date.
  #pages = sortBy(pages, (page) -> page.data?.date).reverse()

  #for page in filter(pages, (f) ->
    #f.data?.title? and not f.data?.draft
  #).slice(0,10)
    #feed.addItem({
      #title: page.data.title
      #id: "http://naqushab.github.io/blog/#{page.path}"
      #link: "http://naqushab.github.io/blog/#{page.path}"
      #date: moment(page.data.date).toDate()
      #content: md.render(
        #frontmatter(
          #fs.readFileSync(
            #"#{__dirname}/pages/#{page.requirePath}",
            #'utf-8'
          #)
        #).body
      #)
      #author: [{
        #name: "Naqushab Neyazee"
        #email: "naqushab.neyazee24@gmail.com"
        #link: "http://naqushab.github.io/blog/"
      #}]
    #})

  #feed.addContributor({
    #name: 'Naqushab Neyazee'
    #email: 'naqushab.neyazee24@gmail.com'
    #link: 'http://naqushab.github.io/blog/'
  #})

  #fs.writeFileSync "#{__dirname}/public/atom.xml", feed.render('atom-1.0')
