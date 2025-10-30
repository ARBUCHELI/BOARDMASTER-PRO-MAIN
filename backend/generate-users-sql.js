// Run this with: node generate-users-sql.js
// Copy the output SQL and run it via Render database query or pgAdmin

const bcrypt = require('bcrypt');

const users = [
  {
    email: 'sarah.mitchell@example.com',
    fullName: 'Sarah Mitchell',
    jobTitle: 'Senior Full-Stack Developer',
    bio: 'Passionate about building scalable web applications with React and Node.js. 8+ years of experience.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4&radius=50'
  },
  {
    email: 'james.rodriguez@example.com',
    fullName: 'James Rodriguez',
    jobTitle: 'Backend Engineer',
    bio: 'Specialized in microservices architecture and API design.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c0aede&radius=50'
  },
  {
    email: 'emily.zhang@example.com',
    fullName: 'Emily Zhang',
    jobTitle: 'Frontend Developer',
    bio: 'UI/UX enthusiast creating beautiful, accessible interfaces.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffd5dc&radius=50'
  },
  {
    email: 'michael.oconnor@example.com',
    fullName: 'Michael O\'Connor',
    jobTitle: 'DevOps Engineer',
    bio: 'Infrastructure automation and CI/CD pipeline specialist.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=d1d4f9&radius=50'
  },
  {
    email: 'priya.patel@example.com',
    fullName: 'Priya Patel',
    jobTitle: 'Product Manager',
    bio: 'Bridging the gap between business and technology.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffdfbf&radius=50'
  }
];

async function generateSQL() {
  console.log('-- Copy and paste this entire SQL into Render database query console\n');
  console.log('-- Delete existing demo users');
  console.log(`DELETE FROM users WHERE email IN ('${users.map(u => u.email).join("', '")}');\n`);
  
  console.log('-- Insert demo users with password: Demo123!');
  
  const password = 'Demo123!';
  
  for (const user of users) {
    const hash = await bcrypt.hash(password, 10);
    const escapedFullName = user.fullName.replace(/'/g, "''");
    const escapedBio = user.bio.replace(/'/g, "''");
    
    console.log(`INSERT INTO users (email, password_hash, full_name, job_title, bio, avatar_url) VALUES ('${user.email}', '${hash}', '${escapedFullName}', '${user.jobTitle}', '${escapedBio}', '${user.avatarUrl}');`);
  }
  
  console.log('\n-- Done! All 5 users created with password: Demo123!');
}

generateSQL().catch(console.error);
