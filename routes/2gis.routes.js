var gis =  require('../modules/2gisService');

module.exports  = function(app){
    app.route('/api/2gis').get(function(req,res,next){

        var geo = req.query.geo.split(',');

        var data = {
            name:req.query.name,
            geo:{lon:geo[1],lat:geo[0]}
        };

        gis(data,function(err,data){
            if(err)next(err);
            res.send(data);
        })
    })
}
