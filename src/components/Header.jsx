function Header({ title, subtitle, total, filtered }) {
  return (
    <header className="header">
      <p className="eyebrow">Course Dashboard</p>
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
      <div className="total-chip">进行中课程 {total} 门</div>
      <p className="filter-note">当前筛选结果：{filtered} 门</p>
    </header>
  );
}

export default Header;
