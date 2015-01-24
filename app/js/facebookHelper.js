var facebookHelper = function (artists) {
    this._artists = artists instanceof Array ? artists : [artists];
    this.articleTempalte = "<article class=\"section\">{content}</section";
    this.dateTemplate = "<h2 class=\"section-header\">{formattedDate}</h2>";
    this.contentSectionTemplate = "<div class=\"section-content\">{message}{media}{like}</div>";
    this.linkTemplate = "<a href=\"{href}\" title=\"{linkText}\">{linkText}</a>";
    this.descriptionTemplate = "<p>{description}</p>";
    this.likeTemplate = "<iframe src=\"{likeUrl}\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; height:21px;\" allowTransparency=\"true\"></iframe>";
    this.imgTemplate = "<img src=\"{url}\" title=\"{description}\"/>";
    this.videoTemplate = "<iframe width=\"420\" height=\"345\" src=\"http://www.youtube.com/embed/{videoId}\"></iframe>";

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

    var htmlPost = this.articleTempalte;
    var postDate = new Date(Date.parse(post.created_time));
    var date = this.dateTemplate.replace(/{formattedDate}/g, this.Months[postDate.getMonth()] + " " + postDate.getDate() + ", " + postDate.getFullYear());
    var contentSection = this.contentSectionTemplate.replace(/{message}/g, this.turnUrlsIntoLinks(post.message))
    .replace(/{media}/g, this.getMedia(post))
    .replace(/{like}/g, this.likeTemplate.replace(/{likeUrl}/g, this.likeUrl.replace(/{postId}/g, post.id.split("_")[1]).replace(/{artistId}/g, "")));

    return htmlPost.replace(/{content}/g, date + contentSection);
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