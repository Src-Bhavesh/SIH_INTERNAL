const fs = require('fs');
const FILE_PATH = 'public/games/disaster-adventure/assets/index-CL94Vmsf.js';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const additionalQuestions = {
  aftershock: {
    dialogue: {
      id: "scene_5_bonus",
      speaker: "Meera",
      text: "The shaking has completely stopped now. We need to evaluate our surroundings.",
    },
    choice: {
      id: "scene_6_bonus_choice",
      type: "choice",
      speaker: "Ishaan",
      question: "It's safe to move now. Should we use the elevator to get out quickly?",
      options: [
        {
          id: "opt_1_b",
          text: "No, always use the stairs after an earthquake.",
          isCorrect: true
        },
        {
          id: "opt_2_b",
          text: "Yes, it's faster to take the elevator.",
          isCorrect: false,
          feedbackNarrative: [
            { speaker: "Narrator", text: "Elevators can get stuck or plummet if cables were damaged or power fails.", soundCue: "wrong" }
          ],
          safetyTip: {
            title: "Elevator Danger",
            text: "Never use an elevator during or immediately after an earthquake. Always use stairs."
          }
        }
      ]
    }
  },
  chemical: {
    dialogue: {
      id: "scene_5_bonus",
      speaker: "Mr. Sharma",
      text: "We evacuated upwind and avoided the fumes. Now we need to report it.",
    },
    choice: {
      id: "scene_6_bonus_choice",
      type: "choice",
      speaker: "Ishaan",
      question: "Should we try to clean it up ourselves to save time?",
      options: [
        {
          id: "opt_1_b",
          text: "No, wait for hazmat professionals to handle the spill.",
          isCorrect: true
        },
        {
          id: "opt_2_b",
          text: "Yes, grab a mop and bucket quickly.",
          isCorrect: false,
          feedbackNarrative: [
            { speaker: "Narrator", text: "Chemical spills require special neutralizers and protective gear. Standard mops can cause dangerous reactions.", soundCue: "wrong" }
          ],
          safetyTip: {
            title: "Professional Cleanup",
            text: "Never attempt to clean a hazardous chemical spill without proper training and equipment."
          }
        }
      ]
    }
  },
  cyclone: {
    dialogue: {
      id: "scene_5_bonus",
      speaker: "Principal",
      text: "We are inside the designated safe room. The wind is howling outside.",
    },
    choice: {
      id: "scene_6_bonus_choice",
      type: "choice",
      speaker: "Meera",
      question: "The wind suddenly stopped and it's quiet outside. Should we go out and check?",
      options: [
        {
          id: "opt_1_b",
          text: "No, it might just be the eye of the storm.",
          isCorrect: true
        },
        {
          id: "opt_2_b",
          text: "Yes, the cyclone must be over.",
          isCorrect: false,
          feedbackNarrative: [
            { speaker: "Narrator", text: "The 'eye' of a cyclone brings a temporary calm, but destructive winds will return from the opposite direction soon.", soundCue: "wrong" }
          ],
          safetyTip: {
            title: "The Eye of the Storm",
            text: "Stay in your shelter until authorities officially declare the cyclone has passed."
          }
        }
      ]
    }
  },
  earthquake: {
    dialogue: {
      id: "scene_5_bonus",
      speaker: "Ishaan",
      text: "Wow, that was intense. I held onto the desk legs until it stopped.",
    },
    choice: {
      id: "scene_6_bonus_choice",
      type: "choice",
      speaker: "Meera",
      question: "The shaking has stopped. What should we do next before leaving the room?",
      options: [
        {
          id: "opt_1_b",
          text: "Check ourselves and others for injuries, then evacuate calmly.",
          isCorrect: true
        },
        {
          id: "opt_2_b",
          text: "Quickly pack all our books and bags before leaving.",
          isCorrect: false,
          feedbackNarrative: [
            { speaker: "Narrator", text: "Wasting time gathering belongings puts you at risk of falling debris from aftershocks.", soundCue: "wrong" }
          ],
          safetyTip: {
            title: "Leave Belongings Behind",
            text: "In any evacuation, your life is more important than your possessions. Evacuate immediately."
          }
        }
      ]
    }
  },
  fire: {
    dialogue: {
      id: "scene_5_bonus",
      speaker: "Mr. Sharma",
      text: "We crawled under the smoke and reached the door.",
    },
    choice: {
      id: "scene_6_bonus_choice",
      type: "choice",
      speaker: "Ishaan",
      question: "The door is closed. How should we open it?",
      options: [
        {
          id: "opt_1_b",
          text: "Feel the door and doorknob with the back of my hand first.",
          isCorrect: true
        },
        {
          id: "opt_2_b",
          text: "Grab the handle and open it as fast as possible.",
          isCorrect: false,
          feedbackNarrative: [
            { speaker: "Narrator", text: "If there is fire on the other side, the handle could be blazing hot and burn your hand severely.", soundCue: "wrong" }
          ],
          safetyTip: {
            title: "Check for Heat",
            text: "Always use the back of your hand to feel a closed door before opening it during a fire."
          }
        }
      ]
    }
  },
  flood: {
    dialogue: {
      id: "scene_5_bonus",
      speaker: "Meera",
      text: "We reached the higher floors safely. The water is still rising outside.",
    },
    choice: {
      id: "scene_6_bonus_choice",
      type: "choice",
      speaker: "Ishaan",
      question: "I see some electronic devices plugged in near the water level downstairs. What should we do?",
      options: [
        {
          id: "opt_1_b",
          text: "Ask a teacher to turn off the main power switch if it's safe and dry to do so.",
          isCorrect: true
        },
        {
          id: "opt_2_b",
          text: "Wade into the water to unplug the devices ourselves.",
          isCorrect: false,
          feedbackNarrative: [
            { speaker: "Narrator", text: "Water is an excellent conductor of electricity. Entering flooded areas with active electronics can cause electrocution.", soundCue: "wrong" }
          ],
          safetyTip: {
            title: "Electrocution Risk",
            text: "Never step into floodwater if there are submerged electrical outlets or appliances."
          }
        }
      ]
    }
  },
  lockdown: {
    dialogue: {
      id: "scene_5_bonus",
      speaker: "Ms. Gupta",
      text: "Great job staying out of sight and turning off the lights.",
    },
    choice: {
      id: "scene_6_bonus_choice",
      type: "choice",
      speaker: "Meera",
      question: "I hear the fire alarm going off now. Should we evacuate?",
      options: [
        {
          id: "opt_1_b",
          text: "No, ignore the alarm and stay hidden unless we see fire or smoke.",
          isCorrect: true
        },
        {
          id: "opt_2_b",
          text: "Yes, always follow the fire alarm immediately.",
          isCorrect: false,
          feedbackNarrative: [
            { speaker: "Narrator", text: "During a security lockdown, an intruder might pull the fire alarm to force people out into the hallways.", soundCue: "wrong" }
          ],
          safetyTip: {
            title: "Lockdown vs. Fire Alarm",
            text: "In a lockdown, do not evacuate for a fire alarm unless you are in immediate danger from fire."
          }
        }
      ]
    }
  }
};

const games = [
  { id: 'aftershock', key: 'aftershock' },
  { id: 'chemical', key: 'chemical' },
  { id: 'cyclone', key: 'cyclone' },
  { id: 'earthquake', key: 'earthquake' },
  { id: 'fire', key: 'fire' },
  { id: 'flood', key: 'flood' },
  { id: 'lockdown', key: 'lockdown' }
];

for (const game of games) {
  const marker = `id: \`${game.id}\`,`;
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) {
    console.log(`Could not find ${game.id}`);
    continue;
  }
  
  // From startIdx, find `scenes: [`
  const scenesStart = content.indexOf('scenes: [', startIdx);
  
  // We want to find the matching `],` for `scenes: [`
  let bracketCount = 1;
  let currIdx = scenesStart + 'scenes: ['.length;
  
  while (bracketCount > 0 && currIdx < content.length) {
    if (content[currIdx] === '[') bracketCount++;
    if (content[currIdx] === ']') bracketCount--;
    currIdx++;
  }
  
  // currIdx is now exactly after the `]` of scenes array.
  // Let's go back 1 character so we can insert BEFORE the `]`
  const insertIdx = currIdx - 1;
  
  const q = additionalQuestions[game.key];
  const newScenesStr = `,
      {
        id: \`${q.dialogue.id}\`,
        speaker: \`${q.dialogue.speaker}\`,
        text: \`${q.dialogue.text.replace(/'/g, "\\'")}\`,
      },
      {
        id: \`${q.choice.id}\`,
        type: \`choice\`,
        speaker: \`${q.choice.speaker}\`,
        question: \`${q.choice.question.replace(/'/g, "\\'")}\`,
        options: [
          {
            id: \`${q.choice.options[0].id}\`,
            text: \`${q.choice.options[0].text.replace(/'/g, "\\'")}\`,
            isCorrect: !0,
          },
          {
            id: \`${q.choice.options[1].id}\`,
            text: \`${q.choice.options[1].text.replace(/'/g, "\\'")}\`,
            isCorrect: !1,
            feedbackNarrative: [
              {
                speaker: \`${q.choice.options[1].feedbackNarrative[0].speaker}\`,
                text: \`${q.choice.options[1].feedbackNarrative[0].text.replace(/'/g, "\\'")}\`,
                soundCue: \`${q.choice.options[1].feedbackNarrative[0].soundCue}\`,
              },
            ],
            safetyTip: {
              title: \`${q.choice.options[1].safetyTip.title}\`,
              text: \`${q.choice.options[1].safetyTip.text.replace(/'/g, "\\'")}\`,
            },
          },
        ],
      }`;

  content = content.substring(0, insertIdx) + newScenesStr + content.substring(insertIdx);
  console.log(`Patched ${game.id}`);
}

fs.writeFileSync(FILE_PATH, content);
console.log('All done!');
