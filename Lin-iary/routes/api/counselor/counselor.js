const express = require('express')
const router = express.Router()

const CODE = require('../../../module/utils/statusCode')
const MSG = require('../../../module/utils/responseMessage')
const util = require('../../../module/utils/utils')

const multer = require('multer')
const upload = multer({
    dest: 'public/images/'
})

const csvManager = require('../../../module/utils/csvManager')

const LIMIT_FILE_SIZE = 20000000
const imageAddress = 'http://13.124.195.67:3000/info'


/* get diary list */
router.get('/', (req, res) => {
    csvManager.csvRead(csvManager.CSV_COUNSELOR).then((jsonArr) => {
        console.log(jsonArr)
        res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS, jsonArr))
    }).catch((err) => {
        res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, MSG.FAIL_CSV_READ))
    })
})

/* get diary single */
router.get('/:id', (req, res) => {
    const idx = req.params.id
    csvManager.csvReadSingle(csvManager.CSV_COUNSELOR, idx).then((jsonData) => {
        res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS, jsonData))
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

    const name = body.name
    const organization = body.organization
    if(name == undefined || organization == undefined){
        res.status(CODE.OK).send(util.successFalse(CODE.BAD_REQUEST, MSG.WRONG_PARAMETER))
        return
    }

    const filePath = req.file.filename
    console.log(req.file.path)
    console.log(`${imageAddress}${filePath}`)
    const jsonData = {
        name: name,
        organization: organization,
        url: `${imageAddress}${filePath}`,
        date: new Date()
    }

    csvManager.csvAdd(csvManager.CSV_COUNSELOR, jsonData).then((isSuccess) => {
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