import InfoPage from "../components/InfoPage.jsx";

const sections = [
  {
    title: "How long does delivery take?",
    body: [
      "Most orders arrive within 3 to 7 business days, depending on delivery location and courier speed."
    ]
  },
  {
    title: "Can I place a custom order?",
    body: [
      "Yes. The custom order page lets customers share product type, requirements, and optional reference images for handmade requests."
    ]
  },
  {
    title: "How can I contact support?",
    body: [
      "Support is available by email at trendyspicestore@gmail.com and by phone at 7067491668 during the listed support window."
    ]
  }
];

export default function FaqPage() {
  return (
    <InfoPage
      eyebrow="FAQ"
      title="Helpful answers before checkout."
      intro="These are the quick answers most customers need when browsing on mobile and placing an order."
      sections={sections}
    />
  );
}
