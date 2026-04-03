const j = require("joi");
const { email } = require("zod");

const studentvalidation= j.object({
   id: j.number().required(),
   name: j.string().min(3).required(),
   age: j.min(18).max(30).required(),
   course:j.string().valid("FY MCA","FY MBA", "SY MBA")
   .required(),
   email:j.string().email({minDomainSegments:2})
   .required()
})

module.exports=  studentvalidation;