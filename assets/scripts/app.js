var BLRConfig = {
    Artists: {
        "chimurenga-renaissance": {
            screenName: "chimurenga1980",
            facebookPage: "https://www.facebook.com/chimurengarenaissance",
            youtubePlaylistId: "PLEMV1gfIOfPy8I9MPtssn7mJvxE0UhWD3",
            enabled: true,
        },
        "iska-dhaaf": {
            screenName: "iska_dhaaf",
            facebookPage: "https://www.facebook.com/iska.dhaaf",
            youtubePlaylistId: "PLtTt69RCh-J22JMN1bovvZp6hDaY0wOOD",
            enabled: true,
        },
        "benjamin-verdoes": {
            screenName: "BenjaminVerdoes",
            facebookPage: "https://www.facebook.com/benjamin.verdoes",
            youtubePlaylistId: "PL9Ypvtj7lWHgsbhCnC_xFf4EsJApwY7h4",
            enabled: true
        },
        "you-are-plural": {
            screenName: "youareplural",
            facebookPage: "https://www.facebook.com/youareplural",
            youtubePlaylistId: "PL9Ypvtj7lWHgsbhCnC_xFf4EsJApwY7h4",
            enabled: true
        },
        toArray: function () {
            var artists = [];
            for (var artist in this) {
                if (typeof this[artist] == "object") {
                    artists.push(this[artist]);
                }
            }

            return artists;
        },
        getArtistByScreenName: function (screenName) {
            for (var artist in this) {
                if (this[artist].screenName == screenName) {
                    return artist;
                }
            }
        },
        getArtist:function(urlLocation) {
            if(urlLocation[urlLocation.length-1]=='/')
            {
         urlLocation=    urlLocation.slice(0,-1);   
            }
            var urlFragments = urlLocation.split("/");
            return BLRConfig.Artists[urlFragments[urlFragments.length - 1]];

        }
    },
    'blrVideos': "PLd9HIwJD5brDyO3_kNz_AOtBoQu4VSSkf",
    'blrNews': {
        facebookPage: "https://www.facebook.com/blrmusicpublishing",
        enabled: true
    },

    Twitter: {
        HomePage: {
            listName: "Brick-x-Brick",
            count: 4
        }
    }
}
var facebookHelper = function (artists) {
    this._artists = artists instanceof Array ? artists : [artists];
    this.articleTemplate = "<article class=\"section\">{content}</article>";
    this.dateTemplate = "<h2 class=\"section-header\">{formattedDate}</h2>";
    this.contentSectionTemplate = "{formattedDate}<div class=\"section-content\">{media}{message}</div>";
    this.linkTemplate = "<a href=\"{href}\" title=\"{linkText}\">{linkText}</a>";
    this.descriptionTemplate = "<p>{description}</p>";
    this.likeTemplate = "<iframe src=\"{likeUrl}\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; height:21px;\" allowTransparency=\"true\"></iframe>";
    this.imgTemplate = "<div class=\"fb-media\"><img src=\"{url}\" title=\"{description}\"/></div>";
    this.videoTemplate = "<div class=\"fb-media video-responsive\"><iframe width=\"420\" height=\"345\" src=\"http://www.youtube.com/embed/{videoId}\"></iframe></div>";

    this.$feedContainer = null;
    this.$lnkPrev = null;
    this.$lnkNext = null;

    this.fbFeedUrl = "https://graph.facebook.com/v2.2/"
    this.fbSourceUrl = "{artistId}/posts?access_token={accessToken}&format=json&limit={postCount}&method=get&pretty=0&suppress_http_code=1";
    this.likeUrl = "http://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2F{artistId}%2Fposts%2F{postId}&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=21"
    this.nextUrl = null;
    this.prevUrl = null;

    this.fbTokenUrl = "https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id={appId}&client_secret={secretKey}"
    this.AppId = "364098737081685";
    this.AppSecretKey = "3035b49c5a785a6ad3dc3678762cf5c4";
    this.accessToken = null;
    this.posts = {};

    this.Months = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    };
}

facebookHelper.prototype.turnUrlsIntoLinks = function (text) {
    if (text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp, "<a href='$1'>$1</a>");
    }
    else { return ""; }
}

facebookHelper.prototype.Initialize = function (options) {
    var h = this;
    this._options = options;
    this.$feedContainer = $(options.container);
    this.$lnkPrev = $(options.prevlink);
    this.$lnkNext = $(options.nextlink);
    this.articleTemplate = options.articleTemplate || this.articleTemplate;
    this.dateTemplate = options.dateTemplate || this.dateTemplate;
    this.contentSectionTemplate = options.contentSectionTemplate || this.contentSectionTemplate;

    if (options.enableNavigation) {
        this.$lnkPrev.on('click', function () {
            h.getPrevious();
        });

        this.$lnkNext.on('click', function () {
            h.getNext();
        });
    }

    this.getAccessToken();
}

facebookHelper.prototype.getAccessToken = function () {
    var h = this;

    $.ajax({
        url: this.fbTokenUrl.replace("{appId}", this.AppId)
                            .replace("{secretKey}", this.AppSecretKey)

    }).done(function (response) {
        h.accessToken = response.toString().split('=')[1];
    }).then(function () {
        for (var artist in h._artists) {
            var isLast = (artist == h._artists.length - 1);
            artist = h._artists[artist];
            if (artist.enabled) {
                var artistId = artist.facebookPage.replace("https://www.facebook.com/", "");
                h.posts[artistId] = [];
                h.fetchPosts(h.fbFeedUrl + h.fbSourceUrl.replace(/{accessToken}/g, h.accessToken)
                    .replace(/{artistId}/, artistId)
                    .replace(/{postCount}/, h._options.postCount), true, artistId);
            }
        }
    });
}

facebookHelper.prototype.fetchPosts = function (url, isFirst, artistId) {
    var h = this;
    h.$feedContainer.html("");
    $.ajax({
        url: url,
    }).done(function (response) {
        if (artistId) {
            h.posts[artistId] = response.data;
        }
        else {
            h.posts = response.data
        }

        if (h._options.enableNavigation) {
            h.prevUrl = response.paging.previous;
            h.nextUrl = response.paging.next;

            if (!h.prevUrl || isFirst) {
                h.$lnkPrev.hide();
            }
            else {
                h.$lnkPrev.show();
            }

            if (!h.nextUrl) {
                h.$lnkNext.hide();
            }
            else {
                h.$lnkNext.show();
            }
        }

        if (isFirst) {
            if (h.gotAllData()) {
                h.sortPosts();
            }
        }

        h.handleResponse(h.posts, isFirst);
    });
}

facebookHelper.prototype.gotAllData = function () {
    var hasAllData = true;
    for (var artist in this.posts) {
        hasAllData = hasAllData && (this.posts[artist] && this.posts[artist].length > 0);
    }

    return hasAllData;
}

facebookHelper.prototype.sortPosts = function () {
    var posts = [];
    for (var artist in this.posts) {
        if (this.posts[artist]) {
            posts = this.posts[artist].concat(posts);
        }
    }

    this.posts = posts.sort(function (a, b) {
        return new Date(Date.parse(b.created_time)) - new Date(Date.parse(a.created_time));
    });
}

facebookHelper.prototype.getPrevious = function () {
    this.fetchPosts(this.prevUrl, false);
}

facebookHelper.prototype.getNext = function () {
    this.fetchPosts(this.nextUrl, false);
}

facebookHelper.prototype.handleResponse = function (response, isFirst) {
    var posts = response instanceof Array ? response : response.data;

    if (this._options.postCount && this._options.postCount > 0) {
        posts = posts.slice(0, this._options.postCount);
    }

    for (var post in posts) {
        post = response[post];
        this.$feedContainer.append(this.decoratePost(post));
    }
}

facebookHelper.prototype.decoratePost = function (post) {
    if (post.type == "status") return;

    var htmlPost = this.articleTemplate;
    var postDate = new Date(Date.parse(post.created_time));
    var date = this.dateTemplate.replace(/{formattedDate}/g, this.Months[postDate.getMonth()] + " " + postDate.getDate() + ", " + postDate.getFullYear());
    var contentSection = this.contentSectionTemplate.replace(/{message}/g, this.turnUrlsIntoLinks(post.message))
    .replace(/{media}/g, this.getMedia(post))
    .replace(/{formattedDate}/g, date)
    .replace(/{like}/g, this.likeTemplate.replace(/{likeUrl}/g, this.likeUrl.replace(/{postId}/g, post.id.split("_")[1]).replace(/{artistId}/g, "")));

    return htmlPost.replace(/{content}/g, contentSection);
}

facebookHelper.prototype.getMedia = function (post) {
    var imageUrl = post.type == "link" ? (post.picture ? decodeURIComponent(post.picture.match(/(url=)(.+)$/)[2]) : null) : (this.fbFeedUrl + "{objectId}/picture?type=normal&redirect=true&access_token={token}"
        .replace("{objectId}", post.object_id)
        .replace("{token}", this.accessToken));
    if (post.type == "link" || post.type == "photo") {

        return imageUrl ? this.imgTemplate.replace(/{url}/g, imageUrl).replace(/{description}/g, post.description) : ""
        + (post.type == "link" ?
            this.linkTemplate.replace(/{linkText}/g, post.name ? post.name : post.story).replace(/{href}/g, post.link) + (post.description ? this.descriptionTemplate.replace(/{description}/g, post.description) : '')
            : ""
            );
    }
    else if (post.type == "video") {
        var videoId = post.link.split('/');
        videoId = videoId[videoId.length - 1];
        return this.videoTemplate.replace(/{videoId}/g, videoId)
        + this.linkTemplate.replace(/{linkText}/g, post.name).replace(/{href}/g, post.link)
        + this.descriptionTemplate.replace(/{description}/g, post.description);
    }
}
var TwitterHelper = function (config) {
    this._config = config;
    // this.baseUrl = "/api/twitter/";
    this.baseUrl = "http://dev.bricklanerecords.com/api/twitter/";
    this.brickLaneListName = config.HomePage.listName;
    this.tweetTemplate = "<li><div class=\"user\"><div class=\"item-title\"><span><a href=\"artists/{artistUrlName}\">{Name}</a></span></div><a href=\"https://twitter.com/{ScreenName}\" target=\"_blank\">@{ScreenName}</a><span class=\"timePosted\"> - Posted {TimeSinceNow}</span></div><p class=\"tweet\">{Text}</p></li>";
    this.previousMaxId = 0;
}

TwitterHelper.prototype.getBrickLaneTweets = function (pageNumber) {
    var h = this;
    pageNumber=pageNumber ? pageNumber:0;
    $.ajax({
        url: this.baseUrl + ("GetList?listName={listName}&$top={count}" + 
        ((pageNumber && pageNumber > 0) ? "&$skip={skip}".replace(/{skip}/g, (pageNumber * this._options.count)) :"" ))
            .replace(/{listName}/g, this.brickLaneListName)
            .replace(/{count}/g, this._options.count)
    }).done(function (response) {
        h.renderTweets(response);
        if (h._options.enableNavigation) {
            if (pageNumber > 0) {
                h.$lnkPrev.show();
                h.$lnkPrev.attr("data-nav", pageNumber - 1);
            }
            else {
                h.$lnkPrev.hide();
            }

            if (response.length == h._options.count) {
                h.$lnkNext.show();
                h.$lnkNext.attr("data-nav", pageNumber + 1);
            }
            else {
                h.$lnkNext.hide();
            }
        }
    });
}

TwitterHelper.prototype.renderTweets = function (response) {
    this.$container.html('');
    var container = $(this.$container);
    for (var tweet in response) {
        tweet = response[tweet];
        container.append(this.tweetTemplate.replace(/{ScreenName}/g, tweet.ScreenName)
            .replace(/{Name}/g, tweet.Name)
            .replace(/{artistUrlName}/g, BLRConfig.Artists.getArtistByScreenName(tweet.ScreenName))
            .replace(/{Text}/g, jEmoji.unifiedToHTML(tweet.Text))
            .replace(/{TimeSinceNow}/g, tweet.TimeSinceNow)
            );
    }
}

TwitterHelper.prototype.Initialize = function (options) {
    this._options = options;
    this.$container = $("#" + options.container);
    this.$lnkPrev = $(options.prevlink);
    this.$lnkNext = $(options.nextlink);

    var h = this;
    this.$lnkPrev.click(function () {
        h.getBrickLaneTweets(parseInt(h.$lnkPrev.attr("data-nav")));
    });

    this.$lnkNext.click(function () {
        h.getBrickLaneTweets(parseInt(h.$lnkNext.attr("data-nav")));
    });
}

TwitterHelper.prototype.getTimeline = function (artist) {
    this._artist = artist;
    if (this._artist.enabled) {
        this.getTimelinePage(artist.screenName, 1);
    }
}

TwitterHelper.prototype.getTimelinePage = function (screenName, pageNumber) {
    var h = this;
    $.ajax({
        url: this.baseUrl + "GetTimeline?screenName={screenName}"
            .replace(/{screenName}/g, screenName) +
            (this._options.enableNavigation ? ("&$top=" + this._options.count + "&$skip=" + ((pageNumber - 1) * this._options.count)) : "&$top=" + this._options.count)

    }).done(function (response) {
        h.renderTweets(response);

        if (h._options.enableNavigation) {
            if (pageNumber > 1) {
                h.$lnkPrev.show();
                h.$lnkPrev.attr("data-nav", pageNumber - 1);
            }
            else {
                h.$lnkPrev.hide();
            }

            if (response.length == h._options.count) {
                h.$lnkNext.show();
                h.$lnkNext.attr("data-nav", pageNumber + 1);
            }
            else {
                h.$lnkNext.hide();
            }
        }
    });
}
var apiKey = 'AIzaSyCE189cfev_E-nJQze9Cpu6lmGI2pkwb38',
  videoTemplate = null,
  $container = null,
  embedUrl = 'http://www.youtube.com/embed/{videoId}',
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

Date.prototype.timeSinceNow = function () {
    var seconds = Math.floor((new Date() - this) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function load(playlistId, container, count) {
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function () {
        videoTemplate = $('#tmplVideoItem').html();
        $container = $('#' + container);
        var playlistRequest = {
            playlistId: playlistId,
            part: 'snippet',
            maxResults: count || 50
        };

        var playlistQuery = gapi.client.youtube.playlistItems.list(playlistRequest);
        playlistQuery.execute(function (response) {
            $container.html('');
            var videoIds = [];
            for (var item in response.items) {
                videoIds.push(response.items[item].snippet.resourceId.videoId);
            }

            if (videoIds.length > 0) {
                var videoDetailsRequest = {
                    part: 'snippet,statistics',
                    id: videoIds.join(',')
                }

                var videosQuery = gapi.client.youtube.videos.list(videoDetailsRequest);
                videosQuery.execute(function (response) {
                    for (item in response.items) {
                        item = response.items[item];
                        $container.append(videoTemplate.replace(/{videoSrc}/g, embedUrl.replace('{videoId}', item.id))
                          .replace(/{title}/g, item.snippet.title)
                          .replace(/{channelTitle}/g, item.snippet.channelTitle)
                          .replace(/{publishedAt}/g, (new Date(item.snippet.publishedAt)).timeSinceNow())
                          .replace(/{viewCount}/g, item.statistics.viewCount));
                    }
                });
            }
            else {
                $container.append("no videos currently at this time");
            }
        });
    });
}

$(document).ready(function(){
  // nav toggle

  $('.main-nav-toggle').on('click', function() {
    $('body').toggleClass('main-nav-active');
  });
  // add body class if hero exists
  if ($('.hero').length) {
    $('body').addClass('has-hero');
  }

  // view more check

  $('.view-more .left').each(function() {
    // items to show initially, update alongside variable in scss/modules/_view-more.scss
    var viewMore = 1,
        count = $('> *', this).length;
    if (count > viewMore) {
      $(this).closest('.view-more').after('<div class="view-more-item"><p><a class="item-title view-more-link">View more</a></p></div>');
    }
  });

  // view more link

  $('.view-more-item').on('click', function() {
    var container = $(this).prev('.split-2');
    console.log(container);
    $(container).addClass('is-open');
    $(this).remove();
    
    // $('> *', container).show();
  });

  // item thumbs

  $('.item-thumbs a').on('click', function() {
    var image = $(this).html(),
        section = $(this).closest('.section'),
        target = $('.item-image-shop', section);
    $(target).html(image);
  });

  // drop-down toggle

  $('.drop-down-toggle').on('click', function() {
    $(this).closest('.drop-down').toggleClass('drop-down-active');
  });
  
  // drop-down close if clicked outside

  $(document).on('click', function(e) {
    var container = $('.drop-down');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.removeClass('drop-down-active');
    }
  });

  // redirects

  $('a[href="/releases"]').click(function(){
    console.log("click");
     window.location.href='http://store.bricklanerecords.com/releases';
     return false;
  })

  $('a[href="/shop"]').click(function(){
    console.log("click");
     window.location.href='http://store.bricklanerecords.com/';
     return false;
  })

});
