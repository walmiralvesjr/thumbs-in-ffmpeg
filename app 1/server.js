const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Função para listar arquivos de vídeo em um diretório
function listVideos(directory) {
    return fs.readdirSync(directory).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.mp4' || ext === '.avi' || ext === '.mkv';  // Suporte a vários formatos de vídeo
    });
}

// Função para criar thumbnail de vídeo
function createThumbnail(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                count: 1,         // Captura uma única imagem
                folder: path.dirname(outputPath),
                filename: path.basename(outputPath),  // Define o nome da imagem gerada
                size: '320x240'   // Define o tamanho da thumbnail
            })
            .on('end', () => {
                console.log(`Thumbnail criada para o vídeo: ${videoPath}`);
                resolve();
            })
            .on('error', err => {
                console.error(`Erro ao criar thumbnail: ${err.message}`);
                reject(err);
            });
    });
}

// Função principal para gerar thumbnails de todos os vídeos
async function generateThumbnails(directory) {
    const videos = listVideos(directory);
    if (videos.length === 0) {
        console.log('Nenhum vídeo encontrado no diretório.');
        return;
    }

    for (const video of videos) {
        const videoPath = path.join(directory, video);
        const thumbnailPath = path.join(directory, `${path.parse(video).name}.jpg`);

        try {
            await createThumbnail(videoPath, thumbnailPath);
        } catch (error) {
            console.error(`Erro ao processar o vídeo ${video}: ${error.message}`);
        }
    }
}

// Diretório com os vídeos
const videoDirectory = path.join(__dirname, 'videos');

// Gera as thumbnails
generateThumbnails(videoDirectory);
