import prisma from "../utils/client";

async function main() {
    // Seed adminUser
    const adminUser = await prisma.adminUser.create({
        data: {
            clerkId: "clerk123",
            email: "admin@example.com",
            name: "Admin User 1"
        }
    });

    // Seed emailBlast
    const emailBlast = await prisma.emailBlast.create({
        data: {
            name: "Welcome to our service!",
            body: "This is the first email blast.",
            createdAt: new Date(),
            adminUserId: adminUser.id
        }
    });

    // Seed mailingList
    const mailingList = await prisma.mailingList.create({
        data: {
            name: "Main List",
            createdAt: new Date()
        }
    });

    // Seed recipients
    const recipient1 = await prisma.recipient.create({
        data: {
            email: "user@example.com",
            name: "John Doe"
        },
    });

    const recipient2 = await prisma.recipient.create({
        data: {
            email: "user2@example.com",
            name: "Jane Smith"
        }
    });

    // Seed recipientToMailingList
    await prisma.recipientToMailingList.createMany({
        data: [{
            recipientId: recipient1.id,
            mailingListId: mailingList.id
        },
        {
            recipientId: recipient2.id,
            mailingListId: mailingList.id
        }]
    });

     // Seed emailBlastToMailingList
    await prisma.emailBlastToMailingList.create({
        data: {
            emailBlastId: emailBlast.id,
            mailingListId: mailingList.id
        }
     });

    console.log("Seeding completed.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });