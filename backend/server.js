import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase payload limit for image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Get all organizations
app.get('/api/organizations', (req, res) => {
  const orgs = db.prepare('SELECT * FROM organizations ORDER BY id').all();
  res.json(orgs);
});

// Get organization by id
app.get('/api/organizations/:id', (req, res) => {
  const org = db.prepare('SELECT * FROM organizations WHERE id = ?').get(req.params.id);
  if (!org) return res.status(404).json({ error: 'Organization not found' });
  res.json(org);
});

// Create organization
app.post('/api/organizations', (req, res) => {
  const { name, slug, email, contact } = req.body;
  try {
    const result = db.prepare(
      'INSERT INTO organizations (name, slug, email, contact) VALUES (?, ?, ?, ?)'
    ).run(name, slug, email, contact);
    res.json({ id: result.lastInsertRowid, name, slug, email, contact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update organization
app.put('/api/organizations/:id', (req, res) => {
  const { name, slug, email, contact, phone, alt_phone, max_coordinators, timezone, region, language, website, status, logo } = req.body;
  try {
    db.prepare(`
      UPDATE organizations 
      SET name = ?, slug = ?, email = ?, contact = ?, phone = ?, alt_phone = ?, 
          max_coordinators = ?, timezone = ?, region = ?, language = ?, website = ?, status = ?, logo = ?
      WHERE id = ?
    `).run(name, slug, email, contact, phone, alt_phone, max_coordinators, timezone, region, language, website, status, logo, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete organization
app.delete('/api/organizations/:id', (req, res) => {
  db.prepare('DELETE FROM organizations WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Get users for organization
app.get('/api/organizations/:id/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users WHERE organization_id = ?').all(req.params.id);
  res.json(users);
});

// Add user to organization
app.post('/api/organizations/:id/users', (req, res) => {
  const { name, role } = req.body;
  const result = db.prepare(
    'INSERT INTO users (organization_id, name, role) VALUES (?, ?, ?)'
  ).run(req.params.id, name, role);
  res.json({ id: result.lastInsertRowid, name, role });
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const { name, role } = req.body;
  try {
    db.prepare('UPDATE users SET name = ?, role = ? WHERE id = ?').run(name, role, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

