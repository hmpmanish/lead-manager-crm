import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Server } from 'http';
import { createApp } from '../src/app';

const app = createApp();
const TEST_PORT = 5055;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

describe('Lead Manager API Integration Tests', () => {
  let server: Server;
  let userAToken: string;
  let userBToken: string;
  let userALeadId: string;

  beforeAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server = app.listen(TEST_PORT, '127.0.0.1', () => {
        resolve();
      });
      server.on('error', reject);
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });

  const userACredentials = {
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.com',
    password: 'Password123!',
  };

  const userBCredentials = {
    name: 'John Connor',
    email: 'john.connor@resistance.org',
    password: 'Password123!',
  };

  describe('1. Authentication & Security Endpoints', () => {
    it('should register User A successfully and return JWT with safe user data', async () => {
      const res = await request(BASE_URL)
        .post('/api/auth/register')
        .send(userACredentials);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(userACredentials.email);
      expect(res.body.user.password).toBeUndefined(); // Password hash must never leak

      userAToken = res.body.token;
    });

    it('should reject registration with duplicate email address with 409', async () => {
      const res = await request(BASE_URL)
        .post('/api/auth/register')
        .send(userACredentials);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('already exists');
    });

    it('should reject registration with invalid email or weak password with 400', async () => {
      const res = await request(BASE_URL)
        .post('/api/auth/register')
        .send({
          name: 'X',
          email: 'invalid-email-format',
          password: 'short',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    it('should login User A with valid credentials', async () => {
      const res = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          email: userACredentials.email,
          password: userACredentials.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(userACredentials.email);
    });

    it('should reject login with wrong password with 401', async () => {
      const res = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          email: userACredentials.email,
          password: 'WrongPassword999!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should register User B for isolation testing', async () => {
      const res = await request(BASE_URL)
        .post('/api/auth/register')
        .send(userBCredentials);

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      userBToken = res.body.token;
    });

    it('should return 401 when accessing protected route without a token', async () => {
      const res = await request(BASE_URL).get('/api/leads');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 when accessing protected route with invalid token', async () => {
      const res = await request(BASE_URL)
        .get('/api/leads')
        .set('Authorization', 'Bearer invalid.bogus.jwt');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Lead Creation & Validation', () => {
    it('should create a lead successfully for User A', async () => {
      const newLead = {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@acmecorp.in',
        phone: '+91 98765 43210',
        company: 'Acme Corp Technologies',
        source: 'Website',
        status: 'New',
      };

      const res = await request(BASE_URL)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userAToken}`)
        .send(newLead);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.name).toBe('Rahul Sharma');
      expect(res.body.data.company).toBe('Acme Corp Technologies');
      expect(res.body.data.status).toBe('New');

      userALeadId = res.body.data.id;
    });

    it('should create a second lead with Qualified status for User A', async () => {
      const secondLead = {
        name: 'Ananya Verma',
        email: 'ananya.v@zenithcloud.io',
        phone: '+91 98111 22334',
        company: 'Zenith Cloud Labs',
        source: 'LinkedIn',
        status: 'Qualified',
      };

      const res = await request(BASE_URL)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userAToken}`)
        .send(secondLead);

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('Qualified');
    });

    it('should reject lead creation with missing company name with 400', async () => {
      const res = await request(BASE_URL)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          name: 'Missing Company',
          email: 'valid@example.com',
          source: 'Website',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details.some((d: any) => d.field === 'company')).toBe(true);
    });

    it('should reject lead creation with invalid email with 400', async () => {
      const res = await request(BASE_URL)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          name: 'Invalid Email Lead',
          email: 'not-an-email-at-all',
          company: 'Test Corp',
          source: 'Website',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details.some((d: any) => d.field === 'email')).toBe(true);
    });

    it('should reject lead creation with invalid status with 400', async () => {
      const res = await request(BASE_URL)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          name: 'Invalid Status Lead',
          email: 'status@test.com',
          company: 'Test Corp',
          source: 'Website',
          status: 'InvalidStatusChoice',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Strict User Ownership & Isolation (Security Check)', () => {
    it('User B should see 0 leads in their list even though User A created 2 leads', async () => {
      const res = await request(BASE_URL)
        .get('/api/leads')
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.metrics.total).toBe(0);
    });

    it('User B cannot retrieve User As lead by ID (must return 404)', async () => {
      const res = await request(BASE_URL)
        .get(`/api/leads/${userALeadId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('User B cannot update User As lead (must return 404)', async () => {
      const res = await request(BASE_URL)
        .put(`/api/leads/${userALeadId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          company: 'Malicious Hijack Attempt Inc',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('User B cannot delete User As lead (must return 404)', async () => {
      const res = await request(BASE_URL)
        .delete(`/api/leads/${userALeadId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('4. Leads Reading, Search, Filtering, Pagination & Metrics', () => {
    it('User A should receive their leads and status summary metrics', async () => {
      const res = await request(BASE_URL)
        .get('/api/leads')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.metrics.total).toBe(2);
      expect(res.body.metrics.new).toBe(1);
      expect(res.body.metrics.qualified).toBe(1);
      expect(res.body.metrics.contacted).toBe(0);
      expect(res.body.metrics.lost).toBe(0);
    });

    it('User A can filter leads by status', async () => {
      const res = await request(BASE_URL)
        .get('/api/leads?status=Qualified')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe('Qualified');
      expect(res.body.data[0].name).toBe('Ananya Verma');
    });

    it('User A can search leads by company or name', async () => {
      const res = await request(BASE_URL)
        .get('/api/leads?search=Acme')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].company).toContain('Acme');
    });

    it('User A can sort leads ascending by name', async () => {
      const res = await request(BASE_URL)
        .get('/api/leads?sortBy=name&order=asc')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data[0].name).toBe('Ananya Verma');
      expect(res.body.data[1].name).toBe('Rahul Sharma');
    });
  });

  describe('5. Lead Update & Quick Status Transition', () => {
    it('User A can update the status of their lead to Contacted', async () => {
      const res = await request(BASE_URL)
        .put(`/api/leads/${userALeadId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ status: 'Contacted' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Contacted');
    });

    it('User A can update company name and phone', async () => {
      const res = await request(BASE_URL)
        .put(`/api/leads/${userALeadId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          company: 'Acme Global Corporation',
          phone: '+91 99999 88888',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.company).toBe('Acme Global Corporation');
      expect(res.body.data.phone).toBe('+91 99999 88888');
    });
  });

  describe('6. Lead Deletion with Confirmation Verification', () => {
    it('User A can delete their lead', async () => {
      const res = await request(BASE_URL)
        .delete(`/api/leads/${userALeadId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted successfully');
    });

    it('Subsequent GET for deleted lead ID must return 404', async () => {
      const res = await request(BASE_URL)
        .get(`/api/leads/${userALeadId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(404);
    });

    it('User A should now have total count of 1 lead', async () => {
      const res = await request(BASE_URL)
        .get('/api/leads')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.metrics.total).toBe(1);
    });
  });
});
