var obj = {url: null, rules: {}};

var control = {
    run: function () {
        this.reffSelector();
        this.attrSelector();
    },
    reffSelector: function () {
        let data = configuration.crawl.data.category.attributes;
        // console.log(data);
        let str = '<select class="Xed XedReference XedSelect" id="attributes">';
        str += '<option class="Xed" value="-"> - </option>';
        for (let x in data) {
            // console.log(x);
            // console.log(data[x]);
            str += '<option class="Xed" value="' + data[x].uID.$uuid + '">' + data[x].title + '</option>';
        }
        str += '</select>';

        $('.Xed.Top.right').html(str);
        Xed.events.listenAttrChange();
    },
    attrSelector: function () {
        let str = getData.attrGenerator();
        $('.Xed.Mid.right').html(str);
        Xed.events.getTypeChange();
    }

}

var getData = {
    getAttributes: function () {
        let attr = $('.XedActive').get(0).attributes;
        let attrList = [];
        for (let i = 0; i < attr.length; i++) {
            attrList.push(attr[i].name);
        }
        return attrList;
    },
    attrGenerator: function () {
        let attr = this.getAttributes();
        // console.log(attr);
        // let li = ['class', 'data-xed', 'id', 'name', 'type', 'value'];
        let str = '<label>text</label><input type="checkbox" name="text" id="text" class="Xed XedGetType" value="text">';
        for (let a of attr) {
            // if (li.indexOf(a) === (-1)) continue;
            let tmp = '<label>' + a + '</label><input type="checkbox" name="' + a + '" id="' + a + '" class="Xed XedGetType" value="' + a + '">';
            str += tmp;
        }
        return str;

    },
    checkType: function (id) {
        let type = obj.rules[id].get;
        if (type != null) {
            for (let x of type) {
                $('#' + x + '.XedGetType').prop('checked', true);
            }
        }
    },
    checkReference:function (id) {
        let attrId = obj.rules[id].reference.attrID;
        if(attrId != null || attrId != undefined){
            $('#attributes.XedSelect').val(attrId);
        }

    }
};
