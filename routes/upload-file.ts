import {Router} from 'express';

export const uploadRouter = Router();

uploadRouter
    .post('/upload', async (req, res) => {

        const [data] = Object.entries(req.files);
        const primaryData: any = data[1];


        const finallyData = [...(JSON.parse(primaryData.data))];

        console.log(finallyData);

        res.send('ok');

    });