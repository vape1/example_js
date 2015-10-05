//menu container
var settings = (function () {
    return {
        state: ''
        , sub_menu: ''
        , content: ''
        , help: ''
        , settings: {}
        , cur_val: 0
        , bit_rate: ''
        , list_item_name: 'chose_settings'
        , old_active: 0
        , navigate_type: ''
        ,init: function() {
            settings.mainSettingsList = new List();
            settings.mainSettingsList.SetCurrentPageGhangedCallback(settings.updateMainSettingsListPage);
            settings.mainSettingsList.SetCurrentElementGhangedCallback(settings.updateMainSettingsListElement);

            settings.subSettingsList = new List();
            settings.subSettingsList.SetCurrentPageGhangedCallback(settings.updateSubSettingsListPage);
            settings.subSettingsList.SetCurrentElementGhangedCallback(settings.updateSubSettingsListElement);
        }
        , show: function (type) {
            if (!type) {
                type = MainMenu.menuListItem.getCurrentElement().name;
            }
            state_obj.state = "settings";
            settings.state = type;
            settings.cur_val = 0;
            var url = "";
            switch (settings.state) {
                case 'abonement':
                    settings.sub_menu = TextConfig.common.abonement;
                    url = "query=getClientInfo";
                    DataManager.sendAjax(url, settings.createContent);
                    break;
                case 'parent_pass':
                    settings.sub_menu = TextConfig.settings.parent_pass;
                    parent_menu_obj.load();
                    break;
                case 'channels_settings':
                    settings.sub_menu = TextConfig.settings.channels_list;
                    channels_settings.show();
                    break;
            }
        }
        , createContent: function (data) {
            switch (settings.state) {
                case 'abonement':
                    settings.content =
                        '<div >' +
                        '<div class="chose_settings"><div class="title_text">' + TextConfig.common.abonement + ':</div><div class="title_text">' + data.data.tariffs[0].title + '</div></div>' +
                        '<div class="chose_settings"><div class="title_text">' + TextConfig.common.login + ':</div><div class="title_text">' + data.data.login + '</div></div>' +
                        '<div class="chose_settings"><div class="title_text">' + TextConfig.settings.act_to + ':</div><div class="title_text">' + data.data.dateTo + '</div></div>' +
                        '<div class="chose_settings"><div class="title_text">' + TextConfig.settings.balance + ':</div><div class="title_text">' + data.data.balance + '</div></div>' +
                        '<div class="chose_settings"><div class="title_text">' + TextConfig.common.version + ':</div><div class="title_text">' + PlatformManager.version + '</div></div>' +
                        '</div>' +
                        '<div class="radius_10 grey relogin active" onclick="DataManager.logout();"><div class="list_item_text">' + TextConfig.settings.login_other + '</div></div>';
                    break;
            }
            settings.fillTemplate();
        }
        , fillTemplate: function () {
            menu_cont.buildTemplate('settings');
            menu_cont.setContentClass("line", '<div class="settings_cat font_120">' + this.sub_menu + '</div>');
            menu_cont.setContentClass("content", '<div class="settings_container">' + this.content + '</div>');
        }
        , getSettings: function (callback) {
            var url = "query=getSettings"; 
            DataManager.sendAjax(url, settings.onGetSettings);
            settings.onGetSettingsCallback = callback;
        }
        , onGetSettings: function (data) {
            settings.bitrates = data.data.bitrates;
            settings.bitrate_active = data.data.bitrate_active;
            settings.etalon_bitrate_active = data.data.bitrate_active;

            settings.datacenters = data.data.datacenters;
            settings.datacenter_active = data.data.datacenter_active;
            settings.etalon_datacenter_active = data.data.datacenter_active;

            settings.timeshifts = data.data.timeshifts;
            settings.timeshift_active = parseInt(data.data.timeshift_active);
            settings.timeshift_active_shift = parseInt(settings.timeshifts[settings.timeshift_active]);
            settings.etalon_timeshift_active = parseInt(data.data.timeshift_active);

            settings.timezones = data.data.timezones;
            settings.timezone_active_city = data.data.timezone_active_city;
            settings.timezone_active_region = data.data.timezone_active_region;
            settings.etalon_timezone_active_city = data.data.timezone_active_city;
            settings.etalon_timezone_active_region = data.data.timezone_active_region;

            settings.player_type = player.player_type;
            settings.autoreconnect = player.autoreconnect;
            settings.buffer = player.buffer;

            var active_cities = settings.getActiveCities();

            settings.settings_server = [
                {
                    name: TextConfig.settings.settings_server
                    , type: 'arrow'
                    , values: settings.datacenters
                    , id: 'datacenter_active'
                }
                , {
                    name: TextConfig.settings.bit_rate
                    , type: 'arrow'
                    , values: settings.bitrates
                    , id: 'bitrate_active'
                }
                , {
                    name: TextConfig.settings.time_shift
                    , type: 'arrow'
                    , values: settings.timeshifts
                    , id: 'timeshift_active'
                }
                , {
                    name: TextConfig.settings.time_zone_region
                    , type: 'arrow'
                    , values: settings.timezones
                    , id: 'timezone_active_region'
                }
                , {
                    name: TextConfig.settings.time_zone_city
                    , type: 'arrow'
                    , values: active_cities
                    , id: 'timezone_active_city'
                }
                , {
                    name: TextConfig.common.save
                    , type: 'save'
                    , values: []
                    , onclick: 'settings.save'
                    , ok: settings.save
                    , id: ''
                }
            ];

            if(PlatformManager.getDevice() == PlatformManager.Dune) {
                settings.settings_server.splice(5,0,{
                     name: TextConfig.common.buffer
                    , type: 'arrow'
                    , values: TextConfig.player_buffer_size_dune
                    , id: 'buffer'
                });
            }

            settings.settings_playing = [
                {
                    name: TextConfig.settings.player
                    , type: 'arrow'
                    , values: [{'title': 'Встроенный'}, {'title': 'Внешний'}]
                    , id: 'player_type'
                }
                , {
                    name: TextConfig.settings.autoreconnect
                    , type: 'arrow'
                    , values: [{'title': 'Нет'}, {'title': 'Да'}]
                    , id: 'autoreconnect'
                }
                , {
                    name: TextConfig.settings.ratio
                    , type: 'button'
                    , values: []
                    , onclick: 'channels_settings_ratio.show'
                    , ok: channels_settings_ratio.show
                    , id: ''
                }
                , {
                    name: TextConfig.common.save
                    , type: 'save'
                    , values: []
                    , onclick: 'settings.save'
                    , ok: settings.save
                    , id: ''
                }
            ];

            if (settings.onGetSettingsCallback) {
                settings.onGetSettingsCallback();
                settings.onGetSettingsCallback = null;
            }
        }
        , updateMainSettingsListPage: function () {
        }
        ,getActiveCities: function () {
            var cities = [];
            if(settings.timezones && settings.timezone_active_region && settings.timezones[settings.timezone_active_region]) {
                cities = settings.timezones[settings.timezone_active_region].cities
            }
            return cities;
        }
        , updateMainSettingsListElement: function () {

            navigation.setActive(settings.list_item_name, settings.mainSettingsList.GetCurrentElementIndex(), settings.old_active);

            if (settings.mainSettingsList.getCurrentElement().type == 'arrow') {
                settings.subSettingsList.Init(settings.mainSettingsList.getCurrentElement().values, 100);
                settings.subSettingsList.SetCurrentElementByIndex(settings[settings.mainSettingsList.getCurrentElement().id]);
            }
        }
        , updateSubSettingsListPage: function () {
        }
        , updateSubSettingsListElement: function () {

            if (settings.mainSettingsList.getCurrentElement().type == 'arrow') {
                var settings_value_element = document.getElementById('settings_value_' + settings.mainSettingsList.GetCurrentElementIndex());
                if (settings_value_element) {
                    settings_value_element.innerHTML = settings.subSettingsList.getCurrentElement().title;

                    settings[settings.mainSettingsList.getCurrentElement().id] = settings.subSettingsList.GetCurrentElementIndex();

                }

                //kostyl
                if (settings.mainSettingsList.getCurrentElement().id == 'timezone_active_region') {
                    if (settings.navigate_type == 'left' || settings.navigate_type == 'right') {
                        settings.timezone_active_city = 0;
                    }
                    settings.mainSettingsList.elements[4].values = settings.timezones[settings.timezone_active_region].cities;
                    document.getElementById('settings_value_4').innerHTML = settings.mainSettingsList.elements[4].values[settings.timezone_active_city].title;
                }

                settings.checkAutoReconnect();

            }
        }
        , GetTimeShift: function () {
            return settings.timeshift_active_shift;
        }
        , GetBitRate: function () {
            return settings.bitrates[settings.bitrate_active];
        }
        , showSettings: function (type_settings) {
            var s_title = '';
            try {
                settings.content = '';
                if (!type_settings) {
                    type_settings = MainMenu.menuListItem.getCurrentElement().name;
                }

                settings.state = type_settings;

                settings.mainSettingsList.Init(settings[type_settings], 100);

                settings.subSettingsList.Init(settings.mainSettingsList.getCurrentElement().values, 100);


                settings.sub_menu = TextConfig.settings[type_settings];

                settings[type_settings].forEach(function (data, i) {

                    settings.content += '<div id="chose_settings_' + i + '" class="chose_settings">';

                    if (data.type != 'save') {
                        var title_text_button = '';
                        if (data.type == 'button') {
                            title_text_button = 'title_text_button';
                        }
                        settings.content += '<div class="title_text ' + title_text_button + '" >' + data.name + ':</div>';
                    }

                    if (data.type == 'arrow') {
                        s_title = (settings[data.id] !== undefined && data.values[settings[data.id]]) ? data.values[settings[data.id]].title : '';

                        settings.content += '<div class="left_arrow" onclick=settings.move("left",' + i + ')></div>' +
                        '<div id="settings_value_' + i + '" class="settings_value">' + s_title + '</div>' +
                        '<div class="right_arrow" onclick=settings.move("right",' + i + ')></div>';

                    } else if (data.type == 'button') {

                        settings.content += '<div  onclick="' + data.onclick + '();" class="submit grey">' + TextConfig.common.change + '</div>';

                    } else if (data.type == 'save') {
                        settings.content += '<div onclick="' + data.onclick + '();" class="submit grey">' + data.name + '</div>';
                    }
                    settings.content += '</div>';
                });

                settings.fillTemplate();

                settings.updateMainSettingsListElement();
                settings.checkAutoReconnect();
            } catch(e) {
                statusbar.show('settings.showSettings error = ' + e); 
                DataManager.writeLog('settings.showSettings error = ' + e+' stack = '+ e.stack);
            }
        }
        ,checkAutoReconnect: function () {
            if (settings.state != 'settings_plaing')  return;

            if (settings.player_type != PlatformManager.integratedVideo) {
                document.getElementById('settings_value_1').style.color = 'grey';
                settings.autoreconnect = 0;
                document.getElementById('settings_value_1').innerHTML = 'Нет';
            } else {
                document.getElementById('settings_value_1').style.color = 'white';
            }
        }
        , navigate: function (type) {
            settings.navigate_type = type;
            settings.old_active = settings.mainSettingsList.GetCurrentElementIndex();
            if (type == 'down') {
                settings.mainSettingsList.MoveCurrentElementToDown();
            }
            else if (type == 'up') {
                settings.mainSettingsList.MoveCurrentElementToUp();
            }
            else if (type == 'ok') {
                if (settings.mainSettingsList.getCurrentElement().ok) {
                    settings.mainSettingsList.getCurrentElement().ok();
                }
            }
            else if (type == 'right') {
                if(settings.mainSettingsList.getCurrentElement().id == 'autoreconnect' && settings.player_type != PlatformManager.integratedVideo) return false;

                settings.subSettingsList.MoveCurrentElementToDown();
            }
            else if (type == 'left') {
                if(settings.mainSettingsList.getCurrentElement().id == 'autoreconnect' && settings.player_type != PlatformManager.integratedVideo) return false;

                settings.subSettingsList.MoveCurrentElementToUp();
            }
            return false;
        }
        , move: function (to, id) {
            settings.old_active = settings.mainSettingsList.GetCurrentElementIndex();
            settings.mainSettingsList.SetCurrentElementByIndex(id);

            if (to == 'left') {
                settings.subSettingsList.MoveCurrentElementToUp();
            } else if (to == 'right') {
                settings.subSettingsList.MoveCurrentElementToDown();
            }
        }
        , save: function () {
            if (settings.state == 'settings_server') {
                var bitrate_number = settings.bitrates[settings.bitrate_active].number;
                var dc_number = settings.datacenters[settings.datacenter_active].number;
                var tzone_number = settings.timezones[settings.timezone_active_region].cities[settings.timezone_active_city].number;
                var tshift_number = settings.timeshifts[settings.timeshift_active].number;

                var url = 'query=setSettings&key=bitrate|dc|tzone|tshift&value=' + bitrate_number + '|' + dc_number + '|' + tzone_number + '|' + tshift_number;

                DataManager.sendAjax(url, function () {
                    if(settings.etalon_timeshift_active != settings.timeshift_active || settings.etalon_bitrate_active != settings.bitrate_active || settings.etalon_datacenter_active != settings.datacenter_active) {
                        if(player.player_type == PlatformManager.integratedVideo) {
                            state_obj.state = "blocked";
                            DataManager.block();
                            spin_obj.start();
                            source.reload(settings.onSaveSettings);
                        } else {
                            settings.onSaveSettings();
                        }
                    }

                    if(settings.etalon_timeshift_active != settings.timeshift_active || settings.etalon_timezone_active_city != settings.timezone_active_city || settings.etalon_timezone_active_region != settings.timezone_active_region) {
                        state_obj.state = "blocked";
                        DataManager.block();
                        spin_obj.start();
                        AuthManager.onGetTimeCallBack = ChannelsManager.GetChannelsList;
                        ChannelsManager.onGetChannelsCallBack = settings.onSaveSettings;
                        AuthManager.getTime();
                    }

                    settings.etalon_bitrate_active = settings.bitrate_active;

                    settings.etalon_datacenter_active = settings.datacenter_active;

                    settings.etalon_timeshift_active = settings.timeshift_active;
                    settings.timeshift_active_shift = parseInt(settings.timeshifts[settings.timeshift_active]);

                    settings.etalon_timezone_active_city = settings.timezone_active_city;
                    settings.etalon_timezone_active_region = settings.timezone_active_region;

                    if(PlatformManager.getDevice() == PlatformManager.Dune) {
                        if(settings.buffer != player.buffer) {
                            player.buffer = settings.buffer;
                            cookie_obj.setData('buffer', settings.buffer);
                            source.reload();
                        }
                    }
                });

            } else if (settings.state == 'settings_playing') {
                if(settings.player_type != player.player_type) {
                    player.setPlayer(settings.player_type);
                }
                player.autoreconnect = settings.autoreconnect;
                cookie_obj.setData('autoreconnect', settings.autoreconnect);

                statusbar.show(TextConfig.settings.settings_saved);
            }
        }
        ,onSaveSettings: function () {
            settings.showSettings('settings_server');
            statusbar.show(TextConfig.settings.settings_saved);
            DataManager.unblock();
            spin_obj.stop();
        }
        , goBack: function () {
            if (settings.state == 'settings_server') {
                settings.bitrate_active = settings.etalon_bitrate_active;

                settings.datacenter_active = settings.etalon_datacenter_active;

                settings.timeshift_active = settings.etalon_timeshift_active;

                settings.timezone_active_city = settings.etalon_timezone_active_city;
                settings.timezone_active_region = settings.etalon_timezone_active_region;

                if(PlatformManager.getDevice() == PlatformManager.Dune) {
                    settings.buffer = player.buffer;
                }

            } else if (settings.state == 'settings_playing') {
                settings.player_type = player.player_type;
                settings.autoreconnect = player.autoreconnect;
            }

            MainMenu.show();

        }
        , update:  function () {
            //navigator.app.exitApp();
            //window.location.href = 'http://devportal.intectradeinc.com/smarttv/dev.apk';
            //window.location.replace('http://devportal.intectradeinc.com/smarttv/dev.apk');
        }
    }
})();

var channels_settings = (function () {
    return {
        //локальные значения канала и категории для списка всех каналов
        channel_cat: 0
        , channel_num: 0
        , setting_channel_list: 0
        , view_obj: []
        //категория пользовательского  списка каналов
        , fav_cat: 0
        , fav_key: 0
        , sub_menu: ''
        , list_item_name: 'channel'
        , init: function () {
            this.view_obj = [
                {
                    title: 'Красный'
                    , onclick: 'channels_settings.toggle_cookie(1);'
                    , value: ''
                    , ok: channels_settings.toggle_cookie
                    , number: 1
                    , class_name: 'red'
                }
                , {
                    title: 'Зеленый'
                    , onclick: "channels_settings.toggle_cookie(2);"
                    , value: ''
                    , ok: channels_settings.toggle_cookie
                    , number: 2
                    , class_name: 'green'
                }
                , {
                    title: 'Желтый'
                    , onclick: "channels_settings.toggle_cookie(3);"
                    , value: ''
                    , ok: channels_settings.toggle_cookie
                    , number: 3
                    , class_name: 'yellow'
                }
               ,{
                    title: 'Редактировать Красный'
                    , onclick: 'channels_settings.edit(1);'
                    , ok: channels_settings.edit
                    , value: ' '
                    , number: 1
                    , class_name: 'red'
                }
                ,{
                    title: 'Редактировать Зеленый'
                    , onclick: 'channels_settings.edit(2);'
                    , ok: channels_settings.edit
                    , value: ' '
                    , number: 2
                    , class_name: 'green'
                }
                ,{
                    title: 'Редактировать Желтый'
                    , onclick: 'channels_settings.edit(3);'
                    , ok: channels_settings.edit
                    , value: ' '
                    , number: 3
                    , class_name: 'yellow'
                }

            ];
        }
        , show: function () {
            channels_settings.edit_view = 0;
            html_str = '';

            for (var i = 0; i < this.view_obj.length; i++) {
                var value = this.view_obj[i].value;
                var obj = this.view_obj[i];

                //Тригеры отображения/скрытия пользовательских списков
                if (obj.value == '') {
                    if (cookie_obj.getData('fav_' + obj.number) == 1) {
                        value = TextConfig.common.show;
                    } else {
                        value = TextConfig.common.not_show;
                    }
                }
                html_str += '<div id="channel_menu_' + i + '"  class="listitem btn grey" onclick="' + this.view_obj[i].onclick + '"><div class="list_item_text">' +
                '<div class="left">' + this.view_obj[i].title + '</div><div class="record">' + value + '</div></div>';
                html_str += '</div>';
            }
            settings.content = html_str;

            settings.fillTemplate();

            navigation.setActive('channel_menu', channels_settings.setting_channel_list, 0);
        }
        /**
         * Объект настроек(меню) пользовательских списков
         *
         */
        , edit: function (id) {
            if (id) {
                this.fav_cat = id;
            } else {
                channels_settings.fav_cat = channels_settings.view_obj[channels_settings.setting_channel_list].number;
            }

            channels_settings.edit_view = 1;

            this.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            this.channel_num = ChannelsManager.channelsList.GetCurrentElementIndex();

            ChannelsManager.initWithoutFavChannelsList();
            ChannelsManager.setCategory(0);
            ChannelsManager.setChannel(0);
            ChannelsManager.initChannelsList(Main.settings_list_per_page);

            menu_cont.buildTemplate('channels_settings');

            scrollbar_obj.init(0, 'settings_channel');
            channels_settings.createContent();
            state_obj.state = "settings";
            menu_cont.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            menu_cont.createCategory();
        }
        , createContent: function () {
            channels_settings.fillTemplate();
            ChannelsManager.updateChannel();
        }
        //Заполнеем шаблон для редактирования пользовательских каналов
        , fillTemplate: function () {
            //список каналов Контент
            settings.content = '';

            for (var i = 0; i < ChannelsManager.channelsList.elementCount; i++) {

                var channel = ChannelsManager.channelsList.elements[i];

                settings.content += '<div id="' + this.list_item_name + '_' + i + '" class="setttings_channels_listitem grey radius_10"><div class="list_item_text">' + channel.title + '</div>';

                //отмечаем звездочками выбранные каналы
                for (var y = 0; y < ChannelsManager.favorites_arr.length; y++) {
                    var active = '';
                    if (in_array(channel.number, ChannelsManager.favorites_arr[y].channels)) {
                        active = 'active';
                    }

                    settings.content += '<div class="star ' + active + ' star_fav_' + ChannelsManager.favorites_arr[y].number + '" ' +

                    'onclick="channels_settings.addToFav(' + ChannelsManager.favorites_arr[y].number + ',' + channel.number + ',this);"></div>';
                }

                settings.content += '</div>';
            }
            menu_cont.setContentId("channels_settings", settings.content);
            var help = '<div class="help_item">' +
            '<div onclick=channels_settings.goBack();><img src="images/return_small.png"></div>' +
            '<div class="help_title">' + TextConfig.common.back + '</div>' +
            '</div>';
            menu_cont.setContentClass("help_content", help);
            navigation.setActive('channel', ChannelsManager.channelsList.GetCurrentElementIndex(), 0);
            scrollbar_obj.show(0, ChannelsManager.channelsList.elementCount, 0);

        }
        , addToFav: function (fav_cat, ch_number, element) {
            var url = "query=setFavoriteChannel&number=" + fav_cat + "&num_channel=" + ch_number;
            var text = '';
            if (hasClass(element, "active")) {
                removeClass(element, "active");
                url += "&place=|place&place_val=|0";
                text = TextConfig.settings.fav_remove;
            } else {
                addClass(element, "active");
                url += "&place=&place_val=";
                text = TextConfig.settings.fav_add;
            }

            var channel = ChannelsManager.getChannelByNumber(ch_number);

            if(text == TextConfig.settings.fav_add) {
                ChannelsManager.fav_categories.forEach(function(cat,i){
                    if(cat.number == fav_cat) {
                        cat.channels.push(channel);

                        ChannelsManager.favorites_arr.forEach(function(fav_arr,j){
                            if(fav_arr.number == fav_cat) {
                                fav_arr.channels.push(ch_number);
                            }
                        });
                    }

                });
            } else {
                ChannelsManager.fav_categories.forEach(function(cat,i){
                    if(cat.number == fav_cat) {
                        cat.channels.forEach(function(chan,j){
                            if(chan.number == ch_number) {
                                cat.channels.splice(j,1);
                            }
                        });

                        ChannelsManager.favorites_arr.forEach(function(fav_arr,j){
                            if(fav_arr.number == fav_cat) {
                                fav_arr.channels.forEach(function(chan,j){
                                    fav_arr.channels.splice(j,1);
                                });
                            }
                        });
                    }
                });
            }

            DataManager.sendAjax(url, function (data) {
                statusbar.show(text, 1);
            });
        }
        , pressButton: function (number_fav_cat) {
            var channel = ChannelsManager.getCurrentChannel();

            var star = document.getElementById(this.list_item_name + '_' + this.channel_num).getElementsByClassName('star_fav_' + number_fav_cat)[0];

            channels_settings.addToFav(number_fav_cat, channel.number, star);
        }
        , goBack: function () {
            if (channels_settings.edit_view == 1) {
                ChannelsManager.setCategory(this.channel_cat);
                ChannelsManager.setChannel(this.channel_num);
                channels_settings.showChannelsSettings();
            } else {
                ChannelsManager.initMainChannelsList();
                ChannelsManager.setMainChannelsList(ChannelsManager.main_channels_list);
                MainMenu.show();
            }
        }
        , showChannelsSettings: function () {
            channels_settings.edit_view = 0;
            settings.show('channels_settings');
            spin_obj.stop();
        }
        /**
         *
         * Навигация главного вида настроек ползовательских списков каналов
         *
         */
        , setSetChList: function (number) {
            var view_obj_length = channels_settings.view_obj.length - 1;
            //if first then last
            if (number < 0) {
                channels_settings.setting_channel_list = view_obj_length;
            }
            //if last then first
            else if (number > view_obj_length) {
                channels_settings.setting_channel_list = 0;
            }
        }
        , navigateChList: function (type) {
            var old_active = this.setting_channel_list;

            if (type == 'down') {
                channels_settings.setSetChList(++channels_settings.setting_channel_list);
            }
            else if (type == 'up') {
                channels_settings.setSetChList(--channels_settings.setting_channel_list);
            }
            else if (type == 'ok') {
                channels_settings.view_obj[channels_settings.setting_channel_list].ok();
            }

            navigation.setActive('channel_menu', channels_settings.setting_channel_list, old_active);
        }
        /**
         * Пишем в куки и перезагружаем списки доступных каналов
         */
        , toggle_cookie: function (num) {
            if (!num) {
                num = channels_settings.view_obj[channels_settings.setting_channel_list].number;
            }

            if (cookie_obj.getData('fav_' + num) == 1) {
                cookie_obj.setData('fav_' + num, 0);
            } else {
                cookie_obj.setData('fav_' + num, 1);
            }
            channels_settings.show();
        }
        /**
         *
         * Навигация в меню добавления каналов
         *
         */
        , navigate: function (type) {
            if (type == 'down') {
                ChannelsManager.moveCurrentChannelTo('down');
            } else if (type == 'up') {
                ChannelsManager.moveCurrentChannelTo('up');
            } else if (type == 'page_down') {
                ChannelsManager.channelsList.SetNextPage();
            } else if (type == 'page_up') {
                ChannelsManager.channelsList.SetPrevPage();
            } else if (type == 'ok') {

                var star = document.getElementById(channels_settings.list_item_name + '_' + ChannelsManager.channelsList.GetCurrentElementIndex()).getElementsByClassName('star_fav_' + channels_settings.fav_cat)[0];
                channels_settings.addToFav(channels_settings.fav_cat, ChannelsManager.channelsList.getCurrentElement().number, star);

            } else if (type == 'left') {
                ChannelsManager.moveCurrentCatTo('up');
            } else if (type == 'right') {
                ChannelsManager.moveCurrentCatTo('down');
            }
        }
    }
})();
/**
 *
 *
 *
 */
var channels_settings_ratio = (function () {
    return {
        array: []
        , list_item_name: 'channel'
        , channel_cat: 0
        , channel_num: 0
        , init: function () {
            channels_settings_ratio.ratioList = new List();
            channels_settings_ratio.ratioList.Init(TextConfig.ratio, 10);
            channels_settings_ratio.ratioList.SetCurrentElementGhangedCallback(channels_settings_ratio.updateRatio);
        }
        , show: function () {

            this.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            this.channel_num = ChannelsManager.channelsList.GetCurrentElementIndex();

            var curent_cat_fav = parseInt(ChannelsManager.getCurrentCategory().favorite);

            ChannelsManager.initWithoutFavChannelsList();


            if (!curent_cat_fav) {
                ChannelsManager.setCategory(this.channel_cat);
                ChannelsManager.initChannelsList(Main.settings_list_per_page);
                ChannelsManager.setChannel(this.channel_num);
            }

            menu_cont.buildTemplate('channels_settings');
            state_obj.state = "settings_ratio";
            scrollbar_obj.init(0, 'settings_channel');
            channels_settings_ratio.createContent();

            menu_cont.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            menu_cont.createCategory();
            ChannelsManager.updateChannel();
        }
        , createContent: function () {
            channels_settings_ratio.fillTemplate();
            ChannelsManager.updateChannel();
        }
        //Заполнеем шаблон для редактирования пользовательских каналов
        , fillTemplate: function () {
            //список каналов Контент
            settings.content = '';
            var channel;
            for (var i = 0; i < ChannelsManager.channelsList.elementCount; i++) {

                channel = ChannelsManager.channelsList.elements[i];

                settings.content += '<div id="' + this.list_item_name + '_' + i + '" onclick=channels_settings_ratio.click(' + i + ') class="setttings_channels_listitem grey radius_10"><div class="list_item_text">' + channel.title;
                settings.content += '</div><div class="right">' + TextConfig.ratio[channel.ratio].title + '</div>';
                settings.content += '</div>';
            }

            menu_cont.setContentId("channels_settings", settings.content);
            var help = '<div class="help_item">' +
            '<div onclick=channels_settings_ratio.goBack();><img src="images/return_small.png"></div>' +
            '<div class="help_title">' + TextConfig.common.back + '</div>' +
            '</div>' +
            '<div class="help_item">' +
            '<div><img src="images/ok_button.png"></div>' +
            '<div class="help_title">' + TextConfig.settings.change_ratio + '</div>' +
            '</div>';
            menu_cont.setContentClass("help_content", help);
            scrollbar_obj.show(0, ChannelsManager.channelsList.elementCount, 0);

            channels_settings_ratio.ratioList.SetCurrentElementByIndex(ChannelsManager.channelsList.getCurrentElement().ratio);
        }
        , goBack: function () {
            ChannelsManager.setMainChannelsList(ChannelsManager.main_channels_list);
            ChannelsManager.setCategory(this.channel_cat);
            ChannelsManager.setChannel(this.channel_num);
            cookie_obj.setData('channels_settings_ratio_array', JSON.stringify(channels_settings_ratio.array));
            settings.showSettings('settings_playing');
        }
        , toggleRatio: function (num) {
            var channel = ChannelsManager.channelsList.getCurrentElement();

            channels_settings_ratio.ratioList.SetCurrentElementByIndex(num);

            for (var i = 0; i < channels_settings_ratio.array.length; i++) {
                if (channels_settings_ratio.array[i].number == channel.number) {
                    channel.ratio = channels_settings_ratio.array[i].ratio;
                    break;
                }
            }
        }
        /**
         *
         * Навигация в меню добавления каналов
         *
         */
        , navigate: function (type) {
            if (type == 'down') {
                ChannelsManager.moveCurrentChannelTo('down');
            } else if (type == 'up') {
                ChannelsManager.moveCurrentChannelTo('up');
            } else if (type == 'ok') {
                channels_settings_ratio.ratioList.MoveCurrentElementToDown();
                ChannelsManager.channelsList.getCurrentElement().ratio = channels_settings_ratio.ratioList.GetCurrentElementIndex();
                this.updateChannelRatio(ChannelsManager.channelsList.getCurrentElement().number, ChannelsManager.channelsList.getCurrentElement().ratio);
            } else if (type == 'left') {
                ChannelsManager.moveCurrentCatTo('up');
            } else if (type == 'right') {
                ChannelsManager.moveCurrentCatTo('down');
            }
            channels_settings_ratio.ratioList.SetCurrentElementByIndex(ChannelsManager.channelsList.getCurrentElement().ratio);
        }
        , click: function (id) {
            navigation.setActive(this.list_item_name, id, ChannelsManager.channelsList.GetCurrentElementIndex());
            ChannelsManager.setChannel(id);
            channels_settings_ratio.ratioList.SetCurrentElementByIndex(ChannelsManager.channelsList.getCurrentElement().ratio);
            channels_settings_ratio.ratioList.MoveCurrentElementToDown();
            ChannelsManager.channelsList.getCurrentElement().ratio = channels_settings_ratio.ratioList.GetCurrentElementIndex();
            this.updateChannelRatio(ChannelsManager.channelsList.getCurrentElement().number, ChannelsManager.channelsList.getCurrentElement().ratio);
        }
        , updateChannelRatio: function (number, ratio) {
            var flag_ratio = 0;

            for (var i = 0; i < channels_settings_ratio.array.length; i++) {
                if (channels_settings_ratio.array[i].number == number) {
                    channels_settings_ratio.array[i].ratio = ratio;
                    flag_ratio = 1;
                    break;
                }
            }
            if (!flag_ratio) {
                channels_settings_ratio.array.push({'number': number, 'ratio': ratio});
            }
        }
        , updateRatio: function () {
            var elem = document.getElementById(channels_settings.list_item_name + '_' + ChannelsManager.channelsList.GetCurrentElementIndex()).getElementsByClassName('right')[0];
            elem.innerHTML = channels_settings_ratio.ratioList.getCurrentElement().title;
        }
        , getSettings: function (callback) {
            var url = "query=getSettings";
            DataManager.sendAjax(url, settings.onGetSettings);
            settings.onGetSettingsCallback = callback;
        }
        , onGetSettings: function (data) {
            settings.bitrates = data.data.bitrates;
            settings.datacenters = data.data.datacenters;
            settings.playlists = data.data.playlists;
            settings.timeshifts = data.data.timeshifts;
            settings.timezones = data.data.timezones;


            settings.timeshifts.forEach(function (timeshift) {
                if (timeshift.active == 1) settings.timeshift_active_shift = parseInt(timeshift.shift);
            })

            if (settings.onGetSettingsCallback){
                settings.onGetSettingsCallback();
                settings.onGetSettingsCallback = null;
            }
        }
    }
})();

/**
 *
 * Родительский контроль
 *
 */
var parent_menu_obj = (function () {
    return {
        cur_selected: 0
        ,old_selected:0
        , size: 4
        , parent_pass: ''
        ,old_pass:''
        ,new_pass:''
        ,parent_pass: ''
        ,parent_pass_temp: ''
        ,repeat_new_pass:''
        , list_item_name: 'parent_pass'
        , load: function () {
            settings.content =
                '<div class="listitem_input grey" id="parent_pass_0" onclick=navigation.checkboxChange("retype_passwd");><div class=" title_text long">' + TextConfig.settings.retype_pass + '</div><div class="input_checkbox"> <input type="checkbox" size="30" id="retype_passwd" type="text" onmousedown="return false;"></div></div>' +
                '<div class="settings_title_pc">' + TextConfig.settings.change_pass + ':</div>' +
                '<div class="listitem_input grey" id="parent_pass_1" onclick=parent_menu_obj.getKeyboardOldPass();><div class="title_text long">' + TextConfig.settings.old_pass + '</div> <input class="radius_4" id="old_pass" type="text" onmousedown="return false;"></div>' +
                '<div class="listitem_input grey" id="parent_pass_2" onclick=parent_menu_obj.getKeyboardNewPass();><div class="title_text long">' + TextConfig.settings.new_pass + '</div> <input class="radius_4" id="new_pass" type="text" onmousedown="return false;"></div>' +
                '<div class="listitem_input grey" id="parent_pass_3" onclick=parent_menu_obj.getKeyboardRepeatPass();><div class="title_text long">' + TextConfig.settings.submit_pass + '</div> <input  class="radius_4" id="repeat_new_pass" type="text" onmousedown="return false;"></div>' +
                '<div class="listitem_input grey" id="parent_pass_4" onclick=parent_menu_obj.change();><div class="title_text" >' + TextConfig.common.change + '</div>' +
                '</div>';

            settings.fillTemplate();
            navigation.setActive('parent_pass', parent_menu_obj.cur_selected, parent_menu_obj.old_selected);

            //если в куках хранится значение пароля то галочку не ставим
            if (cookie_obj.getData('parent_pass') !== null && cookie_obj.getData('parent_pass') != '') {
                document.getElementById('retype_passwd').checked = false;
                removeClass(document.getElementById('retype_passwd').parentNode, 'checked');
            }
            else {
                document.getElementById('retype_passwd').checked = true;
                addClass(document.getElementById('retype_passwd').parentNode, 'checked');
            }

            document.getElementById('old_pass').value = parent_menu_obj.old_pass;
            document.getElementById('new_pass').value = parent_menu_obj.new_pass;
            document.getElementById('repeat_new_pass').value = parent_menu_obj.repeat_new_pass;
        }
        , click: function (id) {
            switch (id) {
                case 0:
                    navigation.checkboxChange("retype_passwd");
                    break;
                case 1:
                    parent_menu_obj.getKeyboardOldPass('ok');
                    break;
                case 2:
                    parent_menu_obj.getKeyboardNewPass('ok');

                    break;
                case 3:
                    parent_menu_obj.getKeyboardRepeatPass('ok');
                    break;
                case 4:
                    parent_menu_obj.change();
                    break;
            }
        }

        ,getKeyboardOldPass: function (ok) {
            KeyboardManager.show(ok);
            KeyboardManager.onSearchCallBack = parent_menu_obj.insertOldPass;
            KeyboardManager.onReturnCallBack = parent_menu_obj.load;
        }
        ,getKeyboardNewPass: function (ok) {
            KeyboardManager.show(ok);
            KeyboardManager.onSearchCallBack = parent_menu_obj.insertNewPass;
            KeyboardManager.onReturnCallBack = parent_menu_obj.load;
        }
        ,getKeyboardRepeatPass: function (ok) {
            KeyboardManager.show(ok);
            KeyboardManager.onSearchCallBack = parent_menu_obj.insertRepeatPass;
            KeyboardManager.onReturnCallBack = parent_menu_obj.load;
        }
        ,insertOldPass: function (val) {
            parent_menu_obj.old_pass = val;
            parent_menu_obj.load();
        }
        ,insertNewPass: function (val) {
            parent_menu_obj.new_pass = val;
            parent_menu_obj.load();
        }
        ,insertRepeatPass: function (val) {
            parent_menu_obj.repeat_new_pass = val;
            parent_menu_obj.load();
        }
        , navigate: function (direction) {
            this.old_selected = this.cur_selected;

            if (direction == 'down') {
                if (this.cur_selected != this.size)
                    this.cur_selected++;

            }
            else if (direction == 'up') {
                if (this.cur_selected != 0)
                    this.cur_selected--;
            }
            else if (direction == 'ok') {
                this.click(this.cur_selected);
                return;
            }
            navigation.setActive(this.list_item_name, this.cur_selected, this.old_selected);
        }
        , change: function () {
            var old_pass = document.getElementById('old_pass').value;
            var new_pass = document.getElementById('new_pass').value;
            var repeat_new_pass = document.getElementById('repeat_new_pass').value;
            if (old_pass == '' && new_pass == '' && repeat_new_pass == '') {
                this.toggleCookie();
            }
            else if (old_pass == '' || new_pass == '' || repeat_new_pass == '') {
                statusbar.show(TextConfig.settings.not_all_fields, 1);
            }
            else if (new_pass != repeat_new_pass) {
                statusbar.show(TextConfig.settings.pass_not_equal, 1);
            }
            else {
                old_pass = md5(AuthManager.token + md5(old_pass));
                parent_menu_obj.parent_pass = new_pass;
                new_pass = md5(new_pass);

                var url = "query=setControlPasswd&old_pass=" + old_pass + "&new_pass=" + new_pass;
                DataManager.sendAjax(url, parent_menu_obj.result);
            }
        }
        , result: function (data) {
            if (data.status == 'success') {
                statusbar.show(TextConfig.settings.change_pass_ok, 1);
            }
            else {
                parent_menu_obj.parent_pass = '';
            }
            this.toggleCookie();
        }
        , toggleCookie: function () {
            var retype_passwd = document.getElementById('retype_passwd');
            if (retype_passwd.checked === false) {
                if (parent_menu_obj.parent_pass == '') {
                    parent_menu_obj.askParentPass('re_ask');
                }
                else {
                    cookie_obj.setData('parent_pass', parent_menu_obj.parent_pass);
                }
            }
            else {
                cookie_obj.setData('parent_pass', '');
                parent_menu_obj.parent_pass = '';
            }
            statusbar.show(TextConfig.settings.change_ok, 1);
        }
        , askParentPass: function (type) {
            clearTimeout(channel_menu.timer);
            this.cur_selected = 0;
            if(state_obj.state != 'Keyboard' ) {
                this.prev_state = state_obj.state;
            }

            state_obj.state = 'ask_parent_pass';
            var content =
                    '<a class="return small" onclick="parent_menu_obj.close();"></a>' +
                    '<div id="parent_pass_title">' + TextConfig.settings.enter_pass + '</div>' +
                    '<div id="parent_pass_message"></div>' +
                    '<div id="ask_parent_pass_0" onclick=parent_menu_obj.getKeyboardAskPass(); class="listitem_input grey" >' +
                    '<input id="ask_pass" class="radius_4" id="new_pass" type="text" onmousedown="return false;"/>' +
                    '</div>' +
                    '<div id="ask_parent_pass_1" class="listitem_input grey" onclick=parent_menu_obj.send(\"' + type + '\");>' + TextConfig.common.input_text + '</div>' +
                    '<div id="ask_parent_pass_2" class="listitem_input grey" onclick="parent_menu_obj.close();">' + TextConfig.common.cancel + '</div>'
                ;
            document.getElementById('ask_parent_pass').innerHTML = content;
            document.getElementById('ask_parent_pass').style.display = 'block';
            navigation.setActive('ask_parent_pass', this.cur_selected, 0);
            DataManager.block();
            document.getElementById('ask_pass').value = parent_menu_obj.parent_pass_temp;
            //ask_parent_pass
            menu_cont.clearContainer();
        }
        , send: function (type) {
            var ask_parent_pass = document.getElementById('ask_pass').value;

            if (ask_parent_pass == '') {
                statusbar.show(TextConfig.settings.not_all_fields, 1);
                return;
            }
            var md5_ask_parent_pass = md5(AuthManager.token + md5(ask_parent_pass));
            var url = "query=checkControlPasswd&pass=" + md5_ask_parent_pass;

            DataManager.sendAjax(url, function (data) {
                if (data.status == 'success') {
                    parent_menu_obj.close();
                    parent_menu_obj.parent_pass = ask_parent_pass;
                    if (type == 're_ask') {
                        cookie_obj.setData('parent_pass', parent_menu_obj.parent_pass);
                    }
                    else {
                        source.playLive();
                    }
                }
                else {
                    statusbar.show(TextConfig.settings.wrong_pass);
                }
            });
        }
        , close: function () {
            document.getElementById('ask_parent_pass').style.display = 'none';
            DataManager.unblock();
            MainMenu.showTv();
        }
        , navigateAskPass: function (direction) {

            var deactive_id = this.cur_selected;
            if (direction == 'down') {
                if (this.cur_selected != 2)
                    this.cur_selected++;
            }
            else if (direction == 'up') {
                if (this.cur_selected != 0)
                    this.cur_selected--;
            }
            else if (direction == 'ok') {
                switch (this.cur_selected) {
                    case 0:
                        parent_menu_obj.getKeyboardAskPass('ok');
                        break;
                    case 1:
                        parent_menu_obj.send();
                        break;
                    case 2:
                        ChannelsManager.setCategory(channel_menu.channel_cat);
                        ChannelsManager.setChannel(channel_menu.channel_num);
                        parent_menu_obj.close();
                        break;
                }
                return;
            }
            navigation.setActive('ask_parent_pass', this.cur_selected, deactive_id);
        }
        ,getKeyboardAskPass: function (ok) {
            KeyboardManager.show(ok);
            KeyboardManager.onSearchCallBack = parent_menu_obj.insertParentPass;
            KeyboardManager.onReturnCallBack = parent_menu_obj.askParentPass;
            document.getElementById('ask_parent_pass').style.display = 'none';
            DataManager.unblock();
        }
        ,insertParentPass: function (val) {
            parent_menu_obj.parent_pass_temp = val;
            parent_menu_obj.askParentPass();
        }
    }
})();
var modeMenu = (function () {
    return {
        list_item_name:'mode_menu'
        ,old_active:0
        ,init: function () {
            var elem = '';
            var sub_title = '';
            modeMenu.modeMenuList = new List();
            modeMenu.modeMenuList.Init(TextConfig.mode_menu_items, 100);
            modeMenu.modeMenuList.SetCurrentElementGhangedCallback(modeMenu.updateModeMenuListElement);

            modeMenu.modeSubMenuList = new List();
            modeMenu.modeSubMenuList.SetCurrentElementGhangedCallback(modeMenu.updateModeSubMenuListListElement);

            //var mode_menu_container = '<div id="mode_menu_container"></div>';
            var parentNode = document.getElementsByTagName("body")[0];
            var obj = document.createElement("div");
            obj.setAttribute('id','mode_menu_container');
            parentNode.appendChild(obj);


            TextConfig.mode_menu_items.forEach(function(item,i){
                if(item.id == 'volume') {
                    sub_title = player.getVolume();
                }
                if(item.id == 'player_ratio_dune') {
                    var ratio_id = modeMenu.getRatio();
                    sub_title = item.values[ratio_id].title;
                }
                elem += '<div class="chose_settings" id="'+modeMenu.list_item_name+'_'+i+'" ><div class="title_text ">'+item.title+'</div><div class="left_arrow" ></div><div class="settings_value" id="mode_menu_value_'+i+'">'+sub_title+'</div><div class="right_arrow"></div></div>';
            });
            document.getElementById('mode_menu_container').innerHTML = elem;
            navigation.setActive(modeMenu.list_item_name, 0, 0);
        }
        ,show: function() {
            if (document.getElementById('mode_menu_container').style.display != 'block') {
                state_obj.prev_state = state_obj.state;
                state_obj.state = 'mode_menu';
                document.getElementById('mode_menu_container').style.display = 'block';
                //modeMenu.updateModeMenuListElement();
                modeMenu.updateTimer();
            }
        }
        ,updateTimer: function() {
          // clearTimeout(modeMenu.timer);
          // modeMenu.timer = setTimeout('modeMenu.hide()',ConstValue.cTimeoutShowLegend);
        }
        ,hide: function() {
            statusbar.show('HIDE')
            state_obj.state = state_obj.prev_state;
            document.getElementById('mode_menu_container').style.display = 'none';
        }
        ,updateModeMenuListElement: function() {
            navigation.setActive(modeMenu.list_item_name, modeMenu.modeMenuList.GetCurrentElementIndex(), modeMenu.old_active);
            if(modeMenu.modeMenuList.getCurrentElement().values && modeMenu.modeMenuList.getCurrentElement().values.length) {
                modeMenu.modeSubMenuList.Init(modeMenu.modeMenuList.getCurrentElement().values, 100);
                if(modeMenu.modeMenuList.getCurrentElement().id = 'player_ratio_dune') {
                    var ratio_id = modeMenu.getRatio();
                    modeMenu.modeSubMenuList.SetCurrentElementByIndex(ratio_id);
                }
            }
        }
        ,updateModeSubMenuListListElement : function() {
            var settings_value_element = document.getElementById('mode_menu_value_' + modeMenu.modeMenuList.GetCurrentElementIndex());
            if (settings_value_element) {
                settings_value_element.innerHTML = modeMenu.modeSubMenuList.getCurrentElement().title;
            }
        }
        ,MoveModeMenu: function(to) {
            modeMenu.updateTimer();
            modeMenu.old_active = modeMenu.modeMenuList.GetCurrentElementIndex();

            if (to == 'up') {
                modeMenu.modeMenuList.MoveCurrentElementToUp();
                return false;
            }
            if (to == 'down') {
                modeMenu.modeMenuList.MoveCurrentElementToDown();
                return false;
            }

            var mode = modeMenu.modeMenuList.getCurrentElement();

            if (mode.id == 'player_ratio_dune') {
                if (to == 'right') {
                    modeMenu.modeSubMenuList.MoveCurrentElementToUp();
                } else {
                    modeMenu.modeSubMenuList.MoveCurrentElementToDown();
                }

                statusbar.show(modeMenu.modeSubMenuList.getCurrentElement().val)
                if(player.playerAPI.setAspectRatio) {
                    player.playerAPI.setAspectRatio(player.playerAPI[modeMenu.modeSubMenuList.getCurrentElement().val]);
                }
            } else if (mode.id == 'volume') {
                //statusbar.show('volume = '+player.getVolume())
                if (to == 'right') {
                    player.setRelativeVolume(0);
                } else {
                    player.setRelativeVolume(1);
                }
                var settings_value_element = document.getElementById('mode_menu_value_' + modeMenu.modeMenuList.GetCurrentElementIndex());
                if (settings_value_element) {
                    settings_value_element.innerHTML = player.getVolume();
                }
            }
        }
        ,getRatio: function() {
            var a = player.playerAPI;
            var b = a && a.getAspectRatio ? a.getAspectRatio() : 0;
            switch (b) {
                case a.ASPECT_RATIO_AUTO:
                    return 0;
                case a.ASPECT_RATIO_16_9:
                    return 1;
                case a.ASPECT_RATIO_4_3:
                    return 2;
                default:
                    return 0
            }
        }

    }
})();