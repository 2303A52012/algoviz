// Doubly Linked List DS Metadata
export default {
  id: 'dll',
  category: 'ds',
  label: 'Doubly Linked List',
  emoji: '⇄',
  difficulty: 'intermediate',
  description: 'Bidirectional linked list with forward and backward pointers',
  status: 'under-construction',
  complexities: {
    'Insert': 'O(n)',
    'Delete': 'O(n)',
    'Search': 'O(n)',
    'Traverse': 'O(n)',
  },
  operations: [
    'Insert at Head',
    'Insert at Tail',
    'Insert at Position',
    'Delete from Head',
    'Delete from Tail',
    'Delete at Position',
    'Search',
    'Traverse Forward',
    'Traverse Backward',
  ],
  useCases: [
    'Browser history (forward/backward)',
    'Undo/Redo functionality',
    'Deque operations',
    'Music playlist navigation',
  ],
};
