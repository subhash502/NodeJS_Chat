(function() {
                var getNode = function(s) {
                    return document.querySelector(s);
                },
                    //Get required nodes
                    status = getNode('.chat-status span'),
                    messages = getNode('.chat-messages'),
                    textarea = getNode('.chat textarea'),
                    chatName = getNode('.chat-name'),
                
                statusDefault = status.textContent,
                
                setStatus = function(s) {
                    status.textContent = s;
                    
                    if(s!== statusDefault) {
                        var delay = setTimeout(function() {
                            setStatus(statusDefault);
                            clearInterval(delay);
                        },3000);
                    }
                };
            
    
                try {
                    var socket = io.connect('http://127.0.0.1:8180');
                }catch(e) {
                    //Set status to warn user
                    
                }
                
                
                if(socket !== undefined) {
                    
                    //Listen for output
                    
                    socket.on('output', function(data) {
                        //console.log(data);
                        if(data.length){
                            //Loop through results
                            for(var x=0; x < data.length; x = x + 1) {
                                var message = document.createElement('div');
                                message.setAttribute('class', 'chat-message');
                                
                                //message.textContent = 'Alex: Message';
                                message.textContent = data[x].name + ' : ' + data[x].message;
                                
                                //Append
                                messages.appendChild(message);
                                messages.insertBefore(message, messages.lastChild);
                            }
                        }
                    });
                    
                    // Listen for a status
                    socket.on('status', function(data) {
                       setStatus((typeof data === 'object') ? data.message : data); 
                        
                        if(data.clear === true) {
                            textarea.value = '';
                        }
                    });
                    //console.log('Ok!');
                   
     //listen for keydown
                    textarea.addEventListener('keydown', function(event) {
                        var self = this,
                            name = chatName.value;
                        
                        //console.log(event.which);
                        //console.log(event);
                        
                        if(event.which === 13 && event.shiftKey === false) {
                            socket.emit('input', {
                                name: name,
                                message: self.value
                            });
                            
                            event.preventDefault();
                        }
                    });
                   
                }
                
            })();