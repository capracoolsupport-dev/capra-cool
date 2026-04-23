import Icon from "./Icons.jsx";

export default function RatingStars({ rating, reviewCount, compact = false }) {
  return (
    <div
      className={`rating-row ${compact ? "is-compact" : ""}`}
      aria-label={`Rated ${rating} out of 5`}
    >
      <div className="rating-stars">
        {new Array(5).fill(null).map((_, index) => (
          <span className="rating-star" key={`${rating}-${index}`}>
            <Icon name="star" />
          </span>
        ))}
      </div>
      <span className="rating-text">
        {Number(rating).toFixed(1)}
        {reviewCount ? ` (${reviewCount} reviews)` : ""}
      </span>
    </div>
  );
}
