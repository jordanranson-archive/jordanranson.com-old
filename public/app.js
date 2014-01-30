var sam = new SAMJS();

$(function(){

    var $body = $('body');

    $body.on('click', '#fetchStories', fetchStories);
    $body.on('click', '.fetchStory', fetchStory);
    $body.on('click', '.getStory', getStory);
    $body.on('click', '.getAssets', getAssets);
    $body.on('click', '.getAsset', getAsset);

});

function err(code, msg) {
    alert(code + ': ' + msg);
}

function fetchStories() {
    $('ul').html('');

    sam.stories.fetch({
        success: function(results) {
            console.log(results);

            $('#stories').html('');
            for(var i = 0; i < results.length; i++) {
                $('#stories').append( $('<li>'+results[i].name+' <button class="fetchStory" data-id="'+results[i].id+'">Fetch</button></li>') );
            }
        },
        error: err
    });
}

function fetchStory() {
    var $this = $(this);
    var id = $this.attr('data-id');

    $('#story').html('');
    $('#assets').html('');
    $('#asset').html('');

    sam.stories.fetch(id, {
        success: function(results) {
            console.log(results);

            for(var key in results) {
                if(key !== 'socialAssets') {
                    $('#story').append( $('<li>'+key+': '+results[key]+'</li>'))
                } else {
                    $('#story').append('<li>'+key+': <button class="getAssets" data-id="'+id+'">Get assets</button></li>')
                }
            }

            if($this.parent().find('.getStory').length === 0) {
                $this
                    .parent()
                    .append(' <button class="getStory" data-id="'+results.id+'">Get</button>')
            }
        },
        error: err
    });
}

function getStory() {
    var id = $(this).attr('data-id');
    var results = sam.stories.get(id);

    console.log(results);

    $('#story').html('');
    $('#assets').html('');
    $('#asset').html('');

    for(var key in results) {
        if(key !== 'socialAssets') {
            $('#story').append( $('<li>'+key+': '+results[key]+'</li>'))
        } else {
            $('#story').append('<li>'+key+': <button class="getAssets" data-id="'+id+'">Get assets</button></li>')
        }
    }
}

function getAssets() {
    var id = $(this).attr('data-id');
    var results = sam.stories.assets.get(id);

    console.log(results);

    $('#assets').html('');
    $('#asset').html('');

    for(var i = 0; i < results.length; i++) {
        $('#assets').append(
            '<li><button class="getAsset" data-assetid="'+
                results[i]+
                '" data-storyid="'+id+
                '">Get asset '+
                results[i]+
                '</button></li>'
        );
    }
}

function getAsset() {
    var storyId = $(this).attr('data-storyid');
    var assetId = $(this).attr('data-assetid');
    var results = sam.stories.assets.get(storyId, assetId);

    console.log(results);

    $('#asset').html('');

    for(var key in results) {
        $('#asset').append( $('<li>'+key+': '+results[key]+'</li>') );
    }
}