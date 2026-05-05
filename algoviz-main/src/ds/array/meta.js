const meta = {
  id: 'array',
  category: 'ds',
  label: 'Array',
  emoji: '▤',
  difficulty: 'beginner',
  description: 'A fixed-size collection of elements stored in contiguous memory. Access any element in O(1) using its index.',
  operations: ['Access', 'Insert', 'Delete', 'Search', 'Resize'],
  complexities: {
    access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)',
  },
  keyInsight: 'Index = memory address offset. arr[i] = base + i × element_size. That is why access is O(1) but insert/delete are O(n) — shifting is required.',
  useCases: ['Fixed-size data', 'Cache-friendly iteration', 'Matrix representation', 'Lookup tables'],
  visualStyle: 'array-boxes',
};
export default meta;
