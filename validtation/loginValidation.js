const Joi=require('joi');

function Validate(obj){
    const schema=Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(5).required()
    })

const {error}=schema.validate(obj)
return error
}


module.exports=Validate;