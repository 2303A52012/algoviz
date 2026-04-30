export const CODE_SNIPPETS = {
  javascript: `function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      [arr[i + 1], arr[j]] = [arr[j], arr[i + 1]];
      i++;
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

// Example
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(arr)); // [11, 12, 22, 25, 34, 64, 90]`,

  python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

# Example
arr = [64, 34, 25, 12, 22, 11, 90]
print(quick_sort(arr))  # [11, 12, 22, 25, 34, 64, 90]`,

  java: `public class QuickSort {
  static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
  }
  
  static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
      int pi = partition(arr, low, high);
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }
  }
}`,

  cpp: `#include <iostream>
using namespace std;

int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] < pivot) {
      swap(arr[++i], arr[j]);
    }
  }
  swap(arr[i + 1], arr[high]);
  return i + 1;
}

void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

int main() {
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  quickSort(arr, 0, 6);
  for (int x : arr) cout << x << " ";
  return 0;
}`,

  c: `#include <stdio.h>

int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  int temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}

void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}`,

  csharp: `using System;

class QuickSort {
  static int Partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    int temp2 = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp2;
    return i + 1;
  }
  
  static void QuickSortAlgo(int[] arr, int low, int high) {
    if (low < high) {
      int pi = Partition(arr, low, high);
      QuickSortAlgo(arr, low, pi - 1);
      QuickSortAlgo(arr, pi + 1, high);
    }
  }
}`,

  go: `package main

import "fmt"

func partition(arr []int, low, high int) int {
  pivot := arr[high]
  i := low - 1
  for j := low; j < high; j++ {
    if arr[j] < pivot {
      i++
      arr[i], arr[j] = arr[j], arr[i]
    }
  }
  arr[i+1], arr[high] = arr[high], arr[i+1]
  return i + 1
}

func quickSort(arr []int, low, high int) {
  if low < high {
    pi := partition(arr, low, high)
    quickSort(arr, low, pi-1)
    quickSort(arr, pi+1, high)
  }
}

func main() {
  arr := []int{64, 34, 25, 12, 22, 11, 90}
  quickSort(arr, 0, len(arr)-1)
  fmt.Println(arr)
}`,

  rust: `fn partition(arr: &mut [i32], low: usize, high: usize) -> usize {
  let pivot = arr[high];
  let mut i = (low as i32) - 1;
  for j in low..high {
    if arr[j] < pivot {
      i += 1;
      arr.swap(i as usize, j);
    }
  }
  arr.swap((i + 1) as usize, high);
  (i + 1) as usize
}

fn quick_sort(arr: &mut [i32], low: usize, high: usize) {
  if low < high {
    let pi = partition(arr, low, high);
    if pi > 0 {
      quick_sort(arr, low, pi - 1);
    }
    quick_sort(arr, pi + 1, high);
  }
}

fn main() {
  let mut arr = vec![64, 34, 25, 12, 22, 11, 90];
  quick_sort(&mut arr, 0, arr.len() - 1);
  println!("{:?}", arr);
}`,
};
