const MusicQueue = require('./MusicQueue.js')
const { getVoiceConnection, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, joinVoiceChannel, createAudioResource, StreamType, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = class Session{
    constructor( { guid, voiceChannel, callChannel } ) {
        this.session = {
            guildID: guid,
            channel: voiceChannel,
            callChannel: callChannel,
            status: 'idle',
            queue: new MusicQueue(),
            conn: null,
            player: null,
        }
    }

    connectToVoice() {
        // check if bot has already connected to a voice channel
        // attempt to connect if not connected.
        if(!this.session.conn) {
            this.session.conn = joinVoiceChannel({
                channelId: this.session.channel.id,
                guildId: this.session.guildID,
                selfDeaf: true,
                adapterCreator: this.session.channel.guild.voiceAdapterCreator
            })

            return {
                success: true,
                type: 0,
                message: 'Connecting.'
            }
        }
        else{
            return {
                success: false,
                type: 1,
                message: 'Already Connected.'
            }
        }
    }

    async queueMusic(song, nickname){
        var song = await this.session.queue.queue(song, nickname)
        return song
    }
}