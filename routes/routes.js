function PublicRoutes(sam, storyId) {

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

                    // Create a new month if doesn't exist
                    if(month === undefined) {
                        months[monthStrings[date.getMonth()]] = {
                            month: monthStrings[date.getMonth()],
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

                res.render('index', { story: data, months: months });
            }
        );
    }

    return {
        index: index
    }
}

module.exports = PublicRoutes;