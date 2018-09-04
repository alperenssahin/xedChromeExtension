'use strict';
//define port http://127.0.0.1:8003
// $('#get-cat').click(function () {
$(document).ready(function () {
    XedCrawler.init();
    $.post('http://127.0.0.1:8003/xedEx/', {setup: 1}, function (data) {
        console.log(data);
        var obj = JSON.parse(data);

        let str = '<select class="Xed XedSelect" id="Cat-ID">';
        for (let x of obj) {
            str += '<option value="' + x._id.$oid + '">' + x.category.title + '</option>'
        }
        str += '</select>';
        $('#response').html(str);
    });


    $('#get-ref').click(function () {
        $.post('http://127.0.0.1:8003/getReference/', {ID: $('#Cat-ID.XedSelect').val()}, function (data) {
            var obj = JSON.parse(data);
            console.log(obj);
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {key: "reference", data: obj}, function (response) {
                });
            });

            // console.log(obj);
        });

    });
    $('#get-rules').click(function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "rules"}, function (response) {
                // console.log('trig');trig
                if (response.error === 0) {
                    //data işlenebilir
                    // console.log('heel');
                    let myJSONdata = JSON.stringify(response.data);
                    $.post('http://127.0.0.1:8003/rulePort/', {data: myJSONdata}, function (data) {
                        console.log(data);
                    });
                } else {
                    console.log('error no :' + response.error);
                    return 0;
                    //hata nuramarasını basar
                }
            });
        });
    });
});
var XedCrawler = {
    init: function () {
        let login = this.checkLogIn();
        if (login == undefined || login == false) {
            this.config.login = false;
        } else {
            this.config.login = true;
        }
        this.config.setup();
    },
    checkLogIn: function () {
        chrome.storage.local.get(['logIn'], function (result) {
            return result.logIn;

        });
    },
    setLogInStatus: function (status) {
        chrome.storage.local.set({logIn: status}, function () {
            console.log('LogIn value is set to ' + status);
        });
    },
    logOut: function () {
    },
    //configuration general...
    config: {
        login: false,
        server: 'http://127.0.0.1:8003',
        setup: function () {
            XedCrawler.authentication.config();
        },
        user: null,
    },

    authentication: {
        //configuration about authentication...
        config: function () {
            if (XedCrawler.config.login) {
                let dom = $('#container.general');
                page.deactivate($('#container-up.authentication'));
                page.activate(dom);
                $('#container-up.header').removeClass('inactive');
            }
            else {
                $('#send.authentication').click(function () {
                    //todo:connection request, control response
                    let response = XedCrawler.authentication.request();

                    if (response) {
                        page.deactivate($('#container-up.authentication'));
                        page.activate($('#container.general'));
                        $('#container-up.header').removeClass('inactive');
                        XedCrawler.setLogInStatus(true);

                    } else {
                        XedCrawler.setLogInStatus(false);
                        //todo:affiche error message

                    }
                });
            }

        },
        request: function () {
            let url = XedCrawler.config.server + '/login';
            console.log('preparing to request-->' + url);
            let data = {}
            $.post(url, data, function (data) {
                let res = JSON.parse(data);
                //ctrl...
                return true //todo:create user object on server.
                //return false...

            });
        },
    }
};



