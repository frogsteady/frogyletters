(function($) {

    $.fn.terminalEmulator = function(settings)
    {
        function TerminalEmulator(elem,s)
        {

            var SHIFT_DOWN_MASK = 1 << 0;
            var CTRL_DOWN_MASK = 1 << 1;
            var META_DOWN_MASK = 1 << 2;
            var ALT_DOWN_MASK = 1 << 3;
            var ALT_GRAPH_DOWN_MASK = 1 << 4;
            var REGULAR_KEY_MASK = 1 << 5;


            var settings,terminal=this,container=elem, display;
            var error_timeout, send_timeout, receive_timeout, resize_timeout;
            var keybuf=[];
            var receiveInProgress = false;
            var sendInProgress = false;
            var heartBeat = null;

            var rows= 0,cols=0;

            var eventToHandlerList = [[document,'keydown',keydown],
                                      [document,'keypress',keypress],
                                      [window,'resize',resize]];

            function init(s)
            {
                settings = s;
                display = $("<div/>").css("display", "inline-block").css("width","100%").css("height","100%");
                //set min width and height
                var charSize = getCharSize();
                var minWidth = settings.minSizeX*charSize.width;
                var minHeight = settings.minSizeY*charSize.height;
                display.css(" min-height",minHeight).css(" min-width",minWidth);
                container.addClass("terminal");
                container.append(display);

                settings.connect();//send connection request.
            }

            function start()
            {
                for(var i=0; i< eventToHandlerList.length; i++)
                {
                    addEventListener(eventToHandlerList[i][0],eventToHandlerList[i][1],eventToHandlerList[i][2]);
                }
                turnHeartbeat(true);
            }

            function stop()
            {
                for(var i=0; i< eventToHandlerList.length; i++)
                {
                    removeEventListener(eventToHandlerList[i][0],eventToHandlerList[i][1],eventToHandlerList[i][2]);
                }
                turnHeartbeat(false);
            }

            function addEventListener(elem, eventType, handler)
            {
                if (elem == null || typeof(elem) == 'undefined') return;
                if ( elem.addEventListener ) elem.addEventListener(eventType, handler, false);
                else if ( elem.attachEvent ) elem.attachEvent('on' + eventType, handler);
                else elem['on' + eventType] = handler;

            }

            function removeEventListener(elem, eventType, handler)
            {
                if (elem == null || typeof(elem) == 'undefined') return;
                if ( elem.removeEventListener ) elem.removeEventListener(eventType, handler, false);
                else if ( elem.detachEvent ) elem.detachEvent('on' + eventType, handler);
                else elem['on' + eventType] = null;
            }

            function turnHeartbeat(turn)
            {
                var state = false;
                if(heartBeat != null)
                {
                    state = true;
                }

                //continue/start heartbeat
                if(turn && !state)
                {
                    heartBeat = setInterval(function(){
                        if(!receiveInProgress) {
                            receiveInProgress = true;
                            settings.updateRequest();
                        }
                    },500);
                }
                //stop heartbeat
                else if (state && !turn)
                {
                    clearInterval(heartBeat);
                    heartBeat = null;
                }

                //return previous heartbeat state
                return state;
            }

            function getCharSize()
            {
                var temp = $('<div class="terminal"><span>&nbsp;</span></div>').appendTo('body');
                var span = temp.find('span');
                var result = {
                    width: span.width(),
                    height: span.outerHeight()
                };
                temp.remove();
                return result;
            }

            function getTextResolution(area)
            {
                var charSize = getCharSize();
                return {rows:Math.floor(area.height() / charSize.height),
                        cols:Math.floor(area.width() / charSize.width)};
            }

            function resize(ev)
            {
                clearTimeout(resize_timeout);
                resize_timeout = setTimeout(handleResizeEvent, 100);
            }

            function buildKey(code, shift, ctrl, meta, alt, regular)
            {
                return {keyCode:code, modifiers:0 |
                        (shift?SHIFT_DOWN_MASK:0) |
                        (ctrl?CTRL_DOWN_MASK:0) |
                        (meta?META_DOWN_MASK:0) |
                        (alt?ALT_DOWN_MASK:0) |
                        ((ctrl && alt)?ALT_GRAPH_DOWN_MASK:0) |
                        (regular?REGULAR_KEY_MASK:0)};
            }

            function keyEventStop(ev)
            {
                // Makes key event to do absolutely nothing else.
                ev.cancelBubble=true;
                if (ev.stopPropagation) ev.stopPropagation();
                if (ev.preventDefault)  ev.preventDefault();
                try { ev.keyCode=0; } catch(e){}
            }

            function keyEventSupress(ev)
            {
                // Makes this keydown event to become a keypress event, but nothing else.
                ev.cancelBubble=true;
                if (ev.stopPropagation) ev.stopPropagation();
            }

            // When a key is pressed the browser delivers several events: typically first a keydown
            // event, then a keypress event, then a keyup event.  Ideally we'd just use the keypress
            // event, but there's a problem with that: the browser may not send a keypress event for
            // unusual keys such as function keys, control keys, cursor keys and so on.  The exact
            // behaviour varies between browsers and probably versions of browsers.
            //
            // So to get these keys we need to get the keydown events.  They have a couple of
            // problems.  Firstly, you get these events for things like pressing the shift key.
            // Secondly, unlike keypress events you don't get auto-repeat.
            function keypress(ev)
            {
                if (!ev) var ev=window.event;

                // Only handle "safe" characters here.  Anything unusual is ignored; it would
                // have been handled earlier by the keydown function below.
                if ((ev.ctrlKey && !ev.altKey)  // Ctrl is pressed (but not altgr, which is reported
                    // as ctrl+alt in at least some browsers).
                        || (ev.which==0)        // there's no key in the event; maybe a shift key?
                    // (Mozilla sends which==0 && keyCode==0 when you press
                    // the 'windows logo' key.)
                        || (ev.keyCode==8)      // backspace
                        || (ev.keyCode==16)) {  // shift; Opera sends this.
                    keyEventStop(ev);
                    return false;
                }

                var kc;
                if (ev.keyCode) kc=ev.keyCode;
                if (ev.which)   kc=ev.which;

                queueChar(buildKey(kc,ev.shiftKey,ev.ctrlKey,ev.metaKey,ev.altKey,true));

                keyEventStop(ev);
                return false;
            }

            function keydown(ev)
            {
                if (!ev) var ev=window.event;

                var k;

                var kc=ev.keyCode;

                // Handle special keys.  Its important to do this here because IE doesn't
                // send keypress events for these (or at least some versions of IE don't for
                // at least many of them).  This is unfortunate as it means that the
                // cursor keys don't auto-repeat, even in browsers where that would be
                // possible.  That could be improved.

                // Interpret shift-pageup/down locally
                if      (ev.shiftKey && kc==33) { return true; }
                else if (ev.shiftKey && kc==34) { return true; }

                else if ([33,  // PgUp
                          34,  // PgDn
                          35,  // End
                          36,  // Home
                          37,  // Left
                          38,  // Up
                          39,  // Right
                          40,  // Down
                          45,  // Ins
                          46,  // Del
                          27,  // Escape
                          9,   // Tab
                          8,   // Backspace
                          112, // F1
                          113, // F2
                          114, // F3
                          115, // F4
                          116, // F5
                          117, // F6
                          118, // F7
                          119, // F8
                          120, // F9
                          121, // F10
                          122, // F11
                          123] // F12
                        .indexOf(kc)==-1)
                {
                    // For most keys we'll stop now and let the subsequent keypress event
                    // process the key.  This has the advantage that auto-repeat will work.
                    // But we'll carry on here for control keys.
                    // Note that when altgr is pressed, the event reports ctrl and alt being
                    // pressed because it doesn't have a separate field for altgr.  We'll
                    // handle altgr in the keypress handler.
                    if (!ev.ctrlKey                   // ctrl not pressed
                            || (ev.ctrlKey && ev.altKey)  // altgr pressed
                            || (ev.keyCode==17)) {        // I think that if you press shift-control,
                        // you'll get an event with !ctrlKey && keyCode==17.
                        keyEventSupress(ev);
                        return;  // Note that we don't "return false" here, as we want the
                        // keypress handler to be invoked.
                    }

                    // OK, so now we're handling a ctrl key combination.

                    // There are some assumptions below about whether these symbols are shifted
                    // or not; does this work with different keyboards?
                    if (ev.shiftKey)
                    {
                        if(!([50,  // Ctrl-@
                              54,  // Ctrl-^, doesn't work
                              94,  // Ctrl-^, doesn't work
                              109] // Ctrl-_
                                 .indexOf(kc)>-1))
                        {
                            keyEventSupress(ev);
                            return;
                        }
                    }
                    else
                    {
                        if (!((kc>=65 && kc<=90)  // Ctrl-A..Z
                                || [219,        // Ctrl-[
                                    220,        // Ctrl-\
                                    221,        // Ctrl-]
                                    190,        // Since ctrl-^ doesn't work, map ctrl-. to its code.
                                    32]         // Ctrl-space sends 0, like ctrl-@.
                                .indexOf(kc)>-1))
                        {
                            keyEventSupress(ev);
                            return;
                        }
                    }
                }

                queueChar(buildKey(kc,ev.shiftKey,ev.ctrlKey,ev.metaKey,ev.altKey,false));

                keyEventStop(ev);
                return false;
            }


            function handleResizeEvent()
            {
                var resolution = getTextResolution(display);
                var r = resolution.rows;
                var c = resolution.cols;

                if(r<settings.minSizeY) {r=settings.minSizeY}
                if(c<settings.minSizeX) {c=settings.minSizeX}

                if(r == rows && c == cols)
                {
                    return;
                }

                rows = r;
                cols = c;
                settings.resizeRequest(c,r);
            }

            function queueChar(s) {
                keybuf.unshift(s);
                clearTimeout(send_timeout);
                send_timeout=setTimeout(sendCommand,1);
            }

            function sendCommand()
            {
                if(!sendInProgress) {
                    sendInProgress=true;
                    var toSend={keys:[]};
                    while(keybuf.length>0) {
                        toSend.keys.push(keybuf.pop());
                    }
                    error_timeout=setTimeout(sendFailed,5000);
                    settings.sendRequest(JSON.stringify(toSend));
                }
                else
                {
                    clearTimeout(send_timeout);
                    send_timeout=setTimeout(sendCommand,100);
                }
            }

            function sendSucceeded()
            {
                sendInProgress = false;
                clearTimeout(error_timeout);
            }

            function sendFailed()
            {
                sendInProgress = false;
            }

            //public API
            $.extend(terminal,{
                connectionReady: function()
                {
                    handleResizeEvent();
                    start();
                },
                processResponse: function(response)
                {
                    if(response.message)
                    {
                        stop();
                        settings.errorMessage(response.message);
                    }
                    else
                    {
                        display.html(response.terminal);
                    }
                    receiveInProgress = false;
                },
                keySendCallback: function()
                {
                    sendSucceeded();
                }
            });


            //and actually let's start
            init(s);
        }

        settings = $.extend({}, $.fn.terminalEmulator.config, settings);
        return new TerminalEmulator(this,settings);
    };

    $.fn.terminalEmulator.config={
        connect: function(){},
        updateRequest: function(){},
        sendRequest: function(commandToSend){},
        errorMessage: function(message){},
        minSizeX:80,
        minSizeY:24
    };

})(wQuery);