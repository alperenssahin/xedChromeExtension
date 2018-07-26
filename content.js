/*
* save current url on local storage
* */

var url = window.location.href;
chrome.storage.local.set({url: url}, function () {
    console.log('Current Url is set to ,' + url)
});

/*
 *  control and marking active dom element
 **/

$(document).click(function (ev) {
    var dom = $(ev.target);


    if (!dom.hasClass('Xedinside')) {
        activeDom(ev);
    }
    if (dom.hasClass('XedPop-up')) {
        pop_up(dom);
    }
});


/**
 * remove 'a' href for use effectively activeDom
 */
$(document).mousemove(function (ev) {
    var d = new Date();
    var t = d.getTime();
    // console.log($(ev.target)[0].nodeName);
    if ($(ev.target)[0].nodeName === 'A') {
        $(ev.target).attr('href', '#' + t);
    }
});


var active = [];
var activeDom = function (ev) {
    var d = new Date();
    var dom = $(ev.target);
    if (!dom.hasClass('XedActive') && !dom.hasClass('Xedinside')) {
        if (!dom.hasClass('XedActivated') && !dom.hasClass('Xedinside')) {
            var unique_id = d.getTime();
            if (!dom.hasClass('XedPop-up') && !dom.hasClass('pop-up-inside') && !dom.hasClass('Xedinside')) {
                dom.append('<div class="XedPop-up" id="' + unique_id + '"></div>');
            }
            dom.attr('data-xed', unique_id);
            active.push(unique_id);
        }
        dom.addClass('XedActive');
        $('#' + dom.attr('data-xed')).css('display', 'block');
        dom.css('border', '3px solid deepskyblue');
    } else {
        dom.removeClass('XedActive');
        dom.addClass('XedActivated');
        dom.css('border', '0px solid deepskyblue');
        $('#' + dom.attr('data-xed')).css('display', 'none');
    }
};
/**
 *control pop-up option
 */

var pop_up = function (domm) {
    let id = domm.get(0).id;
    let dom = $('#' + id);
    if (!dom.hasClass('open')) {
        if (!dom.hasClass('init')) {
            dom.addClass('init');

            dom.append('<div class="pop-up-inside Xedinside" id="' + id + '"><div class="container Xedinside" style="padding: 10px;">' +
                '<div id="' + id + '" class="get-parent-xed Xedinside" style="border: 1px solid sandybrown">' +
                '' +
                '</div></div></div>');
            $('#'+id+'.get-parent-xed').append(parentsDomGenerator(id));
        } else {
            $('#' + id + '.pop-up-inside').slideUp(500);
            dom.addClass('open');


        }
    } else {
        dom.removeClass('open');
        $('#' + id + '.pop-up-inside').slideDown(500);
    }
};

var getParent = function (id) {
    var parents = [];
    var par = $('#' + id + '.pop-up-inside').parents()
        .map(function () {
            return {tag: this.tagName, id: this.id, class: this.className};
        });
    for (let x = 1; x < par.length; x++) {
        var t = {tag: par[x].tag, class: par[x].class, id: par[x].id};
        parents.push(t);
    }
    // console.log(types);

    return parents;
    // console.log(JSON.stringify(par));
};

var parentsDomGenerator = function (id) {
    var str = '';
    var parents = getParent(id);
    var c = 0;
    for (let i of parents) {

        str += '<div class="parentcontainer Xedinside" data-tag="' + i.tag + '" style="display: flex;"><span class="Xedinside Xedtarget" id="' + c + '">' + i.tag + '</span><span class="Xedclassname Xedinside" id="' + c + '">' + i.class + '</span><span class="Xedid Xedinside" id="' + c + '">' + i.id + '</span></div>';
        c++;
    }
    // console.log(str);
    return str;
};