import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function publishAllRecords() {
  try {
    const result = await prisma.failureRecord.updateMany({
      where: { status: 'PENDING_MODERATION' },
      data: { status: 'PUBLISHED' }
    });
    
    console.log(`✅ Updated ${result.count} records to PUBLISHED status`);
    
    const published = await prisma.failureRecord.count({ 
      where: { status: 'PUBLISHED' } 
    });
    console.log(`Total published records: ${published}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

publishAllRecords();
