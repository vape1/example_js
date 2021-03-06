<?php

require_once(dirname(__FILE__) . '/lib/base_class.php');

class IndexNode extends Base
{

    public function __construct($params)
    {
        $this->token = array_key_exists('token', $params) ? $params['token'] : '';
        if($params and isset($params['query']) and method_exists($this, $params['query'])) { 
            $result = $this->$params['query']($params);
            $this->getResult($result);
            //$this->getCompressedResult($result);
        } else {
            $this->getErrorException();
        }
    }

    protected function getResult($answer)
    {
        header("Access-Control-Allow-Origin: *");
        // alternatively "*" iso "my_sta_app_server" allows access from all origins
        header("Access-Control-Allow-Credentials: true");
        // allow exchange of e.g. cookies

        if(!is_object($answer)) {
            $this->getErrorException();
        } else {
            echo json_encode($answer);
        }
    }

    protected function getCompressedResult($answer) {

        $compressed = gzencode(json_encode($answer), 5);

        header('Content-Type: application/x-download');
        header('Content-Encoding: gzip'); #
        header('Content-Length: '.strlen($compressed)); #
        header('Content-Disposition: attachment; filename="myfile.name"');
        header('Cache-Control: no-cache, no-store, max-age=0, must-revalidate');
        header('Pragma: no-cache');

        echo $compressed;
    }



}

new IndexNode($_GET);

