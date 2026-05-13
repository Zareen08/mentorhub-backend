import { PrismaClient, Role, BookingStatus, Availability } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mentorhub.com' },
    update: {},
    create: {
      email: 'admin@mentorhub.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      isVerified: true,
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=3B82F6&color=fff',
    },
  });

  console.log(`✅ Created admin: ${admin.email}`);

  // Create sample mentors
  const mentors = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      title: 'Senior Software Engineer',
      company: 'Google',
      experience: 8,
      hourlyRate: 120,
      skills: ['React', 'Node.js', 'TypeScript', 'Python'],
      bio: 'Experienced software engineer with expertise in full-stack development.',
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      title: 'AI/ML Specialist',
      company: 'OpenAI',
      experience: 6,
      hourlyRate: 150,
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'NLP'],
      bio: 'AI researcher and practitioner helping others break into AI.',
    },
    {
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      title: 'Product Manager',
      company: 'Microsoft',
      experience: 10,
      hourlyRate: 130,
      skills: ['Product Strategy', 'Agile', 'Leadership', 'UX'],
      bio: 'Product leader with experience launching successful products.',
    },
  ];

  for (const mentorData of mentors) {
    const hashedPassword = await bcrypt.hash('Mentor123!', 10);
    
    const user = await prisma.user.upsert({
      where: { email: mentorData.email },
      update: {},
      create: {
        email: mentorData.email,
        password: hashedPassword,
        name: mentorData.name,
        role: Role.MENTOR,
        isVerified: true,
        bio: mentorData.bio,
        expertise: mentorData.skills,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorData.name)}&background=10B981&color=fff`,
      },
    });

    await prisma.mentor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        title: mentorData.title,
        company: mentorData.company,
        experience: mentorData.experience,
        hourlyRate: mentorData.hourlyRate,
        skills: mentorData.skills,
        availability: [
          Availability.MONDAY_AM,
          Availability.MONDAY_PM,
          Availability.WEDNESDAY_AM,
          Availability.WEDNESDAY_PM,
          Availability.FRIDAY_AM,
        ],
        isActive: true,
      },
    });

    console.log(`✅ Created mentor: ${mentorData.name}`);
  }

  // Create sample regular user
  const userPassword = await bcrypt.hash('User123!', 10);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@mentorhub.com' },
    update: {},
    create: {
      email: 'user@mentorhub.com',
      password: userPassword,
      name: 'Test User',
      role: Role.USER,
      isVerified: true,
      avatar: 'https://ui-avatars.com/api/?name=Test+User&background=8B5CF6&color=fff',
    },
  });

  console.log(`✅ Created user: ${regularUser.email}`);

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login Credentials:');
  console.log('Admin: admin@mentorhub.com / Admin123!');
  console.log('User: user@mentorhub.com / User123!');
  console.log('Mentors: Any mentor email / Mentor123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });