---
title: Heap Implementation in C++
tags:
  - Heap
  - Data-Structure
date: "2018-03-06T02:19:44.000Z"
draft: false
---

A Binary Heap is a Binary Tree with following properties.
1) It’s a complete tree (All levels are completely filled except possibly the last level and the last level has all keys as left as possible). This property of Binary Heap makes them suitable to be stored in an array.

2) A Binary Heap is either Min Heap or Max Heap. In a Min Binary Heap, the key at root must be minimum among all keys present in Binary Heap. The same property must be recursively true for all nodes in Binary Tree. Max Binary Heap is similar to Min Heap.

### Examples of Min Heap:

```
            10                      10
         /      \               /       \  
       20        100          15         30  
      /                      /  \        /  \
    30                     40    50    100   40

```

## Implementation `<vector>`
```
#include <iostream>
#include <vector>

using namespace std;

template <class T>
class Heap {
  vector<T> list;

  void bubbleUp();
  void bubbleDown();
  void swap(int child, int parent);
  int getLeftChild(int parent);
  int getRightChild(int parent);
  int getParent(int child);
public:
  Heap();
  void insert(T );
  T remove();
  int getSize();

};

template <class T>
Heap<T> :: Heap(){
  
}

template <class T>
int Heap<T> :: getSize(){
  return list.size();
}

template <class T>
void Heap<T>::swap(int child, int parent) {
  T temp;
  temp = list[child];
  list[child] = list[parent];
  list[parent] = temp;
}

template <class T>
int Heap<T> :: getParent(int child) {
  if (child % 2 == 0)
	return (child /2 ) -1;
  else 
	return child/2;
  
}

template <class T>
int Heap<T> :: getLeftChild(int parent){
  return 2*parent +1;
}

template <class T>
int Heap<T> :: getRightChild(int parent){
  return 2 * parent + 2;
}

template <class T>
void Heap<T> :: insert(T value) {

  list.push_back(value);
  bubbleUp();

}

template <class T>
void Heap <T>:: bubbleUp() {
  int child = list.size() - 1;
  int parent = getParent(child);
  
  while (list[child] > list[parent] && child >=0 && parent >= 0) {
	
	swap(child, parent);
	child = parent;
	parent = getParent(child);

  }
  
  
}


template <class T>
T Heap<T> :: remove() {
  int child = list.size()  - 1;
  swap(child, 0);
  
  T value = list.back();
  list.pop_back();
  
  bubbleDown();
  
  return value;
	

}


template <class T>
void Heap<T> :: bubbleDown() {
  int parent = 0;

  while (1) {
	int left = getLeftChild(parent);
	int right = getRightChild(parent);
	int length = list.size();
	int largest = parent;

	if (left < length && list[left] > list[largest])
	  largest = left;

	if (right < length && list[right] > list[largest])
	  largest = right;

	if (largest != parent) {
	  swap(largest, parent);
	  parent = largest;
	}
	else 
	  break;
	

  }

}

int main(){
  int a[] = {4, 5,2,3,6,7};
  Heap<int> heap;
  int len = sizeof(a) /sizeof(int);
  int i =0;
  for (i = 0; i < len; i++)
	{
	  heap.insert(a[i]);
	}

  while(heap.getSize() > 0)
	cout<<"Heap Max\t"<< heap.remove()<<endl;
  return 0;

}
```

## Implementation `array pointer`
```
// A C++ program to demonstrate common Binary Heap Operations
#include<iostream>
#include<climits>
using namespace std;
 
// Prototype of a utility function to swap two integers
void swap(int *x, int *y);
 
// A class for Min Heap
class MinHeap
{
    int *harr; // pointer to array of elements in heap
    int capacity; // maximum possible size of min heap
    int heap_size; // Current number of elements in min heap
public:
    // Constructor
    MinHeap(int capacity);
 
    // to heapify a subtree with root at given index
    void MinHeapify(int );
 
    int parent(int i) { return (i-1)/2; }
 
    // to get index of left child of node at index i
    int left(int i) { return (2*i + 1); }
 
    // to get index of right child of node at index i
    int right(int i) { return (2*i + 2); }
 
    // to extract the root which is the minimum element
    int extractMin();
 
    // Decreases key value of key at index i to new_val
    void decreaseKey(int i, int new_val);
 
    // Returns the minimum key (key at root) from min heap
    int getMin() { return harr[0]; }
 
    // Deletes a key stored at index i
    void deleteKey(int i);
 
    // Inserts a new key 'k'
    void insertKey(int k);
};
 
// Constructor: Builds a heap from a given array a[] of given size
MinHeap::MinHeap(int cap)
{
    heap_size = 0;
    capacity = cap;
    harr = new int[cap];
}
 
// Inserts a new key 'k'
void MinHeap::insertKey(int k)
{
    if (heap_size == capacity)
    {
        cout << "\nOverflow: Could not insertKey\n";
        return;
    }
 
    // First insert the new key at the end
    heap_size++;
    int i = heap_size - 1;
    harr[i] = k;
 
    // Fix the min heap property if it is violated
    while (i != 0 && harr[parent(i)] > harr[i])
    {
       swap(&harr[i], &harr[parent(i)]);
       i = parent(i);
    }
}
 
// Decreases value of key at index 'i' to new_val.  It is assumed that
// new_val is smaller than harr[i].
void MinHeap::decreaseKey(int i, int new_val)
{
    harr[i] = new_val;
    while (i != 0 && harr[parent(i)] > harr[i])
    {
       swap(&harr[i], &harr[parent(i)]);
       i = parent(i);
    }
}
 
// Method to remove minimum element (or root) from min heap
int MinHeap::extractMin()
{
    if (heap_size <= 0)
        return INT_MAX;
    if (heap_size == 1)
    {
        heap_size--;
        return harr[0];
    }
 
    // Store the minimum value, and remove it from heap
    int root = harr[0];
    harr[0] = harr[heap_size-1];
    heap_size--;
    MinHeapify(0);
 
    return root;
}
 
 
// This function deletes key at index i. It first reduced value to minus
// infinite, then calls extractMin()
void MinHeap::deleteKey(int i)
{
    decreaseKey(i, INT_MIN);
    extractMin();
}
 
// A recursive method to heapify a subtree with root at given index
// This method assumes that the subtrees are already heapified
void MinHeap::MinHeapify(int i)
{
    int l = left(i);
    int r = right(i);
    int smallest = i;
    if (l < heap_size && harr[l] < harr[i])
        smallest = l;
    if (r < heap_size && harr[r] < harr[smallest])
        smallest = r;
    if (smallest != i)
    {
        swap(&harr[i], &harr[smallest]);
        MinHeapify(smallest);
    }
}
 
// A utility function to swap two elements
void swap(int *x, int *y)
{
    int temp = *x;
    *x = *y;
    *y = temp;
}
 
// Driver program to test above functions
int main()
{
    MinHeap h(11);
    h.insertKey(3);
    h.insertKey(2);
    h.deleteKey(1);
    h.insertKey(15);
    h.insertKey(5);
    h.insertKey(4);
    h.insertKey(45);
    cout << h.extractMin() << " ";
    cout << h.getMin() << " ";
    h.decreaseKey(2, 1);
    cout << h.getMin();
    return 0;
}
```