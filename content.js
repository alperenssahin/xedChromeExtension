/*
* save current url on local storage
* */

var url = window.location.href;
chrome.storage.local.set({url: url}, function () {
    console.log('Current Url is set to ,' + url)
});

/*
 *  control and marking active dom element
 *  todo: js code ile kontrol edilen linklere tıklamadan işaretlemek
 **/

$(document).click(function (ev) {
    var dom = $(ev.target);

    if (dom[0].nodeName === 'TBODY') {
        return 0;
    }
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

/*
 * elementin ailesinin sınıflarını düzenlerken select etşketinin dinlenmesi
 */
$(document).change(function (ev) {
    let dom = $(ev.target);
    let count = dom.attr('data-row');

    let tag = dom.parents('.Xedrow').children('.Xedtarget').text().toLowerCase();
    let classe = dom.parents('.Xedrow').children().children().val();
    let i_id = dom.parents('.Xedrow').children('.Xedid').text();
    console.log(tag+ ' '+ classe+' '+ i_id);
    dom.parents('.Xedrow').children('.Xedcount').text(countGenerator(tag,i_id,classe));
    console.log(countGenerator(tag,i_id,classe));
});

/**
 *
 * Element üzerine tıklandığında pop-up ekleme
 */
var active = [];
var activeDom = function (ev) {
    var d = new Date();
    var dom = $(ev.target);
    if (!dom.hasClass('XedActive') && !dom.hasClass('Xedinside')) {
        if (!dom.hasClass('XedActivated') && !dom.hasClass('Xedinside')) {
            var unique_id = d.getTime();  //başlangıç  id
            if (!dom.hasClass('XedPop-up') && !dom.hasClass('pop-up-inside') && !dom.hasClass('Xedinside')) {
                dom.append('<div class="XedPop-up" id="' + unique_id + '"></div>');

            }
            dom.attr('data-xed', unique_id);
            // active.push(unique_id+'');
            //data transferiiçin eklenek activ elemanalrın id listesi todo: de-active olanları düşürmüyor
        }
        let uID =  dom.children('.XedPop-up').get(0).id;
        active.push(uID);
        console.log(active);
        dom.addClass('XedActive'); //başlangıç  sınıfı
        $('#' + dom.attr('data-xed')).css('display', 'block');
        dom.css('border', '3px solid deepskyblue');
    } else {
        dom.removeClass('XedActive');
        // listeden çıkar
        let uID =  dom.children('.XedPop-up').get(0).id;
        console.log(uID);
        let index = active.indexOf(uID);
        if (index > -1) {
            active.splice(index, 1);
        }
        console.log(active);
        dom.addClass('XedActivated'); //tekrarı engellemek için ikincil kontrol sınıfı
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
            dom.addClass('init'); //tekrarı durdurmak adına kontrol sınıfı
            dom.append('<div class="pop-up-inside Xedinside" id="' + id + '"><div class="Xedcontainer Xedinside">' +
                '<div id="' + id + '" class="get-type-xed Xedinside" style="border: 0px solid sandybrown">' +
                '' +
                '</div>' +
                '<div id="' + id + '" class="get-parent-xed Xedinside"></div>' +
                '</div></div>');
            /**
             * todo: Attribute matris datası ile ooluşturulacak  elemntlerin eklenmesi gereken kısım
             *
             */
            let parents = parentsDomGenerator(id); //elementin ailesi ve en iyi crawl seçeniği
            $('#' + id + '.get-parent-xed').append(parents.data);
            $('#' + id + '.get-type-xed').append(getType(dom,id)); // elementin çekilebilecek attributleri
            $('#'+id+'-'+parents.best.count).css('border','2px solid sandybrown');
        } else {
            $('#' + id + '.pop-up-inside').slideUp(500);
            dom.addClass('open');


        }
    } else {
        dom.removeClass('open');
        $('#' + id + '.pop-up-inside').slideDown(500);
    }


};
/**
 * Çekilmek sitenen elementin ailesini döndürür.
 * @param id
 * @returns {Array}
 */
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
/**
 * Çekilmek istenen elementin ailesini tablolar, en iyi seçeneği sunar.
 * @param id
 * @returns {{data: string, best: *, pivot: string | number}}
 */
var parentsDomGenerator = function (id) {

    var str = '<table class="parentcontainer Xedinside" id="' + id + '">' + //tablo declarasyonu
        '<tr class="Xedinside">' +
        '<th class="Xedinside">Count</th>' +
        '<th class="Xedinside">Tag</th>' +
        '<th class="Xedinside">Classname</th>' +
        '<th class="Xedinside">Id</th>' +
        '<th class="Xedinside">Approve</th>' +
        '</tr>';
    var parents = getParent(id);
    let pivot = parents[0].tag;


    var bestoption;   //bestoption selecting
    for(let i of parents){
        let str = i.tag;
        if(i.id !== '')
        {
            str += '#'+i.id;
        }
        if(i.class !== ''){
            str += '.'+i.class;
        }
        // console.log(str);
        break;
    }
    let co = 0;
    for (let i of parents) {
        if (i.class === '' && i.id === '') {
            continue;
        }
        let classes = i.class.split(' ');
        var exit = false;
        for (let x of classes) {
            if(x ==='XedActive') continue;
            let count = countGenerator(i.tag.toLowerCase(), i.id, x);
            if(count === 1 ){
                bestoption = {tag:i.tag.toLowerCase(),id:i.id,class:x,count:co};
                console.log(bestoption);
                exit = true;
                break;
            }
        }
        if(exit) break;
        co++;
    }

                //best option finish
    var c = 0;
    for (let i of parents) {   //tablo oluşumu
        var classes = i.class.split(' ');
        var cls =
            '<select class="Xedinside" id="'+id+'" data-row="'+c+'" >';
        for (let x of classes) {
            if (x === 'XedActive' || x === 'XedActivated' || x === '') continue;
            cls += '<option class="Xedinside" value="' + x + '">' + x + '</option>';
        }
        cls += '</select>';

        let count = countGenerator(i.tag.toLowerCase(), i.id, classes[0]);
        // console.log(i.tag + ' '+ i.id + ' '+classes[0]);
        str += '<tr class="Xedinside Xedrow" id="'+id+'-'+c+'">' +
            '<td class="Xedinside Xedcount" id="' + c + '">' + count + '</td>' +
            '<td class="Xedinside Xedtarget" id="' + c + '">' + i.tag + '</td>' +
            '<td class="Xedclassname Xedinside" id="' + c + '">' + cls + '</td>' +
            '<td class="Xedid Xedinside" id="' + c + '">' + i.id + '</td>' +
            '<td class="Xedinside" style="justify-content: center;display: flex;"><input class="Xedinside" id="' + c + '" type="radio" name="parent" ></td>' +
            '</tr>';
        c++;

        // console.log(i.class);
    }
    if (c === 0) {
        str += 'no-result';
    }
    str += '</table>';

    return {data:str,best:bestoption,pivot:pivot};
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
 * @param domm
 * @param id
 * @returns {string}
 */
var getType = function(domm,id){
    let dom = domm.parent();
    console.log('node: ' + dom.get(0).nodeName);
    let str = '';
    str += '<div class="Xedinside" style="display: flex; justify-content: space-around; padding:20px;">';
    if(dom.attr('href')){
        str += '<div><span class="Xedinside XedGetTypeHref" id="'+id+'">Href:</span>' +
            '<input type="checkbox" id="'+id+'" class="Xedinside XedHrefcheckbox"></div>';
    }
    if(dom.attr('src')){
        str += '<div><span class="Xedinside XedGetTypeSrc" id="'+id+'">Src:</span>' +
            '<input type="checkbox" id="'+id+'" class="Xedinside XedScrcheckbox"></div>';
    }

    str += '<div><span class="Xedinside XedGetTypeText" id="'+id+'">Text:</span>' +
        '<input type="checkbox" id="'+id+'" class="Xedinside XedTextcheckbox"></div>';
    str +='</div>';
    return str;
};
