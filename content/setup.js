var content = {
    init: function () {
        this.setup();
        this.control();
    },
    setup: function () {
        let contentContainer = "<div class='Xed-- Xedcontainer Xedcontent'></div>";
        $('body').wrapInner(contentContainer);
        let controlContainer = "<div class='Xed Xedcontainer Xedcontrol'></div>";
        $('body').prepend(controlContainer);
        let designContainer = "<div class='Xed--- Xedcontainer Xeddesing'></div>"
        $('body').wrapInner(designContainer);

    },
    control: function () {
        let ctrl = $('.Xed.Xedcontrol');
        let ctnt = $('.Xed--');
        let top = "<div class='Xed XedTop Xedcontainer'>" +
            "<div class='Xed Top info left'>" +
            "<div class='Xed' style='display: flex;'><strong class='Xed'>Crawl Type:</strong><div class='Xed Top info' id='type'></div>" +
            "</div><div class='Xed' style='display: flex;'><strong class='Xed'>Reference:</strong><div class='Xed Top info' id='reference'></div>" +
            "</div></div>" +
            "<div class='Xed Top Mid'></div>" +
            "<div class='Xed Top right'></div>" +
            "</div>";
        let bottom = "<div class='Xed XedBottom Xedcontainer'></div>";
        ctrl.append(top + bottom);
        let data = configuration.crawl;
        $('#type.Top.info').text(data.type);
        if (data.data != null) {
            $('#reference.Top.info').text(data.data.category.title);
        } else {
            $('#reference.Top.info').text('--');
        }
        // ctnt.css('margin-top',$('.XedTop').css('height'));
        // let height = window.innerHeight;
        // ctrl.innerHeight(height);

    },
    setOperatio: function (status) {
        chrome.storage.local.set({Operation: status}, function () {
            console.log('Operation value is set to ' + status);
        });
    },
}
var configuration = {title: null, type: null};
var obj ={}
$(document).ready(function () {
    content.setOperatio(false);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.key == "start") {
                configuration.crawl = request.data;
                content.init();
                content.setOperatio(true);
                if (configuration.crawl.type == 'mapping') {
                    marker.href();
                }
               obj = {jsEvents:[],url: window.location.href, rules: {}, type: configuration.crawl.type, title: configuration.crawl.title};
                //todo::bu aşmada crawl tipine göre öneri algoritmalrı yer alıcak
            }
            if (request.key == 'getRules') {
                sendResponse({data: obj});
            }
            if (request.key == 'reload') {
                window.location.reload();
            }
        });
});