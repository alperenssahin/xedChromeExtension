$(document).ready(function () {
    /**
     * Crawler Controller setup
     * @type {string}
     */
    let str = '<div class="Xed XedControl XedTop" id="container">' +
        '<div id="inside" class="Xed XedInside" style="display: flex; justify-content: space-between;">' +
        '<div id="left" class="Xed XedInside"><strong>Crawl:</strong><input type="checkbox" id="ctrl" class="Xed Xedcrawlcontroller"></div>' +
        '<div id="right" class="Xed XedInside"><span id="toggle" class="Xed">&#8681;</span></div>' +
        '</div>' +
        '<div class="Xed XedDetail XedControl" id="panel" style="display: none;"></div>' +
        '</div>';
    $('body').prepend(str);


    let ins = '<div class="Xed" id="currentUrl"><strong>Url :</strong>' + window.location.href + '</div>' +
        '<div class="Xed Xedpanel" id="container" style="display: flex;">' +
        '<div class="Xed Xedpanel" id="left"><button class="Xed XedSend" id="Category">get category</button></div>' +
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
     * communication block
     */
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log('XedRules Generator: Started...');
            if (request.req.pin == "category") {
                let str = '<select>';
                for (let x of request.req.data) {
                    str += '<option value="' + x._id.$oid + '">' + x.category.title + '</option>'
                }
                str += '</select>';
                $('#left.Xedpanel').prepend(str);
            }

            // sendResponse({farewell: "goodbye"});
        });


});


