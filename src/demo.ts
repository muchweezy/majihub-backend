import { eq } from 'drizzle-orm';
import { db } from './db';
import { demoUsers } from './db/schema';

async function main() {
    try {
        console.log('🚀 Starting CRUD operations demo...\n');

        // CREATE: Insert a new user
        console.log('📝 CREATE: Inserting a new user...');
        const [newUser] = await db
            .insert(demoUsers)
            .values({ name: 'Admin User', email: 'admin2@example.com' })
            .returning();

        if (!newUser) {
            throw new Error('Failed to create user');
        }

        console.log('✅ CREATE successful:', newUser);
        console.log('   ID:', newUser.id);
        console.log('   Name:', newUser.name);
        console.log('   Email:', newUser.email);
        console.log('   Created At:', newUser.createdAt);

        // READ: Select the user
        console.log('\n📖 READ: Fetching the user...');
        const foundUsers = await db
            .select()
            .from(demoUsers)
            .where(eq(demoUsers.id, newUser.id));

        if (foundUsers.length === 0) {
            throw new Error('User not found after creation');
        }

        console.log('✅ READ successful:', foundUsers[0]);

        // UPDATE: Change the user's name
        console.log('\n✏️  UPDATE: Updating user name...');
        const [updatedUser] = await db
            .update(demoUsers)
            .set({ name: 'Super Admin' })
            .where(eq(demoUsers.id, newUser.id))
            .returning();

        if (!updatedUser) {
            throw new Error('Failed to update user');
        }

        console.log('✅ UPDATE successful:', updatedUser);
        console.log('   Previous name: Admin User');
        console.log('   New name:', updatedUser.name);

        // DELETE: Remove the user
        console.log('\n🗑️  DELETE: Removing the user...');
        await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
        console.log('✅ DELETE successful: User removed from database');

        // Verify deletion
        const verifyDelete = await db
            .select()
            .from(demoUsers)
            .where(eq(demoUsers.id, newUser.id));

        if (verifyDelete.length === 0) {
            console.log('✅ Verification: User no longer exists in database');
        }

        console.log('\n🎉 CRUD operations completed successfully!');
    } catch (error) {
        console.error('❌ Error performing CRUD operations:', error);
        process.exit(1);
    }
}

main();

