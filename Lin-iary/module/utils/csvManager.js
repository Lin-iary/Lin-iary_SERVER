const fs = require('fs')
const json2csv = require('json2csv')
const csv = require('csvtojson')
const resMessage = require('../utils/responseMessage')
const csv_url = './public/csv/'

const csvManager = {
    csvWrite: (fileName, jsonArray) => {
        return new Promise((resolve, reject) => {
            
            console.log(JSON.stringify(jsonArray))
            const resultCsv = json2csv.parse(jsonArray)
            console.log(resultCsv)

            fs.writeFile(`${csv_url}${fileName}`, resultCsv, (err) => {
                if (err) {
                    console.log(`file save(${csv_url}${fileName}) err: ${err}`)
                    reject(resMessage.FAIL_CSV_WRITE)
                    return
                }
                console.log(`All of complete(${csv_url}${fileName})!`)
                resolve(true)
            })
        })
    },
    csvRead: (fileName) => {
        return new Promise((resolve, reject) => {
            try{
                fs.existsSync(`${csv_url}${fileName}`)
            }catch(err){
                console.log(`file(${csv_url}${fileName}) not exist`)
                resolve(Array())
                return
            }
            csv().fromFile(`${csv_url}${fileName}`).then((jsonArr) => {
                if (!jsonArr) {
                    console.log(`file read(${csv_url}${fileName}) err: ${err}`)
                    reject(resMessage.FAIL_CSV_READ)
                    return
                }
                console.log(`All of complete(${csv_url}${fileName})!`)
                resolve(jsonArr);
            }, (err) => {
                console.log(`err with readCSV: ${err}`)
                reject(resMessage.FAIL_CSV_READ)
            })
        })
    },
    CSV_USER: "user.csv",
    CSV_USER: "diary.csv",
}

module.exports = csvManager