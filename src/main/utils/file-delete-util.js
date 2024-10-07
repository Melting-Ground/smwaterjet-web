const fs = require('fs').promises;
const Exception = require('@exceptions/exceptions');

class FileDeleteUtil {
    static async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            throw new Exception('ValueNotFoundException', 'Could not delete the file');
        }
    }
}

module.exports = FileDeleteUtil;
