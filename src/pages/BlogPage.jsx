import Button from "../components/Button.jsx";
import InfoPage from "../components/InfoPage.jsx";

const sections = [
  {
    title: "Fresh updates from the studio",
    body: [
      "New product drops, custom order highlights, and behind-the-scenes crochet details are shared regularly through our social updates.",
      "This blog section will keep growing with styling notes, gifting ideas, and care tips that make handmade shopping feel even more personal."
    ]
  },
  {
    title: "Follow the latest posts",
    body: [
      "For day-to-day updates, the Instagram page is the fastest place to see new arrivals and custom work in progress."
    ]
  }
];

export default function BlogPage() {
  return (
    <>
      <InfoPage
        eyebrow="Blog"
        title="Stories, styling ideas, and handmade updates."
        intro="A simple place for collection updates, gifting inspiration, and the small details behind each crochet piece."
        sections={sections}
      />

      <section className="page-section compact-cta-row">
        <Button
          href="https://www.instagram.com/muskan_crochet_?igsh=MWk1eWdvYTR6NDR5"
          rel="noreferrer"
          target="_blank"
        >
          Follow @muskan_crochet_
        </Button>
      </section>
    </>
  );
}
