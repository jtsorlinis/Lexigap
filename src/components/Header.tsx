interface HeaderProps {
  puzzleNumber: number;
  isPractice: boolean;
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

function Header({
  puzzleNumber,
  isPractice,
  onOpenHelp,
  onOpenStats
}: HeaderProps): JSX.Element {
  return (
    <header className="panel header">
      <div className="title-group">
        <h1>LexiGap</h1>
        <p>
          {isPractice ? `Practice #${puzzleNumber}` : `Puzzle #${puzzleNumber}`}
        </p>
      </div>
      <div className="header-actions">
        <button type="button" onClick={onOpenStats} className="ghost-button icon-button" aria-label="Open stats" title="Stats">
          📊
        </button>
        <button type="button" onClick={onOpenHelp} className="ghost-button icon-button" aria-label="Open help" title="Help">
          ❓
        </button>
      </div>
    </header>
  );
}

export default Header;
