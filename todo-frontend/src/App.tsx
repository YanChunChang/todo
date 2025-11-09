import './App.css'
import { TodoController } from './pages/todo/TodoController';
import TodoView from './pages/todo/TodoView';
import { APIBackendService } from './services/APIBackendService';

function App() {
  const controller = new TodoController(new APIBackendService());

  return  <TodoView controller={controller} />;
}

export default App
