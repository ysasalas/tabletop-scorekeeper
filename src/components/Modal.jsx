export default function Modal({
  isOpen,
  title,
  onClose,
  children,
  closeOnBackdrop = false,
  hideCloseButton = false,
  overlayDecoration = null,
  width = "medium"
}) {
  if (!isOpen) {
    return null;
  }

  const widthClass =
    width === "small" ? "modal--small" : width === "large" ? "modal--large" : "modal--medium";

  return (
    <div
      className="modal-overlay"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <div className={`modal-stage ${widthClass}`}>
        {overlayDecoration}
        <div
          className={`modal-card ${widthClass}`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="modal-header">
            <h2>{title}</h2>
            {onClose && !hideCloseButton ? (
              <button type="button" className="ghost-button" onClick={onClose} aria-label="Close modal">
                Close
              </button>
            ) : null}
          </div>
          <div className="modal-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
