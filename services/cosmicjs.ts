import { createBucketClient } from '@cosmicjs/sdk';
import multer from 'multer';

const { BUCKET_SLUG, READ_KEY, WRITE_KEY } = process.env;

const bucketMDB = createBucketClient({
  bucketSlug: BUCKET_SLUG as string,
  readKey: READ_KEY as string,
  writeKey: WRITE_KEY as string,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImagem = async (req: any) => {
  if (req?.file?.originalname) {
    if (
      !req.file.originalname.includes('.png') &&
      !req.file.originalname.includes('.jpg') &&
      !req.file.originalname.includes('.jpeg')
    ) {
      throw new Error('Extensão da imagem inválida!');
    }

    const media = {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    };

    if (req.url && req.url.includes('admin/cadastro')) {
      return await bucketMDB.media.insertOne({
        media: media,
        folder: 'carros',
      });
    } else {
      return await bucketMDB.media.insertOne({
        media: media,
        folder: 'avatar',
      });
    }
  }
};

export { upload, uploadImagem };
