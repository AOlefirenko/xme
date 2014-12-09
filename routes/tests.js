var gis =  require('../modules/2gisService');

module.exports  = function(app){
    app.route('/test/2gis').get(function(req,res,next){
        var data = {
            nick:'лукойл',
            geo:{lon:39.00383,lat:45.034042}
        }
        gis(data,function(err,data){
            if(err)next(err);
            res.send(data);
        })
    })
}
