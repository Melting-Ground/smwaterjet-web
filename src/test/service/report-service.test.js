const db = require('@configs/knex');
const Report = require('@models/report/report');
const ReportResDto = require('@dtos/report-dto/report-res-dto');
const Exception = require('@exceptions/exceptions');
const ReportService = require('@services/report-service');
const ReportFileDto = require('../../main/dtos/report-dto/report-file-dto');
const fileDeleteUtil = require('@utils/file-delete-util');


jest.mock('@configs/knex');

describe('ReportService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllReports', () => {
        it('전체 실적현황 조회', async () => {
        
        });
    });

    describe('getReportById', () => {
        it('id로 실적현황 조회', async () => {
        
        });

        it('id의 실적현황 없을 경우', async () => {
            
        });
    });

    describe('getReportByYear', () => {
        it('연도로 실적현황 조회', async () => {
          
        });
    });

    describe('createReport', () => {
        it('새로운 실적현황 생성', async () => {
        
        });
    });
});