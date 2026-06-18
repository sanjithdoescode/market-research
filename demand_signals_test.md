# MarketSite Analyst API — Demand Signals Test Results Log

## 📋 Run Metadata
- **Port:** `5001`
- **Initial Event:** AudienceProfile cache miss — calling Mistral.
  - **Business Type:** `restaurant`
  - **Niche:** `""`

---

## 📊 Summary of Demand Signals
| Category | Raw Count | Valid Places | Tier | Weight | Closest Distance | Avg Distance |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Movie Theater** (`movie_theater`) | 17 | 10 | `MEDIUM` | 4 | 1,749m | 3,373m |
| **Shopping Mall** (`shopping_mall`) | 40 | 6 | `MEDIUM` | 6 | 1,830m | 3,223m |
| **Hotel** (`hotel`) | 40 | 15 | `LOW` | 2 | 1,087m | 2,911m |
| **Tourist Attraction** (`tourist_attraction`) | 30 | 15 | `LOW` | 2 | 230m | 3,179m |
| **University** (`university`) | 40 | 12 | `HIGH` | 10 | 1,949m | 3,633m |
| **Transit Station** (`transit_station`) | 40 | 20 | `MEDIUM` | 5 | 10m | 2,184m |
| **Office** (`office`) | 40 | 15 | `LOW` | 3 | 1,452m | 2,991m |
| **Park** (`park`) | 40 | 12 | `LOW` | 2 | 490m | 2,350m |

### Pipeline Final Statistics
- **Total Raw Count:** 287
- **Total Valid Institutions:** 105
- **Categories Searched / With Results:** 8 / 8

---

## 🔍 Detailed Category Logs

### 🎬 Movie Theater (`movie_theater`)
- **Tier:** `MEDIUM` | **Weight:** 4 | **After Filter:** 13
- **Closest Distance:** 1749m | **Average Distance:** 3373m
- **Valid Places:**
  - Midlaand Cinemas (1749m)
  - Guru Theatre (2018m)
  - Mathi Theatre (2497m)
  - SOLAMALAI CINEMAS (2785m)
  - Kasi Theatre (3447m)
  - RADIANCE CINEMA (3554m)
  - Thanga Regal (4343m)
  - Sakthi Cinemas A/C (4387m)
  - Home Cinemas (4410m)
  - Gopuram Cinemas (4542m)

### 🛍️ Shopping Mall (`shopping_mall`)
- **Tier:** `MEDIUM` | **Weight:** 6 | **After Filter:** 6
- **Closest Distance:** 1830m | **Average Distance:** 3223m
- **Valid Places:**
  - HOME BASE (Kalavasal)- Home decor, Imported toys, fancy items & Gifts shop Madurai (1830m)
  - Westside - Lakshmi Sundaram, Madurai (2036m)
  - Max (3052m)
  - VASANTH & CO (3162m)
  - Amizhthini Family Shopping (4400m)
  - POTHYS - Madurai (4859m)

### 🏨 Hotel (`hotel`)
- **Tier:** `LOW` | **Weight:** 2 | **After Filter:** 38
- **Closest Distance:** 1087m | **Average Distance:** 2911m
- **Valid Places:**
  - Heritage Madurai (1087m)
  - Nest Serviced Apartments (1905m)
  - Hotel Heritage Residency (1965m)
  - Hotel Germanus (2167m)
  - HOTEL ARCHANA (2219m)
  - Jene's Ladies Hostel (2582m)
  - Veera Amohaa Service Apartments (2707m)
  - Aakash Family Club (3009m)
  - Thiru K. Kamaraja Holiday Home (3135m)
  - The Alp Hotel, Bypass Rd (3249m)
  - Hotel The Nook (3589m)
  - OYO 5044 The Nook (3664m)
  - Astoria Hotels (3993m)
  - Hotel Royal Court (4194m)
  - Madurai Multi Functional Complex P Ltd. (4200m)

### 🗺️ Tourist Attraction (`tourist_attraction`)
- **Tier:** `LOW` | **Weight:** 2 | **After Filter:** 29
- **Closest Distance:** 230m | **Average Distance:** 3179m
- **Valid Places:**
  - கோச்சடை கண்மாய் (230m)
  - Pleasant Tours & Travels - Madurai Tour Operator | Tempo Traveller (675m)
  - KLB Madurai Kutralam (1263m)
  - Stars tours and travel (2325m)
  - THENI MAIN ROAD SECTION NH - 85 (2614m)
  - Madurai Royal Tourism (2977m)
  - Nagamalai river area (3194m)
  - Chella Vinayagar (3483m)
  - மதுரை இரயில்வே சந்திப்பு (4092m)
  - Madurai Kuttralam (4373m)
  - Make My Tour Trip (4410m)
  - Hornbill Holidays (4419m)
  - Periyar busstand (4432m)
  - Shri Navaneetha Krishnasamy Temple (4585m)
  - Guide Muthu (4614m)

### 🎓 University (`university`)
- **Tier:** `HIGH` | **Weight:** 10 | **After Filter:** 13
- **Closest Distance:** 1949m | **Average Distance:** 3633m
- **Valid Places:**
  - Fatima college For Women (1949m)
  - Assemblies Of God Tamilnadu Bible College (2184m)
  - VK College (2496m)
  - IPL TECHNOLOGIES Tally Training Institute Koodalnagar Madurai Tamilnadu (2512m)
  - Tamilnadu Theological Seminary (3110m)
  - Indira Gandhi National Open University (3387m)
  - TVS Community College (4198m)
  - Blue Pearl – AI, Data Science, Python, Java, PHP & Full Stack Courses Madurai (4499m)
  - The Madura College (4724m)
  - KING CATERING COLLEGE MADURAI (4752m)
  - ACE SOFTWARE TRAINING (4816m)
  - Sourashtra College (4974m)

### 🚉 Transit Station (`transit_station`)
- **Tier:** `MEDIUM` | **Weight:** 5 | **After Filter:** 40
- **Closest Distance:** 10m | **Average Distance:** 2184m
- **Valid Places:**
  - Kochadai (10m)
  - Kochadai Bus Stop (491m)
  - Madurai - Virattipathi (W) (917m)
  - Madurai - Vilangudi (N) (1468m)
  - Fathima College (1901m)
  - Madurai - Fathima College (S) (1906m)
  - Kalavasal Bypass (1936m)
  - Fatima College (1941m)
  - Arappalayam Bus Stand (1971m)
  - Arappalayam (2012m)
  - Madurai - Kalavasal (S) (2159m)
  - Madurai - Achampathu (W) (2271m)
  - Madurai - Arasaradi (N) (2375m)
  - Kudal Nagar (2646m)
  - Ponmeni (2749m)
  - Madurai - Nagamalai (E) (3249m)
  - S S Colony (3280m)
  - Madurai - Puttuthoppu (N) (3319m)
  - Ettaiyapuram Bypass (3363m)
  - Nagamalai Pudukkottai (3716m)

### 🏢 Office (`office`)
- **Tier:** `LOW` | **Weight:** 3 | **After Filter:** 19
- **Closest Distance:** 1452m | **Average Distance:** 2991m
- **Valid Places:**
  - Ezhil Murugan Towers (1452m)
  - Solamalai Corporate (1810m)
  - Smart groups private limited (1911m)
  - ASMI ASSOCIATES (2079m)
  - Ivlr Company Office (2318m)
  - BMG JEWELLERS - Corporate Office (2455m)
  - A. G. Head Quarters (2481m)
  - Ramson credit bureau (2593m)
  - Haier Appliances India Pvt Ltd - Branch (2780m)
  - Shivam golbal force (2946m)
  - Maruti Suzuki India Limited - Area Office (3256m)
  - Jcb Regional Office (3987m)
  - Selvi Transports Branch Office (4735m)
  - RA Groups (4967m)
  - Corporation Office Birth And Death Certification (5094m)

### 🌳 Park (`park`)
- **Tier:** `LOW` | **Weight:** 2 | **After Filter:** 17
- **Closest Distance:** 490m | **Average Distance:** 2350m
- **Valid Places:**
  - Sm garden (490m)
  - Sembaruthi Nagar Park (874m)
  - HMS Colony Park (1603m)
  - karisalkulam railway gate (1888m)
  - Tiltz Park (2173m)
  - Corporation Park, Jayanagar (2307m)
  - Sathya Park (2772m)
  - sangam dog kennal(breeders) (2935m)
  - Children's Park (3003m)
  - Eagle park (3010m)
  - Anaiyur park (3518m)
  - Vadivelkarai Railway Bridge (3625m)

---

## 🌐 HTTP API Endpoints & Request Traces
| Request ID | Method | Path | Status Code | Duration (ms) |
| :--- | :---: | :--- | :---: | :---: |
| `7b9e5976-bca6-447a-ac94-da20967e844a` | `POST` | `/api/analysis` | `201` | 40,721 |
| `ef058de0-2e8f-454a-9c3a-e79f66ea6c24` | `GET` | `/api/history?limit=25` | `200` | 76 |
| `c816c7f7-b041-42b7-bc00-5e33b7b6d39f` | `GET` | `/api/history?limit=25` | `304` | 51 |

- **Shutdown Event:** `^CSIGINT received. Closing HTTP server. HTTP server closed.`

---

## 📄 Raw Log Output
<details>
<summary>Click to view exact raw console logs</summary>

```
MarketSite Analyst API listening on port 5001
{"message":"AudienceProfile cache miss — calling Mistral.","businessType":"restaurant","niche":""}
{"message":"Demand signal search result (quality-filtered)","category":"movie_theater","tier":"MEDIUM","weight":4,"rawCount":17,"afterFilter":13,"validInstitutions":10,"closestDistanceMeters":1749,"averageDistanceMeters":3373,"places":["Midlaand Cinemas","Guru Theatre","Mathi Theatre","SOLAMALAI CINEMAS","Kasi Theatre","RADIANCE CINEMA","Thanga Regal","Sakthi Cinemas A/C","Home Cinemas","Gopuram Cinemas"]}

[Audience Data] Category: movie_theater | Valid Places Collected: 10
  - Midlaand Cinemas (1749m)
  - Guru Theatre (2018m)
  - Mathi Theatre (2497m)
  - SOLAMALAI CINEMAS (2785m)
  - Kasi Theatre (3447m)
  - RADIANCE CINEMA (3554m)
  - Thanga Regal (4343m)
  - Sakthi Cinemas A/C (4387m)
  - Home Cinemas (4410m)
  - Gopuram Cinemas (4542m)
----------------------------------------------------
{"message":"Demand signal search result (quality-filtered)","category":"shopping_mall","tier":"MEDIUM","weight":6,"rawCount":40,"afterFilter":6,"validInstitutions":6,"closestDistanceMeters":1830,"averageDistanceMeters":3223,"places":["HOME BASE (Kalavasal)- Home decor, Imported toys, fancy items & Gifts shop Madurai","Westside - Lakshmi Sundaram, Madurai","Max","VASANTH & CO","Amizhthini Family Shopping","POTHYS - Madurai"]}

[Audience Data] Category: shopping_mall | Valid Places Collected: 6
  - HOME BASE (Kalavasal)- Home decor, Imported toys, fancy items & Gifts shop Madurai (1830m)
  - Westside - Lakshmi Sundaram, Madurai (2036m)
  - Max (3052m)
  - VASANTH & CO (3162m)
  - Amizhthini Family Shopping (4400m)
  - POTHYS - Madurai (4859m)
----------------------------------------------------
{"message":"Demand signal search result (quality-filtered)","category":"hotel","tier":"LOW","weight":2,"rawCount":40,"afterFilter":38,"validInstitutions":15,"closestDistanceMeters":1087,"averageDistanceMeters":2911,"places":["Heritage Madurai","Nest Serviced Apartments","Hotel Heritage Residency","Hotel Germanus","HOTEL ARCHANA","Jene's Ladies Hostel","Veera Amohaa Service Apartments","Aakash Family Club","Thiru K. Kamaraja Holiday Home","The Alp Hotel, Bypass Rd","Hotel The Nook","OYO 5044 The Nook","Astoria Hotels","Hotel Royal Court","Madurai Multi Functional Complex P Ltd."]}

[Audience Data] Category: hotel | Valid Places Collected: 15
  - Heritage Madurai (1087m)
  - Nest Serviced Apartments (1905m)
  - Hotel Heritage Residency (1965m)
  - Hotel Germanus (2167m)
  - HOTEL ARCHANA (2219m)
  - Jene's Ladies Hostel (2582m)
  - Veera Amohaa Service Apartments (2707m)
  - Aakash Family Club (3009m)
  - Thiru K. Kamaraja Holiday Home (3135m)
  - The Alp Hotel, Bypass Rd (3249m)
  - Hotel The Nook (3589m)
  - OYO 5044 The Nook (3664m)
  - Astoria Hotels (3993m)
  - Hotel Royal Court (4194m)
  - Madurai Multi Functional Complex P Ltd. (4200m)
----------------------------------------------------
{"message":"Demand signal search result (quality-filtered)","category":"tourist_attraction","tier":"LOW","weight":2,"rawCount":30,"afterFilter":29,"validInstitutions":15,"closestDistanceMeters":230,"averageDistanceMeters":3179,"places":["கோச்சடை கண்மாய்","Pleasant Tours & Travels - Madurai Tour Operator | Tempo Traveller","KLB Madurai Kutralam","Stars tours and travel","THENI MAIN ROAD SECTION NH - 85","Madurai Royal Tourism","Nagamalai river area","Chella Vinayagar","மதுரை இரயில்வே சந்திப்பு","Madurai Kuttralam","Make My Tour Trip","Hornbill Holidays","Periyar busstand","Shri Navaneetha Krishnasamy Temple","Guide Muthu"]}

[Audience Data] Category: tourist_attraction | Valid Places Collected: 15
  - கோச்சடை கண்மாய் (230m)
  - Pleasant Tours & Travels - Madurai Tour Operator | Tempo Traveller (675m)
  - KLB Madurai Kutralam (1263m)
  - Stars tours and travel (2325m)
  - THENI MAIN ROAD SECTION NH - 85 (2614m)
  - Madurai Royal Tourism (2977m)
  - Nagamalai river area (3194m)
  - Chella Vinayagar (3483m)
  - மதுரை இரயில்வே சந்திப்பு (4092m)
  - Madurai Kuttralam (4373m)
  - Make My Tour Trip (4410m)
  - Hornbill Holidays (4419m)
  - Periyar busstand (4432m)
  - Shri Navaneetha Krishnasamy Temple (4585m)
  - Guide Muthu (4614m)
----------------------------------------------------
{"message":"Demand signal search result (quality-filtered)","category":"university","tier":"HIGH","weight":10,"rawCount":40,"afterFilter":13,"validInstitutions":12,"closestDistanceMeters":1949,"averageDistanceMeters":3633,"places":["Fatima college For Women","Assemblies Of God Tamilnadu Bible College","VK College","IPL TECHNOLOGIES Tally Training Institute Koodalnagar Madurai Tamilnadu","Tamilnadu Theological Seminary","Indira Gandhi National Open University","TVS Community College","Blue Pearl – AI, Data Science, Python, Java, PHP & Full Stack Courses Madurai","The Madura College","KING CATERING COLLEGE MADURAI","ACE SOFTWARE TRAINING","Sourashtra College"]}

[Audience Data] Category: university | Valid Places Collected: 12
  - Fatima college For Women (1949m)
  - Assemblies Of God Tamilnadu Bible College (2184m)
  - VK College (2496m)
  - IPL TECHNOLOGIES Tally Training Institute Koodalnagar Madurai Tamilnadu (2512m)
  - Tamilnadu Theological Seminary (3110m)
  - Indira Gandhi National Open University (3387m)
  - TVS Community College (4198m)
  - Blue Pearl – AI, Data Science, Python, Java, PHP & Full Stack Courses Madurai (4499m)
  - The Madura College (4724m)
  - KING CATERING COLLEGE MADURAI (4752m)
  - ACE SOFTWARE TRAINING (4816m)
  - Sourashtra College (4974m)
----------------------------------------------------
{"message":"Demand signal search result (quality-filtered)","category":"transit_station","tier":"MEDIUM","weight":5,"rawCount":40,"afterFilter":40,"validInstitutions":20,"closestDistanceMeters":10,"averageDistanceMeters":2184,"places":["Kochadai","Kochadai Bus Stop","Madurai - Virattipathi (W)","Madurai - Vilangudi (N)","Fathima College","Madurai - Fathima College (S)","Kalavasal Bypass","Fatima College","Arappalayam Bus Stand","Arappalayam","Madurai - Kalavasal (S)","Madurai - Achampathu (W)","Madurai - Arasaradi (N)","Kudal Nagar","Ponmeni","Madurai - Nagamalai (E)","S S Colony","Madurai - Puttuthoppu (N)","Ettaiyapuram Bypass","Nagamalai Pudukkottai"]}

[Audience Data] Category: transit_station | Valid Places Collected: 20
  - Kochadai (10m)
  - Kochadai Bus Stop (491m)
  - Madurai - Virattipathi (W) (917m)
  - Madurai - Vilangudi (N) (1468m)
  - Fathima College (1901m)
  - Madurai - Fathima College (S) (1906m)
  - Kalavasal Bypass (1936m)
  - Fatima College (1941m)
  - Arappalayam Bus Stand (1971m)
  - Arappalayam (2012m)
  - Madurai - Kalavasal (S) (2159m)
  - Madurai - Achampathu (W) (2271m)
  - Madurai - Arasaradi (N) (2375m)
  - Kudal Nagar (2646m)
  - Ponmeni (2749m)
  - Madurai - Nagamalai (E) (3249m)
  - S S Colony (3280m)
  - Madurai - Puttuthoppu (N) (3319m)
  - Ettaiyapuram Bypass (3363m)
  - Nagamalai Pudukkottai (3716m)
----------------------------------------------------
{"message":"Demand signal search result (quality-filtered)","category":"office","tier":"LOW","weight":3,"rawCount":40,"afterFilter":19,"validInstitutions":15,"closestDistanceMeters":1452,"averageDistanceMeters":2991,"places":["Ezhil Murugan Towers","Solamalai Corporate","Smart groups private limited","ASMI ASSOCIATES","Ivlr Company Office","BMG JEWELLERS - Corporate Office","A. G. Head Quarters","Ramson credit bureau","Haier Appliances India Pvt Ltd - Branch","Shivam golbal force","Maruti Suzuki India Limited - Area Office","Jcb Regional Office","Selvi Transports Branch Office","RA Groups","Corporation Office Birth And Death Certification"]}

[Audience Data] Category: office | Valid Places Collected: 15
  - Ezhil Murugan Towers (1452m)
  - Solamalai Corporate (1810m)
  - Smart groups private limited (1911m)
  - ASMI ASSOCIATES (2079m)
  - Ivlr Company Office (2318m)
  - BMG JEWELLERS - Corporate Office (2455m)
  - A. G. Head Quarters (2481m)
  - Ramson credit bureau (2593m)
  - Haier Appliances India Pvt Ltd - Branch (2780m)
  - Shivam golbal force (2946m)
  - Maruti Suzuki India Limited - Area Office (3256m)
  - Jcb Regional Office (3987m)
  - Selvi Transports Branch Office (4735m)
  - RA Groups (4967m)
  - Corporation Office Birth And Death Certification (5094m)
----------------------------------------------------
{"message":"Demand signal search result (quality-filtered)","category":"park","tier":"LOW","weight":2,"rawCount":40,"afterFilter":17,"validInstitutions":12,"closestDistanceMeters":490,"averageDistanceMeters":2350,"places":["Sm garden","Sembaruthi Nagar Park","HMS Colony Park","karisalkulam railway gate","Tiltz Park","Corporation Park, Jayanagar","Sathya Park","sangam dog kennal(breeders)","Children's Park","Eagle park","Anaiyur park","Vadivelkarai Railway Bridge"]}

[Audience Data] Category: park | Valid Places Collected: 12
  - Sm garden (490m)
  - Sembaruthi Nagar Park (874m)
  - HMS Colony Park (1603m)
  - karisalkulam railway gate (1888m)
  - Tiltz Park (2173m)
  - Corporation Park, Jayanagar (2307m)
  - Sathya Park (2772m)
  - sangam dog kennal(breeders) (2935m)
  - Children's Park (3003m)
  - Eagle park (3010m)
  - Anaiyur park (3518m)
  - Vadivelkarai Railway Bridge (3625m)
----------------------------------------------------
{"message":"Demand signal pipeline complete","totalRawCount":287,"totalValidInstitutions":105,"categoriesSearched":8,"categoriesWithResults":8,"perCategory":[{"category":"shopping_mall","raw":40,"valid":6},{"category":"movie_theater","raw":17,"valid":10},{"category":"hotel","raw":40,"valid":15},{"category":"tourist_attraction","raw":30,"valid":15},{"category":"office","raw":40,"valid":15},{"category":"university","raw":40,"valid":12},{"category":"transit_station","raw":40,"valid":20},{"category":"park","raw":40,"valid":12}]}
{"requestId":"7b9e5976-bca6-447a-ac94-da20967e844a","method":"POST","path":"/api/analysis","statusCode":201,"durationMs":40721}
{"requestId":"ef058de0-2e8f-454a-9c3a-e79f66ea6c24","method":"GET","path":"/api/history?limit=25","statusCode":200,"durationMs":76}
{"requestId":"c816c7f7-b041-42b7-bc00-5e33b7b6d39f","method":"GET","path":"/api/history?limit=25","statusCode":304,"durationMs":51}
^CSIGINT received. Closing HTTP server.
HTTP server closed.
```
</details>
