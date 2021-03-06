<?php
require_once(dirname(__FILE__) . '/../config/config.php');

class Base extends Config
{
    protected $token;

    /**
     *  requestToAPI
     *  
     */
    protected function requestToAPI($query)
    {
        $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
        $url = $this->getMiddlewareApiUrl() . "/data.json?token=" . $this->token . "&cip=" . $ip . "&" . $query;
        //echo $url.'<br>';
        $data = file_get_contents($url);

        return $data;
    }

    /**
     *  Get Token
     */
    public function getToken($params)
    {
        try {
            $json = json_decode(file_get_contents($this->getMiddlewareApiUrl() . "/auth.json"));
        } catch (Exception $ex) {
            $this->getErrorException();
        }

        if ($json and $json->status == "success") {

            $md5_pass = md5($json->data->rand . $params['pass']);

            $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';

            $url =
                $this->getMiddlewareApiUrl() . "/auth.json?device=" . $params['device'] . "&version=" . $params['version'] .
                "&sid=" . $json->data->sid . "&login=" . $params['login'] . "&passwd=" . $md5_pass . "&cip=" . $ip;
            //echo $url;
            //переполучение токена добавляем к запросу старый токен
            if ($params['new'] == 0) {
                if($params['mac']) {
                    $serial = $params['mac'];
                }else {
                    $serial = $this->token;
                }
                $url .= "&serial=" . $serial;
            } else {
                if ($params['mac']) {
                    $url .= "&serial=" . $params['mac'];
                }
            }

            $json = json_decode(file_get_contents($url));

            if ($json->status == "success") {
                $json->ttl = $json->data->ttl;
                $json->token = $json->data->token;
                unset($json->data);
            }
        }
        return $json;
    }

    /**
     *  Check Token
     */
    public function checkToken()
    {

        $query = json_decode($this->requestToAPI("query=token_status"));
        if (!$query) {
            $this->getErrorException();
            return false;
        }

        if ($query->status == "success") {

            $query->data->unix_time = $query->timeserver;
            //$query->data->tzone = "+3200 or --3200" remove one -
            $tzone = preg_replace('/-/', '', $query->data->tzone, 1);
            //get unix_time with timezone
            $query->data->unix_time_timezone = $query->timeserver + $tzone;
            //время округленное до получаса
            $query->data->unix_time_hour = floor($query->data->unix_time_timezone / 1800) * 1800;

        }
        return $query;
    }

    public function getChannelsList($params)
    {
        $channels = $this->getChannels($params);

        $programs = $this->getPrograms($params);

        if ($channels->status == "success") {
            foreach ($channels->data->categories as $cat_key => $category) {
                foreach ($category->channels as $ch_key => $channel) {

                    foreach ($programs->data as $program) {
                        if ($program->number == $channel->number) {
                            $channel->programs = $program->programmes;
                            break;
                        }
                    }
                }
            }

        }

        return $channels;
    }

    protected function getChannels($params)
    {
        $channels = json_decode($this->requestToAPI("query=get_channels&value=100_100_1,45_45_1,200_100_1&key=icon"));

        if (!$channels) {
            $this->getErrorException();
            return false;
        }

        if ($channels->status == "success") {

            foreach ($channels->data->categories as $c_k => $category) {
                $channels->data->categories[$c_k]->favorite = 0;
                $has_record = 0;
                foreach ($category->channels as $key => $channel) {
                    foreach ($channels->data->channels as $key_obj => $channel_obj) {
                        $channel_obj->programs = [];
                        $channel_obj->program = [];
                        if ($channel_obj->number == $channel) {
                            $channels->data->channels[$key_obj]->cat_key = $c_k;
                            $category->channels[$key] = $channel_obj;
                            if ($channel_obj->has_record == 1) {
                                $has_record = 1;
                            }
                            break;
                        }
                    }
                }
                //флаг имеет ли категория каналы для которых пишеться архив
                $channels->data->categories[$c_k]->has_record = $has_record;
            }
            //Получаем пользовательские списки каналов
            $favorites = json_decode($this->requestToAPI("query=get_favorites"));


            $channels->data->favorites = [];

            $favorites_arr = array(
                (object)array('number' => 1, 'channels' => array())
            , (object)array('number' => 2, 'channels' => array())
            , (object)array('number' => 3, 'channels' => array())
            );

            $favorites_cat = array(
                (object)array('number' => 1, 'channels' => array(), 'title' => $this->getFavCategoryName(1, 'rus'), 'has_record' => 0)
            , (object)array('number' => 2, 'channels' => array(), 'title' => $this->getFavCategoryName(2, 'rus'), 'has_record' => 0)
            , (object)array('number' => 3, 'channels' => array(), 'title' => $this->getFavCategoryName(3, 'rus'), 'has_record' => 0)
            );

            if ($favorites->status == "success") {
                $favorites->data = $this->checkForArray($favorites->data);
                foreach ($favorites->data as $fav) {
                    foreach ($favorites_arr as $kdf => $default_fav) {
                        if ($default_fav->number == $fav->number) {
                            $favorites_arr[$kdf] = $fav;
                        }
                    }
                }

                foreach ($favorites->data as $favorite) {
                    foreach ($favorites_cat as $fav_cat) {
                        if ($favorite->number == $fav_cat->number) {
                            $has_record = 0;
                            foreach ($favorite->channels as $channel) {
                                foreach ($channels->data->channels as $key_obj => $channel_obj) {
                                    if ($channel_obj->number == $channel) {
                                        $fav_cat->channels[] = $channel_obj;
                                        if ($channel_obj->has_record == 1) {
                                            $has_record = 1;
                                        }
                                        break;
                                    }
                                }
                            }
                            //флаг имеет ли категория каналы для которых пишеться архив
                            $fav_cat->has_record = $has_record;
                        }
                    }
                }
            }

            $channels->data->favorites = $favorites_cat;
            $channels->data->favorites_arr = $favorites_arr;
        }
        unset($channels->data->channels);
        return $channels;
    }

    /**
     * @param $params = ['start'](full,0,1,2) ['day'](0,-1,-2) ['number'] ('',12,123,..)
     *
     * if ChannelsManager.getEpg $params['start'] = (0,1,2)   $params['day'] = '' $params['number'] = ''
     *
     * if ChannelsManager.GetProgramsByDay $params['start'] = (full)   $params['day'] = (0,-1,-2) $params['number'] = (12,123,65)
     * @return json object
     *
     *
     */

    public function getPrograms($params)
    {
        $array_time_period = $this->getTimeStartAndPeriod($params['day'], $params['start']);

        $key = 'program_period_' . $params['start'] . '_day_' . $params['day'] . '_number_' . $params['number'] . '_timezone_' . $params['timezone'] . '_timeshift_' . $params['timeshift'];

        if ($program = $this->getRedisData($key)) $program = json_decode($program);

        else {
            $program = $this->getMWPrograms($array_time_period['time_start'], $array_time_period['period'], $params['number']);


            if (!$program) {
                $this->getWarningException();
                return false;
            }

            //Remove duplicate program
            if($params['start'] == 1 or $params['start'] == 2) { //only if second or third query
                foreach($program->data as $programs_ch) {
                    if (isset($programs_ch->programmes) and is_array($programs_ch->programmes) and count($programs_ch->programmes)) {
                        if ($programs_ch->programmes[0]->ut_start < $array_time_period['time_start']) {
                            unset($programs_ch->programmes[0]);
                            $programs_ch->programmes = array_values($programs_ch->programmes);
                        }
                    }
                }
            }

            if ($program->status == "success") {
                $this->setRedisData($key, json_encode($program));
            }
        }

        return $program;
    }

    public function getProgramsOldDevice($params)
    {
        $query = json_decode($this->requestToAPI('query=get_epg&key=start|period&value=' . $params['start'] . '|' . $this->getTimeLiveCache()));
        if (!$query) {
            $this->getErrorException();
            return false;
        }

        if ($query->status == "error" and $query->data->code == 4004) {
            $query->status = "warning";
        }

        return $query;
    }

    /**
     * @return string (json encoded object)
     *
     */
    public function getRedisData($key)
    {
        $program = null;

        if (class_exists('Redis')) {
            try {
                $redis = new Redis();
                $redis->connect($this->getRedisIpPort());
                $program = $redis->get($key);
            } catch (RedisException $e) {
            }
        }

        return $program;
    }

    public function setRedisData($key, $val)
    {
        if (class_exists('Redis')) {
            try {
                $redis = new Redis();
                $redis->connect($this->getRedisIpPort());
                $redis->set($key, $val);
                $redis->expire($key, $this->getTimeLiveCache());

            } catch (RedisException $e) {
                return false;
            }
            return true;
        }
        return false;
    }

    protected function getMWPrograms($time_start, $period, $number)
    {
        $ch_number = $number ? '|number' : '';
        $ch_number_vals = $number ? "|" . $number : '';

        $query = json_decode($this->requestToAPI('query=get_epg&key=start|period' . $ch_number .'|params&value=' . $time_start . '|' . $period . $ch_number_vals.'|title,ut_stop,ut_start,t_stop,t_start,has_record,has_desc,desc'));

        if (!$query) {
            $this->getErrorException();
            return false;
        }

        if ($query->status == "error" and $query->data->code == 4004) {
            $query->status = "warning";
        }

        return $query;
    }

    /**
     *   Get Url
     *   получение ссылки на поток
     */
    public function getUrl($params)
    {
        $query = json_decode($this->requestToAPI("query=get_url&key=" . $params['key'] . "&value=" . $params['value']));

        if (!$query) {
            return $this->getWarningException();
        }

        if ($query->status == "error" and $query->data->code == 4004) {
            $query->status = "warning";
        }
        return $query;
    }


    /**
     *  ClientInfo
     */
    public function getClientInfo($params)
    {
        $query = json_decode($this->requestToAPI("query=get_client_info"));

        if (!$query) {
            return $this->getWarningException();
        }

        if ($query->status == "success") {
            $query->data->dateTo = explode(" ", $query->data->tariffs[0]->validity)[0];
        }

        return $query;
    }


    /**
     * Get all settings
     */
    public function getSettings()
    {
        $query = json_decode($this->requestToAPI("query=get_settings"));

        if (!$query) {
            $this->getErrorException();
            return false;
        }

        if ($query->status == "success") {
            $query->data->timezone_active_city = 0;
            $query->data->timezone_active_region = 0;
            $query->data->bitrate_active = 0;
            $query->data->datacenter_active = 0;
            $query->data->timeshift_active = 0;

            foreach ($query->data->timezones as $k => $tzone) {
                foreach ($tzone->cities as $k_c => $val) {

                    if ($val->active) {
                        $query->data->timezone_active_city = $k_c;
                        $query->data->timezone_active_region = $k;
                        break 2;
                    }
                }
            }

            foreach ($query->data->bitrates as $k_b => $bitrate) {
                if ($bitrate->active) {
                    $query->data->bitrate_active = $k_b;
                    break;
                }
            }

            foreach ($query->data->datacenters as $k_d => $datacenter) {
                if ($datacenter->active) {
                    $query->data->datacenter_active = $k_d;
                    break;
                }
            }

            foreach ($query->data->timeshifts as $k_t => $timeshift) {
                if ($timeshift->active) {
                    $query->data->timeshift_active = $k_t;
                    break;
                }
            }
        }
        return $query;
    }

    /**
     *  set Settings
     */
    public function setSettings($params)
    {
        $query = json_decode($this->requestToAPI('query=set_settings&key=' . $params['key'] . '&value=' . $params['value']));

        if ($query->status == 'error') {
            $query->status = 'success';
            $query->warning = 4007;
        }

        return $query;
    }


    /**
     *  Favorites chnnells
     */
    public function setFavoriteChannel($params)
    {

        $query = json_decode($this->requestToAPI('query=set_favorites&key=number|num_channel' . $params['place'] . '&value=' . $params['number'] . '|' . $params['num_channel'] . $params['place_val']));
        $query->warning = 0;

        if ($query->status == 'error' and $query->data->code == 4007) {
            $query->status = 'success';
            $query->warning = 4007;
        }

        return $query;
    }

    /**
     *  получение фильмов
     *  "num_genre" - идентификатор жанра;
     *    "count" - по сколько фильмов выводить, если не указывать этот параметр выводиться будет по 30;
     *  "offset" - с какого елемента начинать выводить, по умолчанию 0;
     *  "sort" - тип сортировки, если данный параметр не указан будет сортироваться по дате заполнения(последний добавленный фильм в начале списка)
     *             imdb – по рейтингу imdb, pubdate — по дате добавления, kp — по рейтингу КиноПоиска, prod_date — по дате выхода фильма в прокат.
     */
    public function getFilms($params)
    {
        $fid = $params['fid'] ? '|fid' : '';
        $fid_vals = $params['fid'] ? "|" . $params['fid'] : '';
        $num_genre = $params['num_genre'] ? 'num_genre|' : '';
        $num_genre_vals = $params['num_genre'] ? $params['num_genre'] . "|" : '';

        $query_url = "query=get_cinema_films&key=" . $num_genre . "count|offset|sort" . $fid . "&value=" . $num_genre_vals . $params['count'] . "|" . $params['offset'] . "|" . $params['sort'] . $fid_vals;

        $key = 'films_count_' . $params['count'] . '_offset_' . $params['offset'] . '_sort_' . $params['sort'];

        if ((!$fid and !$num_genre) and ($films = $this->getRedisData($key))) $query = json_decode($films);

        else {
            $query = json_decode($this->requestToAPI($query_url));

            if (!$query) {
                return $this->getWarningException();
            }

            if ($query->status == "success") {

                $query->data = $this->checkForArray($query->data);

                $films_data = $params['fid'] == '' ? $this->getCinemaGenreInfo($params) : false;

                if ($films_data) {
                    $query->total_films = $films_data->total_count;
                    $query->total_pages = ceil($films_data->total_count / $params['count']);
                } else {
                    $query->total_films = count($query->data);
                    $query->total_pages = ceil($query->total_films / $params['count']);
                }

                if (!$fid and !$num_genre) $this->setRedisData($key, json_encode($query));
            }
        }

        return $query;
    }

    protected function getFilmDesc($params)
    {
        $query = json_decode($this->requestToAPI("query=get_cinema_desc&key=fid&value=" . $params['fid']));

        if (!$query) {
            return $this->getWarningException();
        }

        if ($query->status == "success") {
            return $query;
        } else return false;
    }

    /**
     * Кинозал информация о жанрах
     *
     */
    public function getCinemaGenreInfo($params)
    {
        $query = json_decode($this->requestToAPI("query=get_cinema_genre_info&key=number&value=" . $params['num_genre']));
        if (!$query) {
            return false;
        }
        if ($query->status == "success") {
            usort($query->data->genres, "sort_title");
            return $query->data;
        }
        return false;
    }

    /**
     *
     * Кинозал поиск
     *
     */
    public function getFilmsSearch($params)
    {
        $word = urlencode($params['word']);
        $query = json_decode(
            $this->requestToAPI(
                "query=get_cinema_search&key=word|count|offset&value=" . $word . "|" . $params['count'] . "|" . $params['offset']
            )
        );
        if (!$query) {
            return $this->getWarningException();
        }
        if ($query->status == "success") {

            $query->data = $this->checkForArray($query->data);

            $query->total_films = count($query->data);
            $query->total_pages = ceil($query->total_films / $params['count']);
        }

        return $query;
    }

    /**
     *
     * Родительский контроль усстановка
     */
    public function setControlPasswd($params)
    {
        $query = json_decode(
            $this->requestToAPI(
                "query=check_control_passwd&key=passwd&value=" . $params['old_pass']
            )
        );
        if (!$query) {
            return $this->getWarningException();
        }
        if ($query->status == "success") {
            $query = json_decode(
                $this->requestToAPI(
                    "query=set_control_passwd&key=old|new&value=" . $params['old_pass'] . "|" . $params['new_pass']
                )
            );
        } else if ($query->status == "error" and $query->data->code == 4008) {
            $query->status = "warning";
        }

        return $query;
    }

    public function checkControlPasswd($params)
    {
        $query = json_decode(
            $this->requestToAPI(
                "query=check_control_passwd&key=passwd&value=" . $params['pass']
            )
        );
        if (!$query) {
            return $this->getWarningException();
        }
        if ($query->status == "error" and $query->data->code == 4008) {
            $query->status = "warning";
        }
        return $query;
    }

    public function getEnvironment()
    {
        return (object)array('status' => 'success', 'data' => array('environment' => $this->getEnvironmentValue(), 'api_url' => $this->getMiddlewareApiUrl()));
    }

    public function writeLog($params)
    {
        $platform = urldecode($params['platform']);
        $mes = urldecode($params['text']);
        $out_ip = $_SERVER['REMOTE_ADDR'];
        $login = urldecode($params['login']);
        $now = date("Y.m.d H:i:s");
        $str = $now . " ; IP : " . $out_ip . "; LOGIN : " . $login . "; DEVICE : " . $platform . "; LOG : " . $mes . "\r\n";
        $filename = 'access_' . $out_ip;
        $bytes = file_put_contents('log/' . $filename . '.log', $str, FILE_APPEND);
        $response = (object)array('status' => 'success', 'data' => $bytes);
        return $response;
    }

    protected function getTimeStartAndPeriod($day, $start)
    {
        $day = date('d') + $day;
        $unix_date = mktime(0, 0, 0, date('m'), $day);

        if ($start == 'full') {
            $hours = 30;
            $time_start = $unix_date;
        } else {
            $hours = 10;
            $time_start_sec = $hours * 3600 * $start;

            $time_start = $unix_date + $time_start_sec;
        }

        $period = $hours * 3600;

        return array('time_start' => $time_start, 'period' => $period);
    }


    /**
     * Получение времени
     * $time_str = 2014-05-05 15:00 CEST +0200
     * $pos = 1 15:00
     * $pos = 0 2014-05-05
     */
    protected function getTime($time_str, $pos)
    {
        $words = explode(" ", $time_str);
        $time = $words[$pos];

        return $time;
    }

    protected function checkForArray($item)
    {
        if (!is_array($item))
            $item_arr[] = $item;
        else
            $item_arr = $item;

        return $item_arr;
    }

    /**
     * Название пользовательских списков
     *
     */
    protected function getFavCategoryName($number, $lang)
    {
        $category = '';

        if ($lang == 'eng') {
            switch ($number) {
                case 1:
                    $category = 'fav_1';
                    break;
                case 2:
                    $category = 'fav_2';
                    break;
                case 3:
                    $category = 'fav_3';
                    break;
            }
        } else {
            switch ($number) {
                case 3:
                    $category = 'Желтый';
                    break;
                case 1:
                    $category = 'Красный';
                    break;
                case 2:
                    $category = 'Зеленый';
                    break;
            }
        }
        return $category;
    }

    protected function getErrorException()
    {
        echo json_encode((object)array('status' => 'error', 'data' => array('message' => 'No data', 'code' => '4004')));
    }

    protected function getWarningException()
    {
        echo json_encode((object)array('status' => 'warning', 'data' => array('message' => 'No data', 'code' => '4004')));
    }
}

function sort_title($a, $b)
{
    return strnatcmp($a->title, $b->title);
}

?>
