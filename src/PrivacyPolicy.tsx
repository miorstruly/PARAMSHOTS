import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import { useSeo } from "./seo";

const collected = [
  ["Renter details", "Name, address, contact number, and the link to your active personal Facebook account. Dummy, private, locked or unclear accounts are not accepted."],
  ["Emergency contact (family member)", "Their name, phone number and Facebook account, plus a screenshot of your Messenger conversation with them as proof. We use this person only as an emergency or backup contact."],
  ["Verification", "Two IDs, at least one government-issued; a selfie holding your government ID; and a proof of billing (such as an electric, water or internet bill) showing your surname and address, which must match your IDs and your rental form."],
  ["Age", "We rent only to people aged 18 and over, so we check your date of birth on your ID."],
  ["Rental records", "Phone model, IMEI or serial number, rental dates, condition at handover and return, signed agreement, the list of apps you need during your rental, damage or late return records."],
  ["Payment", "Payment confirmations and reference numbers from GCash, Maya or bank transfer, and records of your refundable security deposit (P2,000) and its return."],
  ["Messages", "Chats, calls and texts with us about your rental, including messages you send us on Messenger."],
  ["Location", "The rented phone's location during the rental period only (see section 6)."],
];

const retention = [
  ["Rental agreements and payment records", "3 years, for tax, accounting and dispute purposes"],
  ["IDs, selfie with ID, proof of billing and Messenger screenshot (all documents you submit for verification)", "7 days after your rental dates end, if there is no issue when the phone is returned"],
  ["Emergency contact details", "7 days after your rental dates end, if there is no issue when the phone is returned"],
  ["Chats and messages about your rental", "1 year"],
  ["Location data", "Only during the rental period, then deleted"],
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 border-t border-[#e5e7eb] pt-8">
      <h2 className="text-xl font-extrabold text-[#111827]" style={{ fontFamily: "Manrope, sans-serif" }}>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-[#374151]">{children}</div>
    </section>
  );
}

function Table({ head, rows }: { head: [string, string]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <td className="border border-[#e5e7eb] px-3 py-2 align-top font-medium">{a}</td>
              <td className="border border-[#e5e7eb] px-3 py-2 align-top">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}

export default function PrivacyPolicy() {
  useSeo({
    title: "Privacy Policy | ParamShots",
    description:
      "How ParamShots collects, uses, shares and protects your personal information when you rent a phone, in line with the Philippine Data Privacy Act.",
    path: "/privacy-policy",
  });
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1c1e]">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/"><img src={logo} alt="ParamShots" className="h-14 w-auto" /></Link>
          <Link to="/" className="text-sm font-semibold text-[#7A0000] hover:underline">Back to home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-4xl font-extrabold" style={{ fontFamily: "Manrope, sans-serif" }}>Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#6b7280]">ParamShots · Effective date: March 25, 2026 · Last updated: October 24, 2026</p>

        <Section id="who" title="1. Who we are">
          <p>ParamShots ("we", "us") rents mobile phones to individuals from our location in Guagua, Pampanga, Philippines. We are responsible for the personal information described in this policy, which we handle in line with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).</p>
          <p>Contact for privacy matters: Charito Amio (Business Owner), paramshots@gmail.com, 0906 548 4327, Guagua, Pampanga.</p>
        </Section>

        <Section id="collect" title="2. Information we collect">
          <Table head={["Category", "What we collect"]} rows={collected} />
          <p>We collect most of this directly from you, through our rental form (Google Forms) and by message. We also receive payment confirmations from the payment provider or bank you used.</p>
          <p><strong>Family member information:</strong> by giving us a family member's details and a screenshot of your conversation with them, you confirm you have told them and that they are fine with us contacting them if we cannot reach you about the rental.</p>
        </Section>

        <Section id="use" title="3. How we use it">
          <List items={[
            "To confirm your identity and process your rental",
            "To receive payments, and hold and refund deposits",
            "To track, collect and recover rented phones",
            "To contact you, or your family member if we cannot reach you, about the rental",
            "To handle damage, loss, theft and overdue returns",
            "To answer your questions and give support",
            "To prevent fraud and meet legal, tax and accounting requirements",
          ]} />
          <p>We do not sell your personal information. We do not use it for marketing unless you agree.</p>
        </Section>

        <Section id="basis" title="4. Why we may use your information">
          <p>Under the Data Privacy Act, we process your information because it is needed to carry out our rental agreement with you, to comply with legal obligations, for our legitimate interests (protecting our phones and preventing fraud), and, where required, with your consent. You can withdraw your consent at any time, but this may mean we can no longer rent to you.</p>
        </Section>

        <Section id="share" title="5. Who we share it with">
          <p>We share only what is needed, and only with:</p>
          <List items={[
            "Google, which hosts the rental form where you submit your details, under its own privacy policy",
            "Payment services you choose to pay with (GCash, Maya or your bank), who process your payment under their own privacy policies",
            "Apple, whose Find My service we use to locate rented phones, under Apple's own privacy policy",
            "The services that host and deliver our website",
            "Police, courts and government agencies, when the law requires it or to report theft or fraud",
            "Our accountant or legal adviser, when needed",
          ]} />
          <p>If a service we use stores data outside the Philippines, we require it to protect that data to a standard comparable to Philippine law.</p>
        </Section>

        <Section id="device" title="6. Rented phones and tracking">
          <p>Every rented phone can be tracked using Apple Find My. Throughout your rental period, the phone's location is tracked for the owner's security, to protect the phone and to recover it if it is not returned. By renting, you agree to this tracking. We collect location only during your rental period, and tracking stops once the phone is returned and checked in.</p>
          <p>Please do not store sensitive information on a rented phone. Signing in to iCloud is not allowed; only social media and email accounts may be used. You are responsible for signing out of all your accounts before returning the phone, and we recommend changing your passwords afterwards for extra safety. After each rental, we delete the photos and videos left on the phone.</p>
          <p>We do not look through personal content left on a returned phone, except where needed to investigate theft, fraud or illegal use.</p>
        </Section>

        <Section id="retention" title="7. How long we keep it">
          <Table head={["Record", "Kept for"]} rows={retention} />
          <p>If there is an issue when the phone is returned (such as damage or loss), an unresolved dispute, an unpaid balance, or an unreturned phone, we keep the related records until it is settled. Afterward we securely delete them or destroy paper copies.</p>
        </Section>

        <Section id="security" title="8. Security">
          <p>We limit access to your information to people who need it, keep paper records and ID copies locked away, protect our accounts and phones with passwords, and delete records when they are no longer needed. If a breach seriously affects your information, we will notify you and the National Privacy Commission within the time the law requires (currently 72 hours of knowing about it).</p>
        </Section>

        <Section id="rights" title="9. Your rights">
          <p>Under the Data Privacy Act, you have the right to be informed about how we use your information, to access it, to correct it, to object to its use, to ask us to delete or block it, to receive a copy in a common format, to claim compensation for damages from misuse, and to file a complaint.</p>
          <p>To use any of these rights, email paramshots@gmail.com. We will reply as soon as possible and within 30 days. We may ask you to verify your identity first, and we may need to keep some records where the law requires.</p>
        </Section>

        <Section id="cookies" title="10. Website and cookies">
          <p>Our website uses only essential cookies and storage needed for it to work. We do not use analytics or advertising cookies. If that changes, we will update this policy and ask for your consent first.</p>
          <p>Our Facebook page and Messenger are run by Meta, and our TikTok page is run by TikTok. They use their own cookies under their own privacy policies.</p>
        </Section>

        <Section id="children" title="11. Age limit">
          <p>We rent phones only to people aged 18 and over. We do not knowingly collect information from minors. If you believe we have, contact us and we will delete it.</p>
        </Section>

        <Section id="changes" title="12. Changes to this policy">
          <p>We will post updates on this page with a new "last updated" date, and tell you directly if the changes are significant.</p>
        </Section>

        <Section id="contact" title="13. Contact us">
          <p>ParamShots<br />Guagua, Pampanga, Philippines<br />paramshots@gmail.com · 0949 590 2393</p>
          <p>If you are unhappy with how we handled your information, you can first contact us. You also have the right to complain to the{" "}
            <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#7A0000] underline">National Privacy Commission</a>{" "}
            of the Philippines.
          </p>
        </Section>
      </main>
    </div>
  );
}
