var navigation = (function () {
    return {

        /*
         *
         */
        setActive: function (name, act_id, deact_id, hover) {

            if (document.getElementById(name + '_' + deact_id)) {
                removeClass(document.getElementById(name + '_' + deact_id), 'active');
                if (hover) removeClass(document.getElementById(name + '_' + deact_id), 'hover');
            }
            if (document.getElementById(name + '_' + act_id)) {
                addClass(document.getElementById(name + '_' + act_id), 'active');
                if (hover) addClass(document.getElementById(name + '_' + act_id), 'hover');
            }
        }
        , setDoubleActive: function (name, act_id, deact_id, next_act_id, next_deact_id) {
            if (document.getElementById(name + '_' + deact_id + '_' + next_deact_id) !== null) {
                removeClass(document.getElementById(name + '_' + deact_id + '_' + next_deact_id), "active");
                //document.getElementById(name+'_'+deact_id+'_'+next_deact_id).classList.remove("active");
            }
            if (document.getElementById(name + '_' + act_id + '_' + next_act_id) !== null) {
                addClass(document.getElementById(name + '_' + act_id + '_' + next_act_id), 'active');
                //document.getElementById(name+'_'+act_id+'_'+next_act_id).classList.add("active");
            }

        }
        , doubleDeactive: function (name, deact_id1, deact_id2) {
            if (document.getElementById(name + '_' + deact_id1 + '_' + deact_id2) !== null) {
                removeClass(document.getElementById(name + '_' + deact_id1 + '_' + deact_id2), "active");
                //document.getElementById(name+'_'+deact_id1+'_'+deact_id2).classList.remove("active");
            }
        }
        , focus: function (id) {
            document.getElementById(id).disabled = false;
            document.getElementById(id).focus();
        }
        , checkboxChange: function (id) {
            var checkbox = document.getElementById(id);
            if (checkbox.checked === true) {
                checkbox.checked = false;
                removeClass(checkbox.parentNode, 'checked');
            }
            else {
                checkbox.checked = true;
                addClass(checkbox.parentNode, 'checked');
            }

        }
        , addActiveClass: function (element) {
            if (hasClass(element, "active") === false) {
                addClass(element, "active");
            }
        }
        , removeActiveClass: function (element) {
            if (hasClass(element, "active")) {
                removeClass(element, "active")
            }
        }
    }

})();
var dropdown_menu = (function () {
    return {
        content: ''
        , prev_state: ''
        , cur_selected: 0
        , sub_menu: ''
        , onclick: null
        , old_active: 0
        , list_item_name: 'dropdown_menuitem'

        , init: function (array, onclick, active_val, title) {

            dropdown_menu.dropdownList.Init(array, Main.settings_list_per_page);

            this.sub_menu = title;

            this.content = '<div class="settings_list channels_settings"><div id="dropdown_menu" class="menu dropdown">';

            dropdown_menu.onclick = onclick;

            for (var i = 0; i < array.length; i++) {

                this.content += '<div  id=dropdown_menuitem_' + i + ' onclick=dropdown_menu.click(' + i + ') class="listitem grey"><div class="list_item_text">' + array[i].title + '</div></div>';
            }
            this.content += '</div></div><div class="scroll_content"></div>';

            this.show();

            if (dropdown_menu.dropdownList.elementCount > Main.settings_list_per_page) {
                scrollbar_obj.init(0, 'dropdown_menu');
            }


            scrollbar_obj.show(0, dropdown_menu.dropdownList.elementCount, 0);
            dropdown_menu.dropdownList.SetCurrentElementByIndex(active_val);
        }
        , updateElement: function () {
            navigation.setActive(dropdown_menu.list_item_name, dropdown_menu.dropdownList.GetCurrentElementIndex(), dropdown_menu.old_active);
            scrollbar_obj.show(dropdown_menu.dropdownList.GetCurrentElementIndex(), dropdown_menu.dropdownList.elementCount, 0);
        }
        , updatePage: function () {
            document.getElementById('dropdown_menu').style.top = dropdown_menu.dropdownList.GetCurrentPageIndex() * ChannelsManager.containerHigh + 'px';
        }
        , show: function () {
            dropdown_menu.prev_state = state_obj.state;
            menu_cont.buildTemplate('dropdown_menu');
            menu_cont.setContentClass("line", '<div class="settings_cat">' + this.sub_menu + '</div>');
            menu_cont.setContentClass("content", this.content);
            document.getElementsByClassName('settings_list')[0].style.height = -1 * ChannelsManager.containerHigh + 'px';
            dropdown_menu.updateElement();
            dropdown_menu.updatePage();
        }
        , hide: function () {
            state_obj.state = dropdown_menu.prev_state;
            if (dropdown_menu.prev_state == 'vod_one') {
                VODManager_one.backShow();
            }
        }
        , navigate: function (type) {
            this.old_active = dropdown_menu.dropdownList.GetCurrentElementIndex();
            if (type == 'down') {
                dropdown_menu.dropdownList.MoveCurrentElementToDown();
            }
            else if (type == 'up') {
                dropdown_menu.dropdownList.MoveCurrentElementToUp();
            }
            else if (type == 'ok') {
                if(this.sub_menu == TextConfig.kinozal.chose_seria) {
                    VODManager_one.cur_seria = dropdown_menu.dropdownList.GetCurrentElementIndex();
                }
                dropdown_menu.onclick(dropdown_menu.dropdownList.GetCurrentElementIndex());
            }
        }
        , click: function (id) {
            dropdown_menu.onclick(id);
        }
    }
})();
/**
 * Отвечает за положение, размер и перемещение полосы прокрутки
 * Для инициализации должен быть хотя бы один бок с класом scroll_content
 * если их несколько то для первого init(0) show(position,count_all,0)
 * для вторго init(1) show(position,count_all,1)
 *
 */
var scrollbar_obj = (function () {
    return {
        size: 0
        , bar_height: 0
        , top_margin: 0
        , init: function (i, type) {
            //create
            html_scroll = '<div class="scroll_arrow_up" onclick=scrollbar_obj.navigateUp(\"' + type + '\");></div>';
            html_scroll += '<div class="scrollbar">';
            html_scroll += '<div class="bar"></div>';
            html_scroll += '</div>';
            html_scroll += '<div class="scroll_arrow_down" onclick=scrollbar_obj.navigateDown(\"' + type + '\");></div>';
            if (document.getElementsByClassName('scroll_content')[i] !== undefined) {
                document.getElementsByClassName('scroll_content')[i].innerHTML = html_scroll;
            }
            if (type == 'channels_menu') {
                this.size = Main.chennels_list_scroll_size;
                document.getElementsByClassName('scroll_content')[i].style.marginTop = '0px';
            } else if (type == 'settings_channel') {
                this.size = Main.settings_list_scroll_size;
            } else if (type == 'main_menu') {
                this.size = Main.main_menu_scroll_size;
            } else if (type == 'vod_genres') {
                this.size = Main.vod_genres_scroll_size;
            } else if (type == 'dropdown_menu') {
                this.size = Main.settings_list_scroll_size;
            }
            else {
                this.size = Main.program_scroll_size;
                document.getElementsByClassName('scroll_content')[i].style.marginTop = '45px';
            }
        }
        /**
         * Принимает текущие положение (для смещение относительно верха)
         * и общее количество (для определения размера)
         */
        , show: function (position, count_all, i) {
            this.bar_height = this.size / count_all;
            this.top_margin = position * this.bar_height;
            if (!document.getElementsByClassName('scrollbar')[i]) {
                return false;
            }
            document.getElementsByClassName('scrollbar')[i].style.height = this.size + "px";
            document.getElementsByClassName('bar')[i].style.height = this.bar_height + "px";
            document.getElementsByClassName('bar')[i].style.top = this.top_margin + "px";
            return true;
        }
        , navigateUp: function (type) {
            if (type == 'channels_menu') {
                channel_menu.navigate('page_up');
            }
            else if (type == 'settings_channel') {
                channels_settings.navigate('page_up');
            }
            else if (type == 'program_program') {
                program.navigate('page_up_program');
            }
            else if (type == 'program_channel') {
                program.navigate('page_up');
            }
            else if (type == 'main_menu') {
                MainMenu.navigate('page_up');
            }
        }
        , navigateDown: function (type) {
            if (type == 'channels_menu') {
                channel_menu.navigate('page_down');
            }
            else if (type == 'settings_channel') {
                channels_settings.navigate('page_down');
            }
            else if (type == 'program_program') {
                program.navigate('page_down_program');
            }
            else if (type == 'program_channel') {
                program.navigate('page_down');
            }
            else if (type == 'main_menu') {
                MainMenu.navigate('page_down');
            }
        }
    }
})();

var center_block = (function () {
    return {
        size: 370
        , prev_state: ''
        , state: ''
        , cur_selected: 0
        , mouse_timer: 0
        , list_item_name: 'center_block'
        , show: function (array) {
            var active;
            center_block.prev_state = state_obj.state;
            state_obj.state = "center_block";
            center_block.array_obj = array;
            var content = '<div id="center_block_menu">';

            for (var i = 0; i < center_block.array_obj.length; i++) {
                active = '';
                if (i == this.cur_selected) {
                    active = 'active';
                }
                content += '<div id="' + this.list_item_name + '_' + i + '" onclick=' + center_block.array_obj[i].onclick + ' class="listitem grey ' + active + '"><div class="list_item_text">' + center_block.array_obj[i].title + '</div></div>';
            }
            content += '</div>';

            var element = document.getElementById('center_block');
            removeClass(element, 'small_block');

            this.showBlock(content);


        }
        , hide: function () {
            state_obj.state = center_block.prev_state;
            document.getElementById('center_block').style.display = 'none';
            DataManager.unblock();
        }
        , navigate: function (type) {
            var old_active = this.cur_selected;
            if (type == 'down') {
                var etalon = this.cur_selected + 1;

                if (etalon < center_block.array_obj.length) {
                    ++this.cur_selected;
                }
                navigation.setActive(this.list_item_name, this.cur_selected, old_active);
            }
            else if (type == 'up') {
                if (this.cur_selected != 0) {
                    --this.cur_selected;
                }
                navigation.setActive(this.list_item_name, this.cur_selected, old_active);
            }
            else if (type == 'ok') {
                center_block.hide();
                center_block.array_obj[this.cur_selected].ok();
                //navigation.click(this.list_item_name,this.cur_selected); 
            }
        }
        , navigatePage: function (type) {
            if (type == 'up') {
                var etalon = this.cur_page + 1;

                if (etalon <= center_block.total_pages) {
                    ++this.cur_page;
                }
            }
            else if (type == 'down') {
                if (this.cur_page != 1) {
                    --this.cur_page;

                }
            }
            else if (type == 'ok') {
                center_block.hide();
                VODManager.selectPage(this.cur_page - 1);
            }
            menu_cont.setContentId("cur_page", this.cur_page);
        }
        , showPage: function (cur_page, total_pages) {
            center_block.prev_state = state_obj.state;
            state_obj.state = "center_block_page";
            center_block.cur_page = cur_page;
            center_block.total_pages = total_pages;

            var content = '<div id="center_block_page" class="center">';
            content += '<div class="arrow_big_up" onclick=center_block.mouseUp();></div>';
            content += '<div id="cur_page">' + cur_page + '</div>';
            content += '<div class="arrow_big_down" onclick=center_block.mouseDown();></div>';
            content += '</div>';

            var element = document.getElementById('center_block');
            addClass(element, 'small_block');
            this.showBlock(content);
        }
        , showBlock: function (content) {
            menu_cont.setContentId("center_block", content);
            document.getElementById('center_block').style.display = 'block';
            DataManager.block();
        }
        , mouseUp: function () {
            center_block.navigatePage("up");
            center_block.loadVod();
        }
        , mouseDown: function () {
            center_block.navigatePage("down");
            center_block.loadVod();
        }
        , loadVod: function () {
            clearTimeout(center_block.mouse_timer);
            center_block.mouse_timer = setTimeout('VODManager.selectPage(center_block.cur_page-1);', 700);
        }
        , askMessage: function () {
            center_block.prev_state = state_obj.state;
            state_obj.state = "center_block";
            var content = '<div id="center_block_menu">';
            content += '<div id="center_block_message"></div>';
            content += '<div id="center_block_buttons"></div>';
            content += '</div>';
        }
    }
})();


var DialogMessageManager = (function () {
    return {
        currentDialogType: 0
        , aDialogKeyPressCallback: null
        , aDialogKeyPressOkCallback: null
        , dialogShow: false
        , button_margin: 0
        , Init: function () {
            this.dialogList = new List();
            this.dialogList.SetCurrentElementGhangedCallback(DialogMessageManager.UpdateDialogMessageSelectActiveBlock);
        }
        , ProcessKeyPressRight: function () {
            DialogMessageManager.old_index = DialogMessageManager.dialogList.GetCurrentElementIndex();
            this.dialogList.MoveCurrentElementToUp();
        }
        , ProcessKeyPressLeft: function () {
            DialogMessageManager.old_index = DialogMessageManager.dialogList.GetCurrentElementIndex();
            this.dialogList.MoveCurrentElementToDown();
        }
        , ProcessKeyPressEnter: function () {
            if (this.dialogList.getCurrentElement().result) {
                if (this.aDialogKeyPressOkCallback) {
                    this.aDialogKeyPressOkCallback();
                    this.aDialogKeyPressOkCallback = null;
                }
            }

            if (this.aDialogKeyPressCallback) {
                this.aDialogKeyPressCallback();
                this.aDialogKeyPressCallback = null;
            }
            DialogMessageManager.HideDialogMessage();
        }
        , ShowDialogMessage: function (aDialogType, text, aDialogKeyPressCallback, aDialogKeyPressOkCallback) {
            state_obj.prev_state = state_obj.state;
            state_obj.state = 'DialogMessageManager';

            this.SetKeyPanel(aDialogType);
            this.dialogShow = true;

            DialogMessageManager.UpdateDialogMessageSelectActiveBlock();
            document.getElementById('dialog_message').style.display = 'block';
            document.getElementById('dialog_message_text').innerHTML = text;
            this.aDialogKeyPressOkCallback = aDialogKeyPressOkCallback;
            this.aDialogKeyPressCallback = aDialogKeyPressCallback;
        }
        , SetKeyPanel: function (aDialogType) {
            switch (aDialogType) {
                case ConstValue.cKeyOk:
                    this.dialogList.Init(TextConfig.dialogButtons.ok, TextConfig.dialogButtons.ok.length);
                    this.fillKeys(TextConfig.dialogButtons.ok);
                    break;

                case ConstValue.cKeyOk:
                    this.dialogList.Init(TextConfig.dialogButtons.cancel, TextConfig.dialogButtons.ok.length);
                    this.fillKeys(TextConfig.dialogButtons.cancel);
                    break;

                case ConstValue.cKeyOkCancel:
                    this.dialogList.Init(TextConfig.dialogButtons.okCancel, TextConfig.dialogButtons.okCancel.length);
                    this.fillKeys(TextConfig.dialogButtons.okCancel);
                    break;
            }
        }
        , fillKeys: function (buttons) {
            var info = '';
            buttons.forEach(function (button,i) {
                var style = '';
                if(i == buttons.length - 1) style = 'style="float:right;"';

                info += '<div id="navigation_key_'+i+'" class="navigation_key" '+style+' >' + button.name + '</div>';
            });
            document.getElementById('navigation_key_panel').innerHTML = info;
        }
        , HideDialogMessage: function () {
            state_obj.state = state_obj.prev_state;
            this.dialogShow = false;
            document.getElementById('dialog_message').style.display = 'none';
        }
        , UpdateDialogMessageSelectActiveBlock: function () {
            navigation.setActive('navigation_key', DialogMessageManager.dialogList.GetCurrentElementIndex(), DialogMessageManager.old_index);
        }
    }
})();