export default function InfoPage({ eyebrow, title, intro, sections }) {
  return (
    <>
      <section className="page-section inner-hero cream">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="section-lead">{intro}</p>
      </section>

      <section className="page-section policy-grid">
        {sections.map((section) => (
          <article className="story-card" key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
      </section>
    </>
  );
}
