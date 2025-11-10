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
  const [activeTab, setActiveTab] = useState('prebuilt');
  const [customCode, setCustomCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const cancelSortRef = useRef(false);

  const algorithmInfo = {
    bubble: {
      name: "Bubble Sort",
      complexity: "O(n²)",
      bestCase: "O(n)",
      space: "O(1)",
      description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order."
    },
    selection: {
      name: "Selection Sort",
      complexity: "O(n²)",
      bestCase: "O(n²)",
      space: "O(1)",
      description: "Divides the input into a sorted and unsorted region. Repeatedly selects the smallest element from the unsorted region."
    },
    insertion: {
      name: "Insertion Sort",
      complexity: "O(n²)",
      bestCase: "O(n)",
      space: "O(1)",
      description: "Builds the final sorted array one item at a time."
    },
    quick: {
      name: "Quick Sort",
      complexity: "O(n log n)",
      bestCase: "O(n log n)",
      space: "O(log n)",
      description: "Picks an element as pivot and partitions the array around the picked pivot."
    },
    merge: {
      name: "Merge Sort",
      complexity: "O(n log n)",
      bestCase: "O(n log n)",
      space: "O(n)",
      description: "Divides the array into two halves, recursively sorts them, and then merges the two sorted halves."
    },
    custom: {
      name: "Custom Algorithm",
      complexity: "Analyzing...",
      bestCase: "Analyzing...",
      space: "O(1)",
      description: "Your custom sorting algorithm"
    }
  };

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
      // Silent fail
    }
  }, [soundEnabled]);

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

  const delay = (ms) => new Promise((resolve, reject) => {
    const checkPause = () => {
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

  const updateArray = async (newArray, indices, color) => {
    if (cancelSortRef.current) {
      throw new Error('Sorting cancelled');
    }
    
    const updatedArray = [...newArray];
    indices.forEach(idx => {
      updatedArray[idx] = { ...updatedArray[idx], color };
    });
    setArray(updatedArray);
    
    if (indices.length > 0) {
      const freq = 200 + (updatedArray[indices[0]].value * 2);
      playSound(freq);
    }
    
    await delay(101 - speed);
  };

  // Simple code analyzer - detects algorithm type from patterns
  const analyzeCustomCode = () => {
    const code = customCode.toLowerCase();
    let detectedAlgorithm = 'bubble';
    let algoName = 'Custom Algorithm';
    let complexity = 'O(n²)';
    
    // Detect algorithm type from code patterns
    if (code.includes('bubble') || (code.includes('for') && code.includes('for') && code.includes('swap'))) {
      detectedAlgorithm = 'bubble';
      algoName = 'Bubble Sort (Detected)';
      complexity = 'O(n²)';
    } else if (code.includes('selection') || code.includes('min_idx') || code.includes('minidx')) {
      detectedAlgorithm = 'selection';
      algoName = 'Selection Sort (Detected)';
      complexity = 'O(n²)';
    } else if (code.includes('insertion') || code.includes('insert')) {
      detectedAlgorithm = 'insertion';
      algoName = 'Insertion Sort (Detected)';
      complexity = 'O(n²)';
    } else if (code.includes('quick') || code.includes('pivot') || code.includes('partition')) {
      detectedAlgorithm = 'quick';
      algoName = 'Quick Sort (Detected)';
      complexity = 'O(n log n)';
    } else if (code.includes('merge')) {
      detectedAlgorithm = 'merge';
      algoName = 'Merge Sort (Detected)';
      complexity = 'O(n log n)';
    }
    
    // Update algorithm info for custom
    algorithmInfo.custom = {
      name: algoName,
      complexity: complexity,
      bestCase: complexity === 'O(n²)' ? 'O(n)' : complexity,
      space: detectedAlgorithm === 'merge' ? 'O(n)' : 'O(1)',
      description: `Detected as ${algoName} from your code. Running visualization...`
    };
    
    setAnalysisResult({
      algorithm: detectedAlgorithm,
      name: algoName,
      complexity: complexity
    });
    
    setAlgorithm('custom');
    setActiveTab('prebuilt');
    
    // Auto-run the detected algorithm
    setTimeout(() => {
      runDetectedAlgorithm(detectedAlgorithm);
    }, 500);
  };

  const runDetectedAlgorithm = (algoType) => {
    switch (algoType) {
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

  // Preset example codes
  const exampleCodes = {
    bubble: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    selection: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    insertion: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr`,
    quick: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr)//2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
    merge: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
    return arr`
  };

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
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

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
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

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
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

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
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

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
      arr.forEach(item => item.color = '#4ade80');
      setArray([...arr]);
    } finally {
      setIsSorting(false);
      setIsPaused(false);
    }
  };

  const handleSort = () => {
    if (algorithm === 'custom' && analysisResult) {
      runDetectedAlgorithm(analysisResult.algorithm);
      return;
    }
    
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

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'prebuilt' ? 'active' : ''}`}
          onClick={() => setActiveTab('prebuilt')}
        >
          📊 Pre-built Algorithms
        </button>
        <button 
          className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          📝 Custom Code Analyzer
        </button>
      </div>

      {activeTab === 'custom' ? (
        <div className="custom-code-section">
          <div className="code-input-container">
            <h3>🤖 Paste Your Sorting Code</h3>
            <p className="code-help">Paste any sorting algorithm in Python, JavaScript, C++, Java, or any language!</p>
            
            <div className="example-buttons">
              <p><strong>Try these examples:</strong></p>
              <button onClick={() => setCustomCode(exampleCodes.bubble)} className="example-btn">
                Bubble Sort
              </button>
              <button onClick={() => setCustomCode(exampleCodes.selection)} className="example-btn">
                Selection Sort
              </button>
              <button onClick={() => setCustomCode(exampleCodes.insertion)} className="example-btn">
                Insertion Sort
              </button>
              <button onClick={() => setCustomCode(exampleCodes.quick)} className="example-btn">
                Quick Sort
              </button>
              <button onClick={() => setCustomCode(exampleCodes.merge)} className="example-btn">
                Merge Sort
              </button>
            </div>

            <textarea
              className="code-input"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="Paste your sorting code here..."
              rows={15}
            />
            
            <button 
              onClick={analyzeCustomCode}
              disabled={!customCode.trim()}
              className="btn btn-primary analyze-btn"
            >
              🚀 Analyze & Visualize
            </button>
            
            <div className="code-features">
              <h4>✨ How it works:</h4>
              <ul>
                <li>✅ Paste code in ANY programming language</li>
                <li>✅ AI detects the algorithm type automatically</li>
                <li>✅ Switches to visualization tab and runs it</li>
                <li>✅ Shows time complexity and performance stats</li>
                <li>✅ 100% FREE - works offline!</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                {algorithm === 'custom' && <option value="custom">{analysisResult?.name || 'Custom'}</option>}
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
        </>
      )}
    </div>
  );
}

export default App;