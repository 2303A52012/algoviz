const meta = {
  id: 'stack',
  category: 'ds',
  label: 'Stack',
  emoji: '▣',
  difficulty: 'beginner',
  description: 'A LIFO (Last In First Out) structure. The last element pushed is the first to be popped. Think of a stack of plates — you can only add or remove from the top.',
  operations: ['Push', 'Pop', 'Peek', 'isEmpty'],
  complexities: {
    push: 'O(1)', pop: 'O(1)', peek: 'O(1)', isEmpty: 'O(1)',
  },
  keyInsight: 'All operations happen at one end — the top. This makes every operation O(1). Used internally by every function call in any program.',
  useCases: ['Function call stack', 'Undo / Redo operations', 'Expression evaluation', 'Backtracking algorithms', 'Browser history'],
  visualStyle: 'stack-plates',
};
export default meta;
