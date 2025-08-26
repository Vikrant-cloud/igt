import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({
            'any.only': '{{#label}} does not match password',
        }),
    role: Joi.string().valid('teacher', 'student').required(),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});

export const contentSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    subject: Joi.string().min(3).max(30).required(),
    media: Joi.array().items(Joi.string().uri()).min(1).required(),
    description: Joi.string().required(),
    createdBy: Joi.string().required(),
    price: Joi.string().required()
})