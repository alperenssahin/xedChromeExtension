// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
    //define port http://127.0.0.1:8003
    $('#get-cat').click(function () {
        $.post('http://127.0.0.1:8003/xedEx/', {setup:1}, function (data) {
            console.log(data);
            var obj = JSON.parse(data);
            for(let x of obj){
                console.log(x);
            }
        });
    });


    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "hell"}, function(response) {
    //         console.log(response.farewell);
    //     });
    // });

    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.executeScript(
    //       {file:'content.js'}
    //       );
    // });

