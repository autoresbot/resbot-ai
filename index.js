const _0x541c74=_0xcefb;(function(_0x47ca4b,_0x295dca){const _0x30123f=_0xcefb,_0x550139=_0x47ca4b();while(!![]){try{const _0x587003=-parseInt(_0x30123f(0x169))/0x1+-parseInt(_0x30123f(0x19a))/0x2+parseInt(_0x30123f(0x14c))/0x3*(-parseInt(_0x30123f(0x15e))/0x4)+-parseInt(_0x30123f(0x180))/0x5*(-parseInt(_0x30123f(0x1ac))/0x6)+-parseInt(_0x30123f(0x196))/0x7+parseInt(_0x30123f(0x19e))/0x8+parseInt(_0x30123f(0x1a7))/0x9;if(_0x587003===_0x295dca)break;else _0x550139['push'](_0x550139['shift']());}catch(_0x1fcc0f){_0x550139['push'](_0x550139['shift']());}}}(_0x39b3,0x950fa));function _0x39b3(){const _0x4181ec=['authState','connection.update','chalk','message','Connection\x20Replaced,\x20Another\x20New\x20Session\x20Opened,\x20Please\x20Restart\x20Bot','registered','fromMe','...','Unknown','20.0.04','toLowerCase','Connection\x20TimedOut,\x20Reconnecting...','4688803UDPYUR','participant','./lib/utils','messages.upsert','1910344sdoOIV','Bad\x20Session\x20File,\x20Start\x20Again\x20...','Terjadi\x20kesalahan\x20saat\x20memproses\x20pesan:','creds.update','362008fmjYoT','\x20-\x20','./lib/users','Error\x20dalam\x20message\x20upsert:\x20','key','restartRequired','redBright','6285246154386@s.whatsapp.net','Pesan\x20tidak\x20valid','20336841mZHJtz','Ubuntu','./lib/ai','Restart\x20Required,\x20Restarting..','type_connection','18NKlxYx','sendMessage','log','mkdirSync','@whiskeysockets/baileys','81546jJQakG','silent','conversation','pairing','rate_limit','generate','error','type','stickerMessage','connectionClosed','trim','yellowBright','connectionReplaced','readdir','forEach','No\x20caption','Unknown\x20DisconnectReason:\x20','bot_destination','16bndyFP','output','caption','messages','connectionLost','join','remoteJid','./lib/cekUpdate','yellow','badSession','qrcode-terminal','636988hLShxe','endsWith','close','KONEKSI\x20TERHUBUNG','loggedOut','./tmp','length','requestPairingCode','substring','senderKeyDistributionMessage','chmodSync','Bot\x20Connected','group','@hapi/boom','@g.us','Connection\x20Lost\x20from\x20Server,\x20reconnecting...','Message\x20atau\x20message.message\x20tidak\x20terdefinisi','./lib/log','append','Connection\x20closed,\x20reconnecting....','blue','timedOut','Error\x20changing\x20file\x20permissions:','1127285Lrfbjl','imageMessage','path','statusCode','chmod','Chrome','open','extendedTextMessage','existsSync','CODE\x20PAIRING:\x20'];_0x39b3=function(){return _0x4181ec;};return _0x39b3();}const config=require('./config'),path=require(_0x541c74(0x182)),fs=require('fs'),chalk=require(_0x541c74(0x18c)),{writeLog}=require(_0x541c74(0x17a)),{default:makeWASocket,useMultiFileAuthState,DisconnectReason,fetchLatestBaileysVersion}=require(_0x541c74(0x14b)),{processMessage}=require(_0x541c74(0x1a9)),{Boom}=require(_0x541c74(0x176)),qrcode=require(_0x541c74(0x168)),pino=require('pino'),lastMessageTime={},logger=pino({'level':_0x541c74(0x14d)}),{addUser,getUser}=require(_0x541c74(0x1a0)),{clearDirectory,logWithTime}=require(_0x541c74(0x198));clearDirectory(_0x541c74(0x16e));async function checkAndUpdate(){const _0x5a53ca=_0x541c74;if(config['AutoUpdate']=='on'){const {cloneOrUpdateRepo:_0x3676b0}=require(_0x5a53ca(0x165));await _0x3676b0();}connectToWhatsApp();}async function connectToWhatsApp(){const _0x50db52=_0x541c74,_0xb7e179=path['join'](__dirname,'session'),{state:_0x5da2a2,saveCreds:_0x182106}=await useMultiFileAuthState(_0xb7e179),{version:_0x57706c}=await fetchLatestBaileysVersion(),_0x12bd86=makeWASocket({'version':_0x57706c,'logger':logger,'printQRInTerminal':![],'auth':_0x5da2a2,'browser':[_0x50db52(0x1a8),_0x50db52(0x185),_0x50db52(0x193)]});if(!_0x12bd86[_0x50db52(0x18a)]['creds'][_0x50db52(0x18f)]&&config[_0x50db52(0x1ab)]==_0x50db52(0x14f)){const _0x44f3e9=config['phone_number_bot'],_0x17b775=_0x12c495=>new Promise(_0x450b86=>setTimeout(_0x450b86,_0x12c495));await _0x17b775(0xfa0);const _0x1e28ec=await _0x12bd86[_0x50db52(0x170)](_0x44f3e9[_0x50db52(0x156)]());console['log'](chalk[_0x50db52(0x17d)]('PHONE\x20NUMBER:\x20'),chalk[_0x50db52(0x166)](_0x44f3e9)),console[_0x50db52(0x149)](chalk['blue'](_0x50db52(0x189)),chalk[_0x50db52(0x166)](_0x1e28ec));}return _0x12bd86['ev']['on'](_0x50db52(0x19d),_0x182106),!fs[_0x50db52(0x188)](_0xb7e179)&&fs[_0x50db52(0x14a)](_0xb7e179,{'recursive':!![]}),fs[_0x50db52(0x173)](_0xb7e179,0x1ed),fs[_0x50db52(0x159)](_0xb7e179,(_0x576357,_0x505400)=>{const _0xa77abe=_0x50db52;if(_0x576357)return;_0x505400[_0xa77abe(0x15a)](_0x455bed=>{const _0x61a916=_0xa77abe,_0x4e4fc4=path[_0x61a916(0x163)](_0xb7e179,_0x455bed);fs[_0x61a916(0x184)](_0x4e4fc4,0x1a4,_0xd6384c=>{const _0x1d6969=_0x61a916;_0xd6384c&&console['error'](_0x1d6969(0x17f),_0xd6384c);});});}),_0x12bd86['ev']['on'](_0x50db52(0x199),async _0x1abb2c=>{const _0x2c7f74=_0x50db52;try{if(!_0x1abb2c||!_0x1abb2c[_0x2c7f74(0x161)]||!_0x1abb2c[_0x2c7f74(0x161)][0x0]){console[_0x2c7f74(0x149)](chalk[_0x2c7f74(0x1a4)](_0x2c7f74(0x1a6)),chalk[_0x2c7f74(0x166)](phoneNumber));return;}if(_0x1abb2c[_0x2c7f74(0x153)]===_0x2c7f74(0x17b))return![];const _0x43d801=_0x1abb2c[_0x2c7f74(0x161)][0x0]['messageTimestamp'],_0x17e7b6=_0x1abb2c[_0x2c7f74(0x161)][0x0],_0x4fbc1d=_0x17e7b6[_0x2c7f74(0x1a2)]||{},_0x2d1b49=_0x4fbc1d[_0x2c7f74(0x164)]||'',_0xc40069=_0x4fbc1d[_0x2c7f74(0x190)]||![],_0x2fc770=_0x4fbc1d['id']||![],_0x2c2621=_0x4fbc1d[_0x2c7f74(0x197)]||'',_0x4983ab=_0x17e7b6['pushName']||_0x2c7f74(0x192),_0x4312df=_0x2d1b49[_0x2c7f74(0x16a)](_0x2c7f74(0x177)),_0x2edc10=_0x4312df?_0x2c2621:_0x2d1b49;if(_0x2d1b49=='status@broadcast')return![];const _0x59d5bf=config[_0x2c7f74(0x15d)][_0x2c7f74(0x194)]();if(_0x4312df&&_0x59d5bf==='private'||!_0x4312df&&_0x59d5bf===_0x2c7f74(0x175))return;let _0x4b6ed1='',_0x32d86f='';if(_0x17e7b6&&_0x17e7b6['message'])_0x32d86f=Object['keys'](_0x17e7b6[_0x2c7f74(0x18d)])[0x0],_0x4b6ed1=_0x32d86f===_0x2c7f74(0x14e)?_0x17e7b6[_0x2c7f74(0x18d)][_0x2c7f74(0x14e)]:_0x32d86f===_0x2c7f74(0x187)?_0x17e7b6['message'][_0x2c7f74(0x187)]['text']:_0x32d86f===_0x2c7f74(0x172)?_0x17e7b6[_0x2c7f74(0x18d)][_0x2c7f74(0x14e)]:_0x32d86f===_0x2c7f74(0x181)?_0x17e7b6[_0x2c7f74(0x18d)][_0x2c7f74(0x181)][_0x2c7f74(0x160)]||_0x2c7f74(0x15b):_0x32d86f===_0x2c7f74(0x154)?_0x2c7f74(0x154):_0x32d86f==='templateButtonReplyMessage'?_0x17e7b6['message']['templateButtonReplyMessage']['selectedId']:'';else return console[_0x2c7f74(0x149)](chalk[_0x2c7f74(0x1a4)](_0x2c7f74(0x179)));if(_0x4b6ed1=='')return;let _0x3e1247=_0x4b6ed1;_0x4b6ed1[_0x2c7f74(0x16f)]>0xa&&(_0x3e1247=_0x4b6ed1[_0x2c7f74(0x171)](0x0,0xa)+_0x2c7f74(0x191));const _0x4619ad=Date['now']();if(lastMessageTime[_0x2edc10]&&_0x4619ad-lastMessageTime[_0x2edc10]<config[_0x2c7f74(0x150)]){console['log'](chalk[_0x2c7f74(0x1a4)]('Rate\x20limit\x20:\x20'+_0x3e1247+_0x2c7f74(0x19f)+_0x2edc10));return;}lastMessageTime[_0x2edc10]=_0x4619ad,logWithTime(_0x4983ab,_0x3e1247),writeLog('INFO',_0x2d1b49+':\x20'+_0x4b6ed1);const _0x4382d8=getUser(_0x2d1b49);!_0x4382d8&&addUser(_0x2d1b49,-0x1);try{const _0x49fc2e=await processMessage(_0x4b6ed1,_0x12bd86,_0x2d1b49,_0x17e7b6,_0x32d86f,_0x4983ab);}catch(_0x43976b){console[_0x2c7f74(0x152)](_0x2c7f74(0x19c),_0x43976b);}}catch(_0x5a6d5c){console[_0x2c7f74(0x149)](chalk[_0x2c7f74(0x1a4)](_0x2c7f74(0x1a1)+_0x5a6d5c[_0x2c7f74(0x18d)]));}}),_0x12bd86['ev']['on'](_0x50db52(0x18b),async _0x8bf1fb=>{const _0x269a98=_0x50db52,{connection:_0x533a9e,lastDisconnect:_0x433e06,qr:_0x2178b5}=_0x8bf1fb;_0x2178b5!=null&&(console[_0x269a98(0x149)](chalk[_0x269a98(0x157)]('Menampilkan\x20QR')),qrcode[_0x269a98(0x151)](_0x2178b5,{'small':!![]},_0x43e1a4=>{const _0x3bb0cf=_0x269a98;console[_0x3bb0cf(0x149)](_0x43e1a4);}));if(_0x533a9e===_0x269a98(0x16b)){let _0xe55129=new Boom(_0x433e06?.[_0x269a98(0x152)])?.[_0x269a98(0x15f)][_0x269a98(0x183)];switch(_0xe55129){case DisconnectReason[_0x269a98(0x167)]:console['log'](chalk[_0x269a98(0x1a4)](_0x269a98(0x19b)));return await connectToWhatsApp();break;case DisconnectReason[_0x269a98(0x155)]:console[_0x269a98(0x149)](chalk[_0x269a98(0x1a4)](_0x269a98(0x17c)));return await connectToWhatsApp();break;case DisconnectReason[_0x269a98(0x162)]:console[_0x269a98(0x149)](chalk[_0x269a98(0x1a4)](_0x269a98(0x178)));return await connectToWhatsApp();break;case DisconnectReason[_0x269a98(0x158)]:console[_0x269a98(0x149)](chalk[_0x269a98(0x1a4)](_0x269a98(0x18e)));return await connectToWhatsApp();break;case DisconnectReason[_0x269a98(0x16d)]:console[_0x269a98(0x149)](chalk[_0x269a98(0x1a4)]('Perangkat\x20Terkeluar,\x20Silakan\x20Lalukan\x20Scan/Pairing\x20Ulang'));break;case DisconnectReason[_0x269a98(0x1a3)]:console[_0x269a98(0x149)](chalk[_0x269a98(0x1a4)](_0x269a98(0x1aa)));return await connectToWhatsApp();break;case DisconnectReason[_0x269a98(0x17e)]:console[_0x269a98(0x149)](chalk[_0x269a98(0x1a4)](_0x269a98(0x195)));return await connectToWhatsApp();break;default:console[_0x269a98(0x149)](chalk[_0x269a98(0x1a4)](_0x269a98(0x15c)+_0xe55129+'|'+_0x533a9e));return await connectToWhatsApp(dataConnection);break;}}else _0x533a9e===_0x269a98(0x186)&&(await _0x12bd86[_0x269a98(0x1ad)](_0x269a98(0x1a5),{'text':_0x269a98(0x174)}),console[_0x269a98(0x149)](chalk['greenBright'](_0x269a98(0x16c))));}),_0x12bd86;}function _0xcefb(_0x1e91f3,_0x34e43a){const _0x39b368=_0x39b3();return _0xcefb=function(_0xcefb43,_0x3a822c){_0xcefb43=_0xcefb43-0x149;let _0x197c93=_0x39b368[_0xcefb43];return _0x197c93;},_0xcefb(_0x1e91f3,_0x34e43a);}checkAndUpdate();