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
    console.log('✓ MongoDB Connected (Compass) for seeding...\n');

    // Clear existing data
    await User.deleteMany({});
    await Bus.deleteMany({});
    await Stop.deleteMany({});
    await Post.deleteMany({});
    await PostContent.deleteMany({});
    await Report.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // 1. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await User.create({
      nickname: 'Admin',
      email: 'admin@example.com',
      pwd: hashedPassword,
      role: 'admin'
    });

    const user1 = await User.create({
      nickname: 'JohnDoe',
      email: 'john@example.com',
      pwd: hashedPassword,
      role: 'passenger'
    });

    const user2 = await User.create({
      nickname: 'JaneSmith',
      email: 'jane@example.com',
      pwd: hashedPassword,
      role: 'passenger'
    });

    const driver1 = await User.create({
      nickname: 'DriverMike',
      email: 'mike@example.com',
      pwd: hashedPassword,
      role: 'passenger'
    });

    console.log('✓ Users created');
    console.log(`  - Admin: ${admin.email}`);
    console.log(`  - User1: ${user1.email}`);
    console.log(`  - User2: ${user2.email}`);
    console.log(`  - Driver: ${driver1.email}\n`);

    // 2. Create Buses (validates with busValidator)
    const bus45A = await Bus.create({ number: 'BUS45A' });
    const bus12 = await Bus.create({ number: 'BUS12' });
    const bus78 = await Bus.create({ number: 'BUS78' });
    const busN1 = await Bus.create({ number: 'BUSN1' });

    console.log('✓ Buses created');
    console.log(`  - ${bus45A.number}`);
    console.log(`  - ${bus12.number}`);
    console.log(`  - ${bus78.number}`);
    console.log(`  - ${busN1.number}\n`);

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
    console.log(`  - ${centralStation.name}`);
    console.log(`  - ${marketSquare.name}`);
    console.log(`  - ${universityGate.name}`);
    console.log(`  - ${airportTerminal.name}`);
    console.log(`  - ${beachFront.name}\n`);

    // 4. Create CommunityPosts (validates with postValidator)
    const communityPost1 = await CommunityPost.create({
      type: 'CommunityPost',
      title: 'Bus 45A Morning Express Route',
      description: 'Fast morning route to downtown - avoids traffic during rush hour',
      status: 'validé',
      author: user1._id,
      bus: bus45A._id,
      upvotes: 15,
      downvotes: 2,
      upvoters: [user1._id, user2._id, driver1._id],
      downvoters: [],
      createdAt: new Date('2025-11-20T08:00:00Z')
    });

    // Add stops to communityPost1 (validates with postValidator)
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
      description: 'Direct airport connection every hour with comfortable seating',
      status: 'validé',
      author: user2._id,
      bus: bus12._id,
      upvotes: 8,
      downvotes: 0,
      upvoters: [user1._id, user2._id],
      downvoters: [],
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
      description: 'Weekend beach service with multiple stops along the coast',
      status: 'proposé',
      author: user1._id,
      bus: bus78._id,
      upvotes: 3,
      downvotes: 1,
      upvoters: [user2._id, driver1._id],
      downvoters: [admin._id],
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

    console.log('✓ CommunityPosts created (with validator checks)');
    console.log(`  - Post 1: ${communityPost1.title}`);
    console.log(`  - Post 2: ${communityPost2.title}`);
    console.log(`  - Post 3: ${communityPost3.title} (status: proposé)\n`);

    // 5. Create LiveLocation posts (validates with postValidator - lat/long validation)
    //  TITLE = BUS NUMBER (auto-generated)
    const liveLocation1 = await LiveLocation.create({
      type: 'liveLocation',
      title: bus45A.number,
      name: 'Bus 45A - Near Central',
      description: 'Heading north, light traffic',
      status: 'validé',
      author: driver1._id,
      bus: bus45A._id,
      long: 3.3800,
      lat: 6.5250,
      upvotes: 0,
      downvotes: 0,
      upvoters: [],
      downvoters: [],
      updatedAt: new Date(),
      createdAt: new Date()
    });

    const liveLocation2 = await LiveLocation.create({
      type: 'liveLocation',
      title: bus12.number,
      name: 'Bus 12 - Airport Approach',
      description: 'Arriving at terminal in 10 minutes',
      status: 'validé',
      author: driver1._id,
      bus: bus12._id,
      long: 3.4080,
      lat: 6.5480,
      upvotes: 0,
      downvotes: 0,
      upvoters: [],
      downvoters: [],
      updatedAt: new Date(),
      createdAt: new Date()
    });

    const liveLocation3 = await LiveLocation.create({
      type: 'liveLocation',
      title: busN1.number,
      name: 'Bus N1 - Night Service',
      description: 'Running late due to road closure',
      status: 'validé',
      author: user2._id,
      bus: busN1._id,
      long: 3.3900,
      lat: 6.5350,
      upvotes: 0,
      downvotes: 0,
      upvoters: [],
      downvoters: [],
      updatedAt: new Date(),
      createdAt: new Date()
    });

    console.log('✓ LiveLocation posts created (title = bus number)');
    console.log(`  - Live 1: ${liveLocation1.title}`);
    console.log(`  - Live 2: ${liveLocation2.title}`);
    console.log(`  - Live 3: ${liveLocation3.title}\n`);

    // 6. Create Reports (validates with reportValidator)
    const report1 = await Report.create({
      reporter: user2._id,
      reportedPost: communityPost3._id,
      reason: 'Information incorrecte sur les horaires',
      message: 'Les horaires ne correspondent pas à la réalité du terrain',
      status: 'en attente',
      reportType: 'post',
      date: new Date('2025-11-26T10:00:00Z')
    });

    const report2 = await Report.create({
      reporter: user1._id,
      reportedPost: liveLocation3._id,
      reason: 'Position GPS incorrecte',
      message: 'Le bus est beaucoup plus loin que montré sur la carte',
      status: 'validé',
      reportType: 'location',
      date: new Date('2025-11-27T15:30:00Z')
    });

    const report3 = await Report.create({
      reporter: user2._id,
      reportedPost: communityPost1._id,
      reason: 'Contenu manquant de détails',
      message: 'Description manque de précisions sur les arrêts intermédiaires',
      status: 'rejeté',
      reportType: 'post',
      date: new Date('2025-11-22T12:00:00Z')
    });

    console.log('✓ Reports created (with validator checks)');
    console.log(`  - Report 1: ${report1.reason} (status: en attente)`);
    console.log(`  - Report 2: ${report2.reason} (status: validé)`);
    console.log(`  - Report 3: ${report3.reason} (status: rejeté)\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('     ✓ SEED SUMMARY (MongoDB Compass)');
    console.log('═══════════════════════════════════════');
    console.log(`Users:        ${await User.countDocuments()}`);
    console.log(`Buses:        ${await Bus.countDocuments()}`);
    console.log(`Stops:        ${await Stop.countDocuments()}`);
    console.log(`Posts:        ${await Post.countDocuments()}`);
    console.log(`  - Community: 3`);
    console.log(`  - Live Locations: 3`);
    console.log(`Post Contents: ${await PostContent.countDocuments()}`);
    console.log(`Reports:      ${await Report.countDocuments()}`);
    console.log('═══════════════════════════════════════\n');

    console.log('📝 TEST CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('Admin:  admin@example.com / password123');
    console.log('User1:  john@example.com / password123');
    console.log('User2:  jane@example.com / password123');
    console.log('Driver: mike@example.com / password123');
    console.log('═══════════════════════════════════════\n');

    console.log('🧪 VALIDATOR TEST INFO');
    console.log('═══════════════════════════════════════');
    console.log('✓ All data created with validators enabled');
    console.log('✓ Auth: email format, password length validated');
    console.log('✓ Posts: lat/long ranges (-90/90, -180/180) validated');
    console.log('✓ Posts: time format HH:MM validated');
    console.log('✓ Reports: reason length (5-200 chars) validated');
    console.log('✓ Buses: number format (1-10 chars) validated');
    console.log('✓ LiveLocation: title = bus number');
    console.log('═══════════════════════════════════════\n');

    console.log(' Database seeded successfully!');
    console.log('Open MongoDB Compass at: mongodb://localhost:27017\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, err]) => {
        console.error(`   ${field}: ${err.message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed\n');
  }
};

seedDatabase();