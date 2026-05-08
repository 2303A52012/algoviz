// Singly Circular Linked List DS Metadata
export default {
  id: 'cll',
  category: 'ds',
  label: 'Singly Circular Linked List',
  emoji: '↺',
  difficulty: 'intermediate',
  description: 'A Singly Circular Linked List is a variation of a singly linked list where the last node\'s next pointer points back to the head node instead of null — forming a circular chain.',
  keyInsight: 'Unlike a regular SLL, there is no null at the end. Traversal must track when you\'ve returned to the head. Great for cyclic/repeating sequences where you always need a "next" element.',
  complexities: {
    insertAtHead: 'O(1)',
    insertAtTail: 'O(n)',
    deleteAtHead: 'O(1)',
    search: 'O(n)',
    traverse: 'O(n)',
  },
  operations: [
    'Insert at Head',
    'Insert at Tail',
    'Delete from Head',
    'Search',
    'Traverse (Circular)',
  ],
  useCases: [
    'Round-robin task scheduling',
    'Multiplayer board games (turn order)',
    'Circular buffers',
    'Token ring networking',
    'CPU time-sharing between processes',
  ],
};
