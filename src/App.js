import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

function App() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  
  // Cancellation flag
  const cancelSortRef = useRef(false);

  // Algorithm information
  const algorithmInfo = {
    bubble: {
      name: "Bubble Sort",
      complexity: "O(n²)",
      bestCase: "O(n)",
      space: "O(1)",
      description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. The pass through the list is repeated until the list is sorted."
    },
    selection: {
      name: "Selection Sort",
      complexity: "O(n²)",
      bestCase: "O(n²)",
      space: "O(1)",
      description: "Divides the input into a sorted and unsorted region. Repeatedly selects the smallest element from the unsorted region and moves it to the sorted region."
    },
    insertion: {
      name: "Insertion Sort",
      complexity: "O(n²)",
      bestCase: "O(n)",
      space: "O(1)",
      description: "Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms like quicksort or merge sort."
    },
    quick: {
      name: "Quick Sort",
      complexity: "O(n log n)",
      bestCase: "O(n log n)",
      space: "O(log n)",
      description: "Picks an element as pivot and partitions the array around the picked pivot. This is one of the most efficient sorting algorithms."
    },
    merge: {
      name: "Merge Sort",
      complexity: "O(n log n)",
      bestCase: "O(n log n)",
      space: "O(n)",
      description: "Divides the array into two halves, recursively sorts them, and then merges the two sorted halves. It's a stable, divide-and-conquer algorithm."
    }
  };

  // Audio Context for sound effects
  const playSound = useCallback((frequency) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Silently fail if audio is not supported
    }
  }, [soundEnabled]);

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 400) + 10,
        color: '#4ade80'
      });
    }
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Delay function for animation with cancellation check
  const delay = (ms) => new Promise((resolve, reject) => {
    const checkPause = () => {
      // Check if sorting was cancelled
      if (cancelSortRef.current) {
        reject(new Error('Sorting cancelled'));
        return;
      }
      
      if (!isPaused) {
        setTimeout(resolve, ms);
      } else {
        setTimeout(checkPause, 100);
      }
    };
    checkPause();
  });

  // Update array with colors and cancellation check
  const updateArray = async (newArray, indices, color) => {
    if (cancelSortRef.current) {
      throw new Error('Sorting cancelled');
    }
    
    const updatedArray = [...newArray];
    indices.forEach(idx => {
      updatedArray[idx] = { ...updatedArray[idx], color };
    });
    setArray(updatedArray);
    
    // Play sound based on comparison
    if (indices.length > 0) {
      const freq = 200 + (updatedArray[indices[0]].value * 2);
      playSound(freq);
    }
    
    await delay(101 - speed);
  };

  // BUBBLE SORT
  const bubbleSort = async () => {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    cancelSortRef.current = false;
    let arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;

    try {
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          compCount++;
          setComparisons(compCount);
          await updateArray(arr, [j, j + 1], '#fbbf24');

          if (arr[j].value > arr[j + 1].value) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapCount++;
            setSwaps(swapCount);
            await updateArray(arr, [j, j + 1], '#ef4444');
          }

          arr[j].color = '#4ade80';
          arr[j + 1].color = '#4ade80';
          setArray([...arr]);
          await delay(101 - speed);
        }
        arr[n - 1 - i].color = '#8b5cf6';
      }
      arr[0].color = '#8b5cf6';
      setArray([...arr]);
    } catch (error) {
      console.log('Sorting stopped by user');
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

  // SELECTION SORT
  const selectionSort = async () => {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    cancelSortRef.current = false;
    let arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;

    try {
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        arr[minIdx].color = '#ef4444';
        setArray([...arr]);
        await delay(101 - speed);

        for (let j = i + 1; j < n; j++) {
          compCount++;
          setComparisons(compCount);
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
          swapCount++;
          setSwaps(swapCount);
        }
        arr[minIdx].color = '#4ade80';
        arr[i].color = '#8b5cf6';
        setArray([...arr]);
        await delay(101 - speed);
      }
      arr[n - 1].color = '#8b5cf6';
      setArray([...arr]);
    } catch (error) {
      console.log('Sorting stopped by user');
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

  // INSERTION SORT
  const insertionSort = async () => {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    cancelSortRef.current = false;
    let arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;

    try {
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        arr[i].color = '#fbbf24';
        setArray([...arr]);
        await delay(101 - speed);

        while (j >= 0 && arr[j].value > key.value) {
          compCount++;
          setComparisons(compCount);
          arr[j].color = '#ef4444';
          setArray([...arr]);
          await delay(101 - speed);

          arr[j + 1] = arr[j];
          swapCount++;
          setSwaps(swapCount);
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
    } catch (error) {
      console.log('Sorting stopped by user');
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

  // QUICK SORT
  const quickSort = async () => {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    cancelSortRef.current = false;
    let arr = [...array];
    let compCount = 0;
    let swapCount = 0;
    
    const partition = async (low, high) => {
      let pivot = arr[high].value;
      arr[high].color = '#ef4444';
      setArray([...arr]);
      await delay(101 - speed);

      let i = low - 1;

      for (let j = low; j < high; j++) {
        compCount++;
        setComparisons(compCount);
        arr[j].color = '#fbbf24';
        setArray([...arr]);
        await delay(101 - speed);

        if (arr[j].value < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swapCount++;
          setSwaps(swapCount);
          setArray([...arr]);
          await delay(101 - speed);
        }
        arr[j].color = '#4ade80';
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      swapCount++;
      setSwaps(swapCount);
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

    try {
      await quickSortHelper(0, arr.length - 1);
    } catch (error) {
      console.log('Sorting stopped by user');
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

  // MERGE SORT
  const mergeSort = async () => {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    cancelSortRef.current = false;
    let arr = [...array];
    let compCount = 0;
    let swapCount = 0;

    const merge = async (left, mid, right) => {
      let n1 = mid - left + 1;
      let n2 = right - mid;
      let leftArr = arr.slice(left, mid + 1);
      let rightArr = arr.slice(mid + 1, right + 1);

      let i = 0, j = 0, k = left;

      while (i < n1 && j < n2) {
        compCount++;
        setComparisons(compCount);
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
        swapCount++;
        setSwaps(swapCount);
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

    try {
      await mergeSortHelper(0, arr.length - 1);
    } catch (error) {
      console.log('Sorting stopped by user');
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
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

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const stopSort = () => {
    cancelSortRef.current = true;
    setIsSorting(false);
    setIsPaused(false);
    setTimeout(() => {
      generateArray();
    }, 100);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 Algorithm Visualizer Pro</h1>
        <p>Visualize, Learn, and Master Sorting Algorithms</p>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Algorithm:</span>
          <span className="stat-value">{algorithmInfo[algorithm].name}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Time Complexity:</span>
          <span className="stat-value complexity">{algorithmInfo[algorithm].complexity}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Space:</span>
          <span className="stat-value">{algorithmInfo[algorithm].space}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Comparisons:</span>
          <span className="stat-value">{comparisons}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Swaps:</span>
          <span className="stat-value">{swaps}</span>
        </div>
      </div>

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

        <button 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          className={`btn ${soundEnabled ? 'btn-sound-on' : 'btn-sound-off'}`}
          title={soundEnabled ? 'Sound On' : 'Sound Off'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        <button 
          onClick={() => setShowInfo(!showInfo)} 
          className="btn btn-info"
          title="Algorithm Info"
        >
          ℹ️ Info
        </button>

        <button onClick={generateArray} disabled={isSorting} className="btn">
          🔄 New Array
        </button>

        {!isSorting ? (
          <button onClick={handleSort} className="btn btn-primary">
            ▶️ Start Sort
          </button>
        ) : (
          <>
            <button onClick={togglePause} className="btn btn-warning">
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button onClick={stopSort} className="btn btn-danger">
              ⏹️ Stop
            </button>
          </>
        )}
      </div>

      {/* Algorithm Info Panel */}
      {showInfo && (
        <div className="info-panel">
          <h3>{algorithmInfo[algorithm].name}</h3>
          <div className="info-content">
            <p><strong>Description:</strong> {algorithmInfo[algorithm].description}</p>
            <div className="complexity-info">
              <div><strong>Time Complexity:</strong> {algorithmInfo[algorithm].complexity}</div>
              <div><strong>Best Case:</strong> {algorithmInfo[algorithm].bestCase}</div>
              <div><strong>Space Complexity:</strong> {algorithmInfo[algorithm].space}</div>
            </div>
          </div>
        </div>
      )}

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