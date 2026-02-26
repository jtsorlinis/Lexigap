interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_GUESSES = 10;

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
          Find the hidden word in {MAX_GUESSES} guesses using distance and direction hints.
        </p>

        <ul className="help-rules">
          <li>Invalid guesses do not consume attempts.</li>
        </ul>

        <div className="help-example-grid">
          <div className="help-example-card">
            <p className="help-example-title">Arrow + Distance</p>
            <div className="attempt-row hint-row help-example-row">
              <span className="attempt-direction hint-direction">↓</span>
              <span className="attempt-word hint-word">BRICK</span>
              <span className="hint-distance bucket-close">34 words away</span>
            </div>
            <p className="help-example-note">
              The <strong>↓</strong> means the target word is later than
              <strong> BRICK</strong>. The distance shows the exact rank gap:
              <strong> 34 words away</strong>.
            </p>
          </div>

          <div className="help-example-card">
            <p className="help-example-title">Green Letters</p>
            <div className="attempt-row hint-row help-example-row">
              <span className="attempt-direction hint-direction">↑</span>
              <span className="attempt-word hint-word">
                <span className="hint-letter-match">S</span>
                <span className="hint-letter-match">T</span>
                <span className="hint-letter">O</span>
                <span className="hint-letter">N</span>
                <span className="hint-letter">E</span>
              </span>
              <span className="hint-distance bucket-very-close">
                7 words away
              </span>
            </div>
            <p className="help-example-note">
              Green letters show matching starting letters with the target. In
              this example, the target starts with <strong>ST</strong>.
            </p>
          </div>
        </div>

        <p className="help-legend">
          <strong>Distance legend:</strong>
          <br /> 🟩 0 🟨 &lt;10 🟧 &lt;50 🟥 &lt;250 ⬛ 250+.
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
