const db = require('@configs/knex');
const Inquiry = require("@models/inquiry/inquiry");
const InquiryResDto = require("@dtos/inquiry-dto/inquiry-res-dto");
const InquiryListResDto = require("@dtos/inquiry-dto/inquiry-list-res-dto");
const Exception = require('@exceptions/exception');
const fileDeleteUtil = require('@utils/file-delete-util');
const argon2 = require('argon2');
const createSearchQuery = require('@utils/search-query-builder');

class InquiryService {
    static async getAllInquiries(pagination) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        const totalItemsResult = await db('inquiries').count('id as count').first();
        const totalCount = totalItemsResult.count;

        const inquiries = await db('inquiries').limit(limit).offset(offset);
        const inquiryListResDtos = inquiries.map(inquiry => new InquiryListResDto(inquiry));
        return {
            items: inquiryListResDtos,
            pagination: pagination.getPaginationInfo(totalCount),
        };
    }

    static async getInquiryById(id) {
        const inquiry = await db('inquiries').where({ id }).first();
        if (inquiry == null) {
            throw new Exception('ValueNotFoundException', 'Inquiry is not found');
        }

        const inquiryFiles = await db('inquiry_files').where({ inquiry_id: id });
        return new InquiryResDto(inquiry, inquiryFiles);
    }

    static async searchInquiries(pagination, searchParams) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        let inquiriesQuery = createSearchQuery('inquiries', searchParams);
        const inquiries = await inquiriesQuery.limit(limit).offset(offset);
        const inquiryPublicResDtos = inquiries.map(inquiry => new InquiryPublicResDto(inquiry));

        return inquiryPublicResDtos;
    }

    static async createInquiry(inquiryDto, inquiryFileDto) {
        const hashedPassword = await argon2.hash(inquiryDto.password);
        const filePaths = inquiryFileDto.paths.map(file => file.path);
        const newInquiry = new Inquiry({
            ...inquiryDto,
            password: hashedPassword
        });

        const [insertedId] = await db('inquiries').insert(newInquiry);

        if (inquiryFileDto.isNotEmpty()) {
            const fileInsertPromises = filePaths.map(async (path) => {
                return await db('inquiry_files').insert({
                    inquiry_id: insertedId,
                    file_path: path,
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new InquiryResDto(newInquiry, filePaths);
    }

    static async editInquiry(id, inquiryDto, inquiryFileDto) {
        const inquiry = await db('inquiries').where({ id }).first();
        if (inquiry == null) {
            throw new Exception('ValueNotFoundException', 'Inquiry is not found');
        }

        const filePaths = inquiryFileDto.paths.map(file => file.path);

        const updateInquiry = new Inquiry(inquiryDto);
        await db('inquiries').where({ id }).update(updateInquiry);

        if (inquiryFileDto.isNotEmpty()) {
            const fileInsertPromises = filePaths.map(async (path) => {
                return await db('inquiry_files').insert({
                    inquiry_id: id,
                    file_path: path,
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new InquiryResDto(updateInquiry, filePaths);
    }

    static async deleteInquiry(id) {
        const inquiry = await db('inquiries').where({ id }).first();
        if (inquiry == null) {
            throw new Exception('ValueNotFoundException', 'Inquiry is not found');
        }
        const filePaths = await db('inquiry_files').where({ inquiry_id: id }).select('file_path');

        for (const file of filePaths) {
            try {
                await fileDeleteUtil.deleteFile(file.path);
            } catch (error) {
                console.error(`Failed to delete file at ${file.path}:`, error);
            }
        }
        await db('inquiry_files').where({ inquiry_id: id }).del();
        await db('inquiries').where({ id }).del();
    }

    static async deleteFile(id) {
        const file = await db('inquiry_files').where({ id }).select('file_path').first();
        if (file == null) {
            throw new Exception('ValueNotFoundException', 'InquiryFile is not found');
        }
        const filePath = file.file_path;

        await db('inquiry_files').where({ id }).del();

        await fileDeleteUtil.deleteFile(filePath);
    }
}

module.exports = InquiryService;