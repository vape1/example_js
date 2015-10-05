/*
 *
 * Кинозал выбор фильма
 *
 */
var VODManager = (function () {
    return {
        films: {}
        //ключ текущего фильма
        , cur_film: 0
        //номер страницы для запроса к апи
        , offset_counter: 0
        //к-ство фильмов в одной строке
        , count_per_row: 0
        //к-свтво видимых фильмов на экране 
        , show_films: 0
        //к-ство строк 
        , row: 2
        //высота смещения строки с фильмами
        , row_height: 250
        //текущее смещение блока с фильмами
        , film_items_top: 0
        //макс к-ство фильмов в одном запросе
        , max_films_count: 28
        //высота контейнера, получаемая с css стиля
        , film_container_height: 0
        //к-тво страниц с фильмами
        , total_pages: 1
        , list_item_name: 'film'
        , sub_menu: ''
        //к-ство полученых фильмов в запросе
        , films_count: 0
        , search_word: ''
        //сортировка  imdb – по рейтингу imdb, pubdate — по дате добавления, kp — по рейтингу КиноПоиска, prod_date — по дате выхода фильма в прокат.
        , sort: 'pubdate'
        , fid: ''
        //Идентификаторы первого и последнего фильмов которые оттображаються в данный момент
        , min_view_film: 0
        , max_view_film: 0
        , bottom_menu_id: 0
        , getMoreDescrCallback: null
        //указатель вида предыдущей страницы
        , old_view: ''
        //указатель жанра
        , num_genre: ''
        , cur_page: 1
        , init: function (type) {
            this.old_view = type;
            VODManager.show_films = VODManager.count_per_row * VODManager.row;
            this.load();
        }
        , load: function () {
            spin_obj.start();
            this.cur_film = 0;
            this.min_view_film = 0;
            this.film_items_top = 0;
            this.max_view_film = VODManager.show_films - 1;
            var offset = this.offset_counter * this.max_films_count;
            var genres = '';
            if (this.old_view == 'genres') {
                genres = vod_genres.genresList.getCurrentElement().number;
            }
            var url = '';
            //Поиск
            if (this.old_view == 'search') {
                url = "query=getFilmsSearch&word=" + this.search_word + "&count=" + this.max_films_count + "&offset=" + offset;
            }
            else {
                url = "query=getFilms&num_genre=" + genres + "&count=" + this.max_films_count + "&offset=" + offset + "&sort=" + this.sort + "&fid=" + this.fid;
            }
            DataManager.sendAjax(url, VODManager.result);
        }
        , result: function (data) {
            VODManager.films = data.data;
            VODManager.total_pages = data.total_pages;
            VODManager.cur_page = VODManager.offset_counter + 1;
            //Добавляем "назад" "вперед" 
            if (VODManager.offset_counter != 0) {
                VODManager.films.unshift({fid: 'back', title: TextConfig.common.go_prev_page});
            }
            if (VODManager.cur_page < VODManager.total_pages) {
                VODManager.films.push({fid: 'next', title: TextConfig.common.go_next_page});
            }

            VODManager.films_count = VODManager.films.length;

            //рисуем контент
            VODManager.createContent();
            spin_obj.stop();
        }
        , createContent: function () {
            this.content = '';
            for (var i = 0; i < VODManager.films_count; i++) {
                if (VODManager.films[i].fid == 'back') {
                    this.content += '<div id="film_' + i + '" class="filmitem" onclick=VODManager.page("prev");>' +
                    '<div class="center next_back">' + TextConfig.kinozal.prev_page + '...</div>' +
                    '</div>';
                }
                else if (VODManager.films[i].fid == 'next') {
                    this.content += '<div id="film_' + i + '" class="filmitem" onclick=VODManager.page("next"); >' +
                    '<div class="center next_back">' + TextConfig.kinozal.next_page + '...</div>' +
                    '</div>';
                }
                else {
                    small_cover = 'images/no_poster.jpg';

                    if (VODManager.films[i].small_cover && VODManager.films[i].small_cover != '') {
                        small_cover = VODManager.films[i].small_cover;
                    }
                    //помечаем фильм из избранного
                    var fav = '';
                    var favs = cookie_obj.getData('rd_fav_vod');
                    if (favs && favs.indexOf(VODManager.films[i].fid) != -1) {
                        fav = 'favorite';
                    }

                    this.content += '<div id="film_' + i + '" class="filmitem ' + fav + '" onclick=VODManager.clickFilm(' + i + '); >' +
                    '<img src="' + small_cover + '"/>' +
                    '<div class="film_text">' + VODManager.films[i].title + '</div><div class="favorite_film"></div>' +
                    '</div>';
                }
            }
            if (VODManager.films_count == 0) {
                this.content = '<div class="title">' + TextConfig.kinozal.no_films + '</div>';
            }
            this.createHeader();
            this.fillTemplate();
        }
        , createHeader: function () {

            var films_count = TextConfig.common.page + ' ' + VODManager.cur_page + ' ' + TextConfig.common.from + ' ' + this.total_pages;

            var cur_cat = '';
            if (this.old_view == 'genres') {
                cur_cat = TextConfig.kinozal.genr + ' : ' + vod_genres.genresList.getCurrentElement().title + ' | ' + TextConfig.kinozal[this.sort];
            }
            else if (this.old_view == 'search') {
                cur_cat = TextConfig.kinozal.search + ' : <span class=search_word">' + this.search_word + ' </span>| ' + TextConfig.kinozal[this.sort];
            }
            else if (this.old_view == 'fav') {
                cur_cat = TextConfig.kinozal.fav + ' | ' + TextConfig.kinozal[this.sort];
            }
            else {
                cur_cat = TextConfig.kinozal[this.sort];
            }
            this.sub_menu = '<div class="vod_cat">' + cur_cat + '</div><div>' + films_count + '</div>';
        }
        , fillTemplate: function () {
            menu_cont.buildTemplate('vod');
            menu_cont.setContentClass("line", '<div class="vod_line">' + this.sub_menu + '</div>');
            menu_cont.setContentClass("content", '<div class="kinozal_container">' +
            '<div id="films">' +
            '<div class="arrow_movies"  onclick=VODManager.navigate("up")><div id="arrow_up" ></div></div>' +
            '<div id="films_container"><div id="film_items">' + this.content + '</div></div>' +
            '<div class="arrow_movies"  onclick=VODManager.navigate("down")><div id="arrow_down"></div></div>' +
            '</div>' +
            '<div id="film_descr"></div>');
            if (VODManager.films_count != 0) {
                document.getElementById('film_items').style.top = this.film_items_top + 'px';
                navigation.setActive(VODManager.list_item_name, VODManager.cur_film, 0);
                VODManager.showDescr();
            }
            document.getElementById('films_container').style.height = VODManager.row_height * VODManager.row + 'px';
            document.getElementById('film_descr').style.height = Main.vod_film_descr + 'px';
        }
        ///Исправить
        , showDescr: function () {
            if (!VODManager.films_count) return false;

            var film = VODManager.films[VODManager.cur_film];

            if (!film) return false;

            if (film.fid != 'back' && film.fid != 'next') {
                var imdb,kp,desc,genre,producer;
                if (!VODManager.films[VODManager.cur_film].files) {
                    imdb = film.imdb_rate;
                    kp = film.kp_rate;
                    desc = film.small_desc;
                    genre = '...';
                    producer = '...';
                } else {
                    imdb = film.rate_imdb;
                    kp = film.rate_imdb;
                    desc = film.full_desc;
                    genre = film.genres;
                    producer = film.producers;
                }

                descr = '<div class="description_short">' +
                '<div class="title font_120">' + film.title + '</div>' +
                    // '<div class="subtitle">' + TextConfig.kinozal.producer + '</div>' +
                    //'<div id="producer" class="film_info">' + producer + '</div>' +
                    //'<div class="subtitle">' + TextConfig.kinozal.genre + '</div>' +
                    // '<div id="genre" class="film_info">' + genre + '</div>' +
                '<div class="subtitle">' + TextConfig.kinozal.rate + '</div>' +
                '<div class="film_info">' + TextConfig.kinozal.imdb + ':' + imdb + ' ' + TextConfig.kinozal.kp + ': ' + kp + '</div>' +
                '<div class="subtitle">' + TextConfig.kinozal.descr + '</div>' +
                '<div class="film_info">' + desc + '</div>' +
                '</div>';

            } else {
                var descr = '<div class="description_short">' +
                    '<div class="title">' + film.title + '</div>' +
                    '</div>';
            }
            menu_cont.setContentId("film_descr", descr);
        }
        , getMoreDescr: function (callback) {

            VODManager.getMoreDescrCallback = callback;

            if (!VODManager.films[VODManager.cur_film].fid) {
                return false;
            }
            var url = "query=getFilmDesc&fid=" + VODManager.films[VODManager.cur_film].fid;
            DataManager.sendAjax(url, function (data) {
                var temp_small_cover = VODManager.films[VODManager.cur_film].small_cover;
                VODManager.films[VODManager.cur_film] = data.data;
                producers = '';
                genres = '';
                actors = '';
                data.data.producers.forEach(function (producer) {
                    producers += producer.title + ', ';
                });
                data.data.genres.forEach(function (genre) {
                    genres += genre.title + ', ';
                });
                data.data.actors.forEach(function (actor) {
                    actors += actor.title + ', ';
                });
                VODManager.films[VODManager.cur_film].producers = producers.replace(/,\s*$/, "");
                VODManager.films[VODManager.cur_film].genres = genres.replace(/,\s*$/, "");
                VODManager.films[VODManager.cur_film].actors = actors.replace(/,\s*$/, "");
                VODManager.films[VODManager.cur_film].small_cover = temp_small_cover;

                if (VODManager.getMoreDescrCallback) {
                    VODManager.getMoreDescrCallback();
                    VODManager.getMoreDescrCallback = null;
                }
            });

            return true;
        }
        , setFilmNum: function (num, type) {

            var etalon = VODManager.cur_film + num;

            if (etalon >= 0 && etalon < VODManager.films_count) {
                VODManager.cur_film += num;
                //если в процесе пролистывания влево/вправо указатель стал на фильм которого нету в зоне видимости
                //то прокручиваем экран вниз/вверх
                if (VODManager.cur_film > this.max_view_film) {
                    this.go('down');
                }
                if (VODManager.cur_film < this.min_view_film) {
                    this.go('up');
                }
            }
            if (PlatformManager.getDevice() == PlatformManager.Android && etalon >= VODManager.films_count) {
                this.onBottomMenu();
            }
        }
        , onBottomMenu: function () {
            state_obj.state = "vod_bottom_menu";
            navigation.setActive('vod_bottom_menu', VODManager.bottom_menu_id, 0);
        }
        , offBottomMenu: function () {
            state_obj.state = "vod";
            navigation.removeActiveClass(document.getElementById('vod_bottom_menu_' + VODManager.bottom_menu_id));
        }
        , navigateBottomMenu: function (to) {
            var old_id = VODManager.bottom_menu_id;
            if (to == 'right') {
                VODManager.bottom_menu_id = 1;
            } else if (to == 'left') {
                VODManager.bottom_menu_id = 0;
            } else if (to == 'ok') {
                VODManager.offBottomMenu();
                if (VODManager.bottom_menu_id == 0) {
                    VODManager.showSort();
                } else if (VODManager.bottom_menu_id == 1) {
                    VODManager.showPage();
                }
                return true;
            }
            navigation.setActive('vod_bottom_menu', VODManager.bottom_menu_id, old_id);
            return true;
        }
        , page: function (type) {
            if (type == 'next') {
                ++this.offset_counter;
            }
            else if (type == 'prev') {
                --this.offset_counter;
            }
            this.load();
        }
        , go: function (type) {
            var film_items = document.getElementById('film_items');
            if (type == 'down') {
                //сдвигаем по вертикали
                this.film_items_top -= this.row_height * 2;
                //меняем указатель на первый и последний видимый фильм на экране после прокрутки на строку вниз
                this.min_view_film += this.count_per_row * 2;
                this.max_view_film += this.count_per_row * 2;
            }
            else if (type == 'up') {
                this.film_items_top += this.row_height * 2;
                this.min_view_film -= this.count_per_row * 2;
                this.max_view_film -= this.count_per_row * 2;
            }
            film_items.style.top = this.film_items_top + 'px';
        }
        , navigate: function (type) {

            if (!VODManager.films_count) return false;

            var old_active = VODManager.cur_film;

            if (type == 'down') {
                VODManager.setFilmNum(VODManager.count_per_row, type);
            }
            else if (type == 'up') {
                VODManager.setFilmNum(-VODManager.count_per_row, type);
            }
            else if (type == 'page_down') {
                VODManager.setFilmNum(VODManager.count_per_row * 2, type);
            }
            else if (type == 'page_up') {
                VODManager.setFilmNum(-VODManager.count_per_row * 2, type);
            }
            else if (type == 'right') {
                VODManager.setFilmNum(1, type);
            }
            else if (type == 'left') {
                VODManager.setFilmNum(-1, type);
            }
            else if (type == 'ok') {
                VODManager.clickFilm(VODManager.cur_film);
                return;
            }
            navigation.setActive(VODManager.list_item_name, VODManager.cur_film, old_active);

            this.showDescr();
        }
        , clickFilm: function (id) {
            VODManager.cur_film = id;
            if (VODManager.films[VODManager.cur_film].fid == 'next') {
                VODManager.page("next");
            } else if (VODManager.films[VODManager.cur_film].fid == 'back') {
                VODManager.page("prev");
            } else {
                if (!VODManager.films[VODManager.cur_film].files) {
                    VODManager.getMoreDescr(VODManager_one.show);
                } else {
                    VODManager_one.show();
                }
            }
            // if (id != VODManager.cur_film) {
            //     old_active = VODManager.cur_film;
            //     VODManager.cur_film = id;
            //
            //     navigation.setActive(VODManager.list_item_name, VODManager.cur_film, old_active);
            //     //this.showDescr();
            // }
            // else {
            //     if (VODManager.films[VODManager.cur_film].fid == 'next') {
            //         VODManager.page("next");
            //     } else if (VODManager.films[VODManager.cur_film].fid == 'back') {
            //         VODManager.page("prev");
            //     } else {
            //         if(VODManager.films[VODManager.cur_film].files) {
            //             VODManager_one.show(VODManager.cur_film);
            //         }
            //     }
            // }
        }
        , hide: function () {
            this.film_items_top = 0;
            this.cur_film = 0;
            this.offset_counter = 0;
            this.fid = '';
            this.goBack();
        }
        , goBack: function () {
            if (this.old_view == 'pubdate' || this.old_view == 'fav') {
                MainMenu.show();
            }
            else if (this.old_view == 'genres') {
                vod_genres.load();
            }
            else if (this.old_view == 'kp' || this.old_view == 'imdb') {
                vod_top.show();
            }
            else if (this.old_view == 'search') {
                vod_search.init();
            }
        }
        , addToFav: function () {
            if (!VODManager.films_count) return false;

            var vod = cookie_obj.getData('rd_fav_vod') === null ? '' : cookie_obj.getData('rd_fav_vod');

            var delimiter = vod == '' ? '' : ',';
            if (state_obj.state != "vod_one") {
                var film_item = document.getElementById('film_' + VODManager.cur_film);
                if (film_item === null) return;
            }
            if (vod.indexOf(VODManager.films[VODManager.cur_film].fid) != -1) {
                if (state_obj.state != "vod_one") {
                    removeClass(film_item, 'favorite');
                } else {
                    text_fav = TextConfig.kinozal.addToFav;
                }
                var reg = new RegExp(delimiter + VODManager.films[VODManager.cur_film].fid, 'g');
                vod_delete = vod.replace(reg, '');
                //не оптимальное решение в случае если удаляеться последний избранный фильм
                if (vod_delete == vod) {
                    var reg = new RegExp(VODManager.films[VODManager.cur_film].fid, 'g');
                    vod_delete = vod.replace(reg, '');
                }
                vod = vod_delete;

            } else {
                if (state_obj.state != "vod_one") {
                    addClass(film_item, 'favorite');
                } else {
                    text_fav = TextConfig.kinozal.removeFromFav;
                }
                vod += delimiter + VODManager.films[VODManager.cur_film].fid;
            }

            if (state_obj.state == "vod_one") {
                menu_cont.setContentId("list_1", text_fav);
            }

            cookie_obj.setData('rd_fav_vod', vod);
        }
        , loadFav: function () {
            var fid = cookie_obj.getData('rd_fav_vod');
            if (fid !== null && fid != '') {
                VODManager.fid = fid;
                VODManager.init('fav');
            }
            //избранных фильмов нету
            else {
                VODManager.films_count = 0;
                VODManager.content = '<div class="title">' + TextConfig.kinozal.no_fav_films + '</div>';
                VODManager.old_view = 'fav';
                VODManager.createHeader();
                VODManager.fillTemplate();
                VODManager.cur_page = 1;
            }
        }
        , showSort: function () {
            var array = [{
                title: TextConfig.kinozal.pubdate
                , onclick: 'VODManager.selectSort("pubdate");'
                , ok: VODManager.selectSort
                , name: "pubdate"
                }
                , {
                    title: TextConfig.kinozal.imdb
                    , onclick: 'VODManager.selectSort("imdb");'
                    , ok: VODManager.selectSort
                    , name: "imdb"
                }
                , {
                    title: TextConfig.kinozal.kp
                    , onclick: 'VODManager.selectSort("kp");'
                    , ok: VODManager.selectSort
                    , name: "kp"
                }];
            center_block.show(array);
        }

        , selectSort: function (id) {
            center_block.hide();
            if (!id) {
                id = center_block.array_obj[center_block.cur_selected].name;
            }
            VODManager.sort = id;
            VODManager.load();
        }
        , showPage: function () {
            center_block.showPage(VODManager.cur_page, VODManager.total_pages);
        }
        , selectPage: function (page) {
            VODManager.offset_counter = page;
            VODManager.load();
        }
        , byPubDate: function () {
            VODManager.sort = "pubdate";
            VODManager.init("pubdate");
        }
        //Анимация
        //,move:function(elem,type) {
        //    var top = 0; // начальное значение
        //    function frame() { // функция для отрисовки
        //        top +=10;
        //        elem.style.top = top + 'px'
        //        if (top == 220) {
        //            clearInterval(timer); // завершить анимацию
        //            film_items.style.top = this.film_items_top+'px';
        //        }
        //    }
        //    var timer = setInterval(frame, 10) // рисовать каждые 10мс
        //}
    }
})();


/**
 *
 * Кинозал детальная ИНФОРМАЦИЯ
 *
 */
var VODManager_one = (function () {
    return {
        film: {}
        //идентификатор файла конкретного фильма/сериала
        , file_id: 0
        //идентификатор качества конкретного фильма/сериала
        , quality_id: 0
        //идентификатор конкретного фильма/сериала
        , lid_id: 0
        , cur_item: 0
        , cur_seria: 0
        , show: function () {
            VODManager_one.cur_item = 0;
            VODManager_one.film = VODManager.films[VODManager.cur_film];
            var help = menu_cont.getHelp('vod_one');
            var prod_date = '(' + VODManager_one.film.prod_date.split('-')[0] + ')';
            menu_cont.buildTemplate('vod_one');
            var fav_flag = 0;
            var favs = cookie_obj.getData('rd_fav_vod');
            if (favs !== null && favs.indexOf(VODManager_one.film.fid) != -1) {
                fav_flag = 1;
            }

            var fav_text = fav_flag ? TextConfig.kinozal.removeFromFav : TextConfig.kinozal.addToFav;
            menu_cont.setContentClass("content", '<div class="kinozal_container">' +
                '<div id="film">' +
                '<div id="film_big_img" class="left">' +
                '<div class="center"><img id="vod_big_img"src="' + VODManager_one.film.big_cover + '"/></div>' +
                '<div class="center">' + TextConfig.kinozal.imdb + ': <b>' + VODManager_one.film.rate_imdb + '</b> ' + TextConfig.kinozal.kp + ': <b>' + VODManager_one.film.rate_kp + '</b></div>' +
                '<div class="submit grey" id="list_0" onclick="VODManager_one.play();">' + TextConfig.kinozal.play + '</div>' +
                '<div class="submit grey" id="list_1" onclick="VODManager.addToFav();">' + fav_text + '</div>' +
                '</div>' +
                '<div id="film_descr">' +
                '<div class="title">' + VODManager_one.film.title + ' ' + prod_date + '</div>' +

                '<div class="dropdown_container"></div>' +
                '<hr>' +

               // '<div class="subtitle subtitle-left">' + TextConfig.kinozal.country + ':</div>' +
               // '<div class="film_info">' + VODManager_one.film.country + '</div>' +
               // '<div class="subtitle subtitle-left">' + TextConfig.kinozal.producer + ':</div>' +
               // '<div class="film_info">' + VODManager_one.film.producers + '</div>' +
               // '<div class="subtitle subtitle-left">' + TextConfig.kinozal.actors + ':</div>' +
               // '<div class="film_info">' + VODManager_one.film.actors + '</div>' +
               // '<div class="subtitle subtitle-left">' + TextConfig.kinozal.genre + ':</div>' +
               // '<div class="film_info">' + VODManager_one.film.genres + '</div>' +
               // '<div class="subtitle">' + TextConfig.kinozal.descr + ':</div>' +
               // '<div class="film_info">' + VODManager_one.film.full_desc + '</div>' +


                '<div class="film_info"><span class="subtitle">' + TextConfig.kinozal.country + ':</span> ' + VODManager_one.film.country + '</div>' +
                '<div class="film_info"><span class="subtitle">' + TextConfig.kinozal.producer + ':</span> ' + VODManager_one.film.producers + '</div>' +
                '<div class="film_info"><span class="subtitle">' + TextConfig.kinozal.actors + ':</span> ' + VODManager_one.film.actors + '</div>' +
                '<div class="film_info"><span class="subtitle">' + TextConfig.kinozal.genre + ':</span> ' + VODManager_one.film.genres + '</div>' +
                '<div class="film_info"><span class="subtitle">' + TextConfig.kinozal.descr + ':</span> <br>' + VODManager_one.film.full_desc + '</div>' +

                '</div>' +
                '</div>'
            );
            document.getElementById('vod_big_img').style.height = Main.vod_big_img_height + 'px';

            navigation.setActive('list', VODManager_one.cur_item, 0);
        }
        , backShow: function () {
                VODManager_one.show();
                menu_cont.show();
        }
        , play: function () {
            if (VODManager_one.film.files.length > 1) {
                dropdown_menu.init(VODManager_one.film.files, VODManager_one.getQuality, 0, TextConfig.kinozal.chose_seria);
            }
            else if (VODManager_one.film.files.length == 1) {
                VODManager_one.getQuality(0);
            }
            else {
                statusbar.show('Фильм не доступен');
            }
        }
        , getQuality: function (id) {
            VODManager_one.file_id = id;
            state_obj.state = 'vod_one';
            if (VODManager_one.film.files[VODManager_one.file_id].qualities.length > 1) {
                //добавляем название качества
                for (var i = 0; i < VODManager_one.film.files[VODManager_one.file_id].qualities.length; i++) {
                    VODManager_one.film.files[VODManager_one.file_id].qualities[i].title = TextConfig.quality[VODManager_one.film.files[VODManager_one.file_id].qualities[i].quality_number];
                }
                dropdown_menu.init(VODManager_one.film.files[VODManager_one.file_id].qualities, VODManager_one.playVideo, 0, TextConfig.kinozal.chose_quality);

            }
            else if (VODManager_one.film.files[VODManager_one.file_id].qualities.length == 1) {
                VODManager_one.playVideo(0);
            }
            else {
                statusbar.show('Фильм не доступен');
            }
        }
        , playVideo: function (id) {
            try {
                menu_cont.hide();
                VODManager_one.quality_id = id;
                VODManager_one.lid = VODManager_one.film.files[VODManager_one.file_id].qualities[VODManager_one.quality_id].lid;
                state_obj.state = "vod_player";
                source.playByLid(VODManager_one.lid, source.result);
                vod_player.init();
            } catch (e) {
                statusbar.show('VODManager_one.playVideo error = ' + e+' stack = '+ e.stack)
                DataManager.writeLog('VODManager_one.playVideo error = ' + e+' stack = '+ e.stack);
            }

        }
        , navigate: function (to) {
            var old_item = VODManager_one.cur_item;
            if (to == 'up') {
                this.cur_item = 0;
            } else if (to == 'down') {
                this.cur_item = 1;
            } else if (to == 'ok') {
                if (this.cur_item == 0) {
                    VODManager_one.play();
                    return true;
                } else {
                    VODManager.addToFav();
                    return true;
                }
            }

            navigation.setActive('list', VODManager_one.cur_item, old_item);
            return true;
        }
        ,isSerial: function () {
            return VODManager_one.film.files.length > 1;
        }
    }
})();

/*
 *
 * Кинозал ЖАНРЫ
 *
 */
var vod_genres = (function () {
    return {
        genres: {}
        //идентификаторы первого и последнего видимого обьекта
        , min_view: 0
        , max_view: 7
        , genres_count: 0
        , sub_menu: ''
        , content: ''
        , cur_selected: 0
        , top: 0
        , old_active: 0
        , list_item_name: 'genres'
        , init: function () {
            vod_genres.genresList = new List();
            vod_genres.genresList.SetCurrentPageGhangedCallback(vod_genres.updatePage);
            vod_genres.genresList.SetCurrentElementGhangedCallback(vod_genres.updateElement);
        }
        , updatePage: function () {
            //document.getElementById('genres_container').style.top = -1*Main.vod_genres_height * vod_genres.genresList.GetCurrentPageIndex() + 'px';
        }
        , updateElement: function () {
            navigation.setActive(vod_genres.list_item_name, vod_genres.genresList.GetCurrentElementIndex(), vod_genres.old_active);
        }
        , load: function () {
            if (vod_genres.genresList.elementCount > 0) {
                vod_genres.createContent();
            } else {
                var url = "query=getCinemaGenreInfo&num_genre=";
                DataManager.sendAjax(url, vod_genres.result);
            }
        }
        , result: function (data) {
            vod_genres.genresList.Init(data.genres, Main.vod_genres_list_per_page);
            vod_genres.sub_menu = TextConfig.kinozal.genre;
            vod_genres.createContent();
        }
        , createContent: function () {
            vod_genres.content = '<div id="genres_container">';

            vod_genres.genresList.elements.forEach(function (genre, i) {
                vod_genres.content += '<div id=' + vod_genres.list_item_name + '_' + i + ' onclick=vod_genres.click(' + i + ')  class="listitem font_110 genre_item" >' + genre.title + '</div>';
            })

            vod_genres.content += '</div>';

            this.fillTemplate();
        }
        , fillTemplate: function () {
            menu_cont.buildTemplate('vod_genres');
            menu_cont.setContentClass("line", '<div class="center vod_line">' + this.sub_menu + '</div>');
            menu_cont.setContentClass("content", '<div class="genres_list">' + vod_genres.content + '</div>');
            navigation.setActive(vod_genres.list_item_name, vod_genres.genresList.GetCurrentElementIndex(), 0);
        }

        , hide: function () {
            VODManager.num_genre = '';
            MainMenu.show();
        }
        , click: function (id) {
            vod_genres.genresList.SetCurrentElementByIndex(id);
            vod_genres.select();
        }
        , navigate: function (type) {
            vod_genres.old_active = vod_genres.genresList.GetCurrentElementIndex();
            if (type == 'up') {
                vod_genres.genresList.SetPrevPage();
            } else if (type == 'down') {
                vod_genres.genresList.SetNextPage();
            } else if (type == 'left') {
                vod_genres.genresList.MoveCurrentElementToUp();
            } else if (type == 'right') {
                vod_genres.genresList.MoveCurrentElementToDown();
            }

            else if (type == 'ok') {
                vod_genres.select();
            }
        }
        , select: function () {
            VODManager.init('genres');
        }
    }
})();
/**
 *
 * Кинозал ТОП
 *
 */
var vod_top = (function () {
    return {
        cur_selected: 0
        , list_item_name: 'top'
        , show: function () {
            vod_top.content = '<div id="top_container">';
            vod_top.content += '<div id="top_0" onclick=vod_top.select("imdb") class="grey listitem" onmouseover="navigation.addActiveClass(this);" onmouseout="navigation.removeActiveClass(this);" ><div class="list_item_text">' + TextConfig.kinozal.imdb + '</div></div>';
            vod_top.content += '<div id="top_1" onclick=vod_top.select("kp") class="grey listitem" onmouseover="navigation.addActiveClass(this);" onmouseout="navigation.removeActiveClass(this);" ><div class="list_item_text">' + TextConfig.kinozal.kp + '</div></div>';
            vod_top.content += '</div>';

            vod_top.fillTemplate();
        }
        , fillTemplate: function () {
            menu_cont.buildTemplate('vod_top');
            menu_cont.setContentClass("line", '<div class="center vod_line">' + TextConfig.kinozal.rate + '</div>');
            menu_cont.setContentClass("content", '<div class="kinozal_container">' + this.content + '</div>');
            navigation.setActive(this.list_item_name, this.cur_selected, 0);
        }

        , hide: function () {
            MainMenu.show();
        }
        , navigate: function (type) {
            var old_active = this.cur_selected;
            if (type == 'down') {
                this.setNum(1, type);
            }
            else if (type == 'up') {
                this.setNum(-1, type);
            }
            else if (type == 'ok') {
                if (vod_top.cur_selected == 0) {
                    vod_top.select("imdb");
                } else if (vod_top.cur_selected == 1) {
                    vod_top.select("kp");
                }

                //navigation.click(vod_top.list_item_name,vod_top.cur_selected); 
            }
            navigation.setActive(this.list_item_name, this.cur_selected, old_active);
        }
        , setNum: function (num, type) {
            var etalon = this.cur_selected + num;
            if (etalon >= 0 && etalon < 2) {
                this.cur_selected += num;
            }
        }
        , select: function (sort) {
            VODManager.sort = sort;
            VODManager.init(sort);
        }
    }
})();

/**
 *
 * Кинозал ПОИСК
 *
 */
var vod_search = (function () {
    return {
        content: ''
        , list_item_name: "search"
        , word_search: ''
        , search_flag: 0
        , cur_selected: 0
        , init: function () {
            vod_search.createContent();
        }
        , createContent: function () {
            this.content =
                '<div class="title">' + TextConfig.kinozal.input_search + '</div>' +
                '<div class="input_item radius_10 grey" id="search_0" onclick=vod_search.getKeyboardWordSearch();> <input size="15" id="kinozal_search" type="text" onmousedown="return false;"></div>' +
                '<div class="input_item radius_10 grey" id="search_1"  onclick=vod_search.search();><div>' + TextConfig.kinozal.search + '</div>' +
                '</div>';

            vod_search.fillTemplate();
        }
        , fillTemplate: function () {
            menu_cont.buildTemplate('vod_search');
            menu_cont.setContentClass("line", '<div class="center vod_line">' + TextConfig.kinozal.search + '</div>');
            menu_cont.setContentClass("content", '<div class="kinozal_container"><div class="kinozal_search">' + this.content + '</div></div>');
            navigation.setActive(this.list_item_name, this.cur_selected, 0);

            document.getElementById('kinozal_search').value = vod_search.word_search;
        }

        , hide: function () {
            MainMenu.show();
        }
        , navigate: function (type) {
            AuthManager.blur();
            var old_active = this.cur_selected;
            if (type == 'down') {
                this.setNum(1, type);
            }
            else if (type == 'up') {
                this.setNum(-1, type);
            }
            else if (type == 'ok') {
                if (vod_search.search_flag) {
                    vod_search.search();
                    vod_search.search_flag = !vod_search.search_flag;
                    return false;
                }
                if (this.cur_selected == 0) {
                    vod_search.getKeyboardWordSearch('ok');
                } else if (this.cur_selected == 1) {
                    vod_search.search();
                }
            }
            navigation.setActive(this.list_item_name, this.cur_selected, old_active);
            return false;
        }
        , getKeyboardWordSearch: function (ok) {
            vod_search.search_flag = !vod_search.search_flag;
            KeyboardManager.show(ok);
            KeyboardManager.onSearchCallBack = vod_search.insertWordSearch;
            KeyboardManager.onReturnCallBack = vod_search.createContent;
        }
        , insertWordSearch: function (val) {
            vod_search.word_search = val;
            vod_search.createContent();
        }
        , search: function () {
            VODManager.search_word = document.getElementById("kinozal_search").value;

            if (VODManager.search_word !== '' && VODManager.search_word.length >= 3) {

                VODManager.init('search');
            }
            else {
                statusbar.show(TextConfig.kinozal.small_search, 1);
            }
        }

        , setNum: function (num, type) {

            var etalon = this.cur_selected + num;

            if (etalon >= 0 && etalon < 2) {
                this.cur_selected += num;
            }
        }
    }
})();
