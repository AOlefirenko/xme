var http = require('http'),
    async = require('async'),
    ObjectId = require("mongodb").ObjectID,
    _ = require('lodash'),
    errors = require('http-custom-errors');

module.exports = function(data,callback){
    var key = 'ruwlxp0922';
    var resultsCount = 5;
    var point = data.geo.lon+','+data.geo.lat;
    var gisUrl = 'http://catalog.api.2gis.ru/search?what={n}&point={p}&sort=distance&version=1.3&pagesize={c}&key={k}'
        .replace('{c}',resultsCount)
        .replace('{p}',point)
        .replace('{n}',data.nick)
        .replace('{k}',key);
    var processResult = function(data){
        var obj = JSON.parse(data);
        return  _.map(obj.result,function(item){
            return {name:item.name,address:item.asdresse, geo:{lon:item.lon,lat:item.lat}}
        })
    };
    http.get(gisUrl,function(d){
        var data = '';
        d.on('data', function (chunk){
            data += chunk;
        });
        d.on('end',function(){
            callback(null,processResult(data));
        })
    });
}