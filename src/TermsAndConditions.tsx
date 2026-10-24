import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import { useSeo } from "./seo";

const LAST_UPDATED = "October 15, 2026";

type Section = { title: string; items: string[] };

const SECTIONS: Section[] = [
  {
    title: "Eligibility & Verification",
    items: [
      "Renters must be at least 18 years old.",
      "You must submit two (2) valid IDs (at least one government-issued) and a selfie holding your government ID.",
      "You must have an active, personal Facebook account. Dummy accounts, accounts without a profile picture, accounts with ambiguous names, and locked or private profiles are not accepted.",
      "A proof of billing is required. The surname and address on it must match your IDs and the details on the Google Form.",
      "You must provide an emergency contact (a family member's phone number and Facebook account), together with a screenshot of your Messenger conversation with them.",
      "ParamShots may decline or cancel any application that cannot be verified.",
    ],
  },
  {
    title: "Booking, Payment & Security Deposit",
    items: [
      "To reserve a slot, a 50% down payment (DP) is required. The DP is non-refundable.",
      "Your booking is confirmed only once you receive our official booking confirmation and your down payment receipt.",
      "A ₱2,000 refundable security deposit is required. It is returned in full after the unit and all accessories have been returned safely and in their original condition.",
      "Rental rates follow the plan that applies to your rental length, as shown in the Pricing section of our website.",
    ],
  },
  {
    title: "Pick-up & Return",
    items: [
      "Pick-up and return take place at the location and time agreed with ParamShots.",
      "A signed rental agreement is required upon meet-up.",
      "The unit and all accessories must be returned safely and on schedule. If you need more time, message us before your rental ends so we can check availability, since other clients may have scheduled rentals.",
    ],
  },
  {
    title: "Your Files & Data",
    items: [
      "Please make sure you have copied all of your photos, videos and other files before returning the unit.",
      "We are not liable for any files that are lost or corrupted.",
      "If you forget to copy your files and ask us to provide them later, we cannot guarantee that we will be able to, because the unit may already be booked by another renter.",
      "All documents you submit will be deleted 7 days after your rental dates, as long as there is no issue when the device is returned. See our Privacy Policy for details.",
    ],
  },
  {
    title: "Responsibility, Loss & Damage",
    items: [
      "You are responsible for the unit and all accessories from the moment you take physical possession of them.",
      "You are fully responsible for any loss or damage, small or substantial, found after you received the device. This includes dents, scratches and stains.",
      "In the event of damage, the renter is responsible for the full cost of repairs, as determined by the owner.",
      "Water damage is excluded from the damage provision above because separate rules apply (see the next point).",
      "In the event of loss or water damage, the renter must pay the full cost of the gadget plus an inconvenience fee. This is required because we cannot accommodate other clients without replacing the unit.",
    ],
  },
  {
    title: "Care & Use of the Device",
    items: [
      "Use the device lawfully and with care. Do not lend, sublease or hand the unit over to anyone else.",
      "Do not reset, modify, jailbreak, or remove or lock any accounts or settings on the device.",
    ],
  },
  {
    title: "Accounts, Apps & Location Tracking",
    items: [
      "Signing in to iCloud on the device is not allowed. Only social media accounts and email accounts may be used.",
      "You are responsible for signing out of all your accounts when you return the phone. We recommend changing your passwords afterwards for extra safety.",
      "Please give us a list of the apps you will need during your rental period. You will not be able to install or remove apps once the phone is with you. This prevents renters from downloading harmful apps or removing apps.",
      "During your rental period, the phone's location is tracked for the owner's security.",
    ],
  },
];

export default function TermsAndConditions() {
  useSeo({
    title: "Terms & Conditions | ParamShots",
    description:
      "Read the ParamShots phone rental terms: eligibility and verification, booking, payment and security deposit, pick-up and return, loss and damage, and location tracking.",
    path: "/terms-and-conditions",
  });
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1c1e]">
      {/* Top bar */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to="/" aria-label="ParamShots home">
            <img src={logo} alt="ParamShots" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-[#7A0000] transition-colors hover:text-[#5a0000]"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 md:py-16">
        <div className="mb-8 text-center md:mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A0000]">Legal</span>
          <h1
            className="mt-2 text-4xl font-extrabold md:text-5xl"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Terms &amp; Conditions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b7280]">
            Please read these terms carefully before renting from ParamShots. By submitting a booking, you agree to
            everything below.
          </p>
          <p className="mt-2 text-xs text-[#9ca3af]">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-5">
          {SECTIONS.map((section, i) => (
            <section
              key={section.title}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] md:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7A0000] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h2 className="text-lg font-extrabold md:text-xl" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#4b5563]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7A0000]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Acknowledgement */}
          <section className="rounded-2xl bg-[#7A0000] p-6 text-white shadow-[0_18px_40px_-18px_rgba(122,0,0,0.7)] md:p-8">
            <h2 className="text-lg font-extrabold md:text-xl" style={{ fontFamily: "Manrope, sans-serif" }}>
              Please read and confirm
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/85">
              Please take the time to read these terms. No one can be excused for not understanding them. To make sure
              we are on the same page, reply to us with{" "}
              <strong className="text-white">&ldquo;I have read and understood&rdquo;</strong>.
            </p>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-[#9ca3af]">
          Questions? Email{" "}
          <a href="mailto:paramshots@gmail.com" className="font-semibold text-[#7A0000] hover:underline">
            paramshots@gmail.com
          </a>{" "}
          or message us on Messenger.
        </p>
      </main>
    </div>
  );
}
