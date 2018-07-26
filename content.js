$(document).mouseover(function (ev) {
    var dom = $(ev.target);
    var tag = dom.get(0).nodeName;
    dom.css('background','#add');


    // var selObj = document.getSelection();
    // var selectedText = selObj.toString();
    //
    // var aTags = document.getElementsByTagName("h2");
    // // var searchText = "SearchingText";
    // var found;
    // var i_tmp;
    // for (var i = 0; i < aTags.length; i++) {
    //     if (aTags[i].textContent == selectedText) {
    //
    //         found = aTags[i];
    //         found.style.backgroundColor = '#add';
    //         i_tmp = i;
    //         break;
    //     }
    // }
    // var parentEls = $(this).parents()
    //     .map(function() {
    //         return {tag:this.tagName,class:this.className,id:this.id};
    //     });
    // //

    // $('#pop-up-xed').text(JSON.stringify(parentEls));
    // $('#pop-up-xed').text(JSON.stringify(dom));
    $('#pop-up-xed').text(tag);
    //
    // alert(JSON.stringify(parentEls));
});

