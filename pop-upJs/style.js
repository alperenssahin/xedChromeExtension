$(document).ready(function () {
    events.run();
    $('#text.monitor').text('Select crawl type');
    $(document).click(function (ev) {
        let dom = $(ev.target);
        if (dom.hasClass('operation')) {
            let id = setup.operation.style(dom);
            setup.operation.finish();
            if (id === 'mapping') {
                $('#next.setup').removeClass('blocked');
                setup.next('Start');
            }
            if (id === 'scraping') {
                $('#reference-recurrent.setup').removeClass('blocked');
            }
        }
        if (dom.hasClass('ref-rec')) {
            let id = setup.ref_rec.style(dom);
            setup.ref_rec.finish();
            if (id === 'reference') {
                $('#next.setup').removeClass('blocked');
                setup.next('Next');

                //....
                //next data
            }
            if (id === 'recurrent') {
                $('#next.setup').removeClass('blocked');
                setup.next('Start');

                //next data
                //...
            }
        }
    });
    //reference selecting page--- call references fromserver
    $('#next.setup').click(function () {
        if ($('#next.setup').attr('data-button') === 'next') {
            page.deactivate($('#container.setup'));
            page.activate($('#container.attr-ref'));
            reference.getReferences($('#list.attr-ref'));

        } else {

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
    ref_rec: {
        style: function (dom) {
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
    next: function (text) {
        $('#next.setup').text(text);
        if (text === 'Next') {
            $('#next.setup').attr('data-button', 'next');
        }
        if (text === 'Start') {
            $('#next.setup').attr('data-button', 'start');
        }
    }
};

var events = {
    run: function () {
        this.backStep();
        this.settings();
        this.operation();
        this.startCrawl();
    },
    backStep: function () {
        $('span').click(function () {
            if ($(this).hasClass('attr-ref')) {
                page.deactivate($('#container.attr-ref'));
                page.activate($('#container.setup'));
                //todo:destroy request
            }
        });
    },
    settings: function () {
        $('span').click(function () {

            if ($(this).hasClass('settings')) {

                let setting = $('#container.settings');
                if (setting.hasClass('inactive')) {
                    page.lastActive = $('#container.active');
                    page.deactivate(page.lastActive);
                    page.activate(setting);
                    $('#settings.button').addClass('opened');
                } else {
                    page.activate(page.lastActive);
                    page.deactivate(setting);
                    $('#settings.button').removeClass('opened');

                }

            }
        });
    },
    operation: function () {
        chrome.storage.local.get(['Operation'], function (result) {
            let bool = result.Operation;
            if (!bool || bool == undefined) {
                $('#start-operation.general').click(function () {
                    page.activate($('#container.setup'));
                    page.deactivate($('#container.general'));
                });
            } else {
                $('#status.general.current-operation').text(' Another operation is continuing...');
                $('#start-operation.general').addClass('blocked');
            }
        });
    },
    startCrawl: function (bool) {

        $('button#start.attr-ref').click(function () {
            if (!config.operation) {
                reference.data();
                Log.setOperatio(true);
                $('button#start.attr-ref').addClass('blocked');

            } else {
                console.log('started');
            }
        });
    },
    referenceSelected: function () {
        $('#Cat-ID.XedSelect').change(function () {
            console.log('selected reff');
            if ($('#Cat-ID.XedSelect').val() !== '-') {
                $('button#start.attr-ref').removeClass('blocked');
            } else {
                $('button#start.attr-ref').addClass('blocked');
            }
        });
    },


};
var page = {
    activate: function (dom) {
        dom.removeClass('inactive');
        dom.addClass('active');
    }
    ,
    deactivate: function (dom) {
        dom.removeClass('active');
        dom.addClass('inactive');
    },
    lastActive: null
    ,
};

