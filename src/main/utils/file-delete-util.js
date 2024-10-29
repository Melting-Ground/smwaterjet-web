const fs = require('fs').promises;
const Exception = require('@exceptions/exception');

class FileDeleteUtil {
    static async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            throw new Exception('ValueNotFoundException', 'Could not delete the file');
        }
    }
}

module.exports = FileDeleteUtil;
