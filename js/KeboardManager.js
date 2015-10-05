var Keyboard = {
    plugin: null
};

Keyboard.VK_NONE = -1;
Keyboard.VK_ENTER = 13;
Keyboard.VK_PAUSE = 19;
Keyboard.VK_PAGE_UP = 33;
Keyboard.VK_PAGE_DOWN = 34;
Keyboard.VK_LEFT = 37;
Keyboard.VK_UP = 38;
Keyboard.VK_RIGHT = 39;
Keyboard.VK_DOWN = 40;
Keyboard.VK_0 = 48;
Keyboard.VK_1 = 49;
Keyboard.VK_2 = 50;
Keyboard.VK_3 = 51;
Keyboard.VK_4 = 52;
Keyboard.VK_5 = 53;
Keyboard.VK_6 = 54;
Keyboard.VK_7 = 55;
Keyboard.VK_8 = 56;
Keyboard.VK_9 = 57;
Keyboard.VK_RED = 403;
Keyboard.VK_GREEN = 404;
Keyboard.VK_YELLOW = 405;
Keyboard.VK_BLUE = 406;
Keyboard.VK_FAST_REWIND_LEFT = 412;
Keyboard.VK_FAST_REWIND_RIGHT = 417;
Keyboard.VK_STOP = 413;
Keyboard.VK_PLAY = 415;
Keyboard.VK_INFO = 457;
Keyboard.VK_BACK = 461;
Keyboard.VK_HID_BACK = 8;
Keyboard.vol = 50;




Keyboard.Init = function () {

    this.KEYCODE_ENTER = Keyboard.VK_ENTER;
    this.KEYCODE_PAUSE = Keyboard.VK_PAUSE;
    this.KEYCODE_CHANNEL_UP = Keyboard.VK_PAGE_UP;
    this.KEYCODE_CHANNEL_DOWN = Keyboard.VK_PAGE_DOWN;
    this.KEYCODE_LEFT = Keyboard.VK_LEFT;
    this.KEYCODE_UP = Keyboard.VK_UP;
    this.KEYCODE_RIGHT = Keyboard.VK_RIGHT;
    this.KEYCODE_DOWN = Keyboard.VK_DOWN;
    this.KEYCODE_0 = Keyboard.VK_0;
    this.KEYCODE_1 = Keyboard.VK_1;
    this.KEYCODE_2 = Keyboard.VK_2;
    this.KEYCODE_3 = Keyboard.VK_3;
    this.KEYCODE_4 = Keyboard.VK_4;
    this.KEYCODE_5 = Keyboard.VK_5;
    this.KEYCODE_6 = Keyboard.VK_6;
    this.KEYCODE_7 = Keyboard.VK_7;
    this.KEYCODE_8 = Keyboard.VK_8;
    this.KEYCODE_9 = Keyboard.VK_9;


    switch (PlatformManager.getDevice()) {
    /**
     * LG
     */
        case PlatformManager.LG:

            this.KEYCODE_RED = Keyboard.VK_RED;
            this.KEYCODE_GREEN = Keyboard.VK_GREEN;
            this.KEYCODE_YELLOW = Keyboard.VK_YELLOW;
            this.KEYCODE_BLUE = Keyboard.VK_BLUE;
            this.KEYCODE_FAST_REWIND_LEFT = Keyboard.VK_FAST_REWIND_LEFT;
            this.KEYCODE_FAST_REWIND_RIGHT = Keyboard.VK_FAST_REWIND_RIGHT;
            this.KEYCODE_STOP = Keyboard.VK_STOP;
            this.KEYCODE_PLAY = Keyboard.VK_PLAY;
            this.KEYCODE_INFO = Keyboard.VK_INFO;
            this.KEYCODE_RETURN = Keyboard.VK_BACK;

            this.init = true;
            break;
    /**
     * SAMSUNG
     *
     */
        case PlatformManager.SAMSUNG:

            this.enableKeys("anchor");

            if (Main.tvKeyAPI) {

                this.KEYCODE_ENTER = Main.tvKeyAPI.KEY_ENTER;
                this.KEYCODE_PAUSE = Main.tvKeyAPI.KEY_PAUSE;
                this.KEYCODE_CHANNEL_UP = Main.tvKeyAPI.KEY_CH_UP;
                this.KEYCODE_CHANNEL_DOWN = Main.tvKeyAPI.KEY_CH_DOWN;
                this.KEYCODE_LEFT = Main.tvKeyAPI.KEY_LEFT;
                this.KEYCODE_UP = Main.tvKeyAPI.KEY_UP;
                this.KEYCODE_RIGHT = Main.tvKeyAPI.KEY_RIGHT;
                this.KEYCODE_DOWN = Main.tvKeyAPI.KEY_DOWN;

                this.KEYCODE_RED = Main.tvKeyAPI.KEY_RED;
                this.KEYCODE_GREEN = Main.tvKeyAPI.KEY_GREEN;
                this.KEYCODE_YELLOW = Main.tvKeyAPI.KEY_YELLOW;
                this.KEYCODE_BLUE = Main.tvKeyAPI.KEY_BLUE;
                this.KEYCODE_FAST_REWIND_LEFT = Main.tvKeyAPI.KEY_RW;
                this.KEYCODE_STOP = Main.tvKeyAPI.KEY_STOP;
                this.KEYCODE_PLAY = Main.tvKeyAPI.KEY_PLAY;
                this.KEYCODE_FAST_REWIND_RIGHT = Main.tvKeyAPI.KEY_FF;
                this.KEYCODE_INFO = Main.tvKeyAPI.KEY_INFO;
                this.KEYCODE_RETURN = Main.tvKeyAPI.KEY_RETURN;
                this.KEYCODE_PANEL_RETURN = Main.tvKeyAPI.KEY_PANEL_RETURN;
                this.KEYCODE_PANEL_ENTER = Main.tvKeyAPI.KEY_PANEL_ENTER;
                this.KEYCODE_PANEL_CH_UP = Main.tvKeyAPI.KEY_PANEL_CH_UP;
                this.KEYCODE_PANEL_CH_DOWN = Main.tvKeyAPI.KEY_PANEL_CH_DOWN;
                this.KEYCODE_VOL_UP = Main.tvKeyAPI.KEY_VOL_UP;
                this.KEYCODE_PANEL_VOL_UP = Main.tvKeyAPI.KEY_PANEL_VOL_UP;
                this.KEYCODE_VOL_DOWN = Main.tvKeyAPI.KEY_VOL_DOWN;
                this.KEYCODE_PANEL_VOL_DOWN = Main.tvKeyAPI.KEY_PANEL_VOL_DOWN;
                this.KEYCODE_MUTE = Main.tvKeyAPI.KEY_MUTE;
                this.KEYCODE_EXIT = Main.tvKeyAPI.KEY_EXIT;

                this.KEYCODE_0 = Main.tvKeyAPI.KEY_0;
                this.KEYCODE_1 = Main.tvKeyAPI.KEY_1;
                this.KEYCODE_2 = Main.tvKeyAPI.KEY_2;
                this.KEYCODE_3 = Main.tvKeyAPI.KEY_3;
                this.KEYCODE_4 = Main.tvKeyAPI.KEY_4;
                this.KEYCODE_5 = Main.tvKeyAPI.KEY_5;
                this.KEYCODE_6 = Main.tvKeyAPI.KEY_6;
                this.KEYCODE_7 = Main.tvKeyAPI.KEY_7;
                this.KEYCODE_8 = Main.tvKeyAPI.KEY_8;
                this.KEYCODE_9 = Main.tvKeyAPI.KEY_9;

                if(PlatformManager.isOldSamsung()) {
                    this.KEYCODE_0 = 48;
                    this.KEYCODE_1 = 49;
                    this.KEYCODE_2 = 50;
                    this.KEYCODE_3 = 51;
                    this.KEYCODE_4 = 52;
                    this.KEYCODE_5 = 53;
                    this.KEYCODE_6 = 54;
                    this.KEYCODE_7 = 55;
                    this.KEYCODE_8 = 56;
                    this.KEYCODE_9 = 57;
                    this.KEYCODE_ENTER = 13;
                    this.KEYCODE_PANEL_RETURN = 8;
		    
		            this.KEYCODE_FAST_REWIND_LEFT = 117;
		            this.KEYCODE_FAST_REWIND_RIGHT = 111;
                }  
            } else {
                statusbar.show('Keyboard.Init ERROR');
                DataManager.writeLog('Keyboard.Init ERROR = ' + e+' stack = '+ e.stack);
            }
            break;

    /**
     * PHILIPS
     *
     */
        case PlatformManager.Philips:

            this.KEYCODE_RED = 403;
            this.KEYCODE_GREEN = 404;
            this.KEYCODE_YELLOW = 502;
            this.KEYCODE_BLUE = 406;

            this.KEYCODE_RETURN = 8;
            this.KEYCODE_STOP = 413;
            this.KEYCODE_PLAY = 415;
            this.KEYCODE_PAUSE = 19;

            this.KEYCODE_FAST_REWIND_LEFT = 412;
            this.KEYCODE_FAST_REWIND_RIGHT = 473;

            this.init = true;
            break;

    /**
     * MAG
     *
     */
        case PlatformManager.MAG_AURA:
            this.KEYCODE_RETURN = 8;
            this.KEYCODE_RED = 112;
            this.KEYCODE_GREEN = 113;
            this.KEYCODE_YELLOW = 114;
            this.KEYCODE_BLUE = 115;

            this.KEYCODE_FAST_REWIND_LEFT = 66;
            this.KEYCODE_FAST_REWIND_RIGHT = 70;

            this.KEYCODE_PANEL_FAST_REWIND_LEFT = 98;
            this.KEYCODE_PANEL_FAST_REWIND_RIGHT = 102;

            this.KEYCODE_CHANNEL_UP = 33;
            this.KEYCODE_CHANNEL_DOWN = 34;

            this.KEYCODE_VOL_UP = 43;
            this.KEYCODE_PANEL_VOL_UP = 107;
            this.KEYCODE_VOL_DOWN = 45;
            this.KEYCODE_PANEL_VOL_DOWN = 109;

            this.KEYCODE_PAUSE = 82;
            this.KEYCODE_VOL_UP = 43;
            this.KEYCODE_VOL_DOWN = 45;
            this.KEYCODE_MUTE = 96;
            this.KEYCODE_PANEL_MUTE = 192;
            this.KEYCODE_CHANNEL_UP_DOWN = 9;
            this.KEYCODE_MENU = 122;
            this.KEYCODE_EXIT = 27;
            this.KEYCODE_STAND_BY = 117;
            this.KEYCODE_PANEL_STAND_BY = 85;

            this.KEYCODE_RESIZE_SCREEN = 72;
            this.init = true;

            break;

        case PlatformManager.iNext:

            this.KEYCODE_RED = 87;
            this.KEYCODE_GREEN = 88;
            this.KEYCODE_YELLOW = 89;
            this.KEYCODE_BLUE = 90;

            this.KEYCODE_RETURN = 81;
            this.KEYCODE_STOP = 67;
            this.KEYCODE_PLAY_PAUSE = 32;

            this.KEYCODE_CHANNEL_UP = 74;
            this.KEYCODE_CHANNEL_DOWN = 73;

            this.KEYCODE_REWIND_LEFT = 66;
            this.KEYCODE_REWIND_RIGHT = 65;

            this.KEYCODE_FAST_REWIND_LEFT = 79;
            this.KEYCODE_FAST_REWIND_RIGHT = 80;

            this.KEYCODE_INFO = 82;
            this.KEYCODE_MENU = 83;
            this.KEYCODE_ZOOM = 76;
            this.KEYCODE_EPG = 191;
            this.KEYCODE_TOOLS = 190;
            this.KEYCODE_PRE_CH = 187;
            break;

        case PlatformManager.Android:
            this.KEYCODE_RED = 112;
            this.KEYCODE_GREEN = 113;
            this.KEYCODE_YELLOW = 114;
            this.KEYCODE_BLUE = 115;
            break;

        //dev test
        case PlatformManager.Dune:
            this.KEYCODE_RETURN = 8;
            this.KEYCODE_STOP = 178;
            this.KEYCODE_MENU = 200;
            this.KEYCODE_FAST_REWIND_LEFT = 177;
            this.KEYCODE_FAST_REWIND_RIGHT = 176;
            this.KEYCODE_POP_UP_MENU = 18;
            this.KEYCODE_RED = 193;
            this.KEYCODE_GREEN = 194;
            this.KEYCODE_YELLOW = 195;
            this.KEYCODE_BLUE = 196;
            this.KEYCODE_CLEAR = 12;
            this.KEYCODE_VOL_UP = 175;
            this.KEYCODE_VOL_DOWN = 174;
            break;

    /**
     * DEBUG
     *
     */
        case PlatformManager.Debug:
            this.KEYCODE_RED = 81; //q
            this.KEYCODE_GREEN = 87; //w
            this.KEYCODE_YELLOW = 69; //e
            this.KEYCODE_BLUE = 82; //r
            this.KEYCODE_RETURN = 8; //Backspace

            this.KEYCODE_MENU = 84; //t
            this.KEYCODE_INFO = 73;// i

            this.KEYCODE_STOP = 178;  //stop
            this.KEYCODE_PLAY = 179;  //play
            this.KEYCODE_PAUSE = 177; //Replay like pause 

            this.KEYCODE_CHANNEL_UP = 33; //page up
            this.KEYCODE_CHANNEL_DOWN = 34;  //page down

            this.KEYCODE_VOL_UP = 109;
            this.KEYCODE_VOL_DOWN = 107;

            this.KEYCODE_FAST_REWIND_LEFT = 188;
            this.KEYCODE_FAST_REWIND_RIGHT = 190;

            this.init = true;

            break;
    }
    return this.init;

}


Keyboard.processKeyDown = function (e) {

    if (state_obj.state == "blocked") {
        return false;
    }

    var  key = keyCode(e);

    //statusbar.show('key_kode = ' +key);
    //statusbar.show('key = '+key+' Keyboard.KEYCODE_RETURN = '+Keyboard.KEYCODE_RETURN +'Keyboard.KEYCODE_EXIT = '+ Keyboard.KEYCODE_EXIT+' is old '+PlatformManager.isOldSamsung() +'Keyboard.KEYCODE_PANEL_RETURN ='+Keyboard.KEYCODE_PANEL_RETURN+'PlatformManager.getDevice() = '+PlatformManager.getDevice());

    if ((PlatformManager.getDevice() != PlatformManager.Android) && (key == Keyboard.KEYCODE_RETURN || key == Keyboard.KEYCODE_EXIT || key == Keyboard.KEYCODE_PANEL_RETURN)) {
        if (PlatformManager.getDevice() == PlatformManager.SAMSUNG) {
            Main.widgetAPI.blockNavigation(e);
        }
        Keyboard.goBack();
        return false;
    }

    //DEV
    if (key == Keyboard.KEYCODE_POP_UP_MENU) {
       modeMenu.show();
    }

    /**
     * KEYCODE_DOWN
     *
     */
    if (key == Keyboard.KEYCODE_DOWN) {
        if (state_obj.state == "auth_menu") {
            AuthManager.navigate('down');
            return false;
        } else if (state_obj.state == "main_menu") {
            MainMenu.navigate('down');
            return false;
        } else if (state_obj.state == "channels_menu") {
            channel_menu.navigate('down');
            return false;
        } else if (state_obj.state == "program") {
            if (program.state == 'channel') {
                program.navigate('down');
                return false;
            } else if (program.state == 'program') {
                program.navigate('down_program');
                return false;
            }
            return false;
        } else if (state_obj.state == "live_player") {
            if(PlatformManager.getDevice() == PlatformManager.iNext) {
                ch_obj.go('prev');
                return false;
            }
            if (state_obj.sub_state == 'view') {
                arch_player.show('player');
                return false;
            } else if (state_obj.sub_state == 'player') {
                arch_player.updateTimer();
                arch_player.seek(-5);
                return false;
            }
            return false;
        } else if (state_obj.state == "vod") {
            VODManager.navigate('down');
            return false;
        } else if (state_obj.state == "vod_genres") {
            vod_genres.navigate('down');
            return false;
        } else if (state_obj.state == "vod_top") {
            vod_top.navigate('down');
            return false;
        } else if (state_obj.state == "vod_search") {
            vod_search.navigate('down');
            return false;
        } else if (state_obj.state == "vod_one") {
            VODManager_one.navigate('down');
            return false;
        } else if (state_obj.state == "vod_player") {
            vod_player.show();
            return false;
        } else if (state_obj.state == "center_block") {
            center_block.navigate('down');
            return false;
        } else if (state_obj.state == "center_block_page") {
            center_block.navigatePage('down');
            return false;
        } else if (state_obj.state == "settings") {
            if (settings.state == 'channels_settings') {
                if (channels_settings.edit_view == 1) {
                    channels_settings.navigate('down');
                    return false;
                } else {
                    channels_settings.navigateChList('down');
                    return false;
                }
            } else if (settings.state == 'parent_pass') {
                parent_menu_obj.navigate('down');
                return false;
            }
            else if (settings.state == 'settings_server' || settings.state == 'settings_playing') {
                settings.navigate('down');
                return false;
            }
            return false;
        } else if (state_obj.state == "ask_parent_pass") {
            parent_menu_obj.navigateAskPass('down');
            return false;
        } else if (state_obj.state == "dropdown_menu") {
            dropdown_menu.navigate('down');
            return false;
        } else if (state_obj.state == "program_date_menu") {
            program.DeActivateDateMenu();
            return false;
        } else if (state_obj.state == "settings_ratio") {
            channels_settings_ratio.navigate('down');
            return false;
        } else if (state_obj.state == "externalPlayer") {
            ExternalPlayerView.navigate('down');
            return false;
        } else if (state_obj.state == "Keyboard") {
            KeyboardManager.navigate('down');
        } else if (state_obj.state == "android_channel_menu") {
            android_channel_menu.navigate('down');
        } else if (state_obj.state == "mode_menu") {
            modeMenu.MoveModeMenu('down');
            return false;
        }
        return false;
    }
    /**
     * KEYCODE_UP
     *
     */
    if (key == Keyboard.KEYCODE_UP) {
        if (state_obj.state == "auth_menu") {
            AuthManager.navigate('up');
            return false;
        } else if (state_obj.state == "main_menu") {
            MainMenu.navigate('up');
            return false;
        } else if (state_obj.state == "channels_menu") {
            channel_menu.navigate('up');
            return false;
        } else if (state_obj.state == "program") {
            if (program.state == 'channel') {
                program.navigate('up');
                return false;
            } else if (program.state == 'program') {
                program.navigate('up_program');
                return false;
            }
            return false;
        } else if (state_obj.state == "live_player") {
            if(PlatformManager.getDevice() == PlatformManager.iNext) {
                ch_obj.go('next');
                return false;
            }
            if (state_obj.sub_state == 'view') {
                menu_cont.hideLegend();
                program.show('archive');
                return false;
            } else if (state_obj.sub_state == 'player') {
                arch_player.updateTimer();
                arch_player.seek(5);
                return false;
            }
            return false;
        } else if (state_obj.state == "vod") {
            VODManager.navigate('up');
            return false;
        } else  if (state_obj.state == "vod_genres") {
            vod_genres.navigate('up');
            return false;
        } else if (state_obj.state == "vod_top") {
            vod_top.navigate('up');
            return false;
        } else if (state_obj.state == "vod_search") {
            vod_search.navigate('up');
            return false;
        } else if (state_obj.state == "vod_one") {
            VODManager_one.navigate('up');
            return false;
        } else if (state_obj.state == "vod_player") {
            vod_player.seek(5);
            return false;
        } else if (state_obj.state == "vod_bottom_menu") {
            VODManager.offBottomMenu();
            return false;
        } else if (state_obj.state == "center_block") {
            center_block.navigate('up');
            return false;
        } else if (state_obj.state == "center_block_page") {
            center_block.navigatePage('up');
            return false;
        } else if (state_obj.state == "settings") {
            if (settings.state == 'channels_settings') {
                if (channels_settings.edit_view == 1) {
                    channels_settings.navigate('up');
                    return false;
                } else {
                    channels_settings.navigateChList('up');
                    return false;
                }
            } else if (settings.state == 'parent_pass') {
                parent_menu_obj.navigate('up');
                return false;
            }
            else if (settings.state == 'settings_server' || settings.state == 'settings_playing') {
                settings.navigate('up');
                return false;
            }
            return false;
        } else if (state_obj.state == "ask_parent_pass") {
            parent_menu_obj.navigateAskPass('up');
            return false;
        } else if (state_obj.state == "dropdown_menu") {
            dropdown_menu.navigate('up');
            return false;
        } else if (state_obj.state == "settings_ratio") {
            channels_settings_ratio.navigate('up');
            return false;
        } else if (state_obj.state == "externalPlayer") {
            ExternalPlayerView.navigate('up');
            return false;
        } else if (state_obj.state == "Keyboard") {
            KeyboardManager.navigate('up');
        } else if (state_obj.state == "android_channel_menu") {
            android_channel_menu.navigate('up');
        } else if (state_obj.state == "mode_menu") {
            modeMenu.MoveModeMenu('up');
            return false;
        }
        return false;
    }

    /**
     * KEYCODE_LEFT
     *
     */
    if (key == Keyboard.KEYCODE_LEFT) {
        if (state_obj.state == "auth_menu" || state_obj.state == "vod_search" || state_obj.state == "ask_parent_pass" || state_obj.state == "ask_parent_pass" || (state_obj.state == "settings" && settings.state == "parent_pass")) {
            Keyboard.removeLastChar();
        }

        if (state_obj.state == "main_menu") {
            MainMenu.navigate('left');
            return false;
        } else if (state_obj.state == "channels_menu") {
            channel_menu.navigate('left');
            return false;
        } else if (state_obj.state == "program") {
            if (program.state == 'channel') {
                program.navigate('left');
                return false;
            } else if (program.state == 'program') {
                program.navigate('left_program');
                return false;
            }
            return false;
        } else if (state_obj.state == "live_player") {
            if (state_obj.sub_state == 'view') {
                menu_cont.hideLegend();
                channel_menu.show();
                return false;
            } else if (state_obj.sub_state == 'player') {
                arch_player.updateTimer();
                arch_player.seek(-1);
                return false;
            }
            return false;
        } else if (state_obj.state == "vod") {
            VODManager.navigate('left');
            return false;
        } else  if (state_obj.state == "vod_genres") {
            vod_genres.navigate('left');
            return false;
        } else if (state_obj.state == "vod_player") {
            vod_player.seek(-1);
            return false;
        } else if (state_obj.state == "settings") {
             if (settings.state == 'channels_settings') {
                if (channels_settings.edit_view == 1) {
                    channels_settings.navigate('left');
                    return false;
                }
            } else if (settings.state == 'settings_server' || settings.state == 'settings_playing') {
                settings.navigate('left');
                return false;
            }
        } else if (state_obj.state == "dropdown_menu") {
            dropdown_menu.navigate('left');
            return false;
        } else if (state_obj.state == "vod_bottom_menu") {
            VODManager.navigateBottomMenu('left');
            return false;
        } else if (state_obj.state == "program_date_menu") {
            program.changeDate("prev");
            return false;
        } else if (state_obj.state == "settings_ratio") {
            channels_settings_ratio.navigate('left');
            return false;
        } else if (state_obj.state == "externalPlayer") {
            ExternalPlayerView.navigate('left');
            return false;
        } else if (state_obj.state == "Keyboard") {
            KeyboardManager.navigate('left');
        } else if (state_obj.state == "android_channel_menu") {
            android_channel_menu.navigate('left');
        } else if(state_obj.state == "DialogMessageManager") {
            DialogMessageManager.ProcessKeyPressLeft();
        } else if (state_obj.state == "mode_menu") {
            modeMenu.MoveModeMenu('left');
            return false;
        }
        return false;
    }
    /**
     * KEYCODE_RIGHT
     *
     */
    if (key == Keyboard.KEYCODE_RIGHT) {
        if (state_obj.state == "main_menu") {
            MainMenu.navigate('right');
            return false;
        } else if (state_obj.state == "channels_menu") {
            channel_menu.navigate('right');
            return false;
        } else if (state_obj.state == "program") {
            if (program.state == 'channel') {
                program.navigate('right');
                return false;
            } else if (program.state == 'program') {
                program.navigate('right_program');
                return false;
            }
            return false;
        } else if (state_obj.state == "live_player") {
            if (state_obj.sub_state == 'view') {
                menu_cont.hideLegend();
                program.showEpg(); 
                return false;
            } else if (state_obj.sub_state == 'player') {
                arch_player.updateTimer();
                arch_player.seek(1);
                return false;
            }
        } else if (state_obj.state == "vod") {
            VODManager.navigate('right');
            return false;
        } else  if (state_obj.state == "vod_genres") {
            vod_genres.navigate('right');
            return false;
        } else if (state_obj.state == "vod_player") {
            vod_player.seek(1);
            return false;
        } else if (state_obj.state == "settings") {
            if (settings.state == 'channels_settings') {
                if (channels_settings.edit_view == 1) {
                    channels_settings.navigate('right');
                    return false;
                }
            }else if (settings.state == 'settings_server' || settings.state == 'settings_playing') {
                settings.navigate('right');
                return false;
            }
            return false;
        } else if (state_obj.state == "dropdown_menu") {
            dropdown_menu.navigate('right');
            return false;
        } else if (state_obj.state == "vod_bottom_menu") {
            VODManager.navigateBottomMenu('right');
            return false;
        } else if (state_obj.state == "program_date_menu") {
            program.changeDate("next");
            return false;
        } else if (state_obj.state == "settings_ratio") {
            channels_settings_ratio.navigate('right');
            return false;
        } else if (state_obj.state == "externalPlayer") {
            ExternalPlayerView.navigate('right');
        } else if (state_obj.state == "Keyboard") {
            KeyboardManager.navigate('right');
        } else if (state_obj.state == "android_channel_menu") {
            android_channel_menu.navigate('right');
        } else if(state_obj.state == "DialogMessageManager") {
            DialogMessageManager.ProcessKeyPressRight();
        } else if (state_obj.state == "mode_menu") {
            modeMenu.MoveModeMenu('right');
            return false;
        }

        return false;
    }
    /**
     * KEYCODE_ENTER
     *
     */
        if (key == Keyboard.KEYCODE_ENTER || key == Keyboard.KEYCODE_PANEL_ENTER) {
            if (state_obj.state == "auth_menu") {
                AuthManager.navigate('ok');
                return false;

            } else if (state_obj.state == "main_menu") {

                MainMenu.navigate('ok');
                return false;

            } else if (state_obj.state == "channels_menu") {

                channel_menu.navigate('ok');
                return false;

            } else if (state_obj.state == "program") {

                if (program.state == 'channel') {
                    program.navigate('ok');
                } else if (program.state == 'program') {
                    program.navigate('ok_program');
                }

            } else if (state_obj.state == "live_player") {
                arch_player.pressOk();
                return false;

            } else if (state_obj.state == "vod") {

                VODManager.navigate('ok');
                return false;

            } else if (state_obj.state == "vod_genres") {

                vod_genres.navigate('ok');
                return false;

            } else if (state_obj.state == "vod_top") {

                vod_top.navigate('ok');
                return false;

            } else if (state_obj.state == "vod_search") {

                vod_search.navigate('ok');
                return false;

            } else if (state_obj.state == "vod_one") {
                VODManager_one.navigate('ok');
                return false;

            } else if (state_obj.state == "vod_player") {
                vod_player.pressOk();
                return false;

            } else if (state_obj.state == "center_block") {

                center_block.navigate('ok');
                return false;

            } else if (state_obj.state == "center_block_page") {

                center_block.navigatePage('ok');
                return false;

            } else if (state_obj.state == "settings") {
                if (settings.state == 'channels_settings') {
                    if (channels_settings.edit_view == 1) {
                        channels_settings.navigate('ok');
                    } else {
                        channels_settings.navigateChList('ok');
                    }

                } else if (settings.state == 'abonement') {
                    DataManager.logout();
                } else if (settings.state == 'parent_pass') {
                    parent_menu_obj.navigate('ok');
                }
                else if (settings.state == 'settings_server' || settings.state == 'settings_playing') {
                    settings.navigate('ok');
                    return false;
                }
            } else if (state_obj.state == "ask_parent_pass") {

                parent_menu_obj.navigateAskPass('ok');

            } else if (state_obj.state == "dropdown_menu") {

                dropdown_menu.navigate('ok');

            } else if (state_obj.state == "vod_bottom_menu") {

                VODManager.navigateBottomMenu('ok');

            } else if (state_obj.state == "settings_ratio") {

                channels_settings_ratio.navigate('ok');

            } else if (state_obj.state == "externalPlayer") {
                ExternalPlayerView.navigate('ok');
            } else if (state_obj.state == "Keyboard") {
                KeyboardManager.navigate('ok');
            } else if (state_obj.state == "android_channel_menu") {
                android_channel_menu.navigate('ok');
            } else if(state_obj.state == "DialogMessageManager") {
                DialogMessageManager.ProcessKeyPressEnter();
            }

            return false;
        }

    //if (key == Keyboard.KEYCODE_PLAY_PAUSE) {
    //    if (state_obj.state == "vod_player" || state_obj.state == "live_player") {
    //        if (!player.paused) {
    //            player.pause();
    //        } else {
    //            player.resume();
    //        }
    //    }
    //    return false;
    //}
    /**
     * KEYCODE_PAUSE
     *
     */
    if (key == Keyboard.KEYCODE_PAUSE) {
        if (state_obj.state == "vod_player" || state_obj.state == "live_player") {
            player.pause();
        }
        return false;
    }
    /**
     * KEYCODE_PLAY
     *
     */
    if (key == Keyboard.KEYCODE_PLAY) {
        if (state_obj.state == "vod_player" || state_obj.state == "live_player") {
            player.resume();
        }
        return false;
    }

    if(key == Keyboard.KEYCODE_RESIZE_SCREEN) {
        player.changeRatio();
        return false;
    }

    /**
     * KEYCODE_STOP
     *
     */
    if (key == Keyboard.KEYCODE_STOP) {
        if (state_obj.state == "vod_player") {
            player.stop();
            VODManager_one.backShow();
        }
        return false;
    }
    /**
     * KEYCODE_RED
     *
     */
    if (key == Keyboard.KEYCODE_RED) {
        if (state_obj.state == "vod") {
            VODManager.showSort();
        } else if(ChannelsManager.ifViewHasChannels() || state_obj.state == "live_player") {
            ChannelsManager.setFavCategory(2);
        }
        return false;
    }
    /**
     * KEYCODE_GREEN
     *
     */
    if (key == Keyboard.KEYCODE_GREEN) {
        if(ChannelsManager.ifViewHasChannels() || state_obj.state == "live_player") {
            ChannelsManager.setFavCategory(3);
        }
        return false;
    }

    /**
     * KEYCODE_YELLOW
     *
     */
    if (key == Keyboard.KEYCODE_YELLOW) {
        if (state_obj.state == "vod") {
            VODManager.addToFav();
        } else if(ChannelsManager.ifViewHasChannels() || state_obj.state == "live_player") {
            ChannelsManager.setFavCategory(1);
        }
        return false;
    }
    /**
     * KEYCODE_BLUE
     *
     */
    if (key == Keyboard.KEYCODE_BLUE || key ==  Keyboard.KEYCODE_ZOOM) {
        if(state_obj.state == "live_player" || state_obj.state == "vod_player") {
            player.changeRatio();
        } else if(state_obj.state == "vod") {
            VODManager.showPage();
        }
        return false;
    }

    /**
     * KEYCODE_CHANNEL_DOWN
     *
     */
    if (key == Keyboard.KEYCODE_CHANNEL_DOWN || key == Keyboard.KEYCODE_PANEL_CH_DOWN) {
        if (state_obj.state == "live_player") {
            ch_obj.go('prev');
        } else if(ChannelsManager.ifViewHasChannels()) {
            if(state_obj.state == 'program' && program.state == 'program') {
                program.navigate('page_down_program');
            } else if(state_obj.state == 'channels_menu'){
                channel_menu.navigate('page_down');
            } else {
                ChannelsManager.channelsList.SetNextPage();
            }
        } else if(state_obj.state == "vod") {
            VODManager.navigate('page_down');
        }
        return false;
    }

    /**
     * KEYCODE_CHANNEL_UP
     *
     */
    if (key == Keyboard.KEYCODE_CHANNEL_UP || key == Keyboard.KEYCODE_PANEL_CH_UP) {
        if (state_obj.state == "live_player") {
            ch_obj.go('next');
        } else if(ChannelsManager.ifViewHasChannels()) {
            if(state_obj.state == 'program' && program.state == 'program') {
                program.navigate('page_up_program');
            } else if(state_obj.state == 'channels_menu'){
                channel_menu.navigate('page_up');
            } else {
                ChannelsManager.channelsList.SetPrevPage();
            }
        } else if(state_obj.state == "vod") {
            VODManager.navigate('page_up');
        }
        return false;
    }
    /**
     * KEYCODE_CHANNEL_UP_DOWN
     *
     */
    if (key == Keyboard.KEYCODE_CHANNEL_UP_DOWN) {
        if(PlatformManager.getDevice() == PlatformManager.MAG_AURA) {
            if (e.shiftKey) {
                if (state_obj.state == "live_player") {
                    ch_obj.go('prev');
                }
                else if (ChannelsManager.ifViewHasChannels()) {
                    if (state_obj.state == 'program' && program.state == 'program') {
                        program.navigate('page_up_program');
                    } else {
                        ChannelsManager.channelsList.SetPrevPage();
                    }
                } else if (state_obj.state == "vod") {
                    VODManager.navigate('page_up');
                }
            } else {
                    if (state_obj.state == "live_player") {
                        ch_obj.go('next');
                    } else if(ChannelsManager.ifViewHasChannels()) {
                        if(state_obj.state == 'program' && program.state == 'program') {
                            program.navigate('page_down_program');
                        } else {
                            ChannelsManager.channelsList.SetNextPage();
                        }
                    } else if(state_obj.state == "vod") {
                        VODManager.navigate('page_down');
                    }
                }
            return false;
        }
        return false;
    }
    /**
     * KEYCODE_FAST_REWIND_LEFT
     *
     */
    if (key == Keyboard.KEYCODE_FAST_REWIND_LEFT || key == Keyboard.KEYCODE_PANEL_FAST_REWIND_LEFT || key == Keyboard.KEYCODE_REWIND_LEFT) {
        if (state_obj.state == "program") {
            if (program.type != "epg") {
                program.changeDate("prev");
            }
        }

        if (state_obj.state == "live_player") {
            arch_player.prevPid();
        }
        if (state_obj.state == "vod_player") {
            vod_player.seek(-10);
        }
        return false;
    }

    /**
     * KEYCODE_FAST_REWIND_RIGHT
     *
     */
    if (key == Keyboard.KEYCODE_FAST_REWIND_RIGHT || key == Keyboard.KEYCODE_PANEL_FAST_REWIND_RIGHT || key == Keyboard.KEYCODE_REWIND_RIGHT) {
        if (state_obj.state == "program") {
            if (program.type != "epg") {
                program.changeDate("next");
            }
        }
        if (state_obj.state == "live_player") {
            arch_player.prevNextPid('next');
        }
        if (state_obj.state == "vod_player") {
            vod_player.seek(10);
        }
        return false;
    }
    /**
     * KEYCODE_VOL_UP
     *
     */
    if ((key == Keyboard.KEYCODE_VOL_UP) || (key == Keyboard.KEYCODE_PANEL_VOL_UP)) {
        player.setRelativeVolume(0);

        player.volume = player.getVolume();
        if(PlatformManager.getDevice() == PlatformManager.Debug) player.volume--;

        statusbar.showVolume(player.volume);
        return false;
    }
    /**
     * KEYCODE_VOL_DOWN
     *
     */
    if ((key == Keyboard.KEYCODE_VOL_DOWN) || (key == Keyboard.KEYCODE_PANEL_VOL_DOWN)) {

        player.setRelativeVolume(1);
        player.volume = player.getVolume();

        if(PlatformManager.getDevice() == PlatformManager.Debug) player.volume++;

        statusbar.showVolume(player.volume);
        return false;
    }
    /**
     * KEYCODE_MUTE
     *
     */
    if (key == Keyboard.KEYCODE_MUTE || key == Keyboard.KEYCODE_PANEL_MUTE) {
        player.toggleMute();
        return false;
    }

    /**
     * KEYCODE_NUMERICAL
     *
     */
    if ((key === Keyboard.KEYCODE_0) || (key === Keyboard.KEYCODE_1) || (key === Keyboard.KEYCODE_2) || (key === Keyboard.KEYCODE_3)
        || (key === Keyboard.KEYCODE_4) || (key === Keyboard.KEYCODE_5) || (key === Keyboard.KEYCODE_6) || (key === Keyboard.KEYCODE_7)
        || (key === Keyboard.KEYCODE_8) || (key === Keyboard.KEYCODE_9)) {

        var num = Keyboard.GetNumericalKeyValue(key);

        if (state_obj.state == "Keyboard") {
            KeyboardManager.addInputValue(num);
            return false;
        } else if(state_obj.state == "auth_menu") {

            if(AuthManager.cur == 0) {
                AuthManager.login.value += num;
            } else if(AuthManager.cur == 1) {
                AuthManager.pass.value += num;
            }
        } else if(state_obj.state == "settings" && settings.state == "parent_pass") {
            if(parent_menu_obj.cur_selected == 1) {
                document.getElementById('old_pass').value += num;
            } else if(parent_menu_obj.cur_selected == 2) {
                document.getElementById('new_pass').value += num;
            } else if(parent_menu_obj.cur_selected == 3) {
                document.getElementById('repeat_new_pass').value += num;
            }
            return false;
        } else if(state_obj.state == "ask_parent_pass") {
            if(parent_menu_obj.cur_selected == 0) {
                document.getElementById('ask_pass').value += num;
            }
            return false;
        } else if(state_obj.state == "vod_search") {
            if(vod_search.cur_selected == 0) {
                document.getElementById('kinozal_search').value  += num;
            }
            return false;
        }

        return false;
    }

    /**
     * KEYCODE_MENU
     *
     */
    if (key == Keyboard.KEYCODE_MENU || key == Keyboard.KEYCODE_TOOLS) {
        if(PlatformManager.getDevice() == PlatformManager.Dune) {
            PlatformManager.exit();
            return false;
        }
        menu_cont.hidePlayersAndLegends();
        MainMenu.show();
        return false;
    }

    /**
     * VK_HID_BACK
     *
     */
    if (key == Keyboard.VK_HID_BACK) {
        Keyboard.removeLastChar();
        return false;
    }

    /**
     * KEYCODE_STAND_BY
     *
     */
    if (key == Keyboard.KEYCODE_STAND_BY || key == Keyboard.KEYCODE_PANEL_STAND_BY) {
        if(PlatformManager.getDevice() == PlatformManager.MAG_AURA) {
            if(e.ctrlKey == false) {
                if (Main.stand_by) {
                    stb.StandBy(false);
                    window.location = self.location;
                    Main.stand_by = 0;
                } else {
                    stb.StandBy(true);
                    Main.stand_by = 1;
                }
            } else {
                player.changeRatio();
            }
        }

        return false;
    }

    if (key == Keyboard.KEYCODE_EPG) {
        if(state_obj.state != 'auth_menu') {
            menu_cont.hidePlayersAndLegends();
            program.showProg();  
        }
        return false;
    }
    if (key == Keyboard.KEYCODE_INFO) {
        menu_cont.hidePlayersAndLegends();
        if(state_obj.state == 'live_player') {
            arch_player.show('player');
        } else if(state_obj.state == 'live_player') {
            vod_player.show();
        }
        return false;
    }
    if (key == Keyboard.KEYCODE_PRE_CH) {
        if(source.prev_playing_channel_number) {
            if(state_obj.state == 'live_player') {
                ChannelsManager.setCategoryByNumber(source.prev_playing_cat_number);
                ChannelsManager.setChannelByNumber(source.prev_playing_channel_number);
                arch_player.loadChannelInfo();
                arch_player.show('player');

                source.onGetUrlCallBack = arch_player.init;
                clearTimeout(ch_obj.timer);
                ch_obj.timer = setTimeout('source.playLive();', ConstValue.cTimeoutGetSource);
            }
        }
        return false;
    }
    if (key == Keyboard.KEYCODE_CLEAR) {
        Keyboard.removeLastChar();
        return false;
    }
}

Keyboard.removeLastChar = function () {
    if (state_obj.state == "auth_menu") {
        if (AuthManager.cur == 0) {
            AuthManager.login.value = AuthManager.login.value.slice(0,-1);
        } else if (AuthManager.cur == 1) {
            AuthManager.pass.value = AuthManager.pass.value.slice(0,-1);
        }
        return false;
    } else if(state_obj.state == "vod_search") {
        if(vod_search.cur_selected == 0) {
            document.getElementById('kinozal_search').value = document.getElementById('kinozal_search').value.slice(0,-1);
        }
        return false;
    } else if(state_obj.state == "settings" && settings.state == "parent_pass") {
        if(parent_menu_obj.cur_selected == 1) {
            document.getElementById('old_pass').value = document.getElementById('old_pass').value.slice(0,-1);
        } else if(parent_menu_obj.cur_selected == 2) {
            document.getElementById('new_pass').value = document.getElementById('new_pass').value.slice(0,-1);
        } else if(parent_menu_obj.cur_selected == 3) {
            document.getElementById('repeat_new_pass').value = document.getElementById('repeat_new_pass').value.slice(0,-1);
        }
        return false;
    } else if(state_obj.state == "ask_parent_pass") {
        if(parent_menu_obj.cur_selected == 0) {
            document.getElementById('ask_pass').value = document.getElementById('ask_pass').value.slice(0,-1);
        }
        return false;
    } else if(state_obj.state == "Keyboard") {
        KeyboardManager.ClearLastKeyInInputValue();
        return false;
    }

    return false;
};
Keyboard.GetNumericalKeyValue = function (aKeyCode) {

    if (aKeyCode === this.KEYCODE_0) {
        return 0;
    }

    if (aKeyCode === this.KEYCODE_1) {
        return 1;
    }

    if (aKeyCode === this.KEYCODE_2) {
        return 2;
    }

    if (aKeyCode === this.KEYCODE_3) {
        return 3;
    }

    if (aKeyCode === this.KEYCODE_4) {
        return 4;
    }

    if (aKeyCode === this.KEYCODE_5) {
        return 5;
    }

    if (aKeyCode === this.KEYCODE_6) {
        return 6;
    }

    if (aKeyCode === this.KEYCODE_7) {
        return 7;
    }

    if (aKeyCode === this.KEYCODE_8) {
        return 8;
    }

    if (aKeyCode === this.KEYCODE_9) {
        return 9;
    }

    return 0;
}

Keyboard.goBack = function () {
    if (state_obj.state == "auth_menu") {
        PlatformManager.exit();
    } else if (state_obj.state == "main_menu") {
        MainMenu.hide();
    } else if (state_obj.state == "channels_menu") {
        channel_menu.hide();
    } else if (state_obj.state == "center_block") {
        center_block.hide();
    } else if (state_obj.state == "center_block_page") {
        center_block.hide();
    } else if (state_obj.state == "vod") {
        VODManager.hide();
    } else if (state_obj.state == "vod_genres") {
        vod_genres.hide();
    } else if (state_obj.state == "vod_top") {
        vod_top.hide();
    } else if (state_obj.state == "vod_search") {
        vod_search.hide();
    } else if (state_obj.state == "vod_one") {
        VODManager.createContent();
    } else if (state_obj.state == "vod_player") {
        if(VODManager_one.isSerial()) {
            menu_cont.show();
            state_obj.state = "vod_one";
            dropdown_menu.init(VODManager_one.film.files, VODManager_one.getQuality, VODManager_one.cur_seria, TextConfig.kinozal.chose_seria);
        } else {
            vod_player.hide();
        }
    } else if (state_obj.state == "program") {
        if (program.state == 'program') {
            program.navigate('left_program');
        } else {
            program.back();
        }
    } else if (state_obj.state == "live_player") {
        if (state_obj.sub_state == 'view') {
            if (state_obj.video_state == "archive") {
                program.show('archive');
            } else {
                MainMenu.show();
            }
        } else {
            arch_player.hide('view');
        }
    } else if (state_obj.state == "settings") {
        if (settings.state == 'channels_settings') {
            if (channels_settings.edit_view == 1) {
                channels_settings.goBack();
            } else {
                channels_settings.goBack();
            }
        } else if (settings.state == 'parent_pass') {
            MainMenu.show();
        }  else if (settings.state == 'abonement') {
            MainMenu.show();
        }  else if (settings.state == 'settings_server' || settings.state == 'settings_playing') {
            settings.goBack();
            return false;
        }
    }
    else if (state_obj.state == 'ask_parent_pass') {
        parent_menu_obj.close();
    } else if (state_obj.state == "dropdown_menu") {
        dropdown_menu.hide();
    } else if (state_obj.state == "vod_bottom_menu") {
        VODManager.offBottomMenu();
    } else if (state_obj.state == "settings_ratio") {
        channels_settings_ratio.goBack();
    }
    else if (state_obj.state == "program_date_menu") {
        program.DeActivateDateMenu();
        return false;
    } else if (state_obj.state == "externalPlayer") {
        ExternalPlayerView.goBack();
    } else if (state_obj.state == "Keyboard") {
        KeyboardManager.goBack();
    } else if (state_obj.state == "android_channel_menu") {
        android_channel_menu.goBack();
    } else if(state_obj.state == "DialogMessageManager") {
        DialogMessageManager.HideDialogMessage();
    } else if (state_obj.state == "mode_menu") {
        modeMenu.hide();
        return false;
    }

    return false;
}

Keyboard.enableKeys = function (componentName) {
    if (componentName === undefined || componentName === null || componentName == '')
        componentName = "anchor";
    var e = document.getElementById(componentName);
    if (e !== null)
        document.getElementById(componentName).focus();
}

function keyCode(e) {
    return e.which ? e.which : e.keyCode;
}


