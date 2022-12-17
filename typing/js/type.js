var exKeyCode = [8, 9, 12, 13, 16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 144, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
var k = 50;
var typeLetter = function (event) {
    if (!vm.started) {
        vm.started = true;
        vm.begin = new Date().getTime();
    }
    var currSpan = $('.cursor.blink');
    var nextSpan = currSpan.next('span').first();
    if (nextSpan.length == 0) {
        nextSpan = currSpan.next("br")
        for(var i = 0; i < k; ++i)
            nextSpan = nextSpan.next("span")
        nextSpan = nextSpan.next("br").next("span").first();
    }
    var source = currSpan.html();
    var type = event.key;
    if (event.keyCode == 32) {
        type = '&nbsp;';
    }
    if (event.keyCode == 190 && event.shiftKey) {
        type = '&gt;';
    }
    if (event.keyCode == 188 && event.shiftKey) {
        type = '&lt;';
    }

    if (source == type) {
        currSpan.removeClass('cursor').removeClass('blink').removeClass('init').removeClass('error').removeClass('hidden').removeClass('incorrect').addClass('correct');
        nextSpan.addClass('cursor').addClass('blink');
        ++vm.types;
        ++vm.types_all;
        var useTime = new Date().getTime() - vm.begin;
        if (vm.types > 3)
            vm.speed = Math.ceil((vm.types * 60) / (useTime / 1000));
    } else {
        currSpan[0].innerHTML = type;
        currSpan.removeClass('cursor').removeClass('blink').removeClass('init').removeClass('error').removeClass('hidden').removeClass('correct').addClass('incorrect');
        nextSpan.addClass('cursor').addClass('blink');
        ++vm.types_all;
        if (exKeyCode.indexOf(event.keyCode) == -1) {
            ++vm.errorTimes;
        }
    }
    if (vm.types_all == vm.spanArray2.length) {
        $('#input-div>span').last().removeClass('cursor').removeClass('blink');
        $('#input-div>span').removeClass('error').removeClass('incorrect').removeClass('correct').addClass('init');
        $('#input-div>span').first().addClass('cursor').addClass('blink');
        vm.types = 0;
        vm.types_all = 0;
        vm.begin = new Date().getTime();
    }
};

var loadArticle = function (name) {
    this.article = '';
    axios({
        url: 'article/' + name
    }).then((res) => {
        this.started = false;
        this.speed = 0;
        this.types = 0;
        this.types_all = 0;
        this.errorTimes = 0;
        this.letterArray = res.data.article.split('');
        this.spanArray = $.map(this.letterArray, function (value) {
            if (value == ' ') {
                return '<span class="init">&nbsp;</span>';
            } else {
                return '<span class="init">' + value + '</span>';
            }
        });
        this.spanArray2 = $.map(this.letterArray, function (value) {
            if (value == ' ') {
                return '<span class="init hidden">&nbsp;</span>';
            } else {
                return '<span class="init hidden">' + value + '</span>';
            }
        });
        this.spanArray2[0] = this.spanArray2[0].replace('init', 'init hidden cursor blink');
        this.article = "";
        var i = 0;
        for(; i+1 < this.spanArray.length; i += k) {
            this.article += this.spanArray.slice(i, i+k).join('')+"<br/>"
            this.article += this.spanArray2.slice(i, i+k).join('')+"<br/>"
        }
        this.article += this.spanArray.slice(i, this.spanArray.length-1).join('')
        this.article += this.spanArray2.slice(i, this.spanArray2.length-1).join('')
    });
}

document.addEventListener('keydown', typeLetter);