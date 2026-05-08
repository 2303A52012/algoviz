// Doubly Linked List DS Metadata
export default {
  id: 'dll',
  category: 'ds',
  label: 'Doubly Linked List',
  emoji: '⇄',
  difficulty: 'intermediate',
  description: 'A Doubly Linked List extends the singly linked list by giving each node both a forward (next) and backward (prev) pointer, enabling bidirectional traversal and O(1) tail operations when a tail pointer is maintained.',
  keyInsight: 'Unlike SLL, DLL allows traversal in both directions and O(1) delete when you have a reference to the node. The trade-off is double the pointer memory per node.',
  complexities: {
    insertAtHead: 'O(1)',
    insertAtTail: 'O(1)',
    deleteAtHead: 'O(1)',
    deleteAtTail: 'O(1)',
    search: 'O(n)',
    traverseForward: 'O(n)',
    traverseBackward: 'O(n)',
  },
  operations: [
    'Insert at Head',
    'Insert at Tail',
    'Delete from Head',
    'Delete from Tail',
    'Search',
    'Traverse Forward',
    'Traverse Backward',
  ],
  useCases: [
    'Browser history (forward/backward)',
    'Undo/Redo functionality',
    'Deque (double-ended queue)',
    'Music playlist navigation',
    'LRU Cache implementation',
  ],
};

