describe('Task API Routes', function() {

    describe('POST /login', function() {
        it('user receives status OK', function(done) {
            request.post('/login')
                .send({
                    email: "linxiaroan2018@gmail.com",
                    password: "Lx860210!"
                })
                .expect(200)
                .end(function (err, res) {
                    done(err);
                })
        });
    });

    // describe('POST /postproject', function() {
    //     it('user receives status OK', function(done) {
    //         request.post('/post')
    //             .send({
    //                 email: "linxiaroan2018@gmail.com",
    //                 password: "Lx860210!"
    //             })
    //             .expect(200)
    //             .end(function (err, res) {
    //                 done(err);
    //             })
    //     });
    // });

});