'use strict';
//define port http://127.0.0.1:8003
// $('#get-cat').click(function () {
$(document).ready(function () {
    XedCrawler.init();
    //todo:mapping iptal olunca hata oluşuyor
    $('#get-ref.general').click(function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {key: "getRules"}, function (response) {

                    let myJSONdata = JSON.stringify(response.data);
                    $.post(config.server+'/rulePort/', {data: myJSONdata}, function (data) {
                        console.log(data);
                        Log.setOperatio(false);
                        $('#start-operation.general').removeClass('blocked');
                        $('#get-ref.general').addClass('blocked');
                        $('#status.general.current-operation').text('Start new operation');
                         chrome.tabs.sendMessage(tabs[0].id, {key: "reload"}, function () {

                         });
                    });

            });
        });


    });
});
var reference = {
    getReferences: function (dom) {
        $.post(config.server+'/xedEx/', {setup: 1}, function (data) {
            console.log(data);
            var obj = JSON.parse(data);

            let str = '<select class="Xed XedSelect" id="Cat-ID">';
            str += '<option value="-"> - </option>';
            for (let x of obj) {
                str += '<option value="' + x._id.$oid + '">' + x.category.title + '</option>';
            }
            str += '</select>';
            dom.html(str);
            events.referenceSelected(); //listen to change on list box
        });

    },
    data: function () {
        $.post('http://127.0.0.1:8003/getReference/', {ID: $('#Cat-ID.XedSelect').val()}, function (data) {
            var obj = JSON.parse(data);
            var crawl = {
                type: "Reference",
                title: $('#operation-title.general').val(),
                data: obj,

            }
            console.log(obj);
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {key: "start", data: crawl}, function (response) {
                });
            });
            // console.log(obj);
        });
    },

}
var config = {
    login: false,
    server: 'http://127.0.0.1:8003',
    setup: function () {
        Log.checkLogIn();
    },
    user: null,
    operation: false,
}
var XedCrawler = {
    init: function () {
        config.setup();
    },
    setLogInStatus: function (status) {
        chrome.storage.local.set({logIn: status}, function () {
            console.log('LogIn value is set to ' + status);
        });
    },
    logOut: function () {
    },
    //configuration general...


    authentication: {
        //configuration about authentication...
        config: function () {
            console.log('in authentication config.login: ' + config.login);
            if (config.login) {
                page.deactivate($('#container-up.authentication'));
                page.activate($('#container.general'));
                $('#container-up.header').removeClass('inactive');

            }
            else {
                $('#send.authentication').click(function () {
                    //todo:connection request, control response
                    let response = XedCrawler.authentication.request();

                });
            }

        },
        request: function () {
            let url = config.server + '/login/';
            console.log('preparing to request-->' + url);
            let data = {
                "email": $('#email.authentication').val(),
                "passwd": $('#passwd.authentication').val()
            }
            let con = false;
            $.post(url, data, function (data) {
                let res = JSON.parse(data);
                console.log('authentication response--->' + res);
                if (res == null) {
                    console.log('request problem');
                    XedCrawler.authentication.styleTrig(false);
                } else {
                    console.log('gogo');
                    config.user = res;
                    XedCrawler.authentication.styleTrig(true);
                }
                return con;

            });
        },
        styleTrig: function (response) {
            if (response) {
                console.log('loginIn')
                page.deactivate($('#container-up.authentication'));
                page.activate($('#container.general'));
                $('#container-up.header').removeClass('inactive');
                XedCrawler.setLogInStatus(true);

            } else {
                XedCrawler.setLogInStatus(false);
                //todo:affiche error message

            }
        }
    }
};
var Log = {
    checkLogIn: function () {
        let log = null;
        chrome.storage.local.get(['logIn'], function (result) {
            console.log('isLogin:' + result.logIn);
            config.login = result.logIn;
            XedCrawler.authentication.config();
        });
    }, setOperatio: function (status) {
        config.operation = status;
        chrome.storage.local.set({Operation: status}, function () {
            console.log('Operation value is set to ' + status);
        });
    },
}


