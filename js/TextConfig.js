var TextConfig =  (function(){
    return {

        quality:{
            1:          "Стандарт"
            ,2:         "Премиум"
        }
        ,kinozal:{
            kinozal:        'Кинозал'
            ,genre:         'Жанры'
            ,genr:          'Жанр'
            ,fav:           'Избранное'
            ,top:           'Топ'
            ,search:        'Поиск'
            ,pubdate:       'Новинки'
            ,play:          'Просмотр'
            ,country:       'Страна'
            ,producer:      'Режисер'
            ,actors:        'Актеры'
            ,descr:         'Описание'
            ,imdb:          'IMDb'
            ,kp:            'Кинопоиск'
            ,rate:          'Рейтинг'
            ,input_search:  'Введите название для поиска'
            ,small_search:  'Минимальное  число символов для поиска 3!'
            ,no_films:      'Контент не найден'
            ,no_fav_films:  'В избранное не добавлено ни одного фильма'
            ,add_to_fav:    'В избранное добавлен фильм'
            ,add_favorite:  'В избранное'
            ,remove_from_fav:'Из избранного удален фильм'
            ,choose_page:   'Выбор страницы'
            ,sort:          'Сортировка'
            ,bwd_fwd:       'Перемотка'
            ,addToFav:      'В избранное'
            ,removeFromFav: 'Убрать из избранного'
            ,chose_genre:   'Выбор жанра'
            ,next_page:     'Следующая страница'
            ,prev_page:     'Предыдущая страница'
            ,chose_seria:   'Выбор серии'
            ,chose_quality: 'Выбор качества'
        }
        ,common:{
            pass:           'Пароль'
            ,login:         'Логин'
            ,save:          'Сохранить'
            ,now:           'Сейчас'
            ,next:          'Позже'
            ,back:          'Назад'
            ,abonement:     'Абонемент'
            ,watch_tv:      'Просмотр ТВ'
            ,program:       'Программа'
            ,epg:           'Телегид'
            ,to_watch:      'К просмотру'
            ,watch:         'Просмотр'
            ,save_pass:     'Запомнить пароль'
            ,auto_login:    'Автоматический вход'
            ,enter:         'Вход'
            ,input_text:    'Ввести'
            ,cancel:        'Отмена'
            ,test_abon:     'Тестовый абонемент'
            ,free_test:     'Бесплатный тест на 7 дней'
            ,autorize:      'Авторизируйтесь'
            ,logo_big:      'logo_big.png'
            ,logo:          'logo.png'
            ,logo_small:    'logo_small.png'
            ,star:          'yellow_star.png'
            ,change:        'Изменить'
            ,show:          'Отображать'
            ,not_show:      'Не отображать'
            ,minute:        'мин'
            ,go_next_page:  'Перейти к следующей странице'
            ,go_prev_page:  'Перейти к предыдущей странице'
            ,details:       'Подробнее'
            ,no_info:       'По данному запросу информация отсутствует'
            ,no_archive:    'Архив отсутствует'
            ,change_date:   'Смена даты'
            ,change_cat:    'Смена категории'
            ,no_program:    'Программа отсутствует'
            ,page:          'Страница'
            ,from:          'из'
            ,minutes:       'минут'
            ,minimize:      'Свернуть'
            ,next_channel:  'Следующий канал'
            ,prev_channel:  'Предыдущий канал'
            ,channels:      'Каналы'
            ,change_channel:'Смена канала'
            ,chose_program: 'Выбор передачи'
            ,prev_next_program: 'Предыдущая/следующая передача'
            ,prev_live_program: 'Предыдущая передача/онлайн'
            ,menu:              'Меню'
            ,pause:             'Пауза'
            ,player:            'Перемотка'
            ,version:           'Версия портала'
            ,archive_tv:        'Архив ТВ'
            ,info:              'Информация'
            ,exit:              'Выход'
            ,play:              'Воспроизвести'
            ,change_date:       'Изменить дату'
            ,reload_stream:     'Перезапуск потока'
            ,online:            'Онлайн'
            ,ask_exit:          'Выйти?'
            ,buffer:            'Буффер'
            ,switch_channel:    'Переключение канала'
        }
        ,settings:{
            settings:       'Настройки'
            ,settings_saved:       'Настройки сохранены'
            ,login_other:   'Войти с другим номером абонемента'
            ,act_to:        'Активен до'
            ,balance:       'Баланс'
            ,tarif:         'Тариф'
            ,retype_pass:   'Переспрашивать пароль'
            ,change_pass:   'Изменить пароль'
            ,bit_rate:      'Скорость'
            ,channels_list: 'Списки каналов'
            ,enter_pass:    'Введите пароль родительского контроля:'
            ,not_all_fields:'Не все поля заполнены!'
            ,pass_not_equal:'Пароли не совпадают'
            ,old_pass:      'Старый пароль'
            ,wrong_pass:    'Неверный пароль'
            ,new_pass:      'Новый пароль'
            ,submit_pass:   'Подтвердите новый пароль'
            ,change_pass_ok:'Пароль успешно изменен!'
            ,parent_pass:   'Род. контроль'
            ,settings_server:        'Cервер'
            ,time_shift:    'Сдвиг вещания'
            ,time_zone:     'Временная зона'
            ,time_zone_region: 'Регион'
            ,time_zone_city:  'Город'
            ,region:        'Регион'
            ,city:          'Город'
            ,fav_add:       'Канал добавлен'
            ,fav_remove:    'Канал удален'
            ,fav_add_remove:'Добавить/удалить избранный канал'
            ,change_ok:     'Изменения сохранены'
            ,player:        'Плеер'
            ,ratio:         'Пропорции видео'
            ,change_ratio:  'Изменить пропорции'
            ,internet_disconnected:  'Не удается подключиться к серверу'
            ,internet_connected: 'Подключено к сети'
            ,autoreconnect:      'Автореконнект'
            ,settings_playing: 'Воспроизведение'
            , archive_vod_hls: 'Архив VoD HLS'
            ,update : 'Обновить'
        }
        ,ratio:[
            {'title':'100%','val':'1.0'}
            ,{'title':'120%','val':'1.2'}
            ,{'title':'130%','val':'1.3'}
            ,{'title':'140%','val':'1.4'}
        ]
        ,player: {
            TOTAL_BUFFER_SIZE_IN_BYTES: 5*1024*1024
            ,INITIAL_BUFFER_PERCENT: 10
            ,PENDING_BUFFER_PERCENT: 15
        }
        ,dialogButtons:{
            ok:[{name:'OK',result:true}],
            cancel:[{name:'Отмена',result:false}],
            okCancel:[{name:'Отмена',result:false},{name:'OK',result:true}]
        }
        ,player_ratio:["16:9", "4:3", "Zoom","Flat","Scope"]
        ,player_ratio_mag:[{title:'Вписать',val:'16'},{title:'Увеличенный',val:'64'},{title:'Оптимальный',val:'80'},{title:'Растянуть',val:'0'}]
        ,player_ratio_inext: [{title:'Выключено',val:'1'},{title:'Растянуть',val:'2'},{title:'Вписать',val:'3'},{title:'80:110',val:'80:110'}]
        ,player_ratio_inext_aspect: ['PAN SCAN 4:3','LETTERBOX 4:3','16:9','16:10']
        ,player_buffer_size_dune: [{'title': 'auto','val':0},{'title': '1c','val':1000},{'title': '2c','val':2000},{'title':'5c' ,'val':5000},{'title':'10c','val':10000}]
        ,mode_menu_items:[
            {id:'volume',title:'Громкость:',values:[]}
            ,{id:'player_ratio_dune',title:'Пропорции:',values:[{title:'Auto',val:'ASPECT_RATIO_AUTO'},{title:'4:3',val:'ASPECT_RATIO_4_3'},{title:'16:9',val:'ASPECT_RATIO_16_9'}]}

        ]
        ,player_ratio_dune:[{title:'Вписать',val:'16'},{title:'Увеличенный',val:'64'},{title:'Оптимальный',val:'80'},{title:'Растянуть',val:'0'}]
       
    }
})();

