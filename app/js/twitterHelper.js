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