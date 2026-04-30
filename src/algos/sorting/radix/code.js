export const CODE_SNIPPETS = {
  javascript: `// ===== RADIX SORT: Non-comparative sort using digit-by-digit counting =====
// Sorts by distributing elements into buckets for each digit position (ones, tens, hundreds, etc.)

function radixSort(arr) {
  // Base case: empty array is already sorted
  if (arr.length === 0) return arr;
  
  // Find maximum number to determine number of digits
  const maxNum = Math.max(...arr);
  let digitPosition = 1;  // Start with ones place (10^0)
  
  // For each digit position (1, 10, 100, 1000, ...)
  while (maxNum / digitPosition > 0) {
    // Sort by current digit using counting sort
    arr = countingSortByDigit(arr, digitPosition);
    // Move to next digit position
    digitPosition *= 10;
  }
  
  return arr;
}

// Helper: Count sort stable sort by extracting digit at current position
function countingSortByDigit(arr, digitPosition) {
  // Create 10 buckets (0-9) for each possible digit
  const buckets = Array.from({ length: 10 }, () => []);
  
  // Distribute numbers into buckets based on their digit at digitPosition
  for (let num of arr) {
    // Extract digit: divide by position, mod 10 to get that digit
    const digit = Math.floor(num / digitPosition) % 10;
    buckets[digit].push(num);
  }
  
  // Concatenate buckets back into sorted array
  return buckets.flat();
}

// Example: Sort mixed array
console.log(radixSort([170, 45, 75, 90, 2, 8, 25]));  // [2, 8, 25, 45, 75, 90, 170]`,

  python: `# ===== RADIX SORT: Digit-by-digit sorting using buckets =====
# Stable sort that processes each digit position independently

def radix_sort(arr):
    # Empty array is already sorted
    if not arr:
        return arr
    
    # Find maximum to determine number of digits needed
    max_num = max(arr)
    digit_position = 1  # Start with ones place (10^0)
    
    # Process each digit position (1, 10, 100, ...)
    while max_num // digit_position > 0:
        # Sort by current digit position
        arr = counting_sort_by_digit(arr, digit_position)
        # Move to next digit
        digit_position *= 10
    
    return arr

# Helper: Stable count sort for single digit position
def counting_sort_by_digit(arr, digit_position):
    # Create 10 buckets for digits 0-9
    buckets = [[] for _ in range(10)]
    
    # Distribute numbers into buckets based on digit at current position
    for num in arr:
        # Extract digit at this position
        digit = (num // digit_position) % 10
        buckets[digit].append(num)
    
    # Concatenate all buckets to get sorted sequence
    result = []
    for bucket in buckets:
        result.extend(bucket)  # extend preserves order from buckets
    return result

# Example usage
print(radix_sort([170, 45, 75, 90, 2, 8, 25]))  # [2, 8, 25, 45, 75, 90, 170]`,

  java: `// ===== RADIX SORT: Stable sorting by digit position =====
public class RadixSort {
    // Main radix sort function - processes numbers by each digit
    public static void radixSort(int[] arr) {
        // Empty or single-element arrays are already sorted
        if (arr.length == 0) return;
        
        // Find maximum number to determine number of digits
        int maxNum = getMax(arr);
        int digitPosition = 1;  // Start with ones place (10^0)
        
        // For each digit position (1, 10, 100, 1000, ...)
        while (maxNum / digitPosition > 0) {
            // Counting sort by current digit - stable sort preserves relative order
            countingSortByDigit(arr, digitPosition);
            // Move to next digit position
            digitPosition *= 10;
        }
    }
    
    // Helper: Find maximum element in array
    private static int getMax(int[] arr) {
        int max = arr[0];
        for (int num : arr) {
            if (num > max) max = num;
        }
        return max;
    }
    
    // Helper: Counting sort for a specific digit position
    // This is a stable sort - preserves relative order of equal elements
    private static void countingSortByDigit(int[] arr, int digitPosition) {
        int[] output = new int[arr.length];  // Sorted result
        int[] count = new int[10];  // Count array for digits 0-9
        
        // Step 1: Count occurrences of each digit
        for (int num : arr) {
            // Extract digit at current position
            count[(num / digitPosition) % 10]++;
        }
        
        // Step 2: Modify count to store cumulative positions
        // count[i] now contains position where digit i elements end
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        // Step 3: Build output array in reverse to maintain stability
        // Processing from right to left preserves relative order
        for (int i = arr.length - 1; i >= 0; i--) {
            int digit = (arr[i] / digitPosition) % 10;
            output[count[digit] - 1] = arr[i];  // Place at correct position
            count[digit]--;  // Move position for next element with same digit
        }
        
        // Step 4: Copy sorted array back to original
        for (int i = 0; i < arr.length; i++) {
            arr[i] = output[i];
        }
    }
    
    public static void main(String[] args) {
        int[] arr = {170, 45, 75, 90, 2, 8, 25};
        radixSort(arr);
        System.out.println(Arrays.toString(arr));  // [2, 8, 25, 45, 75, 90, 170]
    }
}`,

  cpp: `#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

// ===== COUNTING SORT BY DIGIT: Stable sort for one digit position =====
void countingSortByDigit(vector<int>& arr, int digitPosition) {
    int n = arr.size();
    vector<int> output(n);  // Sorted output array
    int count[10] = {0};  // Count array for digits 0-9
    
    // Step 1: Count occurrences of each digit at this position
    for (int i = 0; i < n; i++) {
        // Extract digit: divide by position, mod 10 to isolate that digit
        count[(arr[i] / digitPosition) % 10]++;
    }
    
    // Step 2: Cumulative count - count[i] now represents positions
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Step 3: Place elements in output array from right to left
    // Right-to-left traversal maintains stability
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / digitPosition) % 10;
        output[count[digit] - 1] = arr[i];  // Place at correct position
        count[digit]--;  // Decrement for next element with same digit
    }
    
    // Step 4: Copy sorted output back to original array
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}

// ===== RADIX SORT MAIN FUNCTION =====
void radixSort(vector<int>& arr) {
    // Empty vector is already sorted
    if (arr.empty()) return;
    
    // Find maximum number - determines number of digit positions to process
    int maxNum = *max_element(arr.begin(), arr.end());
    
    // For each digit position (1, 10, 100, ...)
    // Process from least significant to most significant digit
    for (int digitPosition = 1; maxNum / digitPosition > 0; digitPosition *= 10) {
        // Counting sort by current digit
        countingSortByDigit(arr, digitPosition);
    }
}

int main() {
    vector<int> arr = {170, 45, 75, 90, 2, 8, 25};
    radixSort(arr);
    // Print sorted array
    for (int num : arr) cout << num << " ";  // Output: 2 8 25 45 75 90 170
    return 0;
}`,

  c: `#include <stdio.h>

// ===== FIND MAXIMUM ELEMENT =====
int getMax(int arr[], int n) {
    int max = arr[0];  // Assume first element is maximum
    // Compare all elements to find actual maximum
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

// ===== COUNTING SORT BY DIGIT: Stable sort for single digit position =====
void countingSortByDigit(int arr[], int n, int digitPosition) {
    int output[n];  // Sorted output array
    int count[10] = {0};  // Count array for digits 0-9
    
    // Step 1: Count occurrences of each digit at this position
    for (int i = 0; i < n; i++) {
        // Extract digit at current position
        count[(arr[i] / digitPosition) % 10]++;
    }
    
    // Step 2: Convert count to cumulative positions
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Step 3: Place elements in output from right to left for stability
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / digitPosition) % 10;
        output[count[digit] - 1] = arr[i];  // Place at correct position
        count[digit]--;  // Adjust for next element with same digit
    }
    
    // Step 4: Copy sorted output back to original array
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}

// ===== MAIN RADIX SORT FUNCTION =====
void radixSort(int arr[], int n) {
    // Find maximum to determine number of digit positions
    int maxNum = getMax(arr, n);
    
    // Process each digit position (1, 10, 100, ...)
    for (int digitPosition = 1; maxNum / digitPosition > 0; digitPosition *= 10) {
        // Counting sort by current digit
        countingSortByDigit(arr, n, digitPosition);
    }
}

int main() {
    int arr[] = {170, 45, 75, 90, 2, 8, 25};
    int n = sizeof(arr) / sizeof(arr[0]);  // Calculate array length
    radixSort(arr, n);
    // Print sorted array
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);  // Output: 2 8 25 45 75 90 170
    return 0;
}`,

  csharp: `using System;
using System.Linq;

// ===== RADIX SORT IN C# =====
class RadixSort {
    // ===== COUNTING SORT BY DIGIT: Stable sort for one digit position =====
    static void CountingSortByDigit(int[] arr, int digitPosition) {
        int n = arr.Length;
        int[] output = new int[n];  // Sorted output array
        int[] count = new int[10];  // Count array for digits 0-9
        
        // Step 1: Count occurrences of each digit at this position
        for (int i = 0; i < n; i++) {
            // Extract digit: divide by position, mod 10 to isolate it
            count[(arr[i] / digitPosition) % 10]++;
        }
        
        // Step 2: Cumulative count - represents positions for each digit
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        // Step 3: Place elements in output from right to left for stability
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / digitPosition) % 10;
            output[count[digit] - 1] = arr[i];  // Place at correct position
            count[digit]--;  // Adjust for next element with same digit
        }
        
        // Step 4: Copy sorted output back to original array
        for (int i = 0; i < n; i++) {
            arr[i] = output[i];
        }
    }
    
    // ===== MAIN RADIX SORT FUNCTION =====
    static void Sort(int[] arr) {
        // Empty array is already sorted
        if (arr.Length == 0) return;
        
        // Find maximum number - determines number of digit positions
        int maxNum = arr.Max();
        
        // Process each digit position (1, 10, 100, ...)
        for (int digitPosition = 1; maxNum / digitPosition > 0; digitPosition *= 10) {
            // Counting sort by current digit
            CountingSortByDigit(arr, digitPosition);
        }
    }
    
    static void Main() {
        int[] arr = {170, 45, 75, 90, 2, 8, 25};
        Sort(arr);
        // Print sorted array with commas between values
        Console.WriteLine(string.Join(", ", arr));  // Output: 2, 8, 25, 45, 75, 90, 170
    }
}`,

  go: `package main
import (
    "fmt"
    "math"
)

// ===== FIND MAXIMUM ELEMENT IN SLICE =====
func getMax(arr []int) int {
    max := arr[0]  // Assume first element is maximum
    // Compare all elements
    for _, num := range arr {
        if num > max {
            max = num
        }
    }
    return max
}

// ===== COUNTING SORT BY DIGIT: Stable sort for one digit position =====
func countingSortByDigit(arr []int, digitPosition int) {
    n := len(arr)
    output := make([]int, n)  // Sorted output slice
    count := make([]int, 10)  // Count array for digits 0-9
    
    // Step 1: Count occurrences of each digit at this position
    for _, num := range arr {
        // Extract digit at current position
        digit := (num / digitPosition) % 10
        count[digit]++
    }
    
    // Step 2: Cumulative count - positions for each digit
    for i := 1; i < 10; i++ {
        count[i] += count[i-1]
    }
    
    // Step 3: Place elements from right to left for stability
    for i := n - 1; i >= 0; i-- {
        digit := (arr[i] / digitPosition) % 10
        output[count[digit]-1] = arr[i]  // Place at correct position
        count[digit]--  // Adjust for next element with same digit
    }
    
    // Step 4: Copy sorted output back to original slice
    copy(arr, output)
}

// ===== MAIN RADIX SORT FUNCTION =====
func radixSort(arr []int) {
    // Empty slice is already sorted
    if len(arr) == 0 {
        return
    }
    
    // Find maximum number - determines digit positions to process
    maxNum := getMax(arr)
    
    // Process each digit position (1, 10, 100, ...)
    for digitPosition := 1; maxNum/digitPosition > 0; digitPosition *= 10 {
        // Counting sort by current digit
        countingSortByDigit(arr, digitPosition)
    }
}

func main() {
    arr := []int{170, 45, 75, 90, 2, 8, 25}
    radixSort(arr)
    fmt.Println(arr)  // Output: [2 8 25 45 75 90 170]
}`,

  rust: `// ===== FIND MAXIMUM VALUE IN SLICE =====
fn get_max(arr: &[i32]) -> i32 {
    // Use iterator to find maximum - returns reference, dereference with *
    *arr.iter().max().unwrap_or(&0)
}

// ===== COUNTING SORT BY DIGIT: Stable sort for one digit position =====
fn counting_sort_by_digit(arr: &mut [i32], digit_position: i32) {
    let n = arr.len();
    let mut output = vec![0; n];  // Vector for sorted output
    let mut count = vec![0; 10];  // Vector for digit counts 0-9
    
    // Step 1: Count occurrences of each digit at this position
    for &num in arr.iter() {
        // Extract digit: divide by position, mod 10, cast to usize for indexing
        let digit = ((num / digit_position) % 10) as usize;
        count[digit] += 1;
    }
    
    // Step 2: Cumulative count - represents positions for each digit
    for i in 1..10 {
        count[i] += count[i - 1];
    }
    
    // Step 3: Place elements from right to left for stability
    // Rust: use .rev() to iterate backwards
    for i in (0..n).rev() {
        let digit = ((arr[i] / digit_position) % 10) as usize;
        output[count[digit] - 1] = arr[i];  // Place at correct position
        count[digit] -= 1;  // Adjust for next element
    }
    
    // Step 4: Copy sorted output back to original slice
    arr.copy_from_slice(&output);
}

// ===== MAIN RADIX SORT FUNCTION =====
fn radix_sort(arr: &mut [i32]) {
    // Empty slice is already sorted
    if arr.is_empty() {
        return;
    }
    
    // Find maximum number - determines digit positions to process
    let max_num = get_max(arr);
    
    // Process each digit position (1, 10, 100, ...)
    let mut digit_position = 1;
    while max_num / digit_position > 0 {
        // Counting sort by current digit
        counting_sort_by_digit(arr, digit_position);
        // Move to next digit position
        digit_position *= 10;
    }
}

fn main() {
    let mut arr = vec![170, 45, 75, 90, 2, 8, 25];
    radix_sort(&mut arr);
    // Print sorted array
    println!("{:?}", arr);  // Output: [2, 8, 25, 45, 75, 90, 170]
}`,
};
