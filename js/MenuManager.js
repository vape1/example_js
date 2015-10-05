//menu container

var android_channel_menu = (function () {
    return {
        channel_cat: 0
        , channel_num: 0
        , cur_item_last: 0
        , cur_view: 'channel' // channel or rec
        , show: function () {

            this.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            this.channel_num = ChannelsManager.channelsList.GetCurrentElementIndex();

            //отображаем меню и строим шаблон
            menu_cont.buildTemplate('android_channel_menu');

            ChannelsManager.initChannelsList(Main.android_channel_menu_items);

            ChannelsManager.setChannel(this.channel_num);
            menu_cont.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            menu_cont.createCategory();

            android_channel_menu.createContent();
            ChannelsManager.updateChannelList();
            ChannelsManager.updateChannel();
        }
        , createContent: function () {
            var channels = '';

            ChannelsManager.channelsList.elements.forEach(function(channel,ch_id){
                var prog_now = program.getNowProgram(channel, time_obj.unix_time);
                var prog_title = '';
                var rec_title = channel.has_record == 1 ? 'Rec' :'';
                var icon = channel.icons[ConstValue.cIcon_100_100] ? channel.icons[ConstValue.cIcon_100_100] : channel.icons['default'];
                if (prog_now) {
                    prog_title = prog_now.t_start.split(' ')[1] + ' - ' + prog_now.t_stop.split(' ')[1] + ' ' + prog_now.title;
                }

                channels += '<div class="channel_content">' +
                '<div id="channel_'+ch_id+'" class="channel_content_info" onclick=android_channel_menu.clickChannel('+ch_id+');>' +
                '<div class="channel_content_img"><img class="channel_img" src="' + icon + '"/></div>' +
                '<div class="channel_content_title_epg">' +
                '<div class="channel_content_title font_120">' + channel.title + '</div>' +
                '<div class="channel_content_epg font_90">' + prog_title + '</div>' +
                '</div>' +
                '</div>' +
                '<div id="rec_'+ch_id+'" onclick=android_channel_menu.clickRec('+ch_id+'); class="channel_content_rec">'+ rec_title +'</div>' +
                '</div>';

            });

            menu_cont.setContentId("channels_container", channels);

            android_channel_menu.cur_item_last = isEven(ChannelsManager.channelsList.GetCurrentElementIndex()) ? 0 : 1;

            if(android_channel_menu.cur_view == 'category') {
                removeClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                return false;
            }

            android_channel_menu.cur_view = 'channel';
        }
        ,clickRec: function (id) {
            if(ChannelsManager.getCurrentChannel().has_record == 1) {
                ChannelsManager.setChannel(id);
                program.show('archive');
            }
            return false;
        }
        ,clickChannel: function (id) {
            android_channel_menu.cur_item_last = isEven(ChannelsManager.channelsList.GetCurrentElementIndex()) ? 0 : 1;
            android_channel_menu.cur_view = 'channel';
            ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();
            ChannelsManager.setChannel(id);
            source.playLive();
        }
        ,ifLastEven: function () {
            var last_odd = false;
            if(ChannelsManager.channelsList.GetCurrentElementIndex() == (ChannelsManager.channelsList.elementCount - 1)){
                if(isEven(ChannelsManager.channelsList.GetCurrentElementIndex()) ) last_odd = true;
            }

            return last_odd;
        }
        ,navigate:  function (type) {
            ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();
            ChannelsManager.old_index_in_page = ChannelsManager.channelsList.GetElementInCurrentPageIndex();
            if(type == 'next_cat') {
                menu_cont.setContentId("channels_container", '');
                ChannelsManager.moveCurrentCatTo('down');
            } else if(type == 'prev_cat') {
                menu_cont.setContentId("channels_container", '');
                ChannelsManager.moveCurrentCatTo('up');
            } else if(type == 'next_page') {
                ChannelsManager.channelsList.SetNextPage();
            } else if(type == 'prev_page') {
                ChannelsManager.channelsList.SetPrevPage();
            } else if(type == 'left') {
                if(android_channel_menu.cur_view == 'channel') {
                    android_channel_menu.cur_view = 'rec';
                    removeClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");

                    if(!android_channel_menu.ifLastEven() && android_channel_menu.cur_item_last) {
                        ChannelsManager.channelsList.MoveCurrentElementToUp();
                        android_channel_menu.cur_item_last = 0;
                    } else {
                        ChannelsManager.channelsList.SetPrevPage();
                        ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();
                        ChannelsManager.channelsList.SetCurrentElementByIndex((ChannelsManager.channelsList.currentPageIndex* ChannelsManager.channelsList.elementInPageCount) + (ChannelsManager.old_index_in_page + 1));
                        android_channel_menu.cur_item_last = 1;
                    }

                    if(ChannelsManager.getCurrentChannel().has_record == 1) {
                        removeClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                        addClass(document.getElementById('rec_' +ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                    } else {
                        addClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                        removeClass(document.getElementById('rec_' +ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                        android_channel_menu.cur_view = 'channel';
                    }
                } else if(android_channel_menu.cur_view == 'rec') {
                    android_channel_menu.cur_view = 'channel';
                    removeClass(document.getElementById('rec_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                    addClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                } else if(android_channel_menu.cur_view == 'category') {
                    menu_cont.prevCat();
                }
            } else if(type == 'right') {
                if(android_channel_menu.cur_view == 'channel') {
                    android_channel_menu.cur_view = 'rec';
                    removeClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                    addClass(document.getElementById('rec_' +ChannelsManager.channelsList.GetCurrentElementIndex()), "active");

                    if(ChannelsManager.getCurrentChannel().has_record == 0) {
                        removeClass(document.getElementById('rec_' +ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                        android_channel_menu.navigate('right');
                    }
                } else if(android_channel_menu.cur_view == 'rec') {
                    android_channel_menu.cur_view = 'channel';
                    removeClass(document.getElementById('rec_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");

                    var active_element_id = (ChannelsManager.channelsList.currentPageIndex * ChannelsManager.channelsList.elementInPageCount) + (ChannelsManager.old_index_in_page - 1);

                    if(android_channel_menu.ifLastEven()) {
                        ChannelsManager.channelsList.SetNextPage();
                        active_element_id = (ChannelsManager.channelsList.currentPageIndex * ChannelsManager.channelsList.elementInPageCount) + (ChannelsManager.old_index_in_page - 1);
                        ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();

                        ChannelsManager.channelsList.SetCurrentElementByIndex(active_element_id+1);
                        android_channel_menu.cur_item_last = 0;
                    } else if(android_channel_menu.cur_item_last) {

                        ChannelsManager.channelsList.SetNextPage();

                        ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();

                        active_element_id = (ChannelsManager.channelsList.currentPageIndex * ChannelsManager.channelsList.elementInPageCount) + (ChannelsManager.old_index_in_page - 1);

                        if(active_element_id >= (ChannelsManager.channelsList.elementCount - 1)) {
                            if(isEven(ChannelsManager.channelsList.elementCount)) {
                                active_element_id = ChannelsManager.channelsList.elementCount - 2;
                                android_channel_menu.cur_item_last = 0;
                            } else {
                                active_element_id = ChannelsManager.channelsList.elementCount - 1;
                                android_channel_menu.cur_item_last = 1;
                            }
                        } else {
                            android_channel_menu.cur_item_last = 0;
                        }
                        ChannelsManager.channelsList.SetCurrentElementByIndex(active_element_id);
                    }
                    else {
                        ChannelsManager.channelsList.MoveCurrentElementToDown();
                        android_channel_menu.cur_item_last = 1;
                    }
                } else if(android_channel_menu.cur_view == 'category') {
                    menu_cont.nextCat();
                }

            } else if(type == 'up') {
                if(android_channel_menu.cur_view == 'category') return false;

                android_channel_menu.cur_view = 'channel';
                removeClass(document.getElementById('rec_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");

                if(ChannelsManager.channelsList.GetElementInCurrentPageIndex() == 0) {
                    android_channel_menu.cur_view = 'category';
                    removeClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                    addClass(document.getElementById('category_' + ChannelsManager.categoriesList.GetCurrentElementIndex()), "hover");
                } else if(ChannelsManager.channelsList.GetElementInCurrentPageIndex() == 1) {
                    android_channel_menu.cur_view = 'category';
                    removeClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                    addClass(document.getElementById('category_' + ChannelsManager.categoriesList.GetCurrentElementIndex()), "hover");
                } else {
                    ChannelsManager.channelsList.MoveCurrentElementToUp();
                    ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();
                    ChannelsManager.channelsList.MoveCurrentElementToUp();
                }


            } else if(type == 'down') {
                if(android_channel_menu.cur_view == 'category'){
                    android_channel_menu.cur_view = 'channel';
                    removeClass(document.getElementById('category_' + ChannelsManager.categoriesList.GetCurrentElementIndex()), "hover");
                    addClass(document.getElementById('channel_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
                    return false;
                }

                android_channel_menu.cur_view = 'channel';
                removeClass(document.getElementById('rec_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");

                if(ChannelsManager.channelsList.GetElementInCurrentPageIndex() == (ChannelsManager.channelsList.elementInPageCount - 1)) {
                    ChannelsManager.channelsList.SetCurrentElementByIndex((ChannelsManager.channelsList.currentPageIndex* ChannelsManager.channelsList.elementInPageCount) + 1);
                } else if(ChannelsManager.channelsList.GetElementInCurrentPageIndex() == (ChannelsManager.channelsList.elementInPageCount - 2)) {
                    ChannelsManager.channelsList.SetCurrentElementByIndex((ChannelsManager.channelsList.currentPageIndex* ChannelsManager.channelsList.elementInPageCount));
                } else if(ChannelsManager.channelsList.GetCurrentElementIndex() == (ChannelsManager.channelsList.elementCount - 2)) {
                    ChannelsManager.channelsList.SetCurrentElementByIndex((ChannelsManager.channelsList.currentPageIndex* ChannelsManager.channelsList.elementInPageCount)+1);
                } else if(ChannelsManager.channelsList.GetCurrentElementIndex() == (ChannelsManager.channelsList.elementCount - 1)){
                    ChannelsManager.channelsList.SetCurrentElementByIndex((ChannelsManager.channelsList.currentPageIndex* ChannelsManager.channelsList.elementInPageCount));
                } else {
                    ChannelsManager.channelsList.MoveCurrentElementToDown();
                    ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();
                    ChannelsManager.channelsList.MoveCurrentElementToDown();
                }
            } else if(type == 'ok') {
                if(android_channel_menu.cur_view == 'channel') {
                    source.playLive();
                } else if(android_channel_menu.cur_view == 'rec') {
                    if(ChannelsManager.getCurrentChannel().has_record == 1) {
                        program.show('archive');
                    }
                } else if(android_channel_menu.cur_view == 'category') return false;
            }
        }
        ,goBack: function () {
            android_channel_menu.cur_view = 'channel';
            MainMenu.show();
            ChannelsManager.setCategory(this.channel_cat);
            ChannelsManager.setChannel(this.channel_num);
        }
    }
})();
