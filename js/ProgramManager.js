/**
 * Обьект для ТВ АРХИВ и Программа
 *
 */
var program = (function () {
    return {
        //таймер задержки запроса
        timer: 0
        //текущая категория канала
        , channel_cat: 0
        //текущий номер канала
        , channel_num: 0
        //текущая программа канала
        , program_num: 0
        //переменная определяющая дату ( 0 - сегодня )
        , day: 0
        //после выполнения запрос а записываеться дата программы ( 7 Мая. Чт.)
        , date_string: ''
        //заполняеться массивом програм для текущего канала
        , programs: {}
        //переменная состояния вида 'channel' или 'program', для навигации по списку каналов или по списку передач
        , state: 'channel'
        , sub_menu: ''
        , list_item_name: 'program'
        //переменная которая определяет это ВИД архив или программа
        , type: ''
        , stop_scroll_program: 1
        , load_program_timer: 0
        , ChannelNumber:0
        , CategoryNumber:0
        , CategoryHasRecord:0
        , init: function () {
            program.programsList = new List();
            program.programsList.SetCurrentPageGhangedCallback(ChannelsManager.updateProgramList);
            program.programsList.SetCurrentElementGhangedCallback(ChannelsManager.updateProgram);
            program.epgPxPerMin = program.epg_width/60;
        }
        , show: function (type) {
            spin_obj.start();
            program.type = type;

            menu_cont.buildTemplate('program');

            program.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            program.channel_num = ChannelsManager.channelsList.GetCurrentElementIndex();
            program.ChannelNumber = ChannelsManager.GetCurrentChannelNumber();
            program.CategoryNumber = ChannelsManager.GetCurrentCategoryNumber();
            program.CategoryHasRecord = ChannelsManager.categoriesList.getCurrentElement().has_record;

            arch_player.stop_move_time = 0;

            if (program.type == 'archive') {
                var cur_time = new Date().getTime()/1000;
                if(((cur_time - ChannelsManager.arch_channels_list_time_generated) > 600) || !ChannelsManager.arch_channels_list.length) {
                    program.initArchChannels();
                }

                if(!ChannelsManager.arch_channels_list.length) {
                    MainMenu.show();
                    statusbar.show(TextConfig.common.no_archive);
                    return false;
                }

                program.setArchChannels(ChannelsManager.arch_channels_list);
            } else if (program.type == 'epg') {
                program.createEpgContent();
            }

            program.buildChannelsWraper();
            menu_cont.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
            menu_cont.createCategory();

            ChannelsManager.updateChannelList();
            ChannelsManager.updateChannel();
        }
        , showArch: function () {
            program.show('archive');
        }
        , showEpg: function () {
            program.show('epg');
        }
        , showProg: function () {
            program.show('prog');
        }
        , hide: function () {
            clearTimeout(this.timer);
            MainMenu.show();
        }
        , initArchChannels: function () {
            ChannelsManager.arch_channels_list = [];
            var prog;
            var cats = [];

            //ChannelsManager.categoriesList.elements.forEach(function(cat){
            //    cats.push(cat);
            //});

            cats = deepCopy(ChannelsManager.categoriesList.elements);

            for (var i = 0; i < cats.length; i++) {
                var cat = cats[i];
                if (cat.has_record == 1) {
                    var new_ch_list = [];
                    for (var y = 0; y < cat.channels.length; y++) {
                        var channel = cat.channels[y];
                        if (channel.has_record == 1) {
                            var new_prog_list = [];
                            if(!channel.programs) channel.programs = [];
                            for (var z = 0; z < channel.programs.length; z++) {
                                prog = channel.programs[z];
                                if ((time_obj.unix_time >= parseInt(prog.ut_start)) && parseInt(channel.rec_duration) >= (time_obj.unix_time - parseInt(prog.ut_start))) {
                                    new_prog_list.push(prog);
                                }
                            }
                            channel.programs = new_prog_list;
                            new_ch_list.push(channel);
                        }
                    }
                    cat.channels = new_ch_list;
                    ChannelsManager.arch_channels_list.push(cat);
                }
            }
            ChannelsManager.arch_channels_list_time_generated = new Date().getTime()/1000;
        }
        ,setArchChannels: function (new_cat_list) {
            var has_record = 0;
            if(ChannelsManager.channelsList.getCurrentElement().has_record == 1) has_record = 1;

            if(ChannelsManager.getCurrentChannel() && ChannelsManager.getCurrentChannel().program[program.cur_month_day]) {
                for (var i = 0; i < new_cat_list.length; i++) {
                    for (var y = 0; y < new_cat_list[i].channels.length; y++) {
                        if(new_cat_list[i].channels[y].number == ChannelsManager.getCurrentChannel().number) {
                            new_cat_list[i].channels[y].program[program.cur_month_day] = ChannelsManager.getCurrentChannel().program[program.cur_month_day];
                        }
                    }
                }
            }

            ChannelsManager.initCategoriesList(new_cat_list);

            if(has_record) {
                ChannelsManager.setCategoryByNumber(program.CategoryNumber);
                ChannelsManager.setChannelByNumber(program.ChannelNumber);
            } else if(program.CategoryHasRecord == '1') {
                ChannelsManager.setCategory(program.channel_cat);
            }
            program.initArchiveChannels = 1;
        }
        , getPrograms: function () {
            if(program.day != 0 && !ChannelsManager.getCurrentChannel().program[program.cur_month_day]) {
               program.loadNewProgram();
                return false;
            }
            program.createPrograms();
        }

        , buildChannelsWraper: function () {
            this.fillTemplate();
            this.createChannels();
        }
        , fillTemplate: function () {
            this.updateDate();
            //Инициализация скролла для каналов
            scrollbar_obj.init(0, 'program_channel');
            scrollbar_obj.show(this.channel_num, ChannelsManager.channelsList.elementCount, 0);

        }
        /**
         * Список каналов
         *
         **/
        , createChannels: function () {
            var channels = '';
            for (var i = 0; i < ChannelsManager.channelsList.elementCount; i++) {

                var channel = ChannelsManager.channelsList.elements[i];

                channels += '<div id="channel_' + i + '" class="listitem  btn grey" onmousedown="program.clickChannel(' + i + '); return false;">' +
                '<div class="list_item_text">' + channel.title + '</div></div>';
            }
            this.content = channels;
            menu_cont.setContentId("channels_container", this.content);
        }
        /**
         * Список програм
         *
         **/
        , createPrograms: function () {
            var programs = '';
            var channel = ChannelsManager.getCurrentChannel();
            for (var i = 0; i < this.programsList.elementCount; i++) {
                var prog = this.programsList.elements[i];
                var title = prog.t_start.split(' ')[1] + ' - ' + prog.title;

                programs += '<div id="' + this.list_item_name + '_' + i + '"  onmousedown="program.clickProgram(' + i + '); return false;" class="listitem grey"><div class="list_item_text">' +
                '<div class="left text_program">' + title + '</div>';
                //помечаем доступен ли архив
                if ((time_obj.unix_time >= parseInt(prog.ut_start)) && parseInt(channel.rec_duration) >= (time_obj.unix_time - parseInt(prog.ut_start))) {
                    //текущая передача
                    if ((prog.ut_start <= time_obj.unix_time) && (prog.ut_stop >= time_obj.unix_time)) {
                        programs += '<div class="record">Live</div>';
                    } else {
                        programs += '<div class="record">Rec</div>';
                    }
                }

                programs += '</div></div>';
            }

            ChannelsManager.updateProgramList();
            //Инициализация скролла для програм
            if (this.programsList.elementCount) {
                menu_cont.setContentId("epg_container", programs);
                program.showDescr();
                scrollbar_obj.init(1, 'program_program');
                scrollbar_obj.show(this.programsList.GetCurrentElementIndex(), this.programsList.elementCount, 1);
                program.stop_scroll_program = 0;
                program.updateProgram();
            }
            else {
                var text = program.type == 'archive' ? TextConfig.common.no_archive : TextConfig.common.no_program;
                menu_cont.setContentId("epg_container", '<div class="title">' + text + '</div>');
            }
            spin_obj.stop();
        }
        /**
         * Строим главный шаблон
         */
        , createEpgContent: function () {

            var program_content = '';
            var prog;
            var programs_epg = '';
            var program_length;

            for (var i = 0; i < ChannelsManager.channelsList.elementCount; i++) {

                var channel = ChannelsManager.channelsList.elements[i];

                /**
                 * Предачи для канала
                 *
                 */
                programs_epg = '';
                program_content += '<div id="progam_container_' + i + '" class="progam_container">';
                if(ChannelsManager.channelsList.elements[i].programs) {

                    for (var y = 0; y < ChannelsManager.channelsList.elements[i].programs.length; y++) {

                        prog = ChannelsManager.channelsList.elements[i].programs[y];

                        if (prog.ut_stop < time_obj.unix_time) continue;

                        if (prog.ut_stop > (time_obj.unix_time + 10800)) break;

                        program_length = program.epgPxPerMin * (prog.ut_stop - prog.ut_start) / 60;
                        programs_epg += '<div style="width:' + program_length + 'px;" id="program_' + i + '_' + y + '" onclick="epg.clickProgram(' + i + ',' + y + ');"' +
                        ' class="listitem  left grey"><div class="list_item_text">' + prog.title + '</div>' +
                        '</div>';
                    }
                }

                if (!ChannelsManager.channelsList.elements[i].programs || ChannelsManager.channelsList.elements[i].programs.length == 0 || !programs_epg) {
                    programs_epg += '<div style="width:' + program.epg_width + 'px;" id="program_' + i + '_' + y + '"' +
                    ' class="listitem left grey"><div class="list_item_text">' + TextConfig.common.no_program + '</div>' +
                    '</div>';
                }
                program_content += programs_epg+'</div>';

            }

            menu_cont.setContentId("epg_container", program_content);

            program.drawTimeLine();

            program.updateDate();
            program.showDescr();
            spin_obj.stop();
        }
        , epgUpdateProgram: function () {
            var prog = program.getNowProgram(ChannelsManager.getCurrentChannel(), time_obj.unix_time);
            if (prog) {
                program.setProgram(prog.id);
            }
            navigation.setDoubleActive('program', ChannelsManager.channelsList.GetCurrentElementIndex(), ChannelsManager.old_index, program.programsList.GetCurrentElementIndex(), program.old_index);
            program.showDescr();
        }
        /**
         * ЛИНИЯ ВРЕМЕНИ
         *
         */
        , drawTimeLine: function () {
            document.getElementById('cur_time').style.display = 'block';
            document.getElementById('cur_time_val').style.display = 'block';
            //сдвигаем линию текущего времени 1 минута - 10px
            var pos_time_line = program.epgPxPerMin * (time_obj.unix_time_timezone - time_obj.ut_timezone_hour) / 60;

            document.getElementById('cur_time_val').style.left = pos_time_line - 30 + 'px';

            menu_cont.setContentId("cur_time_val", DataManager.unixToTime(time_obj.unix_time_timezone));
            document.getElementById('cur_time').style.left = pos_time_line + 'px';
            document.getElementById('cur_time').style.height = Main.height_time_line + 'px';

            document.getElementById('epg').style.width = program.epg_width + 'px';

            //метки времени рисуем
            var width_time = program.epg_width/2;
            var time_line_items = '<div style="width:' + width_time + 'px">' + DataManager.unixToTime(time_obj.ut_timezone_hour) + '</div>' +
                '<div style="width:' + width_time + 'px; position: relative;"><div  style="position: absolute; left: -30px;">' + DataManager.unixToTime(time_obj.ut_timezone_hour + 1800) +'</div>'+
                '<div  style="float:right">' + DataManager.unixToTime(time_obj.ut_timezone_hour + 3600) + '</div>'+
                '</div>';
            menu_cont.setContentId("time_line", time_line_items);
        }
        /*
         * Информация о программе
         */
        , showDescr: function () {
            var descr = '',
            title = '',
                prog = null,
            duration = '';

            if( program.type == 'epg') {
                prog = program.getNowProgram(ChannelsManager.getCurrentChannel(), time_obj.unix_time);
            } else {
                prog = program.programsList.getCurrentElement();
            }


            if (prog) {
                var time_start_stop = prog.t_start.split(' ')[1] + ' - ' + prog.t_stop.split(' ')[1];

                title = time_start_stop + " " + prog.title;
                var prog_duration = (prog.ut_stop - prog.ut_start) / 60;
                duration = prog_duration + " " + TextConfig.common.minute + ".";

                if (prog.has_desc == 1) {
                    descr = prog.desc;
                }
            }

            menu_cont.setContentId("epg_descr_title", title);
            menu_cont.setContentId("epg_descr_duration", duration);
            menu_cont.setContentId("epg_descr_descr", descr);
        }

        /**
         * Обработка действий
         */
        , navigate: function (type) {
            ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();
            program.old_index = program.programsList.GetCurrentElementIndex();
            //очищаем предыдущий таймер
            clearTimeout(this.timer);
            //изменение канала
            if (type == 'down') {
                ChannelsManager.moveCurrentChannelTo('down');
            }
            else if (type == 'up') {
                if(PlatformManager.getDevice() == PlatformManager.Android && ChannelsManager.channelsList.GetCurrentElementIndex() == 0) {
                    program.ActivateDateMenu();
                    return true;
                }
                ChannelsManager.moveCurrentChannelTo('up');
            } else if (type == 'page_down') {
                ChannelsManager.channelsList.SetNextPage();
            } else if (type == 'page_up') {
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
                if (program.type == 'archive' || program.type == 'prog') {
                    if (this.programsList.elementCount) {
                        removeClass(document.getElementById(this.state + '_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "hover");
                        this.state = 'program';
                        navigation.setActive(this.state, this.programsList.GetCurrentElementIndex(), 0);
                        addClass(document.getElementById(this.state + '_' + this.programsList.GetCurrentElementIndex()), "hover");
                    }
                } else {
                    program.play();
                }
            }
            //Навигация для программ
            else if (type == 'down_program') {
                this.moveCurrentProgramTo('down');
            }
            else if (type == 'up_program') {
                this.moveCurrentProgramTo('up');
            }
            else if (type == 'left_program') {
                removeClass(document.getElementById(this.state + '_' + this.programsList.GetCurrentElementIndex()), "active");
                removeClass(document.getElementById(this.state + '_' + this.programsList.GetCurrentElementIndex()), "hover");
                this.state = 'channel';
                addClass(document.getElementById(this.state + '_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "hover");
            }
            else if (type == 'page_up_program') {
                this.programsList.SetPrevPage();
                this.updateProgram();
            }
            else if (type == 'page_down_program') {
                this.programsList.SetNextPage();
                this.updateProgram();
            }
            else if (type == 'ok_program') {
                this.channel_cat = ChannelsManager.categoriesList.GetCurrentElementIndex();
                this.channel_num = ChannelsManager.channelsList.GetCurrentElementIndex();
                program.clickProgram(program.programsList.GetCurrentElementIndex());
            }
            return true;
        }
        ,ActivateDateMenu:function () {
            state_obj.state = 'program_date_menu';
            addClass(document.getElementById('epg_date_container'), 'active');

            removeClass(document.getElementById(this.state + '_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "hover");
            removeClass(document.getElementById(this.state + '_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
        }
        ,DeActivateDateMenu:function () {
            state_obj.state = 'program';
            removeClass(document.getElementById('epg_date_container'), 'active');
            addClass(document.getElementById(this.state + '_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "hover");
            addClass(document.getElementById(this.state + '_' + ChannelsManager.channelsList.GetCurrentElementIndex()), "active");
        }
        ,moveCurrentProgramTo: function (to) {
            if (to == 'down') {
                this.programsList.MoveCurrentElementToDown();
            } else if (to == 'up') {
                this.programsList.MoveCurrentElementToUp();
            }
            this.updateProgram();
        }
        , updateProgram: function () {
            this.new_index = this.programsList.GetCurrentElementIndex();
            var hover = 0;
            if (state_obj.state == "program" && program.state == 'program') hover = 1;

            navigation.setActive('program', this.new_index, this.old_index,hover);
            scrollbar_obj.show(this.new_index, this.programsList.elementCount, 1);
            this.showDescr();
        }
        , back: function () {
            if (program.initArchiveChannels) {
                ChannelsManager.setMainChannelsList(ChannelsManager.main_channels_list);
            }
            //если была загружена программа для не сегодняшнего дня, обнуляем ее и загружаем для сегодняшнего
            if (program.day) {
                program.day = 0;
            } else {
                ChannelsManager.setCategory(this.channel_cat);
                ChannelsManager.setChannel(this.channel_num);
            }
            if(state_obj.state_prev == 'android_channel_menu') {
                android_channel_menu.show();
            } else {
                MainMenu.show();
            }
        }
        , clickChannel: function (id) {
            program.state = 'channel';
            ChannelsManager.old_index = ChannelsManager.channelsList.GetCurrentElementIndex();
            ChannelsManager.setChannel(id);
            removeClass(document.getElementById('program' + '_' + this.programsList.GetCurrentElementIndex()), 'hover');
        }
        , clickProgram: function (id) {
            program.state = 'program';
            program.old_index = program.programsList.GetCurrentElementIndex();
            if (id != this.old_index) {
                program.setProgram(id);
                program.updateProgram();
                removeClass(document.getElementById('channel' + '_' +  ChannelsManager.channelsList.GetCurrentElementIndex()), 'hover');
            }
            else {
                time_obj.timeshifted_unix_time = parseInt(program.getCurrentProgram().ut_start);

                if (player.player_type != PlatformManager.integratedVideo && (source.getVideoType() != 'vod' || program.isCurrentProgramLive())) {
                    ExternalPlayerView.show();
                } else {
                    program.play();
                }
            }
            return false;
        }
        /**
         * Воспроизводим текущую программу
         */
        , play: function () {

            menu_cont.hide();
            arch_player.loadInfo();
            arch_player.updateTimeLines(0);

            if((program.type == 'epg') || (program.type == 'prog' && program.getCurrentProgram() && (program.isCurrentProgramLive()))) {
                source.playLive(); 
            } else {
                arch_player.play();
            }

            state_obj.state = "live_player";
            state_obj.sub_state = 'view';

            ch_obj.cat_num = ChannelsManager.GetCurrentCategoryNumber();
            ch_obj.ch_num = ChannelsManager.GetCurrentChannelNumber();

            if (program.initArchiveChannels) {
                ChannelsManager.setMainChannelsList(ChannelsManager.main_channels_list);
            }

            ChannelsManager.setCategoryByNumber(ch_obj.cat_num);
            ChannelsManager.setChannelByNumber(ch_obj.ch_num);
        }
        /**
         * Изменение даты
         */
        , changeDate: function (type) {
            if (type == 'next') {
                ++program.day;
            }
            else if (type == 'prev') {
                --program.day;
            }
            if (program.type == 'archive') {
                if (program.day > 0) {
                    program.day = 0;
                    return false;
                } 
            }
            program.updateDate();
            clearTimeout(program.load_program_timer);
            program.load_program_timer = setTimeout('program.loadNewProgram();', 700);
            return true;
        }
        , updateDate: function () {
            var date_str = dateToString(program.day);
            program.cur_month_day = dateToMonthDay(program.day);
            menu_cont.setContentId("date_title", date_str);
        }
        , loadNewProgram: function () {
            spin_obj.start();
            menu_cont.setContentId("epg_container", '');


            if(!ChannelsManager.getCurrentChannel().program[program.cur_month_day]) {
                ChannelsManager.GetProgramsByDay(program.getPrograms);
            } else {
                ChannelsManager.initProgramsList(Main.channels_small_list_per_page);
                program.createPrograms();
            }
        }
        ,isCurrentProgramLive: function () {
            var program_temp = program.getCurrentProgram();

            return (program_temp.ut_start < time_obj.unix_time && program_temp.ut_stop > time_obj.unix_time);
        }
        , setProgram: function (id) {
            this.programsList.SetCurrentElementByIndex(id);
        }
        , getCurrentProgram: function () {
            return this.programsList.getCurrentElement();
        }
        , getNowProgram: function (channel, time) {
            var prog_one = null;

            var ch_programs = channel.programs;
            if(!ch_programs) return prog_one;

            if(program.day != 0 && channel.program[program.cur_month_day]) {
                ch_programs = channel.program[program.cur_month_day];
            }

            for (var i = 0; i < ch_programs.length; i++) {
                var prog = ch_programs[i];

                if (parseInt(prog.ut_start) <= time && parseInt(prog.ut_stop) > time) {
                    if (ch_programs[i] !== undefined) {
                        ch_programs[i].type = 'now';
                        ch_programs[i].id = i;
                        prog_one = ch_programs[i];
                        break;
                    }
                }
            }
            return prog_one;
        }
        , getNextProgram: function (channel, time) {
            var prog_one = null;

            var ch_programs = channel.programs;
            if(!ch_programs) return prog_one;

            if(program.day != 0 && channel.program[program.cur_month_day]) {
                ch_programs = channel.program[program.cur_month_day];
            }

            for (var i = 0; i < ch_programs.length; i++) {
                var prog = ch_programs[i];
                if (parseInt(prog.ut_start) <= time && parseInt(prog.ut_stop) > time) {
                    if (ch_programs[i + 1] !== undefined) {
                        prog_one = ch_programs[i + 1];
                        break;
                    } else {
                        if(program.day < 0) {
                            program.day++;
                            ChannelsManager.GetProgramsByDay(program.onGetNextProgramms);
                        }
                    }
                }
            }
            return prog_one;
        }
        , getPrevProgram: function (channel, time) {

            var prog_one = null;

            var ch_programs = channel.programs;
            if(!ch_programs) return prog_one;

            if(program.day != 0 && channel.program[program.cur_month_day]) {
                ch_programs = channel.program[program.cur_month_day];
            }

            for (var i = 0; i < ch_programs.length; i++) {
                var prog = ch_programs[i];
                if (parseInt(prog.ut_start) <= time && parseInt(prog.ut_stop) > time) {
                    if (ch_programs[i - 1] !== undefined) {
                        prog_one = ch_programs[i - 1];
                        break;
                    } else {
                        program.day--;
                        ChannelsManager.GetProgramsByDay(program.onGetPrevProgramms);
                    }
                }
            }

            return prog_one;
        }
        ,onGetPrevProgramms: function () {
            ChannelsManager.initProgramsList(Main.channels_small_list_per_page);

            var now_prog = program.getNowProgram(ChannelsManager.getCurrentChannel(), time_obj.timeshifted_unix_time);

            if (now_prog && now_prog.id)
                program.programsList.SetCurrentElementByIndex(now_prog.id);
        }
        , onGetNextProgramms: function () {
            arch_player.prevNextPid('next');
            ChannelsManager.initProgramsList(Main.channels_small_list_per_page);

            var now_prog = program.getNowProgram(ChannelsManager.getCurrentChannel(), time_obj.timeshifted_unix_time);

            if (now_prog && now_prog.id)
                program.programsList.SetCurrentElementByIndex(now_prog.id);
        }
        , getNowNextProgram: function (channel) {
            var programs = [];

            var time = time_obj.unix_time;
            if(!channel || !channel.programs) return programs;

            for (var i = 0; i < channel.programs.length; i++) {
                var prog = channel.programs[i];
                if (parseInt(prog.ut_start) <= time && parseInt(prog.ut_stop) > time) {
                    if (channel.programs[i] !== undefined) {
                        channel.programs[i].type = 'now';
                        channel.programs[i].id = i;
                        programs.push(channel.programs[i]);
                    }
                    if (channel.programs[i + 1] !== undefined) {
                        channel.programs[i + 1].type = 'next';
                        programs.push(channel.programs[i + 1]);

                    }
                    break;
                }
            }
            return programs;
        }
    }
})();