const request = require('request')
const fs = require('fs')
const path = require('path')
const readLine = require('readline')
const winddowsPath = `C:${path.sep}Windows${path.sep}system32${path.sep}drivers${path.sep}etc`
const downloadURI =
  'https://coding.net/u/scaffrey/p/hosts/git/raw/master/hosts-files/hosts'
const zipName = 'hosts'

function downloadFilePromisify(uri, filename) {
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream(filename)
    console.log('DownLoading.......')
    request(uri)
      .pipe(stream)
      .on('close', () => {
        console.log('DownLoading success')
        resolve()
      })
  })
}

function unZipFilePromisify(filePath, unzipPath) {
  return new Promise((resolve, reject) => {
    let unzip = new admZip(filePath)
    unzip.extractAllTo(unzipPath, true)
    resolve()
  })
}

function moveFilePromisify(filePath, toPath, fileName) {
  return new Promise((resolve, reject) => {
    let sourcePath = path.join(filePath, fileName)
    let destPath = path.join(toPath, fileName)
    let readHostsStream = fs.createReadStream(sourcePath)
    let writeHostsStream = fs.createWriteStream(destPath)
    // error handle
    writeHostsStream.on('error', err => {
      console.log('File write error, please ensure permissions')
      return
      writeHostsStream.close()
    })
    writeHostsStream.on('close', err => {
      console.log('Completed....... ✔')
      resolve()
    })
    // eror
    readHostsStream.pipe(writeHostsStream)
  })
}

function readFileHeader(file, headerName, endByte) {
  return new Promise((resolve, reject) => {
    let filePath = path.join(file)
    let regObj = new RegExp(`#\\s${headerName}:\\s\\d+-\\d+-\\d+`)
    // let regObj = /#\sLast updated:\s(\d+-\d+-\d+)/
    fs.readFile(file, 'utf8', function(err, data) {
      let reslut = data.match(regObj)[0]
      if (!reslut) {
        console.log('下载文件错误')
        return
      } else {
        console.log(reslut)
        resolve()
      }
    })
  })
}

function updateHostsFile() {
  console.log('Make sure to run under administrator privileges')
  downloadFilePromisify(downloadURI, zipName)
    .then(() => {
      return readFileHeader(zipName, 'Last updated', 100)
    })
    .then(() => {
      return moveFilePromisify('', winddowsPath, 'hosts')
    })
}

module.exports = updateHostsFile
