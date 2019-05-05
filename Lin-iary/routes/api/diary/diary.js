const express = require('express')
const router = express.Router()



const multer = require('multer')
const upload = multer({
    dest: 'public/images/'
})

const CODE = require('../../../module/utils/statusCode')
const MSG = require('../../../module/utils/responseMessage')
const util = require('../../../module/utils/utils')

const csvManager = require('../../../module/utils/csvManager')

const LIMIT_FILE_SIZE = 20000000

const imageAddress = 'http://13.124.195.67:3000/images/'


/* get diary list */
router.get('/', (req, res) => {
    csvManager.csvRead(csvManager.CSV_DIARY).then((jsonArr) => {
        console.log(jsonArr)
        res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS_GET_DIARY_LIST, jsonArr))
    }).catch((err) => {
        res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, MSG.FAIL_CSV_READ))
    })
})

/* get diary single */
router.get('/:id', (req, res) => {
    const diary_idx = req.params.id
    csvManager.csvReadSingle(csvManager.CSV_DIARY, diary_idx).then((jsonData) => {
        res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS_GET_DIARY_LIST, jsonData))
    }).catch((err) => {
        res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, MSG.FAIL_CSV_READ))
    })
})

router.post('/', upload.single('photo'), async (req, res, next) => {
    const body = req.body
    console.log(`file : ${req.file} , body : ${JSON.stringify(body)}`)
    if (req.file == undefined) {
        res.status(CODE.OK).send(util.successFalse(CODE.BAD_REQUEST, MSG.NO_FILE))
        return
    }

    if (req.file.mimetype != 'image/jpeg') {
        res.status(CODE.OK).send(util.successFalse(CODE.BAD_REQUEST, MSG.UN_VALID_FILE))
        return
    }

    if (req.file.size > LIMIT_FILE_SIZE) {
        res.status(CODE.OK).send(util.successFalse(CODE.BAD_REQUEST, MSG.OVER_SIZE_FILE))
        return
    }

    const content = body.content
    const filePath = req.file.filename
    console.log(req.file.path)
    console.log(`${imageAddress}${filePath}`)
    const jsonData = {
        content: content,
        url: `${imageAddress}${filePath}`,
        write_date: new Date()
    }

    csvManager.csvAdd(csvManager.CSV_DIARY, jsonData).then((isSuccess) => {
        if (isSuccess != true) {
            console.log(err.toString())
            res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, MSG.FAIL_CSV_WRITE))
            return
        }
        res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS_UPLOAD_FILE, jsonData))
    }).catch((err) => {
        console.log(err.toString())
        res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, err.toString()))
    })
})

module.exports = router