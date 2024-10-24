const request = require('supertest');
const express = require('express');
const { loginAdmin } = require('@controllers/admin-controller');
const AdminService = require('@services/admin-service');

const app = express();
app.use(express.json());
app.post('/admin/login', loginAdmin);

describe('POST /admin/login', () => {
	it('로그인 성공시 Jwt 토큰 반환', async () => {
		const mockToken = 'mockJwtToken';
		const mockLoginAdmin = jest.spyOn(AdminService, 'loginAdmin').mockResolvedValue(mockToken);

		const loginData = {
			phoneNumber: '010123345678',
			password: 'adminPassword',
		};

		const response = await request(app)
			.post('/admin/login')
			.send(loginData);

		expect(response.statusCode).toBe(200);
		expect(response.body).toBe(mockToken);
		expect(mockLoginAdmin).toHaveBeenCalledWith(expect.any(Object));
	});

	it('잘못된 로그인 데이터 입력시 에러 발생', async () => {
		const mockError = new Error('AuthenticationException');
		jest.spyOn(AdminService, 'loginAdmin').mockRejectedValue(mockError);
	
		const loginData = {
			phoneNumber: '010123345678',
			password: 'WrongAdminPassword',
		};
	
		const response = await request(app)
			.post('/admin/login')
			.send(loginData);
	
		expect(response.statusCode).toBe(500);
	});
});