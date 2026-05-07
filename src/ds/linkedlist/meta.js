// ===== SINGLY LINKED LIST DATA STRUCTURE METADATA =====
// Linked List (Singly): A linear data structure where elements (nodes) are
// connected via pointers. Each node has a value and a reference to the next node.
// Think of it like a treasure hunt - each clue points to the next location.

const meta = {
  id: 'linkedlist',
  category: 'ds',
  label: 'Singly Linked List',
  emoji: '🔗',
  difficulty: 'intermediate',
  description: 'A Singly Linked List is a linear data structure where elements (nodes) are stored in a sequence. Each node contains a value and a pointer to the next node. Unlike arrays, no contiguous memory required.',
  operations: ['Insert at Head', 'Insert at Tail', 'Insert at Position', 'Delete from Head', 'Delete from Tail', 'Delete at Position', 'Search', 'Traverse'],
  complexities: {
    insertAtHead: 'O(1)',
    insertAtTail: 'O(n)',
    insertAtPosition: 'O(n)',
    deleteFromHead: 'O(1)',
    deleteFromTail: 'O(n)',
    deleteAtPosition: 'O(n)',
    search: 'O(n)',
    traverse: 'O(n)',
  },
  keyInsight: 'Unlike arrays, linked lists provide O(1) insertion/deletion at head but O(n) at tail (must traverse). No random access - must start from head and follow pointers.',
  useCases: [
    'Implementing stacks and queues',
    'Memory-efficient storage of dynamic data',
    'Polynomial representation',
    'Undo/Redo functionality',
    'Symbol table in compilers',
    'Graph adjacency list representation',
  ],
  visualStyle: 'linkedlist-nodes',
};

export default meta;
