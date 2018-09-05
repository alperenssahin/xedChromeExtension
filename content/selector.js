//liten keypress event and eleminate different input value

$(document).keypress(function (ev) {
    console.log('press');
    if (configuration.crawl != undefined) {
        //use lastdom ...
        console.log(obj);


        //get current element that we receive from mouse position
        let dom = glob.lastdom;
        //create active element, unique ıd in lastdom element, remove selected element from rule object
        if (!dom.hasClass('Xed') && (String.fromCharCode(ev.which) === 'x' || String.fromCharCode(ev.which) === 'X')) {
            if (!Xed.isActivated(dom)) {
                elevator.toDeactivate();
                selector.create(dom);
                control.run();
                // console.log($('.XedActive').get(0).attributes);
                $('#toprightGetType').html(getData.attrGenerator());
            } else {
                let Down = dom.parent().find('.XedDownLayerSelected');
                elevator.unselectDownlayer(Down);
                elevator.toDeactivate();
                selector.remove(dom);
                $('#toprightGetType').html('');
            }
        }
        //decide elevator element to see elements who is in same layer with element
        if (!dom.hasClass('Xed') && (String.fromCharCode(ev.which) === 'e' || String.fromCharCode(ev.which) === 'E')) {
            if (Xed.isActivated(dom)) {
                if (!Xed.isCenter(dom)) {
                    elevator.toActivate()

                } else {
                    elevator.toDeactivate()

                }
            }
        }
        //select elements who are on sublayer of elevator element
        if (!dom.hasClass('Xed') && (String.fromCharCode(ev.which) === 's' || String.fromCharCode(ev.which) === 'S')) {
            if (dom.hasClass('XedDownLayer')) {
                if (!dom.hasClass('XedDownLayerSelected')) {
                    elevator.selectDownlayer(dom);
                } else {
                    elevator.unselectDownlayer(dom);

                }
            }
        }
        //change your focused element between the active elements
        if (!dom.hasClass('Xed') && (String.fromCharCode(ev.which) === 'f' || String.fromCharCode(ev.which) === 'F')) {
            let Id = dom.attr('data-xed');
            if (Id != undefined) {
                elevator.toDeactivate();
                domControl.focusOn(dom);
                control.run();
                getData.checkType(Id);
                getData.checkReference(Id);
                if (obj.rules[Id].elevator !== null) {
                    elevator.toActivate();
                }
            }
        }
    }
});

//temel selector kontrol değişkenleri
var glob={lastdom:null};
//target lastdom on page
$(document).mousemove(function (e) {
    glob.lastdom = $(e.target);
});



// var rule = {
//     originType: null,
//     path: null,
//     text: null,
//     get: [],
//     elevator: false,
//     reference: {},
// };

// var reference = {newType: null, attrID: null, attrTitle: null, newAttr: null};


var selector = {
    create: function (dom) {
        let f_rule = {};//= rule; //create rule image
        let id = Xed.uniqueID(); //genearte uniqueID
        domControl.toActivate(dom, id); //activate on html and sign element
        f_rule.path = parthGenerator.getParent(id);
        f_rule.elevator = null;
        f_rule.get = null;
        f_rule.reference = {};
        f_rule.text = dom.text();
        obj.rules[id] = f_rule; //add to global rule


    },
    update: function () {
        let id = $('.XedActive').attr('data-xed');
        let rule = obj.rules[id];
        rule.originType = glob.originType; //update originType
        // rule.elevator = glob.elevator;
    },
    remove: function (dom) { // destroy element
        let id = dom.attr('data-xed');
        delete obj.rules[id];
        domControl.toDeactivate(dom);
    },

};
var elevator = {
    toActivate: function () {
        let dom = $('.XedActive');
        dom.addClass('XedCenterLayer');
        dom.parent().addClass('XedUpLayer');
        let child = dom.parent();
        this.addChildrenClass(child);

    },
    toDeactivate: function () {
        let dom = $('.XedActive');
        dom.removeClass('XedCenterLayer');
        dom.parent().removeClass('XedUpLayer');
        let child = dom.parent();
        this.removeChildrenClass(child);
    },
    selectDownlayer: function (dom) {
        dom.addClass('XedDownLayerSelected');
        // let domm = this.getActiveElementByParent(dom);
        // let id = domm.attr('data-xed');
        let id = $('.XedActive').attr('data-xed');
        obj.rules[id].elevator = parthGenerator.getParentsByDom(dom);
    },
    unselectDownlayer: function (dom) {
        dom.removeClass('XedDownLayerSelected');
        // let domm = this.getActiveElementByParent(dom);
        let id = $('.XedActive').attr('data-xed');
        if (id == undefined) return;
        obj.rules[id].elevator = null;
    },
    addChildrenClass: function (dom) {
        if (dom.children().length > 0) {
            dom.children().addClass('XedDownLayer');
            this.addChildrenClass(dom.children());
        }
        else {
            return 0;
        }
    },
    removeChildrenClass: function (dom) {
        if (dom.children().length > 0) {
            dom.children().removeClass('XedDownLayer');
            this.removeChildrenClass(dom.children());
        }
        else {
            return 0;
        }
    },

};
var domControl = {
    toActivate: function (dom, id) {
        dom.attr('data-xed', id);
        dom.addClass('XedActive');
        dom.addClass('XedActivated');
        this.focusOn(dom);
    },
    toDeactivate: function (dom) {
        dom.removeAttr('data-xed');
        dom.removeClass('XedActive');
        dom.removeClass('XedActivated');
    },
    focusOn: function (dom) {
        $('.XedActive').removeClass('XedActive');
        dom.addClass('XedActive');
    }
};

var Xed = {
    uniqueID: function () {
        let d = new Date();
        return d.getTime();
    },
    isActivated: function (dom) {
        if (dom.hasClass('XedActivated')) {
            return true;
        } else {
            return false;
        }
    },
    isCenter: function (dom) {
        if (dom.hasClass('XedCenterLayer')) {
            return true;
        } else {
            return false;
        }
    },
    findDomById: function (id) {
        return $("[data-xed = '" + id + "']");

    },
    getActiveID: function () {
        return $('.XedActive').attr('data-xed');
    }
    ,
    events: {

        getTypeChange: function () {
            $('.XedGetType').change(function () {
                let type = [];
                let dom = $('.XedGetType');
                dom.each(function () {
                    if ($(this).prop('checked')) {
                        type.push($(this).val());
                    }
                });
                let id = Xed.getActiveID();
                obj.rules[id].get = type;
            });
        },

        listenAttrChange: function () {
            $('#attributes.Xed.XedSelect').change(function () {
                console.log('change');
               let id = Xed.getActiveID();
               obj.rules[id].reference.attrID = $('#attributes.Xed.XedSelect').val();
            });
        }


    },

};

var parthGenerator = {
    getParent: function (id) {
        let parents = [];
        let dom = Xed.findDomById(id);
        let par = dom.parents()
            .map(function () {
                return {tag: this.tagName, id: this.id, class: this.className};
            });
        // console.log(par);
        domControl.toDeactivate(dom);
        let clas = this.classSeperator(dom.get(0).className);
        let i = {tag: dom.get(0).nodeName.toLowerCase(), class: clas, id: dom.get(0).id};
        parents.push(i);
        domControl.toActivate(dom, id);
        for (let x = 0; x < par.length; x++) {
            let clas = this.classSeperator(par[x].class);
            let t = {tag: par[x].tag.toLowerCase(), class: clas, id: par[x].id};
            parents.push(t);

        }
        // console.log(types);
        // console.log(parents);
        return parents;
    },
    getParentsByDom: function (dom) {
        let parents = [];
        let par = dom.parents()
            .map(function () {
                return {tag: this.tagName, id: this.id, class: this.className};
            });
        // console.log(par);
        let clas = this.classSeperator(dom.get(0).className);
        let i = {tag: dom.get(0).nodeName.toLowerCase(), class: clas, id: dom.get(0).id};
        parents.push(i);
        for (let x = 0; x < par.length; x++) {
            let clas = this.classSeperator(par[x].class);
            let t = {tag: par[x].tag.toLowerCase(), class: clas, id: par[x].id};
            parents.push(t);

        }
        // console.log(types);
        // console.log(parents);
        return parents;
    },
    classSeperator: function (str) {
        let classes = str.split(' ');
        let arr = [];

        for (let clas of classes) {
            let con = false;
            for (let deter of this.classDeter) {
                if (clas.includes(deter)) {
                    con = true;
                    break;
                }
            }

            if (con) continue;
            arr.push(clas);
        }
        return arr;
    },
    classDeter: ['Xed'],
};

