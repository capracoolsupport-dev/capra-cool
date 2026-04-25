import { useOutletContext } from "react-router-dom";
import Icon from "../components/Icons.jsx";
import StorefrontErrorState from "../components/StorefrontErrorState.jsx";

export default function AboutPage() {
  const { data, storefrontState } = useOutletContext();

  if (!data) {
    if (storefrontState.status === "error") {
      return <StorefrontErrorState title="The brand story is temporarily unavailable." />;
    }

    return (
      <section className="page-section">
        <div className="loading-card">Loading brand story...</div>
      </section>
    );
  }

  return (
    <>
      <section className="page-section inner-hero cream">
        <p className="eyebrow">Our story</p>
        <h1>{data.settings.aboutTitle}</h1>
        <p className="section-lead">{data.settings.aboutIntro}</p>
      </section>

      <section className="page-section two-column">
        <article className="story-card">
          <h2>Crafted with care</h2>
          <p>{data.settings.aboutStory}</p>
          <p>
            As the collection grows, the same calm, premium feeling stays consistent across every product and section.
          </p>
        </article>

        <article className="story-card">
          <h2>Quality promise</h2>
          <p>{data.settings.qualityPromise}</p>
          <div className="story-feature-list">
            {data.trustBadges.map((badge) => (
              <div className="story-feature" key={badge.id}>
                <span className="trust-icon">
                  <Icon name={badge.iconName} />
                </span>
                <div>
                  <strong>{badge.title}</strong>
                  <p>{badge.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
