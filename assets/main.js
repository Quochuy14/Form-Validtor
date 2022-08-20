
Validator({
    form: '#form-1',
    erorrSelector:'.form-message',
    formGroupSelector: '.form-group',
    rules:[
        Validator.isRequired('#fullname',"Vui lòng nhập tên đầy đủ"),
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        Validator.isRequired('#password'),
        Validator.isRequired('input[name="gender"]', "Vui lòng chọn giới tính"),
        Validator.isRequired('#province'),
        Validator.minLength('#password',6),
        Validator.isRequired('#password_confirmation'),
        Validator.confirmed('#password_confirmation', function(){
            return document.querySelector('#form-1 #password').value;
        }, "Mật khẩu nhập lại không chính xác")
    ],

    onSubmit: function(data){
        console.log(data)
    }
});
