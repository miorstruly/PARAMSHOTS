import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import logo from "./assets/logo.png";
import heroBg from "./assets/hero-bg.jpg";
import ip17pm from "./assets/ip17pm.webp";
import qrcode from "./assets/qrcode.jpg";
import React from "react";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";
import Stepper, { Step } from "./Stepper";
import Folder from "./Folder";
import TiltCard from "./TiltCard";
import TextMorph from "./TextMorph";
import HeroSection from "./HeroSection";
import GradientWaves from "./GradientWaves";
import TrueFocus from "./TrueFocus";
import { FloatingNavbar } from "./FloatingNavbar";
import { MotionAccordion } from "./MotionAccordion";
import { KineticTextReveal } from "./KineticTextReveal";
import { ReviewsScrollSplit } from "./ReviewsScrollSplit";
import ScrollSection from "./ScrollSection";
import FileTransfer from "./FileTransfer";
import TransferShowcase from "./TransferShowcase";
import SiteButton from "./SiteButton";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import AvailabilityCalendar from "./AvailabilityCalendar";
import type { Concert } from "./api";
import MessengerButton from "./MessengerButton";
import { useSeo, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "./seo";
import concert2 from "./assets/concert-2.jpg";
import concertAirSupply from "./assets/concert-air-supply.png";
import concert3 from "./assets/concert-3.jpg";
import concert4 from "./assets/concert-4.jpg";
import concert5 from "./assets/concert-5.jpg";
import concert6 from "./assets/concert-6.jpg";
import concert7 from "./assets/concert-7.jpg";
import concert8 from "./assets/concert-8.jpg";
import concert9 from "./assets/concert-9.jpg";
import concert10 from "./assets/concert-10.jpg";
import concert11 from "./assets/concert-11.jpg";
import cr1 from "./assets/CR-1.jpg";
import cr2 from "./assets/CR-2.jpg";
import cr3 from "./assets/CR-3.jpg";

const BOOKING_URL = "https://forms.gle/xHEx2SGExf2bYBoQ6";

const phones = [
  {
    id: 1,
    name: "iPhone 17 Pro Max",
    storage: "256GB",
    color: "Silver",
    image: ip17pm,
    badge: "Most Popular",
    cameras: ["Triple 48MP Rear Camera","18MP Center Stage Front Camera", "Up to 4K Dolby Vision recording at 60 fps"],
    specs: ["6.9\" Super Retina XDR", "A19 Pro Chip", "Pro Camera System", "USB-C"],
    Inclusions: ["Case with Strap", "Powerbank", "Mini Fan", "USB A to Type C adapter", "Charger", "Pouch"],
  },

];

const pricingPlans = [
  {
    name: "Premium",
    price: "₱2,500",
    per: "per day",
    duration: "1–2 days",
    highlight: false,
    features: [
      "Full device access",
      "Accessories included",
      "Messenger support",
      "Additional ₱300 handling fee",
    ],
  },
  {
    name: "Standard",
    price: "₱2,000",
    per: "per day",
    duration: "3–5 days",
    highlight: true,
    features: [
      "Everything in Standard",
      "Priority booking",
      "Free handling fee",
      "Extended support hours",
    ],
  },
  {
    name: "Long Rent",
    price: "₱1,500",
    per: "per day",
    duration: "6+ days",
    highlight: false,
    features: [
      "Everything in Premium",
      "Bigger Discount",
      "Best value rate",
    ],
  },
];

const requirements = [
  { icon: "id", title: "Valid Government ID", desc: "Two (2) valid IDs, at least one of which is government-issued. A selfie with your government ID is important." },
  { icon: "chat", title: "Active personal Facebook account and phone number", desc: "Dummy accounts, accounts without a profile picture, accounts with ambiguous names, and locked or private profiles are strictly prohibited. An active phone number is also required." },
  { icon: "form", title: "Proof of billing", desc: "Surname and address must be included and must match the information on your IDs and the google form. (e.g., electric, water, or internet bill)" },
  { icon: "deposit", title: "Security Deposit", desc: "A ₱2,000 refundable deposit is needed. The deposit will be refunded in full amount once the unit and all accessories have been returned in their original condition." },
  { icon: "agreement", title: "Provide an emergency contact", desc: "A family member: their phone number and Facebook account. A screenshot of your Messenger conversation with them must be provided as proof." },
  { icon: "age", title: "18 Years Old & Above", desc: "Renters must be at least 18 years old. No minors allowed" },
];

const requirementGroups = [
  { label: "Verification", icons: ["id", "chat", "form"] },
  { label: "Deposit & Safety", icons: ["deposit", "agreement"] },
  { label: "Eligibility", icons: ["age"] },
];

const steps = [
  { num: "01", title: "Accomplish Google Form", desc: "Submit your rental details and requirements" },
  { num: "02", title: "Wait for Approval", desc: "We’ll review your application" },
  { num: "03", title: "Payment", desc: "To reserve a spot, a 50% down payment (DP) is needed. DP is non-refundable" },
  { num: "04", title: "Confirmation", desc: "Receive your official booking confirmation and downpayment receipt" },
  { num: "05", title: "Meet Up", desc: "Pick up the phone at the agreed location and time" },
  { num: "06", title: "Return", desc: "Return the phone and accessories safely and on schedule" },
];

const featuredConcerts: Concert[] = [
  {
    title: "Louis Tomlinson",
    date: "Saturday, October 17, 2026",
    dateISO: "2026-10-17",
    location: "Smart Araneta Coliseum, Quezon City",
    image: concert2,
    description: "Catch the live show and capture every unforgettable concert moment.",
  },
  {
    title: "Air Supply",
    date: "Monday, October 26, 2026",
    dateISO: "2026-10-26",
    location: "Smart Araneta Coliseum, Quezon City",
    image: concertAirSupply,
    imageAlt: "Air Supply: A Matter of Time Tour poster showing the duo in sunglasses and jackets against a purple, starburst background",
    description: "A night of classic hits and memories worth capturing.",
  },
  {
    title: "Jason Mraz",
    date: "Tuesday, October 27, 2026",
    dateISO: "2026-10-27",
    location: "SM Mall of Asia Arena, Pasay",
    image: concert3,
    description: "Capture every song and special moment live.",
  },
  {
    title: "Zara Larsson",
    date: "Friday, October 30, 2026",
    dateISO: "2026-10-30",
    location: "Smart Araneta Coliseum, Quezon City",
    image: concert4,
    description: "Get ready for a high-energy night and crisp concert memories.",
  },
  {
    title: "LANY",
    date: "November 6–14, 2026",
    dateISO: "2026-11-06",
    endDateISO: "2026-11-14",
    location: "Cebu, Philippine Arena (Bulacan), and Davao",
    image: concert5,
    description: "Multiple Philippine tour dates in November. Check the official tour listing for your city.",
  },
  {
    title: "5 Seconds of Summer",
    date: "November 11–12 and 29, 2026",
    dateISO: "2026-11-11",
    endDateISO: "2026-11-29",
    location: "SM Mall of Asia Arena, Pasay",
    image: concert6,
    description: "Three chances to sing along and capture the show.",
  },
  {
    title: "My Chemical Romance",
    date: "Saturday, November 14, 2026",
    dateISO: "2026-11-14",
    location: "Philippine Arena, Bocaue, Bulacan",
    image: concert7,
    description: "Get ready for an unforgettable live performance.",
  },
  {
    title: "wave to earth",
    date: "Sunday, November 15, 2026",
    dateISO: "2026-11-15",
    location: "SM Mall of Asia Arena, Pasay",
    image: concert8,
    description: "Capture the atmosphere and every favorite song.",
  },
  {
    title: "Simple Plan",
    date: "Wednesday, November 25, 2026",
    dateISO: "2026-11-25",
    location: "Smart Araneta Coliseum, Quezon City",
    image: concert9,
    description: "A live show full of nostalgic anthems and crowd moments.",
  },
  {
    title: "Cup of Joe Symphony",
    date: "December 3–4, 2026",
    dateISO: "2026-12-03",
    endDateISO: "2026-12-04",
    location: "Smart Araneta Coliseum, Quezon City",
    image: concert10,
    description: "Experience Cup of Joe's music in a symphonic setting.",
  },
  {
    title: "LE SSERAFIM",
    date: "December 5–6, 2026",
    dateISO: "2026-12-05",
    endDateISO: "2026-12-06",
    location: "SM Mall of Asia Arena, Pasay",
    image: concert11,
    description: "Prepare for a spectacular live show and memorable fan moments.",
  },
];


function getConcertDateISO(concert: { date?: string; dateISO?: string; endDateISO?: string }) {
  // Multi-date listings stay visible until the last listed performance has passed.
  const cutoffDate = concert.endDateISO || concert.dateISO;
  if (cutoffDate && /^\d{4}-\d{2}-\d{2}$/.test(cutoffDate)) {
    return cutoffDate;
  }

  const value = (concert.date || "").trim();
  const isoMatch = value.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime()) && /\b20\d{2}\b/.test(value)) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Unknown or date-less entries (such as "Coming Soon") are not shown.
  return null;
}

function getTodayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}


const reviews = [
  {
    name: "J.C Santos",
    role: "Cup of Joe Concert",
    stars: 5,
    image: cr1,
    quote: "10/10 experience, super smooth ng transaction, mabilis mag reply and very mabait kausap. Maayos and legit talaga yung phone, walang naging problem at all🫶🏻 thank u ulit, would definitely rent again!!",
  },
    {
    name: "D. Buzon",
    role: "EXO Concert Day 1",
    stars: 5,
    image: cr2,
    quote: "First time kong mag-rent ng phone and super worth it! Sobrang linaw ng camera, ang ganda ng quality ng photos and videos parang sariling phone mo lang gamitin. Smooth din yung performance, walang lag, kaya perfect for travel, concerts, or special events. Madali kausap yung owner, responsive, at hassle free ang buong process from pickup to return. Well taken care of din yung phone. Highly recommended if gusto mo ng high-quality photos and videos without buying a new phone. Sulit na sulit! 📱✨ till next time po.",
  },
  {
    name: "N.M Alvarado",
    role: "EXO Concert Day 2",
    stars: 5,
    image: cr3,
    quote: "Sobrang ganda ng quality ng phone, perfect for taking fancams sa concerts at pati na rin sa aesthetic travel photos and videos. It’s definitely a great phone for capturing once-in-a-lifetime moments. Complete rin ang accessories, and very accommodating ang owner. Kapag may concern ka, ready siyang mag-assist, at sobrang bait pa. Halatang well taken care of talaga yung phone.Na-zoom ko pa yung EXO kahit medyo malayo ang seat ko, and the quality didn’t disappoint. 🥹🫶🏼 Highly recommended!",
  }

];

const FAQ_FORM_URL = "https://forms.gle/QfSgjXxr6E1aDgW38";
const faqList = "list-disc space-y-1 pl-5";
const strong = "text-white";

type Lang = "en" | "tl";
type FaqItem = {
  q: Record<Lang, string>;
  a: Record<Lang, React.ReactNode>;
};

// Ordered from most to least important for a first-time renter. English is the default, Tagalog is the translation.
const faqs: FaqItem[] = [
  {
    q: { en: "How much is the rental rate?", tl: "Magkano po ang rental rate?" },
    a: {
      en: (
        <div className="space-y-3">
          <p>The longer you rent, the lower the daily rate:</p>
          <ul className={faqList}>
            <li>
              <strong className={strong}>Standard – ₱2,500/day</strong> (1–2 days). An additional ₱300 handling fee applies.
            </li>
            <li>
              <strong className={strong}>Premium – ₱2,000/day</strong> (3–5 days) | Best Value. Includes everything in Standard, plus priority booking, free handling fee, and extended support hours.
            </li>
            <li>
              <strong className={strong}>Long Rent – ₱1,500/day</strong> (6+ days). Includes everything in Premium, plus greater savings and our lowest daily rate.
            </li>
          </ul>
        </div>
      ),
      tl: (
        <div className="space-y-3">
          <p>Mas mura po ang per-day rate kapag mas matagal ang rental:</p>
          <ul className={faqList}>
            <li>
              <strong className={strong}>Standard – ₱2,500/day</strong> (1–2 days). May additional ₱300 handling fee.
            </li>
            <li>
              <strong className={strong}>Premium – ₱2,000/day</strong> (3–5 days) – Best Value. Kasama ang lahat ng
              nasa Standard, plus priority booking, libreng handling fee, at extended support hours.
            </li>
            <li>
              <strong className={strong}>Long Rent – ₱1,500/day</strong> (6+ days). Kasama ang lahat ng nasa Premium,
              plus mas malaking discount at best value rate.
            </li>
          </ul>
        </div>
      ),
    },
  },
  {
    q: { en: "Do you have lower-priced units?", tl: "May lower units po ba kayo?" },
    a: {
      en: "Unfortunately, we don't have any lower-priced units available at the moment. The iPhone 17 Pro Max is currently our only device available. Thank you for understanding!",
      tl: "Sa ngayon po ay wala pa kaming lower units. iPhone 17 Pro Max lang po ang available na device. Maraming salamat po sa pang-unawa!",
    },
  },
  {
    q: { en: "What's included in the rental?", tl: "Ano po ang kasama o inclusions?" },
    a: {
      en: "Every rental comes with a case with strap, powerbank, mini fan, USB A to Type C adapter, charger, and pouch. It's ready to use as soon as you pick it up!",
      tl: "Kasama po ang case with strap, powerbank, mini fan, USB A to Type C adapter, charger, at pouch. Ready na po agad gamitin pagkakuha ninyo!",
    },
  },
  {
    q: {
      en: "How do I get my photos and videos from the rental phone?",
      tl: "Paano ko makukuha ang photos at videos ko mula sa rental phone?",
    },
    a: {
      en: (
        <p>
          Before returning the phone, transfer them privately to your own device. No iCloud sign-in is required. Follow the steps on our{" "}
          <Link to="/transfer" className="font-semibold text-white underline underline-offset-2">
            photo and video transfer page
          </Link>
          . Please make sure to complete your transfer before your scheduled return time, and delete your files from the rental phone afterwards.
        </p>
      ),
      tl: (
        <p>
          Bago isauli ang phone, i-transfer ang mga ito nang private sa sarili ninyong device. Hindi kailangang mag-sign
          in sa iCloud. Sundan ang mga hakbang sa{" "}
          <Link to="/transfer" className="font-semibold text-white underline underline-offset-2">
            photo and video transfer page
          </Link>{" "}
          namin. Tapusin po ito bago ang oras ng pagsasauli, at burahin ang files ninyo sa rental phone pagkatapos.
        </p>
      ),
    },
  },
  {
    q: { en: "What do I need to submit?", tl: "Ano po ang mga kailangan kong i-submit?" },
    a: {
      en: (
        <div className="space-y-3">
          <p>To proceed with a rental, please complete the following requirements:</p>
          <ul className={faqList}>
            <li>You must be at least 18 years old. Minors are not allowed</li>
            <li>Two (2) valid IDs, at least one of which must be government-issued, plus a selfie holding your government-issued ID</li>
            <li>Proof of billing showing your surname and address, which must match the information on your IDs and the inquiry form</li>
            <li>A personal Facebook account and an active phone number.</li>
            <li>
              An emergency contact who is a family member. You must provide their phone number, Facebook account, and a screenshot of your conversation with them.
            </li>
          </ul>
          <p>If you do not meet these requirements, we reserve the right to cancel your inquiry and decline your rental request</p>
        </div>
      ),
      tl: (
        <div className="space-y-3">
          <p>Para po makapag-proceed sa rental, kailangan pong kumpletuhin ang mga sumusunod:</p>
          <ul className={faqList}>
            <li>18 years old pataas po. Hindi po tumatanggap ng minors.</li>
            <li>Two (2) valid IDs, at least one ay government-issued, at isang selfie na hawak ang government ID.</li>
            <li>Proof of billing na nakalagay ang surname at address, at tugma sa IDs at sa inquiry form.</li>
            <li>Personal na Facebook account at active na phone number.</li>
            <li>
              Emergency contact (family member): ang phone number niya, Facebook account niya, at screenshot ng
              conversation ninyo sa kanya.
            </li>
          </ul>
          <p>
            Kung hindi po makumpleto ang requirements, may karapatan po kaming i-cancel ang inquiry at hindi ituloy
            ang rental.
          </p>
        </div>
      ),
    },
  },
  {
    q: { en: "How do I book?", tl: "Paano po mag-book?" },
    a: {
      en: (
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className={strong}>Fill out the Google Form.</strong> Submit your rental details and requirements.
          </li>
          <li>
            <strong className={strong}>Wait for approval.</strong> We'll review your application.
          </li>
          <li>
            <strong className={strong}>Pay the down payment.</strong> Once your request is approved, pay a 50% down
            payment (DP) to reserve your slot. The DP is non-refundable but will be deducted from your rental fee.
          </li>
          <li>
            <strong className={strong}>Payment confirmation.</strong> You'll receive your official booking
            confirmation and down payment receipt.
          </li>
          <li>
            <strong className={strong}>Meet-up.</strong> Pick up the phone at the agreed location and time.
          </li>
          <li>
            <strong className={strong}>Return.</strong> Return the phone and accessories safely and on schedule.
          </li>
        </ol>
      ),
      tl: (
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className={strong}>Sagutan ang Google Form.</strong> I-submit ang rental details at requirements
            ninyo.
          </li>
          <li>
            <strong className={strong}>Hintayin ang approval.</strong> Susuriin po namin ang application ninyo.
          </li>
          <li>
            <strong className={strong}>Mag-down payment.</strong> Kapag na-approve na ang request ninyo, mag-DP po ng
            50% para ma-reserve ang slot. Non-refundable po ang DP pero ibabawas ito sa rental fee ninyo.
          </li>
          <li>
            <strong className={strong}>Payment confirmation.</strong> Ibibigay po namin ang official booking
            confirmation at receipt ng down payment.
          </li>
          <li>
            <strong className={strong}>Meet-up.</strong> Kunin ang phone sa napagkasunduang lugar at oras.
          </li>
          <li>
            <strong className={strong}>Return.</strong> Isauli ang phone at accessories nang ligtas at on schedule.
          </li>
        </ol>
      ),
    },
  },
  {
    q: { en: "Where can I find the Google Form link?", tl: "Saan po ang Google Form link?" },
    a: {
      en: (
        <p>
          Here's the link:{" "}
          <a
            href={FAQ_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline underline-offset-2"
          >
            {FAQ_FORM_URL}
          </a>
          . Thank you!
        </p>
      ),
      tl: (
        <p>
          Narito po ang link:{" "}
          <a
            href={FAQ_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline underline-offset-2"
          >
            {FAQ_FORM_URL}
          </a>
          . Salamat po!
        </p>
      ),
    },
  },
  {
    q: { en: "Is the down payment refundable?", tl: "Refundable po ba ang down payment?" },
    a: {
      en: "The down payment is non-refundable, but it will be deducted from your total rental fee, so it won't be an additional cost.",
      tl: "Hindi po refundable ang down payment, pero ibabawas po ito sa rental fee ninyo, kaya hindi po ito dagdag na gastos.",
    },
  },
  {
    q: {
      en: "How much is the security deposit, and when is it returned?",
      tl: "Magkano po ang security deposit, at kailan ito ibabalik?",
    },
    a: {
      en: "A ₱2,000 refundable security deposit is required. It will be returned in full once the unit and all accessories are returned in their original condition.",
      tl: "₱2,000 po ang refundable security deposit. Ibabalik po ito nang buo kapag naisauli na ang unit at lahat ng accessories sa original na kondisyon.",
    },
  },
  {
    q: { en: "Do you accept same day return bookings?", tl: "Pwede po ba ang same-day return rent?" },
    a: {
      en: "Our minimum rental period is 24 hours. To check availability for your preferred date, please send us a message.",
      tl: "Ang minimum rental period po namin ay 24 hours. Para sa availability ng slot sa araw na gusto ninyo, message lang po kayo sa amin.",
    },
  },
  {
    q: {
      en: "Is meet-up available, and is there a handling fee?",
      tl: "Pwede po ba ang meet-up, at may handling fee po ba?",
    },
    a: {
      en: "Yes! Meet-up is currently our only pick-up option. A ₱300 handling fee applies to rentals lasting 1–2 days. The handling fee is free for rentals of 3 days or more.",
      tl: "Opo, meet-up lang po ang available sa ngayon. May additional ₱300 handling fee po para sa 1–2 days na rental. Libre na po ang handling fee kapag 3 days pataas.",
    },
  },
  {
    q: { en: "Where can we meet up?", tl: "Saan po ang meet-up place?" },
    a: {
      en: "We can meet at SM Pampanga, Robinsons, or SM Clark. If another place is more convenient for you, just chat with us and we'll see if it works.",
      tl: "Pwede po kaming mag-meet sa SM Pampanga, Robinsons, o SM Clark. Kung may ibang lugar po kayong mas convenient, chat lang po kayo at pag-usapan natin kung pwede.",
    },
  },
  {
    q: { en: "Can you deliver the phone?", tl: "Pwede po bang ipa-deliver ang phone?" },
    a: {
      en: "Sorry, delivery isn't available yet. Meet-up is our only option for now. Thank you for understanding!",
      tl: "Pasensya na po, hindi pa po available ang delivery sa ngayon. Meet-up lang po muna ang option namin. Salamat po sa pang-unawa!",
    },
  },
  {
    q: { en: "Where are you located?", tl: "Saan po kayo located?" },
    a: {
      en: "We're based in Guagua, Pampanga. For pick-up, we'll meet at the place we agree on.",
      tl: "Nasa Guagua, Pampanga po kami. Para sa pick-up, mag-meet-up po tayo sa napagkasunduang lugar.",
    },
  },
  {
    q: { en: "What happens if I return the phone late?", tl: "Paano po kapag na-late ang pagbalik ng phone?" },
    a: {
      en: "A late fee of ₱200 per hour will be deducted from your security deposit. If you think you'll be late, please message us right away so we can work it out.",
      tl: "May late fee po na ₱200 kada oras, na ibabawas sa security deposit. Kung sa tingin ninyo ay mahuhuli kayo, message lang po agad sa amin para maayos natin.",
    },
  },
  {
    q: {
      en: "What if the phone is damaged when I return it?",
      tl: "Paano po kapag may damage ang phone pagkabalik?",
    },
    a: {
      en: "The cost of any damage will be shouldered by the renter, as stated in the signed rental agreement. Please take good care of the unit. Thank you!",
      tl: "Ang gastos po sa damage ay sasagutin ng renter, ayon sa pirmadong rental agreement. Kaya po ingat na ingat tayo sa unit. Salamat po!",
    },
  },
  {
    q: { en: "Can I rent for international travel?", tl: "Pwede po bang i-rent para sa international travel?" },
    a: {
      en: "Yes! You can rent for both local and international travel.",
      tl: "Opo, pwede po for both local at international travel!",
    },
  },
  {
    q: {
      en: "Can I sign in to my personal iCloud account?",
      tl: "Pwede po ba akong mag-sign in sa sarili kong iCloud account?",
    },
    a: {
      en: "Sorry, signing in a personal iCloud account on the rental unit is not allowed.",
      tl: "Pasensya na po, hindi po pwedeng i-sign in ang personal na iCloud account sa rental unit.",
    },
  },
  {
    q: {
      en: "Can the proof of billing be under my parents' name?",
      tl: "Pwede po bang nakapangalan sa parents ko ang proof of billing?",
    },
    a: {
      en: "Yes, as long as your surname matches the surname on the proof of billing.",
      tl: "Opo, pwede po, basta po tugma ang surname ninyo sa surname ng nakapangalan sa proof of billing.",
    },
  },
  {
    q: {
      en: "Why do you need a Facebook account and proof of billing?",
      tl: "Bakit po kailangan ng Facebook account at proof of billing?",
    },
    a: {
      en: (
        <div className="space-y-3">
          <div>
            <p className={`font-semibold ${strong}`}>Facebook account</p>
            <p>
              It shows that a real person is behind the booking. That is why we don't accept dummy accounts, accounts
              without a profile picture, accounts with unclear names, or locked/private profiles.
            </p>
          </div>
          <div>
            <p className={`font-semibold ${strong}`}>Proof of billing</p>
            <p>
              It confirms your real address and surname. It must match your IDs and the Google Form, so we can be sure
              the same person is behind all the documents. Examples are an electricity, water, or internet bill.
            </p>
          </div>
        </div>
      ),
      tl: (
        <div className="space-y-3">
          <div>
            <p className={`font-semibold ${strong}`}>Facebook account</p>
            <p>
              Ipinapakita nito na totoong tao ang nasa likod ng booking. Kaya po hindi kami tumatanggap ng dummy
              accounts, accounts na walang profile picture, malabo ang pangalan, o naka-lock/private ang profile.
            </p>
          </div>
          <div>
            <p className={`font-semibold ${strong}`}>Proof of billing</p>
            <p>
              Kinukumpirma nito ang tunay ninyong address at surname. Dapat po itong tugma sa IDs at sa Google Form
              para sigurado kaming iisang tao ang nasa lahat ng dokumento. Halimbawa nito ang bill ng kuryente, tubig,
              o internet.
            </p>
          </div>
        </div>
      ),
    },
  },
  {
    q: { en: "Do you offer any discounts?", tl: "May discount po ba?" },
    a: {
      en: "Yes! You'll get a ₱200 rebate after giving us your feedback following your rental. Thank you for your support!",
      tl: "Opo! Makakakuha po kayo ng ₱200 rebate kapag nag-iwan kayo ng feedback pagkatapos ng rental ninyo. Salamat po sa suporta!",
    },
  },
  {
    q: {
      en: "What if I have questions before or during my rental?",
      tl: "Paano po kung may tanong ako bago o habang nagre-rent?",
    },
    a: {
      en: "Feel free to ask us anything before and during your rental. We're happy to help!",
      tl: "Huwag po kayong mahiyang magtanong bago at habang may rental kayo. Masaya po kaming tumulong!",
    },
  },
];

const FAQ_COPY: Record<Lang, { eyebrow: string; title: string }> = {
  en: { eyebrow: "Got Questions?", title: "Frequently Asked" },
  tl: { eyebrow: "May Tanong?", title: "Mga Madalas Itanong" },
};

function FaqSection() {
  const [lang, setLang] = useState<Lang>("en");
  const copy = FAQ_COPY[lang];
  return (
    <section id="faqs" className="py-10 md:py-20 max-w-3xl mx-auto px-5">
      <div className="mb-6 md:mb-12 text-center">
        <span className="text-xs font-semibold tracking-widest text-[#7A0000] uppercase">{copy.eyebrow}</span>
        <h2 className="text-4xl font-extrabold mt-2" style={{ fontFamily: "Manrope, sans-serif" }}>
          {copy.title}
        </h2>

        {/* Language toggle: English by default, Tagalog translation */}
        <div
          role="group"
          aria-label="FAQ language"
          className="mt-5 inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm"
        >
          {([
            ["en", "English"],
            ["tl", "Tagalog"],
          ] as const).map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                lang === code ? "bg-[#7A0000] text-white" : "text-[#6b7280] hover:text-[#1c1c1e]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <MotionAccordion items={faqs.map((f) => ({ question: f.q[lang], answer: f.a[lang] }))} />
    </section>
  );
}



function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#7A0000] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function RequirementIcon({ type }: { type: string }) {
  const common = { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24" };

  switch (type) {
    case "id":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="11" r="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 15.5c.6-1.2 1.6-1.8 2.5-1.8s1.9.6 2.5 1.8M14 9.5h4M14 12.5h4M14 15.5h2.5" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "form":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l1.5 1.5L13.5 7M9 14.5h6M9 17.5h6" />
        </svg>
      );
    case "deposit":
      return (
        <svg {...common}>
          <rect x="2.5" y="6" width="19" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 10h19M6 15h4" />
        </svg>
      );
    case "agreement":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13l1.8 1.8L15.5 10.5" />
        </svg>
      );
    case "age":
      return <span className="text-white font-extrabold text-base tracking-tight">18+</span>;
    default:
      return null;
  }
}

function useCompactTouch() {
  const query = "(max-width: 767px), (hover: none)";
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

// Scroll-linked replacement for TiltCard: the card tilts in from the bottom, flattens as it
// reaches the middle of the screen, then tilts away as it leaves at the top.
function ScrollCard({
  children,
  className,
  highlight,
}: {
  children: React.ReactNode;
  className: string;
  highlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rest = highlight ? 1.02 : 1;
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [22, 0, 0, -22]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.9, rest, rest, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.35]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={reduceMotion ? undefined : { rotateX, scale, opacity, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  );
}

function RequirementsFolder() {
  const [showAll, setShowAll] = useState(false);
  const compact = useCompactTouch();

  const folderItems = requirementGroups.map((g) => (
            <div
              key={g.label}
              className="flex h-full w-full flex-col items-center justify-center gap-1 p-1 text-center"
            >
              <div className="flex items-center gap-0.5">
                {g.icons.map((icon) => (
                  <div
                    key={icon}
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#7A0000] [&_svg]:h-2 [&_svg]:w-2 [&_span]:text-[4px] [&_span]:font-extrabold"
                  >
                    <RequirementIcon type={icon} />
                  </div>
                ))}
              </div>
              <span className="text-[7px] font-bold leading-tight text-[#1c1c1e]">{g.label}</span>
              <span className="text-[5px] text-[#6b7280]">
                {g.icons.length} {g.icons.length === 1 ? "requirement" : "requirements"}
              </span>
            </div>
          ));

  // On touch screens: the folder sits above the cards (tap it to fan out the files),
  // and each requirement card reveals itself as you scroll to it
  if (compact) {
    return (
      <div className="flex w-full flex-col items-center">
        {/* Extra mobile breathing room prevents the folder artwork from overlapping the heading. */}
        <div className="mt-6 mb-4 flex w-full items-end justify-center overflow-visible" style={{ minHeight: 290, paddingBottom: 24 }}>
          <Folder size={1.8} color="#7A0000" items={folderItems} alwaysOpen />
        </div>
      <div className="mt-2 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {requirements.map((r) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
            className="min-w-0 rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-5"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#7A0000] shadow-md shadow-[#7A0000]/20">
              <RequirementIcon type={r.icon} />
            </div>
            <div className="mb-1 text-sm font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
              {r.title}
            </div>
            <div className="text-xs leading-relaxed text-[#6b7280]">{r.desc}</div>
          </motion.div>
        ))}
      </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* One folder: hover to fan out the files, click any file to list every requirement */}
      <div className="flex items-end justify-center" style={{ height: 360, paddingBottom: 72 }}>
        <Folder
          size={2.4}
          color="#7A0000"
          onPaperClick={() => setShowAll(true)}
          items={folderItems}
        />
      </div>

      <p className="mt-2 text-xs text-[#6b7280]">
        Hover the folder, then click a file to see all requirements
      </p>

      {/* All requirements: hidden until a file is clicked, then they stay open */}
      <div
        aria-hidden={!showAll}
        className={`grid w-full transition-all duration-500 ease-out ${
          showAll ? "mt-8 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-1">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {requirements.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-[#e5e7eb] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#7A0000]/40 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#7A0000] shadow-md shadow-[#7A0000]/20">
                    <RequirementIcon type={r.icon} />
                  </div>
                  <div className="mb-1 text-sm font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {r.title}
                  </div>
                  <div className="text-xs leading-relaxed text-[#6b7280]">{r.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(false)}
                tabIndex={showAll ? 0 : -1}
                className="text-xs font-semibold text-[#7A0000] hover:underline"
              >
                Hide requirements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { label: "Browse Phones", href: "#phones" },
  { label: "Availability", href: "#availability" },
  { label: "Pricing", href: "#pricing" },
  { label: "Requirements", href: "#requirements" },
  { label: "FAQs", href: "#faqs" },
  { label: "Reviews", href: "#reviews" },
];

function HomePage() {
useSeo({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});
const [featuredIndex, setFeaturedIndex] = useState(0);
const [featuredPaused, setFeaturedPaused] = useState(false);
const [concerts] = useState<Concert[]>(() => {
  const today = getTodayISO();
  return featuredConcerts.filter((c) => {
    const date = getConcertDateISO(c);
    return date !== null && date >= today;
  });
});
const isCompact = useCompactTouch();
  
  // Auto-advance the featured concerts carousel (pauses on hover/touch)
  useEffect(() => {
    if (featuredPaused || concerts.length < 2) return;
    const timer = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % concerts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredPaused, featuredIndex, concerts.length]);


  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1c1e]">
      {/* NAV */}
      <FloatingNavbar
        logo={
          <a href="#" className="flex items-center">
            <img src={logo} alt="ParamShots - Pampanga Phone for Rent" className="h-11 w-auto md:h-12" />
          </a>
        }
        links={NAV_LINKS}
        cta={{ label: "Book Now", href: BOOKING_URL }}
      />

      {/* HERO: edit the words, photos and timing in src/heroSlides.ts */}
      <ScrollSection variant="exit">
        <HeroSection bookingUrl={BOOKING_URL} />
      </ScrollSection>

      {/* PRICING */}
      <ScrollSection variant="fade">
<section id="pricing" className="relative pt-6 pb-12 md:pt-10 md:pb-20 max-w-6xl mx-auto px-5">

          <div className="relative z-10 max-w-3xl mx-auto px-5 pt-2 pb-6 md:pt-20 md:pb-10 flex flex-col items-center text-center">
          <span className="text-xs font-semibold tracking-widest text-[#7A0000] uppercase">Transparent Rates</span>
          <h2 className="text-4xl font-extrabold mt-2" style={{ fontFamily: "Manrope, sans-serif" }}>
            <TextMorph
              words={["Simple, Honest Pricing", "Longer Rental, Better Rate", "No Hidden Fees"]}
              interval={2800}
              morphDuration={680}
            />
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {pricingPlans.map((plan) => {
            const cardClass = `rounded-2xl border px-7 py-10 md:py-12 md:min-h-[32rem] flex flex-col ${
              plan.highlight
                ? "bg-[#7A0000] border-[#7A0000] text-white shadow-xl hover:shadow-2xl"
                : "bg-white border-[#e5e7eb] hover:shadow-xl"
            }`;

            const content = (
              <>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                    Best Value
                  </span>
                )}
                <div className="mb-6">
                  <div className={`text-xs font-semibold tracking-widest uppercase mb-1 ${plan.highlight ? "text-white/70" : "text-[#7A0000]"}`}>
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-extrabold`} style={{ fontFamily: "Manrope, sans-serif" }}>{plan.price}</span>
                    <span className={`text-sm mb-1 ${plan.highlight ? "text-white/70" : "text-[#6b7280]"}`}>{plan.per}</span>
                  </div>
                  <div className={`text-sm mt-1 ${plan.highlight ? "text-white/80" : "text-[#6b7280]"}`}>{plan.duration}</div>
                </div>

                <div className="flex flex-col gap-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-white" : "text-[#7A0000]"}`}
                        fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.highlight ? "text-white/90" : "text-[#374151]"}>{f}</span>
                    </div>
                  ))}
                </div>

                <SiteButton
                  as="a"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={plan.highlight ? "light" : "primary"}
                  full
                >
                  Book Now
                </SiteButton>
              </>
            );

            // Touch screens: scroll-driven tilt. Desktop: the hover TiltCard.
            return isCompact ? (
              <ScrollCard key={plan.name} className={cardClass} highlight={plan.highlight}>
                {content}
              </ScrollCard>
            ) : (
              <TiltCard
                key={plan.name}
                rotationFactor={11}
                restScale={plan.highlight ? 1.02 : 1}
                spotlightClassName={plan.highlight ? "bg-white/10" : "bg-[#7A0000]/[0.06]"}
                className={cardClass}
              >
                {content}
              </TiltCard>
            );
          })}
        </div>

      </section>
</ScrollSection>



{/* FEATURED CONCERTS */}
<ScrollSection variant="fade">
<section className="bg-[#fafaf9] px-5 py-10 sm:px-8 md:py-16">
  <div className="mx-auto max-w-6xl">

    {/* Header */}
    <div className="mb-6 md:mb-10">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A0000]">
        Featured Events
      </span>

      <h2
        className="mt-2 text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        <TrueFocus
          sentence="Concerts Worth Capturing"
          align="start"
          blurAmount={4}
          borderColor="#7A0000"
          glowColor="rgba(122,0,0,0.5)"
          animationDuration={0.5}
          pauseBetweenAnimations={1}
          focusAllAfterCycle
        />
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-[#6b7280]">
        Heading to a concert soon? Get a flagship phone and capture every
        moment in stunning detail.
      </p>
    </div>

    {/* Portrait card carousel: centre card is larger, outlined in white, and sits on top */}
    {concerts.length > 0 ? <div
      className="relative mx-auto h-[32rem] max-w-5xl overflow-hidden min-[380px]:h-[35rem] sm:h-[37rem] md:h-[40rem]"
      style={{ perspective: "1400px" }}
      onMouseEnter={() => setFeaturedPaused(true)}
      onMouseLeave={() => setFeaturedPaused(false)}
      onTouchStart={() => setFeaturedPaused(true)}
      onTouchEnd={() => setFeaturedPaused(false)}
    >
      {concerts.map((c, i) => {
        const n = concerts.length;
        const half = Math.floor(n / 2);
        const offset = ((i - featuredIndex + n + half) % n) - half;
        const visible = Math.abs(offset) <= 1;
        const isCenter = offset === 0;

        return (
          <article
            key={c.title + c.date}
            aria-hidden={!isCenter}
            onClick={() => {
              if (!isCenter && visible) setFeaturedIndex(i);
            }}
            className={`absolute left-1/2 top-9 h-[26rem] w-[68%] overflow-hidden rounded-3xl bg-[#7A0000] text-white transition-all duration-700 ease-in-out min-[380px]:h-[29rem] sm:h-[31rem] sm:w-[42%] md:h-[34rem] md:w-[300px] ${
              isCenter
                ? "ring-4 ring-white shadow-[0_24px_40px_-18px_rgba(0,0,0,0.5)]"
                : "cursor-pointer ring-1 ring-white/40 shadow-lg"
            }`}
            style={{
              transform: `translateX(calc(-50% + ${offset * 82}%)) scale(${isCenter ? 1.1 : 0.84}) rotateY(${-offset * 22}deg)`,
              zIndex: isCenter ? 30 : visible ? 20 : 0,
              opacity: visible ? 1 : 0,
              filter: isCenter ? "none" : "brightness(0.6)",
              pointerEvents: visible ? "auto" : "none",
            }}
          >
            {/* Full-bleed portrait banner */}
            <img
              src={c.image || heroBg}
              alt={c.imageAlt || `${c.title} live at ${c.location} on ${c.date}`}
              loading={Math.abs(offset) <= 2 ? "eager" : "lazy"}
              decoding="async"
              onError={(e) => {
                // A missing or broken image falls back to the default photo instead of showing a broken icon
                const img = e.currentTarget;
                if (!img.src.endsWith(heroBg)) img.src = heroBg;
              }}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />

            {/* Gradient only covers the lower part where the text sits */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/55 via-50% to-transparent" />

            {/* Details */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col p-4 sm:p-5">
              <h3
                className="line-clamp-2 text-xl font-extrabold leading-tight drop-shadow sm:text-2xl"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {c.title}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs font-semibold text-white">
                <p className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
                  </svg>
                  <span className="line-clamp-1">{c.date}</span>
                </p>
                <p className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span className="line-clamp-2">{c.location}</span>
                </p>
              </div>

              {isCenter && (
                <>
                  {c.description && (
                    <p className="mt-3 hidden text-xs leading-5 text-white/80 sm:line-clamp-2">
                      {c.description}
                    </p>
                  )}
                  <SiteButton
                    as="a"
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="light"
                    full
                    style={{ marginTop: 16 }}
                  >
                    Reserve Your Phone
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </SiteButton>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div> : (
      <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No upcoming featured concerts at the moment. Check back soon!
      </p>
    )}

    {/* Dots */}
    {concerts.length > 1 && <div className="mt-6 flex justify-center gap-2">
      {concerts.map((_, i) => (
        <button
          key={i}
          onClick={() => setFeaturedIndex(i)}
          aria-label={`Go to concert ${i + 1}`}
          className={`h-2 rounded-full transition-all ${
            featuredIndex === i ? "w-7 bg-[#7A0000]" : "w-2 bg-[#d1d5db] hover:bg-[#9ca3af]"
          }`}
        />
      ))}
    </div>}

  </div>
</section>
</ScrollSection>


      {/* PHONES */}
      <section id="phones" className="relative z-10 py-10 md:py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-6 md:mb-12">
            <span className="text-xs font-semibold tracking-widest text-[#7A0000] uppercase">Our Devices</span>
            <h2 className="text-4xl font-extrabold mt-2" style={{ fontFamily: "Manrope, sans-serif" }}>Flagship Phones,<br />Ready to Rent</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {phones.map((phone) => (
              <div key={phone.id} className="rounded-2xl border border-[#e5e7eb] overflow-hidden bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                  <img src={phone.image} alt={`${phone.name} ${phone.storage} in ${phone.color}, available for rent in Pampanga`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-[#7A0000] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {phone.badge}
                  </span>
                </div>
                <div className="p-6">
                  <div className="mb-1">
                    <h3 className="text-xl font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>{phone.name}</h3>
                    <p className="text-sm text-[#6b7280]">{phone.storage} · {phone.color}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 my-5">
                    {phone.cameras.map((s) => (
                      <div key={s} className="text-xs text-[#4b5563] bg-[#f9fafb] rounded-lg px-3 py-2 border border-[#f3f4f6]">{s}</div>
                    ))}
                  </div>

                  <div className="mb-5 flex flex-col gap-1.5">
                    <h3 className="font-bold text-lg mb-1 text-[#7A0000]" style={{ fontFamily: "Manrope, sans-serif" }}>
              Inclusions:
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {phone.Inclusions.map((f) => (
                      <div key={f} className="flex items-start grid-cols-2 gap-2 text-sm text-[#374151]">
                        <CheckIcon />
                        <span>{f}</span>
                      </div>
                    ))}
                    </div>
                  </div>

                  <SiteButton
                    as="a"
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    full
                  >
                    Book This Phone
                  </SiteButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* AVAILABILITY — displayed on the landing page */}
      <AvailabilityCalendar bookingUrl={BOOKING_URL} />

      {/* REQUIREMENTS */}
      <section id="requirements" className="relative isolate py-10 md:py-20">
        {/* The hero's waves, as a band centered on the line between Phones and Requirements.
            It fades out at the top and bottom so it melts into the page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-[26rem] -z-10 h-[52rem]"
          style={{
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 8%, rgba(0,0,0,0.08) 15%, rgba(0,0,0,0.2) 22%, rgba(0,0,0,0.4) 29%, rgba(0,0,0,0.65) 36%, rgba(0,0,0,0.88) 43%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.88) 57%, rgba(0,0,0,0.65) 64%, rgba(0,0,0,0.4) 71%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.08) 85%, rgba(0,0,0,0.02) 92%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 8%, rgba(0,0,0,0.08) 15%, rgba(0,0,0,0.2) 22%, rgba(0,0,0,0.4) 29%, rgba(0,0,0,0.65) 36%, rgba(0,0,0,0.88) 43%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.88) 57%, rgba(0,0,0,0.65) 64%, rgba(0,0,0,0.4) 71%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.08) 85%, rgba(0,0,0,0.02) 92%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div className="absolute inset-0">
            <WebGLErrorBoundary fallback={null}>
            <GradientWaves
              horizonColor="#fafaf9"
              waveColor="#f8c9c9"
              crestColor="#c94a4a"
              speed={0.4}
              amplitude={2.5}
              waveScale={0.6}
              waveRatio={0.9}
              swell={35}
              turbulence={20}
              tilt={1.11}
              zoom={1}
              height={5.5}
              fogDepth={15}
              detail="medium"
              brightness={1}
              opacity={1}
              parallaxStrength={0.5}
              grain
              grainIntensity={0.05}
            />
            </WebGLErrorBoundary>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-5">
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-0 pt-0 pb-8 text-center sm:px-5 md:pb-10">
            <span className="text-xs font-semibold tracking-widest text-[#7A0000] uppercase">What You Need</span>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl" style={{ fontFamily: "Manrope, sans-serif" }}>Requirements</h2>
            <p className="mt-2 max-w-[28rem] text-sm leading-5 text-[#6b7280]">Please prepare the following before your rental date.</p>
          </div>

          <div className="mb-6 md:mb-12">
            <RequirementsFolder />
          </div>
</div>
 </section>


{/* HOW IT WORKS */}
<ScrollSection variant="rise">
<section
  id="how-it-works"
  className="bg-[#7A0000] px-5 py-12 sm:px-8 md:py-20"
>
  <div className="mx-auto max-w-7xl">

    {/* Header */}
    <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
        Simple Process
      </span>

      <h2
        className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        <KineticTextReveal text="How It Works" split="chars" stagger={0.045} />
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
        Follow these simple steps to rent your phone with ease.
      </p>
    </div>

    {/* Animated stepper */}
    <Stepper
      onFinalStepCompleted={() =>
        window.open(BOOKING_URL, "_blank", "noopener,noreferrer")
      }
      backButtonText="Previous"
      nextButtonText="Next"
      finalButtonText="Book Now"
    >
      {steps.map((step) => (
        <Step key={step.num}>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A0000]">
            Step {step.num}
          </span>
          <h3
            className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {step.title}
          </h3>
          <p className="mt-4 text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">{step.desc}</p>
        </Step>
      ))}
    </Stepper>

  </div>
</section>
</ScrollSection>



{/* PHOTO & VIDEO TRANSFER: "No AirDrop? No problem." */}
<TransferShowcase />

{/* REVIEWS */}
<section
  id="reviews"
  className="bg-[#fafaf9] px-5 pt-10 sm:px-8 md:pt-16"
>
  <div className="mx-auto max-w-6xl">

    {/* Header */}
    <div className="text-center">
      <span className="text-xs font-semibold uppercase tracking-widest text-[#7A0000]">
        Renter Love
      </span>

      <h2
        className="mt-4 text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        What Renters Say
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b7280] sm:text-base">
        Real experiences from people who trusted ParamShots for their next
        adventure.
      </p>
    </div>

  </div>

  {/* Scroll-driven split + flip: the image splits into cards that flip to reveal Instagram-style reviews */}
  <ReviewsScrollSplit
    reviews={reviews}
    imageSrc={heroBg}
    outro={
      <>
        Loved your rental?{" "}
        <span className="text-[#7A0000]">We’d love to hear about it.</span>
      </>
    }
  />
</section>

      {/* FAQ */}
      <ScrollSection variant="fade">
<FaqSection />
</ScrollSection>

{/* FINAL CTA */}
<ScrollSection variant="rise">
<section className="bg-[#7A0000] px-5 py-12 md:py-20">
  <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-10 md:flex-row md:gap-16">

    {/* Left - CTA Text */}
    <div className="text-center md:flex-1 md:text-left">
      <h2
        className="text-4xl font-extrabold leading-tight text-white md:text-5xl"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        Ready for Your
        <br />
        <span className="opacity-90">
          Main Character Moment?
        </span>
      </h2>

      <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">
        Don't let the perfect moment pass because you didn't have the right
        phone. Book now and capture your story in flagship quality.
      </p>
    </div>

    {/* Right - QR Code */}
    <div className="flex shrink-0 items-center gap-5 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">

      {/* QR */}
      <div className="rounded-xl bg-white p-3 shadow-lg">
        <img
          src={qrcode}
          alt="QR code linking to the ParamShots booking page. Scan it to book a phone rental"
          loading="lazy"
          decoding="async"
          className="h-32 w-32 object-contain sm:h-36 sm:w-36"
        />
      </div>

      {/* QR Text */}
      <div className="max-w-[170px] text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Ready to book?
        </span>

        <h3
          className="mt-2 text-xl font-extrabold text-white"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Scan to Book
        </h3>

        <p className="mt-2 text-sm leading-5 text-white/70">
          Scan the QR code to reserve your phone.
        </p>
      </div>

    </div>

  </div>
</section>
</ScrollSection>


      {/* FOOTER */}
      <footer className="bg-[#fafafa] text-black pt-10 md:pt-14 pb-8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={logo}
                  alt="ParamShots - Pampanga Phone for Rent"
                  className="w-32 h-auto object-contain"
                />
              </div>
              <p className="text-xs text-[#7A0000]/80 text-left leading-relaxed">Main Character Energy Starts Here.</p>
             <div className="flex gap-3 mt-4">
{/* Facebook */}
<a
  href="https://www.facebook.com/profile.php?id=61578515921428"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Facebook"
className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#7A0000] text-white shadow-md shadow-[#7A0000]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1877F2]/30"
>
  <span className="absolute inset-0 rounded-full bg-[#1877F2] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  <svg viewBox="0 0 24 24" fill="currentColor" className="relative z-10 h-5 w-5">
    <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1z" />
  </svg>
</a>

{/* TikTok */}
<a
  href="https://www.tiktok.com/@paramshots_pampanga"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="TikTok"
  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#7A0000] text-white shadow-md shadow-[#7A0000]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
>
  <span className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  <svg viewBox="0 0 24 24" fill="currentColor" className="relative z-10 h-5 w-5">
    <path d="M19.6 7.2a5.5 5.5 0 0 1-3.4-1.1v7.1a5.8 5.8 0 1 1-5-5.7v3a2.8 2.8 0 1 0 2 2.7V2h3a5.5 5.5 0 0 0 3.4 3.1v2.1z" />
  </svg>
</a>
</div>
</div>

            {/* Quick Links */}
            <div>
              <div className="text-xs font-bold tracking-widest text-black/85 uppercase mb-3">Quick Links</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Browse Phones", href: "#phones" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Photo Transfer", href: "#transfer" },
                  { label: "Reviews", href: "#reviews" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="text-sm text-black/60 hover:text-black transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Rent With Us */}
            <div>
              <div className="text-xs font-bold tracking-widest text-black/85 uppercase mb-3">Rent With Us</div>
              <div className="flex flex-col gap-2">
                <a href="#requirements" className="text-sm text-black/60 hover:text-black transition-colors">Requirements</a>
                <a href="#faqs" className="text-sm text-black/60 hover:text-black transition-colors">FAQs</a>
                <Link to="/privacy-policy" className="text-sm text-black/60 hover:text-black transition-colors">Privacy Policy</Link>
                <Link to="/transfer" className="text-sm text-black/60 hover:text-black transition-colors">Transfer Photos &amp; Videos</Link>
                <Link to="/terms-and-conditions" className="text-sm text-black/60 hover:text-black transition-colors">Terms &amp; Conditions</Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold tracking-widest text-black/85 uppercase mb-3">Contact</div>
              <div className="flex flex-col gap-2 text-sm text-black/85">
                
                <span>Phone: 09495902393</span>
                <span>Email: paramshots@gmail.com</span>
                <span>Pampanga, Philippines</span>
                <SiteButton
                  as="a"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                  style={{ marginTop: 8, width: "fit-content" }}
                >
                  Book Now
                </SiteButton>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-black/60">© {new Date().getFullYear()} ParamShots. All rights reserved.</p>
            <p className="text-xs text-black/60">Kapampangan-First Phone Rental Service</p>
          </div>
        </div>
      </footer>
      {/* MESSENGER SUPPORT BUTTON */}
<MessengerButton />
    </div>
  );
}

// ---------- PHOTO & VIDEO TRANSFER PAGE (powered by Floe, https://floe.one) ----------
const FLOE_URL = "https://floe.one";
const MESSENGER_URL = "https://www.facebook.com/profile.php?id=61578515921428";

const transferSteps = [
  {
    num: "01",
    title: "Open this page on the rental phone",
    desc: "Stay on the Send tab. No account, no sign-in, and no app to install.",
  },
  {
    num: "02",
    title: "Select your photos and videos",
    desc: "Choose the files to keep, then tap “Create transfer code”. You get a code and a QR code.",
  },
  {
    num: "03",
    title: "Open this page on your own device",
    desc: "Tap Receive and enter the code, or scan the QR code. Then approve the connection on the rental phone.",
  },
  {
    num: "04",
    title: "Keep both screens on",
    desc: "Wait until both sides say Done, then save the files and check that they open before you return the phone.",
  },
];

const securityFeatures = [
  {
    icon: "lock",
    title: "End-to-end encrypted",
    desc: "Files travel straight between the two devices over an encrypted connection. Nobody in between can read them.",
  },
  {
    icon: "server",
    title: "Nothing stored in the cloud",
    desc: "No uploads and no file storage. Your photos and videos are never saved on a server.",
  },
  {
    icon: "user",
    title: "You approve every connection",
    desc: "The rental phone asks before anything is sent, and only one device can connect per code.",
  },
  {
    icon: "clock",
    title: "Short-lived codes",
    desc: "Each code expires after 10 minutes. The code in a share link stays out of our web server logs.",
  },
];

const safetyTips = [
  "Transfer everything before your return time. A late fee of ₱200 per hour applies, so leave yourself extra time for big videos.",
  "Check that the files opened on your own device before you delete anything.",
  "Only enter codes that you created yourself on the rental phone. Never share your code or link with anyone else.",
  "Keep both devices on Wi-Fi, with the screen awake and this page open, until both sides say Done.",
  "After saving, delete your photos and videos from the rental phone, including the Recently Deleted album, so the next renter cannot see them.",
  "Never sign in to your personal iCloud or other accounts on the rental phone. Sign out of anything you used.",
];

function TransferIcon({ type }: { type: string }) {
  const common = {
    className: "h-6 w-6 text-white",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "server":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="7" rx="2" />
          <rect x="3" y="13" width="18" height="7" rx="2" />
          <path d="M7 7.5h.01M7 16.5h.01M3 3l18 18" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
}

function TransferPage() {
  useSeo({
    title: "Photo & Video Transfer | ParamShots",
    description:
      "Move photos and videos from your ParamShots rental phone to your own device privately, device to device. Free, no account needed and nothing is uploaded to the cloud.",
    path: "/transfer",
  });
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1c1e]">
      {/* Top bar */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/">
            <img src={logo} alt="ParamShots - Pampanga Phone for Rent" className="h-10 w-auto md:h-12" />
          </Link>
          <Link to="/" className="text-sm font-semibold text-[#7A0000] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-12 pt-12 text-center md:pb-20 md:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#7A0000]/10 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A0000]">
            Photo &amp; Video Transfer
          </span>
          <h1
            className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Take your memories <span className="text-[#7A0000]">with you</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b7280] sm:text-base">
            Shot something amazing on the rental phone? Move your photos and videos to your own device privately,
            before you return it. Nothing is uploaded to the cloud.
          </p>

          <div className="mt-8">
            <FileTransfer />
          </div>
          <p className="mt-5 text-xs text-[#6b7280]">
            Free · No account needed ·{" "}
            <a href="#how-to-send" className="font-semibold text-[#7A0000] hover:underline">
              How it works
            </a>
          </p>
        </div>
      </section>

      {/* Steps */}
      <section id="how-to-send" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-10 md:py-16">
        <div className="mb-8 text-center md:mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A0000]">Simple Steps</span>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl" style={{ fontFamily: "Manrope, sans-serif" }}>
            How to transfer your files
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {transferSteps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-[#e5e7eb] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#7A0000]/40 hover:shadow-lg"
            >
              <div
                className="text-4xl font-extrabold text-[#7A0000]/20"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {s.num}
              </div>
              <h3 className="mt-2 text-base font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{s.desc}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-[#6b7280]">
          Both devices must stay online with the screen on during the transfer. The receiving device holds the files in
          memory while they arrive, so very large videos work best on a computer, or send them in smaller batches.
        </p>
      </section>

      {/* Security */}
      <section id="security" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-10 md:py-16">
        <div className="mb-8 text-center md:mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A0000]">Your Privacy</span>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl" style={{ fontFamily: "Manrope, sans-serif" }}>
            Why it is safe
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#7A0000] shadow-md shadow-[#7A0000]/20">
                <TransferIcon type={f.icon} />
              </div>
              <h3 className="text-base font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety checklist */}
      <section className="bg-[#7A0000] px-5 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Before You Return</span>
            <h2
              className="mt-2 text-3xl font-extrabold text-white sm:text-4xl"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Stay safe and on time
            </h2>
          </div>

          <ul className="space-y-3">
            {safetyTips.map((tip) => (
              <li key={tip} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm leading-relaxed text-white/90">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Privacy note + third-party disclosure */}
      <section className="mx-auto max-w-3xl px-5 py-10 md:py-16">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-extrabold" style={{ fontFamily: "Manrope, sans-serif" }}>
            Your photos stay yours
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#374151]">
            Files in this transfer go from the rental phone to your device. ParamShots does not receive them. See our{" "}
            <Link to="/privacy-policy" className="font-semibold text-[#7A0000] underline underline-offset-2">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/terms-and-conditions" className="font-semibold text-[#7A0000] underline underline-offset-2">
              Terms &amp; Conditions
            </Link>{" "}
            for details.
          </p>

          <h3 className="mt-6 text-sm font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
            How it works behind the scenes
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
            This transfer runs in your browser using WebRTC, the same technology behind video calls. A free public
            service (PeerJS) introduces the two devices. It sees the transfer code and the devices' IP addresses, but
            never your files. If your network blocks a direct connection, files may pass through an encrypted relay that
            cannot read them. The idea is inspired by the open-source{" "}
            <a
              href={FLOE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#7A0000] underline underline-offset-2"
            >
              Floe
            </a>{" "}
            project.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-14 text-center md:pb-20">
        <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ fontFamily: "Manrope, sans-serif" }}>
          Need help with your transfer?
        </h2>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-[#7A0000]/30 bg-white px-7 py-3.5 text-sm font-semibold text-[#7A0000] transition-colors hover:bg-[#7A0000]/5"
          >
            Message Us on Facebook
          </a>
        </div>
      </section>

      <footer className="border-t border-black/5 py-6 text-center text-xs text-black/60">
        © {new Date().getFullYear()} ParamShots. All rights reserved.
      </footer>
    </div>
  );
}

function NotFoundPage() {
  useSeo({
    title: "Page not found | ParamShots",
    description: "This page could not be found. Head back to ParamShots to rent a flagship phone in Pampanga.",
    path: typeof window === "undefined" ? "/" : window.location.pathname,
    noindex: true,
  });
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafaf9] px-5 text-center text-[#1c1c1e]">
      {/* Soft maroon glow behind the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7A0000]/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center">
        <Link to="/">
          <img src={logo} alt="ParamShots - Pampanga Phone for Rent" className="h-14 w-auto md:h-16" />
        </Link>

        <span className="mt-10 text-xs font-semibold uppercase tracking-widest text-[#7A0000]">
          Error 404
        </span>

        <h1
          className="mt-2 text-8xl font-extrabold leading-none tracking-tight text-[#7A0000] sm:text-9xl"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          404
        </h1>

        <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl" style={{ fontFamily: "Manrope, sans-serif" }}>
          Oops, this page wandered off.
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#6b7280] sm:text-base">
          The page you're looking for doesn't exist or may have been moved. Let's get you back to renting your next
          flagship phone.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <SiteButton as={Link} to="/" variant="primary">
            Back to Home
          </SiteButton>
          <SiteButton as="a" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="outline">
            Book Now
          </SiteButton>
        </div>

        <div className="mt-8 flex gap-5 text-sm text-[#6b7280]">
          <Link to="/privacy-policy" className="hover:text-[#1c1c1e]">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-[#1c1c1e]">Terms &amp; Conditions</Link>
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/transfer" element={<TransferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
