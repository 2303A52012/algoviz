export const CODE_SNIPPETS = {
  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

// Example
const arr = [10, 20, 30, 40, 50, 60, 70];
console.log(linearSearch(arr, 40)); // 3
console.log(linearSearch(arr, 25)); // -1`,

  python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Example
arr = [10, 20, 30, 40, 50, 60, 70]
print(linear_search(arr, 40))  # 3
print(linear_search(arr, 25))  # -1`,

  java: `public class LinearSearch {
  public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
      if (arr[i] == target) {
        return i;
      }
    }
    return -1;
  }
  
  public static void main(String[] args) {
    int[] arr = {10, 20, 30, 40, 50, 60, 70};
    System.out.println(linearSearch(arr, 40));  // 3
    System.out.println(linearSearch(arr, 25));  // -1
  }
}`,

  cpp: `#include <iostream>
using namespace std;

int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  return -1;
}

int main() {
  int arr[] = {10, 20, 30, 40, 50, 60, 70};
  cout << linearSearch(arr, 7, 40) << endl;  // 3
  cout << linearSearch(arr, 7, 25) << endl;  // -1
  return 0;
}`,

  c: `#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  return -1;
}

int main() {
  int arr[] = {10, 20, 30, 40, 50, 60, 70};
  printf("%d\\n", linearSearch(arr, 7, 40));  // 3
  printf("%d\\n", linearSearch(arr, 7, 25));  // -1
  return 0;
}`,

  csharp: `using System;

class LinearSearch {
  static int LinearSearchAlgo(int[] arr, int target) {
    for (int i = 0; i < arr.Length; i++) {
      if (arr[i] == target) {
        return i;
      }
    }
    return -1;
  }
  
  static void Main() {
    int[] arr = {10, 20, 30, 40, 50, 60, 70};
    Console.WriteLine(LinearSearchAlgo(arr, 40));  // 3
    Console.WriteLine(LinearSearchAlgo(arr, 25));  // -1
  }
}`,

  go: `package main

import "fmt"

func linearSearch(arr []int, target int) int {
  for i := 0; i < len(arr); i++ {
    if arr[i] == target {
      return i
    }
  }
  return -1
}

func main() {
  arr := []int{10, 20, 30, 40, 50, 60, 70}
  fmt.Println(linearSearch(arr, 40))  // 3
  fmt.Println(linearSearch(arr, 25))  // -1
}`,

  rust: `fn linear_search(arr: &[i32], target: i32) -> i32 {
  for (i, &val) in arr.iter().enumerate() {
    if val == target {
      return i as i32;
    }
  }
  -1
}

fn main() {
  let arr = vec![10, 20, 30, 40, 50, 60, 70];
  println!("{}", linear_search(&arr, 40));  // 3
  println!("{}", linear_search(&arr, 25));  // -1
}`,
};
