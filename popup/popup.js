var api, font_size;
var parent = /[А-яЁё]/i;
var key, url, store;
store = chrome.storage.local;

store.get(['translate_api', 'font_size'], function(item) {
    api = item.translate_api;
    font_size = item.font_size;
});

$(document).ready(function(){

    function setApi(api = "yandex") {
        store.set({'translate_api': api}, function() {}); 
        $('#' + api).prop('checked', true);     
    }

    if (api) {
        setApi(api);
    } else {
        setApi();
    }

    if (font_size) {
        $('#font_size option[value="' + font_size + '"]').prop('selected', true)
    } else {
        store.set({'font_size': '12px'}, function() {}); 
    }

    $('#google').click(function(e) {
        setApi('google');
    });

    $('#yandex').click(function(e) {
        setApi();
    });

    $('#btn_clean').click(function(e) {
        $('#result').text("");
        $('#input').text("");
    });

    $('#font_size').change(function(e) {
        store.set({'font_size': $("#font_size option:selected").text()}); 
    });

    $('#btn_submit').click(function(e) {
        e.preventDefault();
        var input = $('#input').val();
        var language = (parent.test(input))? 'ru-en':'en-ru';

        if (api == 'yandex') {
            key = "trnsl.1.1.20170722T100901Z.fc98da73e8aab025.0740f9b69c81ff972e560c173277d8fd17a9423c";
            url = "https://translate.yandex.net/api/v1.5/tr.json/translate";        
        } else {
            key = ''
            url = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
        }

        $.getJSON(url, {'key': key, 'text': input, 'lang': language}, function(res){
            $('#result').text("");
            $('#result').css('color','black');
            for (var i in res.text) {
                $('#result').text($('#result').text() + res.text[i] + " ");
            }
        })
        .fail((error) => {
            error = "Sorry, but you don't have the internet connection!";
            $('#result').css('color','red');
            $('#result').text(error);
        });
    });
 });