const fs = require('fs');
const mime = require('mime-types');
const readdirPromise = pathRoot => {
    return new Promise((resolve, reject) => {
        fs.readdir(pathRoot, (err, dirPaths) => {
            if (err) {
                reject(err);
            } else {
                let statPromises = [];
                dirPaths.forEach(path => {
                    statPromises.push(statPromise(pathRoot, path));
                });
                Promise.all(statPromises).then(dirPathsStats => {
                    resolve(dirPathsStats);
                }).catch(err => {
                    reject(err);
                });
            }
        });
    });
};
const statPromise = (pathRoot, path) => {
    return new Promise((resolve, reject) => {
        var pathInfo = {}
        fs.stat(`${pathRoot}/${path}`, (err, pathStats) => {
            if (err) {
                reject(err);
            } else {
                if (pathStats.isFile()) {
                    pathInfo = {
                        'path': `${pathRoot}/${path}`,
                        'kind': 'file',
                        'type': mime.lookup(path)
                    }
                } else if (pathStats.isDirectory()) {
                    pathInfo = {
                        'path': `${pathRoot}/${path}`,
                        'kind': 'directory'
                    }
                } else {
                    reject('file kind error');
                }
                resolve(pathInfo);
            }
        });
    });
};
let directoriesLeft = [];
const walkDir = (dir) => {
    readdirPromise(dir).then(dirPaths => {
        dirPaths.forEach(pathInfo => {
            if (pathInfo.kind == 'directory') {
                console.log(`Found directory '${pathInfo.path}'.`)
                directoriesLeft.push(pathInfo.path);
            } else {
                console.log(`Found file '${pathInfo.path}' of type ${pathInfo.type}.`)
            }
        });
        while (directoriesLeft.length > 0) {
            walkDir(directoriesLeft.pop());
        }
    }).catch(err => {
        console.log(err);
    });
};
walkDir('database');
