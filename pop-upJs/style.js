$(document).ready(function () {
    $('#text.monitor').text('Select crawl type');
    $(document).click(function (ev) {
        let dom = $(ev.target);
        if (dom.hasClass('operation')) {
            let id = setup.operation.style(dom);
            setup.operation.finish();
            if (id === 'mapping') {
               setup.next('Start');
            }
            if (id === 'scraping') {
                $('#reference-recurrent.setup').removeClass('blocked');
            }
        }
        if(dom.hasClass('ref-rec')){
            let id = setup.ref_rec.style(dom);
            setup.ref_rec.finish();
            if(id==='reference'){
                $('#next.setup').removeClass('blocked');
                 setup.next('Next');

                 //....
                //next data
            }
            if(id==='recurrent'){
                 $('#next.setup').removeClass('blocked');
                setup.next('Start');

                //next data
                //...
            }
        }
    });

});
var setup = {
    operation: {
        /*select crawl type and run interface function */
        style: function (dom) {
            $('.setup.info-op').slideUp(200);
            let id = dom.attr('id');
            console.log(id);
            if ($('.operation-label-' + id).hasClass('Op-radioActive')) {
                $('.operation-label-' + id).removeClass('Op-radioActive');
                this.finish();
            } else {
                $('.Op-radioActive').removeClass('Op-radioActive');
                $('.operation-label-' + id).addClass('Op-radioActive');
                $('.setup.info-op.' + id).slideDown(200);
                return id;
            }

        },
        finish: function () {
            $('#reference-recurrent.setup').addClass('blocked');
            $('#next.setup').addClass('blocked');
            $('.rr-radioActive').removeClass('rr-radioActive');
            $('.setup.info-rr').slideUp(200);
        }
    },
    ref_rec:{
        style:function (dom) {
            $('.setup.info-rr').slideUp(200);
            let id = dom.attr('id');
            console.log(id);
            if ($('.ref-rec-label-' + id).hasClass('rr-radioActive')) {
                $('.ref-rec-label-' + id).removeClass('rr-radioActive');
                this.finish();
            } else {
                $('.rr-radioActive').removeClass('rr-radioActive');
                $('.ref-rec-label-' + id).addClass('rr-radioActive');
                $('.setup.info-rr.' + id).slideDown(200);
                return id;
            }

        },
        finish: function () {
            $('#next.setup').addClass('blocked');
        }
    },
    next:function (text) {
        $('#next.setup').text(text);
    }
};