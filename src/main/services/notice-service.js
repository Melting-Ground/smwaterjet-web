const db = require('@configs/knex');
const NoticeResDto = require('@dtos/notice-dto/notice-res-dto');
const Notice = require('@models/notice/notice');
const Exception = require('@exceptions/exception');
const fileDeleteUtil = require('@utils/file-delete-util');
const createSearchQuery = require('@utils/search-query-builder');

class NoticeService {
    static async getAllNotices(pagination) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        const notices = await db('notices').limit(limit).offset(offset);
        const noticeResDtos = notices.map(notice => new NoticeResDto(notice));
        return noticeResDtos;
    }

    static async getNoticeById(id) {
        const notice = await db('notices').where({ id }).first();
        if (notice == null) {
            throw new Exception('ValueNotFoundException', 'Notice is not found');
        }

        const noticeFiles = await db('notice_files').where({ notice_id: id });
        return new NoticeResDto(notice, noticeFiles);
    }

    static async searchNotices(pagination, searchParams) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        let noticesQuery = createSearchQuery('notices', searchParams);
        const notices = await noticesQuery.limit(limit).offset(offset);
        const noticeResDtos = notices.map(notice => new NoticeResDto(notice));

        return noticeResDtos;
    }

    static async createNotice(noticeDto, noticeFileDto) {
        const newNotice = new Notice(noticeDto);
        const filePaths = noticeFileDto.paths.map(file => file.path);
        const [insertedId] = await db('notices').insert(newNotice);

        if (noticeFileDto.isNotEmpty()) {
            const fileInsertPromises = filePaths.map(async (path) => {
                return await db('notice_files').insert({
                    notice_id: insertedId,
                    file_path: path,
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new NoticeResDto(newNotice, filePaths);
    }

    static async editNotice(id, noticeDto, noticeFileDto) {
        const notice = await db('notices').where({ id }).first();
        const filePaths = noticeFileDto.paths.map(file => file.path);
        const updateNotice = new Notice(noticeDto);

        if (notice == null) {
            throw new Exception('ValueNotFoundException', 'Notice is not found');
        }
        await db('notices').where({ id }).update(updateNotice);

        if (noticeFileDto.isNotEmpty()) {
            const fileInsertPromises = filePaths.map(async (path) => {
                return await db('notice_files').insert({
                    notice_id: id,
                    file_path: path,
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new NoticeResDto(updateNotice, filePaths);
    }

    static async deleteNotice(id) {
        const notice = await db('notices').where({ id }).first();
        if (notice == null) {
            throw new Exception('ValueNotFoundException', 'Notice is not found');
        }
        const filePaths = await db('notice_files').where({ notice_id: id }).select('file_path');

        for (const file of filePaths) {
            try {
                await fileDeleteUtil.deleteFile(file.path);
            } catch (error) {
                console.error(`Failed to delete file at ${file.path}:`, error);
            }
        }
        await db('notice_files').where({ notice_id: id }).del();
        await db('notices').where({ id }).del();
    }

    static async deleteFile(id) {
        const file = await db('notice_files').where({ id }).select('file_path').first();
        if (file == null) {
            throw new Exception('ValueNotFoundException', 'NoticeFile is not found');
        }
        const filePath = file.file_path;

        await db('notice_files').where({ id }).del();

        await fileDeleteUtil.deleteFile(filePath);
    }
}

module.exports = NoticeService;