const meta = {
  id: 'hashmap',
  category: 'ds',
  label: 'Hash Map / Table',
  emoji: '🗄️',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description: 'Maps keys to values using a hash function. This visualization demonstrates collision resolution using Separate Chaining (Linked Lists).',
  useCases: ['Caching', 'Database Indexing', 'Fast Lookups', 'Unique Item Counting'],
  operations: ['Put(key, val)', 'Get(key)', 'Remove(key)'],
};
export default meta;
