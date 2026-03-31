export const TEMPLATES = [
  {
    name: "Cyberpunk Standoff",
    type: "image",
    data: [
      {
        id: 't1-e1', name: 'Anya (LEFT)', type: 'character', isOpen: true, items: [
          { id: 't1-i1', text: 'Stunning woman with matte black tactical skin', selected: true },
          { id: 't1-i1b', text: 'Glowing cyan circuit tattoos on the neck', selected: true },
          { id: 't1-i1c', text: 'Short silver bob haircut with undercut', selected: true },
          { id: 't1-i1d', text: 'Cybernetic eyes with red HUD reflections', selected: true }
        ]
      },
      {
        id: 't1-e2', name: 'John (RIGHT)', type: 'character', isOpen: true, items: [
          { id: 't1-i2', text: 'Athletic man with a rugged and stoic expression', selected: true },
          { id: 't1-i2b', text: 'Long heavy dirt-stained trench coat', selected: true },
          { id: 't1-i2c', text: 'Mechanical prosthetic arm with exposed wires', selected: true },
          { id: 't1-i2d', text: 'Smoking a glowing synthetic cigar', selected: true }
        ]
      },
      {
        id: 't1-int', name: 'Interaction', type: 'interaction', isOpen: true, items: [
          { id: 't1-i3', text: 'Anya pointing a sleek chrome pistol at John\'s forehead', selected: true },
          { id: 't1-i3b', text: 'John standing completely still with hands in pockets', selected: true },
          { id: 't1-i3c', text: 'Tense atmosphere with visible smoke drifting between them', selected: true }
        ]
      },
      {
        id: 't1-env', name: 'Environment', type: 'environment', isOpen: true, items: [
          { id: 't1-i4', text: 'Rain-slicked and neon-lit Tokyo back alley', selected: true },
          { id: 't1-i4b', text: 'Steam venting from dirty metal floor grates', selected: true },
          { id: 't1-i4c', text: 'Flickering pink and blue holographic advertisements', selected: true },
          { id: 't1-i4d', text: 'Deep puddles reflecting city lights', selected: true }
        ]
      }
    ]
  },
  {
    name: "Fantasy Enchanted Forest",
    type: "image",
    data: [
      {
        id: 't2-env', name: 'Ancient Woods', type: 'environment', isOpen: true, items: [
          { id: 't2-i1', text: 'Dense ancient forest with towering moss-covered trees', selected: true },
          { id: 't2-i2', text: 'Bioluminescent mushrooms glowing in shades of purple and gold', selected: true },
          { id: 't2-i3', text: 'Ethereal mist rolling over the twisted roots', selected: true },
          { id: 't2-i4', text: 'Shafts of golden sunlight piercing through the thick canopy', selected: true },
          { id: 't2-i5', text: 'Small floating fairy lights dancing in the air', selected: true }
        ]
      },
      {
        id: 't2-neg', name: 'Negative', type: 'negative', isOpen: true, items: [
          { id: 't2-n1', text: 'modern buildings', selected: true },
          { id: 't2-n2', text: 'vehicles', selected: true },
          { id: 't2-n3', text: 'scifi elements', selected: true },
          { id: 't2-n4', text: 'dark lighting', selected: false }
        ]
      }
    ]
  },
  {
    name: "Steampunk Inventor",
    type: "image",
    data: [
      {
        id: 't3-e1', name: 'The Inventor', type: 'character', isOpen: true, items: [
          { id: 't3-i1', text: 'Elderly man with wild white hair and brass safety goggles', selected: true },
          { id: 't3-i2', text: 'Wearing a leather apron covered in grease and soot', selected: true },
          { id: 't3-i3', text: 'Multiple brass tools tucked into belt pouches', selected: true },
          { id: 't3-i4', text: 'Intense and focused expression of pure madness and genius', selected: true }
        ]
      },
      {
        id: 't3-env', name: 'Messy Workshop', type: 'environment', isOpen: true, items: [
          { id: 't3-e1', text: 'Cluttered Victorian era laboratory filled with copper pipes', selected: true },
          { id: 't3-e2', text: 'Large steam-powered gears rotating in the background', selected: true },
          { id: 't3-e3', text: 'Tables covered in scattered blueprints and mechanical parts', selected: true },
          { id: 't3-e4', text: 'Warm orange lighting from a nearby furnace', selected: true }
        ]
      }
    ]
  },
  {
    name: "Sci-Fi Space Station Bridge",
    type: "image",
    data: [
      {
        id: 't4-env', name: 'Command Center', type: 'environment', isOpen: true, items: [
          { id: 't4-i1', text: 'Sleek futuristic command bridge of an orbital station', selected: true },
          { id: 't4-i2', text: 'Massive panoramic window showing a glowing blue nebula', selected: true },
          { id: 't4-i3', text: 'Rows of glowing holographic control panels in cyan and white', selected: true },
          { id: 't4-i4', text: 'Clean white pristine flooring reflecting the console lights', selected: true },
          { id: 't4-i5', text: 'Floating orbital debris visible outside the window', selected: true }
        ]
      },
      {
        id: 't4-neg', name: 'Negative', type: 'negative', isOpen: true, items: [
          { id: 't4-n1', text: 'grungy', selected: true },
          { id: 't4-n2', text: 'dirty', selected: true },
          { id: 't4-n3', text: 'abandoned', selected: true },
          { id: 't4-n4', text: 'rust', selected: true }
        ]
      }
    ]
  },
  {
    name: "Noir Detective Office",
    type: "image",
    data: [
      {
        id: 't5-e1', name: 'Private Eye', type: 'character', isOpen: true, items: [
          { id: 't5-i1', text: 'Tired detective wearing a fedora tilted downwards', selected: true },
          { id: 't5-i2', text: 'Shadows obscuring half of his face in classic chiaroscuro style', selected: true },
          { id: 't5-i3', text: 'Pinstripe suit with a loosened tie', selected: true },
          { id: 't5-i4', text: 'Holding a half-empty glass of amber whiskey', selected: true }
        ]
      },
      {
        id: 't5-int', name: 'Interaction', type: 'interaction', isOpen: true, items: [
          { id: 't5-a1', text: 'Staring intensely out the window into the rainy night', selected: true },
          { id: 't5-a2', text: 'Smoke curling up from a cigarette resting on the ashtray', selected: true },
          { id: 't5-a3', text: 'Leaning heavily against the dusty wooden desk', selected: true }
        ]
      },
      {
        id: 't5-env', name: 'Office', type: 'environment', isOpen: true, items: [
          { id: 't5-e1', text: '1940s detective office bathed in black and white tones', selected: true },
          { id: 't5-e2', text: 'Venetian blinds casting striped shadows across the room', selected: true },
          { id: 't5-e3', text: 'Flickering streetlamp outside illuminating the rain on the glass', selected: true }
        ]
      }
    ]
  },
  {
    name: "Post-Apocalyptic Survivor",
    type: "image",
    data: [
      {
        id: 't6-e1', name: 'Lone Wanderer', type: 'character', isOpen: true, items: [
          { id: 't6-i1', text: 'Young woman with a gas mask hanging around her neck', selected: true },
          { id: 't6-i2', text: 'Wearing improvised armor made from tire treads and street signs', selected: true },
          { id: 't6-i3', text: 'Carrying a heavily modified crossbow slung over her shoulder', selected: true },
          { id: 't6-i4', text: 'Dust and ash coating her clothes and face', selected: true }
        ]
      },
      {
        id: 't6-env', name: 'Ruined City', type: 'environment', isOpen: true, items: [
          { id: 't6-e1', text: 'Overgrown ruins of a modern metropolis', selected: true },
          { id: 't6-e2', text: 'Vines and moss reclaiming shattered concrete skyscrapers', selected: true },
          { id: 't6-e3', text: 'Rusted out yellow taxi cabs half-buried in the dirt', selected: true },
          { id: 't6-e4', text: 'Hazy orange sky choked with dust and perpetual twilight', selected: true }
        ]
      }
    ]
  },
  {
    name: "Majestic Dragon Flight",
    type: "image",
    data: [
      {
        id: 't7-e1', name: 'Crimson Dragon', type: 'character', isOpen: true, items: [
          { id: 't7-i1', text: 'Enormous ancient dragon with iridescent crimson scales', selected: true },
          { id: 't7-i2', text: 'Massive bat-like wings with torn edges and glowing veins', selected: true },
          { id: 't7-i3', text: 'Breathing a stream of intense golden fire into the air', selected: true },
          { id: 't7-i4', text: 'Golden slit eyes reflecting the sunlight', selected: true }
        ]
      },
      {
        id: 't7-env', name: 'Sky Kingdom', type: 'environment', isOpen: true, items: [
          { id: 't7-e1', text: 'Soaring high above snow-capped jagged mountain peaks', selected: true },
          { id: 't7-e2', text: 'Fluffy volumetric cumulus clouds scattered in the crisp blue sky', selected: true },
          { id: 't7-e3', text: 'Tiny medieval castle visible far down in the valley below', selected: true },
          { id: 't7-e4', text: 'Birds scattering out of the way of the beast', selected: true }
        ]
      }
    ]
  },
  {
    name: "Underwater Lost City",
    type: "image",
    data: [
      {
        id: 't8-env', name: 'Atlantis Ruins', type: 'environment', isOpen: true, items: [
          { id: 't8-i1', text: 'Majestic ancient Greek style architecture completely submerged entirely underwater', selected: true },
          { id: 't8-i2', text: 'Coral reefs and colorful anemones growing on white marble pillars', selected: true },
          { id: 't8-i3', text: 'Schools of silver fish swimming through broken archways', selected: true },
          { id: 't8-i4', text: 'Godrays of sun penetrating the deep blue water from the surface above', selected: true },
          { id: 't8-i5', text: 'A massive fallen statue lying partially buried in the white sand', selected: true }
        ]
      },
      {
        id: 't8-neg', name: 'Negative Rules', type: 'negative', isOpen: true, items: [
          { id: 't8-n1', text: 'dry environment', selected: true },
          { id: 't8-n2', text: 'people', selected: true },
          { id: 't8-n3', text: 'scuba divers', selected: true },
          { id: 't8-n4', text: 'murky water', selected: true }
        ]
      }
    ]
  },
  {
    name: "Victorian High Society Ball",
    type: "image",
    data: [
      {
        id: 't9-e1', name: 'Duchess', type: 'character', isOpen: true, items: [
          { id: 't9-i1', text: 'Elegant woman in a lavish ruby red silk Victorian ballgown', selected: true },
          { id: 't9-i2', text: 'Wearing an intricate diamond tiara and pearl necklace', selected: true },
          { id: 't9-i3', text: 'Hair styled in an elaborate updo with white feathers', selected: true },
          { id: 't9-i4', text: 'Holding a delicate lace folding fan hiding her smile', selected: true }
        ]
      },
      {
        id: 't9-e2', name: 'Duke', type: 'character', isOpen: true, items: [
          { id: 't9-a1', text: 'Handsome gentleman in a tailored black tailcoat and crisp white cravat', selected: true },
          { id: 't9-a2', text: 'Golden monocle resting over his left eye', selected: true },
          { id: 't9-a3', text: 'Silver-tipped walking cane resting in his left hand', selected: true }
        ]
      },
      {
        id: 't9-int', name: 'Dancing', type: 'interaction', isOpen: true, items: [
          { id: 't9-b1', text: 'Gracefully waltzing together in the center of the dance floor', selected: true },
          { id: 't9-b2', text: 'Duke spinning the Duchess, dress flaring outwards dynamically', selected: true },
          { id: 't9-b3', text: 'Eye contact filled with unspoken romantic tension', selected: true }
        ]
      },
      {
        id: 't9-env', name: 'Grand Ballroom', type: 'environment', isOpen: true, items: [
          { id: 't9-c1', text: 'Opulent palace ballroom with gold leaf detailing on the walls', selected: true },
          { id: 't9-c2', text: 'Massive crystal chandeliers casting a warm romantic glow', selected: true },
          { id: 't9-c3', text: 'Hundreds of guests in formal attire blurring in the background', selected: true },
          { id: 't9-c4', text: 'Polished marble floor reflecting the lights above', selected: true }
        ]
      }
    ]
  },
  {
    name: "Neon Retrowave Car Chase",
    type: "video",
    data: [
      {
        id: 't10-e1', name: 'Target Vehicle', type: 'character', isOpen: true, items: [
          { id: 't10-i1', text: 'Sleek white 1980s sports car with futuristic modifications', selected: true },
          { id: 't10-i2', text: 'Trailing light ribbons from the taillights like a Tron cycle', selected: true },
          { id: 't10-i3', text: 'Pop-up headlights cutting through the darkness', selected: true }
        ]
      },
      {
        id: 't10-int', name: 'Action', type: 'interaction', isOpen: true, items: [
          { id: 't10-a1', text: 'Drifting aggressively around a sharp corner burning rubber', selected: true },
          { id: 't10-a2', text: 'Sparks flying from the tires skidding on the asphalt', selected: true },
          { id: 't10-a3', text: 'Motion blur emphasizing extreme high-speed velocity', selected: true }
        ]
      },
      {
        id: 't10-env', name: 'Synthwave City', type: 'environment', isOpen: true, items: [
          { id: 't10-e1', text: 'Endless highway stretched across a retro-futuristic grid landscape', selected: true },
          { id: 't10-e2', text: 'Giant glowing wireframe mountains in the far distance', selected: true },
          { id: 't10-e3', text: 'Massive setting synthwave sun forming a striped orange and purple backdrop', selected: true },
          { id: 't10-e4', text: 'Palm trees lined along the neon pink glowing track', selected: true }
        ]
      }
    ]
  },
  {
    name: "Cinematic Cyber-Drone",
    type: "video",
    data: [
      {
        id: 'v1-e1', name: 'Cyberpunk Cruiser', type: 'character', isOpen: true, items: [
          { id: 'v1-i1', text: 'Blacked out flying vehicle with glowing purple underside', selected: true },
          { id: 'v1-i2', text: 'Sleek aerodynamic shape weaving through structures', selected: true }
        ]
      },
      {
        id: 'v1-env', name: 'Neon Cityscape', type: 'environment', isOpen: true, items: [
          { id: 'v1-e1', text: 'Endless layers of neon skyscrapers in rain', selected: true },
          { id: 'v1-e2', text: 'Giant volumetric holographic billboards', selected: true }
        ]
      },
      {
        id: 'v1-mo', name: 'Motion', type: 'motion', isOpen: true, items: [
          { id: 'v1-m1', text: 'Extreme high speed maneuvering between tight spaces', selected: true },
          { id: 'v1-m2', text: 'Rain drops streaks on the camera lens showing speed', selected: true }
        ]
      },
      {
        id: 'v1-cam', name: 'Camera', type: 'camera', isOpen: true, items: [
          { id: 'v1-c1', text: 'Dynamic drone-shot tracking the vehicle from behind', selected: true },
          { id: 'v1-c2', text: 'Low angle wide shots and tight banking turns', selected: true }
        ]
      }
    ]
  },
  {
    name: "Magical Lava Flow",
    type: "video",
    data: [
      {
        id: 'v2-env', name: 'Volcanic Rift', type: 'environment', isOpen: true, items: [
          { id: 'v2-e1', text: 'Active volcano crater at night with glowing orange magma', selected: true },
          { id: 'v2-e2', text: 'Basalt rock formations and thick black smoke', selected: true }
        ]
      },
      {
        id: 'v2-mo', name: 'Lava Motion', type: 'motion', isOpen: true, items: [
          { id: 'v2-m1', text: 'Slowly flowing incandescent lava with liquid physics', selected: true },
          { id: 'v2-m2', text: 'Occasional lava bursts and flying ash particles', selected: true }
        ]
      },
      {
        id: 'v2-cam', name: 'Camera Movement', type: 'camera', isOpen: true, items: [
          { id: 'v2-c1', text: 'Slow cinematic tilt down into the crater', selected: true },
          { id: 'v2-c2', text: 'Steady macro shot showing details of the liquid heat', selected: true }
        ]
      }
    ]
  },
  {
    name: "Futuristic Heist Storyboard",
    type: "video",
    data: [
      {
        id: 'v3-sq', name: 'Narrative Timeline', type: 'sequence', isOpen: true, items: [
          { id: 'v3-s1', text: '[00:00-00:01] Wide shot of a neon-lit vault door. Steam escaping from the edges.', selected: true },
          { id: 'v3-s2', text: '[00:01-00:03] Close-up on a high-tech hacking device attached to the keypad, digits flickering rapidly.', selected: true },
          { id: 'v3-s3', text: '[00:03-00:05] The massive vault door slowly creaks open, revealing a silhouetted figure in a tactical suit.', selected: true }
        ]
      },
      {
        id: 'v3-env', name: 'Cyber Underworld', type: 'environment', isOpen: true, items: [
          { id: 'v3-e1', text: 'Dark, industrial subterranean vault chamber', selected: true },
          { id: 'v3-e2', text: 'Wires and glowing blue cables running along the ceiling', selected: true }
        ]
      },
      {
        id: 'v3-mo', name: 'Mood & Motion', type: 'motion', isOpen: true, items: [
          { id: 'v3-m1', text: 'Slow, heavy mechanical movement of the door', selected: true },
          { id: 'v3-m2', text: 'Flickering sparks and atmospheric dust particles', selected: true }
        ]
      }
    ]
  }
];
