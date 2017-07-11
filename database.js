const fs = require('fs');
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
        fs.readdir(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};
const statPromise = path => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                stats.filename = path;
                resolve(stats);
            }
        });
    });
};
const getPathsFileStats = path => {
    readdirPromise(path).then(files => {
        let fileStatPromiseArray = [];
        files.forEach(file => {
            fileStatPromiseArray.push(statPromise(`${path}/${file}`));
        });
        return Promise.all(fileStatPromiseArray);
    }).then(stats => {
        stats.forEach(stat => {
            if (stat.isFile()) {
                console.log(`${stat.filename} is a file.`)
            } else if (stat.isDirectory()) {
                console.log(`${stat.filename} is a directory.`)
            } else {
                console.log(`${stat.filename} is weird.`)
            }
        });
    }).catch(err => {
        console.log(err);
    });
};
