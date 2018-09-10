var pathGenerator = {
    getParent: function (id) {
        let parents = {extension: [], real: []};
        let dom = Xed.findDomById(id);
        let par = dom.parents()
            .map(function () {
                return {tag: this.tagName, id: this.id, class: this.className};
            });
        // console.log(par);
        domControl.toDeactivate(dom);
        let clas = this.classSeperator(dom.get(0).className);
        let i = {tag: dom.get(0).nodeName.toLowerCase(), class: clas, id: dom.get(0).id};
        parents.real.push(i);
        parents.extension.push(i);
        domControl.toActivate(dom, id);
        for (let x = 0; x < par.length; x++) {
            let clas = this.classSeperator(par[x].class);
            let t = {tag: par[x].tag.toLowerCase(), class: clas, id: par[x].id};
            parents.extension.push(t);
            if (x == par.length - 3 || x == par.length - 4) {
                continue;
            } else {
                parents.real.push(t);
            }
        }
        // console.log(types);
        // console.log(parents);
        return parents;
    },
    getParentsByDom: function (dom) {
        let parents = {extension: [], real: []};
        let par = dom.parents()
            .map(function () {
                return {tag: this.tagName, id: this.id, class: this.className};
            });
        // console.log(par);
        let clas = this.classSeperator(dom.get(0).className);
        let i = {tag: dom.get(0).nodeName.toLowerCase(), class: clas, id: dom.get(0).id};
        parents.real.push(i);
        parents.extension.push(i);
        for (let x = 0; x < par.length; x++) {
            let clas = this.classSeperator(par[x].class);
            let t = {tag: par[x].tag.toLowerCase(), class: clas, id: par[x].id};
            parents.extension.push(t);
            if (x == par.length - 3 || x == par.length - 4) {
                continue;
            } else {
                parents.real.push(t);
            }
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
    xpathGenerator: function (parents) {
        let str = '//'
        for (let i = parents.length - 1; i > -1; i--) {
            // console.log(parents[i]);
            str += parents[i].tag
            if (i == 0) {
                continue;
            } else {
                str += '/';
            }
        }
        return str;
    },
    xpathElevatorGenerator:function(rule){
        let str = '/'
        let branche = true;
        let rulelen = rule.path.length -1;
        let y = null
        for (let i = rule.elevator.length -1, y = rulelen; i > -1  ; i--,y--) {
            // console.log(parents[i]);
            if(y>=0 && rule.elevator[i].tag != rule.path[y].tag && branche){
                branche = false;
                str += '/'+rule.path[y].tag+'[text()="'+rule.text+'"]/..';

            }if (branche){
                str += '/'+rule.path[y].tag;
                if (rule.path[y].class[0] !== ""){
                    str += '[contains(@class,"'+rule.path[y].class.join(' ')+'")]';
                }
            }else{
                str += '/'+rule.elevator[i].tag;
                if (rule.elevator[i].class[0] !== ""){
                    str += '[contains(@class,"'+rule.elevator[i].class.join(' ')+'")]';
                }
            }

        }
        return str;
    }
};
$(document).click(function () {
 let hell = pathGenerator.getParentsByDom($('a')); console.log(hell); console.log(hell.length);
});
$.fn.xpathEvaluate = function (xpathExpression) {
    // NOTE: vars not declared local for debug purposes
    $this = this.first(); // Don't make me deal with multiples before coffee

    // Evaluate xpath and retrieve matching nodes
    xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    result = [];
    while (elem = xpathResult.iterateNext()) {
        result.push(elem);
    }

    $result = jQuery([]).pushStack(result);
    return $result;
}
