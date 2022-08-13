import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Buffer | string>
) {
    const { name } = req.query;
    if (req.method === 'GET') {
        const filePath = path.resolve('.', `public/images/photos/${name}`);
        const imageBuffer = fs.readFileSync(filePath);
        const compressedImage = await imagemin.buffer(imageBuffer, {
            plugins: [imageminMozjpeg({ quality: 70 })]
        });
        res.setHeader('Content-Type', 'image/jpg');
        res.status(200).send(compressedImage);
    } else {
        res.status(405).send('Not found');
    }
}
