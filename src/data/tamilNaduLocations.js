// Full Tamil Nadu Locations, Towns & Spatial Distance Utilities
// Covers all 38 Official Revenue Districts + Major Towns, Taluks & Localities across Tamil Nadu

export const TAMIL_NADU_LOCATIONS = [
  // Sivaganga District (including Karaikudi, Sekkalai, Kalanivasal, Devakottai, Tiruppattur)
  { id: 'karaikudi', name: 'Karaikudi', nameTa: 'காரைக்குடி', district: 'Sivaganga', lat: 10.0718, lng: 78.7844, postal: '630001', aliases: ['karaikudi', 'kkdi', 'kdi', 'காரைக்குடி', 'chettinad', 'செட்டிநாடு', 'karaikkudi'] },
  { id: 'sekkalai-karaikudi', name: 'Sekkalai, Karaikudi', nameTa: 'செக்கலை, காரைக்குடி', district: 'Sivaganga', lat: 10.0718, lng: 78.7844, postal: '630002', aliases: ['sekkalai', 'karaikudi', 'kkdi'] },
  { id: 'kalanivasal-karaikudi', name: 'Kalanivasal, Karaikudi', nameTa: 'கழனிவாசல், காரைக்குடி', district: 'Sivaganga', lat: 10.0650, lng: 78.7720, postal: '630002', aliases: ['kalanivasal', 'karaikudi', 'kkdi'] },
  { id: 'sivaganga', name: 'Sivaganga', nameTa: 'சிவகங்கை', district: 'Sivaganga', lat: 9.8433, lng: 78.4809, postal: '630561', aliases: ['sivaganga', 'sivagangai', 'svg', 'சிவகங்கை'] },
  { id: 'devakottai', name: 'Devakottai', nameTa: 'தேவகோட்டை', district: 'Sivaganga', lat: 9.9482, lng: 78.8242, postal: '630302', aliases: ['devakottai', 'தேவகோட்டை', 'karaikudi'] },
  { id: 'tiruppattur-sivaganga', name: 'Tiruppattur, Sivaganga', nameTa: 'திருப்பத்தூர், சிவகங்கை', district: 'Sivaganga', lat: 10.1130, lng: 78.6015, postal: '630211', aliases: ['tiruppattur', 'thiruppathur', 'sivaganga'] },
  { id: 'manamadurai', name: 'Manamadurai', nameTa: 'மானாமதுரை', district: 'Sivaganga', lat: 9.6974, lng: 78.4485, postal: '630606', aliases: ['manamadurai', 'sivaganga'] },

  // Chennai & Suburbs
  { id: 'chennai', name: 'Chennai', nameTa: 'சென்னை', district: 'Chennai', lat: 13.0827, lng: 80.2707, postal: '600001', aliases: ['chennai', 'madras', 'ms', 'mas', 'mds', 'சென்னை'] },
  { id: 'anna-nagar', name: 'Anna Nagar, Chennai', nameTa: 'அண்ணா நகர்', district: 'Chennai', lat: 13.0850, lng: 80.2101, postal: '600040', aliases: ['anna nagar', 'chennai'] },
  { id: 't-nagar', name: 'T. Nagar, Chennai', nameTa: 'தி நகர்', district: 'Chennai', lat: 13.0418, lng: 80.2341, postal: '600017', aliases: ['t nagar', 'thyagaraya nagar', 'chennai'] },
  { id: 'velachery', name: 'Velachery, Chennai', nameTa: 'வேளச்சேரி', district: 'Chennai', lat: 12.9815, lng: 80.2180, postal: '600042', aliases: ['velachery', 'chennai'] },
  { id: 'adyar', name: 'Adyar, Chennai', nameTa: 'அடையாறு', district: 'Chennai', lat: 13.0012, lng: 80.2565, postal: '600020', aliases: ['adyar', 'chennai'] },
  { id: 'mylapore', name: 'Mylapore, Chennai', nameTa: 'மயிலாப்பூர்', district: 'Chennai', lat: 13.0339, lng: 80.2678, postal: '600004', aliases: ['mylapore', 'chennai'] },
  { id: 'omr', name: 'OMR / Sholinganallur, Chennai', nameTa: 'ஓஎம்ஆர்', district: 'Chennai', lat: 12.9010, lng: 80.2279, postal: '600119', aliases: ['omr', 'sholinganallur', 'thoraipakkam'] },
  { id: 'tambaram', name: 'Tambaram', nameTa: 'தாம்பரம்', district: 'Chengalpattu', lat: 12.9249, lng: 80.1472, postal: '600045', aliases: ['tambaram', 'chennai', 'chengalpattu'] },
  { id: 'porur', name: 'Porur', nameTa: 'போரூர்', district: 'Chennai', lat: 13.0382, lng: 80.1565, postal: '600116', aliases: ['porur', 'chennai'] },
  { id: 'ambattur', name: 'Ambattur', nameTa: 'அம்பத்தூர்', district: 'Tiruvallur', lat: 13.1143, lng: 80.1548, postal: '600053', aliases: ['ambattur', 'chennai'] },
  { id: 'guindy', name: 'Guindy', nameTa: 'கிண்டி', district: 'Chennai', lat: 13.0067, lng: 80.2025, postal: '600032', aliases: ['guindy', 'chennai'] },

  // Coimbatore & Kongu Region
  { id: 'coimbatore', name: 'Coimbatore', nameTa: 'கோயம்புத்தூர்', district: 'Coimbatore', lat: 11.0168, lng: 76.9558, postal: '641001', aliases: ['coimbatore', 'cbe', 'kovai', 'கோயம்புத்தூர்', 'கோவை'] },
  { id: 'rs-puram', name: 'RS Puram, Coimbatore', nameTa: 'ஆர்.எஸ். புரம்', district: 'Coimbatore', lat: 11.0085, lng: 76.9515, postal: '641002', aliases: ['rs puram', 'r.s. puram', 'coimbatore', 'cbe'] },
  { id: 'gandhipuram', name: 'Gandhipuram, Coimbatore', nameTa: 'காந்திபுரம்', district: 'Coimbatore', lat: 11.0180, lng: 76.9680, postal: '641012', aliases: ['gandhipuram', 'coimbatore', 'cbe'] },
  { id: 'peelamedu', name: 'Peelamedu, Coimbatore', nameTa: 'பீளமேடு', district: 'Coimbatore', lat: 11.0310, lng: 77.0180, postal: '641004', aliases: ['peelamedu', 'coimbatore', 'cbe'] },
  { id: 'saravanampatti', name: 'Saravanampatti, Coimbatore', nameTa: 'சரவணம்பட்டி', district: 'Coimbatore', lat: 11.0820, lng: 76.9980, postal: '641035', aliases: ['saravanampatti', 'coimbatore', 'cbe'] },
  { id: 'pollachi', name: 'Pollachi', nameTa: 'பொள்ளாச்சி', district: 'Coimbatore', lat: 10.6609, lng: 77.0048, postal: '642001', aliases: ['pollachi', 'coimbatore', 'cbe'] },
  { id: 'mettur-coimbatore', name: 'Mettupalayam', nameTa: 'மேட்டுப்பாளையம்', district: 'Coimbatore', lat: 11.3000, lng: 76.9500, postal: '641301', aliases: ['mettupalayam', 'coimbatore', 'cbe'] },

  // Madurai Region
  { id: 'madurai', name: 'Madurai', nameTa: 'மதுரை', district: 'Madurai', lat: 9.9252, lng: 78.1198, postal: '625001', aliases: ['madurai', 'mdu', 'madura', 'மதுரை'] },
  { id: 'tallakulam', name: 'Tallakulam, Madurai', nameTa: 'தல்லாகுளம்', district: 'Madurai', lat: 9.9360, lng: 78.1320, postal: '625002', aliases: ['tallakulam', 'madurai', 'mdu'] },
  { id: 'anna-nagar-madurai', name: 'Anna Nagar, Madurai', nameTa: 'அண்ணா நகர், மதுரை', district: 'Madurai', lat: 9.9175, lng: 78.1465, postal: '625020', aliases: ['anna nagar madurai', 'madurai', 'mdu'] },
  { id: 'kk-nagar-madurai', name: 'KK Nagar, Madurai', nameTa: 'கே.கே. நகர், மதுரை', district: 'Madurai', lat: 9.9320, lng: 78.1478, postal: '625020', aliases: ['kk nagar madurai', 'madurai', 'mdu'] },
  { id: 'mattuthavani', name: 'Mattuthavani, Madurai', nameTa: 'மாட்டுத்தாவணி', district: 'Madurai', lat: 9.9470, lng: 78.1580, postal: '625007', aliases: ['mattuthavani', 'madurai', 'mdu'] },
  { id: 'tirumangalam', name: 'Tirumangalam', nameTa: 'திருமங்கலம்', district: 'Madurai', lat: 9.8236, lng: 77.9860, postal: '625706', aliases: ['tirumangalam', 'madurai', 'mdu'] },
  { id: 'melur', name: 'Melur', nameTa: 'மேலூர்', district: 'Madurai', lat: 10.0500, lng: 78.3300, postal: '625106', aliases: ['melur', 'madurai', 'mdu'] },

  // Tiruchirappalli (Trichy)
  { id: 'tiruchirappalli', name: 'Tiruchirappalli (Trichy)', nameTa: 'திருச்சிராப்பள்ளி', district: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047, postal: '620001', aliases: ['trichy', 'tpj', 'tiruchirappalli', 'tiruchi', 'திருச்சி', 'திருச்சிராப்பள்ளி'] },
  { id: 'srirangam', name: 'Srirangam', nameTa: 'ஸ்ரீரங்கம்', district: 'Tiruchirappalli', lat: 10.8622, lng: 78.6946, postal: '620006', aliases: ['srirangam', 'trichy', 'tpj'] },

  // Salem
  { id: 'salem', name: 'Salem', nameTa: 'சேலம்', district: 'Salem', lat: 11.6643, lng: 78.1460, postal: '636001', aliases: ['salem', 'சேலம்', 'slm'] },
  { id: 'attur', name: 'Attur', nameTa: 'ஆத்தூர்', district: 'Salem', lat: 11.5977, lng: 78.6015, postal: '636102', aliases: ['attur', 'salem'] },

  // Tiruppur & Erode
  { id: 'tiruppur', name: 'Tiruppur', nameTa: 'திருப்பூர்', district: 'Tiruppur', lat: 11.1085, lng: 77.3411, postal: '641601', aliases: ['tiruppur', 'tirupur', 'tpr', 'திருப்பூர்'] },
  { id: 'udumalaipettai', name: 'Udumalaipettai', nameTa: 'உடுமலைப்பேட்டை', district: 'Tiruppur', lat: 10.5855, lng: 77.2492, postal: '642126', aliases: ['udumalaipettai', 'tiruppur'] },
  { id: 'erode', name: 'Erode', nameTa: 'ஈரோடு', district: 'Erode', lat: 11.3410, lng: 77.7172, postal: '638001', aliases: ['erode', 'ed', 'ஈரோடு'] },
  { id: 'gobichettipalayam', name: 'Gobichettipalayam', nameTa: 'கோபிசெட்டிபாளையம்', district: 'Erode', lat: 11.4552, lng: 77.4373, postal: '638452', aliases: ['gobi', 'gobichettipalayam', 'erode'] },

  // Tirunelveli, Tenkasi & Thoothukudi
  { id: 'tirunelveli', name: 'Tirunelveli', nameTa: 'திருநெல்வேலி', district: 'Tirunelveli', lat: 8.7139, lng: 77.7567, postal: '627001', aliases: ['tirunelveli', 'nellai', 'tny', 'திருநெல்வேலி', 'நெல்லை'] },
  { id: 'tenkasi', name: 'Tenkasi', nameTa: 'தென்காசி', district: 'Tenkasi', lat: 8.9594, lng: 77.3150, postal: '627811', aliases: ['tenkasi', 'தென்காசி', 'courtallam'] },
  { id: 'thoothukudi', name: 'Thoothukudi (Tuticorin)', nameTa: 'தூத்துக்குடி', district: 'Thoothukudi', lat: 8.7642, lng: 78.1348, postal: '628001', aliases: ['thoothukudi', 'tuticorin', 'tcn', 'தூத்துக்குடி'] },
  { id: 'kovilpatti', name: 'Kovilpatti', nameTa: 'கோவில்பட்டி', district: 'Thoothukudi', lat: 9.1728, lng: 77.8687, postal: '628501', aliases: ['kovilpatti', 'thoothukudi'] },

  // Kanyakumari
  { id: 'kanyakumari', name: 'Kanyakumari (Nagercoil)', nameTa: 'கன்னியாகுமரி', district: 'Kanyakumari', lat: 8.1833, lng: 77.4119, postal: '629001', aliases: ['kanyakumari', 'nagercoil', 'ngl', 'கன்னியாகுமரி', 'நாகர்கோவில்'] },

  // Thanjavur & Delta Region
  { id: 'thanjavur', name: 'Thanjavur', nameTa: 'தஞ்சாவூர்', district: 'Thanjavur', lat: 10.7870, lng: 79.1378, postal: '613001', aliases: ['thanjavur', 'tanjore', 'tnj', 'தஞ்சாவூர்'] },
  { id: 'kumbakonam', name: 'Kumbakonam', nameTa: 'கும்பகோணம்', district: 'Thanjavur', lat: 10.9602, lng: 79.3845, postal: '612001', aliases: ['kumbakonam', 'thanjavur'] },
  { id: 'mayiladuthurai', name: 'Mayiladuthurai', nameTa: 'மயிலாடுதுறை', district: 'Mayiladuthurai', lat: 11.1075, lng: 79.6522, postal: '609001', aliases: ['mayiladuthurai', 'mayavaram', 'மயிலாடுதுறை'] },
  { id: 'nagapattinam', name: 'Nagapattinam', nameTa: 'நாகப்பட்டினம்', district: 'Nagapattinam', lat: 10.7656, lng: 79.8424, postal: '611001', aliases: ['nagapattinam', 'நாகப்பட்டினம்'] },
  { id: 'tiruvarur', name: 'Tiruvarur', nameTa: 'திருவாரூர்', district: 'Tiruvarur', lat: 10.7725, lng: 79.6365, postal: '610001', aliases: ['tiruvarur', 'thiruvarur', 'திருவாரூர்'] },
  { id: 'pudukkottai', name: 'Pudukkottai', nameTa: 'புதுக்கோட்டை', district: 'Pudukkottai', lat: 10.3797, lng: 78.8208, postal: '622001', aliases: ['pudukkottai', 'pkk', 'புதுக்கோட்டை'] },

  // Dindigul & Theni
  { id: 'dindigul', name: 'Dindigul', nameTa: 'திண்டுக்கல்', district: 'Dindigul', lat: 10.3673, lng: 77.9803, postal: '624001', aliases: ['dindigul', 'dgl', 'திண்டுக்கல்'] },
  { id: 'palani', name: 'Palani', nameTa: 'பழனி', district: 'Dindigul', lat: 10.4500, lng: 77.5167, postal: '624601', aliases: ['palani', 'dindigul'] },
  { id: 'theni', name: 'Theni', nameTa: 'தேனி', district: 'Theni', lat: 10.0104, lng: 77.4768, postal: '625531', aliases: ['theni', 'தேனி', 'bodinayakanur'] },

  // Virudhunagar & Ramanathapuram
  { id: 'virudhunagar', name: 'Virudhunagar', nameTa: 'விருதுநகர்', district: 'Virudhunagar', lat: 9.5680, lng: 77.9624, postal: '626001', aliases: ['virudhunagar', 'vnr', 'விருதுநகர்'] },
  { id: 'sivakasi', name: 'Sivakasi', nameTa: 'சிவகாசி', district: 'Virudhunagar', lat: 9.4533, lng: 77.7972, postal: '626123', aliases: ['sivakasi', 'virudhunagar'] },
  { id: 'rajapalayam', name: 'Rajapalayam', nameTa: 'ராஜபாளையம்', district: 'Virudhunagar', lat: 9.4532, lng: 77.5545, postal: '626117', aliases: ['rajapalayam', 'virudhunagar'] },
  { id: 'ramanathapuram', name: 'Ramanathapuram', nameTa: 'இராமநாதபுரம்', district: 'Ramanathapuram', lat: 9.3639, lng: 78.8395, postal: '623501', aliases: ['ramanathapuram', 'ramnad', 'rmd', 'இராமநாதபுரம்'] },
  { id: 'rameswaram', name: 'Rameswaram', nameTa: 'இராமேஸ்வரம்', district: 'Ramanathapuram', lat: 9.2876, lng: 79.3129, postal: '623526', aliases: ['rameswaram', 'ramanathapuram'] },

  // Vellore, Tirupathur, Ranipet
  { id: 'vellore', name: 'Vellore', nameTa: 'வேலூர்', district: 'Vellore', lat: 12.9165, lng: 79.1325, postal: '632001', aliases: ['vellore', 'வேலூர்'] },
  { id: 'katpadi', name: 'Katpadi', nameTa: 'காட்பாடி', district: 'Vellore', lat: 12.9698, lng: 79.1390, postal: '632014', aliases: ['katpadi', 'vellore'] },
  { id: 'tirupathur', name: 'Tirupathur', nameTa: 'திருப்பத்தூர்', district: 'Tirupathur', lat: 12.4947, lng: 78.5668, postal: '635601', aliases: ['tirupathur', 'திருப்பத்தூர்'] },
  { id: 'ambur', name: 'Ambur', nameTa: 'ஆம்பூர்', district: 'Tirupathur', lat: 12.7904, lng: 78.7166, postal: '635802', aliases: ['ambur', 'tirupathur'] },
  { id: 'vaniyambadi', name: 'Vaniyambadi', nameTa: 'வாணியம்பாடி', district: 'Tirupathur', lat: 12.6825, lng: 78.6186, postal: '635751', aliases: ['vaniyambadi', 'tirupathur'] },
  { id: 'ranipet', name: 'Ranipet', nameTa: 'இராணிப்பேட்டை', district: 'Ranipet', lat: 12.9272, lng: 79.3330, postal: '632401', aliases: ['ranipet', 'இராணிப்பேட்டை'] },

  // Krishnagiri, Dharmapuri, Nilgiris
  { id: 'krishnagiri', name: 'Krishnagiri', nameTa: 'கிருஷ்ணகிரி', district: 'Krishnagiri', lat: 12.5266, lng: 78.2144, postal: '635001', aliases: ['krishnagiri', 'கிருஷ்ணகிரி'] },
  { id: 'hosur', name: 'Hosur', nameTa: 'ஓசூர்', district: 'Krishnagiri', lat: 12.7409, lng: 77.8253, postal: '635109', aliases: ['hosur', 'krishnagiri', 'ஓசூர்'] },
  { id: 'dharmapuri', name: 'Dharmapuri', nameTa: 'தருமபுரி', district: 'Dharmapuri', lat: 12.1277, lng: 78.1579, postal: '636701', aliases: ['dharmapuri', 'தருமபுரி'] },
  { id: 'nilgiris', name: 'Nilgiris (Ooty)', nameTa: 'நீலகிரி (ஊட்டி)', district: 'Nilgiris', lat: 11.4102, lng: 76.6950, postal: '643001', aliases: ['ooty', 'nilgiris', 'udhagamandalam', 'ஊட்டி', 'நீலகிரி'] },

  // Kanchipuram, Chengalpattu, Tiruvallur
  { id: 'kanchipuram', name: 'Kanchipuram', nameTa: 'காஞ்சிபுரம்', district: 'Kanchipuram', lat: 12.8342, lng: 79.7036, postal: '631501', aliases: ['kanchipuram', 'kanchi', 'காஞ்சிபுரம்'] },
  { id: 'chengalpattu', name: 'Chengalpattu', nameTa: 'செங்கல்பட்டு', district: 'Chengalpattu', lat: 12.6922, lng: 79.9774, postal: '603001', aliases: ['chengalpattu', 'chengalpet', 'செங்கல்பட்டு'] },
  { id: 'tiruvallur', name: 'Tiruvallur', nameTa: 'திருவள்ளூர்', district: 'Tiruvallur', lat: 13.1432, lng: 79.9074, postal: '602001', aliases: ['tiruvallur', 'திருவள்ளூர்'] },

  // Cuddalore, Villupuram, Kallakurichi, Tiruvannamalai
  { id: 'cuddalore', name: 'Cuddalore', nameTa: 'கடலூர்', district: 'Cuddalore', lat: 11.7480, lng: 79.7714, postal: '607001', aliases: ['cuddalore', 'கடலூர்'] },
  { id: 'chidambaram', name: 'Chidambaram', nameTa: 'சிதம்பரம்', district: 'Cuddalore', lat: 11.3992, lng: 79.6934, postal: '608001', aliases: ['chidambaram', 'cuddalore'] },
  { id: 'neyveli', name: 'Neyveli', nameTa: 'நெய்வேலி', district: 'Cuddalore', lat: 11.6022, lng: 79.4862, postal: '607801', aliases: ['neyveli', 'cuddalore'] },
  { id: 'villupuram', name: 'Villupuram', nameTa: 'விழுப்புரம்', district: 'Villupuram', lat: 11.9401, lng: 79.4861, postal: '605602', aliases: ['villupuram', 'விழுப்புரம்'] },
  { id: 'tindivanam', name: 'Tindivanam', nameTa: 'திண்டிவனம்', district: 'Villupuram', lat: 12.2285, lng: 79.6508, postal: '604001', aliases: ['tindivanam', 'villupuram'] },
  { id: 'kallakurichi', name: 'Kallakurichi', nameTa: 'கள்ளக்குறிச்சி', district: 'Kallakurichi', lat: 11.7383, lng: 78.9639, postal: '606202', aliases: ['kallakurichi', 'கள்ளக்குறிச்சி'] },
  { id: 'tiruvannamalai', name: 'Tiruvannamalai', nameTa: 'திருவண்ணாமலை', district: 'Tiruvannamalai', lat: 12.2253, lng: 79.0747, postal: '606601', aliases: ['tiruvannamalai', 'திருவண்ணாமலை'] },

  // Ariyalur, Perambalur, Karur, Namakkal
  { id: 'ariyalur', name: 'Ariyalur', nameTa: 'அரியலூர்', district: 'Ariyalur', lat: 11.1397, lng: 79.0760, postal: '621704', aliases: ['ariyalur', 'அரியலூர்'] },
  { id: 'perambalur', name: 'Perambalur', nameTa: 'பெரம்பலூர்', district: 'Perambalur', lat: 11.2342, lng: 78.8817, postal: '621212', aliases: ['perambalur', 'பெரம்பலூர்'] },
  { id: 'karur', name: 'Karur', nameTa: 'கரூர்', district: 'Karur', lat: 10.9601, lng: 78.0766, postal: '639001', aliases: ['karur', 'கரூர்'] },
  { id: 'namakkal', name: 'Namakkal', nameTa: 'நாமக்கல்', district: 'Namakkal', lat: 11.2189, lng: 78.1674, postal: '637001', aliases: ['namakkal', 'நாமக்கல்'] },
  { id: 'tiruchengode', name: 'Tiruchengode', nameTa: 'திருச்செங்கோடு', district: 'Namakkal', lat: 11.3789, lng: 77.8943, postal: '637211', aliases: ['tiruchengode', 'namakkal'] },
];

export const TAMIL_NADU_DISTRICTS = TAMIL_NADU_LOCATIONS;

/**
 * Normalizes query string for location matching
 */
function clean(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[,\-_.]/g, ' ')
    .replace(/\s+/g, ' ')
}

/**
 * Strips Tamil locative suffixes like -இல், -த்தில், -ல், -க்கு
 */
function normalizeTamilWord(word) {
  if (!word) return ''
  return word
    .replace(/(?:த்தில்|த்தில|க்கு|ற்கு|இல்|வில்|யில்|ல்|உள்ள|அருகில்)$/u, '')
    .trim()
}

/**
 * Check if a word or stem matches a location in Tamil
 */
function matchTamilLocation(stem, loc) {
  if (!stem || stem.length < 2) return false
  const nameTa = clean(loc.nameTa)
  if (nameTa === stem) return true
  if (nameTa.startsWith(stem) && stem.length >= 3) return true
  if (stem.startsWith(nameTa) && nameTa.length >= 3) return true
  return loc.aliases?.some(a => {
    const ca = clean(a)
    return ca === stem || (ca.startsWith(stem) && stem.length >= 3) || (stem.startsWith(ca) && ca.length >= 3)
  })
}

/**
 * Resolve location query with alias mapping, district matching, token parsing and fuzzy search
 */
export function resolveLocation(query) {
  if (!query) return null
  const q = clean(query)
  if (!q) return null

  // 1. Direct ID, Name, or NameTa exact match
  const exact = TAMIL_NADU_LOCATIONS.find(l => 
    l.id === q || 
    clean(l.name) === q || 
    clean(l.nameTa) === q
  )
  if (exact) return exact

  // 2. Direct exact alias match (e.g. q === 'kkdi' or q === 'cbe' or q === 'sivagangai')
  const directAlias = TAMIL_NADU_LOCATIONS.find(l => 
    l.aliases?.some(a => clean(a) === q)
  )
  if (directAlias) return directAlias

  // 3. Direct district exact match
  const districtExact = TAMIL_NADU_LOCATIONS.find(l => clean(l.district) === q)
  if (districtExact) return districtExact

  // 4. Word token check: extract tokens from natural language sentences
  // e.g. "show all services in kkdi" -> tokens: ["show", "all", "services", "in", "kkdi"]
  const words = q.split(' ').filter(w => w.length >= 2)
  const skipWords = new Set([
    'all', 'in', 'at', 'near', 'show', 'the', 'and', 'for', 'best', 'top', 
    'any', 'service', 'services', 'find', 'me', 'to', 'of', 'place', 'places',
    'area', 'city', 'town', 'district', 'need', 'want', 'around', 'doorstep'
  ])

  // Pass 4A: Check single words for Town/City/Alias exact matches (town priority over district)
  for (const word of words) {
    if (skipWords.has(word)) continue
    const stem = normalizeTamilWord(word)

    const tokenMatch = TAMIL_NADU_LOCATIONS.find(l =>
      l.id === word ||
      clean(l.name) === word ||
      clean(l.nameTa) === word ||
      matchTamilLocation(stem, l) ||
      l.aliases?.some(a => clean(a) === word || clean(a) === stem)
    )
    if (tokenMatch) return tokenMatch
  }

  // Pass 4B: Check if single word matches a District name (e.g. "sivaganga district" or "madurai district")
  for (const word of words) {
    if (skipWords.has(word)) continue
    const stem = normalizeTamilWord(word)

    // Prioritize district headquarters first if exists
    const hqMatch = TAMIL_NADU_LOCATIONS.find(l =>
      (l.id === word || clean(l.name) === word) && clean(l.district) === word
    )
    if (hqMatch) return hqMatch

    const districtMatch = TAMIL_NADU_LOCATIONS.find(l =>
      clean(l.district) === word || clean(l.district) === stem
    )
    if (districtMatch) return districtMatch
  }

  // 5. Two-word phrase check (e.g. "anna nagar", "rs puram", "mattuthavani")
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i+1]}`
    const phraseMatch = TAMIL_NADU_LOCATIONS.find(l =>
      clean(l.name) === phrase ||
      clean(l.nameTa) === phrase ||
      l.aliases?.some(a => clean(a) === phrase)
    )
    if (phraseMatch) return phraseMatch
  }

  // 6. Substring / phrase match (e.g., sentence contains "karaikudi" or "sivaganga")
  for (const l of TAMIL_NADU_LOCATIONS) {
    const locName = clean(l.name)
    if (locName && locName.length >= 3 && q.includes(locName)) return l
    
    if (l.aliases?.some(a => {
      const ca = clean(a)
      return ca.length >= 3 && (new RegExp(`\\b${ca}\\b`, 'i').test(q) || q.includes(ca))
    })) {
      return l
    }
  }

  // 7. Substring on district name
  for (const l of TAMIL_NADU_LOCATIONS) {
    const locDistrict = clean(l.district)
    if (locDistrict && locDistrict.length >= 3 && q.includes(locDistrict)) {
      return l
    }
  }

  return null
}

/**
 * Autocomplete search for places across Tamil Nadu (as the user types)
 */
export function searchLocations(queryText, limit = 8) {
  if (!queryText || !queryText.trim()) {
    return TAMIL_NADU_LOCATIONS.slice(0, limit)
  }

  const q = clean(queryText)

  const matches = TAMIL_NADU_LOCATIONS.filter(l => {
    const nameMatch = clean(l.name).includes(q)
    const taMatch = clean(l.nameTa).includes(q)
    const distMatch = clean(l.district).includes(q)
    const aliasMatch = l.aliases?.some(a => a.includes(q) || q.includes(a))
    return nameMatch || taMatch || distMatch || aliasMatch
  })

  return matches.slice(0, limit)
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 9999
  }
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(1))
}

/**
 * Filters providers within a specific radius (e.g. 30 km) and attaches distance
 */
export function filterProvidersWithinRadius(providers, centerLat, centerLng, radiusKm = 30) {
  if (!centerLat || !centerLng) return providers

  return providers
    .map(p => {
      const distance = calculateDistanceKm(centerLat, centerLng, p.latitude, p.longitude)
      return {
        ...p,
        distanceKm: distance
      }
    })
    .filter(p => p.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

/**
 * Finds the nearest Tamil Nadu town or district from any lat/lng coordinate
 */
export function findNearestLocation(lat, lng) {
  if (!lat || !lng) return { location: TAMIL_NADU_LOCATIONS[0], distanceKm: 0 }
  let closest = TAMIL_NADU_LOCATIONS[0]
  let minDistance = 99999

  for (const loc of TAMIL_NADU_LOCATIONS) {
    const d = calculateDistanceKm(lat, lng, loc.lat, loc.lng)
    if (d < minDistance) {
      minDistance = d
      closest = loc
    }
  }

  return { location: closest, distanceKm: minDistance }
}
