import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubble');

  // Generate random array
  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 400) + 10,
        color: '#4ade80'
      });
    }
    setArray(newArray);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Delay function for animation
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Update array with colors
  const updateArray = async (newArray, indices, color) => {
    const updatedArray = [...newArray];
    indices.forEach(idx => {
      updatedArray[idx] = { ...updatedArray[idx], color };
    });
    setArray(updatedArray);
    await delay(101 - speed);
  };

  // BUBBLE SORT
  const bubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight comparing elements
        await updateArray(arr, [j, j + 1], '#fbbf24');

        if (arr[j].value > arr[j + 1].value) {
          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          await updateArray(arr, [j, j + 1], '#ef4444');
        }

        // Reset color
        arr[j].color = '#4ade80';
        arr[j + 1].color = '#4ade80';
        setArray([...arr]);
        await delay(101 - speed);
      }
      // Mark sorted element
      arr[n - 1 - i].color = '#8b5cf6';
    }
    arr[0].color = '#8b5cf6';
    setArray([...arr]);
    setIsSorting(false);
  };

  // SELECTION SORT
  const selectionSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      arr[minIdx].color = '#ef4444';
      setArray([...arr]);
      await delay(101 - speed);

      for (let j = i + 1; j < n; j++) {
        arr[j].color = '#fbbf24';
        setArray([...arr]);
        await delay(101 - speed);

        if (arr[j].value < arr[minIdx].value) {
          arr[minIdx].color = '#4ade80';
          minIdx = j;
          arr[minIdx].color = '#ef4444';
        } else {
          arr[j].color = '#4ade80';
        }
        setArray([...arr]);
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      }
      arr[minIdx].color = '#4ade80';
      arr[i].color = '#8b5cf6';
      setArray([...arr]);
      await delay(101 - speed);
    }
    arr[n - 1].color = '#8b5cf6';
    setArray([...arr]);
    setIsSorting(false);
  };

  // INSERTION SORT
  const insertionSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      arr[i].color = '#fbbf24';
      setArray([...arr]);
      await delay(101 - speed);

      while (j >= 0 && arr[j].value > key.value) {
        arr[j].color = '#ef4444';
        setArray([...arr]);
        await delay(101 - speed);

        arr[j + 1] = arr[j];
        arr[j].color = '#4ade80';
        j--;
      }
      arr[j + 1] = key;
      arr[j + 1].color = '#8b5cf6';
      setArray([...arr]);
      await delay(101 - speed);
    }

    arr.forEach(item => item.color = '#8b5cf6');
    setArray([...arr]);
    setIsSorting(false);
  };

  // QUICK SORT
  const quickSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    
    const partition = async (low, high) => {
      let pivot = arr[high].value;
      arr[high].color = '#ef4444';
      setArray([...arr]);
      await delay(101 - speed);

      let i = low - 1;

      for (let j = low; j < high; j++) {
        arr[j].color = '#fbbf24';
        setArray([...arr]);
        await delay(101 - speed);

        if (arr[j].value < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await delay(101 - speed);
        }
        arr[j].color = '#4ade80';
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      arr[i + 1].color = '#8b5cf6';
      setArray([...arr]);
      await delay(101 - speed);
      
      return i + 1;
    };

    const quickSortHelper = async (low, high) => {
      if (low < high) {
        let pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      } else if (low === high) {
        arr[low].color = '#8b5cf6';
        setArray([...arr]);
      }
    };

    await quickSortHelper(0, arr.length - 1);
    setIsSorting(false);
  };

  // MERGE SORT
  const mergeSort = async () => {
    setIsSorting(true);
    let arr = [...array];

    const merge = async (left, mid, right) => {
      let n1 = mid - left + 1;
      let n2 = right - mid;
      let leftArr = arr.slice(left, mid + 1);
      let rightArr = arr.slice(mid + 1, right + 1);

      let i = 0, j = 0, k = left;

      while (i < n1 && j < n2) {
        arr[k].color = '#fbbf24';
        setArray([...arr]);
        await delay(101 - speed);

        if (leftArr[i].value <= rightArr[j].value) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        arr[k].color = '#8b5cf6';
        setArray([...arr]);
        k++;
      }

      while (i < n1) {
        arr[k] = leftArr[i];
        arr[k].color = '#8b5cf6';
        setArray([...arr]);
        await delay(101 - speed);
        i++;
        k++;
      }

      while (j < n2) {
        arr[k] = rightArr[j];
        arr[k].color = '#8b5cf6';
        setArray([...arr]);
        await delay(101 - speed);
        j++;
        k++;
      }
    };

    const mergeSortHelper = async (left, right) => {
      if (left < right) {
        let mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
      }
    };

    await mergeSortHelper(0, arr.length - 1);
    setIsSorting(false);
  };

  const handleSort = () => {
    switch (algorithm) {
      case 'bubble':
        bubbleSort();
        break;
      case 'selection':
        selectionSort();
        break;
      case 'insertion':
        insertionSort();
        break;
      case 'quick':
        quickSort();
        break;
      case 'merge':
        mergeSort();
        break;
      default:
        bubbleSort();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 Algorithm Visualizer</h1>
        <p>Visualize sorting algorithms in real-time</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <label>Algorithm:</label>
          <select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isSorting}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="merge">Merge Sort</option>
          </select>
        </div>

        <div className="control-group">
          <label>Array Size: {arraySize}</label>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isSorting}
          />
        </div>

        <div className="control-group">
          <label>Speed: {speed}</label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isSorting}
          />
        </div>

        <button onClick={generateArray} disabled={isSorting} className="btn">
          Generate New Array
        </button>
        <button onClick={handleSort} disabled={isSorting} className="btn btn-primary">
          {isSorting ? 'Sorting...' : 'Start Sort'}
        </button>
      </div>

      <div className="array-container">
        {array.map((item, idx) => (
          <div
            key={idx}
            className="array-bar"
            style={{
              height: `${item.value}px`,
              backgroundColor: item.color,
              width: `${Math.max(800 / arraySize, 3)}px`
            }}
          >
            {arraySize <= 20 && <span className="bar-value">{item.value}</span>}
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#4ade80'}}></div>
          <span>Unsorted</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#fbbf24'}}></div>
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#ef4444'}}></div>
          <span>Swapping</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#8b5cf6'}}></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
}

export default App;