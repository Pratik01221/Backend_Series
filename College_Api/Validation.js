const joi = require('joi');

const validateSchema= new joi.object({
    id: joi.number().required(),
    name: joi.string().required().min(3),
    age: joi.number().required().min(18).max(30),
    course: joi.string().valid("FY MCA", "SY MCA", "FY MBA", "SY MBA").required(),
    email: joi.string().email({minDomainSegments:2}).required()
})


const ValidateSchema={validateSchema};