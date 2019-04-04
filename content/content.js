$(document).ready(function(){
    var font_size, api;
    var store = chrome.storage.local;
    var parent = /[А-яЁё]/i;
    var url, key;

    function getSelectedText() {
        return window.getSelection().toString();
    }

    function getSelectionCoords() {
        var sel = document.selection, range;
        var x_1 = 0, y_1 = 0, x_2 = 0, y_2 = 0;
        sel = window.getSelection();
        if (sel.rangeCount) {
            range_1 = sel.getRangeAt(0).cloneRange();
            range_2 = sel.getRangeAt(0).cloneRange();
            if (range_1.getClientRects) {
                range_1.collapse(true);
                var rect_1 = range_1.getClientRects()[0];
                x_1 = rect_1.left;
                y_1 = rect_1.top;
                range_2.collapse(false);
                var rect_2 = range_2.getClientRects()[0];
                y_2 = rect_2.top;
                x_2 = rect_2.left;
            }
        }
        return { x_1: x_1, y_1: y_1, x_2: x_2, y_2, y_2 };
    }

    $(document).on('click', function(target){ 
        $('#translate_id').remove();
    });

    function setXPosition (x, window_width, elem_width) {
        var offsetX = window_width - x - elem_width;
        if (offsetX < 0) {
            var left = x + offsetX - 25; 
            if (left < 0) {
                left = 0;
            }
            return left
        }
        return left = x
    }

    function getTranslate(res, coords, font_size=12, font_color='black') {
        var popup = document.createElement('div');
        var elem_width, elem_height, window_width, window_height;           
        var top = 0, left = 0;
        var offsetY;

        popup.className = 'translate';
        popup.id = 'translate_id';
        popup.style.fontSize = font_size + 'px';
        popup.innerHTML = res;
        popup.style.color = font_color;
        $('body').append(popup);

        elem_width = popup.offsetWidth;
        elem_height = popup.offsetHeight;
        window_width = window.innerWidth;
        window_height = window.innerHeight;     
        offsetY = window_height - coords.y_2 - elem_height - 25;
        
        if (offsetY < 0) {
            top = coords.y_1 - elem_height - 10 + $(window).scrollTop(); 
            left = setXPosition(coords.x_1, window_width, elem_width);  
        } else {
            top = coords.y_2 + 25 + $(window).scrollTop();
            left = setXPosition(coords.x_2, window_width, elem_width);
        }
        
        popup.style.top = top.toString() + 'px';
        popup.style.left = left.toString() + 'px';
    }

    $(document).on('mouseup', function(){   
        var text = getSelectedText();
        if (text != '') {
            var coords = getSelectionCoords();
            var language = (parent.test(text))? 'ru-en':'en-ru';
            store.get(['translate_api', 'font_size'], function(item) {
                api = item.translate_api;
                font_size = item.font_size;
            });
            if (api === 'google') {
                url = "https://translate.yandex.net/api/v1.5/tr.json/translate";
                key = "trnsl.1.1.20170722T100901Z.fc98da73e8aab025.0740f9b69c81ff972e560c173277d8fd17a9423c";
            } else {
                url = "https://translate.yandex.net/api/v1.5/tr.json/translate";
                key = "trnsl.1.1.20170722T100901Z.fc98da73e8aab025.0740f9b69c81ff972e560c173277d8fd17a9423c";
            }
            $.getJSON(url, {'key': key, 'text': text, 'lang': language}, function(res) {
                var text = '';
                for (var i in res.text) {
                    text = text + res.text[i] + " ";
                }
                getTranslate(text, coords, font_size);
            }).fail((error) => {
                error = "Sorry, but you don't have the internet connection!";
                getTranslate(error, coords, font_size, 'red');
            });
        }
    });
});