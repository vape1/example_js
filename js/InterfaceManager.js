/**
 * Меню каналов вызываеться при нажатии влево с режима просмотра
 */
var channel_menu = (function () {
    return {
        timer: 0
        , channel_cat: 0
        , channel_num: 0
        , list_item_name: 'channel'
        , show: function () {
            state_obj.state = "channels_menu";

            this.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            this.channel_num = ChannelsManager.channelsList.GetCurrentElementIndex();

            //отображаем меню и строим шаблон
            menu_cont.buildTemplate('channels_menu');
            menu_cont.setClass("container_menu", "transparent");
            this.createContent();
            var sub_menu = ChannelsManager.getCurrentCategory() ? ChannelsManager.getCurrentCategory().title : '';
            menu_cont.setContentId("line_channel", '<div id="type_container">' +
            '<div class="left_arrow" onclick=channel_menu.navigate("left");></div>' +
            '<div id="types_menu" class="channels_cat font_120">' + sub_menu + '</div>' +
            '<div class="right_arrow" onclick=channel_menu.navigate("right");></div>' +
            '</div>');
            menu_cont.setContentId("types_menu", sub_menu);
            scrollbar_obj.init(0, 'channels_menu');

            ChannelsManager.initChannelsList(Main.ChannelsManager_per_page);

            ChannelsManager.setChannel(this.channel_num);

            ChannelsManager.updateChannelList();
            ChannelsManager.updateChannel();


            channel_menu.updateTimer();

        }
        , updateTimer: function () {
            if (player.player_type != PlatformManager.integratedVideo)  return false;

            clearTimeout(channel_menu.timer);
            channel_menu.timer = setTimeout('channel_menu.hide();', ConstValue.cTimeoutShowChannelsList);
        }
        , createContent: function () {
            //список каналов
            var channels = '';

            for (var i = 0; i < ChannelsManager.channelsList.elementCount; i++) {
                var channel = ChannelsManager.channelsList.elements[i];
                channels += '<div id="channel_' + i + '" onclick=channel_menu.click(' + i + '); class="listitem btn grey">';
                channels += '<div class="list_item_text">' + channel.title + '</div></div>';
            }

            this.content = channels;
            this.fillTemplate();
        }
        , fillTemplate: function () {
            menu_cont.setContentId("channels_container", this.content);
            this.getProgramNow();
        }
        , getProgramNow: function () {
            var channel = ChannelsManager.getCurrentChannel();
            var progs = program.getNowNextProgram(channel);
            var time_now = progs[0] ? progs[0].t_start.split(' ')[1] : '';
            var title_now = progs[0] ? progs[0].title : '';
            var time_next = progs[1] ? progs[1].t_start.split(' ')[1] : '';
            var title_next = progs[1] ? progs[1].title : '';

            menu_cont.setContentId("program_title_small", TextConfig.common.now + ": " + time_now + " " + title_now);
            menu_cont.setContentId("program_next_title_small", TextConfig.common.next + ": " + time_next + " " + title_next);
        }
        , hide: function () {
            //не прячем если активно меню родительского пароля
            if (document.getElementById('ask_parent_pass').style.display != 'block') {
                ChannelsManager.setCategory(this.channel_cat);
                ChannelsManager.setChannel(this.channel_num);

                if (player.player_type != PlatformManager.integratedVideo) {
                    MainMenu.show();
                } else {
                    state_obj.state = "live_player";
                    menu_cont.hide();
                    arch_player.showLegend();
                }

                clearTimeout(this.timer);
                removeClass(document.getElementsByClassName('container_menu')[0], 'transparent');
            }
        }
        , click: function (id) {
            navigation.setActive(this.list_item_name, id, ChannelsManager.channelsList.GetCurrentElementIndex());
            ChannelsManager.setChannel(id);
            this.getProgramNow();
            this.navigate('ok');
        }
        , navigate: function (type) {
            ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();

            channel_menu.updateTimer();

            //изменение канала
            if (type == 'down') {
                ChannelsManager.moveCurrentChannelTo('down');
            }
            else if (type == 'up') {
                ChannelsManager.moveCurrentChannelTo('up');
            } else if (type == 'page_down') {
                ChannelsManager.channelsList.SetNextPage();
            }
            else if (type == 'page_up') {
                ChannelsManager.channelsList.SetPrevPage();
            }

            //изменение категории
            else if (type == 'left') {
                ChannelsManager.moveCurrentCatTo('up');
            }
            else if (type == 'right') {
                ChannelsManager.moveCurrentCatTo('down');
            }
            else if (type == 'ok') {
                source.playLive(); 
            }

        }
    }
})();


/**
 * Главное меню
 */
var MainMenu = (function () {

    return {
        cur_cat: 0
        , cur_menu: 0
        , obj: {}
        , list_item_name: 'menu'
        , menu_length: 0
        , menu_height: 0
        , show: function () {
            menu_cont.buildTemplate('main_menu');
            //строим шаблон и отображаем
            if (program.day) {
                program.day = 0;
            }

            this.createContent();
            MainMenu.updateElement();
            menu_cont.show();
            spin_obj.stop();
        }
        , createContent: function () {
            var cur_title = '';
            for (var i = 0; i < MainMenu.menuList.elementCount; i++) {
                var elem = MainMenu.menuList.elements[i];
                if (elem.id == MainMenu.menuList.GetCurrentElementIndex()) {
                    cur_title += '<div class="menu_item active"><div class="left_arrow_menu" onclick=MainMenu.navigate("left");></div>' +
                    '<div class="menu_cat font_120" onclick="MainMenu.setContent(' + elem.id + ')">' + elem.title + '</div>' +
                    '<div class="right_arrow_menu" onclick=MainMenu.navigate("right");></div></div>';
                } else {
                    cur_title += '<div class="menu_item"><div class="menu_cat font_120" onclick="MainMenu.setContent(' + elem.id + ')">' + elem.title + '</div></div>';
                }

            }
            this.sub_menu = cur_title;

            var html_str_menu = '';
            for (y = 0; y < MainMenu.menuListItem.elementCount; y++) {
                elem = MainMenu.menuListItem.elements[y];
                html_str_menu += '<div id="' + this.list_item_name + '_' + y + '" onclick="' + elem.onclick + '" class="listitem font_110 grey">' +
                elem.title +
                '</div>';
            }

            MainMenu.content = html_str_menu;
            this.fillTemplate();
            menu_cont.centered('menu_item', 'active', 'types_menu_cat', 1);
            navigation.setActive(MainMenu.list_item_name, MainMenu.menuListItem.GetCurrentElementIndex(), 0);
        }

        , fillTemplate: function () {
            var html_title = '<div id="types_menu_cat">' + this.sub_menu + '</div>';
            menu_cont.setContentClass("line", html_title);
            menu_cont.setContentId("menu_container", this.content);
            menu_cont.setContentClass("scroll_content", '');

            if (MainMenu.menuListItem.elementCount > Main.main_menu_items_per_page) {
                scrollbar_obj.init(0, 'main_menu');
                scrollbar_obj.show(MainMenu.menuListItem.GetCurrentElementIndex(), MainMenu.menuListItem.elementCount, 0);
            }
        }
        , setContent: function (id) {
            MainMenu.menuList.SetCurrentElementByIndex(id);
            MainMenu.createContent();
        }
        , navigate: function (type) {
            MainMenu.old_index = MainMenu.menuListItem.GetCurrentElementIndex();

            if (type == 'down') {
                MainMenu.menuListItem.MoveCurrentElementToDown();
            } else if (type == 'up') {
                MainMenu.menuListItem.MoveCurrentElementToUp();
            } else if (type == 'page_down') {
                MainMenu.menuListItem.SetNextPage();
            } else if (type == 'page_up') {
                MainMenu.menuListItem.SetPrevPage();
            }
            //изменение категории
            else if (type == 'left') {
                MainMenu.old_index = 0;
                MainMenu.menuList.MoveCurrentElementToUp();
            }
            else if (type == 'right') {
                MainMenu.old_index = 0;
                MainMenu.menuList.MoveCurrentElementToDown();
            }
            else if (type == 'ok') {
                MainMenu.menuListItem.getCurrentElement().ok();
            }

            return false;
        }
        , showTv: function () {
            if (player.player_type != PlatformManager.integratedVideo) {
                android_channel_menu.show();
                return false;
            }

            state_obj.sub_state = 'view';
            MainMenu.hide();
            if (player.player_type == PlatformManager.integratedVideo) {
                arch_player.showLegend();
            } else {
                channel_menu.show();
            }
        }
        , hide: function () {
            if (player.player_type != PlatformManager.integratedVideo) {
                android_channel_menu.show();
                return true;
            }
            if (state_obj.video_state == 'live' || state_obj.video_state == 'archive') {
                state_obj.state = "live_player";
                state_obj.sub_state = 'view';
            }
            else if (state_obj.video_state == 'vod') {
                state_obj.state = "vod_player";
                state_obj.sub_state = 'view';
            }

            menu_cont.hide();

            return true;
        }
        , updateElement: function () {

            MainMenu.menuListItem.Init(MainMenu.menuList.getCurrentElement().sub_menu, Main.main_menu_items_per_page);
            MainMenu.menuListItem.SetCurrentElementByIndex(MainMenu.old_index);
            MainMenu.updateElementItem();
            MainMenu.updatePageItem();
            MainMenu.createContent();
        }
        , updatePage: function () {

        }
        , updateElementItem: function () {
            MainMenu.new_index = MainMenu.menuListItem.GetCurrentElementIndex();
            navigation.setActive(MainMenu.list_item_name, MainMenu.new_index, MainMenu.old_index);
            if (MainMenu.menuListItem.elementCount > Main.main_menu_items_per_page) {
                scrollbar_obj.show(MainMenu.new_index, MainMenu.menuListItem.elementCount, 0);
            }

        }
        , updatePageItem: function () {
            document.getElementById('menu_container').style.top = MainMenu.menu_height * MainMenu.menuListItem.GetCurrentPageIndex() + 'px';
        }
        , init: function () {
            this.obj = [
                {
                    title: TextConfig.common.watch_tv
                    , id: 0
                    , sub_menu: [
                    {
                        title: TextConfig.common.watch_tv
                        , onclick: 'MainMenu.showTv();'
                        , ok: MainMenu.showTv
                    }
                    , {
                        title: TextConfig.common.archive_tv
                        , onclick: "program.showArch();"
                        , ok: program.showArch
                        , name: 'archive'
                    }
                    , {
                        title: TextConfig.common.program
                        , onclick: "program.showProg();"
                        , ok: program.showProg
                        , name: 'program'
                    }
                    , {
                        title: TextConfig.common.epg
                        , onclick: "program.showEpg();"
                        , ok: program.showEpg
                    }
                ]
                },
                {
                    title: TextConfig.kinozal.kinozal
                    , id: 1
                    , sub_menu: [
                    {
                        title: TextConfig.kinozal.pubdate
                        , onclick: "VODManager.byPubDate();"
                        , ok: VODManager.byPubDate
                    }
                    , {
                        title: TextConfig.kinozal.genre
                        , onclick: "vod_genres.load();"
                        , ok: vod_genres.load
                    }
                    , {
                        title: TextConfig.kinozal.fav
                        , onclick: "VODManager.loadFav();"
                        , ok: VODManager.loadFav
                    }
                    , {
                        title: TextConfig.kinozal.top
                        , onclick: "vod_top.show();"
                        , ok: vod_top.show
                    }
                    , {
                        title: TextConfig.kinozal.search
                        , onclick: "vod_search.init();"
                        , ok: vod_search.init
                    }
                ]
                },
                {
                    title: TextConfig.settings.settings
                    , id: 2
                    , sub_menu: [
                    {
                        title: TextConfig.common.abonement
                        , onclick: "settings.show('abonement');"
                        , ok: settings.show
                        , name: 'abonement'
                    }
                    , {
                        title: TextConfig.settings.channels_list
                        , onclick: "settings.show('channels_settings');"
                        , ok: settings.show
                        , name: 'channels_settings'
                    }
                    , {
                        title: TextConfig.settings.parent_pass
                        , onclick: "settings.show('parent_pass');"
                        , ok: settings.show
                        , name: 'parent_pass'
                    }
                    , {
                        title: TextConfig.settings.settings_server
                        , onclick: "settings.showSettings('settings_server');"
                        , ok: settings.showSettings
                        , name: 'settings_server'
                    }
                ]
                }
            ];
            if (PlatformManager.getDevice() == PlatformManager.Android || PlatformManager.getDevice() == PlatformManager.Debug) {
                this.obj[2].sub_menu.push(
                    {
                        title: TextConfig.settings.settings_playing
                        , onclick: "settings.showSettings('settings_playing');"
                        , ok: settings.showSettings
                        , name: 'settings_playing'
                    }
                );
            }

            this.obj[2].sub_menu.push(
                {
                    title: TextConfig.common.exit
                    , onclick: "PlatformManager.exit();"
                    , ok: PlatformManager.exit
                }
            );

            if (PlatformManager.getDevice() == PlatformManager.MAG_AURA && PlatformManager.aura_mag != 'aura') {
                this.obj[2].sub_menu.pop();
            }

            MainMenu.menuList = new List();
            MainMenu.menuList.Init(MainMenu.obj, 3);
            MainMenu.menuList.SetCurrentPageGhangedCallback(MainMenu.updatePage);
            MainMenu.menuList.SetCurrentElementGhangedCallback(MainMenu.updateElement);

            MainMenu.menuListItem = new List();
            MainMenu.menuListItem.SetCurrentPageGhangedCallback(MainMenu.updatePageItem);
            MainMenu.menuListItem.SetCurrentElementGhangedCallback(MainMenu.updateElementItem);

            dropdown_menu.dropdownList = new List();
            dropdown_menu.dropdownList.SetCurrentPageGhangedCallback(dropdown_menu.updatePage);
            dropdown_menu.dropdownList.SetCurrentElementGhangedCallback(dropdown_menu.updateElement);

        }
    }
})();

var menu_cont = (function () {
    return {
        content: ''
        , help: ''
        , sub_menu: ''
        , channel_cat: 0
        , show: function () {
            menu_cont.hideLegend();
            document.getElementsByClassName('container_menu')[0].style.display = 'block';
        }
        , close: function () {
            document.getElementsByClassName('container_menu')[0].style.display = 'none';
            this.setContentClass('container_menu', '');
        }
        , hide: function () {
            document.getElementsByClassName('container_menu')[0].style.display = 'none';
            this.clearContainer();
        }
        , clearContainer: function () {
            this.setContentClass('container_menu', '<div class="header">' +
                '<div id="logo_menu"><img src="images/' + TextConfig.common.logo + '"></div><div class="time">' + DataManager.unixToTime(time_obj.unix_time_timezone) + '</div>' +
                '</div>' +
                '<div class="line grey_line"></div><div class="content"></div><div class="help"><div class="help_content"></div></div>'
            );
            removeClass(document.getElementsByClassName('container_menu')[0], 'transparent');
            removeClass(document.getElementsByClassName('container_menu')[0], 'integratedPlayer');
        }
        , buildTemplate: function (type) {
            this.clearContainer();
            menu_cont.show();
            //Определение переменной состояния экрана
            state_obj.state_prev = state_obj.state;
            state_obj.state = type;
            if (type == 'main_menu') {
                this.setClass("header", "big");
                this.setClass("content", "big");
                this.setContentClass("content", '<div class="main_menu"><div class="main_menu_container"><div id="menu_container"></div></div><div class="scroll_content"></div></div>');
                document.getElementsByClassName('main_menu_container')[0].style.height = -1 * MainMenu.menu_height + 'px';
            }
            else if (type == 'auth_menu') {
                this.setClass("header", "none");
                this.setClass("line", "none");
                this.setClass("content", "vod_one");
                this.setContentClass("content",'<div class="wrap_auth"></div>');
            }
            else if (type == 'vod') {
                this.setContentId("logo_menu", '<img src="images/' + TextConfig.common.logo_small + '"></div>');
            }
            else if (type == 'vod_one') {
                this.setClass("header", "none");
                this.setClass("line", "none");
                this.setClass("content", "vod_one");
            }
            else if (type == 'vod_genres' || type == 'vod_top' || type == 'vod_search' || type == 'dropdown_menu') {
                this.setClass("content", "big");
                this.setClass("header", "small");
                this.setContentId("logo_menu", '<img src="images/' + TextConfig.common.logo_small + '"></div>');
            }
            else if (type == 'program') {
                var none = '';
                var date = '';
                if (program.type == 'epg') none = 'none';

                if (program.type == 'epg') {
                    date += '<div class="font_90" id="date_title" style="float: none;"></div>';
                } else {
                    date += '<div class="left_arrow" onclick=' + type + '.changeDate("prev");></div>' +
                    '<div class="font_90" id="date_title"></div>' +
                    '<div class="right_arrow" onclick=' + type + '.changeDate("next");></div>'
                    ;
                }

                this.setClass("header", "small");
                this.setContentId("logo_menu", '<img src="images/' + TextConfig.common.logo_small + '"></div>');
                this.setContentClass("content",
                    '<div class="content_program">' +
                    '<div id="channels_container_epg" onmousewheel = Mouse.moveMouseWheel(event,"channels");>' +
                    '<div id="epg_date_container">' + date + '</div>' +
                    '<div id="channels_list" class="small_channels_list">' +
                    '<div id="channels_container"></div>' +

                    '</div>' +
                    '</div>' +
                    '<div class="scroll_content"></div>' +
                    '<div id="epg"  onmousewheel = Mouse.moveMouseWheel(event,"epg");>' +
                    '<div id="time_line"></div>' +
                    '<div id="epg_container_list">' +
                    '<div id="epg_container"></div>' +
                    '</div>' +
                    '<div id="cur_time" class="grey active none"></div><div id="cur_time_val"  class="grey active radius_4 none"></div>' +

                    '</div>' +
                    '<div class="scroll_content ' + none + '"></div>' +
                    '</div>' +
                    '<div class="epg_descr grey active">' +
                    '<div class="epg_top">' +
                    '<div id="epg_descr_title"></div>' +
                    '<div id="epg_descr_duration"></div>' +
                    '</div>' +
                    '<div id="epg_descr_descr" class="font_90"></div>' +
                    '</div>' +
                    '</div>');

                document.getElementsByClassName('content_program')[0].style.height = Main.content_program_height + 'px';
                document.getElementsByClassName('small_channels_list')[0].style.height = -1 * ChannelsManager.smallContainerHigh + 'px';
                document.getElementById('epg_container_list').style.height = -1 * ChannelsManager.smallContainerHigh + 'px';
                document.getElementById('epg_descr_descr').style.height = Main.epg_descr_height + 'px';
            }

            else if (type == 'channels_menu') {
                this.setClass("header", "none");
                this.setClass("line", "none");
                this.setClass("help", "none");
                this.setClass("content", "ch_list");
                this.setContentClass("content", '<div id="left_channels_container"><div class="line grey_line" id="line_channel"></div>' +
                '<div id="channels_menu"><div id="channels_list">' +
                '<div id="channels_container" class="channels_menu"></div>' +
                '</div><div class="scroll_content"></div>' +
                '</div>' +
                '<div class="help"><div class="help_content"></div></div>' +
                '</div>' +
                '<div id="right_channels_container">' +
                '<div class="time channel_time">' + DataManager.unixToTime(time_obj.unix_time_timezone) + '</div>' +
                '<div id="info_small" class="info_small">' +
                '<div class="program_now">' +
                '<div class="program_title" id="program_title_small"></div>' +
                '<div id="description_small"></div>' +
                '</div>' +
                '<div class="program_next">' +
                '<div class="program_next_title" id="program_next_title_small"></div>' +
                '<div id="description_next_small"></div>' +
                '</div>' +
                '</div>');
                document.getElementById('channels_list').style.height = -1 * ChannelsManager.containerHigh + 'px';
            }
            else if (type == 'settings') {
                this.setClass("header", "small");
                this.setContentId("logo_menu", '<img src="images/' + TextConfig.common.logo_small + '"></div>');

            }
            else if (type == 'channels_settings') {
                this.setClass("header", "small");
                this.setContentId("logo_menu", '<img src="images/' + TextConfig.common.logo_small + '"></div>');
                this.setContentClass("content",
                    '<div class="settings_list channels_settings">' +
                    '<div id="channels_settings"></div>' +
                    '</div><div class="scroll_content"></div>'
                );

                document.getElementsByClassName('settings_list')[0].style.height = Main.settings_list_height + 'px';
            }
            else if (type == 'externalPlayer') {
                this.setClass("header", "none");
                this.setClass("line", "none");
                this.setClass("container_menu", "integratedPlayer");

            }
            else if (type == 'Keyboard') {
                this.setClass("header", "none");
                this.setClass("line", "none");
                this.setClass("container_menu", "integratedPlayer");
            }
            else if (type == 'android_channel_menu') {
                this.setClass("header", "small");
                this.setContentId("logo_menu", '<img src="images/' + TextConfig.common.logo_small + '"></div>');
                this.setContentClass("content",'<div class="content_block"><div class="left_arrow" onclick=android_channel_menu.navigate("prev_page") ></div><div class="channel_content_block"><div id="channels_container"></div></div><div class="right_arrow" onclick=android_channel_menu.navigate("next_page") ></div></div>');
                document.getElementsByClassName('channel_content_block')[0].style.height = Main.channel_content_block_height + 'px';
            }
            this.setContentClass("help_content", menu_cont.getHelp(type));
        }
        /**
         * HELP BUTTONS
         */
        , getHelp: function (type) {
            var help = '';
            if (type == 'vod') {
                help = '<div class="help_item" onclick=VODManager.hide();>' +
                '<div><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div onclick=VODManager.navigate("ok");><img src="images/ok_button.png"></div>' +
                '<div class="help_title">' + TextConfig.common.details + '</div>' +
                '</div>';
                if (PlatformManager.getDevice() != PlatformManager.Android) {
                    help += '<div class="help_item">' +
                    '<div onclick=VODManager.addToFav(); class="thin_btn"><img src="images/btn_yellow.png"></div>' +
                    '<div class="help_title">' + TextConfig.kinozal.add_favorite + '</div>' +
                    '</div>';
                }
                help += '<div id="vod_bottom_menu_0" class="help_item">' +
                '<div onclick=VODManager.showSort(); class="thin_btn"><img src="images/btn_red.png"></div>' +
                '<div class="help_title">' + TextConfig.kinozal.sort + '</div>' +
                '</div>' +
                '<div id="vod_bottom_menu_1" class="help_item">' +
                '<div onclick=VODManager.showPage(); class="thin_btn"><img src="images/btn_blue.png"></div>' +
                '<div class="help_title">' + TextConfig.kinozal.choose_page + '</div>' +
                '</div>';
            }
            else if (type == 'main_menu' && player.player_type == PlatformManager.integratedVideo) {
                help = '<div class="help_item">' +
                '<div onclick=MainMenu.hide();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.to_watch + '</div>' +
                '</div>';
            }
            else if (type == 'vod_one') {
                help = '<div class="help_item">' +
                '<div onclick=VODManager.fillTemplate();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div ><img src="images/ok_button.png"></div>' +
                '<div class="help_title">' + TextConfig.common.watch + '</div>' +
                '</div>';
            }
            else if (type == 'vod_genres') {
                help = '<div class="help_item">' +
                '<div onclick=vod_genres.hide();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>'
                ;

            }
            else if (type == 'vod_top') {
                help = '<div class="help_item">' +
                '<div onclick=vod_top.hide();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>';
            }
            else if (type == 'vod_search') {
                help = '<div class="help_item">' +
                '<div onclick=vod_search.hide();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>';
            }

            else if (type == 'channels_settings') {
                help = '<div class="help_item">' +
                '<div class="help_button"  onclick=channels_settings.goBack();><img src="images/return_small.png"></div><div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div class="thin_btn"><img src="images/btn_green.png"></div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div class="thin_btn"><img src="images/btn_red.png"></div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div class="thin_btn"><img src="images/btn_yellow.png"></div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div class="help_title">' + TextConfig.settings.fav_add_remove + '</div>' +
                '</div>';
            }
            else if (type == 'program') {
                help = '<div class="help_item">' +
                '<div onclick=program.back();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div ><img src="images/ok_button.png"></div>' +
                '<div class="help_title">' + TextConfig.common.chose_program + '</div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div ><img src="images/up_down.png"></div>' +
                '<div class="help_title">' + TextConfig.common.change_channel + '</div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div ><img src="images/left_right.png"></div>' +
                '<div class="help_title">' + TextConfig.common.change_cat + '</div>' +
                '</div>';
                if (PlatformManager.getDevice() != PlatformManager.Android && program.type != 'epg') {
                    help += '<div class="help_item">' +
                    '<div onclick=program.changeDate("prev"); class="thin_btn"><img src='+menu_cont.getBtnBwd()+'></div>' +
                    '<div onclick=program.changeDate("next"); class="thin_btn"><img src='+menu_cont.getBtnFwd()+'></div>' +
                    '<div class="help_title">' + TextConfig.common.change_date + '</div></div>' +
                    '</div>';
                }
            }
            else if (type == 'channels_menu') {
                help = '<div class="help_item">' +
                '<div onclick="channel_menu.hide();"><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>';
            }
            else if (type == 'settings') {
                help = '<div class="help_item">' +
                '<div onclick=MainMenu.show();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>';
            }
            else if (type == 'dropdown_menu') {
                help = '<div class="help_item">' +
                '<div onclick=onclick=dropdown_menu.hide();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>' +
                '<div class="help_item">' +
                '<div onclick=epg.navigate("ok");><img src="images/ok_button.png"></div>' +
                '<div class="help_title">' + TextConfig.common.watch + '</div>' +
                '</div>';
            }
            else if (type == 'externalPlayer') {
                help = '<div class="help_item">' +
                '<div onclick=ExternalPlayerView.goBack();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>';
            }
            else if (type == 'Keyboard') {
                help = '<div class="help_item">' +
                '<div onclick=KeyboardManager.goBack();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '\\Ок</div>' +
                '</div>';
            }
            else if (type == 'android_channel_menu') {
                help = '<div class="help_item">' +
                '<div onclick=android_channel_menu.goBack();><img src="images/return_small.png"></div>' +
                '<div class="help_title">' + TextConfig.common.back + '</div>' +
                '</div>';
            }

            return help;
        }
        , setClass: function (class_name, class_set) {
            addClass(document.getElementsByClassName(class_name)[0], class_set);
            //document.getElementsByClassName(class_name)[0].classList.add(class_set);
        }
        , setClassId: function (id, class_set) {
            addClass(document.getElementById(id), class_set);
            //document.getElementById(id).classList.add(class_set);
        }
        , setContentClass: function (class_name, html) {
            document.getElementsByClassName(class_name)[0].innerHTML = html;
        }
        , setContentId: function (id, html) {
            document.getElementById(id).innerHTML = html;
        }
        /**
         * Строим категории каналов
         */
        , createCategory: function () {
            if (state_obj.state == "channels_menu") {
                //категория
                var sub_menu = ChannelsManager.getCurrentCategory().title;
                menu_cont.setContentId("types_menu", sub_menu);
                return true;
            }
            this.sub_menu = '<div class="left_arrow" onclick="menu_cont.prevCat();"></div><div id="category_container">';
            for (var i = 0; i < ChannelsManager.categoriesList.elementCount; i++) {
                var class_name = '';
                var title = ChannelsManager.categoriesList.elements[i].title;

                if (i == this.channel_cat) {
                    class_name = 'program_active_cat';
                }

                this.sub_menu += '<div onclick="ChannelsManager.setCategory(' + i + ')" id="category_' + i + '" class="font_120 types_menu_program ' + class_name + '">' + title + '</div>';

            }
            this.sub_menu += '</div><div class="right_arrow" onclick="menu_cont.nextCat();"></div>';
            menu_cont.setContentClass("line", this.sub_menu);
            this.centered('types_menu_program', 'program_active_cat', 'category_container', 2);
            if(state_obj.state == 'android_channel_menu') {
                if(android_channel_menu.cur_view == 'category') {
                    addClass(document.getElementById('category_' + ChannelsManager.categoriesList.GetCurrentElementIndex()), "hover");
                }
            }

            return true;
        }
        /**
         * Центрирует активную категорию, вызываеться один раз при  построении категорий
         *
         */
        , centered: function (item, active_item, container, elements_before_active) {
            var array = [];
            var elements = document.getElementsByClassName(item);
            var elements_length = elements.length - 1;
            for (var i = 0; i <= elements_length; i++) {
                var has_class = hasClass(elements[i], active_item);

                if (has_class) {

                    for (var y = i - 1; y >= 0; y--) {
                        var element = document.getElementsByClassName(item)[y];


                        document.getElementsByClassName(item)[y].parentElement.removeChild(document.getElementsByClassName(item)[y]);
                        //document.getElementsByClassName(item)[y].remove();
                        array.unshift(element);
                    }
                    for (var d = 0; d < array.length; d++) {
                        document.getElementById(container).appendChild(array[d]);
                    }

                    for (var z = 0; z < elements_before_active; z++) {
                        var element = document.getElementsByClassName(item)[elements_length];

                        document.getElementsByClassName(item)[elements_length].parentElement.removeChild(document.getElementsByClassName(item)[elements_length]);

                        //document.getElementsByClassName(item)[elements_length].remove();
                        document.getElementById(container).insertBefore(element, document.getElementsByClassName(item)[0]);
                    }
                    break;
                }
            }
        }
        , nextCat: function () {
            if (state_obj.state == 'settings') {
                channels_settings.navigate('right');
            } else if (state_obj.state == 'settings_ratio') {
                channels_settings_ratio.navigate('right');
            } else if (state_obj.state == 'program') {
                program.navigate('right');
            } else if (state_obj.state == 'android_channel_menu') {
                android_channel_menu.navigate('next_cat');
            }
        }
        , prevCat: function () {
            if (state_obj.state == 'settings') {
                channels_settings.navigate('left');
            } else if (state_obj.state == 'settings_ratio') {
                channels_settings_ratio.navigate('left');
            } else if (state_obj.state == 'program') {
                program.navigate('left');
            } else if (state_obj.state == 'android_channel_menu') {
                android_channel_menu.navigate('prev_cat');
            }
        }
        //Всплывающие инфо плашки при нажатии ОК
        , showLegend: function (content) {
            if (player.player_type == PlatformManager.integratedVideo) {
                this.updateTimerLegend();
            }

            menu_cont.setContentClass("navigate_info", content);
            document.getElementsByClassName('navigate_info')[0].style.display = 'block';
        }
        , hideLegend: function () {
            document.getElementsByClassName('navigate_info')[0].style.display = 'none';
        }
        , updateTimerLegend: function () {

            clearTimeout(this.timer_legend);
            this.timer_legend = setTimeout('menu_cont.hideLegend();', ConstValue.cTimeoutShowLegend);
        }
        , hidePlayersAndLegends: function () {
            menu_cont.hideLegend();
            arch_player.hide('view');
            vod_player.disappear();
        }
        , clickPlayer :function () {

            if (state_obj.state == "live_player" && document.getElementsByClassName('player_container')[0].style.display != 'block') {
                arch_player.showLegend('mouse');
            } else if (state_obj.state == "vod_player" && document.getElementsByClassName('player_container')[0].style.display != 'block') {
                vod_player.showLegend('mouse');
            }
            return false;
        }
        ,getBtnFwd :function () {
            if(PlatformManager.getDevice() == PlatformManager.Dune) {
                return "images/btn_next.png";
            }
            return "images/btn_fwd.png";
        }
        ,getBtnBwd :function () {
            if(PlatformManager.getDevice() == PlatformManager.Dune) {
                return "images/btn_prev.png";
            }
            return "images/btn_bwd.png";
        }
    }

})();


/// /state obj
var KeyboardManager = (function () {
    return {
        inputValue: ""
        ,
        inputValueMaxLen: 28

        ,
        language: ""
        ,KeysPerLine:9
        ,
        lettersSize: ""
        ,
        onSearchCallBack: null
        ,
        onReturnCallBack: null
        ,
        init: function (text, type) {
            this.init = true;
            this.language = ConstValue.cKeyboardLanguage_RU;
            this.lettersSize = ConstValue.cKeyboardLetterSize_BIG;

            KeyboardManager.Letters = new List();
            KeyboardManager.Letters.SetCurrentPageGhangedCallback(KeyboardManager.updateLettersList);
            KeyboardManager.Letters.SetCurrentElementGhangedCallback(KeyboardManager.updateLetters);

            KeyboardManager.russian = [
                {title:{small:'1',big:'1'}}
                ,{title:{small:'2',big:'2'}}
                ,{title:{small:'3',big:'3'}}
                ,{title:{small:'4',big:'4'}}
                ,{title:{small:'5',big:'5'}}
                ,{title:{small:'6',big:'6'}}
                ,{title:{small:'7',big:'7'}}
                ,{title:{small:'8',big:'8'}}
                ,{title:{small:'9',big:'9'}}
                ,{title:{small:'0',big:'0'}}
                ,{title:{small:'а',big:'А'}}
                ,{title:{small:'б',big:'Б'}}
                ,{title:{small:'в',big:'В'}}
                ,{title:{small:'г',big:'Г'}}
                ,{title:{small:'д',big:'Д'}}
                ,{title:{small:'е',big:'Е'}}
                ,{title:{small:'ё',big:'Ё'}}
                ,{title:{small:'ж',big:'Ж'}}
                ,{title:{small:'з',big:'З'}}
                ,{title:{small:'и',big:'И'}}
                ,{title:{small:'й',big:'Й'}}
                ,{title:{small:'к',big:'К'}}
                ,{title:{small:'л',big:'Л'}}
                ,{title:{small:'м',big:'М'}}
                ,{title:{small:'н',big:'Н'}}
                ,{title:{small:'о',big:'О'}}
                ,{title:{small:'п',big:'П'}}
                ,{title:{small:'р',big:'Р'}}
                ,{title:{small:'с',big:'С'}}
                ,{title:{small:'т',big:'Т'}}
                ,{title:{small:'у',big:'У'}}
                ,{title:{small:'ф',big:'Ф'}}
                ,{title:{small:'х',big:'Х'}}
                ,{title:{small:'ц',big:'Ц'}}
                ,{title:{small:'ч',big:'Ч'}}
                ,{title:{small:'ш',big:'Ш'}}
                ,{title:{small:'щ',big:'Щ'}}
                ,{title:{small:'ъ',big:'Ъ'}}
                ,{title:{small:'ы',big:'Ы'}}
                ,{title:{small:'ь',big:'Ь'}}
                ,{title:{small:'э',big:'Э'}}
                ,{title:{small:'ю',big:'Ю'}}
                ,{title:{small:'я',big:'Я'}}
                ,{title:{small:'-',big:'-'}}
                ,{title:{small:'.',big:'.'}}

            ];

            KeyboardManager.english = [
                {title:{small:'1',big:'1'}}
                ,{title:{small:'2',big:'2'}}
                ,{title:{small:'3',big:'3'}}
                ,{title:{small:'4',big:'4'}}
                ,{title:{small:'5',big:'5'}}
                ,{title:{small:'6',big:'6'}}
                ,{title:{small:'7',big:'7'}}
                ,{title:{small:'8',big:'8'}}
                ,{title:{small:'9',big:'9'}}
                ,{title:{small:'0',big:'0'}}
                ,{title:{small:'a',big:'A'}}
                ,{title:{small:'b',big:'B'}}
                ,{title:{small:'c',big:'C'}}
                ,{title:{small:'d',big:'D'}}
                ,{title:{small:'e',big:'E'}}
                ,{title:{small:'f',big:'F'}}
                ,{title:{small:'g',big:'G'}}
                ,{title:{small:'h',big:'H'}}
                ,{title:{small:'i',big:'I'}}
                ,{title:{small:'j',big:'J'}}
                ,{title:{small:'k',big:'K'}}
                ,{title:{small:'l',big:'L'}}
                ,{title:{small:'m',big:'M'}}
                ,{title:{small:'n',big:'N'}}
                ,{title:{small:'o',big:'O'}}
                ,{title:{small:'p',big:'P'}}
                ,{title:{small:'q',big:'Q'}}
                ,{title:{small:'r',big:'R'}}
                ,{title:{small:'s',big:'S'}}
                ,{title:{small:'t',big:'T'}}
                ,{title:{small:'u',big:'U'}}
                ,{title:{small:'v',big:'V'}}
                ,{title:{small:'w',big:'W'}}
                ,{title:{small:'x',big:'X'}}
                ,{title:{small:'y',big:'Y'}}
                ,{title:{small:'z',big:'Z'}}
                ,{title:{small:'@',big:'@'}}
                ,{title:{small:'?',big:'?'}}
                ,{title:{small:':',big:':'}}
                ,{title:{small:'#',big:'#'}}
                ,{title:{small:'/',big:'/'}}
                ,{title:{small:'_',big:'_'}}
                ,{title:{small:',',big:','}}
                ,{title:{small:'-',big:'-'}}
                ,{title:{small:'.',big:'.'}}
            ];

        }
        ,show:function(ok_press) {
            try {
                menu_cont.buildTemplate('Keyboard');
                KeyboardManager.sub_state = 'middle';
                auth_window.hide();

                var content = '';

                content += '<div class="keyboard_container">' +
                '<div id="keyboard_top">' +
                '<div class="keyboard_key" onmouseover="KeyboardManager.removeAllActiveClass();" id="keyboard_key_input"></div>' +
                '<div class="keyboard_key" onmouseover="KeyboardManager.removeAllActiveClass();" id="keyboard_key_clear" onclick="KeyboardManager.ClearLastKeyInInputValue();" ondblclick="KeyboardManager.ClearLastKeyInInputValue();" ><img src="images/delete_128x128.png" /></div>' +
                '<div class="keyboard_key" onmouseover="KeyboardManager.removeAllActiveClass();" id="keyboard_key_clear_all" onclick="KeyboardManager.ClearInputValue()" ondblclick="KeyboardManager.ClearInputValue();"  ><img src="images/delete_all_128x128.png" /></div>' +
                '</div>' +
                '<div id="keyboard_middle" ></div>' +
                '<div id="keyboard_bottom" >' +
                '<div class="keyboard_key" onmouseover="KeyboardManager.removeAllActiveClass();"  id="keyboard_key_lang" onclick="KeyboardManager.SetNewLanguage()" ondblclick="KeyboardManager.SetNewLanguage();" >ru/eng</div>' +
                '<div class="keyboard_key" onmouseover="KeyboardManager.removeAllActiveClass();" id="keyboard_key_case" onclick="KeyboardManager.SetNewLetterSize()" ondblclick="KeyboardManager.SetNewLetterSize();"  >A/a</div>' +
                '<div class="keyboard_key space" onmouseover="KeyboardManager.removeAllActiveClass();" id="keyboard_key_space" onclick="KeyboardManager.KeyboardPressSpace()" ondblclick="KeyboardManager.KeyboardPressSpace();" >Пробел</div>' +
                '<div class="keyboard_key search" onmouseover="KeyboardManager.removeAllActiveClass();" id="keyboard_key_search" onclick="KeyboardManager.KeyboardPressSearch()" ondblclick="KeyboardManager.KeyboardPressSearch();"  >OK</div>' +
                '</div>' +
                '</div>';

                menu_cont.setContentClass("content", content);

                this.fillLetters();

                if (ok_press) KeyboardManager.updateLetters();
            }catch(e){
                statusbar.show(e);
                DataManager.writeLog('Keyboard show error = ' + e+' stack = '+ e.stack);
            }
        }
        ,removeAllActiveClass: function() {
            var active_element = document.getElementsByClassName('keyboard_container')[0].getElementsByClassName('active')[0];
            if(active_element) removeClass(active_element,"active");
        }
        ,fillLetters:function() {
            KeyboardManager.Letters.Init(KeyboardManager[KeyboardManager.GetLanguage()],KeyboardManager.KeysPerLine);
            var keys = '';
            KeyboardManager.Letters.elements.forEach(function(key,i){
                var letter = key.title[KeyboardManager.GetLettersSize()];
                keys += '<div class="keyboard_key" id="key_'+i+'" onmouseover="KeyboardManager.removeAllActiveClass();" ondblclick=KeyboardManager.addInputValue("'+letter+'")  onclick=KeyboardManager.addInputValue("'+letter+'") >'+letter+'</div>';
            });

            menu_cont.setContentId('keyboard_middle',keys);

            KeyboardManager.addInputValue('');
        }
        ,
        SetLanguage: function (aLanguage) {
            if ((aLanguage === ConstValue.cKeyboardLanguage_RU) || (aLanguage === ConstValue.cKeyboardLanguage_EN)) {
                this.language = aLanguage;
            }

            return false;
        }
        ,
        GetLanguage: function () {
            return this.language;
        }
        ,
        GetLettersSize: function () {
            return this.lettersSize;
        }
        ,
        SetLetterSize: function (aLetterSize) {
            if ((aLetterSize === ConstValue.cKeyboardLetterSize_BIG) || (aLetterSize === ConstValue.cKeyboardLetterSize_SMALL)) {
                this.lettersSize = aLetterSize;
            }

            return false;
        }
        ,
        SetNewLetterSize: function () {

            if (this.lettersSize === ConstValue.cKeyboardLetterSize_BIG) {
                this.SetLetterSize(ConstValue.cKeyboardLetterSize_SMALL);
            } else {
                this.SetLetterSize(ConstValue.cKeyboardLetterSize_BIG);
            }

            this.fillLetters();

        }
        ,
        SetNewLanguage: function () {

            if (this.language === ConstValue.cKeyboardLanguage_RU) {
                this.SetLanguage(ConstValue.cKeyboardLanguage_EN);
            } else {
                this.SetLanguage(ConstValue.cKeyboardLanguage_RU);
            }

            KeyboardManager.Letters.Init(KeyboardManager[KeyboardManager.GetLanguage()],KeyboardManager.KeysPerLine);

            this.fillLetters();
        }
        ,
        KeyboardPressSpace: function () {
            if (this.inputValue.length < this.inputValueMaxLen) {
                this.inputValue = this.inputValue + ' ';
                this.UpdateKeyboardInputValue(this.inputValue);
            }
        }
        ,
        KeyboardPressSearch: function () {
            if (this.onSearchCallBack) {
                this.onSearchCallBack(KeyboardManager.inputValue);
                this.onSearchCallBack = null;
                this.inputValue = '';
            }
        }
        ,navigate: function (type) {
            KeyboardManager.old_button = KeyboardManager.Letters.GetCurrentElementIndex();
            if (type == 'down') {
                if(KeyboardManager.sub_state == 'top') {
                    this.activateMiddle();
                } else if(KeyboardManager.sub_state == 'middle') {
                    if((KeyboardManager.old_button + KeyboardManager.KeysPerLine) >= KeyboardManager.Letters.elementCount) {
                        this.activateBottom();
                    } else {
                        KeyboardManager.Letters.SetNextPage();
                    }
                } else if(KeyboardManager.sub_state == 'bottom') {
                    this.activateTop();
                }
                return false;
            } else if (type == 'up') {
                if(KeyboardManager.sub_state == 'top') {
                    this.activateBottom();
                    return false;
                } else if(KeyboardManager.sub_state == 'middle') {
                    if((KeyboardManager.old_button - KeyboardManager.KeysPerLine) < 0) {
                        this.activateTop();
                    } else {
                        KeyboardManager.Letters.SetPrevPage();
                    }
                } else if(KeyboardManager.sub_state == 'bottom') {
                    this.activateMiddle();
                }

            } else if (type == 'left') {
                if(KeyboardManager.sub_state == 'top') {

                    removeClass(document.getElementById(KeyboardManager.top_active_element), "active");
                    if(KeyboardManager.top_active_element == 'keyboard_key_clear_all') {
                        KeyboardManager.top_active_element = 'keyboard_key_clear';
                    } else {
                        KeyboardManager.top_active_element = 'keyboard_key_clear_all';
                    }
                    addClass(document.getElementById(KeyboardManager.top_active_element), "active");

                } else if(KeyboardManager.sub_state == 'middle') {
                    if (KeyboardManager.Letters.elementInCurrentPageIndex == 0){
                        KeyboardManager.Letters.SetCurrentElementByIndex((KeyboardManager.Letters.currentPageIndex * KeyboardManager.Letters.elementInPageCount) + (KeyboardManager.Letters.elementInPageCount-1));
                    } else {
                        KeyboardManager.Letters.MoveCurrentElementToUp();
                    }
                } else if(KeyboardManager.sub_state == 'bottom') {

                    KeyboardManager.bottom_active_element_old = KeyboardManager.bottom_active_element;
                    if(KeyboardManager.bottom_active_element =='keyboard_key_search') KeyboardManager.bottom_active_element = 'keyboard_key_space';
                    else if(KeyboardManager.bottom_active_element =='keyboard_key_space') KeyboardManager.bottom_active_element = 'keyboard_key_case';
                    else if(KeyboardManager.bottom_active_element == 'keyboard_key_case') KeyboardManager.bottom_active_element = 'keyboard_key_lang';
                    else if(KeyboardManager.bottom_active_element == 'keyboard_key_lang') KeyboardManager.bottom_active_element = 'keyboard_key_search';
                    else return false;

                    addClass(document.getElementById(KeyboardManager.bottom_active_element), "active");
                    removeClass(document.getElementById(KeyboardManager.bottom_active_element_old), "active");
                }

            } else if (type == 'right') {
                if(KeyboardManager.sub_state == 'top') {
                    removeClass(document.getElementById(KeyboardManager.top_active_element), "active");
                    if(KeyboardManager.top_active_element == 'keyboard_key_clear_all') {
                        KeyboardManager.top_active_element = 'keyboard_key_clear';
                    } else {
                        KeyboardManager.top_active_element = 'keyboard_key_clear_all';
                    }
                    addClass(document.getElementById(KeyboardManager.top_active_element), "active");
                } else if(KeyboardManager.sub_state == 'middle') {
                    if (KeyboardManager.Letters.elementInCurrentPageIndex == KeyboardManager.Letters.elementInPageCount - 1){
                        KeyboardManager.Letters.SetCurrentElementByIndex(KeyboardManager.Letters.currentPageIndex * KeyboardManager.Letters.elementInPageCount);
                    } else {
                        KeyboardManager.Letters.MoveCurrentElementToDown();
                    }

                } else if(KeyboardManager.sub_state == 'bottom') {

                    KeyboardManager.bottom_active_element_old = KeyboardManager.bottom_active_element;
                    if(KeyboardManager.bottom_active_element == 'keyboard_key_lang') KeyboardManager.bottom_active_element = 'keyboard_key_case';
                    else if(KeyboardManager.bottom_active_element == 'keyboard_key_case') KeyboardManager.bottom_active_element = 'keyboard_key_space';
                    else if(KeyboardManager.bottom_active_element == 'keyboard_key_space') KeyboardManager.bottom_active_element = 'keyboard_key_search';
                    else if(KeyboardManager.bottom_active_element == 'keyboard_key_search') KeyboardManager.bottom_active_element = 'keyboard_key_lang';
                    else return false;

                    addClass(document.getElementById(KeyboardManager.bottom_active_element), "active");
                    removeClass(document.getElementById(KeyboardManager.bottom_active_element_old), "active");

                }



            } else if (type == 'ok') {
                if(KeyboardManager.sub_state == 'top') {
                    if(KeyboardManager.top_active_element == 'keyboard_key_clear') {
                        KeyboardManager.ClearLastKeyInInputValue();
                    } else if(KeyboardManager.top_active_element == 'keyboard_key_clear_all') {
                        KeyboardManager.ClearInputValue();
                    }

                } else if(KeyboardManager.sub_state == 'middle') {

                    KeyboardManager.addInputValue(KeyboardManager.Letters.getCurrentElement().title[KeyboardManager.GetLettersSize()]);

                } else if(KeyboardManager.sub_state == 'bottom') {
                    if(KeyboardManager.bottom_active_element == 'keyboard_key_lang') KeyboardManager.SetNewLanguage();
                    else if(KeyboardManager.bottom_active_element == 'keyboard_key_case') KeyboardManager.SetNewLetterSize();
                    else if(KeyboardManager.bottom_active_element == 'keyboard_key_space') KeyboardManager.KeyboardPressSpace();
                    else if(KeyboardManager.bottom_active_element == 'keyboard_key_search') KeyboardManager.KeyboardPressSearch();
                }
            }

            return false;
        }

        ,updateLetters: function () {
            if(KeyboardManager.sub_state == 'middle')
                navigation.setActive('key', KeyboardManager.Letters.GetCurrentElementIndex(), KeyboardManager.old_button);
        }
        ,activateTop: function () {
            if(KeyboardManager.sub_state == 'bottom') {
                KeyboardManager.sub_state = 'top';
                KeyboardManager.top_active_element = 'keyboard_key_clear';
                addClass(document.getElementById(KeyboardManager.top_active_element), "active");
                removeClass(document.getElementById(KeyboardManager.bottom_active_element), "active");
                KeyboardManager.Letters.SetCurrentElementByIndex(7);
                return false;
            }

            KeyboardManager.sub_state = 'top';
            removeClass(document.getElementById('key_' + KeyboardManager.old_button), "active");
            KeyboardManager.top_active_element = 'keyboard_key_clear';
            addClass(document.getElementById(KeyboardManager.top_active_element), "active");

        }
        , activateBottom: function () {
            if(KeyboardManager.sub_state == 'top') {
                KeyboardManager.sub_state = 'bottom';
                KeyboardManager.bottom_active_element = 'keyboard_key_search';
                addClass(document.getElementById(KeyboardManager.bottom_active_element), "active");
                removeClass(document.getElementById('keyboard_key_clear'), "active");
                removeClass(document.getElementById('keyboard_key_clear_all'), "active");
                KeyboardManager.Letters.SetCurrentElementByIndex(43);
                return false;
            }

            KeyboardManager.sub_state = 'bottom';
            removeClass(document.getElementById('key_' + KeyboardManager.old_button), "active");

            if(KeyboardManager.Letters.GetElementInCurrentPageIndex() == 0) KeyboardManager.bottom_active_element = 'keyboard_key_lang';
            else if(KeyboardManager.Letters.GetElementInCurrentPageIndex() == 1) KeyboardManager.bottom_active_element = 'keyboard_key_case';
            else if(KeyboardManager.Letters.GetElementInCurrentPageIndex() > 6) KeyboardManager.bottom_active_element = 'keyboard_key_search';
            else KeyboardManager.bottom_active_element = 'keyboard_key_space';

            addClass(document.getElementById(KeyboardManager.bottom_active_element), "active");
            return false;
        }
        , activateMiddle: function () {
            KeyboardManager.sub_state = 'middle';
            navigation.setActive('key', KeyboardManager.Letters.GetCurrentElementIndex(), KeyboardManager.old_button);
            removeClass(document.getElementById('keyboard_key_clear'), "active");
            removeClass(document.getElementById('keyboard_key_clear_all'), "active");
            removeClass(document.getElementById('keyboard_key_lang'), "active");
            removeClass(document.getElementById('keyboard_key_case'), "active");
            removeClass(document.getElementById('keyboard_key_search'), "active");
            removeClass(document.getElementById('keyboard_key_space'), "active");
        }
        , ClearInputValue: function () {

            this.inputValue = "";
            KeyboardManager.UpdateKeyboardInputValue(this.inputValue);

        }
        , ClearLastKeyInInputValue: function () {

            if (this.inputValue.length > 0) {
                this.inputValue = this.inputValue.substring(0, this.inputValue.length - 1)
            }
            KeyboardManager.UpdateKeyboardInputValue(this.inputValue);
        }
        ,addInputValue: function (aInputValue) {
            if (this.inputValue.length < this.inputValueMaxLen) {
                this.inputValue += aInputValue;
                KeyboardManager.UpdateKeyboardInputValue(this.inputValue);
            }
        }
        , UpdateKeyboardInputValue: function (aInputValue) {
           document.getElementById('keyboard_key_input').innerHTML= aInputValue;
        }
        ,goBack: function () {
            KeyboardManager.KeyboardPressSearch();
            //if(KeyboardManager.onReturnCallBack) KeyboardManager.onReturnCallBack();

        }
        ,hide: function () {
            menu_cont.hide();
        }


    }
})();


// ConstValue
var ConstValue = (function () {
    return {
        cKeyboardLanguage_RU: 'russian'
        , cKeyboardLanguage_EN: 'english'
        , cKeyboardLetterSize_SMALL: 'small'
        , cKeyboardLetterSize_BIG: 'big'
        , cSamsungBufferingStart: 11
        , cSamsungBufferingProgress: 13
        , cSamsungBufferingComplete: 12
        , cSamsungCurrentTime: 14
        , cTimeoutGetSource: 500
        , cTimeoutShowLegend: 5000
        , cTimeoutShowChannelsList: 8000
        , cIcon_100_100: '100_100_1'
        , cKeyOk:0
        , cKeyCancel:1
        , cKeyOkCancel:2
    }
})();

//state obj
var state_obj = (function () {
    return {
        state: ""
        , video_state: "live"// live vod archive
        , state_prev: ""
    }
})();

var statusbar = (function () {
    return {
        type: 0
        , timer: 0
        , timerVolume: 0
        , timeShow: 3000
        , show: function (text, type) {
            clearTimeout(this.timer);
            this.type = type;
            document.getElementById('statusbar').innerHTML = text;
            document.getElementById('statusbar').style.top = '5px';
            statusbar.timer = setTimeout('statusbar.hide()', statusbar.timeShow);
        }
        , hide: function () {
            this.type = 0;
            document.getElementById('statusbar').innerHTML = '';
            document.getElementById('statusbar').style.top = '-100px';
        }
        ,showVolume: function (val) {
            var image = 'images/icon_volume_max.png';

            if(!val || val < 1) image = 'images/icon_volume_off.png';


            var content = '<div id="center_block_page" class="center">';

            if(val) content += '<div id="volume_val">' + val + '</div>';

            content += '<div id="volume_image_container"><img id="volume_images" src='+image+' </div>';
            content += '</div>';

            var element = document.getElementById('center_block');
            menu_cont.setContentId("center_block", content);

            element.style.display = 'block';

            addClass(element,'small_block');
            clearTimeout(this.timerVolume);

            if(val) statusbar.timerVolume = setTimeout('statusbar.hideVolume()', statusbar.timeShow);
        }
        ,hideVolume: function (val) {
            var element = document.getElementById('center_block');
            element.style.display = 'none';
            removeClass(element,'small_block')
        }

    }
})();
var spin_obj = (function () {
    return {
        timer: 0
        ,start: function () {
            document.getElementById('loader').style.display = 'block';
            clearTimeout(spin_obj.timer);
            spin_obj.timer = setTimeout('spin_obj.stop();', 60000);
        }
        , stop: function () {
            document.getElementById('loader').style.display = 'none';
        }
    }
})();


/**
 *
 */
var time_obj = (function () {
    return {
        //12:03
        time: 0
        //"+10800"
        , tzone: ''
        //0
        , tshift: 0
        //1401354043 без учета тайм зоны
        , unix_time: 0
        //1401854029 c учетом тайм зоны
        , unix_time_timezone: 0
        , time_timezone: 0
        //"29 Мая. Чт."
        , date_week: ''
        //время округленое до 30 мин (12.00 12.30 13.00)
        , ut_timezone_hour: 0
        , days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        , months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
        , show: function (type) {
            document.getElementById(type).style.display = 'block';
        }
        , hide: function (type) {
            document.getElementById(type).style.display = 'none';
        }
        , insertTime: function () {
            //каждую минуту обновляет время во всех блоках с класом time
            var time = document.getElementsByClassName('time');
            var time_str = DataManager.unixToTime(time_obj.unix_time_timezone);
            for (var i = 0; i < time.length; i++) {
                time[i].innerHTML = time_str;
            }
        }
    }
})();

Mouse = (function () {
    return {
        moveMouseWheel: function (e, param) {
            var evt = window.event || e;
            var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;

            if ((param !== undefined) && (param !== null)) {
                if (delta <= -120) {
                    if (state_obj.state == "program") {
                        if (param == 'channels') {
                            program.program_num = 0;
                            program.navigate('down');
                        }
                        if (param == 'epg') {
                            if (!program.stop_scroll_program) {
                                program.navigate('down_program');
                            }
                        }
                    }
                } else {
                    if (state_obj.state == "program") {
                        if (param == 'channels') {
                            program.program_num = 0;
                            program.navigate('up');
                        }
                        if (param == 'epg') {
                            if (!program.stop_scroll_program) {
                                program.navigate('up_program');
                            }
                        }
                    }
                }
            }
            if (delta <= -120) {
                if (state_obj.state == "vod") {
                    VODManager.navigate('down');
                }
                if (state_obj.state == "dropdown_menu") {
                    dropdown_menu.navigate('down');
                }
                if (state_obj.state == "settings") {
                    if (settings.state == 'channels_settings') {
                        channels_settings.navigate('down');
                    }
                }
                if (state_obj.state == "channels_menu") {
                    channel_menu.navigate('down');
                }
            } else {
                if (state_obj.state == "vod") {
                    VODManager.navigate('up');
                }
                if (state_obj.state == "dropdown_menu") {
                    dropdown_menu.navigate('up');
                }
                if (state_obj.state == "settings") {
                    if (settings.state == 'channels_settings') {
                        channels_settings.navigate('up');
                    }
                }
                if (state_obj.state == "channels_menu") {
                    channel_menu.navigate('up');
                }
            }
        }
        , mouseMove: function (event) {
            coords = handleMouseMove(event);
            if (state_obj.state == "live_player" || state_obj.state == "archive_player") {
                if (state_obj.sub_state == 'view') {
                    if (coords.x < 10 || coords.x >= 1270 || coords.y < 10 || coords.y >= 715) {
                        arch_player.showLegend('mouse');
                    }
                }
                if (state_obj.sub_state == 'player') {
                    arch_player.updateTimer();
                }
            }
            if (state_obj.state == "vod_player") {
                if (!vod_player.active) {
                    if (coords.x < 10 || coords.x >= 1270 || coords.y < 10 || coords.y >= 715) {
                        vod_player.showLegend('mouse');
                    }
                } else {
                    vod_player.updateTimer();
                }
            }
            if (state_obj.state == "channels_menu") {
                channel_menu.updateTimer();
            }
        }
    }
})();


(function () {
    if (!document.getElementsByClassName) {
        var indexOf = [].indexOf || function (prop) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === prop) return i;
                }
                return -1;
            };
        getElementsByClassName = function (className, context) {
            var elems = document.querySelectorAll ? context.querySelectorAll("." + className) : (function () {
                var all = context.getElementsByTagName("*"),
                    elements = [],
                    i = 0;
                for (; i < all.length; i++) {
                    if (all[i].className && (" " + all[i].className + " ").indexOf(" " + className + " ") > -1 && indexOf.call(elements, all[i]) === -1) elements.push(all[i]);
                }
                return elements;
            })();
            return elems;
        };
        document.getElementsByClassName = function (className) {
            return getElementsByClassName(className, document);
        };
        Element.prototype.getElementsByClassName = function (className) {
            return getElementsByClassName(className, this);
        };
    }
})();


function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(ele, cls) {
    if (!ele) return false;
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}
function removeClass(ele, cls) {
    if (!ele) return false;
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
        (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
        (doc && doc.scrollTop || body && body.scrollTop || 0) -
        (doc && doc.clientTop || body && body.clientTop || 0 );
    }
    //Use event.pageX / event.pageY here
    return {x: event.pageX, y: event.pageY}
}
function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for (; i < len; i++) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for (i in obj) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}

function dateToString(lday) {
    var cur_day = time_obj.unix_time_timezone + lday * 24 * 60 * 60;
    var lDate = new Date(cur_day * 1000);
    var month = time_obj.months[lDate.getUTCMonth()];
    var day = time_obj.days[lDate.getUTCDay()];

    var string = lDate.getUTCDate() + '. ' + day + '. ' + month;

    return string;
}

function dateToMonthDay(lday) {
    cur_day = time_obj.unix_time_timezone + lday * 24 * 60 * 60;
    var lDate = new Date(cur_day * 1000);
    var month = time_obj.months[lDate.getUTCMonth()];
    var day = time_obj.days[lDate.getUTCDay()];

    var string = lDate.getUTCDate() +'_'+ lDate.getUTCMonth();

    return string;
}

function in_array(what, where) {
    for (var i = 0; i < where.length; i++)
        if (what == where[i])
            return true;
    return false;
}
function toHHMMSS(time_sec) {
    var sec_num = parseInt(time_sec, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

function toHHMM(time_sec) {
    var sec_num = parseInt(time_sec, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes;
    return time;
}

function prepend(parentId, nodeName, html) {
    var obj = document.getElementById(parentId);
    var first = obj.firstChild;
    var newNode = document.createElement(newNodeName);
    newNode.innerHTML(html);
    obj.insertBefore(newNode, first);
}

function hostReachable() {

    // Handle IE and more capable browsers
    var xhr = new ( window.ActiveXObject || XMLHttpRequest )("Microsoft.XMLHTTP");
    var status;

    // Open new request as a HEAD to the root hostname with a random param to bust the cache
    xhr.open("HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false);

    // Issue request and handle response
    try {
        xhr.send();
        return ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) );
    } catch (error) {
        return false;
    }

}

function isEven(n)
{
    return isNumber(n) && (n % 2 == 0);
}

function isOdd(n)
{
    return isNumber(n) && (Math.abs(n) % 2 == 1);
}
function isNumber(n)
{
    return n == parseFloat(n);
}

function initSTB() {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    stb = gSTB;
    stb.SetMode(1);
    stb.SetupRTSP(4,1);
    stb.SetAspect('3');
    stb.InitPlayer();
    stb.SetAlphaLevel("255");
    stb.SetWinAlphaLevel(0,230);
    window.moveTo(0,0);
    window.resizeTo(screen.width,screen.height);
    stb.SetPIG('1','1','0','0');
    stb.SetListFilesExt(".mpg .mkv+ .avi .ts .mp4 .flv .wmv .mp3 .ac3 .mov .vob .wav .m2ts");
}