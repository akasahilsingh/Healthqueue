import express from 'express'
import upload from '../middlewares/multer.js'
import { doctorList } from "../controllers/doctorController.js"

const doctorRouter = express.Router()

//Endpoint
// adminRouter.post('/add-doctor', upload.single('image'), (req, res, next) => {
//     console.log('File in route:', req.file);
//     next();
// }, addDoctor)
doctorRouter.get("/list", doctorList)


export default doctorRouter;