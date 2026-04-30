export const CODE_SNIPPETS = {
  javascript: `// ===== HEAPIFY: Maintains max heap property for a subtree =====
function heapify(arr, n, i) {
  // Assume node i is largest initially
  let largest = i;
  // Left child index in array representation: 2*i + 1
  const left = 2 * i + 1;
  // Right child index: 2*i + 2
  const right = 2 * i + 2;
  
  // Check if left child exists and is greater than parent
  if (left < n && arr[left] > arr[largest]) {
    largest = left;  // Update largest if left child is bigger
  }
  // Check if right child exists and is greater than current largest
  if (right < n && arr[right] > arr[largest]) {
    largest = right;  // Update largest if right child is bigger
  }
  
  // If largest changed, swap parent with larger child and recurse
  if (largest !== i) {
    // Swap parent and child
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    // Recursively heapify the affected subtree
    heapify(arr, n, largest);
  }
}

// ===== HEAP SORT: Main sorting function =====
function heapSort(arr) {
  const n = arr.length;
  
  // PHASE 1: Build max heap from unsorted array
  // Start from last non-leaf node: floor(n/2) - 1
  // Work backwards to root, calling heapify on each node
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // PHASE 2: Extract elements one by one from heap
  // After building heap, root (arr[0]) is maximum
  for (let i = n - 1; i > 0; i--) {
    // Move current root (max) to end of array
    [arr[0], arr[i]] = [arr[i], arr[0]];
    // Heapify reduced heap (excluding last i+1 elements)
    heapify(arr, i, 0);
  }
  
  return arr;  // Array is now sorted
}

// Example usage
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(heapSort(arr)); // [11, 12, 22, 25, 34, 64, 90]`,

  python: `# ===== HEAPIFY: Maintains max heap property =====
def heapify(arr, n, i):
    # Assume current node i is largest
    largest = i
    # Left child index: 2*i + 1
    left = 2 * i + 1
    # Right child index: 2*i + 2
    right = 2 * i + 2
    
    # Compare with left child
    if left < n and arr[left] > arr[largest]:
        largest = left  # Update if left child is greater
    # Compare with right child
    if right < n and arr[right] > arr[largest]:
        largest = right  # Update if right child is greater
    
    # If a child was larger, swap and heapify recursively
    if largest != i:
        # Swap parent and larger child
        arr[i], arr[largest] = arr[largest], arr[i]
        # Recursively heapify the subtree at largest
        heapify(arr, n, largest)

# ===== HEAP SORT: Sorts array using heap data structure =====
def heap_sort(arr):
    n = len(arr)
    
    # PHASE 1: Build max heap
    # Start from last non-leaf node and heapify backwards to root
    # Last non-leaf node is at index n//2 - 1
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # PHASE 2: Extract elements from heap
    # Repeatedly move max element to end and reduce heap size
    for i in range(n - 1, 0, -1):
        # Swap root (maximum) with last element
        arr[0], arr[i] = arr[i], arr[0]
        # Heapify reduced heap (size i)
        heapify(arr, i, 0)
    
    return arr  # Array is now sorted

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
print(heap_sort(arr))  # [11, 12, 22, 25, 34, 64, 90]`,

  java: `// ===== HEAP SORT IN JAVA =====
public class HeapSort {
  // ===== HEAPIFY: Maintain max heap property for subtree rooted at i =====
  static void heapify(int[] arr, int n, int i) {
    // Assume node i is largest
    int largest = i;
    // Left child in array representation
    int left = 2 * i + 1;
    // Right child
    int right = 2 * i + 2;
    
    // Check if left child exists and is greater than parent
    if (left < n && arr[left] > arr[largest]) {
      largest = left;  // Update if left is larger
    }
    // Check if right child exists and is greater than current largest
    if (right < n && arr[right] > arr[largest]) {
      largest = right;  // Update if right is larger
    }
    
    // If largest changed, swap and recurse
    if (largest != i) {
      // Swap parent with larger child
      int temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      // Recursively heapify the affected subtree
      heapify(arr, n, largest);
    }
  }
  
  // ===== MAIN HEAP SORT FUNCTION =====
  static void heapSort(int[] arr) {
    int n = arr.length;
    
    // PHASE 1: Build max heap from array
    // Start from last non-leaf node (n/2 - 1) and work backwards
    for (int i = n / 2 - 1; i >= 0; i--) {
      heapify(arr, n, i);
    }
    
    // PHASE 2: Extract elements one by one
    // Repeatedly move max element (root) to end
    for (int i = n - 1; i > 0; i--) {
      // Swap root with last element
      int temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      // Heapify reduced heap
      heapify(arr, i, 0);
    }
  }
}`,

  cpp: `#include <iostream>
using namespace std;

// ===== HEAPIFY: Maintain max heap property =====
void heapify(int arr[], int n, int i) {
  // Assume current node i is largest
  int largest = i;
  // Left child index
  int left = 2 * i + 1;
  // Right child index
  int right = 2 * i + 2;
  
  // Compare with left child
  if (left < n && arr[left] > arr[largest]) {
    largest = left;  // Update if left child is greater
  }
  // Compare with right child
  if (right < n && arr[right] > arr[largest]) {
    largest = right;  // Update if right child is greater
  }
  
  // If largest changed, swap and heapify recursively
  if (largest != i) {
    // Swap parent and larger child
    swap(arr[i], arr[largest]);
    // Recursively heapify the affected subtree
    heapify(arr, n, largest);
  }
}

// ===== MAIN HEAP SORT FUNCTION =====
void heapSort(int arr[], int n) {
  // PHASE 1: Build max heap from array
  // Start from last non-leaf (n/2-1) and work to root
  for (int i = n / 2 - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // PHASE 2: Extract elements one by one
  // Move max element to end repeatedly
  for (int i = n - 1; i > 0; i--) {
    // Swap root (max) with last element
    swap(arr[0], arr[i]);
    // Heapify reduced heap
    heapify(arr, i, 0);
  }
}

int main() {
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  heapSort(arr, 7);
  for (int x : arr) cout << x << " ";  // Output: 11 12 22 25 34 64 90
  return 0;
}`,

  c: `#include <stdio.h>

// ===== HEAPIFY: Maintain max heap property =====
void heapify(int arr[], int n, int i) {
  // Assume node i is largest
  int largest = i;
  // Left child index: 2*i+1
  int left = 2 * i + 1;
  // Right child index: 2*i+2
  int right = 2 * i + 2;
  
  // Check if left child is greater than parent
  if (left < n && arr[left] > arr[largest]) {
    largest = left;  // Update largest if left is bigger
  }
  // Check if right child is greater than current largest
  if (right < n && arr[right] > arr[largest]) {
    largest = right;  // Update largest if right is bigger
  }
  
  // If largest is not parent, swap and recurse
  if (largest != i) {
    // Swap parent and larger child
    int temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    // Recursively heapify the affected subtree
    heapify(arr, n, largest);
  }
}

// ===== MAIN HEAP SORT FUNCTION =====
void heapSort(int arr[], int n) {
  // PHASE 1: Build max heap
  // Start from last non-leaf node (n/2-1) down to root
  for (int i = n / 2 - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // PHASE 2: Extract elements from heap
  // Move max to end and reduce heap size
  for (int i = n - 1; i > 0; i--) {
    // Swap root (max) with last element
    int temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    // Heapify the reduced heap
    heapify(arr, i, 0);
  }
}

int main() {
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  heapSort(arr, 7);
  // Print sorted array
  for (int i = 0; i < 7; i++)
    printf("%d ", arr[i]);  // Output: 11 12 22 25 34 64 90
  return 0;
}`,

  csharp: `using System;

// ===== HEAP SORT IN C# =====
class HeapSort {
  // ===== HEAPIFY: Maintain max heap property =====
  static void Heapify(int[] arr, int n, int i) {
    // Assume current node is largest
    int largest = i;
    // Left child index
    int left = 2 * i + 1;
    // Right child index
    int right = 2 * i + 2;
    
    // Compare with left child
    if (left < n && arr[left] > arr[largest]) {
      largest = left;  // Update if left is greater
    }
    // Compare with right child
    if (right < n && arr[right] > arr[largest]) {
      largest = right;  // Update if right is greater
    }
    
    // If largest changed, swap and heapify recursively
    if (largest != i) {
      // Swap parent with larger child
      int temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      // Recursively heapify the affected subtree
      Heapify(arr, n, largest);
    }
  }
  
  // ===== MAIN HEAP SORT FUNCTION =====
  static void HeapSortAlgo(int[] arr) {
    int n = arr.Length;
    
    // PHASE 1: Build max heap
    // Start from last non-leaf and work backwards to root
    for (int i = n / 2 - 1; i >= 0; i--) {
      Heapify(arr, n, i);
    }
    
    // PHASE 2: Extract elements
    // Move max to end and reduce heap
    for (int i = n - 1; i > 0; i--) {
      // Swap root with last element
      int temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      // Heapify the reduced heap
      Heapify(arr, i, 0);
    }
  }
  
  static void Main() {
    int[] arr = {64, 34, 25, 12, 22, 11, 90};
    HeapSortAlgo(arr);
    Console.WriteLine(string.Join(", ", arr));  // Output: 11, 12, 22, 25, 34, 64, 90
  }
}`,

  go: `package main

import "fmt"

// ===== HEAPIFY: Maintain max heap property =====
func heapify(arr []int, n, i int) {
  // Assume current node is largest
  largest := i
  // Left child index
  left := 2*i + 1
  // Right child index
  right := 2*i + 2
  
  // Compare with left child
  if left < n && arr[left] > arr[largest] {
    largest = left  // Update if left is greater
  }
  // Compare with right child
  if right < n && arr[right] > arr[largest] {
    largest = right  // Update if right is greater
  }
  
  // If largest changed, swap and recurse
  if largest != i {
    // Swap parent with larger child (Go syntax: parallel assignment)
    arr[i], arr[largest] = arr[largest], arr[i]
    // Recursively heapify the affected subtree
    heapify(arr, n, largest)
  }
}

// ===== MAIN HEAP SORT FUNCTION =====
func heapSort(arr []int) {
  n := len(arr)
  
  // PHASE 1: Build max heap
  // Start from last non-leaf (n/2-1) and work to root
  for i := n/2 - 1; i >= 0; i-- {
    heapify(arr, n, i)
  }
  
  // PHASE 2: Extract elements from heap
  // Move max to end and reduce heap size
  for i := n - 1; i > 0; i-- {
    // Swap root with last element
    arr[0], arr[i] = arr[i], arr[0]
    // Heapify the reduced heap
    heapify(arr, i, 0)
  }
}

func main() {
  arr := []int{64, 34, 25, 12, 22, 11, 90}
  heapSort(arr)
  fmt.Println(arr)  // Output: [11 12 22 25 34 64 90]
}`,

  rust: `// ===== HEAPIFY: Maintain max heap property =====
fn heapify(arr: &mut [i32], n: usize, i: usize) {
  // Assume current node is largest
  let mut largest = i;
  // Left child index
  let left = 2 * i + 1;
  // Right child index
  let right = 2 * i + 2;
  
  // Compare with left child
  if left < n && arr[left] > arr[largest] {
    largest = left;  // Update if left is greater
  }
  // Compare with right child
  if right < n && arr[right] > arr[largest] {
    largest = right;  // Update if right is greater
  }
  
  // If largest changed, swap and recurse
  if largest != i {
    // Swap parent with larger child using Rust's swap method
    arr.swap(i, largest);
    // Recursively heapify the affected subtree
    heapify(arr, n, largest);
  }
}

// ===== MAIN HEAP SORT FUNCTION =====
fn heap_sort(arr: &mut [i32]) {
  let n = arr.len();
  
  // PHASE 1: Build max heap
  // Start from last non-leaf (n/2-1) and work to root
  // Use .rev() to iterate backwards
  for i in (0..n / 2).rev() {
    heapify(arr, n, i);
  }
  
  // PHASE 2: Extract elements from heap
  // Move max to end and reduce heap
  for i in (1..n).rev() {
    // Swap root with element at position i
    arr.swap(0, i);
    // Heapify the reduced heap
    heapify(arr, i, 0);
  }
}

fn main() {
  let mut arr = vec![64, 34, 25, 12, 22, 11, 90];
  heap_sort(&mut arr);
  println!("{:?}", arr);  // Output: [11, 12, 22, 25, 34, 64, 90]
}`,
};
