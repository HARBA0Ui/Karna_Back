import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Models
import User from './models/User.js';
import Bus from './models/Bus.js';
import Stop from './models/Stop.js';
import Post from './models/Post.js';
import CommunityPost from './models/CommunityPost.js';
import LiveLocation from './models/LiveLocation.js';
import PostContent from './models/PostContent.js';
import Report from './models/Report.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Bus.deleteMany({});
        await Stop.deleteMany({});
        await Post.deleteMany({});
        await PostContent.deleteMany({});
        await Report.deleteMany({});
        console.log('Cleared existing data');

        // 1. Create Users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const admin = await User.create({
            nickname: 'Admin',
            email: 'admin@example.com',
            pwd: hashedPassword,
            role: 'admin'  // ✓ Correct
        });

        const user1 = await User.create({
            nickname: 'JohnDoe',
            email: 'john@example.com',
            pwd: hashedPassword,
            role: 'passenger'  // CHANGED from 'user'
        });

        const user2 = await User.create({
            nickname: 'JaneSmith',
            email: 'jane@example.com',
            pwd: hashedPassword,
            role: 'passenger'  // CHANGED from 'user'
        });

        const driver1 = await User.create({
            nickname: 'DriverMike',
            email: 'mike@example.com',
            pwd: hashedPassword,
            role: 'passenger'  // CHANGED from 'user'
        });

        console.log('✓ Users created');

        // 2. Create Buses
        const bus45A = await Bus.create({ number: '45A' });
        const bus12 = await Bus.create({ number: '12' });
        const bus78 = await Bus.create({ number: '78' });
        const busN1 = await Bus.create({ number: 'N1' });

        console.log('✓ Buses created');

        // 3. Create Stops
        const centralStation = await Stop.create({
            name: 'Central Station',
            description: 'Main downtown hub',
            long: 3.3792,
            lat: 6.5244
        });

        const marketSquare = await Stop.create({
            name: 'Market Square',
            description: 'Popular shopping area',
            long: 3.3850,
            lat: 6.5300
        });

        const universityGate = await Stop.create({
            name: 'University Gate',
            description: 'Main entrance to campus',
            long: 3.3920,
            lat: 6.5400
        });

        const airportTerminal = await Stop.create({
            name: 'Airport Terminal',
            description: 'International airport',
            long: 3.4100,
            lat: 6.5500
        });

        const beachFront = await Stop.create({
            name: 'Beach Front',
            description: 'Coastal recreation area',
            long: 3.4200,
            lat: 6.5600
        });

        console.log('✓ Stops created');

        // 4. Create CommunityPosts (with routes/schedules)
        const communityPost1 = await CommunityPost.create({
            type: 'CommunityPost',
            title: 'Bus 45A Morning Express Route',
            description: 'Fast morning route to downtown - avoids traffic',
            status: 'validé',
            author: user1._id,
            bus: bus45A._id,
            upvotes: 15,
            downvotes: 2,
            createdAt: new Date('2025-11-20T08:00:00Z')
        });

        // Add stops to communityPost1
        await PostContent.create([
            {
                post: communityPost1._id,
                stop: centralStation._id,
                time: '07:00',
                order: 1
            },
            {
                post: communityPost1._id,
                stop: marketSquare._id,
                time: '07:15',
                order: 2
            },
            {
                post: communityPost1._id,
                stop: universityGate._id,
                time: '07:30',
                order: 3
            }
        ]);

        const communityPost2 = await CommunityPost.create({
            type: 'CommunityPost',
            title: 'Bus 12 Airport Shuttle',
            description: 'Direct airport connection every hour',
            status: 'validé',
            author: user2._id,
            bus: bus12._id,
            upvotes: 8,
            downvotes: 0,
            createdAt: new Date('2025-11-21T10:00:00Z')
        });

        await PostContent.create([
            {
                post: communityPost2._id,
                stop: centralStation._id,
                time: '06:00',
                order: 1
            },
            {
                post: communityPost2._id,
                stop: airportTerminal._id,
                time: '06:45',
                order: 2
            }
        ]);

        const communityPost3 = await CommunityPost.create({
            type: 'CommunityPost',
            title: 'Bus 78 Beach Route (Weekends)',
            description: 'Weekend beach service with multiple stops',
            status: 'proposé',
            author: user1._id,
            bus: bus78._id,
            upvotes: 3,
            downvotes: 1,
            createdAt: new Date('2025-11-25T14:00:00Z')
        });

        await PostContent.create([
            {
                post: communityPost3._id,
                stop: marketSquare._id,
                time: '09:00',
                order: 1
            },
            {
                post: communityPost3._id,
                stop: universityGate._id,
                time: '09:20',
                order: 2
            },
            {
                post: communityPost3._id,
                stop: beachFront._id,
                time: '09:45',
                order: 3
            }
        ]);

        console.log('✓ CommunityPosts created with stops');

        // 5. Create LiveLocation posts
        const liveLocation1 = await LiveLocation.create({
            type: 'liveLocation',
            name: 'Bus 45A - Near Central',
            description: 'Heading north, light traffic',
            status: 'validé',
            author: driver1._id,
            bus: bus45A._id,
            long: 3.3800,
            lat: 6.5250,
            updatedAt: new Date(),
            createdAt: new Date()
        });

        const liveLocation2 = await LiveLocation.create({
            type: 'liveLocation',
            name: 'Bus 12 - Airport Approach',
            description: 'Arriving at terminal in 10 minutes',
            status: 'validé',
            author: driver1._id,
            bus: bus12._id,
            long: 3.4080,
            lat: 6.5480,
            updatedAt: new Date(),
            createdAt: new Date()
        });

        const liveLocation3 = await LiveLocation.create({
            type: 'liveLocation',
            name: 'Bus N1 - Night Service',
            description: 'Running late due to road closure',
            status: 'validé',
            author: user2._id,
            bus: busN1._id,
            long: 3.3900,
            lat: 6.5350,
            updatedAt: new Date(),
            createdAt: new Date()
        });

        console.log('✓ LiveLocation posts created');

        // 6. Create Reports
        const report1 = await Report.create({
            reporter: user2._id,
            reportedPost: communityPost3._id,
            reason: 'Information incorrecte',
            message: 'Les horaires ne correspondent pas à la réalité',
            status: 'en attente',
            reportType: 'post',
            date: new Date('2025-11-26T10:00:00Z')
        });

        const report2 = await Report.create({
            reporter: user1._id,
            reportedPost: liveLocation3._id,
            reason: 'Position incorrecte',
            message: 'Le bus est beaucoup plus loin que montré',
            status: 'validé',
            reportType: 'location',
            date: new Date('2025-11-27T15:30:00Z')
        });

        const report3 = await Report.create({
            reporter: user2._id,
            reportedPost: communityPost1._id,
            reason: 'Contenu inapproprié',
            message: 'Description manque de détails',
            status: 'rejeté',
            reportType: 'post',
            date: new Date('2025-11-22T12:00:00Z')
        });

        console.log('✓ Reports created');

        console.log('\n=== SEED SUMMARY ===');
        console.log(`Users: ${await User.countDocuments()}`);
        console.log(`Buses: ${await Bus.countDocuments()}`);
        console.log(`Stops: ${await Stop.countDocuments()}`);
        console.log(`Posts (total): ${await Post.countDocuments()}`);
        console.log(`  - CommunityPosts: 3`);
        console.log(`  - LiveLocations: 3`);
        console.log(`PostContents: ${await PostContent.countDocuments()}`);
        console.log(`Reports: ${await Report.countDocuments()}`);
        console.log('\n✓ Database seeded successfully!');

        console.log('\n=== TEST CREDENTIALS ===');
        console.log('Admin: admin@example.com / password123');
        console.log('User1: john@example.com / password123');
        console.log('User2: jane@example.com / password123');
        console.log('Driver: mike@example.com / password123');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    }
};

seedDatabase();
