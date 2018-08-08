var globalValues = {
    originType: null,
    lastdom: null,

};


var logging = {
    info: function (s) {
        console.log('Xed[info] : ' + s);
    },
};

let url = window.location.href;
var obj = {url: url, rules: {}};

$(document).ready(function () {
    //todo:tablo uzerinden hangi hedef seçilebilir yada href seçeneği ilk a tagının herefini çeker
    /**
     * Crawler Controller setup
     * @type {string}
     */
    logging.info('Starting Extention...');
    let str = '<div class="Xed XedControl XedTop" id="container">' +
        '<div id="inside" class="Xed XedInside" style="display: flex; justify-content: space-between;">' +
        '<div id="left" class="Xed XedInside"><strong>Crawl:</strong><input type="checkbox" id="ctrl" class="Xed Xedcrawlcontroller"></div>' +
        '<div id="right" class="Xed XedInside">' +
        '<div id="origin" class="Xed">' +
        '<label class="Xed">Unique</label><input type="radio" id="unique" name="XedOrigin" value="unique" class="Xed XedOrigin">' +
        '<label class="Xed">Recurrent</label><input type="radio" id="recurrent" name="XedOrigin" value="recurrent" class="Xed XedOrigin">' +
        '</div>' +
        '<span id="toggle" class="Xed">&#8681;</span></div>' +
        '</div>' +
        '<div class="Xed XedDetail XedControl" id="panel" style="display: none;"></div>' +
        '</div>';
    $('body').prepend(str);
    $('#unique.XedOrigin').prop('checked', 'true');
    window.globalValues.originType = 'unique';
    logging.info('OriginType set to unique');

    let ins = '<div class="Xed" id="currentUrl"><strong>Url :</strong>' + window.location.href + '</div>' +
        '<div class="Xed Xedpanel" id="container" style="display: flex;">' +
        '<div class="Xed Xedpanel" id="left">' +
        '<div id="reference" class="Xed get-attr-reff-xed "></div>' +
        '<div id="confirmation" class="Xed"></div>' +
        '</div>' +
        '<div class="Xed Xedpanel" id="right" style="margin-left: 15px;"></div>' +
        '</div>' +
        '';
    $('#panel.XedDetail').append(ins);

    $('#toggle.Xed').click(function () {
        // console.log('click');
        let dom = $('#panel.Xed');
        if (!dom.hasClass('open')) {
            dom.addClass('open');

            dom.slideDown(500);
        } else {
            dom.slideUp(500);
            dom.removeClass('open');
        }
    });

    /**
     * oluşan kurallar bütününü kullanılabilir mi kontrol eder
     * hata bulamazsa nesneyi pop-up üzerine aktarır
     */

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

            if (request.greeting == "rules") {
                let conn = true;
                let co = 0;
                for (let x in  obj.rules) {
                    co++;
                    if (checkRule(x)) {

                    }
                    else {
                        conn = false;
                        console.log(x + ': Eksik Kural');
                        console.log(obj.rules[x]);
                    }
                }
                if (conn && co >= 1) {
                    sendResponse({data: obj, error: 0});

                } else {
                    sendResponse({data: obj, error: 1});

                }
            }

        });

});

