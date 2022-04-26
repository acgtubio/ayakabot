const { getVoiceConnection, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, joinVoiceChannel, createAudioResource, StreamType, NoSubscriberBehavior } = require('@discordjs/voice');
const Player = require('./MusicUtils/Player.js')

module.exports = {
    name: 'play',
    description: 'playing something',
    options: [
        {
            name: 'song',
            type: 'STRING',
            description: 'song name or youtube url',
            required: true,
        }
    ],
    async execute(serverSession, interaction) {
        const gId = interaction.guildId;

        // create audio player if not yet created
        if(!serverSession.player) {
            serverSession.player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });
            serverSession.conn.subscribe(serverSession.player)
        }

        await Player.playNextMusic(serverSession)

        serverSession.player.on('idle', async () => {
            serverSession.status = 'idle'

            if(!serverSession.queue.isEmpty()){
                serverSession.status = 'playing'
                await Player.playNextMusic(serverSession)
            }
            else {
                serverSession.player.removeAllListeners()
                serverSession.player.stop()
                serverSession.player = null
            }
        })
    },
}
