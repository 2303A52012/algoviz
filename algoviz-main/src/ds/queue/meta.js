const meta = {
  id: 'queue',
  category: 'ds',
  label: 'Queue',
  emoji: '▷',
  difficulty: 'beginner',
  description: 'A FIFO (First In First Out) structure. First element enqueued is the first to be dequeued. Think of a line at a counter — whoever arrives first leaves first.',
  operations: ['Enqueue', 'Dequeue', 'Peek', 'isEmpty', 'isFull'],
  complexities: {
    enqueue: 'O(1)', dequeue: 'O(1)', peek: 'O(1)', isEmpty: 'O(1)',
  },
  keyInsight: 'Unlike Stack (LIFO), Queue is FIFO — insert at rear, delete at front. Used in BFS, task scheduling, and any system needing fair ordering.',
  useCases: ['BFS graph traversal', 'CPU task scheduling', 'Print spooler', 'Keyboard buffer', 'Breadth-first processing'],
  visualStyle: 'queue-lane',
};
export default meta;
