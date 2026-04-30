export const CODE_SNIPPETS = {
  javascript: `// ===== BUBBLE SORT: Repeatedly swap adjacent elements if in wrong order =====
function bubbleSort(arr) {
  const n = arr.length;
  // Outer loop: after i passes, largest i elements are in place
  for (let i = 0; i < n - 1; i++) {
    // Inner loop: compare adjacent pairs and bubble larger one right
    for (let j = 0; j < n - i - 1; j++) {
      // If left > right, swap them (bubble larger rightward)
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// ===== EXAMPLE USAGE =====
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(numbers));`,

  python: `# ===== BUBBLE SORT: Repeatedly swap adjacent elements if in wrong order =====
def bubble_sort(arr):
    n = len(arr)
    # Outer loop: after i passes, largest i elements are in place
    for i in range(n - 1):
        # Inner loop: compare adjacent pairs and bubble larger one right
        for j in range(n - i - 1):
            # If left > right, swap them (bubble larger rightward)
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# ===== EXAMPLE USAGE =====
numbers = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(numbers))`,

  java: `// ===== BUBBLE SORT: Repeatedly swap adjacent elements if in wrong order =====
public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        // Outer loop: after i passes, largest i elements are in place
        for (int i = 0; i < n - 1; i++) {
            // Inner loop: compare adjacent pairs and bubble larger one right
            for (int j = 0; j < n - i - 1; j++) {
                // If left > right, swap them (bubble larger rightward)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // ===== EXAMPLE USAGE =====
    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(numbers);
        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}`,

  cpp: `#include <iostream>
#include <vector>
using namespace std;

// ===== BUBBLE SORT: Repeatedly swap adjacent elements if in wrong order =====
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    // Outer loop: after i passes, largest i elements are in place
    for (int i = 0; i < n - 1; i++) {
        // Inner loop: compare adjacent pairs and bubble larger one right
        for (int j = 0; j < n - i - 1; j++) {
            // If left > right, swap them (bubble larger rightward)
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

// ===== EXAMPLE USAGE =====
int main() {
    vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(numbers);
    for (int num : numbers) {
        cout << num << " ";
    }
    return 0;
}`,

  c: `#include <stdio.h>

// ===== BUBBLE SORT: Repeatedly swap adjacent elements if in wrong order =====
void bubbleSort(int arr[], int n) {
    // Outer loop: after i passes, largest i elements are in place
    for (int i = 0; i < n - 1; i++) {
        // Inner loop: compare adjacent pairs and bubble larger one right
        for (int j = 0; j < n - i - 1; j++) {
            // If left > right, swap them (bubble larger rightward)
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

// ===== EXAMPLE USAGE =====
int main() {
    int numbers[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(numbers) / sizeof(numbers[0]);
    bubbleSort(numbers, n);
    for (int i = 0; i < n; i++) {
        printf("%d ", numbers[i]);
    }
    return 0;
}`,

  csharp: `using System;

// ===== BUBBLE SORT: Repeatedly swap adjacent elements if in wrong order =====
public class BubbleSort {
    public static void Sort(int[] arr) {
        int n = arr.Length;
        // Outer loop: after i passes, largest i elements are in place
        for (int i = 0; i < n - 1; i++) {
            // Inner loop: compare adjacent pairs and bubble larger one right
            for (int j = 0; j < n - i - 1; j++) {
                // If left > right, swap them (bubble larger rightward)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // ===== EXAMPLE USAGE =====
    static void Main() {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        Sort(numbers);
        foreach (int num in numbers) {
            Console.Write(num + " ");
        }
    }
}`,

  go: `package main

import "fmt"

// ===== BUBBLE SORT: Repeatedly swap adjacent elements if in wrong order =====
func bubbleSort(arr []int) {
    n := len(arr)
    // Outer loop: after i passes, largest i elements are in place
    for i := 0; i < n-1; i++ {
        // Inner loop: compare adjacent pairs and bubble larger one right
        for j := 0; j < n-i-1; j++ {
            // If left > right, swap them (bubble larger rightward)
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

// ===== EXAMPLE USAGE =====
func main() {
    numbers := []int{64, 34, 25, 12, 22, 11, 90}
    bubbleSort(numbers)
    fmt.Println(numbers)
}`,

  rust: `// ===== BUBBLE SORT: Repeatedly swap adjacent elements if in wrong order =====
fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    // Outer loop: after i passes, largest i elements are in place
    for i in 0..n - 1 {
        // Inner loop: compare adjacent pairs and bubble larger one right
        for j in 0..n - i - 1 {
            // If left > right, swap them (bubble larger rightward)
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

// ===== EXAMPLE USAGE =====
fn main() {
    let mut numbers = vec![64, 34, 25, 12, 22, 11, 90];
    bubble_sort(&mut numbers);
    println!("{:?}", numbers);
}`,
};
