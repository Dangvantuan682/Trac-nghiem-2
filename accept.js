
// khi đăng nhập
Warnning=function(options){
    var formElement = document.querySelector(options.form);
    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }else{
                element=element.parentElement;
            }
        }
    }
    var selectorRule={};
    function validate(inputElement, rule){
        var errorElement=getParent(inputElement, options.formGroup).querySelector('.warnning');
        var errorMessage;
        var rules =selectorRule[rule.selector];
        for(var i=0;i<rules.length;i++){
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':
                    errorMessage=rules[i](
                        formElement.querySelector(rule.selector+':checked')
                    )
                    // trong các rules[i] là các hàm test nen truyen value vao
                    break;
                default:
                    errorMessage = rules[i](inputElement.value); 
            }
            if(errorMessage) break;
        }
        if(errorMessage){
            errorElement.innerText =errorMessage;
            console.log(errorElement);

        }else{
            errorElement.innerText="";
        }
        return !errorMessage;
    }
    if(formElement){
        // submid
        formElement.onsubmit=function(e){
            e.preventDefault();
            var isformValid = true;
            options.rules.forEach(function(rule){
                var inputElement=formElement.querySelector(rule.selector);
                var isValid=validate(inputElement, rule);
                if(!isValid){
                    isformValid=false;
                }
            })
            if(isformValid){
                if(typeof options.formsubmid ==='function'){
                    var enableInput =formElement.querySelectorAll('[name]:not([disabled])');
                    // console.log(Array.from(enableInput));
                    var formValues = Array.from(enableInput).reduce(function(values,input){
                        switch(input.type)
                        {
                            case 'radio':
                                values[input.name]=formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')){
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])){
                                    values[input.name]=[];
                                }
                                values[input.name].push(input.value);
                                break;
                            default:
                                values[input.name]=input.value;
                                break;
                        }
                        return values;
                  
                    },{})
                    options.formsubmid(formValues);
                }
            }else{

            }
           
        }

        options.rules.forEach(function(rule){
            if(Array.isArray(selectorRule[rule.selector])){
                selectorRule[rule.selector].push(rule.test);
            }else{
                selectorRule[rule.selector]=[rule.test];
            }
            var inputElement=formElement.querySelector(rule.selector);
            if(inputElement){
                inputElement.onblur=function(){
                    validate(inputElement, rule);
                }
                inputElement.oninput=function(){
                    var errorElement=getParent(inputElement, options.formGroup).querySelector('.warnning');
                    errorElement.innerText="";
                }
                inputElement.onchange=function(){
                    validate(inputElement,rule);
                }
            }
        })
    }
}

Warnning.isDefine=function(selector, message){
    return{
        selector: selector,
        test: function(value){
            return value? undefined: message;
        }
    }
}
