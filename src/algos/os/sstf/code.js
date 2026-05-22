export const CODE_SNIPPETS = {
  javascript: `// ===== SSTF DISK SCHEDULING =====
function sstfDisk(requests, initial) {
  let current = initial, seq = [initial], totalSeek = 0;
  let pending = [...requests];
  
  while (pending.length > 0) {
    let idx = -1, minDist = Infinity;
    // Find request closest to current head position
    for (let i = 0; i < pending.length; i++) {
      let dist = Math.abs(pending[i] - current);
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    }
    totalSeek += minDist;
    current = pending[idx];
    seq.push(current);
    pending.splice(idx, 1);
  }
  return { sequence: seq, totalSeek };
}`,
  python: `# ===== SSTF DISK SCHEDULING =====
def sstf_disk(requests, initial):
    current = initial
    seq = [initial]
    total_seek = 0
    pending = list(requests)
    
    while pending:
        idx = -1
        min_dist = float('inf')
        for i in range(len(pending)):
            dist = abs(pending[i] - current)
            if dist < min_dist:
                min_dist = dist
                idx = i
        total_seek += min_dist
        current = pending.pop(idx)
        seq.append(current)
    return seq, total_seek`,
  java: `// ===== SSTF DISK SCHEDULING =====
import java.util.*;

public class SSTFDisk {
    public static int schedule(List<Integer> requests, int initial, List<Integer> sequence) {
        sequence.add(initial);
        int totalSeek = 0, current = initial;
        List<Integer> pending = new ArrayList<>(requests);
        
        while (!pending.isEmpty()) {
            int idx = -1, minDist = Integer.MAX_VALUE;
            for (int i = 0; i < pending.size(); i++) {
                int dist = Math.abs(pending.get(i) - current);
                if (dist < minDist) {
                    minDist = dist;
                    idx = i;
                }
            }
            totalSeek += minDist;
            current = pending.remove(idx);
            sequence.add(current);
        }
        return totalSeek;
    }
}`,
  cpp: `// ===== SSTF DISK SCHEDULING =====
#include <iostream>
#include <vector>
#include <cmath>
#include <climits>

int sstfDisk(const std::vector<int>& requests, int initial, std::vector<int>& sequence) {
    sequence.push_back(initial);
    int totalSeek = 0, current = initial;
    std::vector<int> pending = requests;
    
    while (!pending.empty()) {
        int idx = -1, minDist = INT_MAX;
        for (size_t i = 0; i < pending.size(); i++) {
            int dist = std::abs(pending[i] - current);
            if (dist < minDist) {
                minDist = dist;
                idx = i;
            }
        }
        totalSeek += minDist;
        current = pending[idx];
        sequence.push_back(current);
        pending.erase(pending.begin() + idx);
    }
    return totalSeek;
}`,
  c: `// ===== SSTF DISK SCHEDULING =====
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

int sstfDisk(int requests[], int numReqs, int initial, int sequence[]) {
    sequence[0] = initial;
    int totalSeek = 0, current = initial;
    bool served[100] = {false};
    
    for (int step = 0; step < numReqs; step++) {
        int idx = -1, minDist = INT_MAX;
        for (int i = 0; i < numReqs; i++) {
            if (!served[i]) {
                int dist = abs(requests[i] - current);
                if (dist < minDist) {
                    minDist = dist;
                    idx = i;
                }
            }
        }
        totalSeek += minDist;
        current = requests[idx];
        sequence[step + 1] = current;
        served[idx] = true;
    }
    return totalSeek;
}`,
  csharp: `// ===== SSTF DISK SCHEDULING =====
using System;
using System.Collections.Generic;

public class SSTFDisk {
    public static int Schedule(List<int> requests, int initial, out List<int> sequence) {
        sequence = new List<int> { initial };
        int totalSeek = 0, current = initial;
        List<int> pending = new List<int>(requests);
        
        while (pending.Count > 0) {
            int idx = -1, minDist = int.MaxValue;
            for (int i = 0; i < pending.Count; i++) {
                int dist = Math.Abs(pending[i] - current);
                if (dist < minDist) {
                    minDist = dist;
                    idx = i;
                }
            }
            totalSeek += minDist;
            current = pending[idx];
            sequence.Add(current);
            pending.RemoveAt(idx);
        }
        return totalSeek;
    }
}`,
  go: `// ===== SSTF DISK SCHEDULING =====
package main

import "math"

func SSTFDisk(requests []int, initial int) ([]int, int) {
	seq := []int{initial}
	totalSeek := 0
	current := initial
	pending := make([]int, len(requests))
	copy(pending, requests)
	
	for len(pending) > 0 {
		idx := -1
		minDist := math.MaxInt32
		for i, req := range pending {
			dist := int(math.Abs(float64(req - current)))
			if dist < minDist {
				minDist = dist
				idx = i
			}
		}
		totalSeek += minDist
		current = pending[idx]
		seq = append(seq, current)
		pending = append(pending[:idx], pending[idx+1:]...)
	}
	return seq, totalSeek
}`,
  rust: `// ===== SSTF DISK SCHEDULING =====
fn sstf_disk(requests: &[i32], initial: i32) -> (Vec<i32>, i32) {
    let mut seq = vec![initial];
    let mut total_seek = 0;
    let mut current = initial;
    let mut pending = requests.to_vec();
    
    while !pending.is_empty() {
        let mut idx = 0;
        let mut min_dist = i32::MAX;
        for i in 0..pending.len() {
            let dist = (pending[i] - current).abs();
            if dist < min_dist {
                min_dist = dist;
                idx = i;
            }
        }
        total_seek += min_dist;
        current = pending.remove(idx);
        seq.push(current);
    }
    (seq, total_seek)
}`
};
