// Generator for JoWala Statewide Distributed Service Provider Dataset
// Spreads all 20 categories across realistic distinct localities, taluks & neighborhoods
// in all 38 districts of Tamil Nadu with individual coordinates (no stacking on a single point!)

const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  { id: "c0000001-0000-0000-0000-000000000001", name: "Home Services", name_ta: "வீட்டு சேவைகள்", slug: "home-services", icon: "Home", display_order: 1, desc: "General maintenance and home repairs", desc_ta: "இல்ல பராமரிப்பு மற்றும் பழுதுபார்க்கும் சேவைகள்", basePrice: 299 },
  { id: "c0000001-0000-0000-0000-000000000002", name: "Electricians", name_ta: "எலக்ட்ரீஷியன்கள்", slug: "electricians", icon: "Zap", display_order: 2, desc: "Wiring, fuse repair, and switchboards", desc_ta: "வயரிங் மற்றும் மின்சார பாதுகாப்பு சேவைகள்", basePrice: 250 },
  { id: "c0000001-0000-0000-0000-000000000003", name: "Plumbing", name_ta: "பிளம்பிங்", slug: "plumbing", icon: "Wrench", display_order: 3, desc: "Pipes, taps, motors and leakage fix", desc_ta: "குழாய் கசிவு மற்றும் மோட்டார் பழுது", basePrice: 299 },
  { id: "c0000001-0000-0000-0000-000000000004", name: "Carpentry", name_ta: "தச்சு வேலை", slug: "carpentry", icon: "Hammer", display_order: 4, desc: "Furniture, doors, modular fittings", desc_ta: "மரச்சாமான்கள் பழுது மற்றும் மர வேலைப்பாடு", basePrice: 350 },
  { id: "c0000001-0000-0000-0000-000000000005", name: "Cleaning Services", name_ta: "சுத்தம் செய்யும் சேவைகள்", slug: "cleaning-services", icon: "Sparkles", display_order: 5, desc: "Deep house and sofa sanitization", desc_ta: "முழு வீடு மற்றும் சோபா சுத்தம்", basePrice: 499 },
  { id: "c0000001-0000-0000-0000-000000000006", name: "Appliance Repair", name_ta: "வீட்டு உபகரணங்கள் பழுது", slug: "appliance-repair", icon: "Tv", display_order: 6, desc: "AC, fridge, washing machine care", desc_ta: "ஏசி மற்றும் குளிர்சாதன பெட்டி பழுது", basePrice: 399 },
  { id: "c0000001-0000-0000-0000-000000000007", name: "Vehicle Mechanics", name_ta: "வாகன மெக்கானிக்", slug: "vehicle-mechanics", icon: "Gauge", display_order: 7, desc: "Two and four wheeler repair & roadside help", desc_ta: "இருசக்கர மற்றும் நான்கு சக்கர வாகன பழுது", basePrice: 300 },
  { id: "c0000001-0000-0000-0000-000000000008", name: "Bike and Car Services", name_ta: "பைக் & கார் சர்வீஸ்", slug: "bike-and-car-services", icon: "Car", display_order: 8, desc: "Foam wash, detailing, tyre alignment", desc_ta: "வாட்டர் வாஷ் மற்றும் முழுமையான வாகன சர்வீஸ்", basePrice: 350 },
  { id: "c0000001-0000-0000-0000-000000000009", name: "Beauty and Salons", name_ta: "அழகு & சலூன்", slug: "beauty-and-salons", icon: "Scissors", display_order: 9, desc: "Haircut, facial, bridal salon", desc_ta: "முடி அலங்காரம் மற்றும் மணப்பெண் அலங்காரம்", basePrice: 200 },
  { id: "c0000001-0000-0000-0000-000000000010", name: "Healthcare and Clinics", name_ta: "சுகாதாரம் & கிளினிக்குகள்", slug: "healthcare-and-clinics", icon: "Stethoscope", display_order: 10, desc: "Doctors, dental care, physiotherapy", desc_ta: "மருத்துவ கிளினிக் மற்றும் பல் மருத்துவம்", basePrice: 400 },
  { id: "c0000001-0000-0000-0000-000000000011", name: "Education and Tutors", name_ta: "கல்வி & ஆசிரியர்கள்", slug: "education-and-tutors", icon: "GraduationCap", display_order: 11, desc: "Maths, Science, Tamil, NEET tuition", desc_ta: "பள்ளி மற்றும் போட்டித் தேர்வு சிறப்பு பயிற்சி", basePrice: 800 },
  { id: "c0000001-0000-0000-0000-000000000012", name: "Restaurants and Cafes", name_ta: "உணவகங்கள் & கஃபேக்கள்", slug: "restaurants-and-cafes", icon: "UtensilsCrossed", display_order: 12, desc: "South Indian mess, cafes, family dine", desc_ta: "பாரம்பரிய உணவகம் மற்றும் கஃபேக்கள்", basePrice: 150 },
  { id: "c0000001-0000-0000-0000-000000000013", name: "Grocery and Retail Shops", name_ta: "மளிகை & சில்லறை கடைகள்", slug: "grocery-and-retail", icon: "ShoppingBag", display_order: 13, desc: "Provision stores, organic produce, essentials", desc_ta: "பாரம்பரிய மளிகைக் கடைகள் மற்றும் காய்கறிகள்", basePrice: 100 },
  { id: "c0000001-0000-0000-0000-000000000014", name: "Electronics and Mobile Repair", name_ta: "மொபைல் & எலக்ட்ரானிக்ஸ் பழுது", slug: "electronics-and-mobile-repair", icon: "Smartphone", display_order: 14, desc: "Screen replacement, chip repair, laptops", desc_ta: "ஸ்மார்ட்போன் மற்றும் மடிக்கணினி சர்வீஸ்", basePrice: 299 },
  { id: "c0000001-0000-0000-0000-000000000015", name: "Photography", name_ta: "புகைப்படக்கலை", slug: "photography", icon: "Camera", display_order: 15, desc: "Wedding, outdoor, baby portraits & drone", desc_ta: "திருமண புகைப்படம் மற்றும் வீடியோ பதிவு", basePrice: 2500 },
  { id: "c0000001-0000-0000-0000-000000000016", name: "Event Management", name_ta: "நிகழ்வு மேலாண்மை", slug: "event-management", icon: "PartyPopper", display_order: 16, desc: "Catering, decoration, sound & lights", desc_ta: "விழா மேடை அலங்காரம் மற்றும் கேட்டரிங்", basePrice: 5000 },
  { id: "c0000001-0000-0000-0000-000000000017", name: "Tailoring and Laundry", name_ta: "தையல் & சலவை", slug: "tailoring-and-laundry", icon: "Shirt", display_order: 17, desc: "Blouse stitching, alterations, dry cleaning", desc_ta: "தையல் கலை மற்றும் உலர் சலவை", basePrice: 250 },
  { id: "c0000001-0000-0000-0000-000000000018", name: "Professional Services", name_ta: "தொழில்முறை சேவைகள்", slug: "professional-services", icon: "Briefcase", display_order: 18, desc: "Auditors, GST, legal advice, docs", desc_ta: "ஜிஎஸ்டி தாக்கல் மற்றும் சட்ட ஆலோசனை", basePrice: 999 },
  { id: "c0000001-0000-0000-0000-000000000019", name: "Accommodation and PG", name_ta: "தங்குமிடம் & பிஜி", slug: "accommodation-and-pg", icon: "Building", display_order: 19, desc: "Hostels, bachelor stays, rooms with food", desc_ta: "வாடகை அறைகள் மற்றும் பிஜி விடுதிகள்", basePrice: 4000 },
  { id: "c0000001-0000-0000-0000-000000000020", name: "Other Local Businesses", name_ta: "பிற உள்ளூர் வணிகங்கள்", slug: "other-local-businesses", icon: "Layers", display_order: 20, desc: "Key makers, xerox, nursery gardens", desc_ta: "சாவி தயாரிப்பாளர்கள், ஜெராக்ஸ் மற்றும் பிற சேவைகள்", basePrice: 150 }
];

// 38 Districts with multiple distributed localities per district
const DISTRICTS = [
  {
    name: 'Sivaganga',
    nameTa: 'சிவகங்கை',
    localities: [
      { name: 'Sekkalai, Karaikudi', nameTa: 'செக்கலை, காரைக்குடி', lat: 10.0718, lng: 78.7844, postal: '630002', road: 'College Road' },
      { name: 'Kalanivasal, Karaikudi', nameTa: 'கழனிவாசல், காரைக்குடி', lat: 10.0650, lng: 78.7720, postal: '630002', road: 'New Bus Stand Road' },
      { name: 'Ramnagar, Devakottai', nameTa: 'ராம்நகர், தேவகோட்டை', lat: 9.9482, lng: 78.8242, postal: '630302', road: 'Main Bazaar Road' },
      { name: 'Palace Road, Sivaganga', nameTa: 'அரண்மனை சாலை, சிவகங்கை', lat: 9.8433, lng: 78.4809, postal: '630561', road: 'Collectorate High Road' },
      { name: 'Madurai Road, Manamadurai', nameTa: 'மதுரை சாலை, மானாமதுரை', lat: 9.6974, lng: 78.4485, postal: '630606', road: 'Vaigai Bridge View' },
      { name: 'Fort Road, Tiruppattur', nameTa: 'கோட்டை சாலை, திருப்பத்தூர்', lat: 10.1130, lng: 78.6015, postal: '630211', road: 'Main Car Street' },
      { name: 'Market Road, Singampunari', nameTa: 'மார்க்கெட் ரோடு, சிங்கம்புணரி', lat: 10.1834, lng: 78.4312, postal: '630502', road: 'Bus Stand Circle' }
    ]
  },
  {
    name: 'Chennai',
    nameTa: 'சென்னை',
    localities: [
      { name: 'Anna Nagar', nameTa: 'அண்ணா நகர்', lat: 13.0850, lng: 80.2101, postal: '600040', road: '2nd Avenue Roundtana' },
      { name: 'T. Nagar', nameTa: 'தி நகர்', lat: 13.0418, lng: 80.2341, postal: '600017', road: 'Usman Road' },
      { name: 'Velachery', nameTa: 'வேளச்சேரி', lat: 12.9815, lng: 80.2180, postal: '600042', road: '100 Feet Bypass Road' },
      { name: 'Adyar', nameTa: 'அடையாறு', lat: 13.0012, lng: 80.2565, postal: '600020', road: 'Gandhi Nagar 1st Main Rd' },
      { name: 'Mylapore', nameTa: 'மயிலாப்பூர்', lat: 13.0339, lng: 80.2678, postal: '600004', road: 'Luz Church Road' },
      { name: 'OMR Sholinganallur', nameTa: 'ஓஎம்ஆர் சோழிங்கநல்லூர்', lat: 12.9010, lng: 80.2279, postal: '600119', road: 'IT Expressway Corridor' },
      { name: 'Porur', nameTa: 'போரூர்', lat: 13.0382, lng: 80.1565, postal: '600116', road: 'Mount-Poonamallee High Rd' },
      { name: 'Guindy', nameTa: 'கிண்டி', lat: 13.0067, lng: 80.2025, postal: '600032', road: 'GST Road' }
    ]
  },
  {
    name: 'Coimbatore',
    nameTa: 'கோயம்புத்தூர்',
    localities: [
      { name: 'RS Puram', nameTa: 'ஆர்.எஸ். புரம்', lat: 11.0085, lng: 76.9515, postal: '641002', road: 'DB Road' },
      { name: 'Gandhipuram', nameTa: 'காந்திபுரம்', lat: 11.0180, lng: 76.9680, postal: '641012', road: 'Cross Cut Road' },
      { name: 'Peelamedu', nameTa: 'பீளமேடு', lat: 11.0310, lng: 77.0180, postal: '641004', road: 'Avinashi Road' },
      { name: 'Saravanampatti', nameTa: 'சரவணம்பட்டி', lat: 11.0820, lng: 76.9980, postal: '641035', road: 'Sathy Road IT Corridor' },
      { name: 'Saibaba Colony', nameTa: 'சாயிபாபா காலனி', lat: 11.0320, lng: 76.9420, postal: '641011', road: 'NSR Road' },
      { name: 'Pollachi Town', nameTa: 'பொள்ளாச்சி', lat: 10.6609, lng: 77.0048, postal: '642001', road: 'Palakkad Main Road' },
      { name: 'Mettupalayam', nameTa: 'மேட்டுப்பாளையம்', lat: 11.3000, lng: 76.9500, postal: '641301', road: 'Ooty Main Road' }
    ]
  },
  {
    name: 'Madurai',
    nameTa: 'மதுரை',
    localities: [
      { name: 'Tallakulam', nameTa: 'தல்லாகுளம்', lat: 9.9360, lng: 78.1320, postal: '625002', road: 'Alagarkoil Road' },
      { name: 'Anna Nagar, Madurai', nameTa: 'அண்ணா நகர், மதுரை', lat: 9.9175, lng: 78.1465, postal: '625020', road: '80 Feet Road' },
      { name: 'KK Nagar, Madurai', nameTa: 'கே.கே. நகர், மதுரை', lat: 9.9320, lng: 78.1478, postal: '625020', road: 'East High Court View' },
      { name: 'Mattuthavani', nameTa: 'மாட்டுத்தாவணி', lat: 9.9470, lng: 78.1580, postal: '625007', road: 'Integrated Bus Terminal Rd' },
      { name: 'SS Colony', nameTa: 'எஸ்.எஸ். காலனி', lat: 9.9210, lng: 78.1020, postal: '625016', road: 'Bye Pass Road' },
      { name: 'Thirunagar', nameTa: 'திருநகர்', lat: 9.8780, lng: 78.0670, postal: '625006', road: 'GST Tirumangalam Highway' },
      { name: 'Melur Town', nameTa: 'மேலூர்', lat: 10.0500, lng: 78.3300, postal: '625106', road: 'Trichy Highway Junction' }
    ]
  },
  {
    name: 'Tiruchirappalli',
    nameTa: 'திருச்சிராப்பள்ளி',
    localities: [
      { name: 'Thillai Nagar', nameTa: 'தில்லை நகர்', lat: 10.8250, lng: 78.6880, postal: '620018', road: '11th Cross Main' },
      { name: 'Srirangam', nameTa: 'ஸ்ரீரங்கம்', lat: 10.8622, lng: 78.6946, postal: '620006', road: 'South Chithirai Street' },
      { name: 'Cantonment', nameTa: 'கன்டோன்மென்ட்', lat: 10.7980, lng: 78.6850, postal: '620001', road: 'Collector Office Road' },
      { name: 'KK Nagar, Trichy', nameTa: 'கே.கே. நகர், திருச்சி', lat: 10.7720, lng: 78.7050, postal: '620021', road: 'Airport Link Road' },
      { name: 'Kattur', nameTa: 'காட்டூர்', lat: 10.7890, lng: 78.7750, postal: '620019', road: 'Thanjavur Highway' }
    ]
  },
  {
    name: 'Salem',
    nameTa: 'சேலம்',
    localities: [
      { name: 'Fairlands', nameTa: 'ஃபேர்லேண்ட்ஸ்', lat: 11.6780, lng: 78.1420, postal: '636016', road: 'Brindavan Road' },
      { name: 'Meyyanur', nameTa: 'மெய்யனூர்', lat: 11.6680, lng: 78.1310, postal: '636004', road: 'Junction Main Road' },
      { name: 'Hasthampatti', nameTa: 'அஸ்தம்பட்டி', lat: 11.6810, lng: 78.1620, postal: '636007', road: 'Yercaud Foot Hills Rd' },
      { name: 'Shevapet', nameTa: 'செவ்வாய்பேட்டை', lat: 11.6510, lng: 78.1400, postal: '636002', road: 'Bazaar Street' },
      { name: 'Attur Town', nameTa: 'ஆத்தூர்', lat: 11.5977, lng: 78.6015, postal: '636102', road: 'Cuddalore Main Road' }
    ]
  },
  {
    name: 'Tirunelveli',
    nameTa: 'திருநெல்வேலி',
    localities: [
      { name: 'Palayamkottai', nameTa: 'பாளையங்கோட்டை', lat: 8.7180, lng: 77.7420, postal: '627002', road: 'Trivandrum Road' },
      { name: 'Tirunelveli Junction', nameTa: 'திருநெல்வேலி சந்திப்பு', lat: 8.7300, lng: 77.7120, postal: '627001', road: 'Railway Station Feeder Rd' },
      { name: 'Tirunelveli Town', nameTa: 'திருநெல்வேலி நகரம்', lat: 8.7280, lng: 77.6850, postal: '627006', road: 'Swami Sannidhi Street' },
      { name: 'Melapalayam', nameTa: 'மேலப்பாளையம்', lat: 8.6980, lng: 77.7280, postal: '627005', road: 'Ambai Main Road' }
    ]
  },
  {
    name: 'Tiruppur',
    nameTa: 'திருப்பூர்',
    localities: [
      { name: 'Pushpa Junction, Tiruppur', nameTa: 'புஷ்பா சந்திப்பு', lat: 11.1180, lng: 77.3450, postal: '641602', road: 'Avinashi Main Road' },
      { name: 'Dharapuram Road', nameTa: 'தாராபுரம் சாலை', lat: 11.0920, lng: 77.3510, postal: '641604', road: 'Kovil Vazhi' },
      { name: 'Anupparpalayam', nameTa: 'அனுப்பர்பாளையம்', lat: 11.1450, lng: 77.3320, postal: '641652', road: 'Vessel Market Road' },
      { name: 'Udumalaipettai', nameTa: 'உடுமலைப்பேட்டை', lat: 10.5855, lng: 77.2492, postal: '642126', road: 'Munnar Highway' }
    ]
  },
  {
    name: 'Erode',
    nameTa: 'ஈரோடு',
    localities: [
      { name: 'Perundurai Road', nameTa: 'பெருந்துறை சாலை', lat: 11.3320, lng: 77.7010, postal: '638011', road: 'Collectorate Circle' },
      { name: 'Brough Road', nameTa: 'பிரா ரோடு', lat: 11.3450, lng: 77.7250, postal: '638001', road: 'Clock Tower Junction' },
      { name: 'Gobichettipalayam', nameTa: 'கோபிசெட்டிபாளையம்', lat: 11.4552, lng: 77.4373, postal: '638452', road: 'Katcheri Medu' },
      { name: 'Bhavani Town', nameTa: 'பவானி', lat: 11.4480, lng: 77.6820, postal: '638301', road: 'Sangameshwarar Temple Rd' }
    ]
  },
  {
    name: 'Vellore',
    nameTa: 'வேலூர்',
    localities: [
      { name: 'Katpadi', nameTa: 'காட்பாடி', lat: 12.9698, lng: 79.1390, postal: '632014', road: 'Chittoor High Road' },
      { name: 'Gandhi Nagar, Vellore', nameTa: 'காந்தி நகர்', lat: 12.9510, lng: 79.1420, postal: '632006', road: 'East Main Road' },
      { name: 'Old Town Fort', nameTa: 'கோட்டை பகுதி', lat: 12.9165, lng: 79.1325, postal: '632001', road: 'Officers Line' },
      { name: 'Bagayam CMC', nameTa: 'பாகாயம் சி.எம்.சி', lat: 12.8750, lng: 79.1320, postal: '632002', road: 'Arni Road' }
    ]
  },
  {
    name: 'Thanjavur',
    nameTa: 'தஞ்சாவூர்',
    localities: [
      { name: 'Medical College Road', nameTa: 'மருத்துவக் கல்லூரி சாலை', lat: 10.7710, lng: 79.1250, postal: '613004', road: 'Eswari Nagar' },
      { name: 'South Rampart', nameTa: 'தெற்கு அலங்கம்', lat: 10.7870, lng: 79.1378, postal: '613001', road: 'Old Bus Stand Corridor' },
      { name: 'Kumbakonam Town', nameTa: 'கும்பகோணம்', lat: 10.9602, lng: 79.3845, postal: '612001', road: 'TSR Big Street' },
      { name: 'Pattukkottai', nameTa: 'பட்டுக்கோட்டை', lat: 10.4280, lng: 79.3180, postal: '614601', road: 'Aranthangi Road' }
    ]
  },
  {
    name: 'Dindigul',
    nameTa: 'திண்டுக்கல்',
    localities: [
      { name: 'GTN Salai', nameTa: 'ஜி.டி.என். சாலை', lat: 10.3673, lng: 77.9803, postal: '624001', road: 'Main Bus Stand Rd' },
      { name: 'Palani Town', nameTa: 'பழனி', lat: 10.4500, lng: 77.5167, postal: '624601', road: 'Adivaram Hill Road' },
      { name: 'Kodaikanal', nameTa: 'கொடைக்கானல்', lat: 10.2381, lng: 77.4892, postal: '624101', road: 'Lake View Road' }
    ]
  },
  {
    name: 'Kanyakumari',
    nameTa: 'கன்னியாகுமரி',
    localities: [
      { name: 'Nagercoil Town', nameTa: 'நாகர்கோவில்', lat: 8.1833, lng: 77.4119, postal: '629001', road: 'Cape Road' },
      { name: 'Kanyakumari Beach', nameTa: 'கன்னியாகுமரி கடற்கரை', lat: 8.0883, lng: 77.5385, postal: '629702', road: 'Sunset Point Road' },
      { name: 'Marthandam', nameTa: 'மார்த்தாண்டம்', lat: 8.3050, lng: 77.2280, postal: '629165', road: 'Trivandrum Highway' }
    ]
  },
  {
    name: 'Thoothukudi',
    nameTa: 'தூத்துக்குடி',
    localities: [
      { name: 'Beach Road, Thoothukudi', nameTa: 'கடற்கரை சாலை', lat: 8.7642, lng: 78.1348, postal: '628001', road: 'Old Port View' },
      { name: 'Kovilpatti', nameTa: 'கோவில்பட்டி', lat: 9.1728, lng: 77.8687, postal: '628501', road: 'Kadalai Mittai Bazaar' },
      { name: 'Tiruchendur', nameTa: 'திருச்செந்தூர்', lat: 8.4980, lng: 78.1250, postal: '628215', road: 'Temple Sannidhi Road' }
    ]
  },
  {
    name: 'Chengalpattu',
    nameTa: 'செங்கல்பட்டு',
    localities: [
      { name: 'Tambaram East', nameTa: 'தாம்பரம் கிழக்கு', lat: 12.9249, lng: 80.1472, postal: '600045', road: 'GST Highway Corridor' },
      { name: 'Chengalpattu Bazaar', nameTa: 'செங்கல்பட்டு நகரம்', lat: 12.6922, lng: 79.9774, postal: '603001', road: 'GH Road' },
      { name: 'Guduvanchery', nameTa: 'கூடுவாஞ்சேரி', lat: 12.8450, lng: 80.0620, postal: '603202', road: 'Nellikuppam Road' },
      { name: 'Mahabalipuram', nameTa: 'மாமல்லபுரம்', lat: 12.6269, lng: 80.1927, postal: '603104', road: 'Shore Temple East Coast Rd' }
    ]
  },
  {
    name: 'Kanchipuram',
    nameTa: 'காஞ்சிபுரம்',
    localities: [
      { name: 'Gandhi Road, Kanchi', nameTa: 'காந்தி சாலை, காஞ்சி', lat: 12.8342, lng: 79.7036, postal: '631501', road: 'Silk Weavers Colony' },
      { name: 'Ennaikaran', nameTa: 'எண்ணைக்கார தெரு', lat: 12.8420, lng: 79.7120, postal: '631502', road: 'Kamakshi Amman Sannidhi' },
      { name: 'Sriperumbudur', nameTa: 'ஸ்ரீபெரும்புதூர்', lat: 12.9680, lng: 79.9430, postal: '602105', road: 'Bangalore Highway Industrial Belt' }
    ]
  },
  {
    name: 'Tiruvallur',
    nameTa: 'திருவள்ளூர்',
    localities: [
      { name: 'Tiruvallur Town', nameTa: 'திருவள்ளூர் நகரம்', lat: 13.1432, lng: 79.9074, postal: '602001', road: 'JN Road' },
      { name: 'Avadi', nameTa: 'ஆவடி', lat: 13.1147, lng: 80.1018, postal: '600054', road: 'CTH Road' },
      { name: 'Poonamallee', nameTa: 'பூந்தமல்லி', lat: 13.0489, lng: 80.0935, postal: '600056', road: 'Trunk Road' }
    ]
  },
  {
    name: 'Cuddalore',
    nameTa: 'கடலூர்',
    localities: [
      { name: 'Cuddalore OT', nameTa: 'கடலூர் பழைய நகரம்', lat: 11.7480, lng: 79.7714, postal: '607003', road: 'Silver Beach Road' },
      { name: 'Chidambaram', nameTa: 'சிதம்பரம்', lat: 11.3992, lng: 79.6934, postal: '608001', road: 'West Car Street' },
      { name: 'Neyveli Township', nameTa: 'நெய்வேலி', lat: 11.6022, lng: 79.4862, postal: '607801', road: 'Block 24 Central Circle' },
      { name: 'Panruti', nameTa: 'பண்ருட்டி', lat: 11.7680, lng: 79.5520, postal: '607106', road: 'Jackfruit Market Road' }
    ]
  },
  {
    name: 'Villupuram',
    nameTa: 'விழுப்புரம்',
    localities: [
      { name: 'Villupuram Central', nameTa: 'விழுப்புரம் மையம்', lat: 11.9401, lng: 79.4861, postal: '605602', road: 'Nehruji Road' },
      { name: 'Tindivanam', nameTa: 'திண்டிவனம்', lat: 12.2285, lng: 79.6508, postal: '604001', road: 'Mailam Road' },
      { name: 'Gingee Town', nameTa: 'செஞ்சி', lat: 12.2530, lng: 79.4180, postal: '604202', road: 'Fort Road' }
    ]
  },
  {
    name: 'Kallakurichi',
    nameTa: 'கள்ளக்குறிச்சி',
    localities: [
      { name: 'Kallakurichi Bazaar', nameTa: 'கள்ளக்குறிச்சி கடைவீதி', lat: 11.7383, lng: 78.9639, postal: '606202', road: 'Salem Main Road' },
      { name: 'Ulundurpet', nameTa: 'உளுந்தூர்பேட்டை', lat: 11.6890, lng: 79.2890, postal: '606107', road: 'National Highway Junction' }
    ]
  },
  {
    name: 'Tiruvannamalai',
    nameTa: 'திருவண்ணாமலை',
    localities: [
      { name: 'Girivalam Road', nameTa: 'கிரிவலப் பாதை', lat: 12.2253, lng: 79.0747, postal: '606601', road: 'Arunachaleswarar Sannidhi' },
      { name: 'Arani Town', nameTa: 'ஆரணி', lat: 12.6680, lng: 79.2840, postal: '632301', road: 'Silk Saree Market Road' },
      { name: 'Cheyyar', nameTa: 'செய்யாறு', lat: 12.6580, lng: 79.5420, postal: '604407', road: 'SIPCOT Industrial Belt' }
    ]
  },
  {
    name: 'Krishnagiri',
    nameTa: 'கிருஷ்ணகிரி',
    localities: [
      { name: 'Krishnagiri Town', nameTa: 'கிருஷ்ணகிரி', lat: 12.5266, lng: 78.2144, postal: '635001', road: 'Roundana Junction' },
      { name: 'Hosur SIPCOT', nameTa: 'ஓசூர் சிப்காட்', lat: 12.7409, lng: 77.8253, postal: '635109', road: 'Bagalur Road' },
      { name: 'Hosur Bus Stand', nameTa: 'ஓசூர் பஸ் நிலையம்', lat: 12.7310, lng: 77.8320, postal: '635109', road: 'Bangalore Road' }
    ]
  },
  {
    name: 'Dharmapuri',
    nameTa: 'தருமபுரி',
    localities: [
      { name: 'Dharmapuri Town', nameTa: 'தருமபுரி', lat: 12.1277, lng: 78.1579, postal: '636701', road: 'Netaji Bye Pass Road' },
      { name: 'Harur', nameTa: 'அரூர்', lat: 12.0620, lng: 78.4950, postal: '636903', road: 'Main Bazaar' },
      { name: 'Pennagaram', nameTa: 'பெண்ணாகரம்', lat: 12.1350, lng: 77.8920, postal: '636810', road: 'Hogenakkal Road' }
    ]
  },
  {
    name: 'Nilgiris',
    nameTa: 'நீலகிரி',
    localities: [
      { name: 'Ooty Commercial Road', nameTa: 'ஊட்டி வணிக வளாகம்', lat: 11.4102, lng: 76.6950, postal: '643001', road: 'Charring Cross' },
      { name: 'Coonoor Town', nameTa: 'குன்னூர்', lat: 11.3530, lng: 76.7959, postal: '643101', road: 'Sims Park Road' },
      { name: 'Kotagiri', nameTa: 'கோத்தகிரி', lat: 11.4240, lng: 76.8620, postal: '643217', road: 'Tea Estate Junction' }
    ]
  },
  {
    name: 'Theni',
    nameTa: 'தேனி',
    localities: [
      { name: 'Theni Allinagaram', nameTa: 'தேனி அல்லிநகரம்', lat: 10.0104, lng: 77.4768, postal: '625531', road: 'Madurai Road' },
      { name: 'Periyakulam', nameTa: 'பெரியகுளம்', lat: 10.1210, lng: 77.5480, postal: '625601', road: 'Horticulture College Road' },
      { name: 'Bodinayakanur', nameTa: 'போடிநாயக்கனூர்', lat: 10.0120, lng: 77.3490, postal: '625513', road: 'Cardamom City Road' }
    ]
  },
  {
    name: 'Virudhunagar',
    nameTa: 'விருதுநகர்',
    localities: [
      { name: 'Virudhunagar Bazaar', nameTa: 'விருதுநகர் கடைவீதி', lat: 9.5680, lng: 77.9624, postal: '626001', road: 'Madurai Road' },
      { name: 'Sivakasi', nameTa: 'சிவகாசி', lat: 9.4533, lng: 77.7972, postal: '626123', road: 'Coronation Colony Road' },
      { name: 'Rajapalayam', nameTa: 'ராஜபாளையம்', lat: 9.4532, lng: 77.5545, postal: '626117', road: 'Tenkasi Highway Road' },
      { name: 'Aruppukkottai', nameTa: 'அருப்புக்கோட்டை', lat: 9.5120, lng: 78.0980, postal: '626101', road: 'Weavers Lane' }
    ]
  },
  {
    name: 'Ramanathapuram',
    nameTa: 'இராமநாதபுரம்',
    localities: [
      { name: 'Ramanathapuram Town', nameTa: 'இராமநாதபுரம்', lat: 9.3639, lng: 78.8395, postal: '623501', road: 'Palace Street' },
      { name: 'Rameswaram Island', nameTa: 'இராமேஸ்வரம்', lat: 9.2876, lng: 79.3129, postal: '623526', road: 'Agni Theertham Road' },
      { name: 'Paramakudi', nameTa: 'பரமக்குடி', lat: 9.5420, lng: 78.5910, postal: '623707', road: 'Vaigai South Bank' }
    ]
  },
  {
    name: 'Tenkasi',
    nameTa: 'தென்காசி',
    localities: [
      { name: 'Tenkasi Kasi Viswanathar Sannidhi', nameTa: 'தென்காசி காசி விஸ்வநாதர் சன்னதி', lat: 8.9594, lng: 77.3150, postal: '627811', road: 'Courtallam Main Road' },
      { name: 'Sankarankovil', nameTa: 'சங்கரன்கோவில்', lat: 9.1720, lng: 77.5320, postal: '627756', road: 'Gomathi Amman Temple Street' },
      { name: 'Kadayanallur', nameTa: 'கடையநல்லூர்', lat: 9.0750, lng: 77.3450, postal: '627751', road: 'Madurai National Highway' }
    ]
  },
  {
    name: 'Pudukkottai',
    nameTa: 'புதுக்கோட்டை',
    localities: [
      { name: 'Pudukkottai Town', nameTa: 'புதுக்கோட்டை நகரம்', lat: 10.3797, lng: 78.8208, postal: '622001', road: 'Keela Raja Veedhi' },
      { name: 'Aranthangi', nameTa: 'அறந்தாங்கி', lat: 10.1650, lng: 78.9980, postal: '614616', road: 'Fort View Road' },
      { name: 'Ponnamaravathi', nameTa: 'பொன்னமராவதி', lat: 10.2450, lng: 78.5320, postal: '622407', road: 'Bus Stand Circle' }
    ]
  },
  {
    name: 'Karur',
    nameTa: 'கரூர்',
    localities: [
      { name: 'Karur Textile City', nameTa: 'கரூர் ஜவுளி நகரம்', lat: 10.9601, lng: 78.0766, postal: '639001', road: 'Kovai Road' },
      { name: 'Kulithalai', nameTa: 'குளித்தலை', lat: 10.9320, lng: 78.4180, postal: '639104', road: 'Cauvery River Bank Road' }
    ]
  },
  {
    name: 'Namakkal',
    nameTa: 'நாமக்கல்',
    localities: [
      { name: 'Namakkal Fort View', nameTa: 'நாமக்கல் கோட்டை பகுதி', lat: 11.2189, lng: 78.1674, postal: '637001', road: 'Salem Main Road' },
      { name: 'Tiruchengode', nameTa: 'திருச்செங்கோடு', lat: 11.3789, lng: 77.8943, postal: '637211', road: 'Arthanareeswarar Hill Road' },
      { name: 'Rasipuram', nameTa: 'ராசிபுரம்', lat: 11.4650, lng: 78.1750, postal: '637408', road: 'Ghee Bazaar Street' }
    ]
  },
  {
    name: 'Ariyalur',
    nameTa: 'அரியலூர்',
    localities: [
      { name: 'Ariyalur Town', nameTa: 'அரியலூர் நகரம்', lat: 11.1397, lng: 79.0760, postal: '621704', road: 'Market Street' },
      { name: 'Jayankondam', nameTa: 'ஜெயங்கொண்டம்', lat: 11.2150, lng: 79.3520, postal: '621802', road: 'Chola Capital Road' }
    ]
  },
  {
    name: 'Perambalur',
    nameTa: 'பெரம்பலூர்',
    localities: [
      { name: 'Perambalur Town', nameTa: 'பெரம்பலூர் நகரம்', lat: 11.2342, lng: 78.8817, postal: '621212', road: 'Trichy Chennai NH Bypass' },
      { name: 'Kunnam', nameTa: 'குன்னம்', lat: 11.2420, lng: 79.0120, postal: '621708', road: 'Main Road' }
    ]
  },
  {
    name: 'Mayiladuthurai',
    nameTa: 'மயிலாடுதுறை',
    localities: [
      { name: 'Mayiladuthurai Town', nameTa: 'மயிலாடுதுறை நகரம்', lat: 11.1075, lng: 79.6522, postal: '609001', road: 'Pattamangala Street' },
      { name: 'Sirkazhi', nameTa: 'சீர்காழி', lat: 11.2350, lng: 79.7350, postal: '609110', road: 'Temple Street' }
    ]
  },
  {
    name: 'Nagapattinam',
    nameTa: 'நாகப்பட்டினம்',
    localities: [
      { name: 'Nagapattinam Port', nameTa: 'நாகப்பட்டினம் துறைமுகம்', lat: 10.7656, lng: 79.8424, postal: '611001', road: 'Public Office Road' },
      { name: 'Velankanni', nameTa: 'வேளாங்கண்ணி', lat: 10.6810, lng: 79.8480, postal: '611111', road: 'Church Road' }
    ]
  },
  {
    name: 'Tiruvarur',
    nameTa: 'திருவாரூர்',
    localities: [
      { name: 'Tiruvarur Town', nameTa: 'திருவாரூர் நகரம்', lat: 10.7725, lng: 79.6365, postal: '610001', road: 'Kamalalayam Tank View' },
      { name: 'Mannargudi', nameTa: 'மன்னார்குடி', lat: 10.6650, lng: 79.4480, postal: '614001', road: 'Big Bazaar Street' }
    ]
  },
  {
    name: 'Ranipet',
    nameTa: 'இராணிப்பேட்டை',
    localities: [
      { name: 'Ranipet SIPCOT', nameTa: 'இராணிப்பேட்டை சிப்காட்', lat: 12.9272, lng: 79.3330, postal: '632401', road: 'Chennai-Bengaluru Highway' },
      { name: 'Arakkonam', nameTa: 'அரக்கோணம்', lat: 13.0820, lng: 79.6680, postal: '631001', road: 'Railway Junction Road' }
    ]
  },
  {
    name: 'Tirupathur',
    nameTa: 'திருப்பத்தூர்',
    localities: [
      { name: 'Tirupathur Town', nameTa: 'திருப்பத்தூர் நகரம்', lat: 12.4947, lng: 78.5668, postal: '635601', road: 'Krishnagiri Main Road' },
      { name: 'Ambur', nameTa: 'ஆம்பூர்', lat: 12.7904, lng: 78.7166, postal: '635802', road: 'Leather City High Road' },
      { name: 'Vaniyambadi', nameTa: 'வாணியம்பாடி', lat: 12.6825, lng: 78.6186, postal: '635751', road: 'Palar River Bank Road' }
    ]
  }
];

// Brand Prefixes for Tamil Nadu
const BRAND_PREFIXES = [
  { en: 'Sri Murugan', ta: 'ஸ்ரீ முருகன்' },
  { en: 'Tamil Valam', ta: 'தமிழ் வளம்' },
  { en: 'Meenakshi', ta: 'மீனாட்சி' },
  { en: 'Kaveri', ta: 'காவிரி' },
  { en: 'Chola Royal', ta: 'சோழ ராயல்' },
  { en: 'Pandian Express', ta: 'பாண்டியன் எக்ஸ்பிரஸ்' },
  { en: 'Kongu Star', ta: 'கொங்கு ஸ்டார்' },
  { en: 'Chettinad Heritage', ta: 'செட்டிநாடு ஹெரிடேஜ்' },
  { en: 'Nellai Super', ta: 'நெல்லை சூப்பர்' },
  { en: 'Vetrivel', ta: 'வெற்றிவேல்' },
  { en: 'Annamalai', ta: 'அண்ணாமலை' },
  { en: 'Ponni', ta: 'பொன்னி' }
];

console.log('Generating distributed providers for', DISTRICTS.length, 'districts...');

const businesses = [];
let bizCounter = 1;

for (const district of DISTRICTS) {
  const locCount = district.localities.length;
  
  for (let catIdx = 0; catIdx < CATEGORIES.length; catIdx++) {
    const cat = CATEGORIES[catIdx];
    const loc = district.localities[catIdx % locCount];
    const brand = BRAND_PREFIXES[(catIdx + businesses.length) % BRAND_PREFIXES.length];
    
    // Slight deterministic offset per category (0.002 to 0.008 deg, ~200m - 900m)
    // so items in the same locality don't overlap pins
    const offsetLat = ((catIdx * 7) % 11 - 5) * 0.0015;
    const offsetLng = ((catIdx * 13) % 11 - 5) * 0.0015;
    
    const lat = Number((loc.lat + offsetLat).toFixed(4));
    const lng = Number((loc.lng + offsetLng).toFixed(4));
    
    const id = `b_${cat.slug}_${district.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}_${catIdx + 1}`;
    const bizName = `${brand.en} ${cat.name} - ${loc.name.split(',')[0]}`;
    const bizNameTa = `${brand.ta} ${cat.name_ta} (${loc.nameTa.split(',')[0]})`;
    const slug = `${brand.en.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cat.slug}-${district.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${catIdx + 1}`;
    
    const phoneNum = `+91 9840${String(bizCounter).padStart(6, '0')}`;
    const minPrice = cat.basePrice + (catIdx * 15 % 150);
    const rating = Number((4.5 + ((catIdx * 3) % 5) * 0.1).toFixed(1));
    const reviewCount = 20 + ((catIdx * 17) % 80);
    
    const address = `${10 + (catIdx * 3)}, ${loc.road}, ${loc.name}, ${district.name} District - ${loc.postal}`;
    
    businesses.push({
      id,
      categoryId: cat.id,
      categorySlug: cat.slug,
      categoryName: cat.name,
      categoryNameTa: cat.name_ta,
      categoryIcon: cat.icon,
      name: bizName,
      nameTa: bizNameTa,
      slug,
      tagline: `Trusted ${cat.name} Specialists in ${loc.name}`,
      taglineTa: `${loc.nameTa} பகுதியில் நம்பகமான ${cat.name_ta} சேவை`,
      description: `Professional, certified ${cat.name.toLowerCase()} service serving ${loc.name}, ${district.name} and surrounding 30 km areas with prompt doorstep arrival and transparent quotes.`,
      descriptionTa: `${loc.nameTa}, ${district.nameTa} மற்றும் சுற்றுவட்டார 30 கி.மீ பகுதிகளுக்கு நம்பகமான ${cat.name_ta} சேவை. நியாயமான கட்டணம் மற்றும் உடனடி முன்பதிவு.`,
      address,
      locality: loc.name,
      city: district.name,
      district: district.name,
      state: "Tamil Nadu",
      postalCode: loc.postal,
      latitude: lat,
      longitude: lng,
      phone: phoneNum,
      email: `contact@${slug.slice(0, 30)}.jowala.in`,
      website: `https://${slug.slice(0, 25)}.jowala.in`,
      rating,
      reviewCount,
      isVerified: true,
      isClaimed: true,
      bookingEnabled: true,
      minPrice,
      experienceYears: 5 + (catIdx % 10),
      serviceMode: ["at_doorstep", "at_shop"],
      services: [
        {
          id: `s_${id}_1`,
          name: `Standard ${cat.name} Consultation / Visit`,
          nameTa: `வழக்கமான ${cat.name_ta} ஆலோசனை`,
          price: minPrice,
          durationMinutes: 45,
          description: `Standard service visit and expert inspection across ${loc.name} and 30km radius.`
        },
        {
          id: `s_${id}_2`,
          name: `Complete ${cat.name} Care Package`,
          nameTa: `முழுமையான ${cat.name_ta} தொகுப்பு`,
          price: Math.round(minPrice * 1.8),
          durationMinutes: 90,
          description: `End-to-end service execution with quality guarantee.`
        }
      ]
    });
    
    bizCounter++;
  }
}

console.log(`Generated ${businesses.length} businesses distributed across all Tamil Nadu places.`);

// Format output mockData.js
const mockDataContent = `// JoWala Production Data Catalog
// 20 Standard Categories & Realistically Distributed Verified Providers across ALL 38 Districts of Tamil Nadu
// Each service is located in specific towns, taluks, and neighborhoods with distinct coordinates
// Total: ${businesses.length} Verified Providers

export const INITIAL_CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

export const INITIAL_BUSINESSES = ${JSON.stringify(businesses, null, 2)};

export const INITIAL_REVIEWS = [
  {
    id: 'rev_sample_01',
    businessId: 'b_plumbing_sivaganga_3',
    customerName: 'Pravin Kumar',
    rating: 5,
    comment: 'Punctual arrival in Karaikudi and fast water pipe leak repair. Transparent pricing!',
    createdAt: '2026-10-18T10:00:00Z',
    ownerResponse: 'Thank you for choosing JoWala!'
  },
  {
    id: 'rev_sample_02',
    businessId: 'b_electricians_madurai_2',
    customerName: 'Karthik Raja',
    rating: 5,
    comment: 'Fixed short circuit problem in Tallakulam within 30 minutes. Excellent service!',
    createdAt: '2026-10-18T14:30:00Z',
    ownerResponse: null
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bk_demo_01',
    customerId: 'u_customer_01',
    customerName: 'Customer Account',
    customerPhone: '+91 88386 97749',
    customerEmail: 'customer@jowala.in',
    businessId: 'b_plumbing_sivaganga_3',
    businessName: 'Meenakshi Plumbing - Sekkalai, Karaikudi',
    serviceId: 's_b_plumbing_sivaganga_3_1',
    serviceName: 'Standard Plumbing Consultation / Visit',
    bookingDate: '2026-10-21',
    bookingTime: '10:00 AM',
    serviceMode: 'at_doorstep',
    address: '14, College Road, Sekkalai, Karaikudi - 630002',
    notes: 'Kitchen tap leaking water continuously.',
    estimatedPrice: 299,
    status: 'confirmed',
    createdAt: '2026-10-19T09:00:00Z'
  }
];
`;

const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.js');
fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
console.log('Successfully updated src/data/mockData.js');
