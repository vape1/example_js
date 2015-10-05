document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
        Keyboard.goBack();
    }, false);

    document.addEventListener("menubutton", function (e) {

    }, false);
    document.addEventListener("pause", function (e) {
        if (state_obj.state == "auth_menu") {
            auth_window.show();
        } else if (state_obj.state == "vod_player") {
            player.pause();
        } else {
            if (player.player_type == PlatformManager.integratedVideo) {
                player.stop();
            }
        }

    }, false);

    document.addEventListener("resume", function (e) {
        if (state_obj.state == "auth_menu") {
            auth_window.show();
        } else if (state_obj.state == "vod_player") {
            if(VODManager_one.isSerial()) {
                menu_cont.show();
                state_obj.state = "vod_one";
                dropdown_menu.init(VODManager_one.film.files, VODManager_one.getQuality, VODManager_one.cur_seria, TextConfig.kinozal.chose_seria);
            } else {
                VODManager_one.show(VODManager.cur_film);
            }

        } else {
            if(state_obj.video_state == 'live') {
                if (player.player_type != PlatformManager.integratedVideo) {
                    MainMenu.showTv();
                } else {
                    channel_menu.show();
                }
            } else if(state_obj.video_state == 'archive') {
                if (player.player_type != PlatformManager.integratedVideo && (source.getVideoType() != 'vod' || program.isCurrentProgramLive())) {
                    ExternalPlayerView.fillTemplate();
                } else {
                    program.showArch();
                }
            }

            if (player.player_type == PlatformManager.integratedVideo) {
                source.reload();
            }
        }
    }, false);

    PlatformManager.uuid = device.uuid;


    PlatformManager.init();
    Main.show_timeout = 3000;
    Main.startApp();
}

