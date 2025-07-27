// Sample data based on the Street Outreach & Rescue guide structure
export const sampleLibraryData = {
  columnHeaders: {
    goals: "Big Goals",
    steps: "Milestones", 
    tasks: "Targets",
    initiatives: "Action Steps"
  },
  goals: [
    {
      id: "9000000000001",
      title: "Win trust on the street",
      completed: false,
      priority: 1,
      orderIndex: 1,
      steps: [
        {
          id: "9000000000010",
          goalId: "9000000000001",
          title: "Daily friendly presence",
          completed: false,
          priority: 1,
          orderIndex: 1,
          tasks: [
            {
              id: "9000000000020",
              stepId: "9000000000010",
              title: "Map hotspots",
              completed: false,
              priority: 1,
              orderIndex: 1,
              initiatives: [
                {
                  id: "9000000000030",
                  taskId: "9000000000020",
                  title: "Walk the neighbourhood at dawn, noon, and dusk to mark exact sleep and play spots.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Closeness:Stranger", "TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 180,
                    needs: ["map", "markers"]
                  }
                },
                {
                  id: "9000000000031",
                  taskId: "9000000000020",
                  title: "Place colour stickers on a big paper map for sleep, play, and selling points.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Closeness:Stranger", "TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 60,
                    needs: ["paper map", "colored stickers"]
                  }
                },
                {
                  id: "9000000000032",
                  taskId: "9000000000020",
                  title: "Write busiest hours beside every sticker so staff know the best visit time.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Closeness:Stranger", "TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 45,
                    needs: ["pen", "notebook"]
                  }
                },
                {
                  id: "9000000000033",
                  taskId: "9000000000020",
                  title: "Update the map each Sunday after asking children about new or unsafe places.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Closeness:New", "TimeImpact:Days"],
                    closenessMin: 2,
                    estEffortMins: 60,
                    needs: ["map", "markers"]
                  }
                }
              ]
            },
            {
              id: "9000000000021",
              stepId: "9000000000010",
              title: "Set visit routine",
              completed: false,
              priority: 2,
              orderIndex: 2,
              initiatives: [
                {
                  id: "9000000000034",
                  taskId: "9000000000021",
                  title: "Pick two fixed visit times and post them in the office for all staff.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["TimeImpact:Days"],
                    closenessMin: 1,
                    estEffortMins: 30,
                    needs: ["schedule board"]
                  }
                },
                {
                  id: "9000000000035",
                  taskId: "9000000000021",
                  title: "Send the same two workers so faces become trusted and known.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Closeness:New", "TimeImpact:Days"],
                    closenessMin: 2,
                    estEffortMins: 120,
                    needs: []
                  }
                },
                {
                  id: "9000000000036",
                  taskId: "9000000000021",
                  title: "Carry a bright yellow bag so children spot you from far and feel calm.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 10,
                    needs: ["yellow bag"]
                  }
                },
                {
                  id: "9000000000037",
                  taskId: "9000000000021",
                  title: "End each visit saying, \"See you tomorrow at …\" and keep that promise.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Closeness:New", "TimeImpact:Days"],
                    closenessMin: 2,
                    estEffortMins: 5,
                    needs: []
                  }
                }
              ]
            },
            {
              id: "9000000000022",
              stepId: "9000000000010",
              title: "Learn each child",
              completed: false,
              priority: 3,
              orderIndex: 3,
              initiatives: [
                {
                  id: "9000000000038",
                  taskId: "9000000000022",
                  title: "Greet every child by name or nickname; ask one friendly personal question.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Closeness:New", "TimeImpact:Hours"],
                    closenessMin: 2,
                    estEffortMins: 30,
                    needs: []
                  }
                },
                {
                  id: "9000000000039",
                  taskId: "9000000000022",
                  title: "Write names, guessed ages, favourite snacks, and health signs in a small notebook.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Closeness:New", "TimeImpact:Hours"],
                    closenessMin: 2,
                    estEffortMins: 45,
                    needs: ["notebook", "pen"]
                  }
                },
                {
                  id: "9000000000040",
                  taskId: "9000000000022",
                  title: "Double‑check spellings by asking friends or the child to repeat slowly.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 15,
                    needs: ["notebook"]
                  }
                },
                {
                  id: "9000000000041",
                  taskId: "9000000000022",
                  title: "Review notes nightly with team to keep facts fresh and avoid mix‑ups.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 30,
                    needs: ["notebook"]
                  }
                }
              ]
            },
            {
              id: "9000000000023",
              stepId: "9000000000010",
              title: "Start fun games",
              completed: false,
              priority: 4,
              orderIndex: 4,
              initiatives: [
                {
                  id: "9000000000042",
                  taskId: "9000000000023",
                  title: "Bring a mini football and start a short kick‑around at the same hour daily.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Football", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 30,
                    needs: ["mini football"]
                  }
                },
                {
                  id: "9000000000043",
                  taskId: "9000000000023",
                  title: "Teach a clapping rhyme that pulls shy kids to join partners.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Music", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 20,
                    needs: []
                  }
                },
                {
                  id: "9000000000044",
                  taskId: "9000000000023",
                  title: "Let children vote Friday game to show their choice matters.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Games", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 15,
                    needs: ["voting tokens"]
                  }
                },
                {
                  id: "9000000000045",
                  taskId: "9000000000023",
                  title: "Hand out fruit slices to helpers who set up or pack away the game.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Materials:Food", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 10,
                    needs: ["fruit", "knife"]
                  }
                }
              ]
            }
          ]
        },
        {
          id: "9000000000011",
          goalId: "9000000000001",
          title: "Understand street life",
          completed: false,
          priority: 2,
          orderIndex: 2,
          tasks: [
            {
              id: "9000000000024",
              stepId: "9000000000011",
              title: "Hear life story",
              completed: false,
              priority: 1,
              orderIndex: 1,
              initiatives: [
                {
                  id: "9000000000046",
                  taskId: "9000000000024",
                  title: "Offer blank timeline cards so children place stickers for home, first street night, today.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Trauma", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 45,
                    needs: ["timeline cards", "stickers"]
                  }
                },
                {
                  id: "9000000000047",
                  taskId: "9000000000024",
                  title: "Listen without interrupting and repeat key points to show real care.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Trauma", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 30,
                    needs: []
                  }
                },
                {
                  id: "9000000000048",
                  taskId: "9000000000024",
                  title: "Ask what made each move hard or easy; note their exact words.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Trauma", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 20,
                    needs: ["notebook", "pen"]
                  }
                },
                {
                  id: "9000000000049",
                  taskId: "9000000000024",
                  title: "Gift a coloured pencil as thanks so the child sees their story valued.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Art", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 5,
                    needs: ["colored pencils"]
                  }
                }
              ]
            },
            {
              id: "9000000000025",
              stepId: "9000000000011",
              title: "Respect street rules",
              completed: false,
              priority: 2,
              orderIndex: 2,
              initiatives: [
                {
                  id: "9000000000050",
                  taskId: "9000000000025",
                  title: "Ask children to explain their own rules about food sharing and quarrels.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Materials:Food", "Violence", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 30,
                    needs: []
                  }
                },
                {
                  id: "9000000000051",
                  taskId: "9000000000025",
                  title: "Watch older kids settle fights and write down the steps they use.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Violence", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 45,
                    needs: ["notebook", "pen"]
                  }
                },
                {
                  id: "9000000000052",
                  taskId: "9000000000025",
                  title: "Tell staff never to break these rules except for safety reasons.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 20,
                    needs: []
                  }
                },
                {
                  id: "9000000000053",
                  taskId: "9000000000025",
                  title: "Praise any child who keeps group rules even when hungry or angry.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 5,
                    needs: []
                  }
                }
              ]
            },
            {
              id: "9000000000026",
              stepId: "9000000000011",
              title: "Spot peer leaders",
              completed: false,
              priority: 3,
              orderIndex: 3,
              initiatives: [
                {
                  id: "9000000000054",
                  taskId: "9000000000026",
                  title: "Observe who others follow when moving or choosing meals.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Materials:Food", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 60,
                    needs: ["notebook"]
                  }
                },
                {
                  id: "9000000000055",
                  taskId: "9000000000026",
                  title: "Invite that leader to hold the game ball or give out fruit first.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Games", "Materials:Food", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 15,
                    needs: ["ball", "fruit"]
                  }
                },
                {
                  id: "9000000000056",
                  taskId: "9000000000026",
                  title: "Chat privately to learn the leader's hopes and fears for partnership later.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 30,
                    needs: []
                  }
                },
                {
                  id: "9000000000057",
                  taskId: "9000000000026",
                  title: "Avoid giving leaders money so power cannot be misused.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 5,
                    needs: []
                  }
                }
              ]
            },
            {
              id: "9000000000027",
              stepId: "9000000000011",
              title: "Track risk signs",
              completed: false,
              priority: 4,
              orderIndex: 4,
              initiatives: [
                {
                  id: "9000000000058",
                  taskId: "9000000000027",
                  title: "Create a colour sheet: green = calm, amber = upset, red = danger.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 15,
                    needs: ["colored paper", "markers"]
                  }
                },
                {
                  id: "9000000000059",
                  taskId: "9000000000027",
                  title: "After each visit, tick a colour for every child in the notebook.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 10,
                    needs: ["notebook", "colored pens"]
                  }
                },
                {
                  id: "9000000000060",
                  taskId: "9000000000027",
                  title: "Alert supervisor if a child gets two red ticks the same week.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 5,
                    needs: []
                  }
                },
                {
                  id: "9000000000061",
                  taskId: "9000000000027",
                  title: "Review colours every Friday to plan help for high‑risk kids.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 30,
                    needs: ["notebook"]
                  }
                }
              ]
            }
          ]
        },
        {
          id: "9000000000012",
          goalId: "9000000000001",
          title: "Crisis support moments",
          completed: false,
          priority: 3,
          orderIndex: 3,
          tasks: [
            {
              id: "9000000000028",
              stepId: "9000000000012",
              title: "Fast first aid",
              completed: false,
              priority: 1,
              orderIndex: 1,
              initiatives: [
                {
                  id: "9000000000062",
                  taskId: "9000000000028",
                  title: "Carry belt pouch with bandages, wipes, and pain tablets at all times.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Health", "TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 15,
                    needs: ["first aid kit", "belt pouch"]
                  }
                },
                {
                  id: "9000000000063",
                  taskId: "9000000000028",
                  title: "Clean small cuts right away while explaining each step softly.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Health", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 10,
                    needs: ["first aid kit"]
                  }
                },
                {
                  id: "9000000000064",
                  taskId: "9000000000028",
                  title: "Add a fun sticker bandage so the child smiles after care.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Health", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 5,
                    needs: ["sticker bandages"]
                  }
                },
                {
                  id: "9000000000065",
                  taskId: "9000000000028",
                  title: "Write injury, date, and follow‑up plan in first‑aid log.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Health", "TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 5,
                    needs: ["first aid log", "pen"]
                  }
                }
              ]
            },
            {
              id: "9000000000029",
              stepId: "9000000000012",
              title: "Police‑raid follow‑up",
              completed: false,
              priority: 2,
              orderIndex: 2,
              initiatives: [
                {
                  id: "9000000000066",
                  taskId: "9000000000029",
                  title: "Visit raid spot within six hours and count missing kids.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["PoliceRaid", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 60,
                    needs: ["notebook"]
                  }
                },
                {
                  id: "9000000000067",
                  taskId: "9000000000029",
                  title: "Speak calmly with police to learn where children went.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["PoliceRaid", "TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 30,
                    needs: []
                  }
                },
                {
                  id: "9000000000068",
                  taskId: "9000000000029",
                  title: "Tell peers where friends are and what help is coming.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["PoliceRaid", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 20,
                    needs: []
                  }
                },
                {
                  id: "9000000000069",
                  taskId: "9000000000029",
                  title: "Visit any child held by police within 24 hours.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["PoliceRaid", "TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 120,
                    needs: ["ID card", "water", "snacks"]
                  }
                }
              ]
            },
            {
              id: "9000000000030",
              stepId: "9000000000012",
              title: "Shortage support",
              completed: false,
              priority: 3,
              orderIndex: 3,
              initiatives: [
                {
                  id: "9000000000070",
                  taskId: "9000000000030",
                  title: "Bring extra water and bread when glue or food is scarce.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Glue", "Materials:Food", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 30,
                    needs: ["water bottles", "bread"]
                  }
                },
                {
                  id: "9000000000071",
                  taskId: "9000000000030",
                  title: "Urge kids to drink water first to ease sniffing urge.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Glue", "Health", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 10,
                    needs: ["water bottles"]
                  }
                },
                {
                  id: "9000000000072",
                  taskId: "9000000000030",
                  title: "Share safe breathing tips for glue withdrawal pains.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Glue", "Health", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 15,
                    needs: []
                  }
                },
                {
                  id: "9000000000073",
                  taskId: "9000000000030",
                  title: "Track how many kids accept help and adjust next visit.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours"],
                    closenessMin: 1,
                    estEffortMins: 10,
                    needs: ["notebook", "pen"]
                  }
                }
              ]
            },
            {
              id: "9000000000031",
              stepId: "9000000000012",
              title: "Night safety checks",
              completed: false,
              priority: 4,
              orderIndex: 4,
              initiatives: [
                {
                  id: "9000000000074",
                  taskId: "9000000000031",
                  title: "Walk sleep spots twice a week after 9 p.m. with two staff.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 120,
                    needs: ["flashlight"]
                  }
                },
                {
                  id: "9000000000075",
                  taskId: "9000000000031",
                  title: "Use soft flashlight and whisper greetings to avoid panic.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 5,
                    needs: ["flashlight"]
                  }
                },
                {
                  id: "9000000000076",
                  taskId: "9000000000031",
                  title: "Count heads and watch for fever or hard breathing.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Health", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 30,
                    needs: ["notebook"]
                  }
                },
                {
                  id: "9000000000077",
                  taskId: "9000000000031",
                  title: "Leave hotline card near each bedroll for later help.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 15,
                    needs: ["hotline cards"]
                  }
                }
              ]
            }
          ]
        },
        {
          id: "9000000000013",
          goalId: "9000000000001",
          title: "First taste of centre",
          completed: false,
          priority: 4,
          orderIndex: 4,
          tasks: [
            {
              id: "9000000000032",
              stepId: "9000000000013",
              title: "Two‑hour visits",
              completed: false,
              priority: 1,
              orderIndex: 1,
              initiatives: [
                {
                  id: "9000000000078",
                  taskId: "9000000000032",
                  title: "Arrange minivan pick‑up at 2 p.m. when glue craving is low.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Glue", "Materials:Transport", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 60,
                    needs: ["minivan", "driver"]
                  }
                },
                {
                  id: "9000000000079",
                  taskId: "9000000000032",
                  title: "Let children choose the first centre game to try.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Games", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 30,
                    needs: ["game options"]
                  }
                },
                {
                  id: "9000000000080",
                  taskId: "9000000000032",
                  title: "Serve hot meal with two sauce options so kids feel control.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Materials:Food", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 45,
                    needs: ["hot meal", "sauces"]
                  }
                },
                {
                  id: "9000000000081",
                  taskId: "9000000000032",
                  title: "Print group photo and gift each child as memory.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 20,
                    needs: ["camera", "printer", "photo paper"]
                  }
                }
              ]
            },
            {
              id: "9000000000033",
              stepId: "9000000000013",
              title: "Overnight tests",
              completed: false,
              priority: 2,
              orderIndex: 2,
              initiatives: [
                {
                  id: "9000000000082",
                  taskId: "9000000000033",
                  title: "Offer Friday night stay with promise to leave Saturday noon.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["TimeImpact:Days", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 960,
                    needs: ["bed", "bedding"]
                  }
                },
                {
                  id: "9000000000083",
                  taskId: "9000000000033",
                  title: "Place child in dorm with outreach worker in nearby room.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["TimeImpact:Days", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 30,
                    needs: []
                  }
                },
                {
                  id: "9000000000084",
                  taskId: "9000000000033",
                  title: "Keep night light on and door unlocked to cut prison fears.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Trauma", "TimeImpact:Days", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 10,
                    needs: ["night light"]
                  }
                },
                {
                  id: "9000000000085",
                  taskId: "9000000000033",
                  title: "Review sleep notes with the child next day and plan next step.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 20,
                    needs: ["sleep notes", "pen"]
                  }
                }
              ]
            },
            {
              id: "9000000000034",
              stepId: "9000000000013",
              title: "Praise first stay",
              completed: false,
              priority: 3,
              orderIndex: 3,
              initiatives: [
                {
                  id: "9000000000086",
                  taskId: "9000000000034",
                  title: "Give child a woven bracelet earned only by stayers.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 10,
                    needs: ["woven bracelets"]
                  }
                },
                {
                  id: "9000000000087",
                  taskId: "9000000000034",
                  title: "Gather other kids to clap and chant the child's name.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 15,
                    needs: []
                  }
                },
                {
                  id: "9000000000088",
                  taskId: "9000000000034",
                  title: "Stick smiling photo on a 'Brave Moves' board in street spot.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 30,
                    needs: ["photos", "board", "tape"]
                  }
                },
                {
                  id: "9000000000089",
                  taskId: "9000000000034",
                  title: "Offer call to one street friend to share good news.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 15,
                    needs: ["phone"]
                  }
                }
              ]
            },
            {
              id: "9000000000035",
              stepId: "9000000000013",
              title: "Street celebration",
              completed: false,
              priority: 4,
              orderIndex: 4,
              initiatives: [
                {
                  id: "9000000000090",
                  taskId: "9000000000035",
                  title: "Hold sidewalk party with music from a phone speaker.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Music", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 60,
                    needs: ["phone", "speaker"]
                  }
                },
                {
                  id: "9000000000091",
                  taskId: "9000000000035",
                  title: "Hand out fruit kebabs while praising each visitor by name.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Materials:Food", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 30,
                    needs: ["fruit", "skewers"]
                  }
                },
                {
                  id: "9000000000092",
                  taskId: "9000000000035",
                  title: "Let street kids ask questions about centre freely.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 45,
                    needs: []
                  }
                },
                {
                  id: "9000000000093",
                  taskId: "9000000000035",
                  title: "Invite next three curious kids for coming Friday stay.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 20,
                    needs: ["invitation cards"]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "9000000000002",
      title: "Remove street barriers",
      completed: false,
      priority: 2,
      orderIndex: 2,
      steps: [
        {
          id: "9000000000014",
          goalId: "9000000000002",
          title: "Cut glue and danger",
          completed: false,
          priority: 1,
          orderIndex: 1,
          tasks: [
            {
              id: "9000000000036",
              stepId: "9000000000014",
              title: "Talk about glue",
              completed: false,
              priority: 1,
              orderIndex: 1,
              initiatives: [
                {
                  id: "9000000000094",
                  taskId: "9000000000036",
                  title: "Sit on the curb and ask the child what glue does for them in their own words.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Glue", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 30,
                    needs: []
                  }
                },
                {
                  id: "9000000000095",
                  taskId: "9000000000036",
                  title: "Show a drawing of lungs and explain gently how fumes hurt the body over time.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Glue", "Health", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 20,
                    needs: ["lung drawings"]
                  }
                },
                {
                  id: "9000000000096",
                  taskId: "9000000000036",
                  title: "Agree on a hand signal the child can use when a strong craving starts so staff can help.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Glue", "TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 15,
                    needs: []
                  }
                },
                {
                  id: "9000000000097",
                  taskId: "9000000000036",
                  title: "Thank the child for honesty with a bottle of water and a slice of fruit.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Glue", "Materials:Food", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 5,
                    needs: ["water bottle", "fruit"]
                  }
                }
              ]
            },
            {
              id: "9000000000037",
              stepId: "9000000000014",
              title: "Offer clean hours",
              completed: false,
              priority: 2,
              orderIndex: 2,
              initiatives: [
                {
                  id: "9000000000098",
                  taskId: "9000000000037",
                  title: "Start a 30‑minute football match right after lunch when sniff urges are lower.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Glue", "Football", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 45,
                    needs: ["football"]
                  }
                },
                {
                  id: "9000000000099",
                  taskId: "9000000000037",
                  title: "Hand each player a wet cloth to wipe face and reset sense of smell before play.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Glue", "Health", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 10,
                    needs: ["wet cloths"]
                  }
                },
                {
                  id: "9000000000100",
                  taskId: "9000000000037",
                  title: "Mark start and end times on a big clock so the goal of a 'clean hour' is clear.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Glue", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 5,
                    needs: ["big clock"]
                  }
                },
                {
                  id: "9000000000101",
                  taskId: "9000000000037",
                  title: "Give a high‑five and a bright sticker to every child who finishes the game without glue.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Glue", "TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 5,
                    needs: ["stickers"]
                  }
                }
              ]
            },
            {
              id: "9000000000038",
              stepId: "9000000000014",
              title: "Plan safe detox",
              completed: false,
              priority: 3,
              orderIndex: 3,
              initiatives: [
                {
                  id: "9000000000102",
                  taskId: "9000000000038",
                  title: "Explain the two‑day headache and sad feelings that may come when stopping glue.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Glue", "Health", "TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 20,
                    needs: []
                  }
                },
                {
                  id: "9000000000103",
                  taskId: "9000000000038",
                  title: "Show the child a quiet dorm photo where they can rest during tough moments.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Glue", "Health", "TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 15,
                    needs: ["dorm photos"]
                  }
                },
                {
                  id: "9000000000104",
                  taskId: "9000000000038",
                  title: "Prepare basic pain syrup and warm ginger tea to ease stomach pains the first night.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Glue", "Health", "TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 30,
                    needs: ["pain syrup", "ginger tea"]
                  }
                },
                {
                  id: "9000000000105",
                  taskId: "9000000000038",
                  title: "Write the child's comfort items on a card so all staff can support during detox.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Glue", "Health", "TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 15,
                    needs: ["cards", "pen"]
                  }
                }
              ]
            },
            {
              id: "9000000000039",
              stepId: "9000000000014",
              title: "Peer clean buddies",
              completed: false,
              priority: 4,
              orderIndex: 4,
              initiatives: [
                {
                  id: "9000000000106",
                  taskId: "9000000000039",
                  title: "Pair each new quitter with an older centre youth who once sniffed glue.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Glue", "TimeImpact:Days", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 30,
                    needs: []
                  }
                },
                {
                  id: "9000000000107",
                  taskId: "9000000000039",
                  title: "Buddy and child agree on a daily check time to talk about cravings honestly.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Glue", "TimeImpact:Days", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 15,
                    needs: []
                  }
                },
                {
                  id: "9000000000108",
                  taskId: "9000000000039",
                  title: "Provide a bead bracelet; each clean day, the buddy adds one coloured bead.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Glue", "TimeImpact:Days", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 10,
                    needs: ["beads", "string"]
                  }
                },
                {
                  id: "9000000000109",
                  taskId: "9000000000039",
                  title: "Celebrate five clean beads with a small shared outing to the local park.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Glue", "TimeImpact:Hours", "Closeness:Trusted"],
                    closenessMin: 4,
                    estEffortMins: 120,
                    needs: []
                  }
                }
              ]
            }
          ]
        },
        {
          id: "9000000000015",
          goalId: "9000000000002",
          title: "Calm big fears",
          completed: false,
          priority: 2,
          orderIndex: 2,
          tasks: [
            {
              id: "9000000000040",
              stepId: "9000000000015",
              title: "List scary myths",
              completed: false,
              priority: 1,
              orderIndex: 1,
              initiatives: [
                {
                  id: "9000000000110",
                  taskId: "9000000000040",
                  title: "Ask the group to shout every rumour about the centre onto a big paper sheet.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["Trauma", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 30,
                    needs: ["big paper", "markers"]
                  }
                },
                {
                  id: "9000000000111",
                  taskId: "9000000000040",
                  title: "Circle the myths that cause most fear and tackle those first with facts.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["Trauma", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 20,
                    needs: ["markers"]
                  }
                },
                {
                  id: "9000000000112",
                  taskId: "9000000000040",
                  title: "Keep the sheet visible so kids can add new rumours any time they hear one.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Trauma", "TimeImpact:Days", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 5,
                    needs: ["tape"]
                  }
                },
                {
                  id: "9000000000113",
                  taskId: "9000000000040",
                  title: "Review the list weekly and cross out myths that have been proven false.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["Trauma", "TimeImpact:Days", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 20,
                    needs: ["markers"]
                  }
                }
              ]
            },
            {
              id: "9000000000041",
              stepId: "9000000000015",
              title: "Show real facts",
              completed: false,
              priority: 2,
              orderIndex: 2,
              initiatives: [
                {
                  id: "9000000000114",
                  taskId: "9000000000041",
                  title: "Record a short phone video of the centre dorm showing the open door and free movement.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 30,
                    needs: ["phone"]
                  }
                },
                {
                  id: "9000000000115",
                  taskId: "9000000000041",
                  title: "Let kids pause the video and ask questions about each scene they see.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 45,
                    needs: ["phone"]
                  }
                },
                {
                  id: "9000000000116",
                  taskId: "9000000000041",
                  title: "Bring a clean sample meal from the centre for a taste test right on the street.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["Materials:Food", "TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 60,
                    needs: ["food containers", "sample meals"]
                  }
                },
                {
                  id: "9000000000117",
                  taskId: "9000000000041",
                  title: "Show last month's water bill to prove hot showers run daily with no shortage.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 10,
                    needs: ["water bill"]
                  }
                }
              ]
            },
            {
              id: "9000000000042",
              stepId: "9000000000015",
              title: "Peer talk circle",
              completed: false,
              priority: 3,
              orderIndex: 3,
              initiatives: [
                {
                  id: "9000000000118",
                  taskId: "9000000000042",
                  title: "Invite two happy centre kids to the street spot for an open chat hour.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 60,
                    needs: []
                  }
                },
                {
                  id: "9000000000119",
                  taskId: "9000000000042",
                  title: "Sit in a circle on the ground so no one stands higher than the others.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 5,
                    needs: ["mat"]
                  }
                },
                {
                  id: "9000000000120",
                  taskId: "9000000000042",
                  title: "Street kids ask any question first; peers answer before adults speak at all.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 45,
                    needs: []
                  }
                },
                {
                  id: "9000000000121",
                  taskId: "9000000000042",
                  title: "End the circle with a group handshake promise to respect every honest question.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:Warming"],
                    closenessMin: 3,
                    estEffortMins: 10,
                    needs: []
                  }
                }
              ]
            },
            {
              id: "9000000000043",
              stepId: "9000000000015",
              title: "Photo story tour",
              completed: false,
              priority: 4,
              orderIndex: 4,
              initiatives: [
                {
                  id: "9000000000122",
                  taskId: "9000000000043",
                  title: "Print twelve photos showing a full day at the centre from wake‑up to lights out.",
                  completed: false,
                  priority: 1,
                  orderIndex: 1,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 60,
                    needs: ["photos", "printer"]
                  }
                },
                {
                  id: "9000000000123",
                  taskId: "9000000000043",
                  title: "Lay photos on a mat; let each child arrange them in order and retell the story.",
                  completed: false,
                  priority: 2,
                  orderIndex: 2,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 30,
                    needs: ["photos", "mat"]
                  }
                },
                {
                  id: "9000000000124",
                  taskId: "9000000000043",
                  title: "Flip each photo to reveal a caption with one fun fact about that activity.",
                  completed: false,
                  priority: 3,
                  orderIndex: 3,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 15,
                    needs: ["photos", "captions"]
                  }
                },
                {
                  id: "9000000000125",
                  taskId: "9000000000043",
                  title: "Leave the photo set in a safe drop‑box so children can view it anytime.",
                  completed: false,
                  priority: 4,
                  orderIndex: 4,
                  meta: {
                    tags: ["TimeImpact:Hours", "Closeness:New"],
                    closenessMin: 2,
                    estEffortMins: 15,
                    needs: ["drop-box", "photos"]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const tagOptions = [
  // Challenges
  {value: "Glue", label: "Glue", category: "challenge", color: "bg-red-100 text-red-700"},
  {value: "Trauma", label: "Trauma", category: "challenge", color: "bg-red-100 text-red-700"},
  {value: "Violence", label: "Violence", category: "challenge", color: "bg-red-100 text-red-700"},
  {value: "PoliceRaid", label: "Police Raid", category: "challenge", color: "bg-red-100 text-red-700"},
  {value: "Health", label: "Health", category: "challenge", color: "bg-orange-100 text-orange-700"},
  
  // Joys
  {value: "Football", label: "Football", category: "joy", color: "bg-green-100 text-green-700"},
  {value: "Art", label: "Art", category: "joy", color: "bg-purple-100 text-purple-700"},
  {value: "Music", label: "Music", category: "joy", color: "bg-blue-100 text-blue-700"},
  {value: "Animals", label: "Animals", category: "joy", color: "bg-yellow-100 text-yellow-700"},
  {value: "Games", label: "Games", category: "joy", color: "bg-pink-100 text-pink-700"},
  
  // Closeness
  {value: "Closeness:Stranger", label: "Stranger", category: "closeness", color: "bg-gray-100 text-gray-700"},
  {value: "Closeness:New", label: "New", category: "closeness", color: "bg-blue-100 text-blue-700"},
  {value: "Closeness:Warming", label: "Warming", category: "closeness", color: "bg-yellow-100 text-yellow-700"},
  {value: "Closeness:Trusted", label: "Trusted", category: "closeness", color: "bg-green-100 text-green-700"},
  
  // Age
  {value: "Age:Under10", label: "Under 10", category: "age", color: "bg-indigo-100 text-indigo-700"},
  {value: "Age:10-12", label: "10-12", category: "age", color: "bg-indigo-100 text-indigo-700"},
  {value: "Age:13-15", label: "13-15", category: "age", color: "bg-indigo-100 text-indigo-700"},
  {value: "Age:16+", label: "16+", category: "age", color: "bg-indigo-100 text-indigo-700"},
  
  // Time Impact
  {value: "TimeImpact:Hours", label: "Hours", category: "time", color: "bg-teal-100 text-teal-700"},
  {value: "TimeImpact:Days", label: "Days", category: "time", color: "bg-teal-100 text-teal-700"},
  
  // Materials
  {value: "Materials:Food", label: "Food", category: "material", color: "bg-orange-100 text-orange-700"},
  {value: "Materials:Transport", label: "Transport", category: "material", color: "bg-cyan-100 text-cyan-700"}
];

export const challengeOptions = [
  {value: "Glue", label: "Glue addiction"},
  {value: "Violence", label: "Violence exposure"},
  {value: "Trauma", label: "Trauma history"},
  {value: "Health", label: "Health issues"},
  {value: "PoliceRaid", label: "Police harassment"}
];

export const joyOptions = [
  {value: "Football", label: "Football/Sports"},
  {value: "Art", label: "Drawing/Art"},
  {value: "Music", label: "Music/Singing"},
  {value: "Animals", label: "Animals"},
  {value: "Games", label: "Games/Play"}
];

export const dreamPresets = [
  "Sleep indoors safely",
  "Stop using glue",
  "Learn to read and write",
  "Play football every day",
  "Have three meals daily",
  "Reunite with family",
  "Learn a trade skill",
  "Make new friends",
  "Feel safe and protected",
  "Go to school"
];