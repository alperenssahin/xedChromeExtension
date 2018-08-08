$(document).keypress(function (ev) {
    if ($('#ctrl.Xedcrawlcontroller').prop('checked')) {
        //use lastdom ...
        console.log(obj);
        let dom = globalValues.lastdom;
        if (!dom.hasClass('Xed') && (String.fromCharCode(ev.which) === 'x' || String.fromCharCode(ev.which) === 'X')) {
            if (!Xed.isActivated(dom)) {
                selector.create(dom);
            } else {
                selector.remove(dom);
            }
        }
        if (!dom.hasClass('Xed') && (String.fromCharCode(ev.which) === 'f' || String.fromCharCode(ev.which) === 'F')) {
            let Id = dom.attr('data-xed');
            if (Id != undefined) {
                domControl.focusOn(dom);
            }
        }
        $('.XedConfirmRule').click(function () {
            // alert('a');
            let id = $(this).get(0).id;
            checkRule(id);
        });


        // console.log();
    }
});

//temel selector kontrol değişkenleri

$(document).mousemove(function (e) {
    globalValues.lastdom = $(e.target);
});


$(document).ready(function () {
    Xed.events.originTypeChange();
});


var rule = {
    originType: null,
    path: null,
    text:null,
    get: [], //todo:dalanmalar yapılacak
    elevator:null,
    reference: {},
};

var selector = {
    create: function (dom) {
        let f_rule = rule; //create rule image
        let id = Xed.uniqueID(); //genearte uniqueID
        f_rule.originType = globalValues.originType;
        domControl.toActivate(dom, id); //activate on html and sign element
        f_rule.path = parthGenerator.getParent(id);
        f_rule.text = dom.text();
        obj.rules[id] = f_rule; //add to global rule
    },
    update: function (id) {
        let rule = obj.rules[id];
        rule.originType = globalValues.originType;
    },
    remove: function (dom) {
        let id = dom.attr('data-xed');
        delete obj.rules[id];
        domControl.toDeactivate(dom);
    }
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
    findDomById: function (id) {
        return $("[data-xed = '" + id + "']");

    },
    events: {
        originTypeChange: function () {
            $('.XedOrigin').change(function () {
                globalValues.originType = $("input[name='XedOrigin']:checked").val();
                let id = $('.XedActive').attr('data-xed');
                logging.info('Origin Type set to ' + globalValues.originType);
                if (id != undefined) {
                    selector.update(id);
                    logging.info(id + '::Origin Type set to ' + globalValues.originType);
                }
            });
        },
    }
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
        let i = {tag: dom.get(0).nodeName, class: dom.get(0).className, id: dom.get(0).id};
        parents.push(i);
        domControl.toActivate(dom, id);
        for (let x = 0; x < par.length; x++) {
            let t = {tag: par[x].tag, class: par[x].class, id: par[x].id};
            parents.push(t);

        }
        // console.log(types);
        // console.log(parents);
        return parents;
    },
};