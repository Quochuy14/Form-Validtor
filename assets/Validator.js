// Đối tượng Validator
function Validator(options){

    var selectorRules = {}

    function validate(inputElement, rule){
        
        const elementParent = inputElement.closest(options.formGroupSelector)
        const errorElement = elementParent.querySelector(options.erorrSelector)
        var errorMessage;
        // Lấy ra các rules của chính selector
        var rules = selectorRules[rule.selector]

        // Lập qua từng rule và kiểm tra
        // Nếu có lỗi dừng việc kiểm tra
        for(var i = 0; i<rules.length; i++){
            switch(inputElement.type){
                case "checkbox":
                case "radio":
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;

                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if(errorMessage) break;
        }

        if(errorMessage){
            elementParent.classList.add('invalid')
            errorElement.innerHTML = errorMessage
        }else{
            elementParent.classList.remove('invalid')
            errorElement.innerHTML = ''
        }      
        
        return errorMessage;
    }

    // Xử lý element của form cần validate
    var formElement = document.querySelector(options.form)

    if(formElement){
        // Bỏ hành động mặc định của nút submit
        formElement.onsubmit = function(e){
            e.preventDefault()

            var isFormValid = true;

            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector)

                var isValid =  validate(inputElement, rule)
                if(isValid){ 
                    isFormValid = false
                }
            });

            

            if(isFormValid){
                if(typeof options.onSubmit == 'function'){
                    var enableInput = formElement.querySelectorAll('[name]:not([disable])')
                    var formValues = Array.from(enableInput).reduce(function(values,input){
                        
                        switch(input.type){
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;

                            case 'checkbox':
                                if(!input.matches(':checked')){
                                    values[input.name] = [];
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }    
                                    values[input.name].push(input.value)
                                break;

                                case 'file':
                                    values[input.name] = input.files
                                    break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values
                    }, {})

                    options.onSubmit(formValues)
                }
            }
        }


        // Lặp qua từng rule và xử lý
        options.rules.forEach((rule) => {
            // Lưu lại các rule cho mỗi input
            
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }


            var inputElements = formElement.querySelectorAll(rule.selector)

            Array.from(inputElements).forEach(function(inputElement){
                if(inputElement){
                // Xử lý trường hợp blur ra khỏi input
                inputElement.onblur = function(){
                    validate(inputElement, rule)
                }

                // Xử lý khi người dùng nhập vào iuput
                inputElement.oninput = function(){
                    const elementParent = inputElement.closest(options.formGroupSelector)
                    const errorElement = elementParent.querySelector(options.erorrSelector)
                    elementParent.classList.remove('invalid')
                    errorElement.innerHTML = ''
                }
            }
            })
        })
    }
}

// Định nghĩa các Rule
Validator.isRequired = function(selector, message){
    return {
        selector,
        test: function(value){
            return value ? undefined : message|| "Vui lòng nhập trường này"
        }
    }
}

Validator.isEmail = function(selector, message){
    return {
        selector,
        test: function(value){
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message|| "Trường này phải là Email"
        }
    }
}

Validator.minLength = function(selector, min, message){
    return {
        selector,
        test: function(value){
            return value.length >= min ? undefined : message|| `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.confirmed = function(selector, getConfirdValue,message){
    return {
        selector,
        test: function(value){
            return value === getConfirdValue() ? undefined : message|| "Giá trị nhập vào không chính xác"
        }
    }
}


