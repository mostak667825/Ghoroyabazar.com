// Bangladesh 64 Districts and Upazilas (Thanas) Database
// Designed to offer 100% coverage with automatic "other" custom option support.

export interface Area {
  id: string;
  name: string;
  nameBn: string;
}

export const AVAILABLE_DISTRICTS: Area[] = [
  { id: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'chittagong', name: 'Chittagong', nameBn: 'চট্টগ্রাম' },
  { id: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'khulna', name: 'Khulna', nameBn: 'খুলনা' },
  { id: 'barisal', name: 'Barisal', nameBn: 'বরিশাল' },
  { id: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
  { id: 'comilla', name: 'Cumilla', nameBn: 'কুমিল্লা' },
  { id: 'gazipur', name: 'Gazipur', nameBn: 'গাজীপুর' },
  { id: 'narayanganj', name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
  { id: 'bagerhat', name: 'Bagerhat', nameBn: 'বাগেরহাট' },
  { id: 'bandarban', name: 'Bandarban', nameBn: 'বান্দরবান' },
  { id: 'barguna', name: 'Barguna', nameBn: 'বরগুনা' },
  { id: 'bhola', name: 'Bhola', nameBn: 'ভোলা' },
  { id: 'bogura', name: 'Bogura', nameBn: 'বগুড়া' },
  { id: 'brahmanbaria', name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া' },
  { id: 'chandpur', name: 'Chandpur', nameBn: 'চাঁদপুর' },
  { id: 'chapainawabganj', name: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ' },
  { id: 'chuadanga', name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা' },
  { id: 'coxsbazar', name: 'Cox\'s Bazar', nameBn: 'কক্সবাজার' },
  { id: 'dinajpur', name: 'Dinajpur', nameBn: 'দিনাজপুর' },
  { id: 'faridpur', name: 'Faridpur', nameBn: 'ফরিদপুর' },
  { id: 'feni', name: 'Feni', nameBn: 'ফেনী' },
  { id: 'gaibandha', name: 'Gaibandha', nameBn: 'গাইবান্ধা' },
  { id: 'gopalganj', name: 'Gopalganj', nameBn: 'গোপালগঞ্জ' },
  { id: 'habiganj', name: 'Habiganj', nameBn: 'হবিগঞ্জ' },
  { id: 'jamalpur', name: 'Jamalpur', nameBn: 'জামালপুর' },
  { id: 'jashore', name: 'Jashore', nameBn: 'যশোর' },
  { id: 'jhalokati', name: 'Jhalokati', nameBn: 'ঝালকাঠি' },
  { id: 'jhenaidah', name: 'Jhenaidah', nameBn: 'ঝিনাইদহ' },
  { id: 'joypurhat', name: 'Joypurhat', nameBn: 'জয়পুরহাট' },
  { id: 'khagrachhari', name: 'Khagrachhari', nameBn: 'খাগড়াছড়ি' },
  { id: 'kishoreganj', name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ' },
  { id: 'kurigram', name: 'Kurigram', nameBn: 'কুড়িগ্রাম' },
  { id: 'kushtia', name: 'Kushtia', nameBn: 'কুষ্টিয়া' },
  { id: 'lakshmipur', name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর' },
  { id: 'lalmonirhat', name: 'Lalmonirhat', nameBn: 'লালমনিরহাট' },
  { id: 'madaripur', name: 'Madaripur', nameBn: 'মাদারীপুর' },
  { id: 'magura', name: 'Magura', nameBn: 'মাগুরা' },
  { id: 'manikganj', name: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
  { id: 'meherpur', name: 'Meherpur', nameBn: 'মেহেরপুর' },
  { id: 'moulvibazar', name: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
  { id: 'munshiganj', name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ' },
  { id: 'naogaon', name: 'Naogaon', nameBn: 'নওগাঁ' },
  { id: 'narail', name: 'Narail', nameBn: 'নড়াইল' },
  { id: 'narsingdi', name: 'Narsingdi', nameBn: 'নরসিংদী' },
  { id: 'natore', name: 'Natore', nameBn: 'নাটোর' },
  { id: 'netrokona', name: 'Netrokona', nameBn: 'নেত্রকোণা' },
  { id: 'nilphamari', name: 'Nilphamari', nameBn: 'নীলফামারী' },
  { id: 'noakhali', name: 'Noakhali', nameBn: 'নোয়াখালী' },
  { id: 'pabna', name: 'Pabna', nameBn: 'পাবনা' },
  { id: 'panchagarh', name: 'Panchagarh', nameBn: 'পঞ্চগড়' },
  { id: 'patuakhali', name: 'Patuakhali', nameBn: 'পটুয়াখালী' },
  { id: 'pirojpur', name: 'Pirojpur', nameBn: 'পিরোজপুর' },
  { id: 'rajbari', name: 'Rajbari', nameBn: 'রাজবাড়ী' },
  { id: 'rangamati', name: 'Rangamati', nameBn: 'রাঙ্গামাটি' },
  { id: 'satkhira', name: 'Satkhira', nameBn: 'সাতক্ষীরা' },
  { id: 'shariatpur', name: 'Shariatpur', nameBn: 'শরীয়তপুর' },
  { id: 'sherpur', name: 'Sherpur', nameBn: 'শেরপুর' },
  { id: 'sirajganj', name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ' },
  { id: 'sunamganj', name: 'Sunamganj', nameBn: 'সুনামগঞ্জ' },
  { id: 'tangail', name: 'Tangail', nameBn: 'টাঙ্গাইল' },
  { id: 'thakurgaon', name: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও' }
];

export const AVAILABLE_UPAZILAS: Record<string, Area[]> = {
  dhaka: [
    { id: 'mirpur', name: 'Mirpur', nameBn: 'মিরপুর' },
    { id: 'dhanmondi', name: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
    { id: 'gulshan', name: 'Gulshan', nameBn: 'গুলশান' },
    { id: 'uttara', name: 'Uttara', nameBn: 'উত্তরা' },
    { id: 'mohammadpur', name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
    { id: 'badda', name: 'Badda', nameBn: 'বাড্ডা' },
    { id: 'motijheel', name: 'Motijheel', nameBn: 'মতিঝিল' },
    { id: 'khilgaon', name: 'Khilgaon', nameBn: 'খিলগাঁও' },
    { id: 'banani', name: 'Banani', nameBn: 'বনানী' },
    { id: 'tejgaon', name: 'Tejgaon', nameBn: 'তেজগাঁও' },
    { id: 'savar', name: 'Savar', nameBn: 'সাভার' },
    { id: 'dhamrai', name: 'Dhamrai', nameBn: 'ধামরাই' },
    { id: 'keraniganj', name: 'Keraniganj', nameBn: 'কেরানীগঞ্জ' },
    { id: 'dohar', name: 'Dohar', nameBn: 'দোহার' },
    { id: 'nawabganj', name: 'Nawabganj', nameBn: 'নবাবগঞ্জ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  chittagong: [
    { id: 'kotwali_ctg', name: 'Kotwali', nameBn: 'কোতোয়ালী' },
    { id: 'double_mooring', name: 'Double Mooring', nameBn: 'ডবলমুরিং' },
    { id: 'halishahar', name: 'Halishahar', nameBn: 'হালিশহর' },
    { id: 'panchlaish', name: 'Panchlaish', nameBn: 'পাঁচলাইশ' },
    { id: 'bakalia', name: 'Bakalia', nameBn: 'বাকলিয়া' },
    { id: 'bayezid', name: 'Bayezid', nameBn: 'বায়েজিদ' },
    { id: 'patenga', name: 'Patenga', nameBn: 'পতেঙ্গা' },
    { id: 'hathazari', name: 'Hathazari', nameBn: 'হাটহাজারী' },
    { id: 'sitakunda', name: 'Sitakunda', nameBn: 'সীতাকুণ্ড' },
    { id: 'mirsharai', name: 'Mirsharai', nameBn: 'মীরসরাই' },
    { id: 'patia', name: 'Patiya', nameBn: 'পটিয়া' },
    { id: 'raozan', name: 'Raozan', nameBn: 'রাউজান' },
    { id: 'sandwip', name: 'Sandwip', nameBn: 'সন্দ্বীপ' },
    { id: 'boalkhali', name: 'Boalkhali', nameBn: 'বোয়ালখালী' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  sylhet: [
    { id: 'kotwali_syl', name: 'Kotwali', nameBn: 'কোতোয়ালী' },
    { id: 'shahporan', name: 'Shahporan', nameBn: 'শাহপরান' },
    { id: 'beanibazar', name: 'Beanibazar', nameBn: 'বিয়ানীবাজার' },
    { id: 'golapganj', name: 'Golapganj', nameBn: 'গোলাপগঞ্জ' },
    { id: 'osmani_nagar', name: 'Osmani Nagar', nameBn: 'ওসমানী নগর' },
    { id: 'balaganj', name: 'Balaganj', nameBn: 'বালাগঞ্জ' },
    { id: 'fenchuganj', name: 'Fenchuganj', nameBn: 'ফেঞ্চুগঞ্জ' },
    { id: 'jaintiapur', name: 'Jaintiapur', nameBn: 'জৈন্তাপুর' },
    { id: 'gowainghat', name: 'Gowainghat', nameBn: 'গোয়াইনঘাট' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  rajshahi: [
    { id: 'boalia', name: 'Boalia', nameBn: 'বোয়ালিয়া' },
    { id: 'motihar', name: 'Motihar', nameBn: 'মতিহার' },
    { id: 'shah_makhdum', name: 'Shah Makdum', nameBn: 'শাহ মখদুম' },
    { id: 'rajpara', name: 'Rajpara', nameBn: 'রাজপাড়া' },
    { id: 'paba', name: 'Paba', nameBn: 'পবা' },
    { id: 'godagari', name: 'Godagari', nameBn: 'গোদাগাড়ী' },
    { id: 'tanore', name: 'Tanore', nameBn: 'তানোর' },
    { id: 'bagmara', name: 'Bagmara', nameBn: 'বাগমারা' },
    { id: 'mohanpur', name: 'Mohanpur', nameBn: 'মোহনপুর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  khulna: [
    { id: 'khalishpur', name: 'Khalishpur', nameBn: 'খালিশপুর' },
    { id: 'daulatpur', name: 'Daulatpur', nameBn: 'দৌলতপুর' },
    { id: 'sonadanga', name: 'Sonadanga', nameBn: 'সোনাডাঙ্গা' },
    { id: 'khan_jahan_ali', name: 'Khan Jahan Ali', nameBn: 'খান জাহান আলী' },
    { id: 'botiaghata', name: 'Botiaghata', nameBn: 'বটিয়াঘাটা' },
    { id: 'dumuria', name: 'Dumuria', nameBn: 'ডুমুরিয়া' },
    { id: 'koyra', name: 'Koyra', nameBn: 'কয়রা' },
    { id: 'paikgacha', name: 'Paikgacha', nameBn: 'পাইকগাছা' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  barisal: [
    { id: 'kotwali_bar', name: 'Kotwali', nameBn: 'কোতোয়ালী' },
    { id: 'airport_bar', name: 'Airport', nameBn: 'এয়ারপোর্ট' },
    { id: 'bandar_bar', name: 'Bandar', nameBn: 'বন্দর' },
    { id: 'bakerganj', name: 'Bakerganj', nameBn: 'বাকেরগঞ্জ' },
    { id: 'babuganj', name: 'Babuganj', nameBn: 'বাবুগঞ্জ' },
    { id: 'wazirpur', name: 'Wazirpur', nameBn: 'উজিরপুর' },
    { id: 'banaripara', name: 'Banaripara', nameBn: 'বানারীপাড়া' },
    { id: 'gaurnadi', name: 'Gaurnadi', nameBn: 'গৌরনদী' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  rangpur: [
    { id: 'kotwali_ran', name: 'Kotwali', nameBn: 'কোতোয়ালী' },
    { id: 'tajhat', name: 'Tajhat', nameBn: 'তাজহাট' },
    { id: 'mahiganj', name: 'Mahiganj', nameBn: 'মহিগঞ্জ' },
    { id: 'mithapukur', name: 'Mithapukur', nameBn: 'মিঠাপুকুর' },
    { id: 'pirganj', name: 'Pirganj', nameBn: 'পীরগঞ্জ' },
    { id: 'badarganj', name: 'Badarganj', nameBn: 'বদরগঞ্জ' },
    { id: 'gangachara', name: 'Gangachara', nameBn: 'গঙ্গাচড়া' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  mymensingh: [
    { id: 'kotwali_mym', name: 'Kotwali', nameBn: 'কোতোয়ালী' },
    { id: 'trishal', name: 'Trishal', nameBn: 'ত্রিশাল' },
    { id: 'muktagacha', name: 'Muktagacha', nameBn: 'মুক্তাগাছা' },
    { id: 'bhaluka', name: 'Bhaluka', nameBn: 'ভালুকা' },
    { id: 'gauripur', name: 'Gauripur', nameBn: 'গৌরীপুর' },
    { id: 'phulpur', name: 'Phulpur', nameBn: 'ফুলপুর' },
    { id: 'iswarganj', name: 'Iswarganj', nameBn: 'ঈশ্বরগঞ্জ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  comilla: [
    { id: 'sadar_com', name: 'Sadar', nameBn: 'সদর' },
    { id: 'sadar_south_com', name: 'Sadar South', nameBn: 'সদর দক্ষিণ' },
    { id: 'laksam', name: 'Laksam', nameBn: 'লাকসাম' },
    { id: 'daudkandi', name: 'Daudkandi', nameBn: 'দাউদকান্দি' },
    { id: 'chauddagram', name: 'Chauddagram', nameBn: 'চৌদ্দগ্রাম' },
    { id: 'barura', name: 'Barura', nameBn: 'বরুড়া' },
    { id: 'burichang', name: 'Burichang', nameBn: 'বুড়িচং' },
    { id: 'debidwar', name: 'Debidwar', nameBn: 'দেবিদ্বার' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  gazipur: [
    { id: 'sadar_gaz', name: 'Sadar', nameBn: 'সদর' },
    { id: 'tongi', name: 'Tongi', nameBn: 'টঙ্গী' },
    { id: 'joydebpur', name: 'Joydebpur', nameBn: 'জয়দেবপুর' },
    { id: 'kaliakair', name: 'Kaliakair', nameBn: 'কালিয়াকৈর' },
    { id: 'kaliganj', name: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
    { id: 'kapasia', name: 'Kapasia', nameBn: 'কাপাসিয়া' },
    { id: 'sreepur', name: 'Sreepur', nameBn: 'শ্রীপুর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  narayanganj: [
    { id: 'sadar_nar', name: 'Sadar', nameBn: 'সদর' },
    { id: 'fatullah', name: 'Fatullah', nameBn: 'ফতুল্লা' },
    { id: 'siddhirganj', name: 'Siddhirganj', nameBn: 'সিদ্ধিরগঞ্জ' },
    { id: 'araihazar', name: 'Araihazar', nameBn: 'আড়াইহাজার' },
    { id: 'sonargaon', name: 'Sonargaon', nameBn: 'সোনারগাঁও' },
    { id: 'rupganj', name: 'Rupganj', nameBn: 'রূপগঞ্জ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  bagerhat: [
    { id: 'sadar_bag', name: 'Bagerhat Sadar', nameBn: 'বাগেরহাট সদর' },
    { id: 'mongla', name: 'Mongla', nameBn: 'মোংলা' },
    { id: 'morrelganj', name: 'Morrelganj', nameBn: 'মোড়েলগঞ্জ' },
    { id: 'sarankhola', name: 'Sarankhola', nameBn: 'শরণখোলা' },
    { id: 'rampal', name: 'Rampal', nameBn: 'রামপাল' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  bandarban: [
    { id: 'sadar_ban', name: 'Bandarban Sadar', nameBn: 'বান্দরবান সদর' },
    { id: 'alikadam', name: 'Alikadam', nameBn: 'আলীকদম' },
    { id: 'lama', name: 'Lama', nameBn: 'লামা' },
    { id: 'naikhongchhari', name: 'Naikhongchhari', nameBn: 'নাইক্ষ্যংছড়ি' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  barguna: [
    { id: 'sadar_bar', name: 'Barguna Sadar', nameBn: 'বরগুনা সদর' },
    { id: 'amtali', name: 'Amtali', nameBn: 'আমতলী' },
    { id: 'patharghata', name: 'Patharghata', nameBn: 'পাথরঘাটা' },
    { id: 'betagi', name: 'Betagi', nameBn: 'বেতাগী' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  bhola: [
    { id: 'sadar_bho', name: 'Bhola Sadar', nameBn: 'ভোলা সদর' },
    { id: 'char_fasson', name: 'Char Fasson', nameBn: 'চরফ্যাশন' },
    { id: 'lalmohan', name: 'Lalmohan', nameBn: 'লালমোহন' },
    { id: 'borhanuddin', name: 'Borhanuddin', nameBn: 'বোরহানউদ্দিন' },
    { id: 'daulatkhan', name: 'Daulatkhan', nameBn: 'দৌলতখান' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  bogura: [
    { id: 'sadar_bog', name: 'Bogura Sadar', nameBn: 'বগুড়া সদর' },
    { id: 'sherpur_bog', name: 'Sherpur', nameBn: 'শেরপুর' },
    { id: 'shajahanpur', name: 'Shajahanpur', nameBn: 'শাহজাহানপুর' },
    { id: 'kahaloo', name: 'Kahaloo', nameBn: 'কাহালু' },
    { id: 'gabonth', name: 'Gabtali', nameBn: 'গাবতলী' },
    { id: 'dupcanchia', name: 'Dupchanchia', nameBn: 'দুপচাঁচিয়া' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  brahmanbaria: [
    { id: 'sadar_bra', name: 'Brahmanbaria Sadar', nameBn: 'ব্রাহ্মণবাড়িয়া সদর' },
    { id: 'ashuganj', name: 'Ashuganj', nameBn: 'আশুগঞ্জ' },
    { id: 'sarail', name: 'Sarail', nameBn: 'সরাইল' },
    { id: 'kasba', name: 'Kasba', nameBn: 'কসবা' },
    { id: 'nabinagar', name: 'Nabinagar', nameBn: 'নবীনগর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  chandpur: [
    { id: 'sadar_cha', name: 'Chandpur Sadar', nameBn: 'চাঁদপুর সদর' },
    { id: 'hajiganj', name: 'Hajiganj', nameBn: 'হাজীগঞ্জ' },
    { id: 'faridganj', name: 'Faridganj', nameBn: 'ফরিদগঞ্জ' },
    { id: 'shahrasti', name: 'Shahrasti', nameBn: 'শাহরাস্তি' },
    { id: 'matlab_south', name: 'Matlab South', nameBn: 'মতলব দক্ষিণ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  chapainawabganj: [
    { id: 'sadar_cha_naw', name: 'Nawabganj Sadar', nameBn: 'নবাবগঞ্জ সদর' },
    { id: 'shibganj_cha', name: 'Shibganj', nameBn: 'শিবগঞ্জ' },
    { id: 'gomastapur', name: 'Gomastapur', nameBn: 'গোমস্তাপুর' },
    { id: 'nachole', name: 'Nachole', nameBn: 'নাচোল' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  chuadanga: [
    { id: 'sadar_chu', name: 'Chuadanga Sadar', nameBn: 'চুয়াডাঙ্গা সদর' },
    { id: 'alamdanga', name: 'Alamdanga', nameBn: 'আলমডাঙ্গা' },
    { id: 'damurhuda', name: 'Damurhuda', nameBn: 'দামুড়হুদা' },
    { id: 'jibannagar', name: 'Jibannagar', nameBn: 'জীবননগর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  coxsbazar: [
    { id: 'sadar_cox', name: 'Cox\'s Bazar Sadar', nameBn: 'কক্সবাজার সদর' },
    { id: 'ukhiya', name: 'Ukhiya', nameBn: 'উখিয়া' },
    { id: 'teknaf', name: 'Teknaf', nameBn: 'টেকনাফ' },
    { id: 'ramu', name: 'Ramu', nameBn: 'রামু' },
    { id: 'chakaria', name: 'Chakaria', nameBn: 'চকোরিয়া' },
    { id: 'maheshkhali', name: 'Maheshkhali', nameBn: 'মহেশখালী' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  dinajpur: [
    { id: 'sadar_din', name: 'Dinajpur Sadar', nameBn: 'দিনাজপুর সদর' },
    { id: 'phulbari_din', name: 'Phulbari', nameBn: 'ফুলবাড়ী' },
    { id: 'birganj', name: 'Birganj', nameBn: 'বীরগঞ্জ' },
    { id: 'kaharole', name: 'Kaharole', nameBn: 'কাহারোল' },
    { id: 'parbatipur', name: 'Parbatipur', nameBn: 'পার্বতীপুর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  faridpur: [
    { id: 'sadar_far', name: 'Faridpur Sadar', nameBn: 'ফরিদপুর সদর' },
    { id: 'madhukhali', name: 'Madhukhali', nameBn: 'মধুখালী' },
    { id: 'bhanga', name: 'Bhanga', nameBn: 'ভাঙ্গা' },
    { id: 'sadarpur', name: 'Sadarpur', nameBn: 'সদরপুর' },
    { id: 'alfadanga', name: 'Alfadanga', nameBn: 'আলফাডাঙ্গা' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  feni: [
    { id: 'sadar_fen', name: 'Feni Sadar', nameBn: 'ফেনী সদর' },
    { id: 'sonagazi', name: 'Sonagazi', nameBn: 'সোনাগাজী' },
    { id: 'chagalnaiya', name: 'Chhagalnaiya', nameBn: 'ছাগলনাইয়্যা' },
    { id: 'daganbhuiyan', name: 'Daganbhuiyan', nameBn: 'দাগনভূঞা' },
    { id: 'parshuram', name: 'Parshuram', nameBn: 'পরশুরাম' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  gaibandha: [
    { id: 'sadar_gai', name: 'Gaibandha Sadar', nameBn: 'গাইবান্ধা সদর' },
    { id: 'gobindaganj', name: 'Gobindaganj', nameBn: 'গোবিন্দগঞ্জ' },
    { id: 'palashbari', name: 'Palashbari', nameBn: 'পলাশবাড়ী' },
    { id: 'sundarganj', name: 'Sundarganj', nameBn: 'সুন্দরগঞ্জ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  gopalganj: [
    { id: 'sadar_gop', name: 'Gopalganj Sadar', nameBn: 'গোপালগঞ্জ সদর' },
    { id: 'tungipara', name: 'Tungipara', nameBn: 'টুঙ্গিপাড়া' },
    { id: 'kotalipara', name: 'Kotalipara', nameBn: 'কোটালীপাড়া' },
    { id: 'kasiani', name: 'Kashiani', nameBn: 'কাশিয়ানী' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  habiganj: [
    { id: 'sadar_hab', name: 'Habiganj Sadar', nameBn: 'হবিগঞ্জ সদর' },
    { id: 'madhabpur', name: 'Madhabpur', nameBn: 'মাধবপুর' },
    { id: 'nabiganj', name: 'Nabiganj', nameBn: 'নবীগঞ্জ' },
    { id: 'chunarughat', name: 'Chunarughat', nameBn: 'চুনারুঘাট' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  jamalpur: [
    { id: 'sadar_jam', name: 'Jamalpur Sadar', nameBn: 'জামালপুর সদর' },
    { id: 'sarishabari', name: 'Sarishabari', nameBn: 'সরিষাবাড়ী' },
    { id: 'dewanganj', name: 'Dewanganj', nameBn: 'দেওয়ানগঞ্জ' },
    { id: 'bakshiganj', name: 'Bakshiganj', nameBn: 'বকশীগঞ্জ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  jashore: [
    { id: 'sadar_jas', name: 'Jashore Sadar', nameBn: 'যশোর সদর' },
    { id: 'keshabpur', name: 'Keshabpur', nameBn: 'কেশবপুর' },
    { id: 'manirampur', name: 'Manirampur', nameBn: 'মণিরামপুর' },
    { id: 'sarsha', name: 'Sarsha', nameBn: 'শার্শা' },
    { id: 'bagherpara', name: 'Bagherpara', nameBn: 'বাঘারপাড়া' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  jhalokati: [
    { id: 'sadar_jha', name: 'Jhalokati Sadar', nameBn: 'ঝালকাঠি সদর' },
    { id: 'nalchity', name: 'Nalchity', nameBn: 'নলছিটি' },
    { id: 'rajapur', name: 'Rajapur', nameBn: 'রাজাপুর' },
    { id: 'kathalia', name: 'Kathalia', nameBn: 'কাঠালিয়া' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  jhenaidah: [
    { id: 'sadar_jhe', name: 'Jhenaidah Sadar', nameBn: 'ঝিনাইদহ সদর' },
    { id: 'kaliganj_jhe', name: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
    { id: 'kotchandpur', name: 'Kotchandpur', nameBn: 'কোটচাঁদপুর' },
    { id: 'shailkupa', name: 'Shailkupa', nameBn: 'শৈলকুপা' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  joypurhat: [
    { id: 'sadar_joy', name: 'Joypurhat Sadar', nameBn: 'জয়পুরহাট সদর' },
    { id: 'panchbibi', name: 'Panchbibi', nameBn: 'পাঁচবিবি' },
    { id: 'kalai', name: 'Kalai', nameBn: 'কালাই' },
    { id: 'khetlal', name: 'Khetlal', nameBn: 'ক্ষেতলাল' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  khagrachhari: [
    { id: 'sadar_kha', name: 'Khagrachhari Sadar', nameBn: 'খাগড়াছড়ি সদর' },
    { id: 'dighinala', name: 'Dighinala', nameBn: 'দীঘিনালা' },
    { id: 'panchhari', name: 'Panchhari', nameBn: 'পানছড়ি' },
    { id: 'manikchhari', name: 'Manikchhari', nameBn: 'মানিকছড়ি' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  kishoreganj: [
    { id: 'sadar_kis', name: 'Kishoreganj Sadar', nameBn: 'কিশোরগঞ্জ সদর' },
    { id: 'bhairab', name: 'Bhairab', nameBn: 'ভৈরব' },
    { id: 'bajitpur', name: 'Bajitpur', nameBn: 'বাজিতপুর' },
    { id: 'karimgonj', name: 'Karimganj', nameBn: 'করিমগঞ্জ' },
    { id: 'katiadi', name: 'Katiadi', nameBn: 'কটিয়াদী' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  kurigram: [
    { id: 'sadar_kur', name: 'Kurigram Sadar', nameBn: 'কুড়িগ্রাম সদর' },
    { id: 'ulipur', name: 'Ulipur', nameBn: 'উলিপুর' },
    { id: 'nageshwari', name: 'Nageshwari', nameBn: 'নাগেশ্বরী' },
    { id: 'phulbari_kur', name: 'Phulbari', nameBn: 'ফুলবাড়ী' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  kushtia: [
    { id: 'sadar_kus', name: 'Kushtia Sadar', nameBn: 'কুষ্টিয়া সদর' },
    { id: 'kumarkhali', name: 'Kumarkhali', nameBn: 'কুমারখালী' },
    { id: 'bheramara', name: 'Bheramara', nameBn: 'ভেড়ামারা' },
    { id: 'mirpur_kus', name: 'Mirpur', nameBn: 'মিরপুর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  lakshmipur: [
    { id: 'sadar_lak', name: 'Lakshmipur Sadar', nameBn: 'লক্ষ্মীপুর সদর' },
    { id: 'raipur', name: 'Raipur', nameBn: 'রায়পুর' },
    { id: 'ramganj', name: 'Ramganj', nameBn: 'রামগঞ্জ' },
    { id: 'ramgati', name: 'Ramgati', nameBn: 'রামগতি' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  lalmonirhat: [
    { id: 'sadar_lal', name: 'Lalmonirhat Sadar', nameBn: 'লালমনিরহাট সদর' },
    { id: 'patgram', name: 'Patgram', nameBn: 'পাটগ্রাম' },
    { id: 'hatibandha', name: 'Hatibandha', nameBn: 'হাতীবান্ধা' },
    { id: 'kaliganj_lal', name: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  madaripur: [
    { id: 'sadar_mad', name: 'Madaripur Sadar', nameBn: 'মাদারীপুর সদর' },
    { id: 'shibchar', name: 'Shibchar', nameBn: 'শিবচর' },
    { id: 'kalkini', name: 'Kalkini', nameBn: 'কালকিনি' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  magura: [
    { id: 'sadar_mag', name: 'Magura Sadar', nameBn: 'মাগুরা সদর' },
    { id: 'sreepur_mag', name: 'Sreepur', nameBn: 'শ্রীপুর' },
    { id: 'shalikha', name: 'Shalikha', nameBn: 'শালিখা' },
    { id: 'mohammadpur_mag', name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  manikganj: [
    { id: 'sadar_man', name: 'Manikganj Sadar', nameBn: 'মানিকগঞ্জ সদর' },
    { id: 'singair', name: 'Singair', nameBn: 'সিংগাইর' },
    { id: 'shibalaya', name: 'Shibalaya', nameBn: 'শিবালয়' },
    { id: 'saturia', name: 'Saturia', nameBn: 'সাটুরিয়া' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  meherpur: [
    { id: 'sadar_meh', name: 'Meherpur Sadar', nameBn: 'মেহেরপুর সদর' },
    { id: 'gangni', name: 'Gangni', nameBn: 'গাংনী' },
    { id: 'mujibnagar', name: 'Mujibnagar', nameBn: 'মুজিবনগর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  moulvibazar: [
    { id: 'sadar_mou', name: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
    { id: 'sreemangal', name: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
    { id: 'kulaura', name: 'Kulaura', nameBn: 'কুলাউড়া' },
    { id: 'kamalganj', name: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
    { id: 'barlekha', name: 'Barlekha', nameBn: 'বড়লেখা' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  munshiganj: [
    { id: 'sadar_mun', name: 'Munshiganj Sadar', nameBn: 'মুন্সীগঞ্জ সদর' },
    { id: 'sirajdikhan', name: 'Sirajdikhan', nameBn: 'সিরাজদিখান' },
    { id: 'tongibari', name: 'Tongibari', nameBn: 'টংগিবাড়ী' },
    { id: 'louhajang', name: 'Louhajang', nameBn: 'লৌহজং' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  naogaon: [
    { id: 'sadar_nao', name: 'Naogaon Sadar', nameBn: 'নওগাঁ সদর' },
    { id: 'patnitala', name: 'Patnitala', nameBn: 'পত্নীতলা' },
    { id: 'mohandpur_nao', name: 'Manda', nameBn: 'মান্দা' },
    { id: 'niamatpur', name: 'Niamatpur', nameBn: 'নিয়ামতপুর' },
    { id: 'dhamoirhat', name: 'Dhamoirhat', nameBn: 'ধামইরহাট' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  narail: [
    { id: 'sadar_nar_dist', name: 'Narail Sadar', nameBn: 'নড়াইল সদর' },
    { id: 'lohagara', name: 'Lohagara', nameBn: 'লোহাগড়া' },
    { id: 'kalia', name: 'Kalia', nameBn: 'কালিয়া' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  narsingdi: [
    { id: 'sadar_nar_sing', name: 'Narsingdi Sadar', nameBn: 'নরসিংদী সদর' },
    { id: 'madhabdi', name: 'Madhabdi', nameBn: 'মাধবদী' },
    { id: 'shibpur', name: 'Shibpur', nameBn: 'শিবপুর' },
    { id: 'raipura', name: 'Raipura', nameBn: 'রায়পুরা' },
    { id: 'belabo', name: 'Belabo', nameBn: 'বেলাবো' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  natore: [
    { id: 'sadar_nat', name: 'Natore Sadar', nameBn: 'নাটোর সদর' },
    { id: 'singra', name: 'Singra', nameBn: 'সিংড়া' },
    { id: 'baraigram', name: 'Baraigram', nameBn: 'বড়াইগ্রাম' },
    { id: 'lalpur', name: 'Lalpur', nameBn: 'লালপুর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  netrokona: [
    { id: 'sadar_net', name: 'Netrokona Sadar', nameBn: 'নেত্রকোণা সদর' },
    { id: 'mohanganj', name: 'Mohanganj', nameBn: 'মোহনগঞ্জ' },
    { id: 'durgapur', name: 'Durgapur', nameBn: 'দুর্গাপুর' },
    { id: 'kalmakanda', name: 'Kalmakanda', nameBn: 'কলমাকান্দা' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  nilphamari: [
    { id: 'sadar_nil', name: 'Nilphamari Sadar', nameBn: 'নীলফামারী সদর' },
    { id: 'saidpur', name: 'Saidpur', nameBn: 'সৈয়দপুর' },
    { id: 'domar', name: 'Domar', nameBn: 'ডোমার' },
    { id: 'dimla', name: 'Dimla', nameBn: 'ডিমলা' },
    { id: 'jaldhaka', name: 'Jaldhaka', nameBn: 'জলঢাকা' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  noakhali: [
    { id: 'sadar_noa', name: 'Noakhali Sadar', nameBn: 'নোয়াখালী সদর' },
    { id: 'begumganj', name: 'Begumganj', nameBn: 'বেগমগঞ্জ' },
    { id: 'senbagh', name: 'Senbagh', nameBn: 'সেনবাগ' },
    { id: 'companiganj', name: 'Companiganj', nameBn: 'কোম্পানীগঞ্জ' },
    { id: 'chatkhil', name: 'Chatkhil', nameBn: 'চাটখিল' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  pabna: [
    { id: 'sadar_pab', name: 'Pabna Sadar', nameBn: 'পাবনা সদর' },
    { id: 'ishwardi', name: 'Ishwardi', nameBn: 'ঈশ্বরদী' },
    { id: 'sujanagar', name: 'Sujanagar', nameBn: 'সুজানগর' },
    { id: 'chatmohar', name: 'Chatmohar', nameBn: 'চাটমোহর' },
    { id: 'bera', name: 'Bera', nameBn: 'বেড়া' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  panchagarh: [
    { id: 'sadar_pan', name: 'Panchagarh Sadar', nameBn: 'পঞ্চগড় সদর' },
    { id: 'tetulia', name: 'Tetulia', nameBn: 'তেঁতুলিয়া' },
    { id: 'boda', name: 'Boda', nameBn: 'বোদা' },
    { id: 'debi_ganj', name: 'Debiganj', nameBn: 'দেবীগঞ্জ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  patuakhali: [
    { id: 'sadar_pat', name: 'Patuakhali Sadar', nameBn: 'পটুয়াখালী সদর' },
    { id: 'kuakata', name: 'Kuakata', nameBn: 'কুয়াকাটা' },
    { id: 'galachipa', name: 'Galachipa', nameBn: 'গলাচিপা' },
    { id: 'bauphal', name: 'Bauphal', nameBn: 'বাউফল' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  pirojpur: [
    { id: 'sadar_pir', name: 'Pirojpur Sadar', nameBn: 'পিরোজপুর সদর' },
    { id: 'bhandaria', name: 'Bhandaria', nameBn: 'ভাণ্ডারিয়া' },
    { id: 'mathbaria', name: 'Mathbaria', nameBn: 'মঠবাড়িয়া' },
    { id: 'nesarabad', name: 'Nesarabad', nameBn: 'নেছারাবাদ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  rajbari: [
    { id: 'sadar_rajb', name: 'Rajbari Sadar', nameBn: 'রাজবাড়ী সদর' },
    { id: 'goalandapost', name: 'Goalanda', nameBn: 'গোয়ালন্দ' },
    { id: 'pangsha', name: 'Pangsha', nameBn: 'পাংশা' },
    { id: 'baliakandi', name: 'Baliakandi', nameBn: 'বালিয়াকান্দি' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  rangamati: [
    { id: 'sadar_rang', name: 'Rangamati Sadar', nameBn: 'রাঙ্গামাটি সদর' },
    { id: 'kaptai', name: 'Kaptai', nameBn: 'কাপ্তাই' },
    { id: 'baghaichhari', name: 'Baghaichhari', nameBn: 'বাঘাইছড়ি' },
    { id: 'langadu', name: 'Langadu', nameBn: 'ল্যাঙ্গাদু' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  satkhira: [
    { id: 'sadar_sat', name: 'Satkhira Sadar', nameBn: 'সাতক্ষীরা সদর' },
    { id: 'shyamnagar', name: 'Shyamnagar', nameBn: 'শ্যামনগর' },
    { id: 'kalaroa', name: 'Kalaroa', nameBn: 'কলারোয়া' },
    { id: 'kaliganj_sat', name: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  shariatpur: [
    { id: 'sadar_sha', name: 'Shariatpur Sadar', nameBn: 'শরীয়তপুর সদর' },
    { id: 'naria', name: 'Naria', nameBn: 'নড়িয়া' },
    { id: 'zanjira', name: 'Zanjira', nameBn: 'জাজিরা' },
    { id: 'damudya', name: 'Damudya', nameBn: 'ডামুড্যা' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  sherpur: [
    { id: 'sadar_she', name: 'Sherpur Sadar', nameBn: 'শেরপুর সদর' },
    { id: 'nakla', name: 'Nakla', nameBn: 'নকলা' },
    { id: 'nalitabari', name: 'Nalitabari', nameBn: 'নালিতাবাড়ী' },
    { id: 'jhenaigati', name: 'Jhenaigati', nameBn: 'ঝিনাইগাতী' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  sirajganj: [
    { id: 'sadar_sir', name: 'Sirajganj Sadar', nameBn: 'সিরাজগঞ্জ সদর' },
    { id: 'belkuchi', name: 'Belkuchi', nameBn: 'বেলকুচি' },
    { id: 'shahjadpur', name: 'Shahjadpur', nameBn: 'শাহজাদপুর' },
    { id: 'ullapara', name: 'Ullapara', nameBn: 'উল্লাপাড়া' },
    { id: 'kamarkhanda', name: 'Kamarkhanda', nameBn: 'কামারখন্দ' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  sunamganj: [
    { id: 'sadar_sun', name: 'Sunamganj Sadar', nameBn: 'সুনামগঞ্জ সদর' },
    { id: 'chhatak', name: 'Chhatak', nameBn: 'ছাতক' },
    { id: 'jagannathpur', name: 'Jagannathpur', nameBn: 'জগন্নাথপুর' },
    { id: 'derai', name: 'Derai', nameBn: 'দিরাই' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  tangail: [
    { id: 'sadar_tan', name: 'Tangail Sadar', nameBn: 'টাঙ্গাইল সদর' },
    { id: 'kalihati', name: 'Kalihati', nameBn: 'কালিহাতী' },
    { id: 'madhupur', name: 'Madhupur', nameBn: 'মধুপুর' },
    { id: 'mirzapur', name: 'Mirzapur', nameBn: 'মির্জাপুর' },
    { id: 'ghatail', name: 'Ghatail', nameBn: 'ঘাটাইল' },
    { id: 'gopalpur', name: 'Gopalpur', nameBn: 'গোপালপুর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ],
  thakurgaon: [
    { id: 'sadar_tha', name: 'Thakurgaon Sadar', nameBn: 'ঠাকুরগাঁও সদর' },
    { id: 'pirganj_tha', name: 'Pirganj', nameBn: 'পীরগঞ্জ' },
    { id: 'ranisankail', name: 'Ranisankail', nameBn: 'রাণীশংকৈল' },
    { id: 'haripur', name: 'Haripur', nameBn: 'হরিপুর' },
    { id: 'other', name: 'Other / Custom Location', nameBn: 'অন্যান্য / নির্দিষ্ট এলাকা' }
  ]
};
