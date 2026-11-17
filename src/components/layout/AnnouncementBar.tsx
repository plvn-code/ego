const messages = [
  "Швидка відправка Новою поштою",
  "Повернення та обмін",
  "Готові капсули до твоєї події",
  "Жіночий одяг, який ти захочеш",
  "Нова колекція осінь–зима 2026",
];

/** Graphite marquee above the header — lines from the @ego.est__ bio. */
export function AnnouncementBar() {
  const row = (hidden?: boolean) => (
    <span aria-hidden={hidden || undefined}>
      {messages.map((m) => (
        <span key={m} style={{ padding: 0 }}>
          {m}
          <i />
        </span>
      ))}
    </span>
  );
  return (
    <div className="ticker" role="region" aria-label="Оголошення">
      <div className="ticker__track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
