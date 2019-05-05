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

/* get diary list */
router.get('/', (req, res) => {
    csvManager.csvRead(csvManager.CSV_CONSULT).then((jsonArr) => {
        console.log(jsonArr)
        res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS, jsonArr))
    }).catch((err) => {
        res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, MSG.FAIL_CSV_READ))
    })
})

/* get diary single */
router.get('/:id', (req, res) => {
    const idx = req.params.id
    csvManager.csvReadSingle(csvManager.CSV_CONSULT, idx).then((jsonData) => {
        res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS, jsonData))
    }).catch((err) => {
        res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, MSG.FAIL_CSV_READ))
    })
})

router.post('/', (req, res) => {
    const body = req.body
    const counselor_idx = body.counselor_idx
    const content = body.content
    if(counselor_idx == undefined || content == undefined) {
        res.send(CODE.OK).send(util.successFalse(CODE.BAD_REQUEST, MSG.WRONG_PARAMETER))
    }
    const jsonData = {
        content: content,
        counselor_idx: counselor_idx,
        write_time: new Date()
    }
    csvManager.csvAdd(csvManager.CSV_CONSULT, jsonData).then((isSuccess) => {
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