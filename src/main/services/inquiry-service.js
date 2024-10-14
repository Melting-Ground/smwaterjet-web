const db = require('@configs/knex');
const Inquiry = require("@models/inquiry/inquiry");
const InquiryResDto = require("@dtos/inquiry-dto/inquiry-res-dto");
const Exception = require('@exceptions/exceptions');
const fileDeleteUtil = require('@utils/file-delete-util');
const argon2 = require('argon2');

class InquiryService {
    static async getAllInquiries(page, limit) {
        const offset = (page - 1) * limit;
        const inquiries = await db('inquiries').limit(limit).offset(offset);
        const inquiryResDtos = inquiries.map(cert => new InquiryResDto(cert));
        return inquiryResDtos;
    }

    static async getInquiryById(id) {
        const inquiry = await db('inquiries').where({ id }).first();
        if (inquiry == null) {
            throw new Exception('ValueNotFoundException', 'Inquiry is not found');
        }

        const inquiryFiles = await db('inquiry_files').where({ inquiry_id: id });
        return new InquiryResDto(inquiry, inquiryFiles);
    }

    static async createInquiry(inquiryDto, inquiryFileDto) {
        const hashedPassword = await argon2.hash(inquiryDto.password);
        const newInquiry = new Inquiry({
            ...inquiryDto,
            password: hashedPassword

        });
        
        const result = await db('inquiries').insert(newInquiry);
        const insertedId = result[0];

        if (inquiryFileDto.isNotEmpty()) {
            const fileInsertPromises = inquiryFileDto.paths.map(async (path) => {
                return await db('inquiry_files').insert({
                    inquiry_id: insertedId,
                    path: path,
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new InquiryResDto(newInquiry);
    }

    static async editInquiry(id, inquiryDto, inquiryFileDto) {
        const inquiry = await db('inquiries').where({ id }).first();
        const updateInquiry = new Inquiry(inquiryDto);
        if (!inquiry) {
            throw new Exception('ValueNotFoundException', 'Inquiry is not found');
        }
        await db('inquiries').where({ id }).update(updateInquiry);

        if (inquiryFileDto.isNotEmpty()) {
            const fileInsertPromises = inquiryFileDto.paths.map(async (path) => {
                return await db('inquiry_files').insert({
                    inquiry_id: id,
                    path: path,
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new InquiryResDto(updateInquiry);
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
        try {
            const file = await db('inquiry_files').where({ id }).select('file_path').first();
            if (!file) {
                throw new Exception('ValueNotFoundException', 'InquiryFile is not found');
            }
            const filePath = file.file_path; 

            await db('inquiry_files').where({ id }).del();

            await fileDeleteUtil.deleteFile(filePath);

        } catch (error) {
            console.error(`Failed to delete file:`, error); 
        }
    }
}

module.exports = InquiryService;