const multer = require('multer');

var storage=multer.diskStorage({
    destination: function(req,file,callback){

        var dir = './public/images/products/'+req.params.id;
        callback(null,dir);
    },
    filename:function(req,file,callback){
        const match = ["image/png","image/jpeg"];

        if(match.indexOf(file.mimetype)=== -1){
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }
        
        // var filename = `${Date.now()}-${req.params.id}-${file.originalname}`;
        var filename = `${Date.now()}-${req.params.id}.png`;
        callback(null,filename);
    }
});

var uploadFiles = multer({storage:storage}).array('files',10);

module.exports = uploadFiles;