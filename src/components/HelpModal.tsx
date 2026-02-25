interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function HelpModal({ isOpen, onClose }: HelpModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal help-modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>How to play</h2>
        <p className="help-intro">
          Find the hidden word in 8 guesses using distance and direction hints.
        </p>

        <ul className="help-rules">
          <li>Guess a valid word with the required length.</li>
          <li>
            Direction arrows: ↑ means the target word is earlier, ↓ means later
          </li>
          <li>
            You have 8 valid guesses. Invalid guesses do not consume attempts.
          </li>
        </ul>

        <div className="help-example-card">
          <p className="help-example-title">Example hint</p>
          <div className="attempt-row hint-row help-example-row">
            <span className="attempt-direction hint-direction">↓</span>
            <span className="attempt-word">STONE</span>
            <span className="hint-distance bucket-close">12 words away</span>
          </div>
          <p className="help-example-note">
            This means the target word is alphabetically later than
            <strong> STONE</strong>, and exactly 12 words away in the
            dictionary.
          </p>
        </div>

        <p className="help-legend">
          <strong>Distance legend:</strong> 🟩 0, 🟨 1-10, 🟧 10-50, 🟥 50-250,
          ⬛ 251+.
        </p>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
