export const CODE_SNIPPETS = {
  javascript: `function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

// Example
const arr = [38, 27, 43, 3, 9, 82, 10];
console.log(mergeSort(arr)); // [3, 9, 10, 27, 38, 43, 82]`,

  python: `def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    return result + left[i:] + right[j:]

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))

# Example
arr = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(arr))  # [3, 9, 10, 27, 38, 43, 82]`,

  java: `public class MergeSort {
  public static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result[k++] = left[i++];
      } else {
        result[k++] = right[j++];
      }
    }
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    return result;
  }
  
  public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    return merge(left, right);
  }
}`,

  cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> merge(vector<int> left, vector<int> right) {
  vector<int> result;
  int i = 0, j = 0;
  while (i < left.size() && j < right.size()) {
    if (left[i] <= right[j]) {
      result.push_back(left[i++]);
    } else {
      result.push_back(right[j++]);
    }
  }
  while (i < left.size()) result.push_back(left[i++]);
  while (j < right.size()) result.push_back(right[j++]);
  return result;
}

vector<int> mergeSort(vector<int> arr) {
  if (arr.size() <= 1) return arr;
  int mid = arr.size() / 2;
  vector<int> left(arr.begin(), arr.begin() + mid);
  vector<int> right(arr.begin() + mid, arr.end());
  return merge(mergeSort(left), mergeSort(right));
}`,

  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void merge(int arr[], int left, int mid, int right) {
  int i = left, j = mid + 1, k = 0;
  int* temp = (int*)malloc((right - left + 1) * sizeof(int));
  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
    }
  }
  while (i <= mid) temp[k++] = arr[i++];
  while (j <= right) temp[k++] = arr[j++];
  for (i = left, k = 0; i <= right; i++, k++) {
    arr[i] = temp[k];
  }
  free(temp);
}

void mergeSort(int arr[], int left, int right) {
  if (left < right) {
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
}`,

  csharp: `using System;
using System.Collections.Generic;

class MergeSort {
  static List<int> Merge(List<int> left, List<int> right) {
    var result = new List<int>();
    int i = 0, j = 0;
    while (i < left.Count && j < right.Count) {
      if (left[i] <= right[j]) {
        result.Add(left[i++]);
      } else {
        result.Add(right[j++]);
      }
    }
    while (i < left.Count) result.Add(left[i++]);
    while (j < right.Count) result.Add(right[j++]);
    return result;
  }
  
  static List<int> MergeSortAlgo(List<int> arr) {
    if (arr.Count <= 1) return arr;
    int mid = arr.Count / 2;
    return Merge(MergeSortAlgo(arr.GetRange(0, mid)), MergeSortAlgo(arr.GetRange(mid, arr.Count - mid)));
  }
}`,

  go: `package main

import "fmt"

func merge(left, right []int) []int {
  var result []int
  i, j := 0, 0
  for i < len(left) && j < len(right) {
    if left[i] <= right[j] {
      result = append(result, left[i])
      i++
    } else {
      result = append(result, right[j])
      j++
    }
  }
  result = append(result, left[i:]...)
  result = append(result, right[j:]...)
  return result
}

func mergeSort(arr []int) []int {
  if len(arr) <= 1 {
    return arr
  }
  mid := len(arr) / 2
  return merge(mergeSort(arr[:mid]), mergeSort(arr[mid:]))
}

func main() {
  arr := []int{38, 27, 43, 3, 9, 82, 10}
  fmt.Println(mergeSort(arr))
}`,

  rust: `fn merge(left: &[i32], right: &[i32]) -> Vec<i32> {
  let mut result = Vec::new();
  let mut i = 0;
  let mut j = 0;
  while i < left.len() && j < right.len() {
    if left[i] <= right[j] {
      result.push(left[i]);
      i += 1;
    } else {
      result.push(right[j]);
      j += 1;
    }
  }
  result.extend_from_slice(&left[i..]);
  result.extend_from_slice(&right[j..]);
  result
}

fn merge_sort(arr: &[i32]) -> Vec<i32> {
  if arr.len() <= 1 {
    return arr.to_vec();
  }
  let mid = arr.len() / 2;
  merge(&merge_sort(&arr[..mid]), &merge_sort(&arr[mid..]))
}

fn main() {
  let arr = vec![38, 27, 43, 3, 9, 82, 10];
  println!("{:?}", merge_sort(&arr));
}`,
};
