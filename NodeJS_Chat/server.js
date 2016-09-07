var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8180).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err, db) {
    if(err) throw err;
    
    client.on('connection', function(socket) {
    //console.log('Someone has Connected.');
        
         var col = db.collection('messages'),
             sendStatus = function(s) {
                 socket.emit('status', s);
             };
    
        // Emit all messages
        col.find().limit(100).sort({_id: 1}).toArray(function(err, res) {
            if(err) throw err;
            socket.emit('output', res);
        });
        
        
        //Wait for input
        
        socket.on('input', function(data) {
            //console.log(data);
            var name = data.name,
                message = data.message,
                whitespacePattern = /^\s*$/;
            
            if(whitespacePattern.test(name) || whitespacePattern.test(message)) {
                //console.log('invalid.');
                sendStatus('Name and message is required.');
            } else {
                col.insert({name: name, message: message}, function() {
                    
                    // Emit Latest message to All clients
                    client.emit('output', [data]);
                    
                    sendStatus({
                        message: "Message sent",
                        clear: true
                        
                    });
                //console.log('Inserted');
            });
            }
            
        });
    });
    
});