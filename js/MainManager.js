
var Main = (function () {
    return {
        keyboard: null
        , main_menu_scroll_size: 0
        , DB: null
        , initDB: false
        , widgetAPI: null
        , tvKeyAPI: null
        , show_timeout: 1000
        , stand_by: 0 //on off for aura/mag
        , environment: ''
        //Инициализация модуля
        , init: function () {
            try {
                spin_obj.start();
                PlatformManager.init();
                if (PlatformManager.getDevice() == PlatformManager.SAMSUNG) {
                    Main.widgetAPI = new Common.API.Widget();
                    Main.tvKeyAPI = new Common.API.TVKeyValue();
                    Main.pluginAPI = new Common.API.Plugin();
                    file_obj.create();
                    Main.widgetAPI.sendReadyEvent();
                    if(PlatformManager.isOldSamsung()) {
                        Main.includeCss('css/samsung_old.css','mag_aura');
                        document.getElementById('loader_img').src = 'images/loader_samsung.gif';
                    }
                }

                if (PlatformManager.getDevice() == PlatformManager.MAG_AURA) {
                    initSTB();

                    Main.includeCss('css/mag_aura.css','mag_aura');

                    //check recive data
                    var tmp = new Array();		// два вспомагательных
                    var tmp2 = new Array();		// массива
                    var param = new Array();
                    var get = location.search;	// строка GET запроса
                    if(get != '') {
                        tmp = (get.substr(1)).split('&');	// разделяем переменные
                        for(var i=0; i < tmp.length; i++) {
                            tmp2 = tmp[i].split('=');		// массив param будет содержать
                            param[tmp2[0]] = tmp2[1];		// пары ключ(имя переменной)->значение
                        }
                        //referrer
                        PlatformManager.aura_mag = param['device'] ? param['device'] : 'mag';
                        PlatformManager.aura_referrer = param['referrer'] ? param['referrer'] :'';
                    }
                }

                if(PlatformManager.getDevice() == PlatformManager.iNext) {
                    player.initINextPlayerPlayer();
                }

                if (PlatformManager.getDevice() != PlatformManager.Android) {
                    Main.startApp();
                }
                if (PlatformManager.getDevice() == PlatformManager.Dune) {
                    Main.includeCss('css/dune.css','dune');
                    player.initDunePlayer();
                    modeMenu.init();
                }

            } catch (e) {
                statusbar.show('Main.init error = ' + e+' stack = '+ e.stack)
                DataManager.writeLog('Main.init error = ' + e+' stack = '+ e.stack);
            }
        }
        , onUnload: function () {
            if (PlatformManager.getDevice() == PlatformManager.SAMSUNG) {
                if (player.plugin) {
                    player.stop();
                    player.plugin.Close();
                }
            }
        }
        //Start app initialization
        , startApp: function () {
            try {
                Main.initDataBase();
                Main.initScreen();
                ChannelsManager.init();
                program.init();
                channels_settings.init();
                settings.init();
                MainMenu.init();
                channels_settings_ratio.init();
                vod_genres.init();
                DataManager.init();
                Keyboard.Init();
                KeyboardManager.init();

                DialogMessageManager.Init();
                Main.getEnvironment();

                setTimeout('auth_window.show();', Main.show_timeout);
                setTimeout('form_obj.autosubmit();', (5 + Main.show_timeout));
            } catch(e) {
                statusbar.show('Main.startApp error = ' +e+' stack = '+ e.stack);
                DataManager.writeLog('Main.startApp error = ' + e+' stack = '+ e.stack);
            }
        }
        ,getEnvironment: function () {
            var url = 'query=getEnvironment';
            DataManager.sendAjax(url, function(data){
                Main.environment = data.data.environment;
                Main.api_url = data.data.api_url;
                if(PlatformManager.isDevelopment() || PlatformManager.isTest()) {
                    document.getElementById("message_update").innerHTML = Main.environment+' portal device_id: '+PlatformManager.getDevice() + ' manufacturer = '+PlatformManager.getManufacturer()+' MW URL = '+Main.api_url;
                }
            });
        }
        , includeJavascript: function (src, id) {
            //    if (document.createElement && document.getElementsByTagName) {
            //	var head_tag = document.getElementsByTagName('head')[0];
            //	var script_tag = document.createElement('script');
            //	script_tag.setAttribute('id', id);
            //	script_tag.setAttribute('src', src);
            //	head_tag.appendChild(script_tag);
            //    }
        }
        , includeCss: function (src, id) {
                if (document.createElement && document.getElementsByTagName) {
                    var head  = document.getElementsByTagName('head')[0];
                    var link  = document.createElement('link');
                    link.id   = id;
                    link.rel  = 'stylesheet';
                    link.type = 'text/css';
                    link.href = src;
                    head.appendChild(link);
                }
        }
        , initDataBase: function () {
            if (PlatformManager.getDevice() != PlatformManager.Debug && PlatformManager.getDevice() != PlatformManager.Android) return false;

            try {
                if (!window.openDatabase) {
                    //alert('Databases are not supported in this browser.');
                    return;
                } else {
                    var dbName = 'AndroidStb';
                    var version = '1.0';
                    var dbDescription = 'AndroidStb Database';
                    var maxSize = 100000; //  bytes
                    Main.DB = openDatabase(dbName, version, dbDescription, maxSize);
                    Main.initDB = true;
                }
            } catch (e) {
                if (e == 2) {
                    // Version number mismatch.
                    //console.log("Invalid database version.");
                } else {
                    //console.log("Unknown error " + e + ".");
                }
                return;
            }

            Main.DB.transaction(function (tx) {
                //tx.executeSql('DROP TABLE AndroidWEBData');
                tx.executeSql('CREATE TABLE IF NOT EXISTS AndroidWEBData (key_name TEXT NOT NULL, val_name TEXT NOT NULL)');
            }, errorCB, successCreateBase);
        }
        , initScreen: function () {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                screen_width = w.innerWidth || e.clientWidth || g.clientWidth,
                screen_height = w.innerHeight || e.clientHeight || g.clientHeight;



               //document.getElementById('screen').style.display = 'block';
               //document.getElementById('screen').innerHTML = 'screen_width = ' + screen_width + ' screen_height = ' + screen_height;


            if (screen_height < 645) {
                MainMenu.menu_height = -375;
                Main.main_menu_scroll_size = 250;
                Main.main_menu_items_per_page = 6;
                Main.channels_small_list_per_page = 5;
                Main.ChannelsManager_per_page = 7;
                ChannelsManager.containerHigh = -350;
                ChannelsManager.smallContainerHigh = -250;
                Main.content_program_height = 305;
                Main.program_scroll_size = 185;
                Main.epg_descr_height = 38;
                Main.chennels_list_scroll_size = 293;
                VODManager.row_height = 172;
                VODManager.row = 2;
                Main.vod_film_descr = 380;
                Main.vod_big_img_height = 280;
                Main.vod_genres_height = 384;
                Main.vod_genres_scroll_size = 340;
                Main.vod_genres_list_per_page = 5;
                Main.settings_list_height = 385;
                Main.settings_list_per_page = 7;
                Main.settings_list_scroll_size = 320;
                Main.height_time_line = 284;
                Main.player_time_block = 625;
                program.epg_width = 690;
                Main.channel_content_block_height = 372;
                Main.android_channel_menu_items = 8;
            } else if (screen_height < 900) {
                MainMenu.menu_height = -518;
                Main.main_menu_scroll_size = 450;
                Main.main_menu_items_per_page = 7;
                Main.channels_small_list_per_page = 8;
                Main.ChannelsManager_per_page = 10;
                ChannelsManager.containerHigh = -520;
                ChannelsManager.smallContainerHigh = -416;
                Main.content_program_height = 465;
                Main.program_scroll_size = 350;
                Main.epg_descr_height = 61;
                Main.chennels_list_scroll_size = 445;
                VODManager.row_height = 239;
                VODManager.row = 2;
                Main.vod_film_descr = 525;
                Main.vod_big_img_height = 350;
                Main.vod_genres_height = 576;
                Main.vod_genres_scroll_size = 530;
                Main.vod_genres_list_per_page = 4;
                Main.settings_list_height = 550;
                Main.settings_list_per_page = 10;
                Main.settings_list_scroll_size = 486;
                Main.height_time_line = 442;
                Main.player_time_block = 880;
                Main.channel_content_block_height = 558;
                Main.android_channel_menu_items = 12;
                program.epg_width = 925;
            } else {
                MainMenu.menu_height = -518;
                Main.main_menu_scroll_size = 450;
                Main.main_menu_items_per_page = 7;

                Main.ChannelsManager_per_page = 12;
                Main.chennels_list_scroll_size = 775;
                ChannelsManager.containerHigh = -841;

                Main.channels_small_list_per_page = 10;
                ChannelsManager.smallContainerHigh = -700;
                Main.content_program_height = 755;
                Main.program_scroll_size = 640;
                Main.epg_descr_height = 66; 

                VODManager.row_height = 359;
                VODManager.row = 2;
                Main.vod_film_descr = 780 ;
                Main.vod_big_img_height = 540;
                Main.vod_genres_height = 576;
                Main.vod_genres_scroll_size = 530;
                Main.vod_genres_list_per_page = 6;

                Main.settings_list_height = 864;
                Main.settings_list_per_page = 12;
                Main.settings_list_scroll_size = 800;

                Main.height_time_line = 750;
                Main.player_time_block = 1300;
                Main.channel_content_block_height = 558;
                Main.android_channel_menu_items = 12;
                program.epg_width = 1430;
            }

            if (screen_width > 1690) {
                VODManager.count_per_row = 8;
            } else if (screen_width > 1510) {
                VODManager.count_per_row = 7;
            } else if (screen_width > 1325) {
                VODManager.count_per_row = 6;
            } else if (screen_width > 1140) {
                VODManager.count_per_row = 5;
            } else if (screen_width > 957) {
                VODManager.count_per_row = 5;  
            } else if (screen_width > 775) {
                VODManager.count_per_row = 4;
            } else if (screen_width > 590) {
                VODManager.count_per_row = 3;
            } else if (screen_width > 495) {
                VODManager.count_per_row = 2;
            }
        }
    }
})();


function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

function successCB1(tx) {
}

function successCreateBase(tx) {
    cookie_obj.getSqlData();
}
