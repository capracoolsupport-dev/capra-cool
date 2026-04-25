import InfoPage from "../components/InfoPage.jsx";

const sections = [
  {
    title: "Returns and exchanges",
    body: [
      "If an item arrives damaged or clearly incorrect, customers should contact support as soon as possible with order details and product photos.",
      "Because many products are handmade and made in limited runs, return and exchange eligibility is reviewed case by case."
    ]
  },
  {
    title: "Custom orders",
    body: [
      "Custom-made orders are generally non-returnable once the design has been approved and work has started.",
      "If there is a quality issue with a custom order, support will help review the request and find a fair resolution."
    ]
  }
];

export default function ReturnPolicyPage() {
  return (
    <InfoPage
      eyebrow="Return Policy"
      title="Fair support for handmade purchases."
      intro="We want returns and issue resolution to feel clear, practical, and respectful of the handmade nature of each order."
      sections={sections}
    />
  );
}
