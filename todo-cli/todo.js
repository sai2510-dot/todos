#!/usr/bin/env node

import { argv } from 'process';
import { addTodo } from './addTodo.js';
import { completeTodo } from './completeTodo.js';
import { listTodos } from './listTodos.js';

async function main() {
  const [,, command, ...args] = argv;

  switch (command) {
    case 'add':
      const title = args.join(' ');
      if (!title) {
        console.log('❌ Please provide a title for the todo.');
        return;
      }
      await addTodo(title);
      console.log(`✅ Added todo: "${title}"`);
      break;

    case 'complete':
      const id = parseInt(args[0]);
      if (isNaN(id)) {
        console.log('❌ Please provide a valid todo ID to complete.');
        return;
      }
      await completeTodo(id);
      console.log(`✅ Marked todo #${id} as completed.`);
      break;

    case 'list':
      await listTodos();
      break;

    default:
      console.log(`
Usage:
  node todo.js add "Task Title"        → Add a new todo
  node todo.js complete <id>           → Mark a todo as complete
  node todo.js list                    → List all todos
`);
  }
}

main();
