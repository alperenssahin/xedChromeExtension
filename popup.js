
'use strict';
//define port http://127.0.0.1:8003
// $('#get-cat').click(function () {
$(document).ready(function () {
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
    //todo: server isimlerini 1 değişkene bağla, option ile kontrol  edilebilir
    $('#get-rules').click(function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "rules"}, function (response) {
                // console.log('trig');trig
                if (response.error === 0){
                    //data işlenebilir
                    // console.log('heel');
                    let myJSONdata = JSON.stringify(response.data);
                    $.post('http://127.0.0.1:8003/rulePort/',{data:myJSONdata},function (data) {
                       console.log(data);
                    });
                }else{
                    console.log('error no :'+response.error);
                    return 0;
                    //hata nuramarasını basar
                }
            });
        });
    });
});



