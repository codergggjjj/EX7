import { memo } from "react";
import CourseCard from "./CourseCard";

const CourseList = memo(function CourseList({ courses, onLearn, onDelete, onEdit }) {
  return (
    <section className="list-section">
      <div className="list-head">
        <h2>课程清单</h2>
        <p>支持搜索、分类筛选、学习、编辑与删除操作</p>
      </div>

      <div className="course-list">
        {courses.length === 0 ? (
          <p className="empty-text">没有匹配的课程，试试更换关键词或分类。</p>
        ) : (
          courses.map((course, index) => (
            <CourseCard
              key={course.id}
              id={course.id}
              displayId={index + 1}
              title={course.title}
              desc={course.desc}
              category={course.category}
              onLearn={onLearn}
              onDelete={onDelete}
              onEdit={onEdit}
              index={index}
            />
          ))
        )}
      </div>
    </section>
  );
});

export default CourseList;
