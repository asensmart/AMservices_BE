const parseFileURL = (req, expectedObjects = []) => {
    const files = req.files;
    const response = {};
    expectedObjects.map(item => {
        response[item] = req.protocol + '://' + req.get('host') + '/' + files[item][0].destination + '/' + files[item][0].filename;
    })
    return response;
}

const getFilePathFromURL = (URL) => {
    return URL.split('/').filter((item, i) => i !== 0 && i !== 1 && i !== 2).join('/')
}

module.exports = {
    parseFileURL,
    getFilePathFromURL
}