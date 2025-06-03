
export interface Faculty {
  faculty_id: string;
  name: string;
  department: string;
  email?: string;
  contact_number?: string;
}

export interface Course {
  course_code: string;
  course_name: string;
  course_type?: string;
  department: string;
}

export interface Room {
  room_number: string;
  building?: string;
  capacity?: number;
  equipment?: string;
}

export interface TimeSlot {
  slot_id: string;
  start_time: string;
  end_time: string;
}

export interface CourseSchedule {
  schedule_id: string;
  course_code?: string;
  faculty_id?: string;
  room_number?: string;
  day_of_week: string;
  time_slot_id?: string;
  semester?: string;
  academic_year?: string;
}

export interface ScheduleView {
  schedule_id: string;
  faculty_name: string;
  faculty_id: string;
  department: string;
  course_name?: string;
  room_number?: string;
  building?: string;
  day_of_week: string;
  start_time?: string;
  end_time?: string;
  semester?: string;
  academic_year?: string;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  department?: string;
}
