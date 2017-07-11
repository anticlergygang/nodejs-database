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
                    // reject('path kind error');
                }
                resolve(pathInfo);
            }
        });
    });
};
const walkDir = (dir, checkWalk = false, directoriesLeft = []) => {
    readdirPromise(dir).then(dirPaths => {
        dirPaths.forEach(pathInfo => {
            if (pathInfo.kind == 'directory') {
                console.log(`Found directory '${pathInfo.path}'.`)
                directoriesLeft.push(pathInfo.path);
            } else if (pathInfo.kind == 'file') {
                console.log(`Found file '${pathInfo.path}' of type '${pathInfo.type}'.`)
            } else {}
        });
        if (directoriesLeft.length > 0) {
            let newDir = directoriesLeft.pop();
            if (directoriesLeft.length == 0) {
                walkDir(newDir, true, directoriesLeft);
            } else {
                walkDir(newDir, false, directoriesLeft);
            }
        } else if (directoriesLeft.length == 0 && checkWalk == true) {
            console.log('done');
        }
    }).catch(err => {
        console.log(err);
    });
};
