// Doubly Circular Linked List DS Metadata
export default {
  id: 'dcll',
  category: 'ds',
  label: 'Doubly Circular Linked List',
  emoji: '◉⇄',
  difficulty: 'advanced',
  description: 'Doubly linked list where tail points back to head (circular)',
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
    'Round-robin scheduling',
    'Circular buffers',
    'Museum exhibits tour',
    'Carousel/slideshow navigation',
  ],
};
