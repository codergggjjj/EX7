import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "./components/Header";
import CourseList from "./components/CourseList";
import Footer from "./components/Footer";
import useDebounce from "./hooks/useDebounce";
import useLocalStorage from "./hooks/useLocalStorage";

const DEFAULT_CATEGORIES = ["前端基础", "组件开发", "工程化", "实战项目"];

const DEFAULT_COURSES = [
  {
    id: 1,
    title: "React 基础入门",
    desc: "学习 JSX、组件、Props 与 State 的核心概念。",
    category: "前端基础",
  },
  {
    id: 2,
    title: "React 事件与表单",
    desc: "掌握事件处理、受控组件以及表单数据管理。",
    category: "组件开发",
  },
  {
    id: 3,
    title: "React Hooks 实战",
    desc: "通过 useState 与 useEffect 完成交互式页面开发。",
    category: "实战项目",
  },
];

const TEST_COURSE_TOPICS = [
  "React 组件通信",
  "React 路由实践",
  "React 状态提升",
  "Hooks 进阶应用",
  "前端工程化入门",
  "Vite 构建优化",
  "TypeScript 与 React",
  "表单与校验",
  "性能优化案例",
  "数据可视化基础",
  "组件库封装实践",
  "React 项目部署",
];

const TEST_DESC_POOL = [
  "通过案例掌握核心概念与最佳实践。",
  "聚焦真实业务场景，提升组件设计能力。",
  "从基础到进阶，逐步建立完整知识体系。",
  "结合实验任务，训练代码组织与复用能力。",
  "配合小项目实战，强化性能与可维护性。",
];

const BIG_TEST_COURSES = Array.from({ length: 300 }, (_, index) => {
  const topic = TEST_COURSE_TOPICS[index % TEST_COURSE_TOPICS.length];
  const desc = TEST_DESC_POOL[index % TEST_DESC_POOL.length];
  const category = DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length];

  return {
    id: 1000 + index,
    title: `${topic}（练习 ${index + 1}）`,
    desc,
    category,
  };
});

const ALL_DEFAULT_COURSES = [...DEFAULT_COURSES, ...BIG_TEST_COURSES];

const STORAGE_KEY = "ex7_course_manager_courses";

function App() {
  const [courses, setCourses] = useLocalStorage(STORAGE_KEY, ALL_DEFAULT_COURSES);

  const [newCourse, setNewCourse] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [notice, setNotice] = useState(null);

  const noticeTimerRef = useRef(null);
  const titleInputRef = useRef(null);

  const debouncedKeyword = useDebounce(searchKeyword, 300);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const showNotice = useCallback((text, type = "success") => {
    setNotice({ text, type });

    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }

    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null);
    }, 2200);
  }, []);

  const handleLearn = useCallback((title) => {
    window.alert(`正在学习 ${title}`);
  }, []);

  const handleAddCourse = useCallback(() => {
    const trimmedTitle = newCourse.trim();
    const trimmedDesc = newDesc.trim();

    if (!trimmedTitle) {
      window.alert("课程名称不能为空");
      titleInputRef.current?.focus();
      return;
    }

    const course = {
      id: Date.now(),
      title: trimmedTitle,
      desc: trimmedDesc || "暂无课程简介，请尽快补充。",
      category: newCategory,
    };

    setCourses((prev) => [course, ...prev]);
    setNewCourse("");
    setNewDesc("");
    setNewCategory(DEFAULT_CATEGORIES[0]);
    showNotice(`已新增课程：${trimmedTitle}`);
    titleInputRef.current?.focus();
  }, [newCourse, newDesc, newCategory, setCourses, showNotice]);

  const handleDeleteCourse = useCallback(
    (id) => {
      const targetCourse = courses.find((course) => course.id === id);
      const shouldDelete = window.confirm(
        `确认删除课程「${targetCourse?.title || "未命名课程"}」吗？`
      );

      if (!shouldDelete) {
        return;
      }

      setCourses((prev) => prev.filter((course) => course.id !== id));
      showNotice(`已删除课程：${targetCourse?.title || "未命名课程"}`, "warning");

      setEditingCourseId((current) => (current === id ? null : current));
      titleInputRef.current?.focus();
    },
    [courses, setCourses, showNotice]
  );

  const handleStartEdit = useCallback((course) => {
    setEditingCourseId(course.id);
    setEditTitle(course.title);
    setEditDesc(course.desc);
    setEditCategory(course.category || DEFAULT_CATEGORIES[0]);
  }, []);

  const handleSaveEdit = useCallback(() => {
    const trimmedTitle = editTitle.trim();
    const trimmedDesc = editDesc.trim();

    if (!trimmedTitle) {
      window.alert("课程名称不能为空");
      return;
    }

    setCourses((prev) =>
      prev.map((course) =>
        course.id === editingCourseId
          ? {
              ...course,
              title: trimmedTitle,
              desc: trimmedDesc || "暂无课程简介，请尽快补充。",
              category: editCategory,
            }
          : course
      )
    );

    setEditingCourseId(null);
    showNotice(`已更新课程：${trimmedTitle}`);
  }, [editTitle, editDesc, editCategory, editingCourseId, setCourses, showNotice]);

  const handleCancelEdit = useCallback(() => {
    setEditingCourseId(null);
  }, []);

  const handleLoadBulkCourses = useCallback(() => {
    setCourses(BIG_TEST_COURSES);
    showNotice("已载入300条测试课程，可用于验证搜索与渲染性能。");
    titleInputRef.current?.focus();
  }, [setCourses, showNotice]);

  const categoryOptions = useMemo(() => {
    return [
      ...new Set([
        ...DEFAULT_CATEGORIES,
        ...courses.map((course) => course.category),
      ]),
    ].filter(Boolean);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedKeyword = debouncedKeyword.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "全部" || course.category === selectedCategory;

      const matchesKeyword =
        !normalizedKeyword ||
        course.title.toLowerCase().includes(normalizedKeyword) ||
        course.desc.toLowerCase().includes(normalizedKeyword) ||
        course.category.toLowerCase().includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });
  }, [courses, selectedCategory, debouncedKeyword]);

  const categoryStats = useMemo(() => {
    return categoryOptions.map((category) => ({
      category,
      count: courses.filter((course) => course.category === category).length,
    }));
  }, [categoryOptions, courses]);

  const editingCourse = useMemo(() => {
    return courses.find((course) => course.id === editingCourseId) || null;
  }, [courses, editingCourseId]);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="app-shell">
      <div className="bg-shape bg-shape-one" />
      <div className="bg-shape bg-shape-two" />

      <div className="app">
        {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}

        <Header
          title="React Hooks 课程管理"
          subtitle="使用 Hooks 完成课程增删改查、搜索防抖、持久化与性能优化"
          total={courses.length}
          filtered={filteredCourses.length}
        />

        <section className="control-panel">
          <div className="add-box">
            <input
              ref={titleInputRef}
              type="text"
              placeholder="请输入课程名称"
              value={newCourse}
              onChange={(e) => {
                setNewCourse(e.target.value);
              }}
            />

            <input
              type="text"
              placeholder="请输入课程简介（可选）"
              value={newDesc}
              onChange={(e) => {
                setNewDesc(e.target.value);
              }}
            />

            <select
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
              }}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button onClick={handleAddCourse}>添加课程</button>
          </div>

          <div className="quick-actions">
            <button className="bulk-btn" onClick={handleLoadBulkCourses}>
              载入大量测试课程
            </button>
          </div>

          <div className="tool-box">
            <input
              type="text"
              placeholder="搜索课程名 / 简介 / 分类"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              <option value="全部">全部分类</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="course-meta">
            <span>当前课程总数：{courses.length}</span>
            <span>筛选结果：{filteredCourses.length}</span>
            <span>更新日期：{today}</span>
          </div>

          <div className="stat-list">
            {categoryStats.map((item) => (
              <span key={item.category} className="stat-chip">
                {item.category}：{item.count}
              </span>
            ))}
          </div>
        </section>

        <CourseList
          courses={filteredCourses}
          onLearn={handleLearn}
          onDelete={handleDeleteCourse}
          onEdit={handleStartEdit}
        />

        <Footer total={courses.length} filtered={filteredCourses.length} />

        {editingCourse && (
          <div className="modal-mask" onClick={handleCancelEdit}>
            <div
              className="edit-modal"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h3>编辑课程</h3>
              <p>你正在编辑：{editingCourse.title}</p>

              <input
                type="text"
                value={editTitle}
                placeholder="课程名称"
                onChange={(e) => {
                  setEditTitle(e.target.value);
                }}
              />

              <textarea
                rows="4"
                value={editDesc}
                placeholder="课程简介"
                onChange={(e) => {
                  setEditDesc(e.target.value);
                }}
              />

              <select
                value={editCategory}
                onChange={(e) => {
                  setEditCategory(e.target.value);
                }}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button className="ghost-btn" onClick={handleCancelEdit}>
                  取消
                </button>
                <button className="save-btn" onClick={handleSaveEdit}>
                  保存修改
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
