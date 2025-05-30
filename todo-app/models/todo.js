'use strict';

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title must not be empty"
        }
      }
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Due date must be a valid date"
        },
        notEmpty: {
          msg: "Due date is required"
        }
      }
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'Todos',
    timestamps: true
  });

  // Static method to add a todo
  Todo.addTodo = function(todoData) {
    return this.create(todoData);
  };

  // Instance method to mark todo as completed
  Todo.prototype.markAsCompleted = function() {
    this.completed = true;
    return this.save();
  };

  return Todo;
};
