const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug: Log environment variables (remove after fixing)
console.log('Environment Variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false // For AWS RDS connections
  }
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

testConnection();

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });
  
  // Faculty endpoints
  app.get('/api/faculty', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM faculty');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.get('/api/faculty/department/:department', async (req, res) => {
    try {
      const { department } = req.params;
      const result = await pool.query('SELECT * FROM faculty WHERE department = $1', [department]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching faculty by department:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.post('/api/faculty', async (req, res) => {
    try {
      const { faculty_id, name, department, email, contact_number } = req.body;
      const result = await pool.query(
        'INSERT INTO faculty (faculty_id, name, department, email, contact_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [faculty_id, name, department, email, contact_number]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating faculty:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.put('/api/faculty/:id', async (req, res) => {
    try {
      const { id } = req.params; // old faculty_id
      const { faculty_id, name, department, email, contact_number } = req.body; // new faculty_id
      const result = await pool.query(
        'UPDATE faculty SET faculty_id = $1, name = $2, department = $3, email = $4, contact_number = $5 WHERE faculty_id = $6 RETURNING *',
        [faculty_id, name, department, email, contact_number, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating faculty:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.delete('/api/faculty/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM faculty WHERE faculty_id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
      res.json({ message: 'Faculty deleted successfully' });
    } catch (error) {
      console.error('Error deleting faculty:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Course endpoints
  app.get('/api/courses', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM courses');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.get('/api/courses/department/:department', async (req, res) => {
    try {
      const { department } = req.params;
      const result = await pool.query('SELECT * FROM courses WHERE department = $1', [department]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching courses by department:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.post('/api/courses', async (req, res) => {
    try {
      const { course_code, course_name, course_type, department } = req.body;
      const result = await pool.query(
        'INSERT INTO courses (course_code, course_name, course_type, department) VALUES ($1, $2, $3, $4) RETURNING *',
        [course_code, course_name, course_type, department]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.put('/api/courses/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const { course_name, course_type, department } = req.body;
      const result = await pool.query(
        'UPDATE courses SET course_name = $1, course_type = $2, department = $3 WHERE course_code = $4 RETURNING *',
        [course_name, course_type, department, code]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.delete('/api/courses/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const result = await pool.query('DELETE FROM courses WHERE course_code = $1 RETURNING *', [code]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Room endpoints
  app.get('/api/rooms', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM rooms');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.post('/api/rooms', async (req, res) => {
    try {
      const { room_number, building, capacity, equipment } = req.body;
      const result = await pool.query(
        'INSERT INTO rooms (room_number, building, capacity, equipment) VALUES ($1, $2, $3, $4) RETURNING *',
        [room_number, building, capacity, equipment]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.put('/api/rooms/:room_number', async (req, res) => {
    try {
      const { room_number } = req.params;
      const { building, capacity, equipment } = req.body;
      const result = await pool.query(
        'UPDATE rooms SET building = $1, capacity = $2, equipment = $3 WHERE room_number = $4 RETURNING *',
        [building, capacity, equipment, room_number]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating room:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.delete('/api/rooms/:room_number', async (req, res) => {
    try {
      const { room_number } = req.params;
      const result = await pool.query('DELETE FROM rooms WHERE room_number = $1 RETURNING *', [room_number]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // TimeSlot endpoints
  app.get('/api/timeslots', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM timeslots');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.post('/api/timeslots', async (req, res) => {
    try {
      const { slot_id, start_time, end_time } = req.body;
      const result = await pool.query(
        'INSERT INTO timeslots (slot_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING *',
        [slot_id, start_time, end_time]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating time slot:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.put('/api/timeslots/:slot_id', async (req, res) => {
    try {
      const { slot_id } = req.params;
      const { start_time, end_time } = req.body;
      const result = await pool.query(
        'UPDATE timeslots SET start_time = $1, end_time = $2 WHERE slot_id = $3 RETURNING *',
        [start_time, end_time, slot_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating time slot:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.delete('/api/timeslots/:slot_id', async (req, res) => {
    try {
      const { slot_id } = req.params;
      const result = await pool.query('DELETE FROM timeslots WHERE slot_id = $1 RETURNING *', [slot_id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
      res.json({ message: 'Time slot deleted successfully' });
    } catch (error) {
      console.error('Error deleting time slot:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Schedule endpoints
  app.get('/api/schedules', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM courseschedule');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.get('/api/schedules/view', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          cs.schedule_id,
          f.name as faculty_name,
          f.faculty_id,
          f.department,
          c.course_name,
          c.course_code,
          r.room_number,
          r.building,
          cs.day_of_week,
          ts.start_time,
          ts.end_time,
          cs.semester,
          cs.academic_year
        FROM courseschedule cs
        LEFT JOIN faculty f ON cs.faculty_id = f.faculty_id
        LEFT JOIN courses c ON cs.course_code = c.course_code
        LEFT JOIN rooms r ON cs.room_number = r.room_number
        LEFT JOIN timeslots ts ON cs.time_slot_id = ts.slot_id
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching schedule view:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.get('/api/schedules/view/department/:department', async (req, res) => {
    try {
      const { department } = req.params;
      const result = await pool.query(`
        SELECT 
          cs.schedule_id,
          f.name as faculty_name,
          f.faculty_id,
          f.department,
          c.course_name,
          c.course_code,
          r.room_number,
          r.building,
          cs.day_of_week,
          ts.start_time,
          ts.end_time,
          cs.semester,
          cs.academic_year
        FROM courseschedule cs
        INNER JOIN faculty f ON cs.faculty_id = f.faculty_id
        LEFT JOIN courses c ON cs.course_code = c.course_code
        LEFT JOIN rooms r ON cs.room_number = r.room_number
        LEFT JOIN timeslots ts ON cs.time_slot_id = ts.slot_id
        WHERE f.department = $1
      `, [department]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching schedule view by department:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.post('/api/schedules', async (req, res) => {
    try {
      const { schedule_id, course_code, faculty_id, room_number, day_of_week, time_slot_id, semester, academic_year } = req.body;
      const result = await pool.query(
        'INSERT INTO courseschedule (schedule_id, course_code, faculty_id, room_number, day_of_week, time_slot_id, semester, academic_year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [schedule_id, course_code, faculty_id, room_number, day_of_week, time_slot_id, semester, academic_year]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.put('/api/schedules/:schedule_id', async (req, res) => {
    try {
      const { schedule_id } = req.params;
      const { course_code, faculty_id, room_number, day_of_week, time_slot_id, semester, academic_year } = req.body;
      const result = await pool.query(
        'UPDATE courseschedule SET course_code = $1, faculty_id = $2, room_number = $3, day_of_week = $4, time_slot_id = $5, semester = $6, academic_year = $7 WHERE schedule_id = $8 RETURNING *',
        [course_code, faculty_id, room_number, day_of_week, time_slot_id, semester, academic_year, schedule_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.delete('/api/schedules/:schedule_id', async (req, res) => {
    try {
      const { schedule_id } = req.params;
      const result = await pool.query('DELETE FROM courseschedule WHERE schedule_id = $1 RETURNING *', [schedule_id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });