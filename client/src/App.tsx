import { BoardProvider } from './context/BoardContext';
import { Board } from './components/Board';
import { Toolbar } from './components/Toolbar';

function App() {
  return (
    <BoardProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Kanban Board</h1>
          <Toolbar />
        </header>
        <main className="flex-1 overflow-hidden p-6">
          <Board />
        </main>
      </div>
    </BoardProvider>
  );
}

export default App;
