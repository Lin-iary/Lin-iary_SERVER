const express = require('express')
const router = express.Router()

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const CODE = require('../../../module/utils/statusCode')
const MSG = require('../../../module/utils/responseMessage')
const util = require('../../../module/utils/utils')

const LIMIT_FILE_SIZE = 20000000

router.post('/', upload.single('photo'), async (req, res, next) => {
  var photo = ''
  console.log(req.file)
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
  
  photo = req.file.location
  console.log(req.file.path)
  res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS_UPLOAD_FILE))
})

module.exports = router;

