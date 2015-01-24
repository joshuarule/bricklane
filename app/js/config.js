var BLRConfig = {
    Artists: {
        "chimurenga-renaissance": {
            screenName: "chimurenga1980",
            facebookPage: "https://www.facebook.com/chimurengarenaissance",
            youtubePlaylistId: "PLEMV1gfIOfPy8I9MPtssn7mJvxE0UhWD3",
            enabled: true,
        },
        "iska-dhaaf": {
            screenName: "@iska_dhaaf",
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