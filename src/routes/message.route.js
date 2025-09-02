import express from 'express'
import { verifyUser } from '../middlewares/verifyUser'

const router = express.Router()

router.post('/', verifyUser, )