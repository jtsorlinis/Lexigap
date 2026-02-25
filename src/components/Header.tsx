interface HeaderProps {
  puzzleNumber: number;
  isPractice: boolean;
  requiredLength: number;
  guessesRemaining: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

function Header({
  puzzleNumber,
  isPractice,
  requiredLength,
  guessesRemaining,
  theme,
  onToggleTheme,
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
      <div className="meta-group">
        <span>Length: {requiredLength}</span>
        <span>Remaining: {guessesRemaining}</span>
      </div>
      <div className="header-actions">
        <button type="button" onClick={onOpenStats} className="ghost-button">
          Stats
        </button>
        <button type="button" onClick={onOpenHelp} className="ghost-button">
          Help
        </button>
        <button type="button" onClick={onToggleTheme} className="ghost-button">
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
}

export default Header;
