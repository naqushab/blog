webpackJsonp([77232207595528],{444:function(n,e){n.exports={data:{site:{siteMetadata:{author:"Naqushab Neyazee",homeCity:"Noida"}},markdownRemark:{html:'<p>A Binary Heap is a Binary Tree with following properties.</p>\n<ol>\n<li>\n<p>It’s a complete tree (All levels are completely filled except possibly the last level and the last level has all keys as left as possible). This property of Binary Heap makes them suitable to be stored in an array.</p>\n</li>\n<li>\n<p>A Binary Heap is either Min Heap or Max Heap. In a Min Binary Heap, the key at root must be minimum among all keys present in Binary Heap. The same property must be recursively true for all nodes in Binary Tree. Max Binary Heap is similar to Min Heap.</p>\n</li>\n</ol>\n<h3>Examples of Min Heap:</h3>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">            10                      10\n         /      \\               /       \\  \n       20        100          15         30  \n      /                      /  \\        /  \\\n    30                     40    50    100   40</code></pre>\n      </div>\n<h2>Implementation <code>&#x3C;vector></code></h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">#include <iostream>\n#include <vector>\n\nusing namespace std;\n\ntemplate <class T>\nclass Heap {\n  vector<T> list;\n\n  void bubbleUp();\n  void bubbleDown();\n  void swap(int child, int parent);\n  int getLeftChild(int parent);\n  int getRightChild(int parent);\n  int getParent(int child);\npublic:\n  Heap();\n  void insert(T );\n  T remove();\n  int getSize();\n\n};\n\ntemplate <class T>\nHeap<T> :: Heap(){\n  \n}\n\ntemplate <class T>\nint Heap<T> :: getSize(){\n  return list.size();\n}\n\ntemplate <class T>\nvoid Heap<T>::swap(int child, int parent) {\n  T temp;\n  temp = list[child];\n  list[child] = list[parent];\n  list[parent] = temp;\n}\n\ntemplate <class T>\nint Heap<T> :: getParent(int child) {\n  if (child % 2 == 0)\n\treturn (child /2 ) -1;\n  else \n\treturn child/2;\n  \n}\n\ntemplate <class T>\nint Heap<T> :: getLeftChild(int parent){\n  return 2*parent +1;\n}\n\ntemplate <class T>\nint Heap<T> :: getRightChild(int parent){\n  return 2 * parent + 2;\n}\n\ntemplate <class T>\nvoid Heap<T> :: insert(T value) {\n\n  list.push_back(value);\n  bubbleUp();\n\n}\n\ntemplate <class T>\nvoid Heap <T>:: bubbleUp() {\n  int child = list.size() - 1;\n  int parent = getParent(child);\n  \n  while (list[child] > list[parent] && child >=0 && parent >= 0) {\n\t\n\tswap(child, parent);\n\tchild = parent;\n\tparent = getParent(child);\n\n  }\n  \n  \n}\n\n\ntemplate <class T>\nT Heap<T> :: remove() {\n  int child = list.size()  - 1;\n  swap(child, 0);\n  \n  T value = list.back();\n  list.pop_back();\n  \n  bubbleDown();\n  \n  return value;\n\t\n\n}\n\n\ntemplate <class T>\nvoid Heap<T> :: bubbleDown() {\n  int parent = 0;\n\n  while (1) {\n\tint left = getLeftChild(parent);\n\tint right = getRightChild(parent);\n\tint length = list.size();\n\tint largest = parent;\n\n\tif (left < length && list[left] > list[largest])\n\t  largest = left;\n\n\tif (right < length && list[right] > list[largest])\n\t  largest = right;\n\n\tif (largest != parent) {\n\t  swap(largest, parent);\n\t  parent = largest;\n\t}\n\telse \n\t  break;\n\t\n\n  }\n\n}\n\nint main(){\n  int a[] = {4, 5,2,3,6,7};\n  Heap<int> heap;\n  int len = sizeof(a) /sizeof(int);\n  int i =0;\n  for (i = 0; i < len; i++)\n\t{\n\t  heap.insert(a[i]);\n\t}\n\n  while(heap.getSize() > 0)\n\tcout<<"Heap Max\\t"<< heap.remove()<<endl;\n  return 0;\n\n}</code></pre>\n      </div>\n<h2>Implementation <code>array pointer</code></h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">// A C++ program to demonstrate common Binary Heap Operations\n#include<iostream>\n#include<climits>\nusing namespace std;\n \n// Prototype of a utility function to swap two integers\nvoid swap(int *x, int *y);\n \n// A class for Min Heap\nclass MinHeap\n{\n    int *harr; // pointer to array of elements in heap\n    int capacity; // maximum possible size of min heap\n    int heap_size; // Current number of elements in min heap\npublic:\n    // Constructor\n    MinHeap(int capacity);\n \n    // to heapify a subtree with root at given index\n    void MinHeapify(int );\n \n    int parent(int i) { return (i-1)/2; }\n \n    // to get index of left child of node at index i\n    int left(int i) { return (2*i + 1); }\n \n    // to get index of right child of node at index i\n    int right(int i) { return (2*i + 2); }\n \n    // to extract the root which is the minimum element\n    int extractMin();\n \n    // Decreases key value of key at index i to new_val\n    void decreaseKey(int i, int new_val);\n \n    // Returns the minimum key (key at root) from min heap\n    int getMin() { return harr[0]; }\n \n    // Deletes a key stored at index i\n    void deleteKey(int i);\n \n    // Inserts a new key \'k\'\n    void insertKey(int k);\n};\n \n// Constructor: Builds a heap from a given array a[] of given size\nMinHeap::MinHeap(int cap)\n{\n    heap_size = 0;\n    capacity = cap;\n    harr = new int[cap];\n}\n \n// Inserts a new key \'k\'\nvoid MinHeap::insertKey(int k)\n{\n    if (heap_size == capacity)\n    {\n        cout << "\\nOverflow: Could not insertKey\\n";\n        return;\n    }\n \n    // First insert the new key at the end\n    heap_size++;\n    int i = heap_size - 1;\n    harr[i] = k;\n \n    // Fix the min heap property if it is violated\n    while (i != 0 && harr[parent(i)] > harr[i])\n    {\n       swap(&harr[i], &harr[parent(i)]);\n       i = parent(i);\n    }\n}\n \n// Decreases value of key at index \'i\' to new_val.  It is assumed that\n// new_val is smaller than harr[i].\nvoid MinHeap::decreaseKey(int i, int new_val)\n{\n    harr[i] = new_val;\n    while (i != 0 && harr[parent(i)] > harr[i])\n    {\n       swap(&harr[i], &harr[parent(i)]);\n       i = parent(i);\n    }\n}\n \n// Method to remove minimum element (or root) from min heap\nint MinHeap::extractMin()\n{\n    if (heap_size <= 0)\n        return INT_MAX;\n    if (heap_size == 1)\n    {\n        heap_size--;\n        return harr[0];\n    }\n \n    // Store the minimum value, and remove it from heap\n    int root = harr[0];\n    harr[0] = harr[heap_size-1];\n    heap_size--;\n    MinHeapify(0);\n \n    return root;\n}\n \n \n// This function deletes key at index i. It first reduced value to minus\n// infinite, then calls extractMin()\nvoid MinHeap::deleteKey(int i)\n{\n    decreaseKey(i, INT_MIN);\n    extractMin();\n}\n \n// A recursive method to heapify a subtree with root at given index\n// This method assumes that the subtrees are already heapified\nvoid MinHeap::MinHeapify(int i)\n{\n    int l = left(i);\n    int r = right(i);\n    int smallest = i;\n    if (l < heap_size && harr[l] < harr[i])\n        smallest = l;\n    if (r < heap_size && harr[r] < harr[smallest])\n        smallest = r;\n    if (smallest != i)\n    {\n        swap(&harr[i], &harr[smallest]);\n        MinHeapify(smallest);\n    }\n}\n \n// A utility function to swap two elements\nvoid swap(int *x, int *y)\n{\n    int temp = *x;\n    *x = *y;\n    *y = temp;\n}\n \n// Driver program to test above functions\nint main()\n{\n    MinHeap h(11);\n    h.insertKey(3);\n    h.insertKey(2);\n    h.deleteKey(1);\n    h.insertKey(15);\n    h.insertKey(5);\n    h.insertKey(4);\n    h.insertKey(45);\n    cout << h.extractMin() << " ";\n    cout << h.getMin() << " ";\n    h.decreaseKey(2, 1);\n    cout << h.getMin();\n    return 0;\n}</code></pre>\n      </div>',excerpt:"A Binary Heap is a Binary Tree with following properties. It’s a complete tree (All levels are completely filled except possibly the last…",fields:{tagSlugs:["/tags/heap/","/tags/data-structure/"]},frontmatter:{title:"Heap Implementation in C++",tags:["Heap","Data-Structure"],date:"March 06, 2018"}}},pathContext:{slug:"/heap-implementation=c/"}}}});
//# sourceMappingURL=path---heap-implementation-c-bfe57a95992ff77f87d7.js.map