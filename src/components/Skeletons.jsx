function SkeletonBlock({ className = "" }) {
  return <div aria-hidden="true" className={`skeleton-block ${className}`.trim()} />;
}

export function HomePageSkeleton() {
  return (
    <section className="page-section skeleton-home">
      <div className="skeleton-card skeleton-hero-card">
        <div className="skeleton-stack">
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
          <SkeletonBlock className="skeleton-line skeleton-line-title" />
          <SkeletonBlock className="skeleton-line skeleton-line-medium" />
          <SkeletonBlock className="skeleton-button" />
        </div>
        <SkeletonBlock className="skeleton-visual" />
      </div>

      <div className="skeleton-grid">
        <div className="skeleton-card skeleton-product-card">
          <SkeletonBlock className="skeleton-product-image" />
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
          <SkeletonBlock className="skeleton-line skeleton-line-medium" />
        </div>
        <div className="skeleton-card skeleton-product-card">
          <SkeletonBlock className="skeleton-product-image" />
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
          <SkeletonBlock className="skeleton-line skeleton-line-medium" />
        </div>
        <div className="skeleton-card skeleton-product-card">
          <SkeletonBlock className="skeleton-product-image" />
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
          <SkeletonBlock className="skeleton-line skeleton-line-medium" />
        </div>
      </div>
    </section>
  );
}

export function ProductPageSkeleton() {
  return (
    <section className="page-section skeleton-detail">
      <SkeletonBlock className="skeleton-line skeleton-line-short" />
      <div className="skeleton-detail-layout">
        <div className="skeleton-card">
          <SkeletonBlock className="skeleton-detail-image" />
          <div className="skeleton-grid skeleton-thumb-grid">
            <SkeletonBlock className="skeleton-thumb" />
            <SkeletonBlock className="skeleton-thumb" />
            <SkeletonBlock className="skeleton-thumb" />
          </div>
        </div>
        <div className="skeleton-card skeleton-stack">
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
          <SkeletonBlock className="skeleton-line skeleton-line-title" />
          <SkeletonBlock className="skeleton-line skeleton-line-medium" />
          <SkeletonBlock className="skeleton-line skeleton-line-medium" />
          <SkeletonBlock className="skeleton-button" />
        </div>
      </div>
    </section>
  );
}

export function FormPageSkeleton() {
  return (
    <section className="page-section skeleton-form-page">
      <div className="skeleton-stack">
        <SkeletonBlock className="skeleton-line skeleton-line-short" />
        <SkeletonBlock className="skeleton-line skeleton-line-title" />
        <SkeletonBlock className="skeleton-line skeleton-line-medium" />
      </div>
      <div className="skeleton-card skeleton-form-card">
        <SkeletonBlock className="skeleton-input" />
        <SkeletonBlock className="skeleton-input" />
        <SkeletonBlock className="skeleton-textarea" />
        <SkeletonBlock className="skeleton-button" />
      </div>
    </section>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <section className="page-section skeleton-checkout">
      <div className="skeleton-stack">
        <SkeletonBlock className="skeleton-line skeleton-line-short" />
        <SkeletonBlock className="skeleton-line skeleton-line-title" />
      </div>
      <div className="skeleton-detail-layout">
        <div className="skeleton-card skeleton-form-card">
          <SkeletonBlock className="skeleton-line skeleton-line-medium" />
          <SkeletonBlock className="skeleton-textarea" />
        </div>
        <div className="skeleton-card skeleton-form-card">
          <SkeletonBlock className="skeleton-input" />
          <SkeletonBlock className="skeleton-input" />
          <SkeletonBlock className="skeleton-button" />
        </div>
      </div>
    </section>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="skeleton-admin">
      <div className="skeleton-card skeleton-form-card">
        <SkeletonBlock className="skeleton-line skeleton-line-short" />
        <SkeletonBlock className="skeleton-line skeleton-line-title" />
        <SkeletonBlock className="skeleton-line skeleton-line-medium" />
      </div>
      <div className="skeleton-grid">
        <div className="skeleton-card">
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
          <SkeletonBlock className="skeleton-line skeleton-line-title" />
        </div>
        <div className="skeleton-card">
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
          <SkeletonBlock className="skeleton-line skeleton-line-title" />
        </div>
        <div className="skeleton-card">
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
          <SkeletonBlock className="skeleton-line skeleton-line-title" />
        </div>
      </div>
    </div>
  );
}
