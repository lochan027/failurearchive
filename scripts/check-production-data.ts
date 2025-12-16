import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    const total = await prisma.failureRecord.count();
    console.log('Total failure records:', total);
    
    const published = await prisma.failureRecord.count({ 
      where: { status: 'PUBLISHED' } 
    });
    console.log('Published records:', published);
    
    const samples = await prisma.failureRecord.findMany({
      take: 3,
      select: { id: true, title: true, status: true }
    });
    console.log('\nSample records:');
    samples.forEach(s => console.log(`- [${s.status}] ${s.title}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
