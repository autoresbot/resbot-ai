function _0x1967(_0xc2597e,_0x43ad01){const _0x25dea7=_0x25de();return _0x1967=function(_0x19676b,_0x59ae1f){_0x19676b=_0x19676b-0x1b4;let _0x1bb366=_0x25dea7[_0x19676b];return _0x1bb366;},_0x1967(_0xc2597e,_0x43ad01);}const _0x487b05=_0x1967;(function(_0x50e1a7,_0x619e39){const _0x1ece19=_0x1967,_0x23dcbd=_0x50e1a7();while(!![]){try{const _0x543b6c=parseInt(_0x1ece19(0x1b4))/0x1*(-parseInt(_0x1ece19(0x1ce))/0x2)+parseInt(_0x1ece19(0x1f3))/0x3+parseInt(_0x1ece19(0x1dc))/0x4*(parseInt(_0x1ece19(0x1ba))/0x5)+-parseInt(_0x1ece19(0x1c9))/0x6*(-parseInt(_0x1ece19(0x1e2))/0x7)+-parseInt(_0x1ece19(0x1f8))/0x8*(parseInt(_0x1ece19(0x1c6))/0x9)+parseInt(_0x1ece19(0x1e5))/0xa*(-parseInt(_0x1ece19(0x1e0))/0xb)+-parseInt(_0x1ece19(0x1bc))/0xc;if(_0x543b6c===_0x619e39)break;else _0x23dcbd['push'](_0x23dcbd['shift']());}catch(_0x474d92){_0x23dcbd['push'](_0x23dcbd['shift']());}}}(_0x25de,0xb0598));const config=require(_0x487b05(0x1c5)),path=require(_0x487b05(0x1ea)),fs=require('fs'),chalk=require(_0x487b05(0x1cc)),{writeLog}=require(_0x487b05(0x1de)),{default:makeWASocket,useMultiFileAuthState,DisconnectReason,fetchLatestBaileysVersion}=require(_0x487b05(0x1c1)),{processMessage}=require(_0x487b05(0x212)),{Boom}=require(_0x487b05(0x1fe)),qrcode=require(_0x487b05(0x1d0)),pino=require('pino'),lastMessageTime={},logger=pino({'level':'silent'}),{addUser,getUser}=require(_0x487b05(0x205)),{clearDirectory,logWithTime}=require(_0x487b05(0x1f1));clearDirectory(_0x487b05(0x1d6));function _0x25de(){const _0x36fa0b=['CODE\x20PAIRING:\x20','qrcode-terminal','Connection\x20Replaced,\x20Another\x20New\x20Session\x20Opened,\x20Please\x20Restart\x20Bot','greenBright','No\x20caption','key','yellow','./tmp','forEach','Bad\x20Session\x20File,\x20Start\x20Again\x20...','private','chmod','connectionLost','40jPpNKV','redBright','./lib/log','connectionClosed','17149VomqPD','bot_destination','59829SUhZbU','selectedId','participant','910DClwkV','registered','text','authState','@g.us','path','statusCode','connectionReplaced','sendMessage','stickerMessage','conversation','badSession','./lib/utils','PHONE\x20NUMBER:\x20','4151739pZSsNL','phone_number_bot','imageMessage','message','readdir','1896fUtDsk','20.0.04','Error\x20dalam\x20message\x20upsert:\x20','status@broadcast','Unknown\x20DisconnectReason:\x20','length','@hapi/boom','pushName','Pesan\x20tidak\x20valid','extendedTextMessage','endsWith','blue','type_connection','./lib/users','keys','Unknown','Bot\x20Connected','creds','templateButtonReplyMessage','type','./lib/cekUpdate','Error\x20changing\x20file\x20permissions:','restartRequired','close','toLowerCase','existsSync','./lib/ai','Connection\x20Lost\x20from\x20Server,\x20reconnecting...','INFO','629EEzQaZ','timedOut','messages.upsert','join','Connection\x20TimedOut,\x20Reconnecting...','messages','661105hgvHkr','log','11141748XZDWWJ','Ubuntu','fromMe','group','chmodSync','@whiskeysockets/baileys','yellowBright','substring','error','./config','52209anFqYv','output','requestPairingCode','546nnRpuD','append','open','chalk','messageTimestamp','1006nAdpML'];_0x25de=function(){return _0x36fa0b;};return _0x25de();}async function checkAndUpdate(){const _0xf36c96=_0x487b05;if(config['AutoUpdate']=='on'){const {cloneOrUpdateRepo:_0x9d68ec}=require(_0xf36c96(0x20c));await _0x9d68ec();}connectToWhatsApp();}async function connectToWhatsApp(){const _0xaf4536=_0x487b05,_0x16d07f=path[_0xaf4536(0x1b7)](__dirname,'session'),{state:_0x2d3018,saveCreds:_0x44bd0c}=await useMultiFileAuthState(_0x16d07f),{version:_0x4906a2}=await fetchLatestBaileysVersion(),_0x46d6b6=makeWASocket({'version':_0x4906a2,'logger':logger,'printQRInTerminal':![],'auth':_0x2d3018,'browser':[_0xaf4536(0x1bd),'Chrome',_0xaf4536(0x1f9)]});if(!_0x46d6b6[_0xaf4536(0x1e8)][_0xaf4536(0x209)][_0xaf4536(0x1e6)]&&config[_0xaf4536(0x204)]=='pairing'){const _0x26ca62=config[_0xaf4536(0x1f4)],_0x561a21=_0x447584=>new Promise(_0x16bf66=>setTimeout(_0x16bf66,_0x447584));await _0x561a21(0xfa0);const _0x51ed89=await _0x46d6b6[_0xaf4536(0x1c8)](_0x26ca62['trim']());console['log'](chalk[_0xaf4536(0x203)](_0xaf4536(0x1f2)),chalk['yellow'](_0x26ca62)),console[_0xaf4536(0x1bb)](chalk[_0xaf4536(0x203)](_0xaf4536(0x1cf)),chalk[_0xaf4536(0x1d5)](_0x51ed89));}return _0x46d6b6['ev']['on']('creds.update',_0x44bd0c),!fs[_0xaf4536(0x211)](_0x16d07f)&&fs['mkdirSync'](_0x16d07f,{'recursive':!![]}),fs[_0xaf4536(0x1c0)](_0x16d07f,0x1ed),fs[_0xaf4536(0x1f7)](_0x16d07f,(_0x55ee99,_0x12b37c)=>{const _0x48e486=_0xaf4536;if(_0x55ee99)return;_0x12b37c[_0x48e486(0x1d7)](_0x4e6ffe=>{const _0xe755c5=_0x48e486,_0x487b5c=path[_0xe755c5(0x1b7)](_0x16d07f,_0x4e6ffe);fs[_0xe755c5(0x1da)](_0x487b5c,0x1a4,_0x19af9=>{const _0x3bc340=_0xe755c5;_0x19af9&&console['error'](_0x3bc340(0x20d),_0x19af9);});});}),_0x46d6b6['ev']['on'](_0xaf4536(0x1b6),async _0x579229=>{const _0x4cb589=_0xaf4536;try{if(!_0x579229||!_0x579229[_0x4cb589(0x1b9)]||!_0x579229['messages'][0x0]){console[_0x4cb589(0x1bb)](chalk[_0x4cb589(0x1dd)](_0x4cb589(0x200)),chalk[_0x4cb589(0x1d5)](phoneNumber));return;}if(_0x579229[_0x4cb589(0x20b)]===_0x4cb589(0x1ca))return![];const _0x3e0d54=_0x579229['messages'][0x0][_0x4cb589(0x1cd)],_0x42bec7=_0x579229['messages'][0x0],_0x465e27=_0x42bec7[_0x4cb589(0x1d4)]||{},_0x10c64f=_0x465e27['remoteJid']||'',_0x36db6b=_0x465e27[_0x4cb589(0x1be)]||![],_0x30da18=_0x465e27['id']||![],_0x3ee8ee=_0x465e27[_0x4cb589(0x1e4)]||'',_0x2660d7=_0x42bec7[_0x4cb589(0x1ff)]||_0x4cb589(0x207),_0x5b5896=_0x10c64f[_0x4cb589(0x202)](_0x4cb589(0x1e9)),_0xdf3cd9=_0x5b5896?_0x3ee8ee:_0x10c64f;if(_0x10c64f==_0x4cb589(0x1fb))return![];const _0x1b59a6=config[_0x4cb589(0x1e1)][_0x4cb589(0x210)]();if(_0x5b5896&&_0x1b59a6===_0x4cb589(0x1d9)||!_0x5b5896&&_0x1b59a6===_0x4cb589(0x1bf))return;let _0x5a44c0='',_0x45c1aa='';if(_0x42bec7&&_0x42bec7[_0x4cb589(0x1f6)])_0x45c1aa=Object[_0x4cb589(0x206)](_0x42bec7[_0x4cb589(0x1f6)])[0x0],_0x5a44c0=_0x45c1aa===_0x4cb589(0x1ef)?_0x42bec7[_0x4cb589(0x1f6)]['conversation']:_0x45c1aa===_0x4cb589(0x201)?_0x42bec7[_0x4cb589(0x1f6)][_0x4cb589(0x201)][_0x4cb589(0x1e7)]:_0x45c1aa==='senderKeyDistributionMessage'?_0x42bec7[_0x4cb589(0x1f6)][_0x4cb589(0x1ef)]:_0x45c1aa===_0x4cb589(0x1f5)?_0x42bec7['message'][_0x4cb589(0x1f5)]['caption']||_0x4cb589(0x1d3):_0x45c1aa===_0x4cb589(0x1ee)?'stickerMessage':_0x45c1aa===_0x4cb589(0x20a)?_0x42bec7[_0x4cb589(0x1f6)][_0x4cb589(0x20a)][_0x4cb589(0x1e3)]:'';else return console[_0x4cb589(0x1bb)](chalk['redBright']('Message\x20atau\x20message.message\x20tidak\x20terdefinisi'));if(_0x5a44c0=='')return;let _0x4f2f0f=_0x5a44c0;_0x5a44c0[_0x4cb589(0x1fd)]>0xa&&(_0x4f2f0f=_0x5a44c0[_0x4cb589(0x1c3)](0x0,0xa)+'...');const _0x2d0a9c=Date['now']();if(lastMessageTime[_0xdf3cd9]&&_0x2d0a9c-lastMessageTime[_0xdf3cd9]<config['rate_limit']){console[_0x4cb589(0x1bb)](chalk[_0x4cb589(0x1dd)]('Rate\x20limit\x20:\x20'+_0x4f2f0f+'\x20-\x20'+_0xdf3cd9));return;}lastMessageTime[_0xdf3cd9]=_0x2d0a9c,logWithTime(_0x2660d7,_0x4f2f0f),writeLog(_0x4cb589(0x214),_0x10c64f+':\x20'+_0x5a44c0);const _0x555e0f=getUser(_0x10c64f);!_0x555e0f&&addUser(_0x10c64f,-0x1);try{const _0x39a568=await processMessage(_0x5a44c0,_0x46d6b6,_0x10c64f,_0x42bec7,_0x45c1aa,_0x2660d7);}catch(_0x5d7f09){console['error']('Terjadi\x20kesalahan\x20saat\x20memproses\x20pesan:',_0x5d7f09);}}catch(_0x2c720e){console['log'](chalk[_0x4cb589(0x1dd)](_0x4cb589(0x1fa)+_0x2c720e['message']));}}),_0x46d6b6['ev']['on']('connection.update',async _0x122150=>{const _0x322b8a=_0xaf4536,{connection:_0x3221cf,lastDisconnect:_0x11cc57,qr:_0x3ec9be}=_0x122150;_0x3ec9be!=null&&(console[_0x322b8a(0x1bb)](chalk[_0x322b8a(0x1c2)]('Menampilkan\x20QR')),qrcode['generate'](_0x3ec9be,{'small':!![]},_0x49246f=>{const _0x564a0a=_0x322b8a;console[_0x564a0a(0x1bb)](_0x49246f);}));if(_0x3221cf===_0x322b8a(0x20f)){let _0x4f1fcd=new Boom(_0x11cc57?.[_0x322b8a(0x1c4)])?.[_0x322b8a(0x1c7)][_0x322b8a(0x1eb)];switch(_0x4f1fcd){case DisconnectReason[_0x322b8a(0x1f0)]:console['log'](chalk['redBright'](_0x322b8a(0x1d8)));return await connectToWhatsApp();break;case DisconnectReason[_0x322b8a(0x1df)]:console[_0x322b8a(0x1bb)](chalk[_0x322b8a(0x1dd)]('Connection\x20closed,\x20reconnecting....'));return await connectToWhatsApp();break;case DisconnectReason[_0x322b8a(0x1db)]:console[_0x322b8a(0x1bb)](chalk[_0x322b8a(0x1dd)](_0x322b8a(0x213)));return await connectToWhatsApp();break;case DisconnectReason[_0x322b8a(0x1ec)]:console[_0x322b8a(0x1bb)](chalk[_0x322b8a(0x1dd)](_0x322b8a(0x1d1)));return await connectToWhatsApp();break;case DisconnectReason['loggedOut']:console[_0x322b8a(0x1bb)](chalk['redBright']('Perangkat\x20Terkeluar,\x20Silakan\x20Lalukan\x20Scan/Pairing\x20Ulang'));break;case DisconnectReason[_0x322b8a(0x20e)]:console['log'](chalk[_0x322b8a(0x1dd)]('Restart\x20Required,\x20Restarting..'));return await connectToWhatsApp();break;case DisconnectReason[_0x322b8a(0x1b5)]:console[_0x322b8a(0x1bb)](chalk[_0x322b8a(0x1dd)](_0x322b8a(0x1b8)));return await connectToWhatsApp();break;default:console[_0x322b8a(0x1bb)](chalk[_0x322b8a(0x1dd)](_0x322b8a(0x1fc)+_0x4f1fcd+'|'+_0x3221cf));return await connectToWhatsApp(dataConnection);break;}}else _0x3221cf===_0x322b8a(0x1cb)&&(await _0x46d6b6[_0x322b8a(0x1ed)]('6285246154386@s.whatsapp.net',{'text':_0x322b8a(0x208)}),console[_0x322b8a(0x1bb)](chalk[_0x322b8a(0x1d2)]('KONEKSI\x20TERHUBUNG')));}),_0x46d6b6;}checkAndUpdate();