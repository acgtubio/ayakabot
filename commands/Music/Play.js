const { getVoiceConnection, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, joinVoiceChannel, createAudioResource, StreamType, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const playdl = require('play-dl');

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
    async execute(serverQueue,interaction) {
        const gId = interaction.guildId;

        interaction.reply('playing music');

        // create audio player if not yet created
        if(!serverQueue[gId].player) {
            serverQueue[gId].player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });
        }
        
        // create play music if idle
        if (serverQueue[gId].status == 'idle'){
            var res = await getResource(serverQueue, gId);

            serverQueue[gId].status = 'playing';

            serverQueue[gId].player.play(res);
            serverQueue[gId].conn.subscribe(serverQueue[gId].player);
        }

        serverQueue[gId].player.on('idle', async () => {
            serverQueue[gId].status = 'idle';

            if(serverQueue[gId].queue[0]){
                serverQueue[gId].status = 'playing';
                serverQueue[gId].player.play(await getResource(serverQueue,gId));
            }
            else {
                serverQueue[gId].player.removeAllListeners();
                serverQueue[gId].conn.removeAllListeners();
            }

            try{
                await entersState(serverQueue[gId].player, AudioPlayerStatus.Playing, 60_000);
            }
            catch(error){
                serverQueue[gId].player.stop();
                serverQueue[gId].conn.destroy();
            }      
        });
    },
}

async function getResource(serverQueue, id){
    const url = serverQueue[id].queue.shift();

    const st = await playdl.stream(url);
    const resource = createAudioResource(st.stream, { inputType: st.type });

    return resource;
}