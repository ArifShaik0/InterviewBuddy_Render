import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'b2b.db'));

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    alt_phone TEXT,
    max_coordinators INTEGER DEFAULT 5,
    timezone TEXT DEFAULT 'India Standard Time',
    region TEXT DEFAULT 'Asia/Colombo',
    language TEXT DEFAULT 'English',
    website TEXT,
    logo TEXT,
    status TEXT DEFAULT 'Active',
    pending_requests INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
  );
`);

// Insert sample data only if database is empty
const orgCount = db.prepare('SELECT COUNT(*) as count FROM organizations').get();

if (orgCount.count === 0) {
    const insertOrg = db.prepare(`
    INSERT INTO organizations (name, slug, email, contact, phone, website, status, pending_requests, logo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const sampleOrgs = [
        ['Massachusetts Institute of Technology', 'mit', 'gitam@gitam.in', 'Taylor Jones', '91-9676456543', 'Gitam.edu', 'Active', 45, '🎓'],
        ['Stanford University', 'stanford', 'contact@stanford.edu', 'John Smith', '91-9876543210', 'Stanford.edu', 'Blocked', 45, '🏛️'],
        ['Harvard University', 'harvard', 'info@harvard.edu', 'Jane Doe', '91-9123456789', 'Harvard.edu', 'Inactive', 45, '📚']
    ];

    sampleOrgs.forEach(org => insertOrg.run(...org));

    const insertUser = db.prepare(`
    INSERT INTO users (organization_id, name, role) VALUES (?, ?, ?)
  `);

    const sampleUsers = [
        [1, 'Dave Richards', 'Admin'],
        [1, 'Abhishek Hari', 'Co-ordinator'],
        [1, 'Nishta Gupta', 'Admin']
    ];

    sampleUsers.forEach(user => insertUser.run(...user));
}

export default db;
