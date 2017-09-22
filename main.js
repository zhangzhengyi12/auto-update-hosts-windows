const request = require("request");
const fs = require("fs");
const path = require("path");
const winddowsPath = `C:${path.sep}Windows${path.sep}system32${path.sep}drivers${path.sep}etc`
const downloadURI = "https://raw.githubusercontent.com/googlehosts/hosts/master/hosts-files/hosts";
const zipName = "hosts"


function downloadFilePromisify(uri, filename) {
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream(filename)
    request(uri)
      .pipe(stream)
      .on("close", () => {
        console.log("下载成功")
        resolve("download")
      })
  })
}

function unZipFilePromisify(filePath, unzipPath) {
  return new Promise((resolve, reject) => {
    let unzip = new admZip(filePath);
    unzip.extractAllTo(unzipPath, true);
    console.log("解压成功");
    resolve("unzip");
  });
}

function moveFilePromisify(filePath, toPath,fileName) {
  return new Promise((resolve, reject) => {
    let sourcePath = path.join(filePath,fileName)
    let destPath = path.join(toPath,fileName)
    let readHostsStream = fs.createReadStream(sourcePath)
    let writeHostsStream = fs.createWriteStream(destPath)
    readHostsStream.pipe(writeHostsStream)
    console.log('完成....... ✔')
    resolve('move')
  })
}





function updateHostsFile() {
  downloadFilePromisify(downloadURI, zipName)
    .then((mess) => {
      return moveFilePromisify('',winddowsPath,'hosts')
    })  
}

updateHostsFile()




