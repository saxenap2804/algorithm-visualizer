# 🎯 Algorithm Visualizer Pro

A beautiful, interactive web application that visualizes sorting algorithms in real-time. Watch how different algorithms sort data with stunning animations, sound effects, and detailed statistics!

![Algorithm Visualizer](https://img.shields.io/badge/React-18.2.0-blue) ![Status](https://img.shields.io/badge/Status-Active-success)


### 🎨 Visual Features
- **Real-time Animation** - Watch bars being compared, swapped, and sorted
- **Color-coded Operations**:
  - 🟢 Green: Unsorted elements
  - 🟡 Yellow: Elements being compared
  - 🔴 Red: Elements being swapped
  - 🟣 Purple: Sorted elements

### 📊 Statistics & Information
- **Time Complexity Display** - See Big O notation for each algorithm
- **Real-time Counters** - Track comparisons and swaps as they happen
- **Algorithm Info Panel** - Learn how each algorithm works
- **Performance Metrics** - Best case, worst case, and space complexity

### 🎮 Interactive Controls
- **5 Sorting Algorithms**:
  - Bubble Sort - O(n²)
  - Selection Sort - O(n²)
  - Insertion Sort - O(n²)
  - Quick Sort - O(n log n)
  - Merge Sort - O(n log n)
- **Pause/Resume** - Control the visualization flow
- **Stop** - Reset and start over
- **Adjustable Speed** - Slow down or speed up animations (1-100)
- **Adjustable Size** - Visualize 10-100 elements
- **Generate New Array** - Create random datasets

### 🔊 Audio Features
- **Sound Effects** - Hear each comparison with pitch-based audio
- **Toggle Sound** - Turn audio on/off with one click

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saxenap2804/algorithm-visualizer.git
cd algorithm-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎓 How It Works

### Understanding the Colors

1. **🟢 Green (Unsorted)**: Elements waiting to be processed
2. **🟡 Yellow (Comparing)**: Algorithm is comparing these elements
3. **🔴 Red (Swapping)**: Elements are being swapped
4. **🟣 Purple (Sorted)**: Elements in their final sorted position

### Reading the Stats

- **Algorithm**: Currently selected sorting algorithm
- **Time Complexity**: Worst-case Big O notation
- **Space**: Additional memory required
- **Comparisons**: Number of times elements are compared
- **Swaps**: Number of times elements are moved

### Algorithm Explanations

Click the **ℹ️ Info** button while visualizing to see:
- How the algorithm works
- Step-by-step explanation
- Time and space complexity details

## 🛠️ Built With

- **React** - UI framework
- **JavaScript (ES6+)** - Core logic
- **CSS3** - Styling and animations
- **Web Audio API** - Sound effects
- **Create React App** - Project setup

## 📱 Responsive Design

Works beautifully on:
- 💻 Desktop computers
- 📱 Tablets
- 🖥️ Large monitors

## 🎯 Algorithms Implemented

| Algorithm | Time Complexity | Space | Stable |
|-----------|----------------|-------|--------|
| Bubble Sort | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(1) | No |
| Insertion Sort | O(n²) | O(1) | Yes |
| Quick Sort | O(n log n) | O(log n) | No |
| Merge Sort | O(n log n) | O(n) | Yes |

## 🎮 Usage Tips

1. **Start Small**: Begin with 20-30 elements to see individual comparisons
2. **Slow It Down**: Lower speed to understand each step
3. **Compare Algorithms**: Try the same array with different algorithms
4. **Use Info Panel**: Click ℹ️ to learn while watching
5. **Enable Sound**: 🔊 Hear the sorting process!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Priyanka Saxena**
- GitHub: [@saxenap2804](https://github.com/saxenap2804)
- Project: [Algorithm Visualizer](https://github.com/saxenap2804/algorithm-visualizer)

## 🙏 Acknowledgments


- Built to help students learn sorting algorithms visually
- Thanks to the React community for amazing tools!

