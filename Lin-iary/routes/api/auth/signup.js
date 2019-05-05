const express = require('express')
const router = express.Router()

const CODE = require('../../../module/utils/statusCode')
const MSG = require('../../../module/utils/responseMessage')
const util = require('../../../module/utils/utils')

const csvManager = require('../../../module/utils/csvManager')
const encryptionManager = require('../../../module/utils/encryptionManager')

/*
{
	"nickname" : "리니",
	"age" : 14,
	"gender" : 0,
	"personality": "첫 일기장입니다",
	"familly": [ {
		"name": "아버지",
		"age": 48
	},{
		"name": "아머니",
		"age": 48
	}],
	"id":"hello",
	"pwd":"1234"
}
*/
router.post('/', (req, res) => {
	const jsonData = req.body

	signUp(jsonData, res).then(
		(result) => {
			if(result != true){
				res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, result))
				return
			}
			res.status(CODE.OK).send(util.successTrue(CODE.OK, MSG.SUCCESS_SIGN_UP))
		}
	).catch((err) => {
		res.status(CODE.OK).send(util.successFalse(CODE.INTERNAL_SERVER_ERROR, err.toString()))
	})
})

async function signUp(jsonData){
	const jsonArr = await csvManager.csvRead(csvManager.CSV_USER)
	if(checkIdDuplicate(jsonArr, jsonData)) {
		return MSG.FAIL_ALREADY_EXIST
	}
	jsonData.salt = await encryptionManager.makeRandomByte()
	jsonData.pwd = await encryptionManager.encryption(jsonData.pwd, jsonData.salt)
	let prevIdx = 0
	if (jsonArr.length > 0)
		prevIdx = parseInt(jsonArr[jsonArr.length - 1].idx)
	console.log(`prevId : ${prevIdx}`)
	jsonData.idx = parseInt(prevIdx + 1)
	jsonArr.push(jsonData)
	const isSuccess = await csvManager.csvWrite(csvManager.CSV_USER, jsonArr)	
	return isSuccess
}

function checkIdDuplicate(jsonArr, json) {
	let duplicate = false
	for (const i in jsonArr) {
		if (jsonArr[i].id == json.id) {
			duplicate = true
			break
		}
	}
	return duplicate
}

module.exports = router