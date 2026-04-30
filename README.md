# AlgoViz V2 🎨

**Interactive Algorithm Visualization Platform** - A React-based web application that visualizes sorting, searching, and graph algorithms with step-by-step explanations in 8 programming languages.

![AlgoViz](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge) ![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🎯 Project Overview

AlgoViz is an educational platform designed to help learners understand algorithms through **interactive visualizations** and **comprehensive code documentation**. Every algorithm is:

- ✅ Visualized step-by-step with color-coded elements
- ✅ Commented in detail (every code block explained)
- ✅ Implemented in 8 programming languages
- ✅ Optimized for learning and teaching

**Goal:** Make algorithms accessible and understandable for everyone, from beginners to advanced learners.

---

## ✨ Features

### 🎬 Interactive Visualizations
- **Real-time Step Execution** - Watch algorithms run step-by-step with explanations
- **Color Coding** - Visual feedback system (Yellow=compare, Red=swap, Green=found, Blue=normal)
- **Adjustable Speed** - Control animation speed or step through manually
- **Custom Input** - Enter your own data to visualize

### 💻 Multi-Language Code Display
All algorithms available in **8 languages**:
- JavaScript
- Python
- Java
- C++
- C
- C#
- Go
- Rust

### 📊 Comprehensive Documentation
- **Fully Commented Code** - Every code block has detailed inline comments
- **Phase-Based Explanations** - Algorithm phases broken down step-by-step
- **Performance Metrics** - Comparisons, swaps, and operations tracked
- **Complexity Notes** - Big-O notation and complexity explanations

### 🧠 Algorithm Coverage

#### Sorting Algorithms (8)
- ✅ Bubble Sort
- ✅ Heap Sort
- ✅ Radix Sort
- ⬜ Insertion Sort
- ⬜ Selection Sort
- ⬜ Merge Sort
- ⬜ Quick Sort
- ⬜ Shell Sort
- ⬜ Counting Sort

#### Searching Algorithms (5)
- ✅ Linear Search
- ✅ Binary Search
- ✅ Jump Search
- ⬜ Interpolation Search
- ⬜ Ternary Search

#### Graph Algorithms (4)
- ⬜ Breadth-First Search (BFS)
- ⬜ Depth-First Search (DFS)
- ⬜ Dijkstra's Algorithm
- ⬜ A* Search

**Status Key:** ✅ = Fully Documented | ⬜ = In Progress

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 14+ 
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/2303A52012/algoviz.git
cd algoviz-v2
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

---

## 📖 How to Use

### 1. **Select an Algorithm**
- Navigate to the home page
- Choose from Sorting, Searching, or Graph algorithms
- Click on the algorithm you want to visualize

### 2. **Explore the Visualization**
- Watch the step-by-step animation
- See comparisons and operations highlighted in real-time
- View performance metrics (comparisons, swaps, etc.)

### 3. **View the Code**
- Switch between 8 programming languages
- Read detailed inline comments explaining each block
- Understand the algorithm logic across different languages

### 4. **Run with Custom Data**
- Input your own array or graph
- Adjust sorting order or search parameters
- Visualize with your specific data

### 5. **Learn the Complexity**
- Check Big-O notation for each algorithm
- Compare best-case, average-case, and worst-case scenarios
- Understand space and time complexity trade-offs

---

## 🏗️ Project Structure

```
algoviz-v2/
├── public/
│   └── index.html              # Main HTML file
├── src/
│   ├── index.js               # Application entry point
│   ├── App.js                 # Main App component
│   ├── registry.js            # Algorithm registry with metadata
│   ├── algos/
│   │   ├── sorting/
│   │   │   ├── bubble/        # Bubble Sort
│   │   │   ├── heap/          # Heap Sort
│   │   │   ├── insertion/     # Insertion Sort
│   │   │   ├── merge/         # Merge Sort
│   │   │   ├── quick/         # Quick Sort
│   │   │   ├── radix/         # Radix Sort
│   │   │   ├── selection/     # Selection Sort
│   │   │   └── shell/         # Shell Sort
│   │   ├── searching/
│   │   │   ├── binary/        # Binary Search
│   │   │   ├── interpolation/ # Interpolation Search
│   │   │   ├── jump/          # Jump Search
│   │   │   ├── linear/        # Linear Search
│   │   │   └── ternary/       # Ternary Search
│   │   └── graph/
│   │       ├── astar/         # A* Algorithm
│   │       ├── bfs/           # Breadth-First Search
│   │       ├── dfs/           # Depth-First Search
│   │       └── dijkstra/      # Dijkstra's Algorithm
│   ├── components/
│   │   ├── AlgoPage.jsx       # Algorithm page layout
│   │   ├── HomePage.jsx       # Home page
│   │   ├── CodeViewer.jsx     # Multi-language code display
│   │   └── (CSS files)
│   ├── styles/
│   │   ├── App.css
│   │   ├── global.css
│   │   └── (Algorithm-specific CSS)
│   └── hooks/
│       └── (Custom React hooks)
├── PROGRESS.md                # Documentation progress tracking
├── README.md                  # This file
└── package.json              # Project dependencies

```

### Algorithm File Structure

Each algorithm folder contains:
- **code.js** - Implementations in all 8 languages (with comments)
- **steps.js** - Step-by-step algorithm phases with detailed logic
- **Visualizer.jsx** - React component for visualization
- **Visualizer.css** - Styling for the visualizer
- **meta.js** - Metadata (name, complexity, description)

---

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI framework with Hooks
- **JavaScript/JSX** - Component logic
- **CSS3** - Styling with custom properties
- **SVG** - Graph and tree visualizations

### Build & Development
- **Webpack** - Module bundler
- **Babel** - JavaScript transpiler
- **ESLint** - Code quality

### State Management
- **React Hooks** (useState, useRef, useCallback, useEffect)
- **Context API** (where needed)

---

## 💡 Code Documentation Standards

Every algorithm file follows consistent documentation patterns:

### 1. Algorithm Header
```javascript
// ===== ALGORITHM_NAME: Brief description =====
function algorithmName(arr, params) {
  // Implementation...
}
```

### 2. Phase Markers
```javascript
// ===== PHASE NAME: What this phase does =====
for (let i = 0; i < n; i++) {
  // Phase-specific logic...
}
```

### 3. Line-by-Line Comments
```javascript
// Initialize variables for tracking
const n = arr.length;

// Outer loop: after i passes, largest i elements are in place
for (let i = 0; i < n - 1; i++) {
  // Inner loop: compare adjacent pairs
  for (let j = 0; j < n - i - 1; j++) {
    // If left > right, swap them
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
}
```

For detailed documentation standards, see [PROGRESS.md](PROGRESS.md#-comment-pattern--standards).

---

## 📈 Documentation Status

**Current Progress:** 5/17 algorithms fully documented (29% complete)

### ✅ Fully Documented
- Binary Search (9 files including 8 languages)
- Jump Search (9 files including 8 languages)
- Linear Search (9 files including 8 languages)
- Heap Sort (9 files including 8 languages)
- Radix Sort (9 files including 8 languages)

### 🟡 In Progress
- Bubble Sort (code.js done, steps.js and Visualizer.jsx pending)

### ⬜ Pending
- 11+ remaining algorithms (sorting, searching, graph)

**See [PROGRESS.md](PROGRESS.md) for detailed progress tracking and roadmap.**

---

## 🎓 Use Cases

### For Learners
- Understand algorithm logic through visualizations
- See how algorithms behave with different inputs
- Learn implementations in your preferred language
- Study complexity analysis with visual feedback

### For Educators
- Teach algorithms with interactive examples
- Show students the same algorithm in multiple languages
- Provide working code examples with full documentation
- Demonstrate step-by-step execution

### For Developers
- Refresh your understanding of classic algorithms
- Compare algorithm performance visually
- Study code patterns across 8 languages
- Use as a teaching tool

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

### Adding Documentation to Algorithms
1. Choose an algorithm from the "Pending" list in [PROGRESS.md](PROGRESS.md)
2. Follow the comment patterns in documented files
3. Add comments to: `code.js`, `steps.js`, `Visualizer.jsx`
4. Test the visualization
5. Submit a pull request

### Documentation Requirements
- ✅ All code blocks commented with purpose
- ✅ Phase-based explanations for algorithm phases
- ✅ Comments in all 8 languages in `code.js`
- ✅ Component explanations in `Visualizer.jsx`
- ✅ No breaking changes to visualization logic

### Code Style
- Use consistent comment format from existing algorithms
- Follow React Hook best practices
- Maintain CSS custom property naming
- Keep visualizations performant

---

## 📚 Learning Resources

### Understanding Each Algorithm
1. Open an algorithm page
2. Read the "Complexity Note" section
3. View commented code in `code.js`
4. Run the visualization with different inputs
5. Study the step-by-step phases

### Comparing Languages
- Use the language selector in the code viewer
- See how the same algorithm differs across languages
- Understand language-specific syntax and idioms

### Performance Analysis
- Watch how different input sizes affect performance
- Compare comparisons, swaps, and moves
- Visualize best-case, average-case, worst-case scenarios

---

## ⚙️ Advanced Configuration

### Adjusting Visualization Speed
- Use the speed control slider on algorithm pages
- Set custom step delays in component state

### Custom Color Schemes
Edit CSS custom properties in `styles/global.css`:
```css
:root {
  --bg-dark: #0f1419;
  --accent-blue: #2563eb;
  --text-primary: #fff;
  /* ... etc */
}
```

### Adding New Algorithms
1. Create folder: `src/algos/[category]/[algo-name]/`
2. Add `code.js`, `steps.js`, `Visualizer.jsx`, `meta.js`
3. Register in `src/registry.js`
4. Follow existing patterns for consistency

---

## 🐛 Troubleshooting

### Visualization not updating?
- Check browser console for errors
- Ensure algorithm `generateSteps()` returns valid step objects
- Verify color state management in Visualizer component

### Code display issues?
- Clear browser cache
- Check syntax highlighting in `CodeViewer.jsx`
- Verify CODE_SNIPPETS object in `code.js`

### Performance problems?
- Reduce animation speed for large inputs
- Check for memory leaks in useEffect cleanup
- Profile with React DevTools

---

## 📝 License

This project is licensed under the **MIT License**. See LICENSE file for details.

---

## 👨‍💻 Author

**Developed by:** [2303A52012](https://github.com/2303A52012)  
**Repository:** [github.com/2303A52012/algoviz](https://github.com/2303A52012/algoviz)

---

## 🔗 Quick Links

- **[Documentation Progress](PROGRESS.md)** - Current status and roadmap
- **[Live Demo](#)** - (Coming soon)
- **[Issue Tracker](https://github.com/2303A52012/algoviz/issues)** - Report bugs
- **[Pull Requests](https://github.com/2303A52012/algoviz/pulls)** - Contribute

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| **Total Algorithms** | 17 |
| **Programming Languages** | 8 |
| **Fully Documented** | 5 (29%) |
| **Lines of Comments** | 7000+ |
| **Components** | React Hooks-based |
| **Build Tool** | Webpack + Babel |

---

## ⭐ Acknowledgments

- Inspired by VisuAlgo and Algorithm Visualizer
- Thanks to the open-source community
- Built with React and modern web technologies

---

## 📞 Support & Feedback

Have questions or suggestions? 
- Open an [issue](https://github.com/2303A52012/algoviz/issues) on GitHub
- Check [PROGRESS.md](PROGRESS.md) for project status
- Review documented algorithms for learning

---

**Happy Learning! 🚀 Explore, Visualize, and Master Algorithms!**

Last Updated: April 30, 2026
