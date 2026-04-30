export const CODE_SNIPPETS = {
  javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// Example
const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90];
console.log(binarySearch(arr, 50)); // 4
console.log(binarySearch(arr, 25)); // -1`,

  python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Example
arr = [10, 20, 30, 40, 50, 60, 70, 80, 90]
print(binary_search(arr, 50))  # 4
print(binary_search(arr, 25))  # -1`,

  java: `public class BinarySearch {
  public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
      int mid = left + (right - left) / 2;
      if (arr[mid] == target) {
        return mid;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return -1;
  }
  
  public static void main(String[] args) {
    int[] arr = {10, 20, 30, 40, 50, 60, 70, 80, 90};
    System.out.println(binarySearch(arr, 50));  // 4
    System.out.println(binarySearch(arr, 25));  // -1
  }
}`,

  cpp: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int n, int target) {
  int left = 0, right = n - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

int main() {
  int arr[] = {10, 20, 30, 40, 50, 60, 70, 80, 90};
  cout << binarySearch(arr, 9, 50) << endl;  // 4
  cout << binarySearch(arr, 9, 25) << endl;  // -1
  return 0;
}`,

  c: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
  int left = 0, right = n - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

int main() {
  int arr[] = {10, 20, 30, 40, 50, 60, 70, 80, 90};
  printf("%d\\n", binarySearch(arr, 9, 50));  // 4
  printf("%d\\n", binarySearch(arr, 9, 25));  // -1
  return 0;
}`,

  csharp: `using System;

class BinarySearch {
  static int BinarySearchAlgo(int[] arr, int target) {
    int left = 0, right = arr.Length - 1;
    while (left <= right) {
      int mid = left + (right - left) / 2;
      if (arr[mid] == target) {
        return mid;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return -1;
  }
  
  static void Main() {
    int[] arr = {10, 20, 30, 40, 50, 60, 70, 80, 90};
    Console.WriteLine(BinarySearchAlgo(arr, 50));  // 4
    Console.WriteLine(BinarySearchAlgo(arr, 25));  // -1
  }
}`,

  go: `package main

import "fmt"

func binarySearch(arr []int, target int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := left + (right-left)/2
    if arr[mid] == target {
      return mid
    } else if arr[mid] < target {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return -1
}

func main() {
  arr := []int{10, 20, 30, 40, 50, 60, 70, 80, 90}
  fmt.Println(binarySearch(arr, 50))  // 4
  fmt.Println(binarySearch(arr, 25))  // -1
}`,

  rust: `fn binary_search(arr: &[i32], target: i32) -> i32 {
  let mut left = 0;
  let mut right = (arr.len() as i32) - 1;
  while left <= right {
    let mid = left + (right - left) / 2;
    if arr[mid as usize] == target {
      return mid;
    } else if arr[mid as usize] < target {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  -1
}

fn main() {
  let arr = vec![10, 20, 30, 40, 50, 60, 70, 80, 90];
  println!("{}", binary_search(&arr, 50));  // 4
  println!("{}", binary_search(&arr, 25));  // -1
}`,
};
