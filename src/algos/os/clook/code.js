export const CODE_SNIPPETS = {
  javascript: `// ===== C-LOOK DISK SCHEDULING =====
function clookDisk(requests, initial) {
  let seq = [initial], totalSeek = 0, current = initial;
  let left = requests.filter(r => r < initial).sort((a,b) => a-b);
  let right = requests.filter(r => r >= initial).sort((a,b) => a-b);
  
  for (let r of right) {
    totalSeek += Math.abs(r - current);
    current = r;
    seq.push(current);
  }
  
  if (left.length > 0) {
    // Jump straight to the lowest request without servicing intermediate tracks
    for (let r of left) {
      totalSeek += Math.abs(r - current);
      current = r;
      seq.push(current);
    }
  }
  return { sequence: seq, totalSeek };
}`,
  python: `# ===== C-LOOK DISK SCHEDULING =====
def clook_disk(requests, initial):
    seq = [initial]
    total_seek = 0
    current = initial
    left = sorted([r for r in requests if r < initial])
    right = sorted([r for r in requests if r >= initial])
    
    for r in right:
        total_seek += abs(r - current)
        current = r
        seq.append(current)
    for r in left:
        total_seek += abs(r - current)
        current = r
        seq.append(current)
    return seq, total_seek`,
  java: `// ===== C-LOOK DISK SCHEDULING =====
import java.util.*;

public class CLOOKDisk {
    public static int schedule(List<Integer> requests, int initial, List<Integer> sequence) {
        sequence.add(initial);
        int totalSeek = 0, current = initial;
        List<Integer> left = new ArrayList<>();
        List<Integer> right = new ArrayList<>();
        
        for (int r : requests) {
            if (r < initial) left.add(r);
            else right.add(r);
        }
        Collections.sort(left);
        Collections.sort(right);
        
        for (int r : right) {
            totalSeek += Math.abs(r - current);
            current = r;
            sequence.add(current);
        }
        for (int r : left) {
            totalSeek += Math.abs(r - current);
            current = r;
            sequence.add(current);
        }
        return totalSeek;
    }
}`,
  cpp: `// ===== C-LOOK DISK SCHEDULING =====
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

int clookDisk(const std::vector<int>& requests, int initial, std::vector<int>& sequence) {
    sequence.push_back(initial);
    int totalSeek = 0, current = initial;
    std::vector<int> left, right;
    
    for (int r : requests) {
        if (r < initial) left.push_back(r);
        else right.push_back(r);
    }
    std::sort(left.begin(), left.end());
    std::sort(right.begin(), right.end());
    
    for (int r : right) {
        totalSeek += std::abs(r - current);
        current = r;
        sequence.push_back(current);
    }
    for (int r : left) {
        totalSeek += std::abs(r - current);
        current = r;
        sequence.push_back(current);
    }
    return totalSeek;
}`,
  c: `// ===== C-LOOK DISK SCHEDULING =====
#include <stdio.h>
#include <stdlib.h>

int compareAsc(const void* a, const void* b) { return *(int*)a - *(int*)b; }

int clookDisk(int requests[], int numReqs, int initial, int sequence[]) {
    int left[100], right[100], lCount = 0, rCount = 0;
    for (int i = 0; i < numReqs; i++) {
        if (requests[i] < initial) left[lCount++] = requests[i];
        else right[rCount++] = requests[i];
    }
    qsort(left, lCount, sizeof(int), compareAsc);
    qsort(right, rCount, sizeof(int), compareAsc);
    
    sequence[0] = initial;
    int totalSeek = 0, current = initial, step = 1;
    for (int i = 0; i < rCount; i++) {
        sequence[step++] = right[i];
        totalSeek += abs(right[i] - current);
        current = right[i];
    }
    for (int i = 0; i < lCount; i++) {
        sequence[step++] = left[i];
        totalSeek += abs(left[i] - current);
        current = left[i];
    }
    return totalSeek;
}`,
  csharp: `// ===== C-LOOK DISK SCHEDULING =====
using System;
using System.Collections.Generic;
using System.Linq;

public class CLOOKDisk {
    public static int Schedule(List<int> requests, int initial, out List<int> sequence) {
        sequence = new List<int> { initial };
        int totalSeek = 0, current = initial;
        var left = requests.Where(r => r < initial).OrderBy(r => r).ToList();
        var right = requests.Where(r => r >= initial).OrderBy(r => r).ToList();
        
        foreach (int r in right) {
            totalSeek += Math.Abs(r - current);
            current = r;
            sequence.Add(current);
        }
        foreach (int r in left) {
            totalSeek += Math.Abs(r - current);
            current = r;
            sequence.Add(current);
        }
        return totalSeek;
    }
}`,
  go: `// ===== C-LOOK DISK SCHEDULING =====
package main

import (
	"math"
	"sort"
)

func CLOOKDisk(requests []int, initial int) ([]int, int) {
	seq := []int{initial}
	totalSeek := 0
	current := initial
	var left, right []int
	for _, r := range requests {
		if r < initial {
			left = append(left, r)
		} else {
			right = append(right, r)
		}
	}
	sort.Ints(left)
	sort.Ints(right)
	
	for _, r := range right {
		totalSeek += int(math.Abs(float64(r - current)))
		current = r
		seq = append(seq, current)
	}
	for _, r := range left {
		totalSeek += int(math.Abs(float64(r - current)))
		current = r
		seq = append(seq, current)
	}
	return seq, totalSeek
}`,
  rust: `// ===== C-LOOK DISK SCHEDULING =====
fn clook_disk(requests: &[i32], initial: i32) -> (Vec<i32>, i32) {
    let mut seq = vec![initial];
    let mut total_seek = 0;
    let mut current = initial;
    let mut left: Vec<i32> = requests.iter().cloned().filter(|&r| r < initial).collect();
    let mut right: Vec<i32> = requests.iter().cloned().filter(|&r| r >= initial).collect();
    
    left.sort();
    right.sort();
    
    for r in right {
        total_seek += (r - current).abs();
        current = r;
        seq.push(current);
    }
    for r in left {
        total_seek += (r - current).abs();
        current = r;
        seq.push(current);
    }
    (seq, total_seek)
}`
};
