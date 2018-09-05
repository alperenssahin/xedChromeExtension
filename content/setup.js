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
            "<div class='Xed Mid right'></div>" +
            "<div class='Xed Top right'></div>" +
            "</div>";
        let bottom = "<div class='Xed XedBottom Xedcontainer'></div>";
        ctrl.append(top+bottom);
        let data = configuration.crawl;
        $('#type.Top.info').text(data.type);
        $('#reference.Top.info').text(data.data.category.title);
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
var configuration = {};

$(document).ready(function () {
        content.setOperatio(false);
    chrome.runtime.onMessage.addListener(
        function (request) {
            if (request.key == "start") {
                configuration.crawl = request.data;
                console.log(configuration.crawl);
                content.init();
                content.setOperatio(true);

                //todo::bu aşmada crawl tipine göre öneri algoritmalrı yer alıcak



            }
        });
});