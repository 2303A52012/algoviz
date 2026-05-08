// Doubly Circular Linked List DS Metadata
export default {
  id: 'dcll',
  category: 'ds',
  label: 'Doubly Circular Linked List',
  emoji: '◉⇄',
  difficulty: 'advanced',
  description: 'A Doubly Circular Linked List is a doubly linked list where the tail\'s next pointer points back to head, and head\'s prev pointer points back to tail — forming a complete bidirectional circle.',
  keyInsight: 'DCLL enables O(1) circular traversal in both directions. Every node is both reachable forward and backward from any starting point — ideal for round-robin and cyclic buffer patterns.',
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
    'Round-robin CPU scheduling',
    'Circular buffers / ring buffers',
    'Music/video carousel navigation',
    'Multiplayer game turn management',
    'Operating system task queues',
  ],
};

