export const CODE_SNIPPETS = {
  javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Example
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(insertionSort(arr)); // [11, 12, 22, 25, 34, 64, 90]`,

  python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Example
arr = [64, 34, 25, 12, 22, 11, 90]
print(insertion_sort(arr))  # [11, 12, 22, 25, 34, 64, 90]`,

  java: `public class InsertionSort {
  public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
      int key = arr[i];
      int j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }
  }
  
  public static void main(String[] args) {
    int[] arr = {64, 34, 25, 12, 22, 11, 90};
    insertionSort(arr);
    System.out.println(Arrays.toString(arr));
  }
}`,

  cpp: `#include <iostream>
using namespace std;

void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

int main() {
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  insertionSort(arr, 7);
  for (int x : arr) cout << x << " ";
  return 0;
}`,

  c: `#include <stdio.h>

void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

int main() {
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  insertionSort(arr, 7);
  for (int i = 0; i < 7; i++)
    printf("%d ", arr[i]);
  return 0;
}`,

  csharp: `using System;

class InsertionSort {
  static void InsertionSortAlgo(int[] arr) {
    for (int i = 1; i < arr.Length; i++) {
      int key = arr[i];
      int j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }
  }
  
  static void Main() {
    int[] arr = {64, 34, 25, 12, 22, 11, 90};
    InsertionSortAlgo(arr);
    Console.WriteLine(string.Join(", ", arr));
  }
}`,

  go: `package main

import "fmt"

func insertionSort(arr []int) {
  for i := 1; i < len(arr); i++ {
    key := arr[i]
    j := i - 1
    for j >= 0 && arr[j] > key {
      arr[j+1] = arr[j]
      j--
    }
    arr[j+1] = key
  }
}

func main() {
  arr := []int{64, 34, 25, 12, 22, 11, 90}
  insertionSort(arr)
  fmt.Println(arr)
}`,

  rust: `fn insertion_sort(arr: &mut [i32]) {
  for i in 1..arr.len() {
    let key = arr[i];
    let mut j = (i as i32) - 1;
    while j >= 0 && arr[j as usize] > key {
      arr[(j + 1) as usize] = arr[j as usize];
      j -= 1;
    }
    arr[(j + 1) as usize] = key;
  }
}

fn main() {
  let mut arr = vec![64, 34, 25, 12, 22, 11, 90];
  insertion_sort(&mut arr);
  println!("{:?}", arr);
}`,
};
