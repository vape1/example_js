<?php

class Config
{ 
    protected $middleware_api_url = '';

    protected $eternal_token = '';  

    protected $array_cached_timezones = array('+01:00', '+02:00', '+03:00', '-04:00');

    protected $redis_ip_port = '';

    protected $time_live_cache = 14400; //4 hours

    protected $environment = 'prod'; //dev test prod

    protected function getMiddlewareApiUrl(){
        if($this->getEnvironmentValue() == 'dev') {
            $this->middleware_api_url = '';
        } elseif($this->getEnvironmentValue() == 'test') {
            $this->middleware_api_url = '';
        } elseif($this->getEnvironmentValue() == 'prod') {
            $this->middleware_api_url = '';
        }
        return $this->middleware_api_url;
    }

    protected function getEternalToken(){
        return $this->eternal_token;
    }

    protected function getArrayCachedTimezones(){
        return $this->array_cached_timezones;
    }

    protected function getEnvironmentValue(){
        if($hostname = gethostname()) {
            $environment = substr($hostname,0,3);

            if($environment == 'tes') $this->environment = 'test';
            elseif($environment == 'pro') $this->environment = 'prod';
            elseif($environment == 'dev') $this->environment = 'dev';
        }
        return $this->environment;
    }

    protected function getTimeLiveCache(){
        return $this->time_live_cache;
    }

    protected function getRedisIpPort() {
        if($this->getEnvironmentValue() == 'dev') {
                    $this->redis_ip_port = '';
                } elseif($this->getEnvironmentValue() == 'test') {
                    $this->redis_ip_port = '';
                } elseif($this->getEnvironmentValue() == 'prod') {
                    $this->redis_ip_port = '';
                }
        return $this->redis_ip_port;
    }
}
