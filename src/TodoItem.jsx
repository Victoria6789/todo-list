import React from "react";
import "./index.css"; 

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false,
        };
    }

    render() {
        const { todo, onTodoChecked, onTodoDelete } = this.props;
        const { isHovered } = this.state;

        return (
            <li
                className={`todo-item ${todo.checked ? "checked" : ""}`}
                onMouseEnter={() => this.setState({ isHovered: true })}
                onMouseLeave={() => this.setState({ isHovered: false })}
            >
                <div className="todo-content">
                    <input
                        type="checkbox"
                        checked={todo.checked}
                        onChange={onTodoChecked}
                        className="todo-checkbox"
                    />
                    <strong>{todo.name}</strong>
                    <div className="todo-description">{todo.description}</div>
                    <br />
                    <small className="todo-created-at">
                        Создано: {todo.createdAt} | Важность: {todo.severity.join(', ')}
                    </small>
                </div>
                {isHovered && (
                    <button onClick={onTodoDelete} className="delete-button">
                        Удалить
                    </button>
                )}
            </li>
        );
    }
}

export default TodoItem;