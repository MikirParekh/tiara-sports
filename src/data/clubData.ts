import { MatchResult, StandingRow, Player, Facility, ClubEvent, BlogPost, AchievementMilestone } from '../types';

// Import images properly for Vite bundling
import gymImage from '../assets/images/athletic_gym_interior_1791482317405.jpg';
import pickleballImage from '../assets/images/pickleball_court_action_1791444715313.jpg';
import badmintonGymImage from '../assets/images/badminton_gym_complex_1791444733550.jpg';
import tennisCourtImage from '../assets/images/padel_tennis_court_1791443404210.jpg';
import trophyImage from '../assets/images/trophy_showcase_awards_1791443423828.jpg';
import arenaComplexImage from '../assets/images/facility_indoor_arena_1791443385742.jpg';

export const GYM_IMAGE = gymImage;
export const PICKLEBALL_IMAGE = pickleballImage;
export const BADMINTON_GYM_IMAGE = badmintonGymImage;
export const TENNIS_COURT_IMAGE = tennisCourtImage;
export const TROPHY_IMAGE = trophyImage;
export const ARENA_COMPLEX_IMAGE = arenaComplexImage;

export const VADODARA_LIVE_CONDITIONS = {
  temp: '28°C',
  weather: 'Clear Sky · Evening Lights',
  humidity: '44%',
  courtTraction: '100% Optimal (Dry Surface)',
  activePlayersOnCampus: 142,
  nextAvailableSlot: '19:30 - 21:00 Tonight',
};

export const COURT_SLOTS_DATA = [
  {
    id: 'slot-1',
    facilityName: 'Championship Tennis Arena',
    time: '06:00 – 07:30',
    tag: 'Early Morning Dawn',
    price: '₹900/hr',
    status: 'AVAILABLE',
    spotsLeft: 2,
  },
  {
    id: 'slot-2',
    facilityName: 'Pro Pickleball Competition Arena',
    time: '17:00 – 18:30',
    tag: 'Golden Hour Session',
    price: '₹750/hr',
    status: 'AVAILABLE',
    spotsLeft: 1,
  },
  {
    id: 'slot-3',
    facilityName: 'BWF Teak Badminton Arena',
    time: '19:00 – 20:30',
    tag: 'Prime Evening Floodlit',
    price: '₹800/hr',
    status: 'FAST FILLING',
    spotsLeft: 1,
  },
  {
    id: 'slot-4',
    facilityName: 'High-Performance Gym Strength Floor',
    time: '20:30 – 22:00',
    tag: 'Night Conditioning Pass',
    price: '₹600/hr',
    status: 'AVAILABLE',
    spotsLeft: 4,
  },
];

// Compatibility alias
export const TURF_SLOTS_DATA = COURT_SLOTS_DATA;

export const ADMIN_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'contact@tiarasportsclub.com';

export const CLUB_LOCATION = {
  name: 'TIARA SPORTS CLUB',
  city: 'Vadodara',
  state: 'Gujarat',
  country: 'India',
  address: 'Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara',
  landmark: 'Besides Red Coral greens, opposite Nayara petrol pump',
  street: 'Sama-Savli Road',
  phone: '+91 (0265) 298-8900',
  mobile: '+91 98250 88900',
  email: ADMIN_EMAIL,
  timings: 'Monday – Sunday: 06:00 AM – 11:00 PM',
};

export const MULTI_SPORTS_LIST = [
  {
    id: 'tennis',
    name: 'Tennis',
    badge: 'ITF SPECIFICATION',
    courts: 'Championship Regulation Facility',
    desc: 'Championship cushioned tournament tennis arena with high-performance floodlighting.',
    image: TENNIS_COURT_IMAGE,
    amenities: ['Ball Machine Rental', 'Video Stroke Analysis', 'Certified AITA Coaches'],
    openSlots: 'Prime Sessions Available Today',
  },
  {
    id: 'pickleball',
    name: 'Pickleball',
    badge: 'FASTEST GROWING',
    courts: 'Dedicated Competition Arena',
    desc: 'Tournament-grade textured acrylic arena with permanent nets and dedicated spectator gallery.',
    image: PICKLEBALL_IMAGE,
    amenities: ['Pro Paddles Available', 'Evening Social Mixers', 'Beginner Clinics'],
    openSlots: 'Evening Sessions Open Tonight',
  },
  {
    id: 'badminton',
    name: 'Badminton',
    badge: 'BWF CERTIFIED',
    courts: 'BWF Teak & Synthetic Complex',
    desc: 'First-grade teak hardwood subfloor with Yonex competition synthetic mats and shadowless LED lighting.',
    image: BADMINTON_GYM_IMAGE,
    amenities: ['Yonex Stringing Machine', 'Air-Cooled Arena', 'State-Level Coaching'],
    openSlots: 'Prime Sessions Active Now',
  },
  {
    id: 'gym',
    name: 'Gym',
    badge: 'STRENGTH & CONDITIONING',
    courts: 'Elite Strength & Conditioning Floor',
    desc: 'Commercial Technogym and Hammer Strength equipment, power racks, dumbbell suites, functional sprint turf, and cardio floor.',
    image: GYM_IMAGE,
    amenities: ['Physiotherapy on Site', 'InBody Body Composition', 'Certified S&C Trainers'],
    openSlots: 'Open 06:00 - 23:00 Daily',
  },
];

export const LIVE_TICKER_ITEMS = [
  'LIVE: GUJARAT STATE TENNIS OPEN · CHAMPIONSHIP CENTER ARENA · TIARA CLUB VADODARA',
  'SLOT INQUIRIES: PICKLEBALL, BADMINTON & TENNIS SESSIONS OPEN FOR TODAY',
  'TIARA GYM: PERSONALIZED CSCS ATHLETE CONDITIONING PROGRAM ENROLLMENT OPEN',
  'SUMMER MULTI-SPORTS CAMP: REGISTRATIONS OPEN FOR AGES 6 TO 18 YEARS'
];

export const RECENT_MATCH_RESULTS: MatchResult[] = [
  {
    id: 'match-1',
    tournament: 'GUJARAT STATE LAWN TENNIS CHAMPIONSHIP',
    date: 'Oct 06, 2026',
    venue: 'Tiara Sports Club, Championship Tennis Arena, Vadodara',
    status: 'FINAL',
    homeTeam: {
      name: 'TIARA ROYALS (VADODARA)',
      score: 3,
      logoCode: 'TSC',
      isSportizai: true,
    },
    awayTeam: {
      name: 'AHMEDABAD ACES',
      score: 1,
      logoCode: 'AMD',
      isSportizai: false,
    },
    stats: {
      fgPercentage: [68.4, 54.2], // 1st serve in %
      threePtPercentage: [78.2, 61.5], // Win % on 1st serve
      ftPercentage: [85.0, 71.0], // Break points saved
      rebounds: [44, 28], // Total winners
      assists: [12, 6], // Aces
      steals: [8, 4], // Return winners
      turnovers: [14, 26], // Unforced errors
    }
  },
  {
    id: 'match-2',
    tournament: 'VADODARA PREMIER PICKLEBALL TROPHY',
    date: 'Oct 02, 2026',
    venue: 'Tiara Sports Club, Pro Pickleball Arena, Vadodara',
    status: 'FINAL',
    homeTeam: {
      name: 'TIARA WARRIORS',
      score: 15,
      logoCode: 'TSC',
      isSportizai: true,
    },
    awayTeam: {
      name: 'FATEHGUNJ ACES',
      score: 11,
      logoCode: 'FGA',
      isSportizai: false,
    },
    stats: {
      fgPercentage: [62.0, 48.0],
      threePtPercentage: [45.0, 32.0],
      ftPercentage: [88.0, 75.0],
      rebounds: [38, 28],
      assists: [22, 14],
      steals: [9, 5],
      turnovers: [8, 16],
    }
  },
  {
    id: 'match-3',
    tournament: 'ALL-GUJARAT BADMINTON INTER-CLUB INVITATIONAL',
    date: 'Sep 26, 2026',
    venue: 'Tiara Sports Club, Badminton Arena, Vadodara',
    status: 'FINAL',
    homeTeam: {
      name: 'TIARA SMASHERS',
      score: 3,
      logoCode: 'TSC',
      isSportizai: true,
    },
    awayTeam: {
      name: 'SURAT SHUTTLERS',
      score: 0,
      logoCode: 'SRT',
      isSportizai: false,
    },
    stats: {
      fgPercentage: [74.0, 58.0],
      threePtPercentage: [82.0, 64.0],
      ftPercentage: [90.0, 76.0],
      rebounds: [48, 30],
      assists: [18, 9],
      steals: [11, 6],
      turnovers: [10, 22],
    }
  }
];

export const STANDINGS_DATA: Record<string, StandingRow[]> = {
  'Champions Cup': [
    { rank: 1, club: 'TIARA SPORTS CLUB (VADODARA)', w: 9, l: 1, pct: '.900', gb: '-', l10: '9-1', streak: 'W6', isSportizai: true },
    { rank: 2, club: 'Baroda Racquet Academy', w: 8, l: 2, pct: '.800', gb: '1.0', l10: '8-2', streak: 'W3' },
    { rank: 3, club: 'Gujarat Tennis Guild', w: 7, l: 3, pct: '.700', gb: '2.0', l10: '7-3', streak: 'L1' },
    { rank: 4, club: 'Alkapuri Shuttlers', w: 6, l: 4, pct: '.600', gb: '3.0', l10: '6-4', streak: 'W2' },
    { rank: 5, club: 'Surat Racquet Club', w: 5, l: 5, pct: '.500', gb: '4.0', l10: '5-5', streak: 'L2' },
    { rank: 6, club: 'Ahmedabad Strikers', w: 4, l: 6, pct: '.400', gb: '5.0', l10: '4-6', streak: 'W1' },
  ],
  'EFA Cup': [
    { rank: 1, club: 'TIARA SPORTS CLUB (VADODARA)', w: 7, l: 0, pct: '1.000', gb: '-', l10: '7-0', streak: 'W7', isSportizai: true },
    { rank: 2, club: 'Baroda Tennis Association', w: 5, l: 2, pct: '.714', gb: '2.0', l10: '5-2', streak: 'W2' },
    { rank: 3, club: 'Rajkot Athletic Club', w: 4, l: 3, pct: '.571', gb: '3.0', l10: '4-3', streak: 'L1' },
  ],
  'Liga Premier': [
    { rank: 1, club: 'TIARA SPORTS CLUB (VADODARA)', w: 15, l: 2, pct: '.882', gb: '-', l10: '9-1', streak: 'W5', isSportizai: true },
    { rank: 2, club: 'Sayaji Sports Arena', w: 13, l: 4, pct: '.765', gb: '2.0', l10: '7-3', streak: 'W1' },
    { rank: 3, club: 'Baroda Sports Club', w: 12, l: 5, pct: '.706', gb: '3.0', l10: '7-3', streak: 'W2' },
  ]
};

export const ACHIEVEMENTS_TIMELINE: AchievementMilestone[] = [
  {
    year: 2012,
    title: 'Inauguration of Tiara Sports Club in Vadodara',
    trophy: 'Founders Golden Shield',
    description: 'Inaugurated across a sprawling athletic campus on Sama-Savli Road, introducing Vadodara’s premier championship tennis arena.',
    record: 'Inaugural Year Excellence',
    mvp: 'Rajeshwar Patel'
  },
  {
    year: 2016,
    title: 'Gujarat State Multi-Sport Institution Award',
    trophy: 'Gujarat Sports Federation Cup',
    description: 'Recognized as the premier multi-sport training facility in Western India following our tennis and badminton regional sweeps.',
    record: 'Triple Championship Season',
    mvp: 'Ananya Sharma'
  },
  {
    year: 2020,
    title: 'Launch of Pro Pickleball Center & High-Performance Gym',
    trophy: 'Vadodara Innovation Trophy',
    description: 'Introduced Vadodara’s premier dedicated pro pickleball competition arena and elite high-performance strength and conditioning gym facility.',
    record: '24-2 Multi-League Record',
    mvp: 'Rohan Mehta'
  },
  {
    year: 2024,
    title: 'National Athletic Excellence Crown',
    trophy: 'All-India Club Championship Trophy',
    description: 'Hosted 32 national tournaments with our athletes clinching gold medals in State Tennis, Pickleball, and Badminton Opens.',
    record: 'Best Club in Gujarat',
    mvp: 'Vikramaditya Solanki'
  }
];

export const PLAYERS_ROSTER: Player[] = [
  {
    id: 'p1',
    number: 1,
    name: 'Vikramaditya Solanki',
    position: 'Tennis Captain / Singles 1',
    height: '6 ft 2 in (1.88 m)',
    ppg: 88.4,
    rpg: 14.2,
    apg: 22.0,
    nationality: 'India (Vadodara)',
    bio: 'Gujarat State Men’s Singles Champion with a dominant 195 km/h first serve and clinical baseline game.',
    category: 'senior'
  },
  {
    id: 'p2',
    number: 7,
    name: 'Kabir Vaghela',
    position: 'Gym S&C Lead / Racquet Specialist',
    height: '6 ft 1 in (1.85 m)',
    ppg: 94.5,
    rpg: 9.4,
    apg: 26.0,
    nationality: 'India (Vadodara)',
    bio: 'Former state multi-sport athlete and head athletic conditioning trainer for elite juniors at Tiara Sports Club.',
    category: 'senior'
  },
  {
    id: 'p3',
    number: 10,
    name: 'Ananya Sharma',
    position: 'Badminton / National Seed 4',
    height: '5 ft 8 in (1.73 m)',
    ppg: 92.1,
    rpg: 6.8,
    apg: 28.0,
    nationality: 'India (Gujarat)',
    bio: 'All-India Junior Gold Medalist with explosive court speed and signature cross-court jump smash.',
    category: 'women'
  },
  {
    id: 'p4',
    number: 14,
    name: 'Rohan Mehta',
    position: 'Pickleball / Pro Tour 1',
    height: '6 ft 0 in (1.83 m)',
    ppg: 84.0,
    rpg: 9.1,
    apg: 19.5,
    nationality: 'India (Vadodara)',
    bio: 'National Pickleball Open Doubles Champion known for lightning quick kitchen dinking and resets.',
    category: 'senior'
  },
  {
    id: 'p5',
    number: 18,
    name: 'Diya Parikh',
    position: 'Tennis / Youth Academy U18',
    height: '5 ft 7 in (1.70 m)',
    ppg: 81.2,
    rpg: 7.4,
    apg: 16.0,
    nationality: 'India (Vadodara)',
    bio: 'Ranked #2 U18 junior in Gujarat, scholarship recipient at the Tiara Sports Academy.',
    category: 'academy'
  }
];

export const CLUB_FACILITIES: Facility[] = [
  {
    id: 'tennis-courts',
    title: 'Championship Tennis Arena',
    subtitle: 'Championship Tournament Facility · Vadodara',
    description: 'International tournament-spec tennis facility engineered with ITF Level 3 cushioned surfaces, tournament floodlighting, chair umpire stands, and player dugouts.',
    capacity: 'Championship Arena & Spectator Gallery',
    features: ['ITF Regulation Standard', 'Plexipave Cushioned Acrylic', 'Tournament Night Floodlights', 'Pro Ball Machine & Speed Radar'],
    specs: [
      { label: 'Arena Grade', value: 'ITF Tournament Certified' },
      { label: 'Certification', value: 'ITF Tournament Approved' },
      { label: 'Coaching', value: 'Certified AITA Coaches' }
    ],
    image: TENNIS_COURT_IMAGE
  },
  {
    id: 'pickleball-center',
    title: 'Tiara Pro Pickleball Arena',
    subtitle: 'Championship Competition Arena · Vadodara',
    description: 'Premier dedicated pickleball destination engineered with ultra-cushioned multi-layer acrylic surfaces, permanent steel-post nets, and shaded member lounges.',
    capacity: 'Championship Competition Facility',
    features: ['Non-Glare Cushioned Acrylic', 'Permanent Professional Nets', 'Shaded Player Dugouts', 'Equipment Rental Pro Shop'],
    specs: [
      { label: 'Arena Grade', value: 'USAPA Regulation Certified' },
      { label: 'Paddles', value: 'Carbon Fiber Pro Loaners' },
      { label: 'Events', value: 'Weekly Club League Mixers' }
    ],
    image: PICKLEBALL_IMAGE
  },
  {
    id: 'badminton-arena',
    title: 'BWF Certified Badminton Center',
    subtitle: 'BWF Certified Teak Arena · Vadodara',
    description: 'State-of-the-art arena featuring sprung teak hardwood subfloors layered with 4.5mm Yonex tournament vinyl mats for optimum joint protection and traction.',
    capacity: 'BWF Championship Air-Cooled Arena',
    features: ['Sprung Teak Wood Cushioning', '4.5mm Yonex Competition Mats', 'Zero-Shadow Directional Ceiling Lights', 'Electronic Scoreboards'],
    specs: [
      { label: 'Ceiling Height', value: '32 Feet Clear Clearance' },
      { label: 'Flooring', value: 'BWF Level 1 Approved' },
      { label: 'Locker Rooms', value: 'Steam & Shower Suites' }
    ],
    image: BADMINTON_GYM_IMAGE
  },
  {
    id: 'fitness-gym',
    title: 'High-Performance Gym & Biomechanics',
    subtitle: 'Strength, Conditioning & Biomechanics · Vadodara',
    description: 'An elite athletic gym and conditioning floor featuring Technogym cardio, Hammer Strength plate-loaded machines, heavy barbell lifting platforms, and functional sprint turf track.',
    capacity: '120 Athletes Simultaneously',
    features: ['Heavy Lifting Platforms', 'Technogym Skill Line Cardio', 'Force Plate Deceleration Track', 'Contrast Recovery Suite'],
    specs: [
      { label: 'Conditioning Floor', value: 'Full-Service Air Conditioned Suite' },
      { label: 'Trainers', value: 'CSCS Certified S&C Coaches' },
      { label: 'Recovery', value: 'Contrast Ice Bath & Sauna' }
    ],
    image: GYM_IMAGE
  }
];

export const UPCOMING_EVENTS: ClubEvent[] = [
  {
    id: 'ev-1',
    title: 'Gujarat State Lawn Tennis Masters Open',
    tournament: 'State Federation Championship',
    date: 'Saturday, Oct 24, 2026',
    time: '08:00 AM – 06:00 PM',
    opponent: 'Top 64 Players Across Gujarat',
    venue: 'Tiara Sports Club, Tennis Arena, Vadodara',
    status: 'Selling Fast',
    category: 'championship'
  },
  {
    id: 'ev-2',
    title: 'Vadodara Invitational Badminton Masters 2026',
    tournament: 'GBA Sanctioned Masters Open',
    date: 'Friday, Oct 30, 2026',
    time: '18:00 PM – 22:30 PM',
    opponent: '16 Elite Club Racquet Pairs',
    venue: 'Tiara BWF Teak Arena, Vadodara',
    status: 'Tickets Available',
    category: 'championship'
  },
  {
    id: 'ev-3',
    title: 'Vadodara Open Pickleball Championship',
    tournament: 'Gujarat Pickleball Association',
    date: 'Sunday, Nov 08, 2026',
    time: '09:00 AM – 17:00 PM',
    opponent: 'Men, Women & Mixed Doubles',
    venue: 'Tiara Pro Pickleball Arena, Vadodara',
    status: 'Tickets Available',
    category: 'championship'
  },
  {
    id: 'ev-4',
    title: 'All-Gujarat Junior Badminton Ranking',
    tournament: 'BAI / GBA Sanctioned Event',
    date: 'Nov 14 - Nov 15, 2026',
    time: '08:30 AM – 19:30 PM',
    opponent: 'U15 & U17 State Contenders',
    venue: 'Tiara Badminton Center, Vadodara',
    status: 'Tickets Available',
    category: 'academy'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'tennis-athlete-az-guide',
    title: 'Tennis: The Complete A-Z Athlete Blueprint',
    excerpt: 'From footwork mechanics and racquet string tension to kinetic chain rotation and elbow preservation — everything a serious tennis player must know before stepping on court.',
    content: [
      'A to Z Preparation & Equipment: Tennis is an exacting sport where micro-details dictate performance. Equipment selection is your first checkpoint. Choose a racquet weight (300g–315g unstrung for intermediate-to-advanced players) and balance point that supports your swing speed. String tension should be calibrated to court temperature: in warm Gujarat afternoons, tension strings at 52–55 lbs to counteract ball liveliness; for evening floodlit sessions, drop 2 lbs for deeper pocketing.',
      'Surface Mechanics & Footwork Execution: Playing on Tiara’s tournament tennis courts demands precise footwork mechanics and rapid directional changes. Brake with controlled balance, drop your center of gravity low with knees flexed, and strike through the ball while balanced. Dedicated non-marking tennis court shoes are mandatory to ensure joint stability and optimal court traction.',
      'Kinetic Chain & Injury Safeguards: Over 70% of groundstroke power originates in the legs and rotational hip torque, not the arm. Players who "arm" their shots inevitably suffer lateral epicondylitis (tennis elbow) or rotator cuff impingement. Execute a full hip coil during unit turn, drive from the rear foot, and let racquet head speed whip naturally through contact.',
      'Post-Match Recovery & Elbow Care: Ice the medial and lateral elbow tendons for 12 minutes if tenderness arises. Perform eccentric wrist extensor curls (using a resistance bar or light dumbbell) twice weekly to fortify forearm tendons against high-vibration off-center hits.'
    ],
    category: 'Tennis',
    author: 'Rajeshwar Patel · PTR & AITA Certified Tennis Director',
    date: 'Oct 06, 2026',
    readTime: '6 min read',
    image: TENNIS_COURT_IMAGE
  },
  {
    id: 'blog-2',
    slug: 'table-tennis-reflex-spin-az',
    title: 'Table Tennis A-Z: Blade Carbon Ply, Heavy Topspin Arc & Microsecond Reflex Conditioning',
    excerpt: 'The physics of spin manipulation, rubber tackiness, footwork shuffle mechanics, and eye-tracking drills for competitive table tennis champions.',
    content: [
      'A to Z Equipment & Rubber Dynamics: Table tennis is the fastest reaction sport in the world. Your blade selection dictates your margin for error: 5-ply all-wood blades provide maximum dwell time for loopers, whereas 7-ply carbon blades maximize projectile speed for close-to-table counter-drivers. Pair with high-tension inverted rubbers (2.1mm sponge thickness) to generate heavy Magnus-effect topspin that dips viciously onto the table edge.',
      'Forehand Loop Mechanics & Hip Rotation: Never swing from the elbow alone. Begin your loop stroke in a wide crouch, transfer weight from the dominant foot, rotate hips forward, and brush the ball at the apex of its bounce with a closed paddle angle. Brushing creates friction rather than blunt impact, imparting over 120 revolutions per second of topspin.',
      'Short Game & Banana Flick Over the Table: Modern table tennis is dominated by the backhand "banana flick" against short backspin serves. Step deep into the table with your dominant foot, cock the wrist completely toward your abdomen, and flick over the ball with sharp wrist pronation. This turns passive defense into immediate offensive initiative.',
      'Vision Training & Neuromuscular Warm-Up: To track a 40mm celluloid ball traveling at 120 km/h across just 2.74 meters, athletes must train saccadic eye movements. Use dual-target strobe vision drills and rapid shuffle-step shadow play for 10 minutes prior to match play.'
    ],
    category: 'Table Tennis',
    author: 'Hiren Trivedi · Former National Table Tennis Coach',
    date: 'Oct 04, 2026',
    readTime: '5 min read',
    image: ARENA_COMPLEX_IMAGE
  },
  {
    id: 'blog-3',
    slug: 'pro-pickleball-kitchen-az',
    title: 'Pro Pickleball Playbook A-Z: Non-Volley Kitchen Zone, Dinking Biomechanics & Paddle Tech',
    excerpt: 'The fastest growing sport explained from fundamentals to pro tournament play — paddle core materials, third-shot drops, eye-tracking, and knee stabilization.',
    content: [
      'A to Z The Kitchen Line Doctrine: The 7-foot Non-Volley Zone (the "Kitchen") is the tactical ground zero of pickleball. The primary rookie mistake is standing inside the kitchen or charging it while the ball is airborne. Always establish your athletic ready position with toes 2 inches behind the kitchen line. Only step inside after the ball bounces, and reset both feet behind the line immediately upon contact.',
      'Dinking Biomechanics & Soft Touch: A champion dink is not hit with wrist flicking — it is lifted with the shoulder joint while maintaining a locked 45-degree wrist. Bend from the knees, keep the paddle face open, and push the ball gently over the net into the opponent’s kitchen with underspin or flat trajectory. Forcing attacks on balls below net height leads straight into the net or out of bounds.',
      'Paddle Selection & Core Dynamics: Beginners should opt for a 13mm to 16mm polypropylene honeycomb core with a raw carbon fiber face (T700 weave). Thicker 16mm paddles dampen ball pop, granting pinpoint reset control, whereas 13mm paddles favor raw smash speed. Choose a paddle weight between 7.8 and 8.2 oz to balance hand speed with stability during hand battles.',
      'Injury Avoidance: Pickleball involves rapid lateral shuffling and split-second bending. Strengthen your quadriceps and gluteus medius with resistance band side-walks to prevent patellofemoral pain syndrome. Never backpedal straight backward for overhead lobs — turn sideways, execute drop-steps, and keep your gaze tracked on the ball.'
    ],
    category: 'Pickleball',
    author: 'Rohan Mehta · Certified USAPA Instructor',
    date: 'Oct 02, 2026',
    readTime: '5 min read',
    image: PICKLEBALL_IMAGE
  },
  {
    id: 'blog-4',
    slug: 'bwf-teak-badminton-performance-az',
    title: 'BWF Teak Badminton A-Z: Fast-Twist Aerobics, Shuttlecock Flight & Ankle Protection',
    excerpt: 'How to dominate championship teak arenas — non-marking footwear criteria, wrist pronation vs elbow snapping, lunging recovery, and Achilles tendon care.',
    content: [
      'A to Z Court Surface & Friction: Playing on Tiara’s BWF-certified sprung teak wood courts offers 40% shock absorption compared to concrete, protecting athlete vertebrae. However, teak requires absolute cleanliness of footwear. Only wear certified non-marking gum-rubber indoor shoes that have never touched outdoor pavement. Dust on soles creates lethal slip hazards during aggressive jump smashes.',
      'Forearm Pronation vs Dangerous Arm Flailing: Novice players mistakenly swing through their shoulders or snap their wrists down, causing chronic rotator cuff impingement. True badminton power is generated via rapid forearm pronation (for forehand smashes) and supination (for backhand clears). The wrist stays cocked at 90 degrees and releases naturally like a whip at terminal contact.',
      'Lunging Mechanics & Foot Landing: When lunging to the front court for net kills or drops, always land heel-first on your racket-side foot, rolling onto the ball of the foot with knee aligned over toes. Landing toe-first or allowing knee valgus (collapsing inward) puts immense stress on the anterior cruciate ligament (ACL) and patellar tendon.',
      'Shuttlecock Flight & Temperature Calibration: In Vadodara’s dry climate, feather shuttlecock skirts dry quickly and can crack. Tiara Club stores tournament shuttles in humidity-controlled cabinets at 85% RH to preserve quill elasticity and true trajectory.'
    ],
    category: 'Badminton',
    author: 'Ananya Deshmukh · Former National Badminton Champion',
    date: 'Sep 29, 2026',
    readTime: '6 min read',
    image: BADMINTON_GYM_IMAGE
  },
  {
    id: 'blog-5',
    slug: 'athletic-strength-conditioning-az',
    title: 'Gym & Athletic Strength Conditioning A-Z: Periodization & Rotational Armor for Racquet Athletes',
    excerpt: 'Why standard bodybuilding hurts court athletes — building multi-planar rotational power, deceleration braking capacity, and joint immunity in the gym.',
    content: [
      'A to Z Kinetic Movement Philosophy: Traditional isolation bodybuilding exercises (bicep curls, leg extensions) train muscles in single planes. Athletic performance in tennis, badminton, and pickleball is tri-planar: sagittal, frontal, and transverse. Athletes must train movements, not isolated muscles. Core training must focus on anti-rotation (Pallof presses, suitcase carries) to protect spinal discs during ferocious 100+ km/h smashes.',
      'Deceleration: The Hidden Key to Speed: Most sports injuries occur during deceleration (stopping or changing direction), not during acceleration. Incorporate eccentric single-leg Romanian deadlifts, drop jumps, and lateral skater bounds to build tissue tolerance in hamstrings and adductors. If you cannot brake safely from high speed, your brain will subconsciously throttle your top acceleration.',
      'Rotational Power Exercises: Use medicine ball side scoop throws, cable rotational chops, and landmine presses to train power transfer through the kinetic chain: ground -> ankles -> hips -> core -> shoulder -> hand. Maintain a braced core and pivot on the rear foot to avoid lumbar shear.',
      'Periodization & Deloading: Do not lift to muscular failure during intense match weeks. Cycle high-load neural strength phases (3–5 reps at 80–85% 1RM) during pre-season, transitioning to explosive power and mobility maintenance (2 full-body sessions per week) during tournament seasons.'
    ],
    category: 'Gym & Conditioning',
    author: 'Devendra Solanki · CSCS & Performance Director',
    date: 'Sep 25, 2026',
    readTime: '7 min read',
    image: GYM_IMAGE
  },
  {
    id: 'blog-6',
    slug: 'squash-racquet-speed-tactics-az',
    title: 'Squash & High-Intensity Racquet Kinetics A-Z: T-Position Domination, Nick Shots & Aerobic Capacity',
    excerpt: 'Dominating four-wall enclosed courts — controlling the center T, drop volley precision, lunging stability, and anaerobic threshold conditioning.',
    content: [
      'A to Z Controlling the T: In squash, owning the center intersection of the court (the T) dictates 80% of rallies. After striking every length shot or crosscourt drive, sprint directly back to the T with a dynamic split-step. This positions you equal distance from all four court corners, forcing your opponent to run 30% more total yardage.',
      'Straight Length & Dying in the Back Corners: A championship length shot clings parallel to the side wall and dies with a double bounce before touching the back glass. Strike through the ball with an open racquet face, hitting the front wall approximately 18 inches above the tin. High, tight lengths restrict your opponent to weak defensive boasts.',
      'Deep Lunging & Hamstring Preservation: Squash demands extreme low-angle lunges into the front court corners. Land on a bent front knee that never drifts past your toes, and keep your torso upright like a piston. Never over-reach with a flat back; train your hip flexor mobility and adductor eccentric strength to spring out of corners back to the T.',
      'Anaerobic Interval Conditioning: Squash is repeated 10-second sprint bursts separated by 7-second recovery periods. Train on court with ghosting drills (moving through corner patterns without a ball) in sets of 20 rallies with 15 seconds rest to push your VO2 max to tournament readiness.'
    ],
    category: 'Squash',
    author: 'Farhan Contractor · WSF Certified Level-3 Squash Director',
    date: 'Sep 21, 2026',
    readTime: '6 min read',
    image: ARENA_COMPLEX_IMAGE
  },
  {
    id: 'blog-7',
    slug: 'athlete-nutrition-hydration-gujarat-az',
    title: 'Athletic Nutrition & Hydration A-Z: Beating Gujarat’s Heat, Glycogen Loading & Cramp Prevention',
    excerpt: 'Comprehensive nutritional strategies for peak athletic performance — sodium-potassium balance, pre-match carb timing, and electrolyte osmolality in humid climates.',
    content: [
      'A to Z The Science of Heat & Sweat Rate: Vadodara’s climate can deplete an athlete’s electrolyte reserves within 45 minutes of intense court action. Drinking plain tap water alone is dangerous during heavy sweating because it dilutes blood sodium levels (exercise-associated hyponatremia), triggering severe muscle spasms and cognitive fog. Weigh yourself before and after practice: every 1 kg lost equates to 1 liter of fluid plus electrolytes that must be replenished.',
      'Electrolyte Formula & Osmolality: Formulate your hydration drink with 500mg sodium, 150mg potassium, 50mg magnesium, and 4% to 6% simple carbohydrates (maltodextrin or glucose). This specific osmolality mirrors human blood plasma, allowing rapid gastric emptying through the stomach without bloating or sloshing during sudden sprints.',
      'Pre-Match Fueling Timeline: Consume a complex carbohydrate meal (brown rice, oats, sweet potatoes, lean protein) 3 hours before match time. 45 minutes prior, consume a fast-digesting snack (banana or energy gel). Avoid high-fat or excess fiber foods immediately before competition, as fat delays gastric transit and diverts vital blood flow from working muscles to digestion.',
      'The 4:1 Golden Post-Match Window: Within 30 minutes post-whistle, consume carbohydrates and protein in a 4:1 ratio (e.g., 60g carbs + 15g whey protein or paneer). This accelerates muscle glycogen re-synthesis while insulin sensitivity remains at peak.'
    ],
    category: 'Sports Nutrition',
    author: 'Meera Chokshi · Certified Sports Dietitian & Performance Nutritionist',
    date: 'Sep 17, 2026',
    readTime: '6 min read',
    image: TENNIS_COURT_IMAGE
  },
  {
    id: 'blog-8',
    slug: 'injury-prevention-mobility-az',
    title: 'Injury Immunity from A to Z: Dynamic Mobility, Rotator Cuff Care & ACL Protection',
    excerpt: 'Why static stretching before play is obsolete — implementing scientific dynamic warm-ups, knee valgus correction, and nocturnal tissue regeneration.',
    content: [
      'A to Z The Death of Pre-Match Static Stretching: Clinical studies demonstrate that holding static stretches for >30 seconds prior to explosive sports temporarily desensitizes muscle spindles, reducing sprint speed and jumping power by up to 8%. Replace static stretching with a structured 12-minute Dynamic Kinetic Warm-Up: high knees, butt kicks, inchworms, world’s greatest stretch, lateral carioca, and progressive acceleration strides.',
      'ACL Safeguarding & Valgus Correction: The anterior cruciate ligament (ACL) is most vulnerable when the knee buckles inward (valgus collapse) during landing or cutting. Athletes must master the athletic landing position: hips back, chest up, knees tracking in line with second toes, and weight absorbed through the midfoot. Integrate weekly single-leg hop-and-stick drills on our training turf to rewire neuromuscular braking.',
      'Rotator Cuff & Scapular Stability: Racket and throwing athletes must protect the small infraspinatus, supraspinatus, and subscapularis muscles that seat the humeral head in the shoulder socket. Perform side-lying external rotations and face pulls with resistance bands 3 times weekly. Never skip scapular push-ups to maintain healthy serratus anterior activation.',
      'Sleep Architecture: The Ultimate Performance Enhancer: 95% of human growth hormone (HGH) release and muscle tissue repair occurs during Stage 3 Deep Non-REM sleep. Aim for 8 hours in a cool (20°C), dark room. Discontinue blue-light screens 45 minutes prior to sleep to preserve melatonin secretion.'
    ],
    category: 'Injury Prevention',
    author: 'Dr. Siddharth Joshi · Orthopedic Sports Medicine Consultant',
    date: 'Sep 12, 2026',
    readTime: '7 min read',
    image: ARENA_COMPLEX_IMAGE
  },
  {
    id: 'blog-9',
    slug: 'sports-psychology-mental-edge-az',
    title: 'The Athlete’s Mental Edge A-Z: Match-Point Composure, Box Breathing & The Resilient Mindset',
    excerpt: 'Mastering sports psychology under intense tournament pressure — the 16-second reset routine, managing adrenaline spikes, and silencing inner self-criticism.',
    content: [
      'A to Z The Psychology of Match Points: What separates club players from champions is not technical ability — it is emotional regulation when serving at 30-40 or facing match point down. Pressure triggers the amygdala, elevating heart rate, tightening grip pressure, and narrowing peripheral vision. Recognizing this physiological surge as natural excitement rather than fear is step one.',
      'The 16-Second Between-Point Ritual: Developed by sports psychologists for world number ones, top performers maintain strict rituals between points: 1) Turn away from the net immediately after a point; 2) Take a deep 4-second nasal inhale, hold for 4 seconds, exhale for 4 seconds (Box Breathing to activate the vagus nerve); 3) Fix your strings or towel down; 4) Select your tactical target before stepping to the line.',
      'Eliminating Negative Self-Talk: When an unforced error occurs, amateur players berate themselves ("Why did I miss that easy volley?"), reinforcing failure pathways in neural circuits. Elite athletes immediately replace blame with constructive technical cues: "Bend knees lower," "High elbow follow-through," or "Next point, fresh start."',
      'Visual Mental Rehearsal: Spend 10 minutes before bed vividly picturing yourself executing flawless serves, decisive forehand passes, or drop dinks under high-noise stadium conditions. Motor cortex neurons fire identically during vivid mental rehearsal as during physical execution.'
    ],
    category: 'Mental Conditioning',
    author: 'Dr. Vikramaditya Rao · High-Performance Sports Psychologist',
    date: 'Sep 08, 2026',
    readTime: '6 min read',
    image: TROPHY_IMAGE
  },
  {
    id: 'blog-10',
    slug: 'agility-footwork-speed-az',
    title: 'Agility, Speed & Plyometric Footwork A-Z: First-Step Quickness & Reactive Deceleration',
    excerpt: 'Dominate every court surface through rapid multi-directional footwork, agility ladder coordination, low center of mass physics, and split-step perfection.',
    content: [
      'A to Z The First-Step Explosion: In court sports like badminton, tennis, and pickleball, most rallies are decided within the first 3 steps. Explosive first-step quickness depends on the "Split Step" — a subtle hop timed exactly as the opponent strikes the ball, pre-loading your calf and Achilles tendon like a coiled spring. Land on the balls of both feet with wide stance, primed to launch instantly in any 360-degree direction.',
      'Low Center of Mass Mechanics: When shifting laterally across the tennis or pickleball court, novice players stay upright, forcing their ankles to bear extreme shear loads. Champions drop their hips by 6 to 8 inches, keeping their center of mass inside their support base. This permits instant direction reversal without losing rotational balance.',
      'Agility Ladder & Cone Protocols: Incorporate two 15-minute agility sessions each week. Use the agility ladder for the Ickey Shuffle, in-and-out foot fires, and lateral single-leg hops to sharpen neuromuscular firing rates. Add reaction-light drills or coach auditory clap cues to train decision speed under chaotic conditions.',
      'Footwear Maintenance & Traction Checks: Inspect your outsole tread patterns weekly. Worn-out soles that have lost their rubber siping dramatically increase stopping distances and court slippage. Replace your court footwear every 6 months or 80 playing hours to preserve vital lateral support counters.'
    ],
    category: 'Footwork & Speed',
    author: 'Samir Mansoori · Lead Athletic Trainer & Biomechanics Specialist',
    date: 'Sep 03, 2026',
    readTime: '5 min read',
    image: PICKLEBALL_IMAGE
  }
];

export const GALLERY_ITEMS = [
  { id: 'g1', title: 'High-Performance Gym Training Floor', category: 'Gym', image: GYM_IMAGE, subtitle: 'Strength & Conditioning Suite' },
  { id: 'g2', title: 'Championship Tennis Baseline Duel', category: 'Tennis', image: TENNIS_COURT_IMAGE, subtitle: 'Center Arena Rally · Vadodara' },
  { id: 'g3', title: 'Pro Pickleball Kitchen Rally', category: 'Pickleball', image: PICKLEBALL_IMAGE, subtitle: 'Evening Competition Session' },
  { id: 'g4', title: 'BWF Teak Badminton Arena', category: 'Badminton', image: BADMINTON_GYM_IMAGE, subtitle: 'Championship Arena Competition' },
  { id: 'g5', title: 'Athletic Conditioning & Cardio Zone', category: 'Gym', image: GYM_IMAGE, subtitle: 'Technogym & Free Weights' },
  { id: 'g6', title: 'Championship Trophy Cabinet', category: 'Heritage', image: TROPHY_IMAGE, subtitle: 'Clubhouse Exhibition Hall' }
];
