import { memo } from "react";

const CourseCard = memo(function CourseCard({
  id,
  displayId,
  title,
  desc,
  category,
  onLearn,
  onDelete,
  onEdit,
  index,
}) {
  return (
    <article className="card" style={{ "--delay": `${index * 70}ms` }}>
      <div className="card-top">
        <span className="card-tag">课程 #{displayId}</span>
        <span className="category-tag">{category}</span>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>

      <div className="card-actions">
        <button className="learn-btn" onClick={() => onLearn(title)}>
          学习
        </button>

        <button
          className="edit-btn"
          onClick={() =>
            onEdit({
              id,
              title,
              desc,
              category,
            })
          }
        >
          编辑
        </button>

        <button className="delete-btn" onClick={() => onDelete(id)}>
          删除
        </button>
      </div>
    </article>
  );
});

export default CourseCard;
