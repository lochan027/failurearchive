import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeDuplicates() {
  try {
    // Find all submissions grouped by title
    const allSubmissions = await prisma.failureRecord.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by title to find duplicates
    const titleMap = new Map<string, Array<{ id: string; createdAt: Date }>>();
    
    for (const submission of allSubmissions) {
      const existing = titleMap.get(submission.title) || [];
      existing.push({ id: submission.id, createdAt: submission.createdAt });
      titleMap.set(submission.title, existing);
    }

    // Find duplicates (titles with more than one entry)
    const duplicates = Array.from(titleMap.entries())
      .filter(([_, entries]) => entries.length > 1);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }

    console.log(`\n🔍 Found ${duplicates.length} titles with duplicates:\n`);

    let totalDeleted = 0;

    for (const [title, entries] of duplicates) {
      // Keep the oldest one, delete the rest
      const [keep, ...toDelete] = entries;
      
      console.log(`📝 "${title}"`);
      console.log(`   Keeping: ${keep.id} (${keep.createdAt.toISOString()})`);
      console.log(`   Deleting ${toDelete.length} duplicate(s)...`);

      // Delete the duplicates
      for (const duplicate of toDelete) {
        await prisma.failureRecord.delete({
          where: { id: duplicate.id }
        });
        totalDeleted++;
      }
    }

    console.log(`\n✅ Removed ${totalDeleted} duplicate submissions!`);
    
    const remaining = await prisma.failureRecord.count();
    console.log(`📊 Total submissions remaining: ${remaining}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicates();
