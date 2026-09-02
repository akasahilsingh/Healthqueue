import express from 'express'
import { addDoctor, loginAdmin, getAllDoctor, appointmentAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctor', authAdmin, getAllDoctor)
adminRouter.post('/change-availibility', authAdmin, changeAvailability)
adminRouter.get("/appointments", authAdmin, appointmentAdmin)

export default adminRouter;