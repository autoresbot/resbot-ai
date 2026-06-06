import { removeSpace, isQuotedMessage, getMessageType } from './utils.js';
import { getContentType } from 'baileys';

const debug = true;

function time() {
  const now = new Date();
  const jam = now.getHours().toString().padStart(2, '0');
  const menit = now.getMinutes().toString().padStart(2, '0');
  return `${jam}:${menit}`;
}

function logWithTimestamp(...messages) {
  const now = new Date();
  const time = now.toTimeString().split(' ')[0]; // format: HH:MM:SS
  console.log(`[${time}]`, ...messages);
}

function serializeMessage(m, sock) {
  try {
    if (!m || !m.messages || !m.messages[0]) return null;
    if (m.type === 'append') return null;

    const message = m.messages[0];
    const key = message.key || {};
    const remoteJid = key.remoteJidAlt || key.remoteJid || '';
    const fromMe = key.fromMe || false;
    const id = key.id || '';
    const participant = key.participantAlt || key.participant || message.participant || '';
    const pushName = message.pushName || '';
    const isGroup = typeof remoteJid === 'string' && remoteJid.endsWith('@g.us');

    // console.log(JSON.stringify(message, null, 2));

    let sender = isGroup ? participant : remoteJid;
    const isQuoted = isQuotedMessage(message); // pesan yang mengutip pesan lain
    const isEdited =
      message?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text ||
      message?.message?.protocolMessage?.editedMessage?.conversation ||
      message?.message?.editedMessage ||
      null;

    let objisEdited = {};
    if (isEdited) {
      const messageId = m.messages[0]?.message?.protocolMessage?.key?.id;
      objisEdited = {
        status: true,
        id: messageId || null,
        text: isEdited,
      };
    }

    if (message?.message?.senderKeyDistributionMessage) {
      //console.log(JSON.stringify(message, null, 2));
      //return;
    }

    let content = '';
    let messageType = '';

    if (message?.message?.stickerMessage) {
      content = 'stickerMessage';
    } else {
      content =
        message?.message?.conversation ||
        message?.message?.extendedTextMessage?.text ||
        message?.message?.imageMessage?.caption ||
        message?.message?.videoMessage?.caption ||
        message?.message?.documentMessage?.caption ||
        message?.message?.text ||
        message?.message?.selectedButtonId ||
        message?.message?.singleSelectReply?.selectedRowId ||
        message?.message?.selectedId ||
        message?.message?.contentText ||
        message?.message?.selectedDisplayText ||
        message?.message?.title ||
        '';
    }

    if (message.message) {
      const rawMessageType = getContentType(message.message);

      const isTagMeta = Boolean(rawMessageType === 'botInvokeMessage');

      messageType = Object.keys(message.message)[0]; // imageMessage, pollUpdateMessage, senderKeyDistributionMessage

      content =
        messageType === 'conversation'
          ? message.message.conversation
          : messageType === 'extendedTextMessage'
            ? message.message.extendedTextMessage.text
            : messageType === 'senderKeyDistributionMessage'
              ? message.message.conversation
              : messageType === 'imageMessage'
                ? message.message.imageMessage.caption || 'No caption'
                : messageType === 'videoMessage'
                  ? message.message.videoMessage.caption || 'No caption'
                  : messageType === 'stickerMessage'
                    ? 'stickerMessage'
                    : messageType === 'audioMessage'
                      ? 'audioMessage'
                      : messageType === 'templateButtonReplyMessage'
                        ? message.message.templateButtonReplyMessage.selectedId
                        : '';

      if (message?.message?.reactionMessage && message?.reaction) {
        // Deteksi reaction
        const emoji = message.reaction?.text || '[REACT DIHAPUS]'; // Bisa kosong jika dihapus
        const reactedToMsgId = message.reaction?.key?.id || '[ID TIDAK TERDETEKSI]';
        const reactedBy = message.reaction?.key?.participant || 'diri sendiri';
        const groupId = message.reaction?.key?.remoteJid || '[GRUP TIDAK TERDETEKSI]';
        const fromMe = message.reaction?.key?.fromMe ?? '[TIDAK DIKETAHUI]';

        messageType = 'reactionMessage';
        content = emoji;
        return;
      }

      if (message?.message?.reactionMessage) {
        const emoji = message.message.reactionMessage?.text || '[REACT DIHAPUS]';

        messageType = 'reactionMessage';
        content = emoji;
        return;
      }

      if (messageType == 'senderKeyDistributionMessage') {
        const text = message.message?.extendedTextMessage?.text;
        if (text) {
          messageType = 'conversation';
          content = text;
        }
      }

      if (message.message?.imageMessage?.caption) {
        // detect media
        const caption = message.message.imageMessage.caption;
        messageType = 'imageMessage';
        content = caption;
      }

      if (message.message?.stickerMessage) {
        messageType = 'stickerMessage';
        content = 'stickerMessage';
      }

      if (message.message?.pollResultSnapshotMessage) {
        const pollName = message.message.pollResultSnapshotMessage.name;
        messageType = 'pollResultSnapshotMessage';
        content = pollName;
      }

      if (message.message?.senderKeyDistributionMessage && !content) {
        const groupId = message.message.senderKeyDistributionMessage.groupId;
        //console.log("Group ID senderKeyDistributionMessage:", groupId);

        content =
          message?.message?.conversation ||
          message?.message?.extendedTextMessage?.text ||
          message?.message?.imageMessage?.caption ||
          null;

        if (content) {
          messageType = 'conversation';
        }

        if (message?.message?.stickerMessage) {
          messageType = 'stickerMessage';
          content = 'stickerMessage';
        }

        if (message?.message?.videoMessage) {
          const caption = message.message.videoMessage.caption || '';
          messageType = 'videoMessage';
          content = caption;
        }

        if (message?.message?.senderKeyDistributionMessage) {
          //console.log('✅ Ini pesan senderKeyDistributionMessage dari grup:', groupId);
          //return null;
        }

        if (message?.message?.protocolMessage?.type === 'REVOKE') {
          const revokedMsgInfo = message.message.protocolMessage.key;
          //.log('SINI REVOKE')
        }
      }

      if (message.message?.imageMessage && !content) {
        messageType = 'imageMessage';
        const caption = message.message.imageMessage.caption || null;
        if (caption) {
          content = caption;
        }
      }

      if (message.message?.extendedTextMessage && !content) {
        const extendedTextMessage = message.message.extendedTextMessage;
        const text = extendedTextMessage.text;
        messageType = 'extendedTextMessage';
        content = text;
      }

      if (messageType === 'messageContextInfo') {
        messageType = 'pollCreationMessage';
        const msg = message.message;
        if (msg && msg.pollCreationMessageV3 && msg.pollCreationMessageV3.name) {
          const name = msg.pollCreationMessageV3.name;
          content = name;
        }
      }

      if (message.message?.protocolMessage?.type === 0) {
        const deletedMessageId = message.message.protocolMessage.key.id;
        const deletedBy = message.message.protocolMessage.key.participant;
        const groupId = message.message.protocolMessage.key.remoteJid;
      }

      if (message.message?.viewOnceMessage) {
        const innerMsg = message.message?.viewOnceMessage?.message;

        if (innerMsg?.buttonsMessage?.documentMessage?.caption) {
          const caption = innerMsg.buttonsMessage.documentMessage.caption;
          messageType = 'viewOnceMessage';
          content = caption;
        }
      }

      if (message.message?.senderKeyDistributionMessage && !content) {
        const groupId = message.message.senderKeyDistributionMessage.groupId;
        // console.log('✅ Ini pesan senderKeyDistributionMessage dari grup:', groupId);
        //return null;
      }

      const editedMessage =
        message.message?.editedMessage || message.message?.protocolMessage?.editedMessage;
      const editedType = message.message?.protocolMessage?.type === 14;

      if (editedMessage || editedType) {
        const directEdit = editedMessage?.message;

        if (directEdit) {
          return null;
        }

        if (editedMessage?.conversation) {
        } else if (editedMessage?.extendedTextMessage?.text) {
        } else if (editedMessage?.imageMessage?.caption) {
        } else {
        }
      }

      if (message.message?.pollUpdateMessage) {
        console.log('✅ Ini adalah pesan pembaruan polling.');
        return null;
      }

      if (message?.message?.albumMessage) {
        const album = message.message.albumMessage;
        const imageCount = album.expectedImageCount || 0;
        const videoCount = album.expectedVideoCount || 0;
        messageType = 'albumMessage';
      }

      if (
        message.message &&
        message.message.buttonsMessage &&
        message.message.buttonsMessage.contentText
      ) {
        const isiPesan = message.message.buttonsMessage.contentText;
        messageType = 'buttonsMessage';
        content = isiPesan;
      }

      if (messageType === 'viewOnceMessage') {
        const contentText = message.message?.viewOnceMessage?.message?.buttonsMessage?.contentText;
        if (contentText) {
          messageType = 'viewOnceMessage';
          content = contentText;
        }
      }

      const editedText =
        message.message?.protocolMessage?.type === 14
          ? message.message?.protocolMessage?.editedMessage?.conversation
          : null;
      if (editedText) {
        messageType = 'editedMessage';
        content = editedText;
      }

      const pinMessage = message.message?.pinInChatMessage; // Jika pesan di pin
      if (pinMessage) {
        const pinnedMsgId = pinMessage.key?.id;
        const groupId = pinMessage.key?.remoteJid;
        const fromMe = pinMessage.key?.fromMe;
        const timestamp = pinMessage.senderTimestampMs;
        messageType = 'pinInChatMessage';
        content = '';
        return null;
      }

      if (message.message?.documentMessage) {
        const doc = message.message.documentMessage;
        const namaFile = doc.fileName || 'Tidak diketahui';
        const mime = doc.mimetype || 'unknown';
        const url = doc.url;

        messageType = 'documentMessage';
        content = namaFile;
      }

      if (!content) {
        // console.log('392 --- NO CONTENT -------')
        //console.log(JSON.stringify(message, null, 2))
        return null;
      }
    } else {
      console.log('message.message null!');
      //console.log(JSON.stringify(m, null, 2));
      return null;
    }

    /* ---- Struktur lengkap informasi pesan --- */
    const quotedMessage = isQuoted
      ? {
          text: message.message.extendedTextMessage.contextInfo.quotedMessage?.conversation || '',
          sender: message.message.extendedTextMessage.contextInfo.participant || '',
          id: message.message.extendedTextMessage.contextInfo.stanzaId || '',
        }
      : null;

    const ArraymentionedJid =
      message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || false;
    const cleanContent = content.replace(/\s+/g, ' ').trim(); // Hapus newline/tab jadi spasi
    const preview = cleanContent.length > 20 ? cleanContent.slice(0, 20) + '...' : cleanContent;
    const senderNumber = participant.replace(/@s\.whatsapp\.net$/, '');

    if (content) {
      // if(!senderNumber) {
      //     return;
      // }
    }

    if (message?.message?.protocolMessage?.type === 17) {
      return;
    }

    if (messageType == 'senderKeyDistributionMessage') {
      return null;
    }

    if (!content) {
      // console.log('-------[ TIDAK ADA CONTENT ] : ', messageType)
      const ignoredTypes = [
        'senderKeyDistributionMessage',
        'albumMessage',
        'imageMessage',
        'videoMessage',
        'messageContextInfo',
      ];
      if (!ignoredTypes.includes(messageType)) {
        // logWithTimestamp('--- NO CONTENT OPEN ----');
        // logWithTimestamp('--- messageType :', messageType);
        // logWithTimestamp('---- ISI NYA :', message.message);
        // logWithTimestamp('--- NO CONTENT CLOSE ----');
        // kode di sini
      }
    }

    return {
      id,
      timestamp: message.messageTimestamp,
      sender,
      pushName,
      isGroup,
      fromMe,
      remoteJid,
      messageType: messageType,
      content: content,
      message,
      fullText: content,
      isQuoted,
      quotedMessage,
    };
  } catch (e) {
    // console.log('----------------------- error A OPEN ')
    // console.log('error A', e)
    // console.log('----------------------- error A CLOSE ')
    return null;
  }
}

export default serializeMessage;
