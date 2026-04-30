export const CODE_SNIPPETS = {
  javascript: `// ===== LINEAR SEARCH: Sequential check of each element =====
function linearSearch(arr, target) {
  // Iterate through array from start to end
  for (let i = 0; i < arr.length; i++) {
    // Check if current element matches target
    if (arr[i] === target) {
      return i;  // Found! Return index position
    }
  }
  // Not found - return -1
  return -1;
}

// ===== EXAMPLE USAGE =====
const arr = [10, 20, 30, 40, 50, 60, 70];
console.log(linearSearch(arr, 40)); // 3 (found at index 3)
console.log(linearSearch(arr, 25)); // -1 (not found)`,

  python: `# ===== LINEAR SEARCH: Sequential check of each element =====
def linear_search(arr, target):
    # Iterate through array indices from 0 to length-1
    for i in range(len(arr)):
        # Check if current element equals target
        if arr[i] == target:
            return i  # Found! Return index position
    # Not found - return -1
    return -1

# ===== EXAMPLE USAGE =====
arr = [10, 20, 30, 40, 50, 60, 70]
print(linear_search(arr, 40))  # 3 (found at index 3)
print(linear_search(arr, 25))  # -1 (not found)`,

  java: `// ===== LINEAR SEARCH: Sequential check of each element =====
public class LinearSearch {
  public static int linearSearch(int[] arr, int target) {
    // Loop through array from index 0 to length-1
    for (int i = 0; i < arr.length; i++) {
      // Check if current element matches target
      if (arr[i] == target) {
        return i;  // Found! Return index position
      }
    }
    // Not found - return -1
    return -1;
  }
  
  // ===== EXAMPLE USAGE =====
  public static void main(String[] args) {
    int[] arr = {10, 20, 30, 40, 50, 60, 70};
    System.out.println(linearSearch(arr, 40));  // 3 (found at index 3)
    System.out.println(linearSearch(arr, 25));  // -1 (not found)
  }
}`,

  cpp: `#include <iostream>
using namespace std;

// ===== LINEAR SEARCH: Sequential check of each element =====
int linearSearch(int arr[], int n, int target) {
  // Loop through array from index 0 to n-1
  for (int i = 0; i < n; i++) {
    // Check if current element matches target
    if (arr[i] == target) {
      return i;  // Found! Return index position
    }
  }
  // Not found - return -1
  return -1;
}

// ===== EXAMPLE USAGE =====
int main() {
  int arr[] = {10, 20, 30, 40, 50, 60, 70};
  cout << linearSearch(arr, 7, 40) << endl;  // 3 (found at index 3)
  cout << linearSearch(arr, 7, 25) << endl;  // -1 (not found)
  return 0;
}`,

  c: `#include <stdio.h>

// ===== LINEAR SEARCH: Sequential check of each element =====
int linearSearch(int arr[], int n, int target) {
  // Loop through array from index 0 to n-1
  for (int i = 0; i < n; i++) {
    // Check if current element matches target
    if (arr[i] == target) {
      return i;  // Found! Return index position
    }
  }
  // Not found - return -1
  return -1;
}

// ===== EXAMPLE USAGE =====
int main() {
  int arr[] = {10, 20, 30, 40, 50, 60, 70};
  printf("%d\\n", linearSearch(arr, 7, 40));  // 3 (found at index 3)
  printf("%d\\n", linearSearch(arr, 7, 25));  // -1 (not found)
  return 0;
}`,

  csharp: `// ===== LINEAR SEARCH: Sequential check of each element =====
using System;

class LinearSearch {
  static int LinearSearchAlgo(int[] arr, int target) {
    // Loop through array from index 0 to length-1
    for (int i = 0; i < arr.Length; i++) {
      // Check if current element matches target
      if (arr[i] == target) {
        return i;  // Found! Return index position
      }
    }
    // Not found - return -1
    return -1;
  }
  
  // ===== EXAMPLE USAGE =====
  static void Main() {
    int[] arr = {10, 20, 30, 40, 50, 60, 70};
    Console.WriteLine(LinearSearchAlgo(arr, 40));  // 3 (found at index 3)
    Console.WriteLine(LinearSearchAlgo(arr, 25));  // -1 (not found)
  }
}`,

  go: `package main

import "fmt"

// ===== LINEAR SEARCH: Sequential check of each element =====
func linearSearch(arr []int, target int) int {
  // Loop through array from index 0 to length-1
  for i := 0; i < len(arr); i++ {
    // Check if current element matches target
    if arr[i] == target {
      return i  // Found! Return index position
    }
  }
  // Not found - return -1
  return -1
}

// ===== EXAMPLE USAGE =====
func main() {
  arr := []int{10, 20, 30, 40, 50, 60, 70}
  fmt.Println(linearSearch(arr, 40))  // 3 (found at index 3)
  fmt.Println(linearSearch(arr, 25))  // -1 (not found)
}`,

  rust: `// ===== LINEAR SEARCH: Sequential check of each element =====
fn linear_search(arr: &[i32], target: i32) -> i32 {
  // Iterate through array with index and value
  for (i, &val) in arr.iter().enumerate() {
    // Check if current element matches target
    if val == target {
      return i as i32;  // Found! Return index position
    }
  }
  // Not found - return -1
  -1
}

// ===== EXAMPLE USAGE =====
fn main() {
  let arr = vec![10, 20, 30, 40, 50, 60, 70];
  println!("{}", linear_search(&arr, 40));  // 3 (found at index 3)
  println!("{}", linear_search(&arr, 25));  // -1 (not found)
}`,
};
