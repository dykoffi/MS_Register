const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: [{ level: 'query', emit: 'event' }],
})

module.exports = prisma