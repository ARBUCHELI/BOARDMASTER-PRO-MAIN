-- Delete existing demo users first
DELETE FROM users WHERE email IN (
  'sarah.mitchell@example.com',
  'james.rodriguez@example.com', 
  'emily.zhang@example.com',
  'michael.oconnor@example.com',
  'priya.patel@example.com'
);

-- Insert demo users with pre-hashed password "Demo123!"
-- These hashes were generated with bcrypt, rounds=10
INSERT INTO users (email, password_hash, full_name, job_title, bio, avatar_url) VALUES
('sarah.mitchell@example.com', '$2b$10$rZ5pZYxGw3LKn.YdQH8pPu8vxJJ9qwXnYJ5FZKpYx8RxZH8pPu8vx', 'Sarah Mitchell', 'Senior Full-Stack Developer', 'Passionate about building scalable web applications with React and Node.js. 8+ years of experience in software development.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4&radius=50'),
('james.rodriguez@example.com', '$2b$10$rZ5pZYxGw3LKn.YdQH8pPu8vxJJ9qwXnYJ5FZKpYx8RxZH8pPu8vx', 'James Rodriguez', 'Backend Engineer', 'Specialized in microservices architecture and API design. Love working with databases and optimization.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c0aede&radius=50'),
('emily.zhang@example.com', '$2b$10$rZ5pZYxGw3LKn.YdQH8pPu8vxJJ9qwXnYJ5FZKpYx8RxZH8pPu8vx', 'Emily Zhang', 'Frontend Developer', 'UI/UX enthusiast with a focus on creating beautiful, accessible interfaces. React and TypeScript expert.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffd5dc&radius=50'),
('michael.oconnor@example.com', '$2b$10$rZ5pZYxGw3LKn.YdQH8pPu8vxJJ9qwXnYJ5FZKpYx8RxZH8pPu8vx', 'Michael O''Connor', 'DevOps Engineer', 'Infrastructure automation and CI/CD pipeline specialist. Making deployments smooth and reliable.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=d1d4f9&radius=50'),
('priya.patel@example.com', '$2b$10$rZ5pZYxGw3LKn.YdQH8pPu8vxJJ9qwXnYJ5FZKpYx8RxZH8pPu8vx', 'Priya Patel', 'Product Manager', 'Bridging the gap between business and technology. Agile advocate and user-centric product enthusiast.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffdfbf&radius=50');
