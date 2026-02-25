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
      <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h2>How to play</h2>
        <ul>
          <li>Guess a valid dictionary word with the required length.</li>
          <li>Distance is the exact rank gap from the hidden target in the same length bucket.</li>
          <li>Direction arrows: ↑ means the target is earlier, ↓ means later, ✓ means correct.</li>
          <li>You have 8 valid guesses. Invalid guesses do not consume attempts.</li>
        </ul>
        <p>Share buckets: 🟩 0, 🟨 1-5, 🟧 6-20, 🟥 21-100, ⬛ 101+.</p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default HelpModal;
