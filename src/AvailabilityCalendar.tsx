import { CALENDAR_EMBED_URL } from "./config";
import SiteButton from "./SiteButton";

/**
 * Landing-page availability section.
 * Shows the public Google Calendar when VITE_GOOGLE_CALENDAR_EMBED_URL is configured;
 * otherwise displays a helpful setup message instead of hiding the section.
 */
export default function AvailabilityCalendar({ bookingUrl }: { bookingUrl: string }) {
  return (
    <section id="availability" aria-labelledby="availability-heading" className="relative z-10 mx-auto max-w-5xl px-5 py-12 md:py-20">
      <div className="mb-6 text-center md:mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7A0000]">Check Dates</span>
        <h2 id="availability-heading" className="mt-2 text-4xl font-extrabold" style={{ fontFamily: "Manrope, sans-serif" }}>
          Availability
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6b7280]">
          Check the calendar for dates that may already be booked. Availability is confirmed by ParamShots before your booking is finalized.
        </p>
      </div>

      {CALENDAR_EMBED_URL ? (
        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <iframe
            src={CALENDAR_EMBED_URL}
            title="ParamShots booking availability calendar"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="block h-[520px] w-full border-0 sm:h-[600px]"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-base font-semibold text-[#1c1c1e]">Calendar coming soon</p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6b7280]">
            Please message us to confirm your preferred dates while the online calendar is being set up.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <SiteButton as="a" href={bookingUrl} target="_blank" rel="noopener noreferrer" variant="primary">
          Book Your Dates
        </SiteButton>
      </div>
    </section>
  );
}
