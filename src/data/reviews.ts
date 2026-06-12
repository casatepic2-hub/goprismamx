// Customer reviews sourced from Giovanna Romero's Facebook recommendations page.
// Source: https://www.facebook.com/GioRomerolo/reviews
// All 14 reviews are positive 5-star recommendations ("100% recomendado").
//
// `image` is the locally re-hosted avatar in /public/images/reviews/. Facebook's
// CDN URLs expire (signed tokens), so avatars must be downloaded and re-hosted.
// Reviews without a local avatar yet fall back to an initials badge in the widget.

export interface Review {
  name: string;
  text: string;
  date: string;
  rating: number;
  image?: string;
}

export const FB_REVIEWS_URL = 'https://www.facebook.com/GioRomerolo/reviews';
export const FB_RECOMMEND_PERCENT = 100;
export const FB_REVIEW_COUNT = 14;

export const reviews: Review[] = [
  {
    name: 'Kenia Briones',
    text: 'Excelente persona responsable, honesta, trabajadora y de confianza. Siempre demuestra compromiso en todo lo que hace y excelente trato con las personas. Sin duda, alguien muy recomendable, me ayudó mucho.',
    date: 'Abril 2026',
    rating: 5,
    image: '/images/reviews/kenia-briones.jpg',
  },
  {
    name: 'Angie Guadalupe',
    text: 'Me ayudó a encontrar casa súper rápido y todo en perfectas condiciones, muy amable y atenta 🤭👌',
    date: 'Abril 2026',
    rating: 5,
    image: '/images/reviews/angie-guadalupe.jpg',
  },
  {
    name: 'Ashleey Jauregui',
    text: 'Excelente trato, muy amable y atenta 💕',
    date: 'Febrero 2026',
    rating: 5,
    image: '/images/reviews/ashleey-jauregui.jpg',
  },
  {
    name: 'Luis Brahms',
    text: 'Giovanna me ayudó a encontrar un buen departamento, todo excelente ¡gracias!',
    date: 'Febrero 2026',
    rating: 5,
    image: '/images/reviews/luis-brahms.jpg',
  },
  {
    name: 'Keylany Higuera González',
    text: 'Muy buena atención, tuvimos una buena experiencia, siempre estuvo al pendiente 🙌🏼',
    date: 'Enero 2026',
    rating: 5,
    image: '/images/reviews/keylany-higuera-gonzalez.jpg',
  },
  {
    name: 'Sofie Pontón',
    text: 'Muy buena atención, pronta respuesta y seguimiento de parte de Gio. ¡Excelente servicio!',
    date: 'Agosto 2025',
    rating: 5,
    image: '/images/reviews/sofie-ponton.jpg',
  },
  {
    name: 'Aldair Martínez Sánchez',
    text: 'Recomiendo mucho la atención, muy amable.',
    date: 'Julio 2025',
    rating: 5,
    image: '/images/reviews/aldair-martinez-sanchez.jpg',
  },
  {
    name: 'Casas González',
    text: '¡Excelente atención! Siempre al pendiente y acompañando en todo momento.',
    date: 'Julio 2025',
    rating: 5,
    image: '/images/reviews/casas-gonzalez.jpg',
  },
  {
    name: "Omar Gentleman's",
    text: 'Excelente trato, atenta, súper amable y buen tiempo de respuesta, y toda la información clara. 100% recomendable, excelente asesor.',
    date: 'Julio 2025',
    rating: 5,
    image: '/images/reviews/omar-gentlemans.jpg',
  },
  {
    name: 'América Ibarra',
    text: 'Excelente atención, completamente profesional ❤️',
    date: 'Julio 2025',
    rating: 5,
    image: '/images/reviews/america-ibarra.png',
  },
  {
    name: 'Nelly Hensler',
    text: 'Excelente atención por parte de Giovanna, encontramos lo que necesitábamos a tiempo y cumplió con nuestras necesidades y expectativas.',
    date: 'Julio 2025',
    rating: 5,
    image: '/images/reviews/nelly-hensler.jpg',
  },
  {
    name: 'Lucía Muñoz',
    text: 'Excelente atención, respuesta súper rápida y amable. Siempre atendiendo las dudas y necesidades que surgen. Recomendada ampliamente 👌🏼🌟',
    date: 'Junio 2025',
    rating: 5,
    image: '/images/reviews/lucia-munoz.jpg',
  },
  {
    name: 'Anny Castro',
    text: 'Excelente atención, siempre pendiente y muy amable. ¡Súper recomendada!',
    date: 'Junio 2025',
    rating: 5,
    image: '/images/reviews/anny-castro.jpg',
  },
  {
    name: 'Esmeralda Roustand',
    text: 'La atención es excelente, solo con explicarle tus necesidades ella se encarga de cubrirlas con el mejor inmueble. Muy amable y muy eficiente para los trámites necesarios, pendiente de cualquier duda y con disponibilidad para cualquier necesidad. Súper recomendable Giovanna Romero.',
    date: 'Junio 2025',
    rating: 5,
    image: '/images/reviews/esmeralda-roustand.jpg',
  },
];
