export const CODE_SNIPPETS = {
  javascript: `// ===== JUMP SEARCH: Searches sorted array by jumping in fixed-size blocks =====
function jumpSearch(arr, target) {
  const n = arr.length;
  
  // Calculate optimal jump size: sqrt(n)
  // This balances number of jumps vs linear search within block
  const jumpSize = Math.floor(Math.sqrt(n));
  
  let prev = 0; // Start of current block
  
  // Phase 1: Jump ahead until we find a block containing target
  // Jump while: next element exists AND is less than target
  while (arr[Math.min(jumpSize, n) - 1] < target) {
    prev = jumpSize; // Move block start
    jumpSize += Math.floor(Math.sqrt(n)); // Jump ahead
    if (prev >= n) return -1; // Went past end
  }
  
  // Phase 2: Linear search within the identified block
  // Search from block start until we find target or exceed it
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(jumpSize, n)) return -1; // Reached end of block
  }
  
  // Check if found
  if (arr[prev] === target) return prev;
  return -1;
}

console.log(jumpSearch([1, 3, 5, 7, 9, 11, 13], 7)); // 3`,

  python: `import math

# ===== JUMP SEARCH: Searches sorted array by jumping in fixed-size blocks =====
def jump_search(arr, target):
  n = len(arr)
  
  # Optimal jump size is sqrt(n)
  jump_size = int(math.sqrt(n))
  
  prev = 0 # Block start
  
  # Phase 1: Jump ahead to find the block
  # Continue jumping while next element < target
  while arr[min(jump_size, n) - 1] < target:
    prev = jump_size
    jump_size += int(math.sqrt(n))
    if prev >= n:
      return -1
  
  # Phase 2: Linear search within the block
  while arr[prev] < target:
    prev += 1
    if prev == min(jump_size, n):
      return -1
  
  # Check if found
  if arr[prev] == target:
    return prev
  return -1

print(jump_search([1, 3, 5, 7, 9, 11, 13], 7)) # 3`,

  java: `public class JumpSearch {
  // ===== JUMP SEARCH IMPLEMENTATION =====
  public static int jumpSearch(int[] arr, int target) {
    int n = arr.length;
    
    // Calculate sqrt(n) as jump size
    int jumpSize = (int) Math.sqrt(n);
    int prev = 0; // Block start
    
    // PHASE 1: Find the block containing target
    // Jump ahead while the last element of next block < target
    while (arr[Math.min(jumpSize, n) - 1] < target) {
      prev = jumpSize; // Move to next block
      jumpSize += (int) Math.sqrt(n);
      if (prev >= n) return -1; // Beyond array
    }
    
    // PHASE 2: Linear search within the block
    // Search from prev until we find target or exceed it
    while (arr[prev] < target) {
      prev++;
      if (prev == Math.min(jumpSize, n)) return -1; // End of block
    }
    
    // Check if found
    if (arr[prev] == target) return prev;
    return -1;
  }
  
  public static void main(String[] args) {
    int[] arr = {1, 3, 5, 7, 9, 11, 13};
    System.out.println(jumpSearch(arr, 7)); // 3
  }
}`,

  cpp: `#include <iostream>
#include <cmath>
using namespace std;

// ===== JUMP SEARCH: sqrt(n) block jumping + linear search =====
int jumpSearch(int arr[], int n, int target) {
  // Optimal jump size
  int jumpSize = sqrt(n);
  int prev = 0;
  
  // PHASE 1: Jump ahead to find block
  while (arr[min(jumpSize, n) - 1] < target) {
    prev = jumpSize;
    jumpSize += sqrt(n);
    if (prev >= n) return -1;
  }
  
  // PHASE 2: Linear search in block
  while (arr[prev] < target) {
    prev++;
    if (prev == min(jumpSize, n)) return -1;
  }
  
  if (arr[prev] == target) return prev;
  return -1;
}

int main() {
  int arr[] = {1, 3, 5, 7, 9, 11, 13};
  cout << jumpSearch(arr, 7, 7) << endl; // 3
  return 0;
}`,

  c: `#include <stdio.h>
#include <math.h>

// ===== JUMP SEARCH =====
int jumpSearch(int arr[], int n, int target) {
  // Calculate sqrt(n)
  int jumpSize = (int)sqrt(n);
  int prev = 0;
  
  // PHASE 1: Jump ahead until finding right block
  int minVal = (jumpSize < n) ? jumpSize - 1 : n - 1;
  while (arr[minVal] < target) {
    prev = jumpSize;
    jumpSize += (int)sqrt(n);
    if (prev >= n) return -1;
    minVal = (jumpSize < n) ? jumpSize - 1 : n - 1;
  }
  
  // PHASE 2: Linear search within block
  while (arr[prev] < target) {
    prev++;
    if (prev == ((jumpSize < n) ? jumpSize : n)) return -1;
  }
  
  if (arr[prev] == target) return prev;
  return -1;
}

int main() {
  int arr[] = {1, 3, 5, 7, 9, 11, 13};
  printf("%d\\n", jumpSearch(arr, 7, 7)); // 3
  return 0;
}`,

  csharp: `using System;

class JumpSearch {
  // ===== JUMP SEARCH =====
  static int Search(int[] arr, int target) {
    int n = arr.Length;
    int jumpSize = (int)Math.Sqrt(n);
    int prev = 0;
    
    // PHASE 1: Find block with target
    while (arr[Math.Min(jumpSize, n) - 1] < target) {
      prev = jumpSize;
      jumpSize += (int)Math.Sqrt(n);
      if (prev >= n) return -1;
    }
    
    // PHASE 2: Linear search in block
    while (arr[prev] < target) {
      prev++;
      if (prev == Math.Min(jumpSize, n)) return -1;
    }
    
    if (arr[prev] == target) return prev;
    return -1;
  }
  
  static void Main() {
    int[] arr = {1, 3, 5, 7, 9, 11, 13};
    Console.WriteLine(Search(arr, 7)); // 3
  }
}`,

  go: `package main
import (
  "fmt"
  "math"
)

// ===== JUMP SEARCH =====
func jumpSearch(arr []int, target int) int {
  n := len(arr)
  
  // Calculate sqrt(n) jump size
  jumpSize := int(math.Sqrt(float64(n)))
  prev := 0
  
  // PHASE 1: Jump ahead to find block
  for arr[min(jumpSize, n)-1] < target {
    prev = jumpSize
    jumpSize += int(math.Sqrt(float64(n)))
    if prev >= n {
      return -1
    }
  }
  
  // PHASE 2: Linear search in block
  for arr[prev] < target {
    prev++
    if prev == min(jumpSize, n) {
      return -1
    }
  }
  
  if arr[prev] == target {
    return prev
  }
  return -1
}

func min(a, b int) int {
  if a < b {
    return a
  }
  return b
}

func main() {
  arr := []int{1, 3, 5, 7, 9, 11, 13}
  fmt.Println(jumpSearch(arr, 7)) // 3
}`,

  rust: `// ===== JUMP SEARCH =====
fn jump_search(arr: &[i32], target: i32) -> i32 {
  let n = arr.len();
  let jump_size = (n as f64).sqrt() as usize;
  let mut prev = 0;
  let mut jump_sz = jump_size;
  
  // PHASE 1: Jump ahead to find the block
  while jump_sz < n && arr[jump_sz - 1] < target {
    prev = jump_sz;
    jump_sz += jump_size;
    if prev >= n {
      return -1;
    }
  }
  
  // PHASE 2: Linear search in the block
  let mut current = prev;
  while current < n && arr[current] < target {
    current += 1;
    if current == jump_sz.min(n) {
      return -1;
    }
  }
  
  if current < n && arr[current] == target {
    current as i32
  } else {
    -1
  }
}

fn main() {
  let arr = vec![1, 3, 5, 7, 9, 11, 13];
  println!("{}", jump_search(&arr, 7)); // 3
}`,
};
