﻿var BLRConfig = {
    Artists: {
        "chimurenga-renaissance": {
            screenName: "chimurenga1980",
            facebookPage: "https://www.facebook.com/chimurengarenaissance",
            twitterListName:"chimurenga-members",
            youtubePlaylistId: "PLd9HIwJD5brArNj-1gVlCanBag29uXXia",
            enabled: true,
        },
        "iska-dhaaf": {
            screenName: "iska_dhaaf",
            twitterListName:"iska-dhaaf-members",
            facebookPage: "https://www.facebook.com/iskadhaafmusic",
            youtubePlaylistId: "PLd9HIwJD5brBJoy8JLxaM8QD06sN4IHPa",
            enabled: true,
        },
        "benjamin-verdoes": {
            screenName: "BenjaminVerdoes",
            facebookPage: "https://www.facebook.com/BenjaminVerdoesMusic",
            youtubePlaylistId: "PLd9HIwJD5brClfVr0mk6BlW3HtDauAnC5",
            enabled: true
        },
        "you-are-plural": {
            screenName: "youareplural",
            twitterListName:"you-are-plural-members",
            facebookPage: "https://www.facebook.com/youareplural",
            youtubePlaylistId: "PLd9HIwJD5brAOAZPpAu9Rxnd5T9MAk717",
            enabled: true
        },
        "ephriam-nagler": {
            screenName: "ephriamnagler",
            facebookPage: "https://www.facebook.com/youareplural",
            youtubePlaylistId: "PLd9HIwJD5brCViunRPyPTRRaRYvcpyKDD",
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