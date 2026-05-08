const meta = {
  id: 'trie',
  category: 'ds',
  label: 'Trie (Prefix Tree)',
  emoji: '🔤',
  difficulty: 'advanced',
  timeComplexity: { best: 'O(L)', average: 'O(L)', worst: 'O(L)' }, // L = length of word
  spaceComplexity: 'O(ALPHABET_SIZE × L × N)',
  stable: true,
  description: 'A tree-like data structure used to efficiently store and retrieve strings. Each node represents a single character of a string.',
  useCases: ['Autocomplete', 'Spell Check', 'IP Routing (Longest Prefix Match)', 'Word Games'],
  operations: ['Insert Word', 'Search Word', 'Search Prefix'],
};
export default meta;
