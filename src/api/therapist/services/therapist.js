'use strict';

/**
 * therapist service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::therapist.therapist');
