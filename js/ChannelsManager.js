var ChannelsManager = (function () {
    return {
        onGetChannelsCallBack: null
        //new
        , containerHigh: 0
        , smallContainerHigh: 0
        , old_index: 0
        , new_index: 0
        , get_channels_timer: 0
        , update_channel_info_timer: 0
        , update_category_info_timer: 0
        , onGetProgramsByDayCallback: null
        , arch_channels_list: []
        , arch_channels_list_time_generated: 0
        , start_epg_time: 0
        , refreshProgramTime: 0
        , init: function (callBack) {
            ChannelsManager.categoriesList = new List();
            ChannelsManager.categoriesList.SetCurrentPageGhangedCallback();
            ChannelsManager.categoriesList.SetCurrentElementGhangedCallback(ChannelsManager.updateCategory);

            ChannelsManager.channelsList = new List();
            ChannelsManager.channelsList.SetCurrentPageGhangedCallback(ChannelsManager.updateChannelList);
            ChannelsManager.channelsList.SetCurrentElementGhangedCallback(ChannelsManager.updateChannel);
            ChannelsManager.refreshProgramTime = 4 * 60 * 60 * 1000;
        }
        , GetChannelsList: function () {
            parent_menu_obj.parent_pass = parseInt(cookie_obj.getData('parent_pass'));

            var url = "query=getChannels";

            if (PlatformManager.getDevice() == PlatformManager.LG) url = "query=getChannelsList&start=full&day=0&number=0&timezone=" + time_obj.tzone + "&timeshift=" + time_obj.tshift;

            DataManager.sendAjax(url, ChannelsManager.onGetChannelsList);
        }
        , onGetChannelsList: function (data) {
            try {
                ChannelsManager.categories = data.data.categories;
                ChannelsManager.fav_categories = data.data.favorites;
                ChannelsManager.favorites_arr = data.data.favorites_arr;

                var ratio_channel = cookie_obj.getData('channels_settings_ratio_array') ? cookie_obj.getData('channels_settings_ratio_array') : '[]';
                if (ratio_channel) {
                    channels_settings_ratio.array = JSON.parse(ratio_channel);
                    ChannelsManager.setRatio(ChannelsManager.categories);
                    ChannelsManager.setRatio(ChannelsManager.favorites_arr);
                }

                if (PlatformManager.getDevice() == PlatformManager.LG) {
                    if (ChannelsManager.onGetChannelsCallBack) {
                        ChannelsManager.onGetChannelsCallBack();
                        ChannelsManager.onGetChannelsCallBack = null;
                    }
                } else if (PlatformManager.getDevice() == PlatformManager.SAMSUNG) {
                    ChannelsManager.getEpgOldDevice();
                } else {
                    ChannelsManager.getEpg();
                }

                clearTimeout(ChannelsManager.get_channels_timer);
                ChannelsManager.get_channels_timer = setTimeout('ChannelsManager.GetChannelsList();', ChannelsManager.refreshProgramTime);

            } catch (e) {
                statusbar.show('error in onGetChannelsList ' + e);
                DataManager.writeLog('error in onGetChannelsList  = ' + e + ' stack = ' + e.stack);
            }
        }
        , tempRefreshProgram: function () {
           // statusbar.show('START GETING CHANNELS LIST');
           // ChannelsManager.GetChannelsList();
        }
        , setRatio: function (categories) {
            for (var i = 0; i < categories.length; i++) {
                for (var y = 0; y < categories[i].channels.length; y++) {
                    categories[i].channels[y].ratio = 0;
                    for (var z = 0; z < channels_settings_ratio.array.length; z++) {
                        if (channels_settings_ratio.array[z].number == categories[i].channels[y].number) {
                            categories[i].channels[y].ratio = channels_settings_ratio.array[z].ratio;
                            break;
                        }
                    }
                }
            }
        }
        , initMainChannelsList: function () {
            try {
                var temp_categories = [];
                ChannelsManager.categories.forEach(function (cat) {
                    temp_categories.push(cat);
                });
                var temp_fav = [];

                for (var ic = 0; ic < ChannelsManager.fav_categories.length; ic++) {
                    var cur_fav_cat = ChannelsManager.fav_categories[ic];
                    if (cur_fav_cat && cur_fav_cat.channels && cur_fav_cat.channels.length && parseInt(cookie_obj.getData('fav_' + cur_fav_cat.number)) == 1) {
                        temp_fav.push(cur_fav_cat);
                    }
                }
                var res = temp_categories.concat(temp_fav);

                if (ChannelsManager.getCurrentChannel() && ChannelsManager.getCurrentChannel().program[program.cur_month_day]) {
                    for (var i = 0; i < res.length; i++) {
                        for (var y = 0; y < res[i].channels.length; y++) {
                            if (res[i].channels[y].number == ChannelsManager.getCurrentChannel().number) {
                                res[i].channels[y].program[program.cur_month_day] = ChannelsManager.getCurrentChannel().program[program.cur_month_day];

                            }
                        }
                    }
                }
                ChannelsManager.main_channels_list = res;

                // temp_categories = null;
                //res = null;
            } catch (e) {
                statusbar.show(e);
                DataManager.writeLog('initMainChannelsList error = ' + e + ' stack = ' + e.stack);
            }
        }
        , setMainChannelsList: function (arr) {
            var channel_id = parseInt(cookie_obj.getData('last_ch'));
            var category_id = parseInt(cookie_obj.getData('last_cat'));

            ChannelsManager.initCategoriesList(arr);

            if (!channel_id || !category_id) {
                channel_id = 0;
                category_id = 0;
            }

            ChannelsManager.setCategory(category_id);
            ChannelsManager.setChannel(channel_id);

            program.initArchiveChannels = 0;

            if (PlatformManager.getDevice() == PlatformManager.LG) {
                DataManager.unblock();
                spin_obj.stop();
                if (PlatformManager.getDevice() != PlatformManager.Android && AuthManager.first_start) {
                    source.playLive();
                    AuthManager.first_start = 0;
                }
                program.initArchChannels();
            }
        }
        , initWithoutFavChannelsList: function () {
            ChannelsManager.categoriesList.Init(ChannelsManager.categories, 20);
        }
        , getCurrentCategory: function () {
            return this.categoriesList.getCurrentElement();
        }
        , setCategory: function (id) {
            ChannelsManager.categoriesList.SetCurrentElementByIndex(id);
        }
        , getCurrentChannel: function () {
            return ChannelsManager.channelsList.getCurrentElement();
        }
        , setChannel: function (id) {
            ChannelsManager.channelsList.SetCurrentElementByIndex(id);
            ChannelsManager.initProgramsList(Main.channels_small_list_per_page);
        }
        , getCurrentPrograms: function () {
            return ChannelsManager.channelsList.getCurrentElement().programs;
        }
        , moveCurrentChannelTo: function (to) {
            ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();
            if (to == 'down') {
                ChannelsManager.channelsList.MoveCurrentElementToDown();
            } else if (to == 'up') {
                ChannelsManager.channelsList.MoveCurrentElementToUp();
            }
        }
        , moveCurrentCatTo: function (to) {
            if (to == 'down') {
                ChannelsManager.categoriesList.MoveCurrentElementToDown();
            } else if (to == 'up') {
                ChannelsManager.categoriesList.MoveCurrentElementToUp();
            }
        }
        , updateChannelList: function () {
            if (state_obj.state == "channels_menu") {
                document.getElementById('channels_container').style.top = ChannelsManager.containerHigh * ChannelsManager.channelsList.GetCurrentPageIndex() + 'px';
            } else if (state_obj.state == "program") {
                if (program.type != 'epg') {
                    document.getElementById('channels_container').style.top = ChannelsManager.smallContainerHigh * ChannelsManager.channelsList.GetCurrentPageIndex() + 'px';
                    ChannelsManager.updateProgramList();
                } else {
                    document.getElementById('channels_container').style.top = ChannelsManager.smallContainerHigh * ChannelsManager.channelsList.GetCurrentPageIndex() + 'px';
                    document.getElementById('epg_container').style.top = ChannelsManager.smallContainerHigh * ChannelsManager.channelsList.GetCurrentPageIndex() + 'px';
                }
            } else if (state_obj.state == "settings" || state_obj.state == "settings_ratio") {
                if (document.getElementById('channels_settings')) {
                    document.getElementById('channels_settings').style.top = -1 * Main.settings_list_height * ChannelsManager.channelsList.GetCurrentPageIndex() + 'px';
                }
            } else if (state_obj.state == "android_channel_menu") {
                document.getElementById('channels_container').style.top = -1 * Main.channel_content_block_height * ChannelsManager.channelsList.GetCurrentPageIndex() + 'px';
            }
        }

        , updateChannel: function () {
            ChannelsManager.new_index = ChannelsManager.channelsList.GetCurrentElementIndex();

            if (ChannelsManager.ifViewHasChannels()) {
                var hover = 0;
                if (state_obj.state == "program" && program.state == 'channel') hover = 1;

                navigation.setActive('channel', ChannelsManager.new_index, ChannelsManager.old_index, hover);
                scrollbar_obj.show(ChannelsManager.new_index, ChannelsManager.channelsList.elementCount, 0);
            }

            if (state_obj.state == "program") {
                if (program.type != 'epg') {
                    document.getElementById('epg_container').innerHTML = '';
                } else {
                    program.epgUpdateProgram();
                }
            }

            clearTimeout(ChannelsManager.update_channel_info_timer);
            ChannelsManager.update_channel_info_timer = setTimeout('ChannelsManager.updateChannelInfo();', ConstValue.cTimeoutGetSource);
        }
        , updateChannelInfo: function () {
            var now_prog;
            if (state_obj.state == "channels_menu") {
                if (!ChannelsManager.getCurrentChannel().programs || !ChannelsManager.getCurrentChannel().programs.length) {
                    ChannelsManager.GetProgramsByDay(channel_menu.getProgramNow);
                } else {
                    channel_menu.getProgramNow();
                }
            } else if (state_obj.state == "program") {
                if (program.type != 'epg') {
                    if (!ChannelsManager.getCurrentChannel().programs || !ChannelsManager.getCurrentChannel().programs.length || ChannelsManager.getCurrentChannel().programs.length < 10) {
                        ChannelsManager.GetProgramsByDay(ChannelsManager.updateProgramsView);
                    } else {
                        ChannelsManager.updateProgramsView();
                    }
                }
            }
        }
        , updateCategory: function () {
            if (state_obj.state == "channels_menu")
                ChannelsManager.initChannelsList(Main.ChannelsManager_per_page);
            else if (state_obj.state == "settings" || state_obj.state == "settings_ratio")
                ChannelsManager.initChannelsList(Main.settings_list_per_page);
            else if (state_obj.state == "android_channel_menu") {
                ChannelsManager.initChannelsList(Main.android_channel_menu_items);
            }

            else
                ChannelsManager.initChannelsList(Main.channels_small_list_per_page);

            if (ChannelsManager.ifViewHasChannels()) {
                menu_cont.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
                menu_cont.createCategory();

                clearTimeout(ChannelsManager.update_category_info_timer);
                ChannelsManager.update_category_info_timer = setTimeout('ChannelsManager.updateCategoryInfo();', ConstValue.cTimeoutGetSource);
            }
        }
        , updateCategoryInfo: function () {
            if (state_obj.state == "channels_menu") {
                channel_menu.createContent();
            } else if (state_obj.state == "program") {
                program.buildChannelsWraper();
                document.getElementById('epg_container').innerHTML = '';
                if (program.type != 'epg') {

                } else {
                    program.createEpgContent();
                }
            } else if (state_obj.state == "settings") {
                channels_settings.createContent();
            } else if (state_obj.state == "settings_ratio") {
                channels_settings_ratio.createContent();
            } else if (state_obj.state == "android_channel_menu") {
                android_channel_menu.createContent();
            }

            if (ChannelsManager.ifViewHasChannels()) {
                ChannelsManager.old_index = 0;
                ChannelsManager.new_index = 0;
                ChannelsManager.updateChannelList();
                ChannelsManager.updateChannel();
            }
        }
        , updateProgram: function () {

        }
        , updateProgramList: function () {
            if (state_obj.state == "program") {
                if (program.type != 'epg') {
                    document.getElementById('epg_container').style.top = ChannelsManager.smallContainerHigh * program.programsList.GetCurrentPageIndex() + 'px';
                }
            }
        }
        , initCategoriesList: function (data) {
            ChannelsManager.categoriesList.Init(data, 20);
            ChannelsManager.initChannelsList(Main.channels_small_list_per_page);
        }
        , initChannelsList: function (items_per_page) {
            ChannelsManager.channelsList.Init(ChannelsManager.getCurrentCategory().channels, items_per_page);
            ChannelsManager.initProgramsList(Main.channels_small_list_per_page);
        }
        , initProgramsList: function (items_per_page) {
            if (settings.state == 'channels_settings' || state_obj.state == "settings_ratio") return false;

            if (!ChannelsManager.getCurrentChannel()) return false;

            var ch_programs = ChannelsManager.getCurrentChannel().programs;
            if (!ch_programs) ch_programs = [];

            if (program.day != 0 && ChannelsManager.getCurrentChannel().program[program.cur_month_day]) {
                ch_programs = ChannelsManager.getCurrentChannel().program[program.cur_month_day];
            }

            if (PlatformManager.isOldSamsung() && ch_programs.length > 0 && !program.day && state_obj.state == 'program' && program.type == 'archive') {
                ch_programs = [];
                ChannelsManager.getCurrentChannel().programs.forEach(function (prog) {
                    if ((time_obj.unix_time >= parseInt(prog.ut_start)) && parseInt(ChannelsManager.getCurrentChannel().rec_duration) >= (time_obj.unix_time - parseInt(prog.ut_start))) {
                        ch_programs.push(prog);
                    }
                });
            }

            program.programsList.Init(ch_programs, items_per_page);
        }
        , ifViewHasChannels: function () {
            if ((state_obj.state == "android_channel_menu") || (state_obj.state == "channels_menu") || (state_obj.state == "program") || (state_obj.state == "settings_ratio") ||
                (state_obj.state == "settings" && settings.state == 'channels_settings')
            ) {
                return true;
            }
            return false;
        }
        , saveLastChannel: function () {
            cookie_obj.setData('last_ch', ChannelsManager.channelsList.GetCurrentElementIndex());
            cookie_obj.setData('last_cat', ChannelsManager.categoriesList.GetCurrentElementIndex());
        }
        , GetCurrentChannelNumber: function () {
            return this.getCurrentChannel().number;
        }
        , GetCurrentCategoryNumber: function () {
            return this.getCurrentCategory().number;
        }
        , setCategoryByNumber: function (number) {
            var cur_id = '';
            ChannelsManager.categoriesList.elements.forEach(function (category, i) {
                if (category.number == number) cur_id = i;
            });
            if (cur_id != '') {
                ChannelsManager.setCategory(cur_id);
            }
        }
        , setChannelByNumber: function (number) {
            var cur_id = '';
            ChannelsManager.channelsList.elements.forEach(function (channel, i) {
                if (channel.number == number) cur_id = i;
            });
            if (cur_id != '') {
                ChannelsManager.setChannel(cur_id);
            }
        }
        , getChannelByNumber: function (number) {
            var channel_temp = null;
            ChannelsManager.channelsList.elements.forEach(function (channel, i) {
                if (channel.number == number) channel_temp = channel;
            });

            return channel_temp;
        }
        , GetProgramsByDay: function (callback, channel) {
            spin_obj.start();

            var ch_obj = null;

            if (channel) ch_obj = channel;
            else ch_obj = ChannelsManager.getCurrentChannel();

            if (callback) ChannelsManager.onGetProgramsByDayCallback = callback;

            var url = "query=getPrograms&start=full&day=" + program.day + "&number=" + ch_obj.number + "&timezone=" + time_obj.tzone + "&timeshift=" + time_obj.tshift;

            DataManager.sendAjax(url, ChannelsManager.onGetProgramsByDay);
        }
        , onGetProgramsByDay: function (data) {
            spin_obj.stop();

            if(data.data.programmes && data.data.programmes.length) {
                ChannelsManager.getCurrentChannel().program[program.cur_month_day] = data.data.programmes;


                for (var i = 0; i < ChannelsManager.categories.length; i++) {
                    for (var y = 0; y < ChannelsManager.categories[i].channels.length; y++) {
                        if (ChannelsManager.categories[i].channels[y].number == ChannelsManager.getCurrentChannel().number) {
                            if (program.day == 0) {
                                ChannelsManager.categories[i].channels[y].programs = data.data.programmes;
                                ChannelsManager.getCurrentChannel().programs = data.data.programmes;
                            } else {
                                ChannelsManager.categories[i].channels[y].program[program.cur_month_day] = data.data.programmes;
                            }
                            break;
                        }
                    }
                }

                ChannelsManager.initProgramsList(Main.channels_small_list_per_page);
            }
            if (ChannelsManager.onGetProgramsByDayCallback) {
                ChannelsManager.onGetProgramsByDayCallback();
                ChannelsManager.onGetProgramsByDayCallback = null;
            }
        }
        , setFavCategory: function (num) {
            if (cookie_obj.getData('fav_' + num) == 1) {
                for (var i = 0; i < ChannelsManager.categoriesList.elements.length; i++) {
                    if (ChannelsManager.categoriesList.elements[i].number == num) {
                        if (ChannelsManager.categoriesList.getCurrentElement().number == num) {
                            if (state_obj.state == 'live_player') {
                                channel_menu.show();
                            }
                        } else {
                            if (state_obj.state == 'live_player') {
                                channel_menu.show();
                                menu_cont.setContentId('channels_container', '');
                            }
                            ChannelsManager.categoriesList.SetCurrentElementByIndex(i);

                        }

                        return true;
                    }

                }
            }
            return false;
        }
        , pushProgramms: function (data) {
            ChannelsManager.start_epg_time++;
            if (data) {
                ChannelsManager.fillChannels(data);
            }
            if (ChannelsManager.start_epg_time < 3) {
                ChannelsManager.getEpg();
            } else {
                if (ChannelsManager.onGetChannelsCallBack) {
                    ChannelsManager.onGetChannelsCallBack();
                    ChannelsManager.onGetChannelsCallBack = null;
                }
                ChannelsManager.start_epg_time = 0;
                if (state_obj.state != 'blocked') {
                    ChannelsManager.initMainChannelsList();
                    ChannelsManager.setMainChannelsList(ChannelsManager.main_channels_list);
                }
            }
        }
        , getEpg: function () {
            var url = "query=getPrograms&start=" + ChannelsManager.start_epg_time + "&day=0&number=0&timezone=" + time_obj.tzone + "&timeshift=" + time_obj.tshift;
            DataManager.sendAjax(url, ChannelsManager.pushProgramms);
        }
        /**
         *  Get EPG  for 4 hours
         *  update every 4 hours
         *
         */
        , getEpgOldDevice: function () {
            var url = "query=getProgramsOldDevice&start=" + time_obj.unix_time;
            ChannelsManager.start_epg_time = 2;
            DataManager.sendAjax(url, ChannelsManager.pushProgramms);
        }
        , updateProgramsView: function () {
            var now_prog;
            ChannelsManager.initProgramsList(Main.channels_small_list_per_page);

            if (source.current_playing_channel_number == ChannelsManager.GetCurrentChannelNumber()) {
                now_prog = program.getNowProgram(ChannelsManager.getCurrentChannel(), time_obj.timeshifted_unix_time);
            } else {
                now_prog = program.getNowProgram(ChannelsManager.getCurrentChannel(), time_obj.unix_time);
            }
            if (now_prog && now_prog.id)
                program.programsList.SetCurrentElementByIndex(now_prog.id);

            program.getPrograms();
        }
        , fillChannels: function (epgs) {

            ChannelsManager.categories.forEach(function (cat) {
                cat.channels.forEach(function (channel) {
                    for (var i = 0; i < epgs.data.length; i++) {
                        var check_flag = 1;
                        if (epgs.data[i].number == channel.number) {
                            channel.programs = channel.programs.concat(epgs.data[i].programmes);
                            break;
                        }
                    }
                });
            });

            ChannelsManager.fav_categories.forEach(function (cat) {
                cat.channels.forEach(function (channel) {
                    for (var i = 0; i < epgs.data.length; i++) {
                        var check_flag = 1;
                        if (epgs.data[i].number == channel.number) {
                            epgs.data[i].programmes.forEach(function (epg) {
                                if (check_flag && channel.programs && channel.programs.length && epg.pid == channel.programs[channel.programs.length - 1].pid) {
                                    check_flag = 0;
                                } else {
                                    channel.programs.push(epg);
                                }
                            });
                            break;
                        }
                    }
                });
            });
        }
    }
})();

/*
 * Хранит текущий канал
 * осуществляет переключение каналов вперед назад
 */
var ch_obj = (function () {
    return {
        cur_channel: 0 //ключ канала ChannelsManager.channels_obj_cat
        , cur_category: 0 //ключ категории ChannelsManager.channels_obj_cat
        , ch_num: 0
        , cat_num: 0
        , timer: 0
        , go: function (to) {

            menu_cont.hideLegend();


            if (to == 'next') {
                ChannelsManager.moveCurrentChannelTo('down');
            } else if (to == 'prev') {
                ChannelsManager.moveCurrentChannelTo('up');
            }
            arch_player.loadChannelInfo();

            arch_player.show('player');

            source.onGetUrlCallBack = arch_player.init;
            clearTimeout(ch_obj.timer);
            ch_obj.timer = setTimeout('source.playLive();', ConstValue.cTimeoutGetSource);
        }
    }
})();  