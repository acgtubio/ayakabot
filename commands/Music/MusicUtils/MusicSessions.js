const MusicQueue = require('./MusicQueue.js')
const session = require('./Session.js')

module.exports = class MusicSessions {
    constructor(){
        this.musicSessions = {}
    }

    get length(){
        return this.musicSessions.length
    }

    exists(guid) {
        return this.musicSessions[guid] ? true : false
    }

    addSession({ guildID, channel, callChannel }){
        this.musicSessions[guildID] = new session({ guid: guildID, voiceChannel: channel, callChannel: callChannel })
        let { success, type, message } = this.musicSessions[guildID].connectToVoice()
        if(!success) {
            if(type == 2){
                this.removeSession(guildID)
            }
        }
        return {
            type: type,
            message: message
        }
    }

    removeSession(guid) {
        delete this.musicSessions[guid]
    }


}