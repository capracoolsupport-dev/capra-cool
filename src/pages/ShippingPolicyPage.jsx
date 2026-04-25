import InfoPage from "../components/InfoPage.jsx";

const sections = [
  {
    title: "Order processing",
    body: [
      "Every order is reviewed and prepared with care before dispatch. Handmade pieces may need a little extra preparation time during busy periods or for custom requests.",
      "Customers are contacted directly if there is any meaningful delay before shipment."
    ]
  },
  {
    title: "Delivery timeline",
    body: [
      "Standard delivery usually takes around 3 to 7 business days depending on destination and courier serviceability.",
      "Tracking details are shared once the shipment is packed and handed over to the delivery partner."
    ]
  }
];

export default function ShippingPolicyPage() {
  return (
    <InfoPage
      eyebrow="Shipping Policy"
      title="Shipping that stays clear and mobile-friendly."
      intro="We keep shipping expectations simple so customers know when their handmade order is moving and when to expect it."
      sections={sections}
    />
  );
}
