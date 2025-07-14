import Joi from 'joi';

export const UserSchema = Joi.object({
  full_name: Joi.string().max(100).required().messages({
    'string.base': 'Full name must be a string',
    'string.empty': 'Full name is required',
    'string.max': 'Full name must not exceed 100 characters',
    'any.required': 'Full name is required',
  }),

  email: Joi.string().email().max(150).required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'string.max': 'Email must not exceed 150 characters',
    'any.required': 'Email is required',
  }),

  password: Joi.alternatives().conditional('oauth_provider', {
    is: Joi.exist(),
    then: Joi.string().optional(),
    otherwise: Joi.string().min(6).max(255).required(),
  }).messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must not exceed 255 characters',
    'any.required': 'Password is required unless using OAuth',
  }),

  is_verified: Joi.boolean().default(true).messages({
    'boolean.base': 'is_verified must be a boolean',
    'any.default': 'is_verified defaults to true if not provided',
  }),

  oauth_provider: Joi.string().valid('google', 'facebook', 'github').optional().messages({
    'string.base': 'OAuth provider must be a string',
    'any.only': 'OAuth provider must be one of: google, facebook, github',
    'any.optional': 'OAuth provider is optional',
  }),

  oauth_id: Joi.string().max(255).optional().messages({
    'string.base': 'OAuth ID must be a string',
    'string.max': 'OAuth ID must not exceed 255 characters',
    'any.optional': 'OAuth ID is optional',
  }),

  role_id: Joi.number().required().messages({
    'number.base': 'Role ID must be a number',
    'number.empty': 'Role ID is required',
    'any.required': 'Role ID is required',
  }),

  sellerData: Joi.when('role_id', {
    is: 2,
    then: Joi.object({
      store_name: Joi.string().max(150).required().messages({
        'string.base': 'Store name must be a string',
        'string.empty': 'Store name is required',
        'string.max': 'Store name must not exceed 150 characters',
        'any.required': 'Store name is required for role_id 2',
      }),
      store_description: Joi.string().optional().allow(null).messages({
        'string.base': 'store_description must be a string',
      }),
      gst_number: Joi.string().max(20).optional().messages({
        'string.base': 'GST number must be a string',
        'string.max': 'GST number must not exceed 20 characters',
      }),
      address: Joi.string().required().messages({
        'string.base': 'Address must be a string',
        'string.empty': 'Address is required',
        'any.required': 'Address is required for role_id 2',
      }),
    }).required().messages({
      'object.base': 'Seller data must be an object',
      'any.required': 'Seller data is required for role_id 2',
    }),
    otherwise: Joi.forbidden(),
  }),

  status: Joi.string().valid('pending', 'active', 'rejected').default('pending').messages({
    'string.base': 'Status must be a string',
    'any.only': 'Status must be one of: pending, active, rejected',
    'any.default': 'Status defaults to pending if not provided',
  }),
});
