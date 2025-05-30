"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Define associations here if needed in the future.
     */
    static associate(models) {
      // define association here
    }

    /**
     * Add a new todo.
     */
    static addTodo({ title, dueDate }) {
      return this.create({
        title,
        dueDate,
        completed: false,
      });
    }

    /**
     * Mark the todo as completed.
     */
    markAsCompleted() {
      return this.update({ completed: true });
    }

    /**
     * Delete the todo.
     */
    deleteTodo() {
      return this.destroy();
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
