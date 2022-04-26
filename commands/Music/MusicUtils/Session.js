const MusicQueue = require('./MusicQueue.js')
const { getVoiceConnection, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, joinVoiceChannel, createAudioResource, StreamType, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = class Session{
    constructor( { guid, voiceChannel } ) {
        this.session = {
            guildID: guid,
            channel: voiceChannel,
            status: 'idle',
            queue: new MusicQueue(),
            conn: null,
            player: null,
        }
    }

    async connectToVoice() {
        // check if bot has already connected to a voice channel
        // attempt to connect if not connected.
        if(!this.session.conn) {
            this.session.conn = joinVoiceChannel({
                channelId: this.session.channel.id,
                guildId: this.session.guildID,
                selfDeaf: true,
                adapterCreator: this.session.channel.guild.voiceAdapterCreator
            })

            // check if bot has permission to join a voice channel
            let a = async () => {
                try{
                    await entersState(this.session.conn, VoiceConnectionStatus.Connecting, 1_000 )
                    return {
                        success: true,
                        type: 0,
                        message: 'Connecting.'
                    }
                }
                catch(error){
                    this.session.conn.destroy()
                    this.session.conn = null
                    return {
                        success: false,
                        type: 2,
                        message: 'Insufficient permissions.'
                    }
                }
            }
            let b = await a()
            return b
        }
        else{
            return {
                success: false,
                type: 1,
                message: 'Already Connected.'
            }
        }
    }

    async queueMusic(song){
        await this.session.queue.queue(song)
    }
}