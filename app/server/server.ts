import { DBFFile } from 'dbffile';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors'

/**INICIALIZANDO SERVICIO 🦧*/
const app = express();

/**CONFIG  */
app.use(cors())
app.use(express.json());
app.use(morgan("dev"))

/**PRUEBA DE MOCK 🍕 */
app.get('/', async (req, res, next) => {
    try {
        const DOCUMENTOS_MOCK: any = []

        const DOCS = await DBFFile.open(__dirname + '/../mock/sunat_answer.dbf');

        for await (const docs of DOCS) {
            DOCUMENTOS_MOCK.push(docs);
        }

        res.status(200).send(DOCUMENTOS_MOCK).json();
    } catch (error) {
        next(error);
    }

})

app.post('/', (req, res) => {
    const data = req.body;
    res.send({
        error: false,
        cantidad: data.length,
        data: data
    })
})

export { app }