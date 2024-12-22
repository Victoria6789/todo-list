import React, { Component } from "react";
import TodoItem from "./TodoItem";
import "./index.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      todos: [],
      showIncomplete: false,
      searchQuery: "",
      selectedFilterSeverities: [],
      selectedAddSeverities: [],
      titleError: "",
      severityError: "",
      hasSearched: false,
    };
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value, hasSearched: true });
  };

  handleFilterSeverityChange = (severity) => {
    this.setState((prevState) => {
      const { selectedFilterSeverities } = prevState;
      if (selectedFilterSeverities.includes(severity)) {
        return {
          selectedFilterSeverities: selectedFilterSeverities.filter(
            (s) => s !== severity
          ),
        };
      } else {
        return {
          selectedFilterSeverities: [...selectedFilterSeverities, severity],
        };
      }
    });
  };

  handleAddSeverityChange = (severity) => {
    this.setState((prevState) => {
      const { selectedAddSeverities } = prevState;
      if (selectedAddSeverities.includes(severity)) {
        return {
          selectedAddSeverities: selectedAddSeverities.filter(
            (s) => s !== severity
          ),
        };
      } else {
        return { selectedAddSeverities: [...selectedAddSeverities, severity] };
      }
    });
  };

  handleTodoAdd = () => {
    const { title, selectedAddSeverities } = this.state;
    this.setState({ titleError: "", severityError: "" });

    let hasError = false;

    if (!title.trim()) {
      this.setState({ titleError: "Введите название задачи." });
      hasError = true;
    } else if (/^\s/.test(title)) {
      this.setState({
        titleError: "Название не должно начинаться с пробелов.",
      });
      hasError = true;
    } else if (/\s$/.test(title)) {
      this.setState({
        titleError: "Название не должно заканчиваться пробелами.",
      });
      hasError = true;
    }

    if (selectedAddSeverities.length === 0) {
      this.setState({ severityError: "Выберите уровень важности." });
      hasError = true;
    }

    if (hasError) return;

    const newTodo = {
      name: title.trim(),
      description: this.state.description,
      checked: false,
      createdAt: new Date().toLocaleString(),
      severity: selectedAddSeverities,
    };

    this.setState((prevState) => ({
      todos: [...prevState.todos, newTodo],
      title: "",
      description: "",
      selectedAddSeverities: [],
    }));
  };

  handleGenerateTodos = () => {
    const severities = ["Срочно", "Средне", "Не срочно"];
    const newTodos = Array.from({ length: 1000 }, (_, i) => ({
      name: `Задача ${i + 1}`,
      description: `Описание задачи ${i + 1}`,
      checked: false,
      createdAt: new Date().toLocaleString(),
      severity: [severities[Math.floor(Math.random() * severities.length)]],
    }));

    this.setState((prevState) => ({
      todos: [...prevState.todos, ...newTodos],
    }));
  };

  handleTodoChecked = (index) => (e) => {
    const newTodos = this.state.todos.map((todo, i) =>
      i === index ? { ...todo, checked: e.target.checked } : todo
    );
    this.setState({ todos: newTodos });
  };

  handleTodoDelete = (index) => () => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((_, i) => i !== index),
    }));
  };

  toggleShowIncomplete = () => {
    this.setState((prevState) => ({
      showIncomplete: !prevState.showIncomplete,
    }));
  };

  render() {
    const {
      searchQuery,
      showIncomplete,
      selectedFilterSeverities,
      titleError,
      severityError,
      hasSearched,
    } = this.state;

    const sortedTodos = this.state.todos.sort((a, b) => {
      return a.checked === b.checked ? 0 : a.checked ? 1 : -1;
    });

    const filteredTodos = sortedTodos.filter((todo) => {
      const searchLower = searchQuery.toLowerCase();
      const severityMatch =
        selectedFilterSeverities.length === 0 ||
        selectedFilterSeverities.some((severity) =>
          todo.severity.includes(severity)
        );
      return (
        (todo.name.toLowerCase().includes(searchLower) ||
          todo.description.toLowerCase().includes(searchLower)) &&
        (!showIncomplete || !todo.checked) &&
        severityMatch
      );
    });

    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "100px",
            padding: "10px",
            borderRight: "1px solid #ccc",
          }}
        >
          <h2>Фильтрация</h2>
          <div>
            <span className="filter-title">Выбор важности:</span>
            <div style={{ margin: "5px 0" }}>
              {["Срочно", "Средне", "Не срочно"].map((severity) => (
                <div key={severity} className="severity-option">
                  <input
                    type="checkbox"
                    checked={selectedFilterSeverities.includes(severity)}
                    onChange={() => this.handleFilterSeverityChange(severity)}
                  />
                  <label className="severity-label">{severity}</label>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "15px" }}>
            <span className="filter-title">ФИЛЬТР:</span>
            <label>
              <input
                type="checkbox"
                checked={showIncomplete}
                onChange={this.toggleShowIncomplete}
              />
              Скрыть выполненные
            </label>
          </div>
        </div>

        <div style={{ flex: 1, padding: "10px" }}>
          <h1>TODO LIST</h1>

          {}
          <div className="input-container">
            <input
              className="large-input"
              placeholder="🔍 Поиск..."
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
          </div>

          <div style={{ maxHeight: 300, overflowY: "auto", padding: 10 }}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {filteredTodos.length > 0
                ? filteredTodos.map((todo, index) => (
                    <TodoItem
                      key={index}
                      todo={todo}
                      onTodoChecked={this.handleTodoChecked(index)}
                      onTodoDelete={this.handleTodoDelete(index)}
                    />
                  ))
                : hasSearched && (
                    <li style={{ color: "red", textAlign: "left" }}>
                      По вашим критериям ничего не найдено.
                    </li>
                  )}
            </ul>
          </div>

          {}
          <div className="input-container" style={{ marginTop: "20px" }}>
            <input
              className={`large-input ${titleError ? "error" : ""}`}
              placeholder="Введите название задачи"
              value={this.state.title}
              onChange={this.handleTitleChange}
              onKeyPress={(e) => e.key === "Enter" && this.handleTodoAdd()}
            />
            <button onClick={this.handleTodoAdd}>ДОБАВИТЬ</button>
          </div>
          {titleError && <div className="error-message">{titleError}</div>}
          <div className="input-container">
            <input
              className="large-input"
              placeholder="Введите описание задачи"
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
          </div>

          {}
          <div>
            <span style={{ fontWeight: "bold" }}>
              Выбор важности для новой задачи:
            </span>
            <div style={{ margin: "10px 0" }}>
              {["Срочно", "Средне", "Не срочно"].map((severity) => (
                <button
                  key={severity}
                  onClick={() => this.handleAddSeverityChange(severity)}
                  style={{
                    margin: "5px",
                    backgroundColor: this.state.selectedAddSeverities.includes(
                      severity
                    )
                      ? "#007BFF"
                      : "#f0f0f0",
                    color: this.state.selectedAddSeverities.includes(severity)
                      ? "#fff"
                      : "#000",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                >
                  {severity}
                </button>
              ))}
            </div>
            {severityError && (
              <div className="error-message">{severityError}</div>
            )}
          </div>

          <button
            className="generate-button"
            onClick={this.handleGenerateTodos}
          >
            Сгенерировать 1000 задач
          </button>
        </div>
      </div>
    );
  }
}

export default App;
