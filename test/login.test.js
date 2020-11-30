
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = 'http://localhost:5000'
let expect = chai.expect
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Chức năng đăng nhập', () => {
    /*
     * Test phương thức đăng nhập
     */
    describe('/POST login', () => {
        //test dang nhap dung
        it('Test dang nhap thanh cong', (done) => {
            const email = "nguyenphucnha0111@gmail.com"
            const password = "123456"
            const user = {
                email: email, password: password
            }
            chai.request(server)
                .post('/users/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body).have.property('user');
                    expect(res.body).have.property('message');
                    expect(res.body.message).be.eql('Đăng nhập thành công.');

                    done();
                });
        });
        // Test dang nhap sai mat khau
        it('Test dang nhap khi mat khau sai', (done) => {
            let user = {
                email: "nguyenphucnha0111@gmail.com",
                password: "matkhausai"
            };
            chai.request(server)
                .post('/users/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    expect(res.body).have.property('message');
                    expect(res.body.message).be.eql('Mật khẩu hoặc email không chính xác!');
                    done();
                });
        });

        //Test voi email chua duoc tao
        it('Test dang nhap khi dang nhap voi email chua duoc tao', (done) => {
            let user = {
                email: "emailtest@gmail.com",
                password: "matkhau"
            };
            chai.request(server)
                .post('/users/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    expect(res.body).have.property('message');
                    expect(res.body.message).be.eql('Email này chưa được tạo!');
                    done();
                });
        });
    });
});
