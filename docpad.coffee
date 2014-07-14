# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {

    # Ignore Emacs autosave files
    ignoreCustomPatterns: /^#.*#$/

    # Yay port
    port: 3000

    # =================================
    # Template Data
    # These are variables that will be accessible via our templates
    # To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

    templateData:

        # Specify some site properties
        site:
            # The production url of our website
            url: "http://maxinevsg.com"

            # Author
            author: "Maxine van Stratum Grohol"

            # Here are some old site urls that you would like to redirect from
            # oldUrls: [
            #   'www.website.com',
            #   'website.herokuapp.com'
            # ]

            # The default title of our website (and a shortened version)
            title: "Maxine van Stratum Grohol"
            shortTitle: "MvSG"

            # The website description (for SEO)
            description: """
                When your website appears in search results in say Google, the text here will be shown underneath your website's title.
                """

            # The website keywords (for SEO) separated by commas
            keywords: """
                place, your, website, keywoards, here, keep, them, related, to, the, content, of, your, website
                """

            # The website's styles
            styles: [
                '/css/ionicons.min.css'
                '/css/modal.css'
                '/css/main.css'
                # '/css/vendor/main.css'
            ]

            # The website's scripts (angular in layout)
            scripts: [
                # '/js/vendor/jquery/jquery.min.js'
                # '/js/vendor/handlebars/handlebars.min.js'
                # '/js/vendor/ember/ember.min.js'
                # 'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.13/angular.min.js'
                'http://code.jquery.com/jquery-1.11.0.min.js'
                # '/js/vendor/galleria/src/galleria.js'
                '/js/vendor/css-modal/modal.js'
                '/js/vendor/css-modal/plugins/modal-resize.js'
                '/js/vendor/css-modal/plugins/gallery.js'
                '/js/plugins.js'
                # '/js/main.js'
            ]


        # =================================
        # Helper Functions

        # Get the prepared site/document title
        # Often we would like to specify particular formatting to our page's title
        # we can apply that formatting here
        getPreparedTitle: ->
            # if we have a document title, then we should use that and suffix the site's title onto it
            if @document.title
                "#{@document.title} | #{@site.shortTitle}"
            # if our document does not have it's own title, then we should just use the site's title
            else
                @site.title

        # Get the prepared site/document description
        getPreparedDescription: ->
            # if we have a document description, then we should use that, otherwise use the site's description
            @document.description or @site.description

        # Get the prepared site/document keywords
        getPreparedKeywords: ->
            # Merge the document keywords with the site keywords
            @site.keywords.concat(@document.keywords or []).join(', ')


        # Get a list of images for the current doc + their captions
        getImages: (album) ->
            album = album || @document
            search =
                type: album.type
                album: album.album
            imgs = @getCollection('images').findAll(search, [{filename: 1}]) || []
            captions = album.captions || []
            ret = []
            imgs.each (img) ->
                caption = captions[img.attributes.filename] || ""
                # ret[img.attributes.outFilename] = caption
                imgobj =
                    filename: img.attributes.outFilename
                    caption: caption
                ret.push(imgobj)

            return ret

        # Returns caption for current document
        getCaption: ->
            @document.caption || ""

        # Specific retriever for highlights
        getHighlights: ->
            doc = @getFile({relativePath: 'highlights/index.html.jade'})
            @getImages({type: 'highlights', album: '', captions: doc.attributes.captions})


    # =================================
    # DocPad Events

    # Here we can define handlers for events that DocPad fires
    # You can find a full listing of events on the DocPad Wiki
    events:

        # Server Extend
        # Used to add our own custom routes to the server before the docpad routes are added
        serverExtend: (opts) ->
            # Extract the server from the options
            {server} = opts
            docpad = @docpad

            # As we are now running in an event,
            # ensure we are using the latest copy of the docpad configuraiton
            # and fetch our urls from it
            latestConfig = docpad.getConfig()
            oldUrls = latestConfig.templateData.site.oldUrls or []
            newUrl = latestConfig.templateData.site.url

            # Redirect any requests accessing one of our sites oldUrls to the new site url
            server.use (req,res,next) ->
                if req.headers.host in oldUrls
                    res.redirect(newUrl+req.url, 301)
                else
                    next()


    # =================================
    # Collections
    
    collections:

        # All photography albums (index files)
        photography: (database) ->
            # Find all album index.html files
            search = 
                relativeDirPath: $startsWith: 'photography'
                type: $ne: "main"
                outExtension: 'html'
                ignored: $ne: true

            # Sort by title
            byTitle = [{title:1}]

            database.findAllLive(search, byTitle).on "add", (doc) ->

                # Extract the album path
                album = doc.attributes.relativeDirPath.split('/')[1]

                # Add that collection to the metadata
                doc.setMetaDefaults({ album, type: "photography", layout: 'album' })
                # console.log "\n", doc.meta.attributes
        

        # And graphic design (index files)
        graphicdesign: (database) ->
            # Find all album index.html files
            search = 
                relativeDirPath: $startsWith: 'graphicdesign'
                type: $ne: "main"
                outExtension: 'html'

            # Sort by title
            byTitle = [{title:1}]

            database.findAllLive(search, byTitle).on "add", (doc) ->

                # Extract the album path
                album = doc.attributes.relativeDirPath.split('/')[1]

                # Add that collection to the metadata
                doc.setMetaDefaults({ album, type: "graphicdesign", layout: 'album' })
                # console.log "\n", doc.meta.attributes


        # All graphic design and photography images
        images: ->
            search = 
                contentType: $startsWith: 'image'
                relativeDirPath: $startsWith: ['photography', 'graphicdesign', 'highlights']

            @getCollection('documents').findAllLive(search).on "add", (img) ->
                params = img.attributes.relativeDirPath.split('/')
                album = params[1] || ""  # folder name of album
                type = params[0]   # photography | graphicdesign | highlights

                img.setMetaDefaults({album, type})


        # Ignore stylus partials
        stylus: ->
            search = 
                relativeDirPath: 'css'
                basename: $startsWith: '_'

            @getCollection('documents').findAllLive(search).on "add", (f) ->
                f.setMetaDefaults({ignored: true})


        # Clean URLs
        cleanurls: ->
            @getCollection('html').findAllLive(cleanurl: $ne: false)


        #BLAAHHHH
        # bla: ->
        #   name = 'highlights'
        #   @getCollection('html').findAllLive(basename: $startsWith: name).on "add", (f) ->
        #       console.log "\n", f.meta.attributes

    # =================================
    # Plugin config
    plugins:
        stylus:
            stylusLibraries:
                nib: false
                'axis-css': true
                'jeet': true

        cleanurls:
            collectionName: 'cleanurls'

        livereload:
            enabled: false

}

# Export our DocPad Configuration
module.exports = docpadConfig
