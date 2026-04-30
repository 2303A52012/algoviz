export const CODE_SNIPPETS = {
  javascript: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}

// Example
const arr = [64, 25, 12, 22, 11];
console.log(selectionSort(arr)); // [11, 12, 22, 25, 64]`,

  python: `def selection_sort(arr):
    for i in range(len(arr) - 1):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Example
arr = [64, 25, 12, 22, 11]
print(selection_sort(arr))  # [11, 12, 22, 25, 64]`,

  java: `public class SelectionSort {
  public static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
      int minIdx = i;
      for (int j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      int temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  
  public static void main(String[] args) {
    int[] arr = {64, 25, 12, 22, 11};
    selectionSort(arr);
    System.out.println(Arrays.toString(arr));
  }
}`,

  cpp: `#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    swap(arr[i], arr[minIdx]);
  }
}

int main() {
  int arr[] = {64, 25, 12, 22, 11};
  selectionSort(arr, 5);
  for (int x : arr) cout << x << " ";
  return 0;
}`,

  c: `#include <stdio.h>

void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    int temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }
}

int main() {
  int arr[] = {64, 25, 12, 22, 11};
  selectionSort(arr, 5);
  for (int i = 0; i < 5; i++)
    printf("%d ", arr[i]);
  return 0;
}`,

  csharp: `using System;

class SelectionSort {
  static void SelectionSortAlgo(int[] arr) {
    for (int i = 0; i < arr.Length - 1; i++) {
      int minIdx = i;
      for (int j = i + 1; j < arr.Length; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      int temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  
  static void Main() {
    int[] arr = {64, 25, 12, 22, 11};
    SelectionSortAlgo(arr);
    Console.WriteLine(string.Join(", ", arr));
  }
}`,

  go: `package main

import "fmt"

func selectionSort(arr []int) {
  for i := 0; i < len(arr)-1; i++ {
    minIdx := i
    for j := i + 1; j < len(arr); j++ {
      if arr[j] < arr[minIdx] {
        minIdx = j
      }
    }
    arr[i], arr[minIdx] = arr[minIdx], arr[i]
  }
}

func main() {
  arr := []int{64, 25, 12, 22, 11}
  selectionSort(arr)
  fmt.Println(arr)
}`,

  rust: `fn selection_sort(arr: &mut [i32]) {
  for i in 0..arr.len() - 1 {
    let mut min_idx = i;
    for j in i + 1..arr.len() {
      if arr[j] < arr[min_idx] {
        min_idx = j;
      }
    }
    arr.swap(i, min_idx);
  }
}

fn main() {
  let mut arr = vec![64, 25, 12, 22, 11];
  selection_sort(&mut arr);
  println!("{:?}", arr);
}`,
};
