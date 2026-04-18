function Footer({ total, filtered }) {
  return (
    <footer className="footer">
      <p>React Course Manager</p>
      <small>
        已维护课程 {total} 门 | 当前展示 {filtered} 门 | 构建你的前端学习路径
      </small>
    </footer>
  );
}

export default Footer;
