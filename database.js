const fs = require('fs');
const mime = require('mime-types');
const readFilePromise = (path, encoding = 'utf8') => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};
const readdirPromise = path => {
    return new Promise((resolve, reject) => {
        let paths = [];
        fs.readdir(path, (err, dirPaths) => {
            if (err) {
                reject(err);
            } else {
                dirPaths.forEach(dirPath => {
                    paths.push(`${path}/${dirPath}`);
                });
                resolve(paths);
            }
        });
    });
};
const statPromise = path => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, pathStats) => {
            if (err) {
                reject(err);
            } else {
                pathStats.path = path;
                if (pathStats.isDirectory()) {
                    pathStats.kind = 'directory';
                } else if (pathStats.isFile()) {
                    pathStats.kind = 'file';
                    pathStats.type = mime.lookup(path);
                } else {
                    reject('statPromise error');
                }
                resolve(pathStats);
            }
        });
    });
};
let dirToRead = [];
dirToRead.push('database');
const readdirRecursive = () => {
    readdirPromise(dirToRead.pop()).then(paths => {
        let fileStats = [];
        paths.forEach(path => {
            fileStats.push(statPromise(path));
        });
        return Promise.all(fileStats);
    }).then(fileStats => {
        fileStats.forEach(fileStat => {
            console.log(`${fileStat.path} is a ${fileStat.kind}`);
            if (fileStat.kind == 'directory') {
                dirToRead.push(fileStat.path);
            }
        });
        while (dirToRead.length != 0) {
            readdirRecursive();
        }
    }).catch(err => {
        console.log(err);
    });
};
