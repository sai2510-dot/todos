'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * Not used here but required by Sequelize conventions.
     */
    static associate(models) {
      // define association here if needed
    }

    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log('My Todo-list\n');

      console.log('Overdue');
      const overdueItems = await this.overdue();
      overdueItems.forEach((todo) => {
        console.log(todo.displayableString());
      });
      console.log('\n');

      console.log('Due Today');
      const dueTodayItems = await this.dueToday();
      dueTodayItems.forEach((todo) => {
        console.log(todo.displayableString());
      });
      console.log('\n');

      console.log('Due Later');
      const dueLaterItems = await this.dueLater();
      dueLaterItems.forEach((todo) => {
        console.log(todo.displayableString());
      });
    }

    static async overdue() {
      // All todos with dueDate < today (and not completed)
      const today = new Date().toISOString().slice(0, 10);
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: today },
          completed: false,
        },
        order: [['dueDate', 'ASC']],
      });
    }

    static async dueToday() {
      // All todos with dueDate == today
      const today = new Date().toISOString().slice(0, 10);
      return await Todo.findAll({
        where: {
          dueDate: today,
        },
        order: [['id', 'ASC']],
      });
    }

    static async dueLater() {
      // All todos with dueDate > today
      const today = new Date().toISOString().slice(0, 10);
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: today },
        },
        order: [['dueDate', 'ASC']],
      });
    }

    static async markAsComplete(id) {
      // Find the todo by id and set completed to true
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    displayableString() {
      const checkbox = this.completed ? '[x]' : '[ ]';
      // Due date is shown only if overdue or due later (not due today)
      const today = new Date().toISOString().slice(0, 10);
      const showDate = this.dueDate !== today ? ` ${this.dueDate}` : '';
      return `${this.id}. ${checkbox} ${this.title}${showDate}`;
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Todo',
    }
  );

  return Todo;
};
