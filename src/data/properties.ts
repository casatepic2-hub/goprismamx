export type PropertyType = 'sale' | 'rent' | 'both';
export type PropertyCategory = 'house' | 'apartment' | 'land' | 'commercial' | 'warehouse';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  category: PropertyCategory;
  location: string;
  neighborhood: string;
  city: string;
  coordinates?: { lat: number; lng: number };
  price?: number;
  pricePerSqm?: number;
  rentPrice?: number;
  avaluoPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  lotSize?: string;
  features: string[];
  images: string[];
  video?: string;
  featured: boolean;
  available: boolean;
  isBusinessProperty: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const properties: Property[] = [
  {
    id: 'casa-centro-tepic',
    title: 'Casa en Colonia Centro',
    description: 'Hermosa casa en el corazón del centro de Tepic. 4 recámaras amplias, cochera con portón eléctrico, calentador solar y aljibe. Ubicación privilegiada a 3 cuadras de Banco Santander. Precio por debajo del avalúo oficial.',
    type: 'sale',
    category: 'house',
    location: 'Calle Mina 336B, entre Oaxaca y Mazatlán',
    neighborhood: 'Colonia Centro',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5058, lng: -104.8951 },
    price: 3500000,
    avaluoPrice: 4280000,
    bedrooms: 4,
    bathrooms: 4.5,
    area: '276 m²',
    lotSize: '245 m²',
    features: [
      '4 Recámaras amplias',
      '4½ Baños completos',
      'Cocina equipada',
      'Sala espaciosa',
      'Cochera con portón eléctrico',
      'Calentador solar',
      'Aljibe',
      'Cuarto de servicio'
    ],
    images: [
      '/properties/original/exterior.jpg',
      '/properties/original/sala.jpg',
      '/properties/original/cocina.jpg',
      '/properties/original/recamara1.jpg',
      '/properties/original/recamara2.jpg',
      '/properties/original/bano1.jpg',
      '/properties/original/bano2.jpg',
      '/properties/original/cochera.jpg',
      '/properties/original/pasillo.jpg',
      '/properties/original/escaleras.jpg'
    ],
    featured: true,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'terreno-cuauhtemoc',
    title: 'Terreno en Colonia Cuauhtémoc',
    description: 'Terreno de 155 m² en zona residencial familiar. Listo para construcción.',
    type: 'sale',
    category: 'land',
    location: 'Colonia Cuauhtémoc',
    neighborhood: 'Colonia Cuauhtémoc',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5120, lng: -104.8820 },
    pricePerSqm: 6500,
    price: 1007500,
    lotSize: '6.2 x 25 m (155 m²)',
    features: [
      'Ubicación tranquila',
      'Ideal para familia',
      'Zona residencial',
      'Servicios disponibles'
    ],
    images: [
      '/properties/1/terreno.png'
    ],
    featured: false,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'bodegas-industriales',
    title: 'Bodegas Industriales',
    description: 'Bodegas industriales nuevas desde 1,037 m². Acceso controlado, seguridad 24/7, uso de suelo agroindustrial. Buena conectividad hacia Guadalajara y Puerto Vallarta.',
    type: 'rent',
    category: 'warehouse',
    location: 'Zona Industrial',
    neighborhood: 'Zona Industrial',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.4920, lng: -104.8580 },
    pricePerSqm: 130,
    area: 'Desde 1,037 m²',
    features: [
      'Acceso controlado privado',
      'Seguridad 24/7',
      'Perímetro bardeado',
      'Logística Guadalajara/Vallarta',
      'Uso suelo agroindustrial',
      'Todos los servicios',
      'Patio de maniobras',
      'Totalmente nuevas',
      'Altura máxima 8 metros',
      'Oficina con baño'
    ],
    images: [
      '/properties/3/604726801_818937144472566_4154032399832350648_n.jpg',
      '/properties/3/601830167_818937174472563_8179769266238664865_n.jpg',
      '/properties/3/602399015_818931051139842_9089039195742954735_n.jpg',
      '/properties/3/605157513_818937097805904_2234957742626743053_n.jpg',
      '/properties/3/605130076_818937141139233_9173667047921777578_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: true
  },
  {
    id: 'depto-ciudad-valle',
    title: 'Departamento en Ciudad del Valle',
    description: 'Departamento amueblado de 2 recámaras. Incluye agua y gas. Listo para mudarse.',
    type: 'rent',
    category: 'apartment',
    location: 'Ciudad del Valle',
    neighborhood: 'Ciudad del Valle',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.4850, lng: -104.8550 },
    rentPrice: 13000,
    bedrooms: 2,
    bathrooms: 2,
    features: [
      '2 recámaras cómodas',
      '2 baños completos',
      'Área de lavado',
      'Sala, comedor y cocina integrados',
      'Incluye agua',
      'Incluye gas',
      'Amueblado'
    ],
    images: [
      '/properties/4/604338494_818882177811396_1140712499030701974_n.jpg',
      '/properties/4/603843299_818882244478056_8205141992131100790_n.jpg',
      '/properties/4/604542958_818882217811392_7161606615936429958_n.jpg',
      '/properties/4/602931202_818882154478065_8491074240664715356_n.jpg',
      '/properties/4/603893233_818882194478061_3666871437637789872_n.jpg',
      '/properties/4/603737132_818882247811389_5014021342604584720_n.jpg',
      '/properties/4/603910561_818882334478047_2813991330681364862_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'casa-san-juan',
    title: 'Casa Amueblada en San Juan',
    description: 'Casa amueblada de 4 recámaras con cochera y portón eléctrico. Mascotas permitidas.',
    type: 'rent',
    category: 'house',
    location: 'Colonia San Juan',
    neighborhood: 'Colonia San Juan',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5150, lng: -104.8900 },
    rentPrice: 15000,
    bedrooms: 4,
    bathrooms: 2,
    features: [
      'Cochera con portón eléctrico',
      '4 amplias recámaras',
      '2 baños completos',
      'Recámara principal con baño privado',
      'Sala y comedor espaciosos',
      'Cocina ideal',
      'Mascotas bienvenidas',
      'Totalmente amueblada'
    ],
    images: [
      '/properties/5/602962612_817654697934144_648771643628650921_n.jpg',
      '/properties/5/601953635_817654701267477_4639778465872707309_n.jpg',
      '/properties/5/601852406_817654651267482_1925688685306087201_n.jpg',
      '/properties/5/604757995_817654714600809_380510531758238821_n.jpg',
      '/properties/5/605299081_817654784600802_7344311420659807315_n.jpg',
      '/properties/5/604511822_817654811267466_3719752398062271735_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'propiedad-los-estadios',
    title: 'Propiedad Versátil Los Estadios',
    description: 'Propiedad de 5 recámaras con roof garden y terrazas. Apta para uso habitacional o comercial (escuela, clínica, hospedaje, restaurante).',
    type: 'both',
    category: 'house',
    location: 'Fraccionamiento Los Estadios',
    neighborhood: 'Fraccionamiento Los Estadios',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5200, lng: -104.9000 },
    price: 7000000,
    rentPrice: 40000,
    bedrooms: 5,
    bathrooms: 5,
    features: [
      '5 recámaras',
      '5 baños',
      'Ubicación céntrica',
      'Áreas verdes',
      'Sala y comedor',
      'Cuarto de servicio',
      'Recibidor',
      'Roof garden',
      'Terrazas',
      'Uso versátil: habitacional/comercial'
    ],
    images: [
      '/properties/6/603808538_817645634601717_8664118344976516215_n.jpg',
      '/properties/6/602367464_817645501268397_7274124756522656044_n.jpg',
      '/properties/6/604323614_817645661268381_223490077569752195_n.jpg',
      '/properties/6/605119380_817645497935064_140604603005351771_n.jpg',
      '/properties/6/602352709_817645451268402_7535188774080487736_n.jpg',
      '/properties/6/603862657_817645521268395_5441878034485772159_n.jpg',
      '/properties/6/604879483_817645511268396_6381621261861935881_n.jpg',
      '/properties/6/602466440_817645561268391_465983061015318561_n.jpg',
      '/properties/6/602960488_817645524601728_5892666420499377283_n.jpg',
      '/properties/6/602894361_817645597935054_6805031193831322525_n.jpg'
    ],
    featured: true,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'consultorio-spauan',
    title: 'Consultorio/Oficina en Colonia Spauan',
    description: 'Espacio para consultorio u oficina. Zona tranquila con estacionamiento disponible.',
    type: 'rent',
    category: 'commercial',
    location: 'Colonia Spauan',
    neighborhood: 'Colonia Spauan',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5050, lng: -104.8700 },
    rentPrice: 5000,
    features: [
      'Zona tranquila y segura',
      'Fácil estacionamiento',
      'Recibidor acogedor',
      'Áreas tranquilas',
      'Ubicación fresca y accesible',
      'Ideal para profesionales'
    ],
    images: [
      '/properties/7/603911806_817549941277953_6427918263917049124_n.jpg',
      '/properties/7/600798053_817575161275431_8317411528019462333_n.jpg',
      '/properties/7/600448425_817549927944621_1705582946775816858_n (1).jpg',
      '/properties/7/604521169_817549924611288_6794272290939954755_n (1).jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: true
  },
  {
    id: 'terreno-morelos',
    title: 'Terreno en Colonia Morelos',
    description: 'Terreno de 300 m² a una cuadra de Calzada del Ejército. Cerca de comercios, hospitales y Parque La Loma. Apto para desarrollo residencial o comercial.',
    type: 'sale',
    category: 'land',
    location: 'Colonia Morelos',
    neighborhood: 'Colonia Morelos',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5080, lng: -104.8920 },
    price: 3000000,
    lotSize: '10 x 30 m (300 m²)',
    features: [
      'Ubicación estratégica',
      'A 1 cuadra de Calzada del Ejército',
      'Cerca de comercios',
      'Cerca de hospitales',
      'Cerca del Parque La Loma',
      'Ideal para desarrollo'
    ],
    images: [
      '/properties/8/605049373_817507361282211_6524356967712179816_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'casa-bonaterra',
    title: 'Casa en Fraccionamiento Bonaterra',
    description: 'Casa de 4 recámaras en coto privado con casa club y alberca. Totalmente equipada.',
    type: 'sale',
    category: 'house',
    location: 'Fraccionamiento Bonaterra',
    neighborhood: 'Fraccionamiento Bonaterra',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.4800, lng: -104.8700 },
    price: 5150000,
    bedrooms: 4,
    bathrooms: 4,
    lotSize: '9 x 20 m (180 m²)',
    features: [
      '4 amplias recámaras',
      '4 baños',
      'Totalmente equipada',
      'Lista para habitar',
      'Coto privado',
      'Casa club',
      'Alberca',
      'Coto privado'
    ],
    images: [
      '/properties/9/603842459_817502001282747_3825566120075174901_n.jpg',
      '/properties/9/605019548_817501934616087_4653637735121844135_n.jpg',
      '/properties/9/603883758_817501947949419_151807067405141488_n.jpg',
      '/properties/9/602332080_817501971282750_3517729203346111540_n.jpg',
      '/properties/9/601844606_817501827949431_3259983968384293540_n.jpg',
      '/properties/9/603882691_817501847949429_7801818038630549912_n.jpg',
      '/properties/9/602297806_817501871282760_8452418448295884509_n.jpg',
      '/properties/9/601874093_817501894616091_2014458774551505719_n.jpg'
    ],
    featured: true,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'terreno-lomas-encanto',
    title: 'Terreno en Lomas del Encanto',
    description: 'Terreno de 162 m² en zona residencial con áreas verdes. Zona en desarrollo.',
    type: 'sale',
    category: 'land',
    location: 'Residencial Lomas del Encanto',
    neighborhood: 'Lomas del Encanto',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.4750, lng: -104.8650 },
    price: 1200000,
    lotSize: '9 x 18 m (162 m²)',
    features: [
      'Zona residencial',
      'Rodeado de áreas verdes',
      'Ambiente tranquilo',
      'Proyectos en desarrollo',
      'Ubicación perfecta'
    ],
    images: [
      '/properties/10/603907468_817486267950987_8311028283158871895_n.jpg',
      '/properties/10/605681165_824766423889638_7327792940908581221_n.jpg',
      '/properties/10/609036315_824766437222970_1341909717174004432_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'loft-amado-nervo',
    title: 'Loft Amueblado Amado Nervo',
    description: 'Bonito departamento tipo loft amueblado en zona céntrica. Equipado con pantalla, cocina, frigobar, aire acondicionado y baño completo. Incluye internet y agua.',
    type: 'rent',
    category: 'apartment',
    location: 'Colonia Amado Nervo',
    neighborhood: 'Colonia Amado Nervo',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5030, lng: -104.8880 },
    rentPrice: 6800,
    bedrooms: 1,
    bathrooms: 1,
    features: [
      'Tipo loft',
      'Amueblado',
      'Zona céntrica',
      'Pantalla incluida',
      'Cocina equipada',
      'Frigobar',
      'Aire acondicionado',
      'Baño completo',
      'Internet incluido',
      'Agua incluida'
    ],
    images: [],
    video: '/properties/11/loft-video.mp4',
    featured: false,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'edificio-boulevard',
    title: 'Edificio Moderno Boulevard Tepic-Xalisco',
    description: 'Moderno edificio de 3 niveles a solo una cuadra del Boulevard. 403 m² de construcción con diseño atractivo. Cada nivel con centro de carga propio, preparación para A/C.',
    type: 'rent',
    category: 'commercial',
    location: 'Boulevard Tepic-Xalisco',
    neighborhood: 'Boulevard Tepic-Xalisco',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.4950, lng: -104.8500 },
    rentPrice: 60000,
    area: '403 m²',
    bathrooms: 4.5,
    bedrooms: 2,
    features: [
      'Edificio de 3 niveles',
      '403 m² construcción',
      'Altura 3m primer y segundo nivel',
      'Tercer nivel habitacional',
      '2 habitaciones con baño',
      'Cocina integral',
      'Centro de carga por nivel',
      'Preparación para A/C',
      'Aljibe 12,000 litros',
      '2 cisternas',
      'Bodega en segundo nivel'
    ],
    images: [
      '/properties/12/591909658_803670185999262_60293409011796829_n.jpg',
      '/properties/12/591923919_803670235999257_6168089611723120823_n.jpg',
      '/properties/12/591196724_803670222665925_9166999181767439183_n.jpg',
      '/properties/12/593426760_803670249332589_8941807509862026105_n.jpg',
      '/properties/12/593673406_803670192665928_849132294814759641_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: true
  },
  {
    id: 'local-avenida-mexico',
    title: 'Local Comercial Avenida México',
    description: 'Local en renta sobre Avenida México, antes Cklass. Casi esquina con Calzada del Ejército junto al nodo vial. Incluye estacionamiento para 3 autos. Propiedad compartida.',
    type: 'rent',
    category: 'commercial',
    location: 'Avenida México, casi esquina Calzada del Ejército',
    neighborhood: 'Avenida México',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5100, lng: -104.8850 },
    rentPrice: 18000,
    area: '163.41 m²',
    bathrooms: 2.5,
    features: [
      'Local: 103.74 m²',
      'Estacionamiento: 59.67 m²',
      '2½ baños',
      '3 estacionamientos',
      'Ubicación estratégica',
      'Junto al nodo vial',
      'Propiedad compartida'
    ],
    images: [
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.50 AM.jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.50 AM (1).jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.50 AM (2).jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.51 AM.jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.51 AM (1).jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.51 AM (2).jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.51 AM (3).jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.51 AM (4).jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.51 AM (5).jpeg',
      '/properties/14/WhatsApp Image 2026-01-08 at 8.20.51 AM (6).jpeg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: true
  },
  {
    id: 'depto-centro-independencia',
    title: 'Departamento Céntrico',
    description: 'Departamento moderno a cuadra y media de Avenida Independencia en zona segura y tranquila. Cuenta con terraza, cocina equipada y estacionamiento con portón eléctrico.',
    type: 'rent',
    category: 'apartment',
    location: 'Cerca de Avenida Independencia',
    neighborhood: 'Centro',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.5040, lng: -104.8930 },
    rentPrice: 12800,
    bedrooms: 2,
    bathrooms: 2,
    features: [
      '2 recámaras con clósets',
      '2 baños completos',
      'Cocina equipada',
      'Espacio para comedor',
      'Terraza',
      'Estacionamiento con portón eléctrico',
      'Zona segura y tranquila',
      'Ubicación céntrica'
    ],
    images: [
      '/properties/15/605516810_826433293722951_3697068044650082440_n.jpg',
      '/properties/15/605786148_826433263722954_8341920462357988093_n.jpg',
      '/properties/15/607048969_826433267056287_222990575238076148_n.jpg',
      '/properties/15/607191892_826433300389617_1657515932633525163_n.jpg',
      '/properties/15/610832510_827129920319955_7285109169483780788_n.jpg',
      '/properties/15/610872639_827129866986627_8057846373909802190_n.jpg',
      '/properties/15/610878931_827129716986642_4458024432664061392_n.jpg',
      '/properties/15/610957668_827129770319970_8686182176368846180_n.jpg',
      '/properties/15/611249003_827129820319965_8827840899169655822_n.jpg',
      '/properties/15/611562296_827129713653309_7896392824540010898_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: false
  },
  {
    id: 'local-bodega-insurgentes',
    title: 'Local con Bodega Av. Insurgentes',
    description: 'Local con estacionamiento y bodega sobre Av. Insurgentes Pte. Edificio de 2 plantas con 769 m² de construcción. Estacionamiento amplio para más de 20 autos. Cerca de carretera GDL-MZT.',
    type: 'rent',
    category: 'warehouse',
    location: 'Av. Insurgentes Pte',
    neighborhood: 'Insurgentes',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.4980, lng: -104.8600 },
    rentPrice: 60000,
    lotSize: '1,336 m²',
    area: '769 m²',
    features: [
      'Superficie total: 1,336 m²',
      'Construcción: 769 m² en 2 plantas',
      'Estacionamiento: 952 m²',
      'Capacidad +20 autos',
      'Planta baja con bodega',
      'Segunda planta con área abierta',
      'Oficina y tejabanes',
      'Ubicación estratégica',
      'Cerca de carretera GDL-MZT'
    ],
    images: [
      '/properties/16/601397122_818914731141474_6505244026189299212_n.jpg',
      '/properties/16/602340102_818914664474814_8057454296509844900_n.jpg',
      '/properties/16/603749562_818914724474808_1137827945744398792_n.jpg',
      '/properties/16/604853958_818914764474804_500989682308903161_n.jpg',
      '/properties/16/605030711_818914704474810_2009609391633658434_n.jpg',
      '/properties/16/605175265_818914727808141_7222050898363315960_n.jpg',
      '/properties/16/605765557_818915174474763_8793389600317970103_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: true
  },
  {
    id: 'casa-bonaterra-recuperacion',
    title: 'Casa Bonaterra Coto Bonastanza',
    description: 'Casa de recuperación bancaria lista para entrega. 3 recámaras, estacionamiento subterráneo para 2 autos con bodega. Coto con seguridad 24/7, alberca, gimnasio y áreas verdes.',
    type: 'sale',
    category: 'house',
    location: 'Coto Bonastanza, Bonaterra',
    neighborhood: 'Fraccionamiento Bonaterra',
    city: 'Tepic, Nayarit',
    coordinates: { lat: 21.4810, lng: -104.8710 },
    price: 5444000,
    bedrooms: 3,
    bathrooms: 2.5,
    lotSize: '179.32 m²',
    area: '256 m²',
    features: [
      '3 amplias recámaras',
      '2½ baños',
      'Estacionamiento subterráneo para 2 autos',
      'Bodega',
      'Recuperación bancaria',
      'Lista para entrega',
      'Seguridad 24/7',
      'Alberca',
      'Gimnasio',
      'Áreas verdes y juegos infantiles',
      'Terraza para eventos',
      'Cancha deportiva'
    ],
    images: [
      '/properties/17/599467619_816026151430332_3806471622263200887_n.jpg',
      '/properties/17/599494934_816025848097029_5767143219540962475_n.jpg',
      '/properties/17/599494943_816025661430381_4396296009733980525_n.jpg',
      '/properties/17/599772026_816026191430328_7900173662576919914_n.jpg',
      '/properties/17/599957298_816026004763680_1081917956020946545_n.jpg',
      '/properties/17/599957315_816026111430336_7561280099482880539_n.jpg',
      '/properties/17/599957783_816026208096993_2061215375576165743_n.jpg',
      '/properties/17/599961452_816026114763669_6056556163908581918_n.jpg',
      '/properties/17/600090616_816025831430364_6325768659316124725_n.jpg',
      '/properties/17/600143347_816026071430340_1175927744365604598_n.jpg'
    ],
    featured: false,
    available: true,
    isBusinessProperty: false
  }
];

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find(p => p.id === id);
};

export const getPropertiesByType = (type: PropertyType): Property[] => {
  return properties.filter(p => p.type === type || p.type === 'both');
};

export const getAvailableProperties = (): Property[] => {
  return properties.filter(p => p.available);
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter(p => p.featured && p.available);
};

export const getBusinessProperties = (): Property[] => {
  return properties.filter(p => p.isBusinessProperty && p.available);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
