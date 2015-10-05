/**
 *
 *
 */
var DataManager = (function () {
    return {
        res_ajax: ''
        , log_outed: 0
        , XHR: null
        , loading: false
        , server_url: "http://" + window.location.host + "/smarttv/scripts/app.php?"
        , init: function () {
            try {
                DataManager.XHR = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    DataManager.XHR = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (E) {
                    DataManager.XHR = false;
                }
            }
            if (!DataManager.XHR && typeof XMLHttpRequest != 'undefined') {
                DataManager.XHR = new XMLHttpRequest();
            }
        }
        , sendAjax: function (url, call_back, auth) {
            try {
                if (DataManager.log_outed || !DataManager.XHR) return false;

                DataManager.XHR = new XMLHttpRequest();

                //if (DataManager.loading) {
                //    DataManager.CancelDataLoading();
                //}

                var q_url = this.server_url + url;

                if (auth != 'auth') {
                    q_url += "&token=" + AuthManager.token;
                }

                DataManager.XHR.open('GET', q_url, true);
                

                //DataManager.XHR.onprogress = function(event) {
                //    document.getElementById('screen').style.display = 'block';
                //    document.getElementById('screen').innerHTML = 'Получено ' + Math.floor(event.loaded/1024) + ' Кбайт из ' + Math.floor(event.total/1024);
                //}

                DataManager.XHR.onreadystatechange = function () {

                    if (DataManager.XHR.readyState != 4) {
                        return false;
                    }

                    // responseText, responseXML (при content-type: text/xml)
                    if (DataManager.XHR.status != 200) {
                        statusbar.show(TextConfig.settings.internet_disconnected);
                        spin_obj.stop();
                        //return;
                    }
                    var data = DataManager.XHR.responseText;

                    if(data) {
                        data = JSON.parse(DataManager.XHR.responseText);
                    } else {
                        statusbar.show('No data in answer');
                    }

                    DataManager.checkData(data);

                    if (data && data.status != "error") {
                        if ("function" == typeof call_back) {
                            DataManager.loading = false;
                            call_back(data);
                        }
                    }
                }
                DataManager.XHR.send(null);

                DataManager.loading = true;
            } catch (e) {
                statusbar.show(e);
                DataManager.writeLog('send Ajax error = ' + e+' stack = '+ e.stack);
            }
        }
        , CancelDataLoading: function () {
            alert('CancelDataLoading');
            if (DataManager.XHR !== null) {
                //statusbar.show('загрузка отменена');
                DataManager.XHR.abort();
            }

            DataManager.loading = false;
        }
        , write_error: function (text) {
            document.getElementById('mistake_desc').innerHTML = text;
            document.getElementById('mistake_desc').style.display = 'block';
        }
        , checkData: function (data) {
            if (!data) {
                this.logout(3001);
            }
            else if (data.status == "error") {
                this.logout(data.data.code);
            }
            else if (data.status == "warning") {
                var error_code = data.data.code;
                statusbar.show(TextConfig.error[error_code], 2);
            }
        }

        , logout: function (mistake) {
            spin_obj.stop();
            DataManager.log_outed = 1;
            player.hide();
            clearInterval(AuthManager.new_token);
            clearInterval(player.check_timer);
            clearInterval(AuthManager.update_time);
            clearTimeout(channel_menu.timer);
            clearInterval(AuthManager.check_tocken_timer);
            AuthManager.token = "";
            form_obj.login = "";
            form_obj.pass = "";
            arch_player.hidePlayer();
            menu_cont.close();
            auth_window.show(mistake);
            player.stop();
            AuthManager.first_start = 1;
        }
        , unixToTime: function (time) {
            // create a new javascript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds
            var date = new Date(time * 1000);

            var hours = (date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours());
            var minutes = (date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes());
            var seconds = (date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : date.getUTCSeconds());

            // will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes;
            return formattedTime;
        }
        ,timeStrPlusSec: function (timeStr,sec) {
            var date = new Date();
            date.setHours(timeStr.split(':')[0])
            date.setMinutes((parseInt(timeStr.split(':')[1])+(sec/60)));
            return date;
        }
        , block: function (hard) {
            document.getElementById('blocker').style.display = 'block';
            if(hard) document.getElementById('blocker').style.opacity = '1';
            else document.getElementById('blocker').style.opacity = '0.6';
        }
        , unblock: function () {
            document.getElementById('blocker').style.display = 'none';
        }
        , writeLog: function (text) {

                var text_send = decodeURI(text);
                DataManager.sendAjax("query=writeLog&text=" + text + "&login=" + form_obj.login + "&platform=" + PlatformManager.getDevice(), function (data) {
                });

        }
    }
})();

var source = (function () {
    return {

        lid: 0
        , onGetUrlCallBack: null
        , video_type: 'http'
        , reloaded: 0
        , current_playing_channel_number: 0
        , prev_playing_channel_number: 0
        /**
         * Принимает ссылку на поток и проигрывает его
         */
        , result: function (data) {
            if (data.status != 'warning') {
                player.play(data.data.url);
            }
            if (source.onGetUrlCallBack) {
                source.onGetUrlCallBack();
                source.onGetUrlCallBack = null;
            }
        }
        /**
         * Получение ссылки на поток по номеру канала
         * проигрываеться live
         */
        , playLive: function () {

            var channel = ChannelsManager.getCurrentChannel();
            state_obj.video_state = "live";

            if(!channel) return false;

            var url = "query=getUrl&key=number&value=" + channel.number;

            if (channel.has_passwd == 1) {
                var parent_pass = parent_menu_obj.parent_pass;

                if (parent_pass && parent_pass !== null && parent_pass != '' && parent_pass != 'null') {
                    var pass = md5(AuthManager.token + md5(parent_pass));
                    url = "query=getUrl&key=number|passwd&value=" + channel.number + "|" + pass;
                }

                else {
                    parent_menu_obj.askParentPass('ask');
                    if (source.onGetUrlCallBack) {
                        source.onGetUrlCallBack();
                        source.onGetUrlCallBack = null;
                    }
                    return;
                }
            }

            time_obj.timeshifted_unix_time = time_obj.unix_time;
            program.day = 0;


            DataManager.sendAjax(url, source.result);

            ChannelsManager.saveLastChannel();

            source.prev_playing_channel_number = source.current_playing_channel_number;
            source.prev_playing_cat_number = source.current_playing_cat_number;

            source.current_playing_channel_number = channel.number;
            source.current_playing_cat_number = ChannelsManager.GetCurrentCategoryNumber();

            channel_menu.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            channel_menu.channel_num = ChannelsManager.channelsList.GetCurrentElementIndex();
            arch_player.init();

            if (program.state == 'program') {
                program.state = 'channel';
            }
        }
        /**
         * Получение ссылки на поток по номеру канала и времени
         * проигрываеться archive
         */
        , playByNumberAndTime: function (num, time) {

            var channel = ChannelsManager.getCurrentChannel();

            state_obj.video_state = "archive";

            var url = "query=getUrl&key=number|start|type&value=" + channel.number + "|" + time + "|" + source.getVideoType();

            if (channel.has_passwd == 1) {
                var parent_pass = parent_menu_obj.parent_pass;

                if (parent_pass !== null && parent_pass != '' && parent_pass != 'null') {
                    var pass = md5(AuthManager.token + md5(parent_pass));

                    url = "query=getUrl&key=number|start|type|passwd&value=" + channel.number + "|" + time + "|" + source.getVideoType() + "|" + pass;
                }

                else {
                    parent_menu_obj.askParentPass('ask');
                    if (source.onGetUrlCallBack) {
                        source.onGetUrlCallBack();
                        source.onGetUrlCallBack = null;
                    }
                    return;
                }
            }

            DataManager.sendAjax(url, source.result);

            ChannelsManager.saveLastChannel();
            source.prev_playing_channel_number = source.current_playing_channel_number;
            source.prev_playing_cat_number = source.current_playing_cat_number;

            source.current_playing_channel_number = channel.number;
            source.current_playing_cat_number = ChannelsManager.GetCurrentCategoryNumber();
        }
        , getVideoType: function () {
            var type = 'http';
            if (player.player_type != PlatformManager.integratedVideo && in_array(settings.GetBitRate().number, ['122', '140', '121']) && (program.getCurrentProgram().ut_stop < time_obj.unix_time)) type = 'vod';
            return type;
        }
        /**
         * Получение ссылки на поток по id фильма/сериала
         */
        , playByLid: function (lid, callback) {
            source.lid = lid;
            state_obj.video_state = "vod";

            var url = "query=getUrl&key=lid&value=" + lid;

            DataManager.sendAjax(url, callback);
        }

        , reload: function (callback) {
            if (player.player_type != PlatformManager.integratedVideo)  return false;

            statusbar.show(TextConfig.common.reload_stream);

            if (state_obj.video_state == "archive") {
                source.playByNumberAndTime(ChannelsManager.getCurrentChannel().number, time_obj.timeshifted_unix_time);
            }
            else if (state_obj.video_state == "vod") {
                source.playByLid(source.lid, function (data) {
                    source.result(data);
                    player.seek(vod_player.cur_time);
                });
            }
            else if (state_obj.video_state == "live") {
                source.playLive();
            }
            if (callback) {
                callback();
            }
        }
    }
})();