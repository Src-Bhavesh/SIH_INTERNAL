import { Scenario, ScenarioStep } from '../types';

// ═══════════════════════════════════════════════════════════════
// EARTHQUAKE SIMULATION — Intermediate
// ═══════════════════════════════════════════════════════════════
const earthquakeSteps: ScenarioStep[] = [
  {
    id: 'eq-1',
    situation: 'You are sitting in Classroom 204 on the first floor of Block B during a Geography class. Suddenly, you feel a strong vibration. The lights flicker, desks start shaking, and objects fall from shelves. This is an earthquake!',
    illustration: 'classroom_shaking',
    location: 'Classroom 204, Block B, First Floor',
    timeLimit: 15,
    choices: [
      {
        id: 'eq-1a', text: 'Run immediately toward the staircase',
        consequence: 'Running during active shaking is extremely dangerous. Falling debris, broken glass, and collapsing structures can cause serious injuries. During an earthquake, you should DROP, COVER, and HOLD ON first.',
        isCorrect: false, isSafe: false, safetyScore: 20, nextStepId: 'eq-2', responseTimeWeight: 0.8,
      },
      {
        id: 'eq-1b', text: 'Drop, take cover under a sturdy desk, and hold on',
        consequence: 'Excellent decision! Taking cover under a sturdy desk protects you from falling objects and debris. The "Drop, Cover, Hold On" technique is the internationally recommended response during earthquake shaking.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: 'eq-2', responseTimeWeight: 1.0,
      },
      {
        id: 'eq-1c', text: 'Stand near the window to see what is happening outside',
        consequence: 'Windows are one of the most dangerous places during an earthquake. Glass can shatter and cause severe cuts. Always move away from windows, mirrors, and heavy objects that can fall.',
        isCorrect: false, isSafe: false, safetyScore: 10, nextStepId: 'eq-2', responseTimeWeight: 0.5,
      },
      {
        id: 'eq-1d', text: 'Use the elevator to go to the ground floor',
        consequence: 'Never use an elevator during an earthquake! Elevators can get stuck, cables can break, and you could be trapped. Always use staircases for evacuation after shaking stops.',
        isCorrect: false, isSafe: false, safetyScore: 5, nextStepId: 'eq-2', responseTimeWeight: 0.3,
      },
    ],
    metadata: { disasterType: 'earthquake', difficulty: 'intermediate', phase: 'initial_response' },
  },
  {
    id: 'eq-2',
    situation: 'The shaking has stopped after about 30 seconds. Some ceiling tiles have fallen. There is dust in the air. Your teacher asks everyone to prepare for evacuation. What do you do first?',
    illustration: 'classroom_after_shaking',
    location: 'Classroom 204, Block B, First Floor',
    timeLimit: 20,
    choices: [
      {
        id: 'eq-2a', text: 'Quickly grab your bag and phone, then follow the teacher',
        consequence: 'During emergency evacuation, do not waste time collecting personal belongings. Every second counts. Leave immediately with only what you have in hand.',
        isCorrect: false, isSafe: true, safetyScore: 60, nextStepId: 'eq-3', responseTimeWeight: 0.7,
      },
      {
        id: 'eq-2b', text: 'Check for injuries among yourself and nearby classmates, then follow evacuation instructions',
        consequence: 'Good decision! Checking for injuries is important. If someone is seriously hurt, alert the teacher. Help classmates if possible, but do not delay evacuation significantly.',
        isCorrect: true, isSafe: true, safetyScore: 95, nextStepId: 'eq-3', responseTimeWeight: 0.9,
      },
      {
        id: 'eq-2c', text: 'Wait in the classroom until rescue teams arrive',
        consequence: 'While staying put can be safe during shaking, after it stops you should evacuate promptly. Aftershocks can cause further damage. Follow your teacher\'s evacuation instructions.',
        isCorrect: false, isSafe: true, safetyScore: 50, nextStepId: 'eq-3', responseTimeWeight: 0.4,
      },
      {
        id: 'eq-2d', text: 'Run ahead of everyone to the exit as fast as possible',
        consequence: 'Rushing and pushing during evacuation can cause stampedes and injuries. Move quickly but calmly. Follow the line and help others. Panic causes more harm than the disaster itself.',
        isCorrect: false, isSafe: false, safetyScore: 30, nextStepId: 'eq-3', responseTimeWeight: 0.6,
      },
    ],
    metadata: { disasterType: 'earthquake', difficulty: 'intermediate', phase: 'post_shaking' },
  },
  {
    id: 'eq-3',
    situation: 'You are now in the first-floor corridor of Block B. Your teacher is leading the class toward Staircase B. However, you notice that part of the corridor ceiling near Staircase B has collapsed, partially blocking the path. What should you do?',
    illustration: 'blocked_corridor',
    location: 'First Floor Corridor, Block B',
    timeLimit: 15,
    choices: [
      {
        id: 'eq-3a', text: 'Try to climb over the debris to reach Staircase B',
        consequence: 'Climbing over unstable debris is very dangerous. The structure could shift, and broken materials can cause injuries. Look for an alternative safe route instead.',
        isCorrect: false, isSafe: false, safetyScore: 15, nextStepId: 'eq-4', responseTimeWeight: 0.5,
      },
      {
        id: 'eq-3b', text: 'Alert your teacher and look for an alternative route — perhaps Staircase C in Block C',
        consequence: 'Excellent thinking! Immediately informing your teacher about the blocked path and suggesting an alternative route shows good situational awareness. Using an alternative staircase is the safest option.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: 'eq-4', responseTimeWeight: 1.0,
      },
      {
        id: 'eq-3c', text: 'Go back to the classroom and wait',
        consequence: 'Going back into the building increases your risk. Aftershocks could cause more damage. The priority is to get out of the building safely using any available exit.',
        isCorrect: false, isSafe: true, safetyScore: 40, nextStepId: 'eq-4', responseTimeWeight: 0.3,
      },
      {
        id: 'eq-3d', text: 'Jump from the first-floor window to the ground',
        consequence: 'Jumping from any height is extremely dangerous and can cause severe injuries like fractures or spinal injuries. Never jump from windows. Always use proper exit routes.',
        isCorrect: false, isSafe: false, safetyScore: 5, nextStepId: 'eq-4', responseTimeWeight: 0.2,
      },
    ],
    metadata: { disasterType: 'earthquake', difficulty: 'intermediate', phase: 'evacuation' },
  },
  {
    id: 'eq-4',
    situation: 'You have safely reached the ground floor through an alternative staircase. You exit the building and see the open ground ahead. Where should you go?',
    illustration: 'school_ground_evacuation',
    location: 'Ground Floor Exit, Block B',
    timeLimit: 10,
    choices: [
      {
        id: 'eq-4a', text: 'Go to the designated Assembly Point and report to the teacher in charge',
        consequence: 'Perfect! Going to the designated Assembly Point allows teachers to verify everyone is safe. Reporting your presence is critical for accountability during emergencies.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: 'eq-5', responseTimeWeight: 1.0,
      },
      {
        id: 'eq-4b', text: 'Go to the school parking lot and try to leave the school premises',
        consequence: 'Do not leave the school premises during an emergency. You need to be accounted for at the Assembly Point. Parents and guardians will be notified through official channels.',
        isCorrect: false, isSafe: true, safetyScore: 40, nextStepId: 'eq-5', responseTimeWeight: 0.5,
      },
      {
        id: 'eq-4c', text: 'Stand near the building wall to rest',
        consequence: 'Never stand near buildings after an earthquake. Aftershocks can cause walls to collapse. Always move to an open area away from all structures.',
        isCorrect: false, isSafe: false, safetyScore: 15, nextStepId: 'eq-5', responseTimeWeight: 0.3,
      },
      {
        id: 'eq-4d', text: 'Go back inside to get your phone and bag',
        consequence: 'Never re-enter a damaged building! The structure may be compromised and could collapse during aftershocks. Your safety is more important than any belongings.',
        isCorrect: false, isSafe: false, safetyScore: 5, nextStepId: 'eq-5', responseTimeWeight: 0.2,
      },
    ],
    metadata: { disasterType: 'earthquake', difficulty: 'intermediate', phase: 'assembly' },
  },
  {
    id: 'eq-5',
    situation: 'You are at the Assembly Point. Your teacher is taking roll call. A friend who was in the washroom during the earthquake has not arrived yet. Your teacher is busy coordinating. What do you do?',
    illustration: 'assembly_point',
    location: 'Assembly Point B',
    timeLimit: 15,
    choices: [
      {
        id: 'eq-5a', text: 'Go back into the building to look for your friend',
        consequence: 'Never go back into a damaged building on your own. You could put yourself at risk and create an additional missing person. Report the situation to your teacher or emergency responders.',
        isCorrect: false, isSafe: false, safetyScore: 10, nextStepId: null, responseTimeWeight: 0.4,
      },
      {
        id: 'eq-5b', text: 'Immediately inform your teacher that your friend is missing and tell them the last known location (washroom)',
        consequence: 'Excellent decision! Providing specific information about a missing person — who they are and where they might be — helps emergency responders act quickly and efficiently. This could save their life.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: null, responseTimeWeight: 1.0,
      },
      {
        id: 'eq-5c', text: 'Call your friend on their phone and tell them to come out',
        consequence: 'Calling is a reasonable first step, but phone networks often fail during disasters. Don\'t rely solely on this. You should still inform your teacher about the missing student so official search procedures can begin.',
        isCorrect: false, isSafe: true, safetyScore: 60, nextStepId: null, responseTimeWeight: 0.6,
      },
      {
        id: 'eq-5d', text: 'Do nothing — your friend will probably figure it out',
        consequence: 'Never assume someone is safe during a disaster. Your friend could be trapped or injured. Every missing person must be reported so they can be found and helped.',
        isCorrect: false, isSafe: true, safetyScore: 20, nextStepId: null, responseTimeWeight: 0.2,
      },
    ],
    metadata: { disasterType: 'earthquake', difficulty: 'intermediate', phase: 'post_evacuation' },
  },
];

// ═══════════════════════════════════════════════════════════════
// FIRE SIMULATION — Beginner
// ═══════════════════════════════════════════════════════════════
const fireSteps: ScenarioStep[] = [
  {
    id: 'fire-1',
    situation: 'You are in the Science Lab on the second floor of Block A during a Chemistry practical. You notice smoke coming from under the lab door and the fire alarm starts ringing. What is your immediate response?',
    illustration: 'lab_smoke',
    location: 'Science Lab, Block A, Second Floor',
    timeLimit: 12,
    choices: [
      {
        id: 'fire-1a', text: 'Open the lab door to check where the fire is',
        consequence: 'Never open a door if you suspect fire on the other side! Feel the door with the back of your hand first. If it\'s hot, the fire is nearby. Opening the door can let in flames and superheated air.',
        isCorrect: false, isSafe: false, safetyScore: 15, nextStepId: 'fire-2', responseTimeWeight: 0.6,
      },
      {
        id: 'fire-1b', text: 'Alert the teacher, feel the door for heat, and prepare for evacuation',
        consequence: 'Perfect response! Alerting the teacher ensures organized evacuation. Feeling the door helps determine if it\'s safe to use that exit. Being prepared to evacuate quickly can save lives.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: 'fire-2', responseTimeWeight: 1.0,
      },
      {
        id: 'fire-1c', text: 'Try to extinguish the fire yourself using lab chemicals',
        consequence: 'Never try to fight a fire with unknown chemicals — you could make it worse or cause an explosion. Only trained personnel should attempt to use fire extinguishers, and only on small, contained fires.',
        isCorrect: false, isSafe: false, safetyScore: 5, nextStepId: 'fire-2', responseTimeWeight: 0.3,
      },
      {
        id: 'fire-1d', text: 'Call 101 (Fire Services) on your mobile phone',
        consequence: 'Calling fire services is important, but your immediate priority is personal safety and evacuation. The school administration or teacher should coordinate emergency calls. Prioritize getting to safety first.',
        isCorrect: false, isSafe: true, safetyScore: 55, nextStepId: 'fire-2', responseTimeWeight: 0.5,
      },
    ],
    metadata: { disasterType: 'fire', difficulty: 'beginner', phase: 'initial_response' },
  },
  {
    id: 'fire-2',
    situation: 'The teacher feels the door — it is cool. They carefully open it. The corridor has some smoke but is passable. Your teacher instructs everyone to evacuate. How should you move through the smoky corridor?',
    illustration: 'smoky_corridor',
    location: 'Second Floor Corridor, Block A',
    timeLimit: 12,
    choices: [
      {
        id: 'fire-2a', text: 'Walk upright quickly through the corridor',
        consequence: 'Smoke and toxic gases rise upward. Walking upright means you breathe in more smoke, which can cause suffocation. You should crawl low under the smoke where cleaner air is available.',
        isCorrect: false, isSafe: false, safetyScore: 25, nextStepId: 'fire-3', responseTimeWeight: 0.5,
      },
      {
        id: 'fire-2b', text: 'Crawl low under the smoke, cover your nose and mouth with a cloth, and follow the evacuation signs',
        consequence: 'Excellent! Crawling keeps you below the smoke layer. Covering your nose and mouth with a wet cloth (if available) filters some toxins. Following evacuation signs ensures you reach the nearest safe exit.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: 'fire-3', responseTimeWeight: 1.0,
      },
      {
        id: 'fire-2c', text: 'Run as fast as possible through the corridor',
        consequence: 'Running through smoke increases your breathing rate, causing you to inhale more toxic fumes. It also increases the risk of tripping and falling. Move quickly but carefully, staying low.',
        isCorrect: false, isSafe: false, safetyScore: 30, nextStepId: 'fire-3', responseTimeWeight: 0.6,
      },
      {
        id: 'fire-2d', text: 'Go to the washroom and wait for rescue',
        consequence: 'Washrooms may seem like a refuge, but they can become a trap if the fire spreads. Unless all exits are blocked, your best option is to evacuate the building.',
        isCorrect: false, isSafe: true, safetyScore: 35, nextStepId: 'fire-3', responseTimeWeight: 0.3,
      },
    ],
    metadata: { disasterType: 'fire', difficulty: 'beginner', phase: 'evacuation' },
  },
  {
    id: 'fire-3',
    situation: 'You reach Staircase A. Your classmate says, "Let\'s take the elevator — it\'s faster!" Other students are already moving down the stairs. What do you do?',
    illustration: 'staircase_evacuation',
    location: 'Staircase A, Block A',
    timeLimit: 10,
    choices: [
      {
        id: 'fire-3a', text: 'Agree and take the elevator — speed matters',
        consequence: 'NEVER use elevators during a fire! Elevators can fill with smoke, lose power, or stop at the fire floor. This is one of the most dangerous things you can do during a fire emergency.',
        isCorrect: false, isSafe: false, safetyScore: 5, nextStepId: 'fire-4', responseTimeWeight: 0.3,
      },
      {
        id: 'fire-3b', text: 'Tell your classmate NOT to use the elevator and take the stairs together',
        consequence: 'You may have just saved your classmate\'s life. Elevator shafts act as chimneys during fires, filling with smoke and heat. Taking the stairs and helping others make the right choice is excellent emergency behavior.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: 'fire-4', responseTimeWeight: 1.0,
      },
      {
        id: 'fire-3c', text: 'Let your classmate take the elevator while you take the stairs',
        consequence: 'While you made a safe choice for yourself, you should also warn your classmate about the danger. In emergencies, helping others make safe decisions can prevent casualties.',
        isCorrect: false, isSafe: true, safetyScore: 50, nextStepId: 'fire-4', responseTimeWeight: 0.6,
      },
      {
        id: 'fire-3d', text: 'Go back to get a fire extinguisher from the lab',
        consequence: 'Do not go back toward the fire. Evacuation is the priority. Fire fighting should be left to trained firefighters. Your job is to get yourself and others to safety.',
        isCorrect: false, isSafe: false, safetyScore: 10, nextStepId: 'fire-4', responseTimeWeight: 0.2,
      },
    ],
    metadata: { disasterType: 'fire', difficulty: 'beginner', phase: 'evacuation' },
  },
  {
    id: 'fire-4',
    situation: 'You have safely evacuated Block A and reached the Assembly Point. You notice a junior student from another class is coughing heavily and seems to have inhaled smoke. What do you do?',
    illustration: 'assembly_point_fire',
    location: 'Assembly Point A',
    timeLimit: 15,
    choices: [
      {
        id: 'fire-4a', text: 'Ignore them — the teachers will handle it',
        consequence: 'While teachers and emergency personnel are in charge, you can still help by alerting them immediately. A student with smoke inhalation needs urgent medical attention.',
        isCorrect: false, isSafe: true, safetyScore: 30, nextStepId: null, responseTimeWeight: 0.3,
      },
      {
        id: 'fire-4b', text: 'Help the student sit down, alert a teacher, and provide fresh air',
        consequence: 'Outstanding response! Helping the student sit upright (not lie down, as this makes breathing harder), alerting a teacher for medical help, and ensuring fresh air flow are all correct first-aid actions for smoke inhalation.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: null, responseTimeWeight: 1.0,
      },
      {
        id: 'fire-4c', text: 'Give them water to drink immediately',
        consequence: 'While hydration can help, a person with severe smoke inhalation needs medical assessment first. Giving water is not harmful but is not the priority. Alert a teacher or medical personnel first.',
        isCorrect: false, isSafe: true, safetyScore: 55, nextStepId: null, responseTimeWeight: 0.5,
      },
      {
        id: 'fire-4d', text: 'Tell them to run around to "clear their lungs"',
        consequence: 'Physical exertion worsens smoke inhalation symptoms. The student needs to rest in fresh air and receive medical attention, not exercise.',
        isCorrect: false, isSafe: false, safetyScore: 10, nextStepId: null, responseTimeWeight: 0.2,
      },
    ],
    metadata: { disasterType: 'fire', difficulty: 'beginner', phase: 'post_evacuation' },
  },
];

// ═══════════════════════════════════════════════════════════════
// FLOOD SIMULATION — Beginner
// ═══════════════════════════════════════════════════════════════
const floodSteps: ScenarioStep[] = [
  {
    id: 'flood-1',
    situation: 'It has been raining heavily for 3 hours during school time. The school PA system announces: "Water is entering the ground floor of Block C. All students on the ground floor, move to upper floors immediately." You are in Classroom 106 on the ground floor of Block C. What do you do?',
    illustration: 'flood_warning',
    location: 'Classroom 106, Block C, Ground Floor',
    timeLimit: 15,
    choices: [
      {
        id: 'flood-1a', text: 'Immediately follow teacher instructions and move to the first floor via the staircase',
        consequence: 'Correct! When flood water is rising, moving to higher ground (upper floors) is the safest action. Follow your teacher and move in an orderly manner.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: 'flood-2', responseTimeWeight: 1.0,
      },
      {
        id: 'flood-1b', text: 'Try to leave the school building and go home',
        consequence: 'Very dangerous! Walking or driving through flood water is one of the leading causes of flood deaths. Even shallow moving water can knock you off your feet. Stay in the building and move upward.',
        isCorrect: false, isSafe: false, safetyScore: 10, nextStepId: 'flood-2', responseTimeWeight: 0.3,
      },
      {
        id: 'flood-1c', text: 'Stay in the classroom and put bags on the floor to stop water',
        consequence: 'Bags cannot stop rising flood water. If water is entering the ground floor, you need to evacuate upward immediately. Do not waste time trying to block water flow.',
        isCorrect: false, isSafe: false, safetyScore: 20, nextStepId: 'flood-2', responseTimeWeight: 0.4,
      },
      {
        id: 'flood-1d', text: 'Wait and watch how much water comes in before deciding',
        consequence: 'Flood water can rise very rapidly — from ankle-deep to waist-deep in minutes. Waiting to decide wastes critical evacuation time. Act immediately when warnings are given.',
        isCorrect: false, isSafe: false, safetyScore: 25, nextStepId: 'flood-2', responseTimeWeight: 0.3,
      },
    ],
    metadata: { disasterType: 'flood', difficulty: 'beginner', phase: 'initial_response' },
  },
  {
    id: 'flood-2',
    situation: 'You are now on the first floor. The water on the ground floor is rising. The electricity has been turned off as a safety measure. Your phone has 15% battery. What is your priority?',
    illustration: 'flood_upper_floor',
    location: 'First Floor, Block C',
    timeLimit: 20,
    choices: [
      {
        id: 'flood-2a', text: 'Use your phone to take videos of the flood for social media',
        consequence: 'Preserving battery life is critical during emergencies. Your phone may be your only way to call for help. Do not waste battery on non-essential activities.',
        isCorrect: false, isSafe: true, safetyScore: 20, nextStepId: 'flood-3', responseTimeWeight: 0.3,
      },
      {
        id: 'flood-2b', text: 'Stay calm, conserve phone battery for emergencies, and follow teacher instructions',
        consequence: 'Excellent! Staying calm prevents panic. Conserving battery ensures you can call for help if needed. Following teacher instructions keeps everyone coordinated and safe.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: 'flood-3', responseTimeWeight: 1.0,
      },
      {
        id: 'flood-2c', text: 'Try to swim down to the ground floor to get your things',
        consequence: 'Extremely dangerous! Flood water is contaminated and can contain debris, chemicals, and sewage. Even strong swimmers can be swept away. Never enter flood water voluntarily.',
        isCorrect: false, isSafe: false, safetyScore: 5, nextStepId: 'flood-3', responseTimeWeight: 0.2,
      },
      {
        id: 'flood-2d', text: 'Break a window to signal for help',
        consequence: 'Breaking windows is not yet necessary and creates hazards (broken glass, rain entry). If you need to signal for help, use your phone, wave cloth from a window, or shout. Save destructive measures for extreme situations.',
        isCorrect: false, isSafe: true, safetyScore: 35, nextStepId: 'flood-3', responseTimeWeight: 0.4,
      },
    ],
    metadata: { disasterType: 'flood', difficulty: 'beginner', phase: 'shelter_in_place' },
  },
  {
    id: 'flood-3',
    situation: 'After 2 hours, the rain has slowed. NDRF rescue boats are approaching the school. The team asks everyone to evacuate floor by floor. What should you do?',
    illustration: 'flood_rescue',
    location: 'First Floor, Block C',
    timeLimit: 15,
    choices: [
      {
        id: 'flood-3a', text: 'Follow the rescue team\'s instructions exactly and evacuate in the order they specify',
        consequence: 'Perfect! Rescue teams have training and know the safest evacuation order. Following their instructions ensures everyone\'s safety and allows efficient evacuation.',
        isCorrect: true, isSafe: true, safetyScore: 100, nextStepId: null, responseTimeWeight: 1.0,
      },
      {
        id: 'flood-3b', text: 'Jump into the rescue boat immediately — first come, first served',
        consequence: 'Rushing and pushing to get into rescue boats can capsize them and endanger everyone. Rescue teams prioritize injured and younger students. Wait for your turn patiently.',
        isCorrect: false, isSafe: false, safetyScore: 25, nextStepId: null, responseTimeWeight: 0.4,
      },
      {
        id: 'flood-3c', text: 'Refuse to leave and stay in the building until water goes down',
        consequence: 'The building structure may be weakened by prolonged flooding. If rescue teams are evacuating, it means conditions warrant it. Follow their professional judgment.',
        isCorrect: false, isSafe: true, safetyScore: 35, nextStepId: null, responseTimeWeight: 0.3,
      },
      {
        id: 'flood-3d', text: 'Try to wade through the water on your own to reach higher ground outside',
        consequence: 'Walking through flood water is extremely dangerous. You cannot see what\'s beneath the surface — open manholes, debris, snakes, or electrical hazards. Always use provided rescue transportation.',
        isCorrect: false, isSafe: false, safetyScore: 10, nextStepId: null, responseTimeWeight: 0.2,
      },
    ],
    metadata: { disasterType: 'flood', difficulty: 'beginner', phase: 'rescue' },
  },
];

export const scenarios: Scenario[] = [
  {
    id: 'scenario-disaster-adventure',
    title: 'Disaster Adventure',
    disasterType: 'earthquake',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    description: 'An interactive comic-book style adventure where your choices dictate survival.',
    location: 'Various',
    engineType: 'external',
    url: '/games/disaster-adventure/index.html',
    steps: [],
  },
  {
    id: 'scenario-resqverse-pro',
    title: 'ResQVerse PRO',
    disasterType: 'fire',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    description: 'A 3D simulation training ground for disaster survival.',
    location: 'Training Facility',
    engineType: 'external',
    url: '/games/resqverse-pro/index.html',
    steps: [],
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find(s => s.id === id);
}

export function getScenariosByDisaster(type: string): Scenario[] {
  return scenarios.filter(s => s.disasterType === type);
}
