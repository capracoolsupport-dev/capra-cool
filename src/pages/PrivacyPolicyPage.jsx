import InfoPage from "../components/InfoPage.jsx";

const sections = [
  {
    title: "Information we collect",
    body: [
      "Basic customer details such as name, email, phone number, shipping address, and order information are collected to process purchases, custom requests, and support messages.",
      "Payment processing is handled through the configured payment provider and is not stored in plain form inside the storefront."
    ]
  },
  {
    title: "How information is used",
    body: [
      "Customer information is used to fulfill orders, respond to questions, share order updates, and improve the shopping experience.",
      "We do not sell personal information. Data is only used for operating and supporting the store."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="Privacy Policy"
      title="Clear privacy expectations for every order."
      intro="This store only uses customer information for order fulfillment, support, and basic store operations."
      sections={sections}
    />
  );
}
