import concertImg from "./assets/concert.webp";
import travelImg from "./assets/travel.webp";
import birthdayImg from "./assets/birthday.webp";
import contentImg from "./assets/content creation.webp";
import concertBpImg from "./assets/concert_bp.webp";
import weddingImg from "./assets/wedding.webp";
import concertBtsImg from "./assets/concert_bts.webp";
import travelSgImg from "./assets/travel_sg.webp";
import vloggingImg from "./assets/vlogging.webp";

export type HeroSlide = {
  /** Word shown in the headline: "Need a Phone for <word>?" */
  word: string;
  /** Pill shown on the card */
  label: string;
  /** Describes the photo for screen readers. Say what is in the picture, not just the topic. */
  alt: string;
  /** Photos for this slide (imported from src/assets) */
  images: string[];
  /** CSS object-position for the photo, e.g. "50% 30%" */
  position?: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  { word: "concerts", label: "Concerts", alt: "Crowd with raised hands facing a brightly lit concert stage", images: [concertImg], position: "50% 50%" },
  { word: "travel", label: "Travel", alt: "View from an airplane window of a wing above blue ocean and small islands", images: [travelImg], position: "50% 50%" },
  { word: "celebrations", label: "Celebrations", alt: "Friends clapping around a girl in a party hat blowing out candles on a birthday cake", images: [birthdayImg], position: "50% 40%" },
  { word: "content creation", label: "Content Creation", alt: "Smiling woman recording a podcast with a microphone and laptop at her desk", images: [contentImg], position: "50% 30%" },
  { word: "K-pop concerts", label: "K-pop Concerts", alt: "Four performers in black outfits on stage at a K-pop concert", images: [concertBpImg], position: "50% 40%" },
  { word: "weddings", label: "Weddings", alt: "Bride and groom holding hands among white flowers at a wedding", images: [weddingImg], position: "50% 40%" },
  { word: "stadium shows", label: "Stadium Shows", alt: "Group of performers dancing on a stage with flames and red lighting at a stadium show", images: [concertBtsImg], position: "50% 50%" },
  { word: "city trips", label: "City Trips", alt: "Indoor waterfall and glass dome surrounded by greenery at an airport garden in Singapore", images: [travelSgImg], position: "50% 40%" },
  { word: "live music", label: "Live Music", alt: "Crowd with raised hands facing a brightly lit concert stage", images: [concertImg], position: "50% 50%" },
  { word: "vlogging", label: "Vlogging", alt: "Hand holding a smartphone on a gimbal stabilizer for vlogging", images: [vloggingImg], position: "50% 40%" },
];

/** Time between steps, in ms */
export const HERO_INTERVAL = 1500;
/** How many cards are visible in the stack (front card + the ones behind it) */
export const HERO_CARDS_VISIBLE = 3;
/** Sideways tilt of the cards, in degrees (positive = right edge recedes) */
export const HERO_CARD_TILT = 28;