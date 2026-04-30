export const CODE_SNIPPETS = {
  javascript: `// ===== BINARY SEARCH: Efficient search in sorted array =====
function binarySearch(arr, target) {
  // Initialize search boundaries
  let left = 0, right = arr.length - 1;
  
  // Continue while search space exists
  while (left <= right) {
    // Find middle index (avoid overflow: left + (right-left)/2)
    const mid = Math.floor((left + right) / 2);
    
    // Check middle element
    if (arr[mid] === target) {
      return mid;  // Found! Return index
    } else if (arr[mid] < target) {
      // Target is larger, search right half
      left = mid + 1;
    } else {
      // Target is smaller, search left half
      right = mid - 1;
    }
  }
  // Not found - return -1
  return -1;
}

// ===== EXAMPLE USAGE =====
const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90];
console.log(binarySearch(arr, 50)); // 4 (found at index 4)
console.log(binarySearch(arr, 25)); // -1 (not found)`,

  python: `# ===== BINARY SEARCH: Efficient search in sorted array =====
def binary_search(arr, target):
    # Initialize search boundaries
    left, right = 0, len(arr) - 1
    
    # Continue while search space exists
    while left <= right:
        # Find middle index
        mid = (left + right) // 2
        
        # Check middle element
        if arr[mid] == target:
            return mid  # Found! Return index
        elif arr[mid] < target:
            # Target is larger, search right half
            left = mid + 1
        else:
            # Target is smaller, search left half
            right = mid - 1
    
    # Not found - return -1
    return -1

# ===== EXAMPLE USAGE =====
arr = [10, 20, 30, 40, 50, 60, 70, 80, 90]
print(binary_search(arr, 50))  # 4 (found at index 4)
print(binary_search(arr, 25))  # -1 (not found)`,

  java: `// ===== BINARY SEARCH: Efficient search in sorted array =====
public class BinarySearch {
  public static int binarySearch(int[] arr, int target) {
    // Initialize search boundaries
    int left = 0, right = arr.length - 1;
    
    // Continue while search space exists
    while (left <= right) {
      // Find middle index (avoid overflow)
      int mid = left + (right - left) / 2;
      
      // Check middle element
      if (arr[mid] == target) {
        return mid;  // Found! Return index
      } else if (arr[mid] < target) {
        // Target is larger, search right half
        left = mid + 1;
      } else {
        // Target is smaller, search left half
        right = mid - 1;
      }
    }
    // Not found - return -1
    return -1;
  }
  
  // ===== EXAMPLE USAGE =====
  public static void main(String[] args) {
    int[] arr = {10, 20, 30, 40, 50, 60, 70, 80, 90};
    System.out.println(binarySearch(arr, 50));  // 4 (found at index 4)
    System.out.println(binarySearch(arr, 25));  // -1 (not found)
  }
}`,

  cpp: `#include <iostream>
using namespace std;

// ===== BINARY SEARCH: Efficient search in sorted array =====
int binarySearch(int arr[], int n, int target) {
  // Initialize search boundaries
  int left = 0, right = n - 1;
  
  // Continue while search space exists
  while (left <= right) {
    // Find middle index (avoid overflow)
    int mid = left + (right - left) / 2;
    
    // Check middle element
    if (arr[mid] == target) {
      return mid;  // Found! Return index
    } else if (arr[mid] < target) {
      // Target is larger, search right half
      left = mid + 1;
    } else {
      // Target is smaller, search left half
      right = mid - 1;
    }
  }
  // Not found - return -1
  return -1;
}

// ===== EXAMPLE USAGE =====
int main() {
  int arr[] = {10, 20, 30, 40, 50, 60, 70, 80, 90};
  cout << binarySearch(arr, 9, 50) << endl;  // 4 (found at index 4)
  cout << binarySearch(arr, 9, 25) << endl;  // -1 (not found)
  return 0;
}`,

  c: `#include <stdio.h>

// ===== BINARY SEARCH: Efficient search in sorted array =====
int binarySearch(int arr[], int n, int target) {
  // Initialize search boundaries
  int left = 0, right = n - 1;
  
  // Continue while search space exists
  while (left <= right) {
    // Find middle index (avoid overflow)
    int mid = left + (right - left) / 2;
    
    // Check middle element
    if (arr[mid] == target) {
      return mid;  // Found! Return index
    } else if (arr[mid] < target) {
      // Target is larger, search right half
      left = mid + 1;
    } else {
      // Target is smaller, search left half
      right = mid - 1;
    }
  }
  // Not found - return -1
  return -1;
}

// ===== EXAMPLE USAGE =====
int main() {
  int arr[] = {10, 20, 30, 40, 50, 60, 70, 80, 90};
  printf("%d\\n", binarySearch(arr, 9, 50));  // 4 (found at index 4)
  printf("%d\\n", binarySearch(arr, 9, 25));  // -1 (not found)
  return 0;
}`,

  csharp: `// ===== BINARY SEARCH: Efficient search in sorted array =====
using System;

class BinarySearch {
  static int BinarySearchAlgo(int[] arr, int target) {
    // Initialize search boundaries
    int left = 0, right = arr.Length - 1;
    
    // Continue while search space exists
    while (left <= right) {
      // Find middle index (avoid overflow)
      int mid = left + (right - left) / 2;
      
      // Check middle element
      if (arr[mid] == target) {
        return mid;  // Found! Return index
      } else if (arr[mid] < target) {
        // Target is larger, search right half
        left = mid + 1;
      } else {
        // Target is smaller, search left half
        right = mid - 1;
      }
    }
    // Not found - return -1
    return -1;
  }
  
  // ===== EXAMPLE USAGE =====
  static void Main() {
    int[] arr = {10, 20, 30, 40, 50, 60, 70, 80, 90};
    Console.WriteLine(BinarySearchAlgo(arr, 50));  // 4 (found at index 4)
    Console.WriteLine(BinarySearchAlgo(arr, 25));  // -1 (not found)
  }
}`,

  go: `package main

import "fmt"

// ===== BINARY SEARCH: Efficient search in sorted array =====
func binarySearch(arr []int, target int) int {
  // Initialize search boundaries
  left, right := 0, len(arr)-1
  
  // Continue while search space exists
  for left <= right {
    // Find middle index (avoid overflow)
    mid := left + (right-left)/2
    
    // Check middle element
    if arr[mid] == target {
      return mid  // Found! Return index
    } else if arr[mid] < target {
      // Target is larger, search right half
      left = mid + 1
    } else {
      // Target is smaller, search left half
      right = mid - 1
    }
  }
  // Not found - return -1
  return -1
}

// ===== EXAMPLE USAGE =====
func main() {
  arr := []int{10, 20, 30, 40, 50, 60, 70, 80, 90}
  fmt.Println(binarySearch(arr, 50))  // 4 (found at index 4)
  fmt.Println(binarySearch(arr, 25))  // -1 (not found)
}`,

  rust: `// ===== BINARY SEARCH: Efficient search in sorted array =====
fn binary_search(arr: &[i32], target: i32) -> i32 {
  // Initialize search boundaries
  let mut left = 0;
  let mut right = (arr.len() as i32) - 1;
  
  // Continue while search space exists
  while left <= right {
    // Find middle index (avoid overflow)
    let mid = left + (right - left) / 2;
    
    // Check middle element
    if arr[mid as usize] == target {
      return mid;  // Found! Return index
    } else if arr[mid as usize] < target {
      // Target is larger, search right half
      left = mid + 1;
    } else {
      // Target is smaller, search left half
      right = mid - 1;
    }
  }
  // Not found - return -1
  -1
}

// ===== EXAMPLE USAGE =====
fn main() {
  let arr = vec![10, 20, 30, 40, 50, 60, 70, 80, 90];
  println!("{}", binary_search(&arr, 50));  // 4 (found at index 4)
  println!("{}", binary_search(&arr, 25));  // -1 (not found)
}`,
};
