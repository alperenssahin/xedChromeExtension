/**
 * local storage
 * @type {string}
 */
var url = window.location.href;
var obj = {url: url, rules: {}};
chrome.storage.local.set({url: url}, function () {
    console.log('Current Url is set to ,' + url)
});
var trig = false;
var lastdom;
var lastactivated;
$(document).keypress(function (ev) {
    if ($('#ctrl.Xedcrawlcontroller').prop('checked')) {
        //use lastdom ...
        if (!window.lastdom.hasClass('Xed') && (String.fromCharCode(ev.which) === 'x' || String.fromCharCode(ev.which) === 'X' ))  {
            activeDom(window.lastdom);
            window.lastactivated = window.lastdom;
        }
        if (!window.lastdom.hasClass('Xed') && (String.fromCharCode(ev.which) === 'd' || String.fromCharCode(ev.which) === 'D' ))  {
            let Id = window.lastdom.attr('data-xed');
            if(Id != undefined){

            show_detail(Id);
            }

            window.lastactivated = window.lastdom;
        }
        // console.log();
    }
});
$(document).keydown(function () {
    window.trig = true;
});
$(document).keyup(function () {
    window.trig = false;
});
$(document).mousemove(function (e) {
    window.lastdom = $(e.target);
});

/*
 * elementin ailesinin sınıflarını düzenlerken select etşketinin dinlenmesi
 */
var gettype = [];
$(document).change(function (ev) {
    let dom = $(ev.target);
    ///////////////////
    /**
     * elemanların tekrarrnı ilgili elementin tablosunu günceller
     */
    if (dom.hasClass('XedSelectbox')) {
        let count = dom.attr('data-row');

        let tag = dom.parents('.Xedrow').children('.Xedtarget').text().toLowerCase();
        let classe = dom.parents('.Xedrow').children().children().val();
        let i_id = dom.parents('.Xedrow').children('.Xedid').text();

        // console.log(tag+ ' '+ classe+' '+ i_id);
        dom.parents('.Xedrow').children('.Xedcount').text(countGenerator(tag, i_id, classe));
        // console.log(countGenerator(tag,i_id,classe));
    }
    ///////////////////

    /**
     * getType değişkenlerinin seçimini kontrol eder ilgili json tabloyu  olusturur.
     */
    //////////////////

    if (dom.hasClass('XedgetType')) {

        let conn = dom.prop('checked');
        let t_ID = dom.attr('id');

        if (conn) {
            window.gettype.push(dom.val());
        } else {
            let index = window.gettype.indexOf(dom.val());
            if (index > -1) {
                window.gettype.splice(index, 1);
            }
        }
        obj.rules[t_ID].get = window.gettype;
        console.log('Changed::type');
    }
    /////////////////

    /**
     * selector seçimini kontrol eder target ve attribute şartını belirler
     */
    /////////////////
    if (dom.hasClass('XedTarget')) {
        let t_ID = dom.attr('data-id');
        obj.rules[t_ID].target = dom.val();

        let classe = dom.parents('.Xedrow').children().children().val();
        let i_id = dom.parents('.Xedrow').children('.Xedid').text();
        let attr = {class: classe, id: i_id};
        obj.rules[t_ID].attribute = attr;

        let par = getParent(t_ID);
        let children = [];//todo: python kodlardaki rules generatoru kontrol et
        let count = dom.attr('id');
        console.log(count);
        for (let i = 0; i < Number(count); i++) {
            children.push(par[i].tag.toLowerCase());
        }
        obj.rules[t_ID].children = children;
        console.log(dom.val());
        console.log(dom.attr('data-id'));
        console.log(obj);
        console.log('Changed::target');
    }
    ////////////////
});

/**
 *
 * Element üzerine tıklandığında pop-up ekleme
 */
var active = [];
var activeDom = function (domm) {
    var d = new Date();
    var dom = domm;
    let uID = dom.attr('data-xed');
    if (!dom.hasClass('XedActive')) {
        if (!dom.hasClass('XedActivated')) {
            uID = d.getTime();  //başlangıç  id
            dom.attr('data-xed', uID);
            dom.append('<div id="' + uID + '" class="XedInnerElement"></div>');
        }
        //todo:controller yeniden düzenlenecek yeni yapı kurulacak
        active.push(uID.toString());
        obj.rules[uID] = {target: null, get: null, attribute: null, children: null};
        console.log(active);
        dom.addClass('XedActive'); //başlangıç  sınıfı
        dom.css('border', '3px solid deepskyblue');
        show_detail(uID);
    } else {
        dom.removeClass('XedActive');
        // console.log(uID);
        let index = active.indexOf(uID);
        delete obj.rules[uID];
        if (index > -1) {
            active.splice(index, 1);
        }
        console.log(active);
        dom.addClass('XedActivated'); //tekrarı engellemek için ikincil kontrol sınıfı
        dom.css('border', '0px solid deepskyblue');
    }
};
/**
 *control pop-up option
 */

var show_detail = function (id) {
    let dom = $('#right.Xedpanel');
    dom.html('<div class="pop-up-inside Xed" id="' + id + '"><div class="Xed Xedcontainer ">' +
        '<div id="' + id + '" class="Xed get-type-xed " style="border: 0px solid sandybrown">' +
        '' +
        '</div>' +
        '<div id="' + id + '" class="Xed get-parent-xed "></div>' +
        '</div></div>');
    /**
     * todo: Attribute matris datası ile ooluşturulacak  elemntlerin eklenmesi gereken kısım
     *
     */
    let parents = parentsDomGenerator(id); //elementin ailesi ve en iyi crawl seçeniği
    $('#' + id + '.get-parent-xed').append(parents.data);
    $('#' + id + '.get-type-xed').append(getType(dom, id)); // elementin çekilebilecek attributleri
    $('#' + id + '-' + parents.best.count).css('border', '2px solid sandybrown');
    $('#' + id + '.XedSelectbox').val(parents.best.class);


};

/**
 * Çekilmek sitenen elementin ailesini döndürür.
 * @param id
 * @returns {Array}
 */
var getParent = function (id) {
    console.log(id);
    var parents = [];
    var par = $('#' + id + '.XedInnerElement').parents()

        .map(function () {
            return {tag: this.tagName, id: this.id, class: this.className};
        });
    console.log(par);
    for (let x = 0; x < par.length; x++) {
        var t = {tag: par[x].tag, class: par[x].class, id: par[x].id};
        parents.push(t);

    }
    // console.log(types);
    console.log(parents);
    return parents;
    // console.log(JSON.stringify(par));
};
/**
 * Çekilmek istenen elementin ailesini tablolar, en iyi seçeneği sunar.
 * @param id
 * @returns {{data: string, best: *, pivot: string | number}}
 */
var parentsDomGenerator = function (id) {

    var str = '<table class="Xed parentcontainer " id="' + id + '">' + //tablo declarasyonu
        '<tr class="Xed ">' +
        '<th class="Xed ">Count</th>' +
        '<th class="Xed ">Tag</th>' +
        '<th class="Xed ">Classname</th>' +
        '<th class="Xed ">Id</th>' +
        '<th class="Xed ">Approve</th>' +
        '</tr>';
    var parents = getParent(id);
    // console.log(parents);
    let pivot = parents[0].tag; //Seçilmek istenen element


    var bestoption;   //bestoption selecting
    // for (let i of parents) {
    //     let str = i.tag;
    //     if (i.id !== '') {
    //         str += '#' + i.id;
    //     }
    //     if (i.class !== '') {
    //         str += '.' + i.class;
    //     }
    //     // console.log(str);
    //     break;
    // }
    let co = 0;
    for (let i of parents) {
        if (i.class === '' && i.id === '') {
            co++;
            continue;
        }
        let classes = i.class.split(' ');
        var exit = false;
        for (let x of classes) {
            if (x === 'XedActive' || x === 'XedActivated') {
                continue;
            }
            let count2 = countGenerator(i.tag.toLowerCase(), i.id, x);
            if (count2 === 1) {
                bestoption = {tag: i.tag.toLowerCase(), id: i.id, class: x, count: co};
                console.log(bestoption);
                exit = true;
                break;
            }
        }
        if (exit) break;
        co++;
    }

    //best option finish
    var c = 0;
    for (let i of parents) {   //tablo oluşumu
        var classes = i.class.split(' ');
        var cls =
            '<select class="Xed Xedinside XedSelectbox" id="' + id + '" data-row="' + c + '" >';
        for (let x of classes) {
            if (x === 'XedActive' || x === 'XedActivated' || x === '') continue;
            cls += '<option class="Xed Xedinside" value="' + x + '">' + x + '</option>';
        }
        cls += '</select>';

        let count = countGenerator(i.tag.toLowerCase(), i.id, classes[0]);
        // console.log(i.tag + ' '+ i.id + ' '+classes[0]);
        str += '<tr class="Xed Xedinside Xedrow" id="' + id + '-' + c + '" >' +
            '<td class="Xed Xedinside Xedcount" id="' + c + '">' + count + '</td>' +
            '<td class="Xed Xedinside Xedtarget" id="' + c + '">' + i.tag + '</td>' +
            '<td class="Xed Xedclassname Xedinside" id="' + c + '">' + cls + '</td>' +
            '<td class="Xed Xedid Xedinside" id="' + c + '">' + i.id + '</td>' +
            '<td class="Xed Xedinside" style="justify-content: center;display: flex;">' +
            '<input class="Xed Xedinside XedTarget" id="' + c + '" type="radio" name="parent" value="' + i.tag.toLowerCase() + '" data-id="' + id + '"></td>' +
            '</tr>';
        c++;

        // console.log(i.class);
    }
    if (c === 0) {
        str += 'no-result';
    }
    str += '</table>';

    return {data: str, best: bestoption, pivot: pivot};
};
/**
 * //belirlenen elementin tekrarsayısını verir
 * @param tag
 * @param id
 * @param Class
 * @returns {number | jQuery}
 */
var countGenerator = function (tag, id, Class) {
    let str = tag;
    if (id !== '') {
        str += '#' + id;
    }
    if (Class !== '') {
        str += '.' + Class;
    }
    let count = $(str).length;
    return count;
    // console.log(str+':: '+ count);
};
/**
 * Çekilecek elementin hangi özelliğini çekleceğini seçenek olrak döndürür
 * todo: Fotograflarda düzgün çalışmıyor
 * @param domm
 * @param id
 * @returns {string}
 */
var getType = function (domm, id) {
    let dom = domm.parent();
    console.log('node: ' + dom.get(0).nodeName);
    let str = '';
    str += '<div class="Xed Xedinside" style="display: flex; justify-content: space-around; padding:20px;">';
    if (dom.attr('href')) {
        str += '<div><span class="Xed Xedinside XedGetTypeHref" id="' + id + '">Href:</span>' +
            '<input type="checkbox" id="' + id + '" class="Xed Xedinside XedHrefcheckbox XedgetType" value="href"></div>';
    }
    if (dom.attr('src')) {
        str += '<div><span class="Xed Xedinside XedGetTypeSrc" id="' + id + '">Src:</span>' +
            '<input type="checkbox" id="' + id + '" class="Xedinside XedScrcheckbox XedgetType" value="src"></div>';
    }

    str += '<div><span class="Xed Xedinside XedGetTypeText" id="' + id + '">Text:</span>' +
        '<input type="checkbox" id="' + id + '" class="Xed Xedinside XedTextcheckbox XedgetType" value="text"></div>';
    str += '</div>';
    return str;
};

/**
 * parametre  aldığı aray içerisinden active elementlerin idlerini çeker.
 * 1. getType: 1 elementen çıkacak kural sayısını belirler
 * 2. bestoption
 * 3. children
 *
 * @param active
 */
var rulesGenerator = function (active) {


};
