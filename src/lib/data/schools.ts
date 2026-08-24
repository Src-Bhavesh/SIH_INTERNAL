import { School, Building, Floor, Room, EmergencyContact, SchoolClass, GraphNode, GraphEdge } from '../types';

export const emergencyContacts: EmergencyContact[] = [
  { id: 'ec-1', name: 'Dr. Rajinder Singh', role: 'Principal', phone: '+91 98765 43210', type: 'internal' },
  { id: 'ec-2', name: 'Civil Hospital, Ludhiana', role: 'Nearest Hospital', phone: '0161-250-0000', type: 'hospital' },
  { id: 'ec-3', name: 'Ludhiana Fire Station', role: 'Fire Services', phone: '101', type: 'fire' },
  { id: 'ec-4', name: 'District Police', role: 'Police', phone: '100', type: 'police' },
  { id: 'ec-5', name: 'Ambulance', role: 'Emergency Medical', phone: '108', type: 'ambulance' },
  { id: 'ec-6', name: 'NDRF Punjab', role: 'Disaster Response', phone: '011-2436-3260', type: 'other' },
];

// ── Rooms for Block A ──
const blockAFloors: Floor[] = [
  {
    id: 'floor-a-g', buildingId: 'building-a', level: 0, name: 'Ground Floor',
    rooms: [
      { id: 'room-a-g-1', floorId: 'floor-a-g', name: 'Classroom 101', type: 'classroom', capacity: 40, x: 20, y: 20, width: 120, height: 80 },
      { id: 'room-a-g-2', floorId: 'floor-a-g', name: 'Classroom 102', type: 'classroom', capacity: 40, x: 160, y: 20, width: 120, height: 80 },
      { id: 'room-a-g-3', floorId: 'floor-a-g', name: 'Classroom 103', type: 'classroom', capacity: 40, x: 20, y: 120, width: 120, height: 80 },
      { id: 'room-a-g-corr', floorId: 'floor-a-g', name: 'Corridor A-G', type: 'corridor', x: 140, y: 100, width: 20, height: 100 },
      { id: 'room-a-g-stair', floorId: 'floor-a-g', name: 'Staircase A', type: 'staircase', x: 160, y: 120, width: 120, height: 80 },
      { id: 'room-a-g-exit', floorId: 'floor-a-g', name: 'Exit A', type: 'exit', x: 120, y: 220, width: 60, height: 30 },
    ],
  },
  {
    id: 'floor-a-1', buildingId: 'building-a', level: 1, name: 'First Floor',
    rooms: [
      { id: 'room-a-1-1', floorId: 'floor-a-1', name: 'Classroom 201', type: 'classroom', capacity: 40, x: 20, y: 20, width: 120, height: 80 },
      { id: 'room-a-1-2', floorId: 'floor-a-1', name: 'Classroom 202', type: 'classroom', capacity: 40, x: 160, y: 20, width: 120, height: 80 },
      { id: 'room-a-1-3', floorId: 'floor-a-1', name: 'Classroom 203', type: 'classroom', capacity: 40, x: 20, y: 120, width: 120, height: 80 },
      { id: 'room-a-1-corr', floorId: 'floor-a-1', name: 'Corridor A-1', type: 'corridor', x: 140, y: 100, width: 20, height: 100 },
      { id: 'room-a-1-stair', floorId: 'floor-a-1', name: 'Staircase A', type: 'staircase', x: 160, y: 120, width: 120, height: 80 },
    ],
  },
  {
    id: 'floor-a-2', buildingId: 'building-a', level: 2, name: 'Second Floor',
    rooms: [
      { id: 'room-a-2-1', floorId: 'floor-a-2', name: 'Classroom 301', type: 'classroom', capacity: 40, x: 20, y: 20, width: 120, height: 80 },
      { id: 'room-a-2-2', floorId: 'floor-a-2', name: 'Classroom 302', type: 'classroom', capacity: 40, x: 160, y: 20, width: 120, height: 80 },
      { id: 'room-a-2-lab', floorId: 'floor-a-2', name: 'Science Lab', type: 'lab', capacity: 30, x: 20, y: 120, width: 120, height: 80 },
      { id: 'room-a-2-corr', floorId: 'floor-a-2', name: 'Corridor A-2', type: 'corridor', x: 140, y: 100, width: 20, height: 100 },
      { id: 'room-a-2-stair', floorId: 'floor-a-2', name: 'Staircase A', type: 'staircase', x: 160, y: 120, width: 120, height: 80 },
    ],
  },
];

// ── Rooms for Block B ──
const blockBFloors: Floor[] = [
  {
    id: 'floor-b-g', buildingId: 'building-b', level: 0, name: 'Ground Floor',
    rooms: [
      { id: 'room-b-g-1', floorId: 'floor-b-g', name: 'Classroom 104', type: 'classroom', capacity: 40, x: 20, y: 20, width: 120, height: 80 },
      { id: 'room-b-g-2', floorId: 'floor-b-g', name: 'Classroom 105', type: 'classroom', capacity: 40, x: 160, y: 20, width: 120, height: 80 },
      { id: 'room-b-g-lib', floorId: 'floor-b-g', name: 'Library', type: 'library', capacity: 60, x: 20, y: 120, width: 260, height: 80 },
      { id: 'room-b-g-corr', floorId: 'floor-b-g', name: 'Corridor B-G', type: 'corridor', x: 140, y: 100, width: 20, height: 20 },
      { id: 'room-b-g-stair', floorId: 'floor-b-g', name: 'Staircase B', type: 'staircase', x: 300, y: 20, width: 40, height: 80 },
      { id: 'room-b-g-exit', floorId: 'floor-b-g', name: 'Exit B', type: 'exit', x: 300, y: 120, width: 40, height: 30 },
    ],
  },
  {
    id: 'floor-b-1', buildingId: 'building-b', level: 1, name: 'First Floor',
    rooms: [
      { id: 'room-b-1-1', floorId: 'floor-b-1', name: 'Classroom 204', type: 'classroom', capacity: 40, x: 20, y: 20, width: 120, height: 80 },
      { id: 'room-b-1-2', floorId: 'floor-b-1', name: 'Classroom 205', type: 'classroom', capacity: 40, x: 160, y: 20, width: 120, height: 80 },
      { id: 'room-b-1-3', floorId: 'floor-b-1', name: 'Classroom 206', type: 'classroom', capacity: 40, x: 20, y: 120, width: 120, height: 80 },
      { id: 'room-b-1-corr', floorId: 'floor-b-1', name: 'Hallway B', type: 'corridor', x: 140, y: 100, width: 20, height: 100 },
      { id: 'room-b-1-stair', floorId: 'floor-b-1', name: 'Staircase B', type: 'staircase', x: 300, y: 20, width: 40, height: 80 },
    ],
  },
  {
    id: 'floor-b-2', buildingId: 'building-b', level: 2, name: 'Second Floor',
    rooms: [
      { id: 'room-b-2-1', floorId: 'floor-b-2', name: 'Classroom 304', type: 'classroom', capacity: 40, x: 20, y: 20, width: 120, height: 80 },
      { id: 'room-b-2-2', floorId: 'floor-b-2', name: 'Classroom 305', type: 'classroom', capacity: 40, x: 160, y: 20, width: 120, height: 80 },
      { id: 'room-b-2-aud', floorId: 'floor-b-2', name: 'Auditorium', type: 'auditorium', capacity: 200, x: 20, y: 120, width: 260, height: 80 },
      { id: 'room-b-2-corr', floorId: 'floor-b-2', name: 'Corridor B-2', type: 'corridor', x: 140, y: 100, width: 20, height: 20 },
      { id: 'room-b-2-stair', floorId: 'floor-b-2', name: 'Staircase B', type: 'staircase', x: 300, y: 20, width: 40, height: 80 },
    ],
  },
];

// ── Rooms for Block C ──
const blockCFloors: Floor[] = [
  {
    id: 'floor-c-g', buildingId: 'building-c', level: 0, name: 'Ground Floor',
    rooms: [
      { id: 'room-c-g-1', floorId: 'floor-c-g', name: 'Classroom 106', type: 'classroom', capacity: 40, x: 20, y: 20, width: 120, height: 80 },
      { id: 'room-c-g-2', floorId: 'floor-c-g', name: 'Classroom 107', type: 'classroom', capacity: 40, x: 160, y: 20, width: 120, height: 80 },
      { id: 'room-c-g-office', floorId: 'floor-c-g', name: 'Admin Office', type: 'office', capacity: 10, x: 20, y: 120, width: 120, height: 80 },
      { id: 'room-c-g-corr', floorId: 'floor-c-g', name: 'Corridor C-G', type: 'corridor', x: 140, y: 100, width: 20, height: 100 },
      { id: 'room-c-g-stair', floorId: 'floor-c-g', name: 'Staircase C', type: 'staircase', x: 160, y: 120, width: 120, height: 80 },
      { id: 'room-c-g-exit', floorId: 'floor-c-g', name: 'Exit C', type: 'exit', x: 120, y: 220, width: 60, height: 30 },
    ],
  },
];

export const buildings: Building[] = [
  { id: 'building-a', name: 'Block A', schoolId: 'school-001', floors: blockAFloors },
  { id: 'building-b', name: 'Block B', schoolId: 'school-001', floors: blockBFloors },
  { id: 'building-c', name: 'Block C', schoolId: 'school-001', floors: blockCFloors },
];

export const assemblyPoints = [
  { id: 'assembly-a', name: 'Assembly Point A — Main Ground', buildingId: 'building-a', x: 150, y: 300 },
  { id: 'assembly-b', name: 'Assembly Point B — Back Field', buildingId: 'building-b', x: 350, y: 300 },
  { id: 'assembly-c', name: 'Assembly Point C — Parking Area', buildingId: 'building-c', x: 150, y: 300 },
];

export const school: School = {
  id: 'school-001',
  name: 'ABC Public School',
  address: 'Model Town, Ludhiana',
  district: 'Ludhiana',
  state: 'Punjab',
  totalStudents: 910,
  totalTeachers: 45,
  totalClasses: 24,
  buildings,
  emergencyContacts,
  preparednessScore: 83,
  lastDrillDate: '2026-08-18',
};

export const classes: SchoolClass[] = [
  { id: 'class-12a', name: 'XII-A', grade: '12', section: 'A', buildingId: 'building-a', roomId: 'room-a-2-1', teacherId: 'teacher-001', studentIds: ['student-001', 'student-002', 'student-003', 'student-004'], totalStudents: 42 },
  { id: 'class-12b', name: 'XII-B', grade: '12', section: 'B', buildingId: 'building-a', roomId: 'room-a-2-2', teacherId: 'teacher-001', studentIds: ['student-005', 'student-006'], totalStudents: 40 },
  { id: 'class-11a', name: 'XI-A', grade: '11', section: 'A', buildingId: 'building-a', roomId: 'room-a-1-1', teacherId: 'teacher-001', studentIds: ['student-007', 'student-008'], totalStudents: 38 },
  { id: 'class-10a', name: 'X-A', grade: '10', section: 'A', buildingId: 'building-b', roomId: 'room-b-1-1', teacherId: 'teacher-002', studentIds: [], totalStudents: 41 },
  { id: 'class-10b', name: 'X-B', grade: '10', section: 'B', buildingId: 'building-b', roomId: 'room-b-1-2', teacherId: 'teacher-002', studentIds: [], totalStudents: 39 },
  { id: 'class-9a', name: 'IX-A', grade: '9', section: 'A', buildingId: 'building-b', roomId: 'room-b-1-3', teacherId: 'teacher-003', studentIds: [], totalStudents: 42 },
  { id: 'class-9b', name: 'IX-B', grade: '9', section: 'B', buildingId: 'building-c', roomId: 'room-c-g-1', teacherId: 'teacher-003', studentIds: [], totalStudents: 40 },
  { id: 'class-7b', name: '7B', grade: '7', section: 'B', buildingId: 'building-a', roomId: 'room-a-1-2', teacherId: 'teacher-004', studentIds: ['student-009'], totalStudents: 35 },
];

// ── Graph for Block B (used in evacuation demo) ──
export const blockBGraph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: 'gn-204', roomId: 'room-b-1-1', label: 'Classroom 204', type: 'classroom', x: 80, y: 50 },
    { id: 'gn-205', roomId: 'room-b-1-2', label: 'Classroom 205', type: 'classroom', x: 220, y: 50 },
    { id: 'gn-206', roomId: 'room-b-1-3', label: 'Classroom 206', type: 'classroom', x: 80, y: 160 },
    { id: 'gn-hallway-b', roomId: 'room-b-1-corr', label: 'Hallway B (1F)', type: 'corridor', x: 150, y: 110 },
    { id: 'gn-stair-b', roomId: 'room-b-1-stair', label: 'Staircase B (East)', type: 'staircase', x: 320, y: 50 },
    { id: 'gn-stair-west', roomId: 'room-b-1-stair-west', label: 'West Fire Staircase (1F)', type: 'staircase', x: 40, y: 50 },
    { id: 'gn-stair-west-g', roomId: 'room-b-g-stair-west', label: 'West Fire Staircase (GF)', type: 'staircase', x: 40, y: 160 },
    { id: 'gn-304', roomId: 'room-b-2-1', label: 'Classroom 304', type: 'classroom', x: 80, y: 50 },
    { id: 'gn-corr-b2', roomId: 'room-b-2-corr', label: 'Corridor B-2', type: 'corridor', x: 150, y: 110 },
    { id: 'gn-stair-b2', roomId: 'room-b-2-stair', label: 'Staircase B (F2)', type: 'staircase', x: 320, y: 50 },
    { id: 'gn-exit-b', roomId: 'room-b-g-exit', label: 'Exit B (East)', type: 'exit', x: 320, y: 160 },
    { id: 'gn-corr-bg', roomId: 'room-b-g-corr', label: 'Corridor B-G', type: 'corridor', x: 150, y: 110 },
    { id: 'gn-stair-bg', roomId: 'room-b-g-stair', label: 'Staircase B (GF)', type: 'staircase', x: 320, y: 50 },
    { id: 'gn-exit-c', roomId: 'room-c-g-exit', label: 'Exit C (West / Alt)', type: 'exit', x: 450, y: 160 },
    { id: 'gn-assembly-a', roomId: 'assembly-a', label: 'Assembly Point A', type: 'assembly_point', x: 150, y: 280 },
    { id: 'gn-assembly-b', roomId: 'assembly-b', label: 'Assembly Point B', type: 'assembly_point', x: 350, y: 280 },
  ],
  edges: [
    // First Floor connections
    { id: 'e-204-hall', from: 'gn-204', to: 'gn-hallway-b', weight: 12, isBlocked: false, label: 'Room to Corridor' },
    { id: 'e-205-hall', from: 'gn-205', to: 'gn-hallway-b', weight: 10, isBlocked: false, label: 'Corridor' },
    { id: 'e-206-hall', from: 'gn-206', to: 'gn-hallway-b', weight: 15, isBlocked: false, label: 'Corridor' },
    
    // East Staircase B path (Primary)
    { id: 'e-hall-stair', from: 'gn-hallway-b', to: 'gn-stair-b', weight: 14, isBlocked: false, label: 'To Staircase B' },
    { id: 'e-stair-bg', from: 'gn-stair-b', to: 'gn-stair-bg', weight: 18, isBlocked: false, label: 'Down Staircase B' },
    { id: 'e-stairbg-corrbg', from: 'gn-stair-bg', to: 'gn-corr-bg', weight: 8, isBlocked: false, label: 'GF Corridor' },
    { id: 'e-corrbg-exitb', from: 'gn-corr-bg', to: 'gn-exit-b', weight: 10, isBlocked: false, label: 'To Exit B' },
    { id: 'e-exitb-assemblyb', from: 'gn-exit-b', to: 'gn-assembly-b', weight: 20, isBlocked: false, label: 'To Assembly Point B' },
    
    // West Fire Staircase path (Alternative Reroute)
    { id: 'e-hall-stairwest', from: 'gn-hallway-b', to: 'gn-stair-west', weight: 20, isBlocked: false, label: 'To West Staircase' },
    { id: 'e-stairwest-g', from: 'gn-stair-west', to: 'gn-stair-west-g', weight: 22, isBlocked: false, label: 'Down West Staircase' },
    { id: 'e-stairwest-exitc', from: 'gn-stair-west-g', to: 'gn-exit-c', weight: 14, isBlocked: false, label: 'To Exit C' },
    { id: 'e-exitc-assemblya', from: 'gn-exit-c', to: 'gn-assembly-a', weight: 24, isBlocked: false, label: 'To Assembly Point A' },
    
    // GF Cross connection between corridors
    { id: 'e-corrbg-exitc', from: 'gn-corr-bg', to: 'gn-exit-c', weight: 28, isBlocked: false, label: 'Cross Corridor to Exit C' },
  ],
};

export function getBuildingById(id: string): Building | undefined {
  return buildings.find(b => b.id === id);
}

export function getClassById(id: string): SchoolClass | undefined {
  return classes.find(c => c.id === id);
}

export function getClassesByTeacher(teacherId: string): SchoolClass[] {
  return classes.filter(c => c.teacherId === teacherId);
}

export function getClassesByBuilding(buildingId: string): SchoolClass[] {
  return classes.filter(c => c.buildingId === buildingId);
}
