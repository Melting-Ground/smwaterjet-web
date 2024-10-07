const fs = require('fs').promises;
const path = require('path');
const Exception = require('@exceptions/exceptions');

class FolderDeleteUtil {
    static async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            throw new Exception('ValueNotFoundException', 'Could not delete the file');
        }
    }
    static async deleteDirectory(dirPath) {
        try {
            let stack = [dirPath]; 

            while (stack.length > 0) {
                const currentPath = stack.pop();
                const files = await fs.readdir(currentPath); 

                for (const file of files) {
                    const filePath = path.join(currentPath, file);
                    const stats = await fs.stat(filePath); 

                    if (stats.isDirectory()) {
                        stack.push(filePath);
                    } else {
                        await FileDeleteUtil.deleteFile(filePath);
                    }
                }
                await fs.rmdir(currentPath);
            }
        } catch (err) {
            throw new Exception('ValueNotFoundException', 'Could not delete the directory or its contents');
        }
    }
}

module.exports = FolderDeleteUtil;