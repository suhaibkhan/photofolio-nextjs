import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import ExifReader from 'exifreader';
import { ImageMetaData } from '../../components/image.model';
import { images } from '../../_data/image-data';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ImageMetaData | string>
) {
    const { name } = req.query;
    if (req.method === 'GET') {
        const filePath = path.resolve('.', `public/images/photos/${name}`);
        const imageBuffer = fs.readFileSync(filePath);
        const tags = ExifReader.load(imageBuffer);
        const title = images.find(img => img.name === name)?.title || '';
        // console.log(tags);
        const imageMeta = {
            fNumber: tags.FNumber?.description || '',
            iso: '' + tags.ISOSpeedRatings?.description || '',
            shutterSpeed: tags.ShutterSpeedValue?.description || '',
            focalLength: '' + tags.FocalLengthIn35mmFilm?.description || '',
            dateTime: tags.DateCreated?.description || '',
            lensModel: tags.LensModel?.description || '',
            cameraModel: `${tags.Make?.description || ''} ${tags.Model?.description || ''}`,
            title,
        };
        res.status(200).json(imageMeta);
    } else {
        res.status(405).send('Not found');
    }
}
