function PublicRoutes(sam, storyId) {

    var twitter = require('twitter-text'),
        urlexpand = require('urlexpand');

    function sortDate(arr) {
        arr.sort(function(a, b) {
            var keyA = a.asset.postedDate,
                keyB = b.asset.postedDate;

            if(keyA < keyB) return 1;
            if(keyA > keyB) return -1;
            return 0;
        });
    }

    function sortMonth(arr) {
        arr.sort(function(a, b) {
            var keyA = a.monthVal,
                keyB = b.monthVal;

            if(keyA < keyB) return 1;
            if(keyA > keyB) return -1;
            return 0;
        });
    }

    function index(req, res){
        sam.stories.fetch(
            storyId,
            function(err, data) {
                var monthStrings = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ];
                var month,
                    months = {},
                    asset,
                    assets = data.socialAssets,
                    date,
                    day;

                for(var i = 0; i < assets.length; i++) {
                    asset = assets[i];
                    date = new Date(asset.postedDate);
                    month = months[monthStrings[date.getMonth()]];
                    day = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate();

                    // Instagram date fix hack
                    if(asset.socialType === 'instagram') {
                        asset.postedDate *= 1000;
                    }

                    if(asset.socialType === 'twitter') {
                        asset.longText = twitter.autoLink(twitter.htmlEscape(asset.longText));
                    }

                    // Create a new month if doesn't exist
                    if(month === undefined) {
                        months[monthStrings[date.getMonth()]] = {
                            month: monthStrings[date.getMonth()],
                            monthVal: date.getTime(),
                            year: date.getFullYear(),
                            assets: []
                        };
                        month = months[monthStrings[date.getMonth()]];
                    }

                    if(asset.tags.length > 0) {
                        if(asset.tags[0] === 'Important') {
                            var title = asset.longText.split('.')[0];
                            var body = asset.longText.slice(asset.longText.indexOf('.')+2,asset.longText.length);
                            //body = body.slice(0,body.indexOf('http://'));
                            //var href = asset.longText.slice(asset.longText.indexOf('http://'),asset.longText.length);

                            month.assets.push({
                                important: true,
                                title: title,
                                body: body,
                                //href: href,
                                day: day,
                                asset: asset
                            });
                        }
                        if(asset.tags[0] === 'Highlight') {
                            month.assets.push({
                                highlight: true,
                                day: day,
                                asset: asset
                            });
                        }
                    }
                    else {
                        month.assets.push({
                            normal: true,
                            day: day,
                            asset: asset
                        });
                    }
                }

                var sortedMonths = [];
                for(var x in months) {
                    sortedMonths.push(months[x]);
                }
                sortMonth(sortedMonths);

                for(var i = 0; i < sortedMonths.length; i++) {
                    sortDate(sortedMonths[i].assets);
                }
                res.render('index', { story: data, months: sortedMonths });
            }
        );
    }

    return {
        index: index
    }
}

module.exports = PublicRoutes;