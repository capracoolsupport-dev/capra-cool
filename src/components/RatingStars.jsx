import Icon from "./Icons.jsx";

export default function RatingStars({ rating, reviewCount, compact = false }) {
  const numRating = Number(rating) || 0;

  return (
    <div
      className={`rating-row ${compact ? "is-compact" : ""}`}
      aria-label={`Rated ${numRating.toFixed(1)} out of 5`}
    >
      <div className="rating-stars">
        {new Array(5).fill(null).map((_, index) => (
          <span className="rating-star" key={`star-${index}`}>
            <Icon name={index < Math.round(numRating) ? "star-filled" : "star"} />
          </span>
        ))}
      </div>
      <span className="rating-text">
        {numRating.toFixed(1)}
        {reviewCount ? ` (${reviewCount} reviews)` : ""}
      </span>
    </div>
  );
}
